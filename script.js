document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v1";
    const SETTINGS_KEY = "shedjere-ui-settings-v1";
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);

    const themes = [
        { name: "default", labelKey: "themeDefault", color: "#e6e9ef" },
        { name: "dark", labelKey: "themeDark", color: "#121212" },
        { name: "sunset", labelKey: "themeWarm", color: "#f4ecd8" },
        { name: "forest", labelKey: "themeForest", color: "#e8f5e9" }
    ];

    const translations = {
        ru: {
            pageTitle: "Мое Шежере | Soft Heritage",
            tagline: "Семейная память в живом дереве",
            searchPlaceholder: "Найти человека...",
            exportPng: "Скачать PNG",
            createPerson: "Добавить человека",
            personNamePlaceholder: "Имя Фамилия",
            birthShort: "Рождение",
            deathShort: "Смерть",
            openProfile: "Открыть анкету",
            addRelation: "Добавить родство",
            parent: "Родитель",
            spouse: "Пара",
            child: "Ребенок",
            photoHint: "Нажми на фото, чтобы загрузить новое",
            profileTitle: "Информация о родственнике",
            fullNameLabel: "ФИО / полное имя",
            maidenNameLabel: "Девичья фамилия",
            birthDateLabel: "Дата рождения",
            deathDateLabel: "Дата смерти",
            isAlive: "Жив(а)",
            datePlaceholder: "дд.мм.гггг",
            birthPlaceLabel: "Место рождения",
            deathPlaceLabel: "Место смерти / погребения",
            educationLabel: "Образование",
            professionLabel: "Профессия",
            livingPlaceLabel: "Место жительства",
            burialLabel: "Информация о захоронении",
            bioLabel: "Биография и интересные факты",
            saveChanges: "Сохранить изменения",
            newPersonTitle: "Новый человек",
            orCreateNew: "или создай нового",
            newPersonPlaceholder: "Введите имя...",
            cancel: "Отмена",
            create: "Создать",
            founderTitle: "Основатель рода",
            addParentTitle: "Добавить родителя",
            addSpouseTitle: "Добавить супруга(у)",
            addChildTitle: "Добавить ребенка",
            saveError: "Не удалось сохранить данные. Возможно, фото слишком большое.",
            parentLimit: "У этого человека уже указаны оба родителя.",
            chooseSmallerPhoto: "Лучше выбрать фото до 750 КБ, иначе браузер может не сохранить дерево.",
            enterName: "Введите имя.",
            addFirstPerson: "Сначала добавь хотя бы одного человека.",
            exportFail: "Не получилось экспортировать PNG.",
            exporting: "Сохраняю...",
            aliveShort: "Жив(а)",
            noName: "Без имени",
            themeDefault: "Светлая",
            themeDark: "Темная",
            themeWarm: "Теплая",
            themeForest: "Лесная",
            locale: "ru"
        },
        uz: {
            pageTitle: "Mening Shejerem | Soft Heritage",
            tagline: "Oila xotirasi jonli daraxtda",
            searchPlaceholder: "Odamni qidirish...",
            exportPng: "PNG yuklab olish",
            createPerson: "Odam qo'shish",
            personNamePlaceholder: "Ism Familiya",
            birthShort: "Tug'ilgan",
            deathShort: "Vafot",
            openProfile: "Anketani ochish",
            addRelation: "Qarindoshlik qo'shish",
            parent: "Ota-ona",
            spouse: "Juft",
            child: "Farzand",
            photoHint: "Yangi surat yuklash uchun fotoni bosing",
            profileTitle: "Qarindosh haqida ma'lumot",
            fullNameLabel: "F.I.Sh. / to'liq ism",
            maidenNameLabel: "Qizlik familiyasi",
            birthDateLabel: "Tug'ilgan sana",
            deathDateLabel: "Vafot sanasi",
            isAlive: "Tirik",
            datePlaceholder: "kk.oo.yyyy",
            birthPlaceLabel: "Tug'ilgan joyi",
            deathPlaceLabel: "Vafot / dafn joyi",
            educationLabel: "Ta'lim",
            professionLabel: "Kasb",
            livingPlaceLabel: "Yashash joyi",
            burialLabel: "Dafn haqidagi ma'lumot",
            bioLabel: "Tarjimai hol va qiziqarli faktlar",
            saveChanges: "O'zgarishlarni saqlash",
            newPersonTitle: "Yangi odam",
            orCreateNew: "yoki yangisini yarating",
            newPersonPlaceholder: "Ism kiriting...",
            cancel: "Bekor qilish",
            create: "Yaratish",
            founderTitle: "Urug' asoschisi",
            addParentTitle: "Ota-onani qo'shish",
            addSpouseTitle: "Juftini qo'shish",
            addChildTitle: "Farzand qo'shish",
            saveError: "Ma'lumotni saqlab bo'lmadi. Surat juda katta bo'lishi mumkin.",
            parentLimit: "Bu odam uchun ikkala ota-ona allaqachon ko'rsatilgan.",
            chooseSmallerPhoto: "750 KB dan kichikroq surat tanlang, aks holda brauzer daraxtni saqlamasligi mumkin.",
            enterName: "Iltimos, ism kiriting.",
            addFirstPerson: "Avval kamida bitta odam qo'shing.",
            exportFail: "PNG eksport qilib bo'lmadi.",
            exporting: "Saqlanmoqda...",
            aliveShort: "Tirik",
            noName: "Nomsiz",
            themeDefault: "Yorug'",
            themeDark: "Tungi",
            themeWarm: "Issiq",
            themeForest: "Yashil",
            locale: "uz"
        },
        en: {
            pageTitle: "My Family Tree | Soft Heritage",
            tagline: "Family memory inside a living tree",
            searchPlaceholder: "Search for a person...",
            exportPng: "Download PNG",
            createPerson: "Add person",
            personNamePlaceholder: "Name Surname",
            birthShort: "Birth",
            deathShort: "Death",
            openProfile: "Open profile",
            addRelation: "Add relation",
            parent: "Parent",
            spouse: "Spouse",
            child: "Child",
            photoHint: "Tap the photo to upload a new one",
            profileTitle: "Relative information",
            fullNameLabel: "Full name",
            maidenNameLabel: "Maiden name",
            birthDateLabel: "Birth date",
            deathDateLabel: "Death date",
            isAlive: "Alive",
            datePlaceholder: "dd.mm.yyyy",
            birthPlaceLabel: "Place of birth",
            deathPlaceLabel: "Place of death / burial",
            educationLabel: "Education",
            professionLabel: "Profession",
            livingPlaceLabel: "Place of living",
            burialLabel: "Burial details",
            bioLabel: "Biography and notable facts",
            saveChanges: "Save changes",
            newPersonTitle: "New person",
            orCreateNew: "or create a new one",
            newPersonPlaceholder: "Enter a name...",
            cancel: "Cancel",
            create: "Create",
            founderTitle: "Family founder",
            addParentTitle: "Add parent",
            addSpouseTitle: "Add spouse",
            addChildTitle: "Add child",
            saveError: "Could not save the data. The photo may be too large.",
            parentLimit: "This person already has both parents connected.",
            chooseSmallerPhoto: "Use a photo smaller than 750 KB, otherwise the browser may fail to save the tree.",
            enterName: "Please enter a name.",
            addFirstPerson: "Add at least one person first.",
            exportFail: "PNG export failed.",
            exporting: "Exporting...",
            aliveShort: "Alive",
            noName: "No name",
            themeDefault: "Light",
            themeDark: "Dark",
            themeWarm: "Warm",
            themeForest: "Forest",
            locale: "en"
        }
    };

    const uzLocale = {
        weekdays: {
            shorthand: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
            longhand: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]
        },
        months: {
            shorthand: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
            longhand: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]
        },
        firstDayOfWeek: 1,
        rangeSeparator: " - ",
        weekAbbreviation: "Hafta",
        scrollTitle: "O'zgartirish uchun aylantiring",
        toggleTitle: "Almashtirish uchun bosing",
        amPM: ["AM", "PM"],
        yearAriaLabel: "Yil",
        monthAriaLabel: "Oy",
        hourAriaLabel: "Soat",
        minuteAriaLabel: "Daqiqa"
    };

    const languageLocales = {
        ru: () => (window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.ru) ? flatpickr.l10ns.ru : "default",
        uz: () => uzLocale,
        en: () => "default"
    };

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
    let currentTheme = "default";
    let currentLanguage = "ru";
    let currentModalTitleKey = "newPersonTitle";

    const birthPicker = initDatePicker("#fBirth");
    const deathPicker = initDatePicker("#fDeath");

    loadGraph();
    loadSettings();
    initThemePanels();
    initLanguageSwitcher();
    initSearch();
    initControls();
    initCamera();
    initProfileModal();
    applySettings();
    applyTranslations();
    render(true);

    function t(key) {
        return (translations[currentLanguage] && translations[currentLanguage][key]) || translations.ru[key] || key;
    }

    function initDatePicker(selector) {
        if (!window.flatpickr) {
            return {
                clear: () => {},
                set: () => {},
                open: () => {},
                _input: document.querySelector(selector)
            };
        }

        return flatpickr(selector, {
            dateFormat: "d.m.Y",
            allowInput: true,
            disableMobile: true,
            locale: languageLocales[currentLanguage](),
            prevArrow: "<span class='flatpickr-nav-arrow'>‹</span>",
            nextArrow: "<span class='flatpickr-nav-arrow'>›</span>"
        });
    }

    function saveGraph() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(graph.toJSON()));
        } catch (error) {
            showCustomAlert(t("saveError"));
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

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
            language: currentLanguage,
            theme: currentTheme
        }));
    }

    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
            if (settings.language && translations[settings.language]) currentLanguage = settings.language;
            if (settings.theme && themes.some(theme => theme.name === settings.theme)) currentTheme = settings.theme;
        } catch (error) {
            localStorage.removeItem(SETTINGS_KEY);
        }
    }

    function applySettings() {
        setTheme(currentTheme, false);
        updateLanguageButtons();
        updateThemeButtons();
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

    function initThemePanels() {
        renderThemePanel(getEl("themePanel"), false);
        renderThemePanel(getEl("mobileThemePanel"), true);
    }

    function renderThemePanel(container, compact) {
        if (!container) return;
        container.innerHTML = themes.map(theme => `
            <button
                class="theme-tile${compact ? " compact" : ""}"
                type="button"
                data-theme="${theme.name}"
                style="background-color:${theme.color}"
                title="${t(theme.labelKey)}"
                aria-label="${t(theme.labelKey)}"
            ></button>
        `).join("");

        container.addEventListener("click", (event) => {
            const tile = event.target.closest(".theme-tile");
            if (!tile) return;
            setTheme(tile.dataset.theme);
        });
    }

    function setTheme(themeName, persist = true) {
        currentTheme = themeName;
        if (themeName === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }
        updateThemeButtons();
        render(false);
        if (persist) saveSettings();
    }

    function updateThemeButtons() {
        document.querySelectorAll(".theme-tile").forEach(tile => {
            tile.classList.toggle("active", tile.dataset.theme === currentTheme);
        });
    }

    function initLanguageSwitcher() {
        const switcher = getEl("languageSwitcher");
        if (!switcher) return;
        switcher.addEventListener("click", (event) => {
            const button = event.target.closest(".segment-btn");
            if (!button) return;
            setLanguage(button.dataset.lang);
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLanguage = lang;
        document.documentElement.lang = lang;
        applyTranslations();
        updateDatePickerLocale();
        updateLanguageButtons();
        updateThemePanelsLabels();
        saveSettings();
    }

    function updateThemePanelsLabels() {
        document.querySelectorAll(".theme-tile").forEach(tile => {
            const theme = themes.find(item => item.name === tile.dataset.theme);
            if (!theme) return;
            const label = t(theme.labelKey);
            tile.title = label;
            tile.setAttribute("aria-label", label);
        });
    }

    function updateLanguageButtons() {
        document.querySelectorAll("#languageSwitcher .segment-btn").forEach(button => {
            button.classList.toggle("active", button.dataset.lang === currentLanguage);
        });
    }

    function updateDatePickerLocale() {
        const locale = languageLocales[currentLanguage]();
        [birthPicker, deathPicker].forEach(picker => {
            if (picker && typeof picker.set === "function") {
                picker.set("locale", locale);
            }
        });
    }

    function applyTranslations() {
        document.title = t("pageTitle");
        document.querySelectorAll("[data-i18n]").forEach(node => {
            node.textContent = t(node.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(node => {
            node.placeholder = t(node.dataset.i18nPlaceholder);
        });
        getEl("modalTitle").textContent = t(currentModalTitleKey);
        getEl("closePersonPanel").setAttribute("aria-label", t("cancel"));
        getEl("closeFullProfile").setAttribute("aria-label", t("cancel"));

        const focusId = graph.getFocus();
        if (focusId) {
            const person = graph.getPerson(focusId);
            if (person) {
                getEl("quickBirth").value = person.birthDate || "—";
                getEl("quickDeath").value = person.isAlive !== false && !person.deathDate ? t("aliveShort") : (person.deathDate || "—");
            }
        }
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
            currentModalTitleKey = "founderTitle";
            openRelationModal(currentModalTitleKey, id => {
                graph.setFocus(id);
                saveGraph();
                selectPerson(id, true);
            });
        });
        getEl("closePersonPanel").addEventListener("click", () => getEl("personPanel").classList.add("hidden"));
        getEl("zoomInBtn").addEventListener("click", () => setZoom(zoomLevel * 1.2));
        getEl("zoomOutBtn").addEventListener("click", () => setZoom(zoomLevel * 0.82));
        window.addEventListener("resize", () => render(false));

        document.querySelectorAll("[data-date-trigger]").forEach(button => {
            button.addEventListener("click", () => {
                const target = button.dataset.dateTrigger;
                if (target === "fBirth" && birthPicker && typeof birthPicker.open === "function") birthPicker.open();
                if (target === "fDeath" && deathPicker && typeof deathPicker.open === "function") deathPicker.open();
            });
        });
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
            person.name = event.target.value.trim() || t("noName");
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
        getEl("quickDeath").value = person.isAlive !== false && !person.deathDate ? t("aliveShort") : (person.deathDate || "—");

        getEl("addParent").onclick = () => {
            if (person.parents.size >= 2) {
                showCustomAlert(t("parentLimit"));
                return;
            }
            currentModalTitleKey = "addParentTitle";
            openRelationModal(currentModalTitleKey, relatedId => {
                if (graph.addParent(id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, id);
        };

        getEl("addSpouse").onclick = () => {
            currentModalTitleKey = "addSpouseTitle";
            openRelationModal(currentModalTitleKey, relatedId => {
                if (graph.addSpouse(id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, id);
        };

        getEl("addChild").onclick = () => {
            currentModalTitleKey = "addChildTitle";
            openRelationModal(currentModalTitleKey, relatedId => {
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
        const source = name || t("noName");
        return source.length > 20 ? `${source.slice(0, 19)}...` : source;
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
                showCustomAlert(t("chooseSmallerPhoto"));
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
            person.name = getEl("fName").value.trim() || t("noName");
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

    function openRelationModal(titleKey, action, currentId = null) {
        getEl("personPanel").classList.add("hidden");
        currentModalTitleKey = titleKey;
        getEl("modalTitle").textContent = t(titleKey);
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
                showCustomAlert(t("enterName"));
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
            showCustomAlert(t("addFirstPerson"));
            return;
        }

        const btn = getEl("exportBtn");
        const originalText = t("exportPng");
        btn.textContent = t("exporting");
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
                showCustomAlert(t("exportFail"));
                btn.textContent = originalText;
                btn.disabled = false;
            };
            image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
        } catch (error) {
            showCustomAlert(t("exportFail"));
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
