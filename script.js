document.addEventListener("DOMContentLoaded", () => {
    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    
    // ✅ ИСПРАВЛЕНО: Ищем правильный ID окна создания (profileModal)
    const modal = document.getElementById("profileModal"); 
    
    let translateX = window.innerWidth / 2, translateY = window.innerHeight / 2, zoomLevel = 0.8;
    let isDragging = false, sX, sY;

    const getEl = (id) => document.getElementById(id);

    // =========================================
    // 📅 ВОССТАНОВЛЕНИЕ КАЛЕНДАРЕЙ
    // =========================================
    const birthPicker = flatpickr("#fBirth", { dateFormat: "d.m.Y", locale: "ru", allowInput: true });
    const deathPicker = flatpickr("#fDeath", { dateFormat: "d.m.Y", locale: "ru", allowInput: true });

    // =========================================
    // 🔔 КАСТОМНЫЕ УВЕДОМЛЕНИЯ
    // =========================================
    function showCustomAlert(msg) {
        const toast = document.createElement("div");
        toast.className = "custom-toast";
        toast.textContent = msg;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =========================================
    // 🌈 КРУТАЯ ПАНЕЛЬ ТЕМ
    // =========================================
    function initThemePanel() {
        const exportBtn = getEl("exportBtn");
        if (!exportBtn) return;
    
        if (document.querySelector(".theme-panel-header")) return;
    
        const themePanel = document.createElement("div");
        themePanel.className = "theme-panel-header";
        
        const themes = [
            { name: 'default', color: '#ffffff' },
            { name: 'dark', color: '#121212' },
            { name: 'sunset', color: '#fdf0d5' },
            { name: 'forest', color: '#e8f5e9' }
        ];
        
        themePanel.innerHTML = themes.map(t => `
            <div class="theme-tile" 
                 data-theme="${t.name}" 
                 style="background-color: ${t.color};" 
                 title="Тема: ${t.name}">
            </div>
        `).join('');
        
        exportBtn.parentNode.insertBefore(themePanel, exportBtn);
    
        themePanel.addEventListener("click", (e) => {
            const tile = e.target.closest(".theme-tile");
            if (tile) {
                document.querySelectorAll(".theme-tile").forEach(el => el.classList.remove("active"));
                tile.classList.add("active");
                window.setTheme(tile.dataset.theme);
            }
        });
    }
    initThemePanel();

    function applyTheme(themeName) {
        if (themeName === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
        }
        render(false); 
    }

    window.setTheme = (themeName) => {
        if (!document.startViewTransition) {
            applyTheme(themeName);
            return;
        }

        const transition = document.startViewTransition(() => applyTheme(themeName));
        transition.ready.then(() => {
            document.documentElement.animate(
                [
                    { clipPath: 'circle(0% at 100% 0%)' },
                    { clipPath: 'circle(150% at 100% 0%)' }
                ],
                {
                    duration: 700,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        });
    };

    // =========================================
    // 🔍 ЛОГИКА ПОИСКА
    // =========================================
    const treeSearch = getEl("treeSearch");
    const searchResults = getEl("searchResults");

    if (treeSearch && searchResults) { 
        treeSearch.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 1) {
                searchResults.classList.add("hidden");
                return;
            }

            const matches = Array.from(graph.people.entries()).filter(([id, p]) =>
                p.name && p.name.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                searchResults.innerHTML = matches.map(([id, p]) => `
                    <div class="search-item" data-id="${id}">
                        ${p.name}
                    </div>
                `).join("");

                searchResults.classList.remove("hidden");
            } else {
                searchResults.classList.add("hidden");
            }
        };

        searchResults.onclick = (e) => {
            const item = e.target.closest(".search-item");
            if (item) {
                const id = item.dataset.id;
                treeSearch.value = "";
                searchResults.classList.add("hidden");
                selectPerson(id);
                render(true);
            }
        };

        window.addEventListener("click", (e) => {
            if (!e.target.closest(".search-container")) {
                searchResults.classList.add("hidden");
            }
        });
    }

    // =========================================
    // 📸 ЭКСПОРТ (PNG)
    // =========================================
    getEl("exportBtn").onclick = function() {
        const btn = this; btn.textContent = "⌛ Сохраняю..."; btn.disabled = true;
        const style = getComputedStyle(document.documentElement);
        const currentBg = style.getPropertyValue('--bg').trim() || "#e6e9ef";
        const currentText = style.getPropertyValue('--text').trim() || "#2d3047";
        const currentAccent = style.getPropertyValue('--accent').trim() || "#5542ff";

        const bbox = scene.getBBox();
        const padding = 60;
        const width = bbox.width + padding * 2;
        const height = bbox.height + padding * 2;

        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");

        const svgClone = svg.cloneNode(true);
        const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
        
        styleElement.textContent = `
            .link { fill: none; stroke: ${currentText}; stroke-width: 2.5; opacity: 0.3; }
            .spouse-link { fill: none; stroke: ${currentAccent}; stroke-width: 3; stroke-dasharray: 8,8; }
            .person-node circle { fill: #ffffff; stroke: ${currentAccent}; stroke-width: 1px; }
            .person-node text { font-family: 'Inter', sans-serif; font-weight: 900; fill: ${currentText}; font-size: 12px; }
            .person-node rect { fill: #ffffff; opacity: 0.9; }
        `;
        svgClone.insertBefore(styleElement, svgClone.firstChild);

        svgClone.setAttribute("width", width);
        svgClone.setAttribute("height", height);
        const sceneClone = svgClone.querySelector("#scene");
        sceneClone.setAttribute("transform", `translate(${-bbox.x + padding}, ${-bbox.y + padding})`);
        
        const svgData = new XMLSerializer().serializeToString(svgClone);
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));

        img.onload = () => {
            ctx.fillStyle = currentBg;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `Shedjere-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            btn.textContent = "📸 Скачать PNG"; btn.disabled = false;
        };
    };

    // =========================================
    // 👤 ВЫБОР ЧЕЛОВЕКА
    // =========================================
    function selectPerson(id) {
        if (!id) return;
        graph.setFocus(id);
        const p = graph.getPerson(id);
        
        getEl("personPanel").classList.remove("hidden");
        getEl("panelAvatar").src = p.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        getEl("personNameInput").value = p.name || "";
        getEl("quickBirth").value = p.birthDate || "—";
        getEl("quickDeath").value = (p.isAlive !== false && !p.deathDate) ? "Жив(а)" : (p.deathDate || "—");

        getEl("addParent").onclick = (e) => {
            e.stopPropagation();
            if (p.parents.size >= 2) return showCustomAlert("У этого человека уже указаны оба родителя!");
            openModal("Добавить родителя", rid => { graph.addParent(id, rid); render(true); });
        };

        getEl("addSpouse").onclick = (e) => {
            e.stopPropagation();
            if (p.spouses.size >= 1) return showCustomAlert("У этого человека уже указана пара!");
            openModal("Добавить супруга(у)", rid => { graph.addSpouse(id, rid); render(true); });
        };

        getEl("addChild").onclick = (e) => { 
            e.stopPropagation();
            openModal("Добавить ребенка", rid => { graph.addParent(rid, id); render(true); }); 
        };

        render(false);
    }

    // =========================================
    // 🌳 РЕНДЕР
    // =========================================
    function render(autoCenter) {
        scene.innerHTML = "";
        let focusId = graph.getFocus();
        
        if (!focusId && graph.people.size > 0) focusId = graph.people.keys().next().value;
        if (!focusId) return;

        const coords = {};
        const levels = {};
        const visited = new Set();
        const queue = [{ id: focusId, l: 0 }];

        while (queue.length > 0) {
            const { id, l } = queue.shift();
            if (visited.has(id)) continue;
            visited.add(id);
            if (!levels[l]) levels[l] = [];
            levels[l].push(id);
            const p = graph.getPerson(id);
            if (p) {
                p.parents.forEach(pid => queue.push({ id: pid, l: l - 1 }));
                p.children.forEach(cid => queue.push({ id: cid, l: l + 1 }));
                p.spouses.forEach(sid => queue.push({ id: sid, l }));
            }
        }

        Object.keys(levels).forEach(l => {
            levels[l].forEach((id, i) => {
                coords[id] = { x: i * 280 - (levels[l].length * 140 / 2), y: l * 220 };
            });
        });

        visited.forEach(id => {
            const p = graph.getPerson(id);
            const pos = coords[id];
            p.children.forEach(cid => {
                if (coords[cid]) {
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    line.setAttribute("d", `M ${pos.x} ${pos.y} C ${pos.x} ${pos.y + 100}, ${coords[cid].x} ${coords[cid].y - 100}, ${coords[cid].x} ${coords[cid].y}`);
                    line.setAttribute("class", "link");
                    scene.appendChild(line);
                }
            });
            p.spouses.forEach(sid => {
                if (coords[sid] && id < sid) { 
                    const midX = (pos.x + coords[sid].x) / 2;
                    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    line.setAttribute("d", `M ${pos.x} ${pos.y} Q ${midX} ${pos.y - 80} ${coords[sid].x} ${coords[sid].y}`);
                    line.setAttribute("class", "spouse-link");
                    line.style.cssText = "stroke: var(--accent); stroke-width: 3; stroke-dasharray: 8,8; fill: none;";
                    scene.appendChild(line);
                }
            });
        });

        visited.forEach(id => {
            const p = graph.getPerson(id);
            const pos = coords[id];
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", `person-node ${id === focusId ? "focused" : ""}`);
            g.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
            g.innerHTML = `
                <circle r="45" class="node-bg" fill="white" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))"/>
                <image href="${p.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" x="-40" y="-40" width="80" height="80" clip-path="circle(40px)"/>
                <rect x="-60" y="38" width="120" height="24" rx="12" fill="white" opacity="0.9"/>
                <text y="54" text-anchor="middle" font-size="12px" font-weight="900" fill="var(--text)">${p.name}</text>
            `;
            g.onclick = e => { e.stopPropagation(); selectPerson(id); };
            scene.appendChild(g);
        });

        if (autoCenter && coords[focusId]) {
            translateX = window.innerWidth / 2 - coords[focusId].x * zoomLevel;
            translateY = window.innerHeight / 2 - coords[focusId].y * zoomLevel;
        }
        updateTransform();
    }

    // =========================================
    // 📋 ПОЛНАЯ АНКЕТА
    // =========================================
    getEl("openFullProfileBtn").onclick = () => {
        const id = graph.getFocus();
        if (!id) return;
        const p = graph.getPerson(id);
        
        getEl("fName").value = p.name || "";
        getEl("fMaidenName").value = p.maidenName || "";
        getEl("modalAvatarPreview").src = p.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        
        getEl("fBirth").value = p.birthDate || "";
        getEl("fDeath").value = p.deathDate || "";
        
        getEl("fBirthPlace").value = p.birthPlace || "";
        getEl("fDeathPlace").value = p.deathPlace || "";
        getEl("fLiving").value = p.livingPlaces || "";
        getEl("fEdu").value = p.education || "";
        getEl("fProf").value = p.profession || "";
        getEl("fBurial").value = p.burialPlace || "";
        getEl("fBio").value = p.bio || "";

        const avatarPreview = getEl("modalAvatarPreview");
        const photoUpload = getEl("uploadPhoto"); 
        const avatarContainer = getEl("modalAvatarContainer");

        avatarPreview.src = p.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

        if (avatarContainer) {
            avatarContainer.onclick = () => {
                photoUpload.click();
            };
        }

        photoUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                const base64Photo = readerEvent.target.result;
                avatarPreview.src = base64Photo; 
                p.photo = base64Photo; 
            };
            reader.readAsDataURL(file);
        };

        const aliveToggle = getEl("fIsAlive");
        const deathInput = getEl("fDeath");
        aliveToggle.checked = p.isAlive !== false;
        
        if (aliveToggle.checked) {
            if(deathPicker._input) deathPicker._input.disabled = true;
            deathInput.style.opacity = "0.5";
        } else {
            if(deathPicker._input) deathPicker._input.disabled = false;
            deathInput.style.opacity = "1";
        }

        aliveToggle.onchange = (e) => {
            if (e.target.checked) {
                deathPicker.clear();
                if(deathPicker._input) deathPicker._input.disabled = true;
                deathInput.style.opacity = "0.5";
            } else {
                if(deathPicker._input) deathPicker._input.disabled = false;
                deathInput.style.opacity = "1";
            }
        };

        getEl("fullProfileModal").classList.remove("hidden");

        getEl("saveProfileBtn").onclick = (e) => {
            e.preventDefault();
            p.name = getEl("fName").value;
            p.maidenName = getEl("fMaidenName").value;
            p.birthDate = getEl("fBirth").value;
            p.isAlive = aliveToggle.checked;
            p.deathDate = p.isAlive ? "" : getEl("fDeath").value;
            p.birthPlace = getEl("fBirthPlace").value;
            p.deathPlace = getEl("fDeathPlace").value;
            p.livingPlaces = getEl("fLiving").value;
            p.education = getEl("fEdu").value;
            p.profession = getEl("fProf").value;
            p.burialPlace = getEl("fBurial").value;
            p.bio = getEl("fBio").value;

            getEl("fullProfileModal").classList.add("hidden");
            selectPerson(id);
            render(false);
        };
    };

    const closeBtn = getEl("closeFullProfile");
    if (closeBtn) {
        closeBtn.onclick = () => getEl("fullProfileModal").classList.add("hidden");
    }

    // =========================================
    // 🛠 МОДАЛКИ СОЗДАНИЯ РОДСТВЕННИКОВ
    // =========================================
    function openModal(title, action) {
        getEl("modalTitle").textContent = title;
        getEl("newPersonName").value = "";
        const list = getEl("existingList");
        list.innerHTML = "";

        graph.people.forEach((p, pId) => {
            const btn = document.createElement("button");
            btn.className = "glass-btn wide";
            btn.style.marginBottom = "10px";
            btn.textContent = p.name;
            btn.onclick = (e) => { e.stopPropagation(); action(pId); closeModal(); };
            list.appendChild(btn);
        });

        const submitBtn = getEl("submitModalBtn");
        submitBtn.onclick = (e) => {
            e.preventDefault();
            const name = getEl("newPersonName").value.trim();
            if (name) {
                const id = graph.createPerson({ name });
                action(id); 
                closeModal();
                selectPerson(id);
                render(true); 
            } else {
                showCustomAlert("Введите имя");
            }
        };
        if(modal) modal.classList.remove("hidden");
    }
    
    // ОДНА четкая функция закрытия
function closeModal() {
    const modal = document.getElementById("profileModal");
    if (modal) {
        modal.classList.add("hidden");
        // Очищаем поле ввода, чтобы при следующем открытии оно было пустым
        const input = document.getElementById("newPersonName");
        if (input) input.value = "";
    }
}

// Привязываем событие кнопке "Отмена"
const cancelBtn = document.getElementById("closeModalBtn");
if (cancelBtn) {
    cancelBtn.onclick = (e) => {
        e.preventDefault(); // Чтобы кнопка не пыталась отправить форму
        closeModal();
    };
}

// Также закрываем модалку, если кликнули МИМО карточки (по оверлею)
const modalOverlay = document.getElementById("profileModal");
if (modalOverlay) {
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    };
}
    
    // =========================================
    // 🖱 КАМЕРА И МЫШЬ
    // =========================================
    function updateTransform() { scene.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${zoomLevel})`); }
    svg.onwheel = e => { e.preventDefault(); zoomLevel *= e.deltaY < 0 ? 1.1 : 0.9; updateTransform(); };
    svg.onmousedown = e => { if (e.target.closest(".person-node")) return; isDragging = true; sX = e.clientX - translateX; sY = e.clientY - translateY; };
    window.onmousemove = e => { if (!isDragging) return; translateX = e.clientX - sX; translateY = e.clientY - sY; updateTransform(); };
    window.onmouseup = () => isDragging = false;

    getEl("createPersonBtn").onclick = () => openModal("Основатель рода", id => selectPerson(id));

    updateTransform();

    // =========================================
    // 📱 ТАЧ-УПРАВЛЕНИЕ (Для телефонов)
    // =========================================
    let lastTouchX = 0, lastTouchY = 0;

    svg.addEventListener('touchstart', e => {
        if (e.target.closest(".person-node")) return; // Если тапнули на человека - не таскаем холст
        
        // Обрабатываем только один палец для перемещения
        if (e.touches.length === 1) {
            isDragging = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }
    }, { passive: false });

    svg.addEventListener('touchmove', e => {
        if (!isDragging) return;
        
        if (e.touches.length === 1) {
            e.preventDefault(); // Запрещаем браузеру скроллить саму страницу
            
            const dx = e.touches[0].clientX - lastTouchX;
            const dy = e.touches[0].clientY - lastTouchY;
            
            translateX += dx;
            translateY += dy;
            
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
            
            updateTransform();
        }
    }, { passive: false });

    svg.addEventListener('touchend', () => isDragging = false);
});