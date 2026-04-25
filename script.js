document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v1";
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);

    let translateX = window.innerWidth / 2;
    let translateY = window.innerHeight / 2;
    let zoomLevel = window.innerWidth < 768 ? 0.72 : 0.8;
    let isDragging = false;
    let isMovingCamera = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let initialPinchDistance = null;
    let initialZoom = 1;

    const birthPicker = initDatePicker("#fBirth");
    const deathPicker = initDatePicker("#fDeath");

    loadGraph();
    initThemePanel();
    initSearch();
    initControls();
    initCamera();
    initProfileModal();

    render(true);

    function initDatePicker(selector) {
        if (window.flatpickr) {
            return flatpickr(selector, {
                dateFormat: "d.m.Y",
                locale: flatpickr.l10ns && flatpickr.l10ns.ru ? "ru" : "default",
                allowInput: true
            });
        }
        return { clear: () => {}, _input: document.querySelector(selector) };
    }

    function saveGraph() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(graph.toJSON()));
        } catch (error) {
            showCustomAlert("Не удалось сохранить данные. Возможно, фото слишком большое.");
        }
    }

    function loadGraph() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) graph.load(JSON.parse(saved));
        } catch (error) {
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    function closeAllUI() {
        ["personPanel", "profileModal", "fullProfileModal", "searchResults"].forEach(id => {
            const el = getEl(id);
            if (el) el.classList.add("hidden");
        });
    }

    function showCustomAlert(message) {
        const toast = document.createElement("div");
        toast.className = "custom-toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 250);
        }, 2600);
    }

    function initThemePanel() {
        const toolbar = document.querySelector(".toolbar");
        const exportBtn = getEl("exportBtn");
        if (!toolbar || !exportBtn || document.querySelector(".theme-panel-header")) return;

        const themePanel = document.createElement("div");
        themePanel.className = "theme-panel-header";
        const themes = [
            { name: "default", label: "Светлая", color: "#e6e9ef" },
            { name: "dark", label: "Темная", color: "#121212" },
            { name: "sunset", label: "Теплая", color: "#f4ecd8" },
            { name: "forest", label: "Лесная", color: "#e8f5e9" }
        ];

        themePanel.innerHTML = themes.map(theme => `
            <button class="theme-tile" type="button" data-theme="${theme.name}" style="background-color:${theme.color}" title="${theme.label}"></button>
        `).join("");
        toolbar.insertBefore(themePanel, exportBtn);

        themePanel.addEventListener("click", (event) => {
            const tile = event.target.closest(".theme-tile");
            if (!tile) return;
            document.querySelectorAll(".theme-tile").forEach(item => item.classList.remove("active"));
            tile.classList.add("active");
            setTheme(tile.dataset.theme);
        });
    }

    function setTheme(themeName) {
        if (themeName === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }
        render(false);
    }

    function initSearch() {
        const treeSearch = getEl("treeSearch");
        const searchResults = getEl("searchResults");
        if (!treeSearch || !searchResults) return;

        treeSearch.addEventListener("input", () => {
            const query = treeSearch.value.toLowerCase().trim();
            searchResults.innerHTML = "";

            if (!query) {
                searchResults.classList.add("hidden");
                return;
            }

            const matches = Array.from(graph.people.entries()).filter(([, person]) =>
                person.name.toLowerCase().includes(query)
            );

            if (!matches.length) {
                searchResults.classList.add("hidden");
                return;
            }

            matches.forEach(([id, person]) => {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "search-item";
                item.textContent = person.name;
                item.dataset.id = id;
                searchResults.appendChild(item);
            });
            searchResults.classList.remove("hidden");
        });

        searchResults.addEventListener("click", (event) => {
            const item = event.target.closest(".search-item");
            if (!item) return;
            treeSearch.value = "";
            searchResults.classList.add("hidden");
            selectPerson(item.dataset.id, true);
        });

        window.addEventListener("click", (event) => {
            if (!event.target.closest(".search-container")) {
                searchResults.classList.add("hidden");
            }
        });
    }

    function initControls() {
        getEl("exportBtn").addEventListener("click", exportPng);
        getEl("createPersonBtn").addEventListener("click", () => {
            openRelationModal("Основатель рода", id => {
                graph.setFocus(id);
                saveGraph();
                selectPerson(id, true);
            });
        });
        getEl("closePersonPanel").addEventListener("click", () => getEl("personPanel").classList.add("hidden"));
        getEl("zoomInBtn").addEventListener("click", () => setZoom(zoomLevel * 1.2));
        getEl("zoomOutBtn").addEventListener("click", () => setZoom(zoomLevel * 0.82));
        window.addEventListener("resize", () => render(false));
    }

    function initCamera() {
        svg.addEventListener("wheel", event => {
            event.preventDefault();
            setZoom(zoomLevel * (event.deltaY < 0 ? 1.1 : 0.9));
        }, { passive: false });

        svg.addEventListener("mousedown", event => {
            if (event.target.closest(".person-node")) return;
            isDragging = true;
            isMovingCamera = false;
            dragStartX = event.clientX - translateX;
            dragStartY = event.clientY - translateY;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
        });

        window.addEventListener("mousemove", event => {
            if (!isDragging) return;
            translateX = event.clientX - dragStartX;
            translateY = event.clientY - dragStartY;
            isMovingCamera = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 4;
            updateTransform();
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
            setTimeout(() => { isMovingCamera = false; }, 0);
        });

        svg.addEventListener("touchstart", event => {
            if (event.target.closest(".person-node")) return;

            if (event.touches.length === 1) {
                isDragging = true;
                isMovingCamera = false;
                lastTouchX = event.touches[0].clientX;
                lastTouchY = event.touches[0].clientY;
                pointerStartX = lastTouchX;
                pointerStartY = lastTouchY;
            } else if (event.touches.length === 2) {
                isDragging = false;
                initialPinchDistance = getPinchDistance(event.touches);
                initialZoom = zoomLevel;
            }
        }, { passive: false });

        svg.addEventListener("touchmove", event => {
            if ((event.touches.length === 1 && isDragging) || event.touches.length === 2) {
                event.preventDefault();
            }

            if (isDragging && event.touches.length === 1) {
                const touch = event.touches[0];
                translateX += touch.clientX - lastTouchX;
                translateY += touch.clientY - lastTouchY;
                isMovingCamera = Math.hypot(touch.clientX - pointerStartX, touch.clientY - pointerStartY) > 6;
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                updateTransform();
            } else if (event.touches.length === 2 && initialPinchDistance) {
                setZoom(initialZoom * (getPinchDistance(event.touches) / initialPinchDistance));
            }
        }, { passive: false });

        svg.addEventListener("touchend", event => {
            if (event.touches.length < 2) initialPinchDistance = null;
            if (event.touches.length === 0) {
                isDragging = false;
                setTimeout(() => { isMovingCamera = false; }, 0);
            }
        });
    }

    function initProfileModal() {
        getEl("closeFullProfile").addEventListener("click", () => getEl("fullProfileModal").classList.add("hidden"));
        getEl("closeModalBtn").addEventListener("click", closeRelationModal);

        getEl("profileModal").addEventListener("click", event => {
            if (event.target.id === "profileModal") closeRelationModal();
        });

        getEl("fullProfileModal").addEventListener("click", event => {
            if (event.target.id === "fullProfileModal") getEl("fullProfileModal").classList.add("hidden");
        });

        getEl("openFullProfileBtn").addEventListener("click", openFullProfile);

        getEl("personNameInput").addEventListener("change", event => {
            const person = graph.getPerson(graph.getFocus());
            if (!person) return;
            person.name = event.target.value.trim() || "Без имени";
            saveGraph();
            render(false);
        });
    }

    function getPinchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }

    function setZoom(value) {
        zoomLevel = Math.min(3, Math.max(0.25, value));
        updateTransform();
    }

    function updateTransform() {
        scene.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${zoomLevel})`);
    }

    function selectPerson(id, autoCenter = false) {
        if (!id) return;
        graph.setFocus(id);
        const person = graph.getPerson(id);
        if (!person) return;

        getEl("profileModal").classList.add("hidden");
        getEl("fullProfileModal").classList.add("hidden");
        getEl("searchResults").classList.add("hidden");

        getEl("personPanel").classList.remove("hidden");
        getEl("panelAvatar").src = person.photo || DEFAULT_AVATAR;
        getEl("personNameInput").value = person.name || "";
        getEl("quickBirth").value = person.birthDate || "—";
        getEl("quickDeath").value = person.isAlive !== false && !person.deathDate ? "Жив(а)" : (person.deathDate || "—");

        getEl("addParent").onclick = () => {
            if (person.parents.size >= 2) {
                showCustomAlert("У этого человека уже указаны оба родителя.");
                return;
            }
            openRelationModal("Добавить родителя", relatedId => {
                if (graph.addParent(id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, id);
        };

        getEl("addSpouse").onclick = () => {
            openRelationModal("Добавить супруга(у)", relatedId => {
                if (graph.addSpouse(id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, id);
        };

        getEl("addChild").onclick = () => {
            openRelationModal("Добавить ребенка", relatedId => {
                if (graph.addParent(relatedId, id)) {
                    saveGraph();
                    render(true);
                }
            }, id);
        };

        saveGraph();
        render(autoCenter);
    }

    function render(autoCenter) {
        scene.textContent = "";

        let focusId = graph.getFocus();
        if (!focusId && graph.people.size) {
            focusId = graph.people.keys().next().value;
            graph.setFocus(focusId);
        }

        if (!focusId) {
            updateTransform();
            return;
        }

        const coords = {};
        const levels = {};
        const visited = new Set();
        const queue = [{ id: focusId, level: 0 }];

        while (queue.length) {
            const { id, level } = queue.shift();
            if (visited.has(id)) continue;
            visited.add(id);
            if (!levels[level]) levels[level] = [];
            levels[level].push(id);

            const person = graph.getPerson(id);
            if (!person) continue;
            person.parents.forEach(parentId => queue.push({ id: parentId, level: level - 1 }));
            person.children.forEach(childId => queue.push({ id: childId, level: level + 1 }));
            person.spouses.forEach(spouseId => queue.push({ id: spouseId, level }));
        }

        const horizontalGap = window.innerWidth < 768 ? 210 : 280;
        const verticalGap = window.innerWidth < 768 ? 180 : 220;

        Object.keys(levels).forEach(level => {
            const people = levels[level];
            people.forEach((id, index) => {
                coords[id] = {
                    x: index * horizontalGap - ((people.length - 1) * horizontalGap) / 2,
                    y: Number(level) * verticalGap
                };
            });
        });

        visited.forEach(id => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;

            person.children.forEach(childId => {
                if (coords[childId]) drawPath(pos, coords[childId], "link");
            });

            person.spouses.forEach(spouseId => {
                if (coords[spouseId] && id < spouseId) drawSpousePath(pos, coords[spouseId]);
            });
        });

        visited.forEach(id => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;
            scene.appendChild(createNode(id, person, pos, id === focusId));
        });

        if (autoCenter && coords[focusId]) {
            translateX = window.innerWidth / 2 - coords[focusId].x * zoomLevel;
            translateY = window.innerHeight / 2 - coords[focusId].y * zoomLevel;
        }

        updateTransform();
    }

    function drawPath(from, to, className) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${from.x} ${from.y} C ${from.x} ${from.y + 90}, ${to.x} ${to.y - 90}, ${to.x} ${to.y}`);
        path.setAttribute("class", className);
        scene.appendChild(path);
    }

    function drawSpousePath(from, to) {
        const midX = (from.x + to.x) / 2;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${from.x} ${from.y} Q ${midX} ${from.y - 70} ${to.x} ${to.y}`);
        path.setAttribute("class", "spouse-link");
        scene.appendChild(path);
    }

    function createNode(id, person, pos, focused) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", `person-node${focused ? " focused" : ""}`);
        group.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
        group.dataset.id = id;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", "45");
        circle.setAttribute("class", "node-bg");

        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("href", person.photo || DEFAULT_AVATAR);
        image.setAttribute("x", "-40");
        image.setAttribute("y", "-40");
        image.setAttribute("width", "80");
        image.setAttribute("height", "80");
        image.setAttribute("clip-path", "circle(40px)");

        const labelBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        labelBg.setAttribute("x", "-70");
        labelBg.setAttribute("y", "38");
        labelBg.setAttribute("width", "140");
        labelBg.setAttribute("height", "28");
        labelBg.setAttribute("rx", "14");

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("y", "56");
        label.setAttribute("text-anchor", "middle");
        label.textContent = shortenName(person.name);

        group.append(circle, image, labelBg, label);
        group.addEventListener("click", event => {
            event.stopPropagation();
            if (!isMovingCamera) selectPerson(id);
        });
        return group;
    }

    function shortenName(name) {
        return (name || "Без имени").length > 20 ? `${name.slice(0, 19)}…` : name;
    }

    function openFullProfile() {
        const id = graph.getFocus();
        const person = graph.getPerson(id);
        if (!person) return;

        getEl("fName").value = person.name || "";
        getEl("fMaidenName").value = person.maidenName || "";
        getEl("modalAvatarPreview").src = person.photo || DEFAULT_AVATAR;
        getEl("fBirth").value = person.birthDate || "";
        getEl("fDeath").value = person.deathDate || "";
        getEl("fBirthPlace").value = person.birthPlace || "";
        getEl("fDeathPlace").value = person.deathPlace || "";
        getEl("fLiving").value = person.livingPlaces || "";
        getEl("fEdu").value = person.education || "";
        getEl("fProf").value = person.profession || "";
        getEl("fBurial").value = person.burialPlace || "";
        getEl("fBio").value = person.bio || "";

        const aliveToggle = getEl("fIsAlive");
        const deathInput = getEl("fDeath");
        aliveToggle.checked = person.isAlive !== false;
        updateDeathInput(aliveToggle.checked, deathInput);

        aliveToggle.onchange = () => {
            if (aliveToggle.checked) deathPicker.clear();
            updateDeathInput(aliveToggle.checked, deathInput);
        };

        const avatarPreview = getEl("modalAvatarPreview");
        const photoUpload = getEl("uploadPhoto");
        getEl("modalAvatarContainer").onclick = event => {
            if (!event.target.closest(".upload-badge")) photoUpload.click();
        };

        photoUpload.onchange = event => {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 750 * 1024) {
                showCustomAlert("Лучше выбрать фото до 750 КБ, иначе браузер может не сохранить дерево.");
            }
            const reader = new FileReader();
            reader.onload = readerEvent => {
                avatarPreview.src = readerEvent.target.result;
                person.photo = readerEvent.target.result;
                saveGraph();
                render(false);
            };
            reader.readAsDataURL(file);
        };

        getEl("saveProfileBtn").onclick = () => {
            person.name = getEl("fName").value.trim() || "Без имени";
            person.maidenName = getEl("fMaidenName").value.trim();
            person.birthDate = getEl("fBirth").value.trim();
            person.isAlive = aliveToggle.checked;
            person.deathDate = person.isAlive ? "" : getEl("fDeath").value.trim();
            person.birthPlace = getEl("fBirthPlace").value.trim();
            person.deathPlace = getEl("fDeathPlace").value.trim();
            person.livingPlaces = getEl("fLiving").value.trim();
            person.education = getEl("fEdu").value.trim();
            person.profession = getEl("fProf").value.trim();
            person.burialPlace = getEl("fBurial").value.trim();
            person.bio = getEl("fBio").value.trim();

            saveGraph();
            getEl("fullProfileModal").classList.add("hidden");
            selectPerson(id);
        };

        getEl("fullProfileModal").classList.remove("hidden");
    }

    function updateDeathInput(isAlive, deathInput) {
        deathInput.disabled = isAlive;
        deathInput.style.opacity = isAlive ? "0.5" : "1";
        if (deathPicker && deathPicker._input) deathPicker._input.disabled = isAlive;
    }

    function openRelationModal(title, action, currentId = null) {
        getEl("personPanel").classList.add("hidden");
        getEl("modalTitle").textContent = title;
        getEl("newPersonName").value = "";

        const list = getEl("existingList");
        list.textContent = "";

        graph.people.forEach((person, id) => {
            if (id === currentId) return;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "glass-btn wide";
            button.textContent = person.name;
            button.onclick = () => {
                action(id);
                closeRelationModal();
            };
            list.appendChild(button);
        });

        getEl("submitModalBtn").onclick = () => {
            const name = getEl("newPersonName").value.trim();
            if (!name) {
                showCustomAlert("Введите имя.");
                return;
            }
            const id = graph.createPerson({ name });
            action(id);
            closeRelationModal();
            selectPerson(id, true);
        };

        getEl("profileModal").classList.remove("hidden");
    }

    function closeRelationModal() {
        getEl("profileModal").classList.add("hidden");
        getEl("newPersonName").value = "";
    }

    function exportPng() {
        if (!graph.people.size) {
            showCustomAlert("Сначала добавь хотя бы одного человека.");
            return;
        }

        const btn = getEl("exportBtn");
        const originalText = btn.textContent;
        btn.textContent = "Сохраняю...";
        btn.disabled = true;

        try {
            const bbox = scene.getBBox();
            const padding = 70;
            const width = Math.max(320, Math.ceil(bbox.width + padding * 2));
            const height = Math.max(320, Math.ceil(bbox.height + padding * 2));
            const style = getComputedStyle(document.documentElement);
            const bg = style.getPropertyValue("--bg").trim() || "#e6e9ef";

            const svgClone = svg.cloneNode(true);
            svgClone.setAttribute("width", width);
            svgClone.setAttribute("height", height);
            svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svgClone.querySelector("#scene").setAttribute("transform", `translate(${-bbox.x + padding}, ${-bbox.y + padding})`);

            const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
            styleElement.textContent = getExportStyles();
            svgClone.insertBefore(styleElement, svgClone.firstChild);

            const svgData = new XMLSerializer().serializeToString(svgClone);
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = bg;
                ctx.fillRect(0, 0, width, height);
                ctx.drawImage(image, 0, 0);

                const link = document.createElement("a");
                link.download = `Shedjere-${Date.now()}.png`;
                link.href = canvas.toDataURL("image/png");
                link.click();
                btn.textContent = originalText;
                btn.disabled = false;
            };
            image.onerror = () => {
                showCustomAlert("Не получилось экспортировать PNG.");
                btn.textContent = originalText;
                btn.disabled = false;
            };
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        } catch (error) {
            showCustomAlert("Не получилось экспортировать PNG.");
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    function getExportStyles() {
        const style = getComputedStyle(document.documentElement);
        const text = style.getPropertyValue("--text").trim() || "#2d3047";
        const accent = style.getPropertyValue("--accent").trim() || "#5542ff";
        const card = style.getPropertyValue("--white").trim() || "#ffffff";

        return `
            .link { fill:none; stroke:${text}; stroke-width:2.5; opacity:.35; }
            .spouse-link { fill:none; stroke:${accent}; stroke-width:3; stroke-dasharray:8 8; }
            .person-node circle { fill:${card}; stroke:${accent}; stroke-width:1; }
            .person-node rect { fill:${card}; opacity:.92; }
            .person-node text { font-family:Inter, Arial, sans-serif; font-weight:900; fill:${text}; font-size:12px; }
        `;
    }
});