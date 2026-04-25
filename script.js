document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v1";
    const SETTINGS_KEY = "shedjere-ui-settings-v1";
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);

    const themes = [
        { name: "default", labelKey: "themeDefault", color: "#f1f2ec" },
        { name: "dark", labelKey: "themeDark", color: "#18201d" },
        { name: "sunset", labelKey: "themeWarm", color: "#f7eadf" },
        { name: "forest", labelKey: "themeForest", color: "#e3efe7" }
    ];

    const translations = {
        ru: {
            pageTitle: "Мое Шежере | Soft Heritage",
            brandKicker: "Family archive",
            tagline: "Семейная память в живом дереве",
            searchPlaceholder: "Найти человека...",
            exportPng: "Скачать PNG",
            createPerson: "Добавить человека",
            emptyKicker: "Family archive",
            emptyTitle: "Здесь появится ваше родословное дерево",
            emptyText: "Начните с одного человека, а потом спокойно добавляйте родителей, супругов и детей.",
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
            founderTitle: "Основатель рода",
            addParentTitle: "Добавить родителя",
            addSpouseTitle: "Добавить супруга(у)",
            addChildTitle: "Добавить ребенка",
            orCreateNew: "или создай нового",
            newPersonPlaceholder: "Введите имя...",
            cancel: "Отмена",
            create: "Создать",
            aliveShort: "Жив(а)",
            noName: "Без имени",
            yearsUnknown: "годы не указаны",
            summaryAlive: "Живой профиль. Здесь можно аккуратно собирать семейную историю.",
            summaryPast: "Архивный профиль. Здесь можно бережно хранить память о человеке.",
            saveError: "Не удалось сохранить данные. Возможно, фото слишком большое.",
            chooseSmallerPhoto: "Лучше выбрать фото до 750 КБ, иначе браузер может не сохранить дерево.",
            parentLimit: "У этого человека уже указаны оба родителя.",
            enterName: "Введите имя.",
            addFirstPerson: "Сначала добавь хотя бы одного человека.",
            exportFail: "Не получилось экспортировать PNG.",
            exporting: "Сохраняю...",
            themeDefault: "Светлая",
            themeDark: "Темная",
            themeWarm: "Теплая",
            themeForest: "Лесная"
        },
        uz: {
            pageTitle: "Mening Shejerem | Soft Heritage",
            brandKicker: "Family archive",
            tagline: "Oila xotirasi jonli daraxtda",
            searchPlaceholder: "Odamni qidirish...",
            exportPng: "PNG yuklab olish",
            createPerson: "Odam qo'shish",
            emptyKicker: "Family archive",
            emptyTitle: "Bu yerda sizning nasab daraxtingiz paydo bo'ladi",
            emptyText: "Avval bitta odam qo'shing, keyin asta-sekin ota-onalar, juftlar va farzandlarni kiriting.",
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
            fullNameLabel: "To'liq ism",
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
            burialLabel: "Dafn ma'lumoti",
            bioLabel: "Tarjimai hol va muhim faktlar",
            saveChanges: "Saqlash",
            newPersonTitle: "Yangi odam",
            founderTitle: "Urug' asoschisi",
            addParentTitle: "Ota-onani qo'shish",
            addSpouseTitle: "Juftini qo'shish",
            addChildTitle: "Farzand qo'shish",
            orCreateNew: "yoki yangisini yarating",
            newPersonPlaceholder: "Ism kiriting...",
            cancel: "Bekor qilish",
            create: "Yaratish",
            aliveShort: "Tirik",
            noName: "Nomsiz",
            yearsUnknown: "yillar ko'rsatilmagan",
            summaryAlive: "Tirik profil. Bu yerda oilaviy tarixni tartibli yig'ish mumkin.",
            summaryPast: "Arxiv profil. Bu yerda inson haqidagi xotirani ehtiyotkor saqlash mumkin.",
            saveError: "Ma'lumot saqlanmadi. Surat juda katta bo'lishi mumkin.",
            chooseSmallerPhoto: "750 KB dan kichikroq surat tanlang, aks holda brauzer daraxtni saqlamasligi mumkin.",
            parentLimit: "Bu odam uchun ikkala ota-ona allaqachon ko'rsatilgan.",
            enterName: "Iltimos, ism kiriting.",
            addFirstPerson: "Avval kamida bitta odam qo'shing.",
            exportFail: "PNG eksport qilib bo'lmadi.",
            exporting: "Saqlanmoqda...",
            themeDefault: "Yorug'",
            themeDark: "Tungi",
            themeWarm: "Issiq",
            themeForest: "Yashil"
        },
        en: {
            pageTitle: "My Family Tree | Soft Heritage",
            brandKicker: "Family archive",
            tagline: "Family memory inside a living tree",
            searchPlaceholder: "Search for a person...",
            exportPng: "Download PNG",
            createPerson: "Add person",
            emptyKicker: "Family archive",
            emptyTitle: "Your family tree will appear here",
            emptyText: "Start with one person, then calmly add parents, spouses and children.",
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
            founderTitle: "Family founder",
            addParentTitle: "Add parent",
            addSpouseTitle: "Add spouse",
            addChildTitle: "Add child",
            orCreateNew: "or create a new one",
            newPersonPlaceholder: "Enter a name...",
            cancel: "Cancel",
            create: "Create",
            aliveShort: "Alive",
            noName: "No name",
            yearsUnknown: "years unknown",
            summaryAlive: "Living profile. Family history can be collected here in a calm way.",
            summaryPast: "Archive profile. A person's memory can be preserved here carefully.",
            saveError: "Could not save the data. The photo may be too large.",
            chooseSmallerPhoto: "Use a photo smaller than 750 KB, otherwise the browser may fail to save the tree.",
            parentLimit: "This person already has both parents connected.",
            enterName: "Please enter a name.",
            addFirstPerson: "Add at least one person first.",
            exportFail: "PNG export failed.",
            exporting: "Exporting...",
            themeDefault: "Light",
            themeDark: "Dark",
            themeWarm: "Warm",
            themeForest: "Forest"
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

    const state = {
        language: "ru",
        theme: "default",
        currentModalTitleKey: "newPersonTitle"
    };

    let translateX = window.innerWidth / 2;
    let translateY = window.innerHeight / 2;
    let zoomLevel = window.innerWidth < 768 ? 0.84 : 0.9;
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
        return translations[state.language][key] || translations.ru[key] || key;
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
            locale: getCalendarLocale(),
            prevArrow: "<span class='flatpickr-nav-arrow'>&lsaquo;</span>",
            nextArrow: "<span class='flatpickr-nav-arrow'>&rsaquo;</span>"
        });
    }

    function getCalendarLocale() {
        if (state.language === "ru" && window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.ru) return flatpickr.l10ns.ru;
        if (state.language === "uz") return uzLocale;
        return "default";
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
            language: state.language,
            theme: state.theme
        }));
    }

    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
            if (settings.language && translations[settings.language]) state.language = settings.language;
            if (settings.theme && themes.some(theme => theme.name === settings.theme)) state.theme = settings.theme;
        } catch (error) {
            localStorage.removeItem(SETTINGS_KEY);
        }
    }

    function applySettings() {
        setTheme(state.theme, false);
        updateLanguageButtons();
        updateThemeButtons();
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
        state.theme = themeName;
        if (themeName === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }
        updateThemeButtons();
        if (persist) saveSettings();
    }

    function updateThemeButtons() {
        document.querySelectorAll(".theme-tile").forEach(tile => {
            tile.classList.toggle("active", tile.dataset.theme === state.theme);
        });
    }

    function updateThemeLabels() {
        document.querySelectorAll(".theme-tile").forEach(tile => {
            const theme = themes.find(item => item.name === tile.dataset.theme);
            if (!theme) return;
            tile.title = t(theme.labelKey);
            tile.setAttribute("aria-label", t(theme.labelKey));
        });
    }

    function initLanguageSwitcher() {
        getEl("languageSwitcher").addEventListener("click", (event) => {
            const button = event.target.closest(".segment-btn");
            if (!button) return;
            setLanguage(button.dataset.lang);
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        state.language = lang;
        document.documentElement.lang = lang;
        applyTranslations();
        [birthPicker, deathPicker].forEach(picker => {
            if (picker && typeof picker.set === "function") picker.set("locale", getCalendarLocale());
        });
        saveSettings();
    }

    function updateLanguageButtons() {
        document.querySelectorAll("#languageSwitcher .segment-btn").forEach(button => {
            button.classList.toggle("active", button.dataset.lang === state.language);
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
        getEl("modalTitle").textContent = t(state.currentModalTitleKey);
        updateLanguageButtons();
        updateThemeLabels();
        updateEmptyState();
        updateFocusPanel();
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

    function initSearch() {
        const treeSearch = getEl("treeSearch");
        const searchResults = getEl("searchResults");

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
            if (!event.target.closest(".search-container")) searchResults.classList.add("hidden");
        });
    }

    function initControls() {
        getEl("exportBtn").addEventListener("click", exportPng);
        getEl("createPersonBtn").addEventListener("click", () => {
            state.currentModalTitleKey = "founderTitle";
            openRelationModal(state.currentModalTitleKey, (id) => {
                graph.setFocus(id);
                saveGraph();
                selectPerson(id, true);
            });
        });
        getEl("emptyStateCreateBtn").addEventListener("click", () => getEl("createPersonBtn").click());
        getEl("closePersonPanel").addEventListener("click", () => getEl("personPanel").classList.add("hidden"));
        getEl("zoomInBtn").addEventListener("click", () => setZoom(zoomLevel * 1.15));
        getEl("zoomOutBtn").addEventListener("click", () => setZoom(zoomLevel * 0.85));

        document.querySelectorAll("[data-date-trigger]").forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.dateTrigger === "fBirth") birthPicker.open();
                if (button.dataset.dateTrigger === "fDeath") deathPicker.open();
            });
        });

        window.addEventListener("resize", () => render(false));
    }

    function initProfileModal() {
        getEl("closeFullProfile").addEventListener("click", () => getEl("fullProfileModal").classList.add("hidden"));
        getEl("closeModalBtn").addEventListener("click", closeRelationModal);
        getEl("profileModal").addEventListener("click", (event) => {
            if (event.target.id === "profileModal") closeRelationModal();
        });
        getEl("fullProfileModal").addEventListener("click", (event) => {
            if (event.target.id === "fullProfileModal") getEl("fullProfileModal").classList.add("hidden");
        });
        getEl("openFullProfileBtn").addEventListener("click", openFullProfile);

        getEl("personNameInput").addEventListener("change", (event) => {
            const person = graph.getPerson(graph.getFocus());
            if (!person) return;
            person.name = event.target.value.trim() || t("noName");
            saveGraph();
            render(false);
        });
    }

    function initCamera() {
        svg.addEventListener("wheel", (event) => {
            event.preventDefault();
            setZoom(zoomLevel * (event.deltaY < 0 ? 1.1 : 0.9));
        }, { passive: false });

        svg.addEventListener("mousedown", (event) => {
            if (event.target.closest(".person-node")) return;
            isDragging = true;
            isMovingCamera = false;
            dragStartX = event.clientX - translateX;
            dragStartY = event.clientY - translateY;
            pointerStartX = event.clientX;
            pointerStartY = event.clientY;
        });

        window.addEventListener("mousemove", (event) => {
            if (!isDragging) return;
            translateX = event.clientX - dragStartX;
            translateY = event.clientY - dragStartY;
            isMovingCamera = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 5;
            updateTransform();
        });

        window.addEventListener("mouseup", () => {
            isDragging = false;
            setTimeout(() => { isMovingCamera = false; }, 0);
        });

        svg.addEventListener("touchstart", (event) => {
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

        svg.addEventListener("touchmove", (event) => {
            if ((event.touches.length === 1 && isDragging) || event.touches.length === 2) event.preventDefault();

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

        svg.addEventListener("touchend", (event) => {
            if (event.touches.length < 2) initialPinchDistance = null;
            if (event.touches.length === 0) {
                isDragging = false;
                setTimeout(() => { isMovingCamera = false; }, 0);
            }
        });
    }

    function getPinchDistance(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }

    function setZoom(value) {
        zoomLevel = Math.min(2.8, Math.max(0.25, value));
        updateTransform();
    }

    function updateTransform() {
        scene.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${zoomLevel})`);
    }

    function updateEmptyState() {
        const isEmpty = graph.people.size === 0;
        getEl("emptyState").classList.toggle("hidden", !isEmpty);
        if (isEmpty) getEl("personPanel").classList.add("hidden");
    }

    function selectPerson(id, autoCenter = false) {
        if (!id) return;
        graph.setFocus(id);
        updateFocusPanel();
        render(autoCenter);
    }

    function updateFocusPanel() {
        const person = graph.getPerson(graph.getFocus());
        if (!person) {
            getEl("personPanel").classList.add("hidden");
            return;
        }

        getEl("personPanel").classList.remove("hidden");
        getEl("panelAvatar").src = person.photo || DEFAULT_AVATAR;
        getEl("personNameInput").value = person.name || "";
        getEl("quickBirth").value = person.birthDate || "—";
        getEl("quickDeath").value = person.isAlive !== false && !person.deathDate ? t("aliveShort") : (person.deathDate || "—");
        getEl("focusSummary").textContent = person.isAlive ? t("summaryAlive") : t("summaryPast");

        getEl("addParent").onclick = () => {
            if (person.parents.size >= 2) {
                showCustomAlert(t("parentLimit"));
                return;
            }
            state.currentModalTitleKey = "addParentTitle";
            openRelationModal(state.currentModalTitleKey, (relatedId) => {
                if (graph.addParent(person.id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, person.id);
        };

        getEl("addSpouse").onclick = () => {
            state.currentModalTitleKey = "addSpouseTitle";
            openRelationModal(state.currentModalTitleKey, (relatedId) => {
                if (graph.addSpouse(person.id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, person.id);
        };

        getEl("addChild").onclick = () => {
            state.currentModalTitleKey = "addChildTitle";
            openRelationModal(state.currentModalTitleKey, (relatedId) => {
                if (graph.addParent(relatedId, person.id)) {
                    saveGraph();
                    render(true);
                }
            }, person.id);
        };
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
            updateEmptyState();
            return;
        }

        const { visibleIds, coords } = buildVisibleLayout(focusId);

        visibleIds.forEach((id) => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;

            person.children.forEach((childId) => {
                if (visibleIds.has(childId) && coords[childId]) drawParentLink(pos, coords[childId]);
            });

            person.spouses.forEach((spouseId) => {
                if (visibleIds.has(spouseId) && coords[spouseId] && id < spouseId) drawSpouseLink(pos, coords[spouseId]);
            });
        });

        visibleIds.forEach((id) => {
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
        updateEmptyState();
    }

    function buildVisibleLayout(focusId) {
        const visibleIds = new Set();
        const coords = {};
        const levels = {};
        const queue = [{ id: focusId, level: 0 }];
        const visited = new Set();

        while (queue.length) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            const person = graph.getPerson(current.id);
            if (!person) continue;

            visibleIds.add(current.id);
            if (!levels[current.level]) levels[current.level] = [];
            levels[current.level].push(current.id);

            person.parents.forEach((parentId) => queue.push({ id: parentId, level: current.level - 1 }));
            person.children.forEach((childId) => queue.push({ id: childId, level: current.level + 1 }));
            person.spouses.forEach((spouseId) => queue.push({ id: spouseId, level: current.level }));
        }

        const horizontalGap = window.innerWidth < 768 ? 230 : 290;
        const verticalGap = window.innerWidth < 768 ? 180 : 210;

        Object.keys(levels).forEach((levelKey) => {
            const ids = levels[levelKey];
            ids.forEach((id, index) => {
                coords[id] = {
                    x: index * horizontalGap - ((ids.length - 1) * horizontalGap) / 2,
                    y: Number(levelKey) * verticalGap
                };
            });
        });

        return { visibleIds, coords };
    }

    function drawParentLink(from, to) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${from.x} ${from.y + 34} C ${from.x} ${from.y + 95}, ${to.x} ${to.y - 95}, ${to.x} ${to.y - 34}`);
        path.setAttribute("class", "link");
        scene.appendChild(path);
    }

    function drawSpouseLink(from, to) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midX = (from.x + to.x) / 2;
        path.setAttribute("d", `M ${from.x + 84} ${from.y - 54} Q ${midX} ${from.y - 88} ${to.x - 84} ${to.y - 54}`);
        path.setAttribute("class", "spouse-link");
        scene.appendChild(path);
    }

    function createNode(id, person, pos, focused) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", `person-node${focused ? " focused" : ""}`);
        group.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);

        const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        card.setAttribute("x", "-92");
        card.setAttribute("y", "-62");
        card.setAttribute("width", "184");
        card.setAttribute("height", "124");
        card.setAttribute("rx", "24");
        card.setAttribute("class", "node-card");

        const photoRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        photoRing.setAttribute("cx", "0");
        photoRing.setAttribute("cy", "-20");
        photoRing.setAttribute("r", "31");
        photoRing.setAttribute("class", "node-photo-ring");

        const photo = document.createElementNS("http://www.w3.org/2000/svg", "image");
        photo.setAttribute("href", person.photo || DEFAULT_AVATAR);
        photo.setAttribute("x", "-28");
        photo.setAttribute("y", "-48");
        photo.setAttribute("width", "56");
        photo.setAttribute("height", "56");
        photo.setAttribute("clip-path", "circle(28px at 28px 28px)");

        const name = createText(0, 24, "node-name", shortenText(person.name || t("noName"), 22));
        const years = createText(0, 46, "node-meta", getYearsLabel(person));

        group.append(card, photoRing, photo, name, years);
        group.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!isMovingCamera) selectPerson(id, true);
        });
        return group;
    }

    function createText(x, y, className, text) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", "text");
        node.setAttribute("x", String(x));
        node.setAttribute("y", String(y));
        node.setAttribute("text-anchor", "middle");
        node.setAttribute("class", className);
        node.textContent = text;
        return node;
    }

    function shortenText(text, maxLength) {
        return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
    }

    function getYearsLabel(person) {
        if (!person.birthDate && !person.deathDate) return t("yearsUnknown");
        return `${person.birthDate || "?"} - ${person.isAlive ? "..." : (person.deathDate || "?")}`;
    }

    function openRelationModal(titleKey, action, currentId = null) {
        state.currentModalTitleKey = titleKey;
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
            saveGraph();
            closeRelationModal();
            selectPerson(id, true);
        };

        getEl("profileModal").classList.remove("hidden");
    }

    function closeRelationModal() {
        getEl("profileModal").classList.add("hidden");
        getEl("newPersonName").value = "";
    }

    function openFullProfile() {
        const person = graph.getPerson(graph.getFocus());
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

        const photoUpload = getEl("uploadPhoto");
        getEl("modalAvatarContainer").onclick = (event) => {
            if (!event.target.closest(".upload-badge")) photoUpload.click();
        };

        photoUpload.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 750 * 1024) showCustomAlert(t("chooseSmallerPhoto"));
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                getEl("modalAvatarPreview").src = readerEvent.target.result;
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
            selectPerson(person.id);
        };

        getEl("fullProfileModal").classList.remove("hidden");
    }

    function updateDeathInput(isAlive, deathInput) {
        deathInput.disabled = isAlive;
        deathInput.style.opacity = isAlive ? "0.5" : "1";
        if (deathPicker && deathPicker._input) deathPicker._input.disabled = isAlive;
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
            const padding = 80;
            const width = Math.max(360, Math.ceil(bbox.width + padding * 2));
            const height = Math.max(360, Math.ceil(bbox.height + padding * 2));
            const style = getComputedStyle(document.documentElement);
            const bg = style.getPropertyValue("--bg").trim() || "#f1f2ec";

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
        const bg = style.getPropertyValue("--card").trim() || "#ffffff";
        const text = style.getPropertyValue("--text").trim() || "#223127";
        const line = style.getPropertyValue("--line").trim() || "rgba(34,49,39,0.16)";
        const accent = style.getPropertyValue("--accent").trim() || "#2c7a52";

        return `
            .link { fill:none; stroke:${line}; stroke-width:2.5; opacity:0.8; }
            .spouse-link { fill:none; stroke:${accent}; stroke-width:3; stroke-dasharray:8 8; opacity:0.8; }
            .node-card { fill:${bg}; stroke:${line}; stroke-width:1; }
            .node-photo-ring { fill:${bg}; stroke:${accent}; stroke-width:3; }
            .node-name { fill:${text}; font-family:Sora, Arial, sans-serif; font-weight:800; font-size:13px; }
            .node-meta { fill:${text}; opacity:0.72; font-family:Sora, Arial, sans-serif; font-weight:600; font-size:11px; }
        `;
    }
});
