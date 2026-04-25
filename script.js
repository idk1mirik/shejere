document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v2";
    const SETTINGS_KEY = "shedjere-ui-settings-v2";
    const SESSION_MODE_KEY = "shedjere-session-mode";
    const VIEWER_GUIDE_KEY = "shedjere-viewer-guide-seen-v1";
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const ACCESS_CODES = {
        admin: "mir67",
        viewer: "guests123"
    };

    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);

    const themes = [
        { name: "default", labelKey: "themeDefault", color: "#eef1e8" },
        { name: "dark", labelKey: "themeDark", color: "#151d1a" },
        { name: "sunset", labelKey: "themeWarm", color: "#f5e8db" },
        { name: "forest", labelKey: "themeForest", color: "#e3eee5" }
    ];

    const translations = {
        ru: {
            pageTitle: "Моё Шежере | Soft Heritage",
            brandKicker: "Family archive",
            tagline: "Семейная память в живом дереве",
            searchPlaceholder: "Найти человека...",
            exportPng: "Скачать PNG",
            createPerson: "Добавить человека",
            emptyKicker: "Family archive",
            emptyTitle: "Здесь появится ваше родословное дерево",
            emptyText: "Начните с одного человека, а потом спокойно добавляйте родителей, супругов и детей.",
            focusTree: "Показать центр дерева",
            personNamePlaceholder: "Имя Фамилия",
            birthShort: "Рождение",
            deathShort: "Смерть",
            openProfile: "Открыть анкету",
            addRelation: "Добавить родство",
            parent: "Родитель",
            spouse: "Пара",
            child: "Ребенок",
            photoHint: "Нажми на фото, чтобы загрузить новое",
            photoHintViewer: "Открыт режим просмотра. Изменение фото отключено.",
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
            close: "Закрыть",
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
            storyPlaceholder: "Здесь можно хранить семейную историю, характерные факты и память о человеке.",
            lifeHighlights: "Коротко",
            saveError: "Не удалось сохранить данные. Возможно, фото слишком большое.",
            chooseSmallerPhoto: "Лучше выбрать фото до 750 КБ, иначе браузер может не сохранить дерево.",
            parentLimit: "У этого человека уже указаны оба родителя.",
            enterName: "Введи имя.",
            addFirstPerson: "Сначала добавь хотя бы одного человека.",
            exportFail: "Не получилось экспортировать PNG.",
            exporting: "Сохраняю...",
            themeDefault: "Светлая",
            themeDark: "Темная",
            themeWarm: "Теплая",
            themeForest: "Лесная",
            accessKicker: "Family archive",
            accessTitle: "Вход в семейное дерево",
            accessText: "Введите код, чтобы открыть режим редактирования или гостевой просмотр.",
            accessLabel: "Код доступа",
            accessPlaceholder: "Введите код",
            unlock: "Открыть",
            enterAdmin: "Войти как админ",
            enterViewer: "Войти как гость",
            accessHint: "Подсказка: позже это можно заменить на настоящую авторизацию с сервером.",
            accessDenied: "Неверный код доступа.",
            accessAdminReady: "Режим администратора активирован.",
            accessViewerReady: "Гостевой режим активирован.",
            switchMode: "Сменить режим",
            modeLabel: "Режим",
            treeLabel: "Дерево",
            tipLabel: "Подсказка",
            tipAdmin: "Админ может редактировать карточки и связи",
            tipViewer: "Гости могут смотреть без редактирования",
            viewerMode: "Только просмотр",
            adminMode: "Админ",
            treeStatsLabel: "чел.",
            readonlyToast: "Этот раздел доступен только в режиме администратора.",
            treeCount: "человек",
            treeCountMany: "человек",
            unlockNeeded: "Сначала войди по коду доступа.",
            profileReadonly: "Открыт просмотр анкеты. Поля заблокированы.",
            bornLabel: "Родился(ась)",
            diedLabel: "Ушел(а)",
            roleAdmin: "ADMIN",
            roleViewer: "VIEWER",
            openTreeMode: "К дереву",
            howItWorks: "Как это работает",
            backToMenu: "Меню",
            viewerGuideTitle: "Как смотреть дерево",
            viewerGuideText: "Здесь открыт безопасный режим просмотра для родственников без редактирования.",
            viewerGuidePoint1: "Нажмите на карточку человека, чтобы открыть профиль и историю.",
            viewerGuidePoint2: "Кнопка «К дереву» на телефоне прячет верхнюю панель и оставляет чистый просмотр.",
            viewerGuidePoint3: "Можно искать людей, менять язык, тему и масштаб, не боясь что-то испортить.",
            viewerGuideCta: "Понятно"
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
            focusTree: "Daraxt markazini ko'rsatish",
            personNamePlaceholder: "Ism Familiya",
            birthShort: "Tug'ilgan",
            deathShort: "Vafot",
            openProfile: "Anketani ochish",
            addRelation: "Qarindoshlik qo'shish",
            parent: "Ota-ona",
            spouse: "Juft",
            child: "Farzand",
            photoHint: "Yangi surat yuklash uchun fotoni bosing",
            photoHintViewer: "Ko'rish rejimi ochiq. Suratni o'zgartirish o'chirilgan.",
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
            close: "Yopish",
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
            storyPlaceholder: "Bu yerda oilaviy hikoya, muhim faktlar va xotiralarni yozish mumkin.",
            lifeHighlights: "Qisqacha",
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
            themeForest: "Yashil",
            accessKicker: "Family archive",
            accessTitle: "Nasab daraxtiga kirish",
            accessText: "Tahrirlash yoki mehmon ko'rish rejimini ochish uchun kod kiriting.",
            accessLabel: "Kirish kodi",
            accessPlaceholder: "Kod kiriting",
            unlock: "Ochish",
            enterAdmin: "Admin sifatida kirish",
            enterViewer: "Mehmon sifatida kirish",
            accessHint: "Keyinroq buni serverdagi haqiqiy avtorizatsiyaga almashtirish mumkin.",
            accessDenied: "Kirish kodi noto'g'ri.",
            accessAdminReady: "Administrator rejimi yoqildi.",
            accessViewerReady: "Mehmon rejimi yoqildi.",
            switchMode: "Rejimni almashtirish",
            modeLabel: "Rejim",
            treeLabel: "Daraxt",
            tipLabel: "Maslahat",
            tipAdmin: "Admin kartochka va bog'lanishlarni tahrirlay oladi",
            tipViewer: "Mehmonlar faqat ko'rishi mumkin",
            viewerMode: "Faqat ko'rish",
            adminMode: "Admin",
            treeStatsLabel: "odam",
            readonlyToast: "Bu bo'lim faqat administrator rejimida ochiladi.",
            treeCount: "odam",
            treeCountMany: "odam",
            unlockNeeded: "Avval kirish kodi bilan tizimga kiring.",
            profileReadonly: "Anketa ko'rish rejimida ochildi. Maydonlar bloklangan.",
            bornLabel: "Tug'ilgan",
            diedLabel: "Vafot etgan",
            roleAdmin: "ADMIN",
            roleViewer: "VIEWER",
            openTreeMode: "Daraxtga",
            howItWorks: "Qanday ishlaydi",
            backToMenu: "Menyu",
            viewerGuideTitle: "Daraxtni qanday ko'rish kerak",
            viewerGuideText: "Bu yerda qarindoshlar uchun tahrirsiz xavfsiz ko'rish rejimi ochilgan.",
            viewerGuidePoint1: "Kartochkani bosing, profil va hikoyani ochasiz.",
            viewerGuidePoint2: "Telefonda «Daraxtga» tugmasi yuqori panelni yashirib, toza ko'rinish qoldiradi.",
            viewerGuidePoint3: "Odamlarni qidirish, tilni, mavzuni va masshtabni xavfsiz o'zgartirish mumkin.",
            viewerGuideCta: "Tushunarli"
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
            focusTree: "Center the tree",
            personNamePlaceholder: "Name Surname",
            birthShort: "Birth",
            deathShort: "Death",
            openProfile: "Open profile",
            addRelation: "Add relation",
            parent: "Parent",
            spouse: "Spouse",
            child: "Child",
            photoHint: "Tap the photo to upload a new one",
            photoHintViewer: "Viewer mode is active. Photo editing is disabled.",
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
            close: "Close",
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
            storyPlaceholder: "Use this area for family history, notable facts and memories about the person.",
            lifeHighlights: "Highlights",
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
            themeForest: "Forest",
            accessKicker: "Family archive",
            accessTitle: "Enter the family tree",
            accessText: "Enter a code to open editing mode or guest viewing.",
            accessLabel: "Access code",
            accessPlaceholder: "Enter code",
            unlock: "Unlock",
            enterAdmin: "Enter as admin",
            enterViewer: "Enter as guest",
            accessHint: "Later this can be replaced with real server-side authentication.",
            accessDenied: "Invalid access code.",
            accessAdminReady: "Administrator mode enabled.",
            accessViewerReady: "Viewer mode enabled.",
            switchMode: "Switch mode",
            modeLabel: "Mode",
            treeLabel: "Tree",
            tipLabel: "Tip",
            tipAdmin: "Admin can edit cards and relationships",
            tipViewer: "Guests can browse without editing",
            viewerMode: "Read only",
            adminMode: "Admin",
            treeStatsLabel: "people",
            readonlyToast: "This section is available only in administrator mode.",
            treeCount: "person",
            treeCountMany: "people",
            unlockNeeded: "First unlock the site with an access code.",
            profileReadonly: "Profile is open in read-only mode. Fields are locked.",
            bornLabel: "Born",
            diedLabel: "Passed",
            roleAdmin: "ADMIN",
            roleViewer: "VIEWER",
            openTreeMode: "To tree",
            howItWorks: "How it works",
            backToMenu: "Menu",
            viewerGuideTitle: "How to browse the tree",
            viewerGuideText: "This is a safe viewing mode for relatives without editing access.",
            viewerGuidePoint1: "Tap a person card to open the profile and story.",
            viewerGuidePoint2: "On phones, the “To tree” button hides the top panel for a cleaner view.",
            viewerGuidePoint3: "You can search people, change language, theme and zoom without risking any edits.",
            viewerGuideCta: "Got it"
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
        mode: null,
        pendingMode: "viewer",
        currentModalTitleKey: "newPersonTitle"
    };

    let translateX = window.innerWidth / 2;
    let translateY = window.innerHeight / 2;
    let zoomLevel = window.innerWidth < 768 ? 0.82 : 0.9;
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
    restoreMode();
    initThemePanels();
    initLanguageSwitcher();
    initSearch();
    initControls();
    initCamera();
    initProfileModal();
    initAccessGate();
    applySettings();
    applyTranslations();
    updateModeUi();
    updateMobileViewportMetrics();
    render(true);

    function t(key) {
        return translations[state.language][key] || translations.ru[key] || key;
    }

    function isAdminMode() {
        return state.mode === "admin";
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
            if (settings.theme && themes.some((theme) => theme.name === settings.theme)) state.theme = settings.theme;
        } catch (error) {
            localStorage.removeItem(SETTINGS_KEY);
        }
    }

    function restoreMode() {
        const mode = sessionStorage.getItem(SESSION_MODE_KEY);
        state.mode = mode === "admin" || mode === "viewer" ? mode : null;
    }

    function persistMode() {
        if (state.mode) {
            sessionStorage.setItem(SESSION_MODE_KEY, state.mode);
        } else {
            sessionStorage.removeItem(SESSION_MODE_KEY);
        }
    }

    function applySettings() {
        setTheme(state.theme, false);
        updateLanguageButtons();
        updateThemeButtons();
        updateMobileViewportMetrics();
    }

    function initThemePanels() {
        renderThemePanel(getEl("themePanel"), false);
        renderThemePanel(getEl("mobileThemePanel"), true);
    }

    function renderThemePanel(container, compact) {
        if (!container) return;
        container.innerHTML = themes.map((theme) => `
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
            const rect = tile.getBoundingClientRect();
            setTheme(tile.dataset.theme, true, {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        });
    }

    function setTheme(themeName, persist = true, origin = null) {
        state.theme = themeName;
        animateUiTransition("theme", origin);
        if (themeName === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }
        updateThemeButtons();
        if (persist) saveSettings();
    }

    function updateThemeButtons() {
        document.querySelectorAll(".theme-tile").forEach((tile) => {
            tile.classList.toggle("active", tile.dataset.theme === state.theme);
        });
    }

    function updateThemeLabels() {
        document.querySelectorAll(".theme-tile").forEach((tile) => {
            const theme = themes.find((item) => item.name === tile.dataset.theme);
            if (!theme) return;
            tile.title = t(theme.labelKey);
            tile.setAttribute("aria-label", t(theme.labelKey));
        });
    }

    function initLanguageSwitcher() {
        document.querySelectorAll(".segment-control").forEach((switcher) => {
            switcher.addEventListener("click", (event) => {
                const button = event.target.closest(".segment-btn[data-lang]");
                if (!button) return;
                setLanguage(button.dataset.lang);
            });
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        state.language = lang;
        animateUiTransition("locale", { x: window.innerWidth * 0.16, y: window.innerHeight * 0.12 });
        document.documentElement.lang = lang;
        applyTranslations();
        [birthPicker, deathPicker].forEach((picker) => {
            if (picker && typeof picker.set === "function") picker.set("locale", getCalendarLocale());
        });
        saveSettings();
    }

    function animateUiTransition(kind, origin = null) {
        const className = kind === "theme" ? "theme-transition" : "locale-transition";
        if (origin) {
            document.documentElement.style.setProperty("--theme-origin-x", `${origin.x}px`);
            document.documentElement.style.setProperty("--theme-origin-y", `${origin.y}px`);
        }
        document.body.classList.remove(className);
        void document.body.offsetWidth;
        document.body.classList.add(className);
        window.clearTimeout(animateUiTransition.timeoutId);
        animateUiTransition.timeoutId = window.setTimeout(() => {
            document.body.classList.remove(className);
        }, kind === "theme" ? 860 : 620);
    }

    function updateLanguageButtons() {
        document.querySelectorAll(".segment-btn[data-lang]").forEach((button) => {
            button.classList.toggle("active", button.dataset.lang === state.language);
        });
    }

    function applyTranslations() {
        document.title = t("pageTitle");
        document.querySelectorAll("[data-i18n]").forEach((node) => {
            node.textContent = t(node.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
            node.placeholder = t(node.dataset.i18nPlaceholder);
        });
        getEl("modalTitle").textContent = t(state.currentModalTitleKey);
        updateLanguageButtons();
        updateThemeLabels();
        updateEmptyState();
        updateFocusPanel();
        updateModeUi();
        updateTreeStats();
    }

    function showCustomAlert(message) {
        const toast = document.createElement("div");
        toast.className = "custom-toast";
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 260);
        }, 2400);
    }

    function initAccessGate() {
        const gate = getEl("accessGate");
        const input = getEl("accessCodeInput");
        const unlockBtn = getEl("unlockBtn");

        document.querySelectorAll("[data-mode-trigger]").forEach((button) => {
            button.addEventListener("click", () => {
                state.pendingMode = button.dataset.mode;
                updateAccessModeButtons();
                input.focus();
                input.select();
            });
        });

        unlockBtn.addEventListener("click", unlockWithCode);
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") unlockWithCode();
        });

        if (state.mode) {
            gate.classList.add("hidden");
        } else {
            updateAccessModeButtons();
            input.focus();
        }
    }

    function unlockWithCode() {
        const input = getEl("accessCodeInput");
        const code = input.value.trim();
        if (!code) {
            showCustomAlert(t("accessDenied"));
            return;
        }

        const detectedMode = Object.entries(ACCESS_CODES).find(([, value]) => value === code)?.[0];
        const requestedMode = state.pendingMode || "viewer";
        const finalMode = detectedMode || requestedMode;
        const expectedCode = ACCESS_CODES[finalMode];

        if (code !== expectedCode) {
            showCustomAlert(t("accessDenied"));
            input.select();
            return;
        }

        state.mode = finalMode;
        state.pendingMode = finalMode;
        persistMode();
        updateModeUi();
        getEl("accessGate").classList.add("hidden");
        input.value = "";
        showCustomAlert(isAdminMode() ? t("accessAdminReady") : t("accessViewerReady"));
        updateFocusPanel();
        if (finalMode === "viewer") {
            maybeOpenViewerGuide();
        } else {
            closeViewerGuide();
            setMobileTreeFocus(false);
        }
    }

    function maybeOpenViewerGuide() {
        if (localStorage.getItem(VIEWER_GUIDE_KEY) === "seen") return;
        openViewerGuide(false);
    }

    function openViewerGuide(force) {
        if (state.mode !== "viewer") return;
        getEl("viewerGuideModal").classList.remove("hidden");
        if (!force) localStorage.setItem(VIEWER_GUIDE_KEY, "seen");
    }

    function closeViewerGuide() {
        const modal = getEl("viewerGuideModal");
        if (modal) modal.classList.add("hidden");
        localStorage.setItem(VIEWER_GUIDE_KEY, "seen");
    }

    function setMobileTreeFocus(enabled) {
        if (window.innerWidth > 768) return;
        document.body.classList.toggle("mobile-tree-focus", enabled);
        getEl("mobileBackToMenu").classList.toggle("hidden", !enabled || state.mode !== "viewer");
        updateMobileViewportMetrics();
        render(false);
    }

    function updateAccessModeButtons() {
        document.querySelectorAll("[data-mode-trigger]").forEach((button) => {
            const isActive = button.dataset.mode === state.pendingMode;
            button.classList.toggle("accent-fill", isActive);
            button.classList.toggle("primary", !isActive);
        });
    }

    function initSearch() {
        const treeSearch = getEl("treeSearch");
        const searchResults = getEl("searchResults");

        function renderMatches() {
            const query = normalizeSearchText(treeSearch.value);
            searchResults.innerHTML = "";

            if (!query) {
                searchResults.classList.add("hidden");
                return [];
            }

            const matches = Array.from(graph.people.entries()).filter(([, person]) => {
                const haystack = [
                    person.name,
                    person.maidenName,
                    person.birthPlace,
                    person.livingPlaces,
                    person.bio
                ].filter(Boolean).map(normalizeSearchText).join(" ");
                return haystack.includes(query);
            });

            if (!matches.length) {
                searchResults.classList.add("hidden");
                return [];
            }

            matches.slice(0, 10).forEach(([id, person]) => {
                const item = document.createElement("button");
                item.type = "button";
                item.className = "search-item";
                item.textContent = person.name || t("noName");
                item.dataset.id = id;
                searchResults.appendChild(item);
            });

            searchResults.classList.remove("hidden");
            return matches;
        }

        treeSearch.addEventListener("input", renderMatches);
        treeSearch.addEventListener("focus", renderMatches);
        treeSearch.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            const firstMatch = searchResults.querySelector(".search-item");
            if (!firstMatch) return;
            event.preventDefault();
            firstMatch.click();
        });

        searchResults.addEventListener("click", (event) => {
            const item = event.target.closest(".search-item");
            if (!item) return;
            treeSearch.value = "";
            searchResults.classList.add("hidden");
            if (window.innerWidth < 768 && state.mode === "viewer") setMobileTreeFocus(true);
            selectPerson(item.dataset.id, true);
        });

        window.addEventListener("click", (event) => {
            if (!event.target.closest(".search-container")) searchResults.classList.add("hidden");
        });
    }

    function normalizeSearchText(value) {
        return String(value || "")
            .toLowerCase()
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function initControls() {
        getEl("exportBtn").addEventListener("click", exportPng);
        getEl("createPersonBtn").addEventListener("click", () => {
            if (!guardAdminAction()) return;
            state.currentModalTitleKey = "founderTitle";
            openRelationModal(state.currentModalTitleKey, (id) => {
                graph.setFocus(id);
                saveGraph();
                selectPerson(id, true);
            });
        });
        getEl("emptyStateCreateBtn").addEventListener("click", () => getEl("createPersonBtn").click());
        getEl("emptyStateGuideBtn").addEventListener("click", centerCurrentFocus);
        getEl("closePersonPanel").addEventListener("click", () => getEl("personPanel").classList.add("hidden"));
        getEl("zoomInBtn").addEventListener("click", () => setZoom(zoomLevel * 1.15));
        getEl("zoomOutBtn").addEventListener("click", () => setZoom(zoomLevel * 0.85));
        getEl("modeSwitchBtn").addEventListener("click", () => {
            state.mode = null;
            persistMode();
            state.pendingMode = "viewer";
            updateModeUi();
            updateAccessModeButtons();
            setMobileTreeFocus(false);
            getEl("accessGate").classList.remove("hidden");
            getEl("accessCodeInput").focus();
        });

        getEl("focusTreeMobileBtn").addEventListener("click", () => {
            setMobileTreeFocus(true);
            centerCurrentFocus();
        });
        getEl("backToMenuBtn").addEventListener("click", () => setMobileTreeFocus(false));
        getEl("openGuideBtn").addEventListener("click", () => openViewerGuide(true));
        getEl("closeGuideBtn").addEventListener("click", closeViewerGuide);
        getEl("viewerGuideModal").addEventListener("click", (event) => {
            if (event.target.id === "viewerGuideModal") closeViewerGuide();
        });

        document.querySelectorAll("[data-date-trigger]").forEach((button) => {
            button.addEventListener("click", () => {
                if (!guardAdminAction()) return;
                if (button.dataset.dateTrigger === "fBirth") birthPicker.open();
                if (button.dataset.dateTrigger === "fDeath") deathPicker.open();
            });
        });

        window.addEventListener("resize", () => render(false));
        window.addEventListener("resize", updateMobileViewportMetrics);
    }

    function updateMobileViewportMetrics() {
        const topBar = document.querySelector(".top-bar");
        const topBarHeight = document.body.classList.contains("mobile-tree-focus")
            ? 0
            : (topBar ? Math.ceil(topBar.getBoundingClientRect().height) : 0);
        document.documentElement.style.setProperty("--top-ui-height", `${topBarHeight}px`);
        if (window.innerWidth > 768 && document.body.classList.contains("mobile-tree-focus")) {
            document.body.classList.remove("mobile-tree-focus");
            getEl("mobileBackToMenu").classList.add("hidden");
        }
    }

    function guardAdminAction() {
        if (!state.mode) {
            showCustomAlert(t("unlockNeeded"));
            return false;
        }
        if (!isAdminMode()) {
            showCustomAlert(t("readonlyToast"));
            return false;
        }
        return true;
    }

    function initProfileModal() {
        getEl("closeFullProfile").addEventListener("click", () => getEl("fullProfileModal").classList.add("hidden"));
        getEl("closeProfileViewerBtn").addEventListener("click", () => getEl("fullProfileModal").classList.add("hidden"));
        getEl("closeModalBtn").addEventListener("click", closeRelationModal);
        getEl("profileModal").addEventListener("click", (event) => {
            if (event.target.id === "profileModal") closeRelationModal();
        });
        getEl("fullProfileModal").addEventListener("click", (event) => {
            if (event.target.id === "fullProfileModal") getEl("fullProfileModal").classList.add("hidden");
        });
        getEl("openFullProfileBtn").addEventListener("click", openFullProfile);

        getEl("personNameInput").addEventListener("change", (event) => {
            if (!isAdminMode()) {
                updateFocusPanel();
                showCustomAlert(t("readonlyToast"));
                return;
            }
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
        zoomLevel = Math.min(2.4, Math.max(0.28, value));
        updateTransform();
    }

    function updateTransform() {
        scene.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${zoomLevel})`);
    }

    function updateEmptyState() {
        const isEmpty = graph.people.size === 0;
        getEl("emptyState").classList.toggle("hidden", !isEmpty);
        if (isEmpty) getEl("personPanel").classList.add("hidden");
        updateTreeStats();
    }

    function updateTreeStats() {
        const stats = graph.getStats();
        getEl("treeStats").textContent = `${stats.total} ${stats.total === 1 ? t("treeCount") : t("treeCountMany")}`;
    }

    function centerCurrentFocus() {
        const focusId = graph.getFocus() || graph.people.keys().next().value;
        if (!focusId) return;
        selectPerson(focusId, true);
    }

    function selectPerson(id, autoCenter = false) {
        if (!id) return;
        graph.setFocus(id);
        updateFocusPanel();
        render(autoCenter);
    }

    function updateModeUi() {
        document.body.classList.toggle("viewer-mode", state.mode === "viewer");
        document.body.classList.toggle("admin-mode", state.mode === "admin");
        const modeBadge = getEl("modeBadge");
        const panelModePill = getEl("panelModePill");
        const modeKey = isAdminMode() ? "adminMode" : "viewerMode";
        const roleKey = isAdminMode() ? "roleAdmin" : "roleViewer";

        modeBadge.textContent = t(roleKey);
        modeBadge.className = `mode-badge ${isAdminMode() ? "admin" : "viewer"}`;
        panelModePill.textContent = t(modeKey);
        panelModePill.className = `panel-mode-pill ${isAdminMode() ? "admin" : "viewer"}`;
        getEl("tipText").textContent = isAdminMode() ? t("tipAdmin") : t("tipViewer");
        getEl("modalModeHint").textContent = isAdminMode() ? t("photoHint") : t("photoHintViewer");

        const viewerCloseBtn = getEl("closeProfileViewerBtn");
        viewerCloseBtn.classList.toggle("hidden", isAdminMode());
        getEl("mobileBackToMenu").classList.toggle("hidden", !document.body.classList.contains("mobile-tree-focus") || state.mode !== "viewer");
        updateReadonlyFields();
    }

    function updateReadonlyFields() {
        const shouldLock = !isAdminMode();
        const inlineName = getEl("personNameInput");
        inlineName.readOnly = shouldLock;

        [
            "fName",
            "fMaidenName",
            "fBirth",
            "fDeath",
            "fBirthPlace",
            "fDeathPlace",
            "fEdu",
            "fProf",
            "fLiving",
            "fBurial",
            "fBio"
        ].forEach((id) => {
            getEl(id).readOnly = shouldLock;
        });

        getEl("fIsAlive").disabled = shouldLock;
        getEl("uploadPhoto").disabled = shouldLock;
        updateDeathInput(getEl("fIsAlive").checked, getEl("fDeath"));
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
        getEl("storyPreview").textContent = getStoryPreview(person);

        getEl("addParent").onclick = () => {
            if (!guardAdminAction()) return;
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
            if (!guardAdminAction()) return;
            state.currentModalTitleKey = "addSpouseTitle";
            openRelationModal(state.currentModalTitleKey, (relatedId) => {
                if (graph.addSpouse(person.id, relatedId)) {
                    saveGraph();
                    render(true);
                }
            }, person.id);
        };

        getEl("addChild").onclick = () => {
            if (!guardAdminAction()) return;
            state.currentModalTitleKey = "addChildTitle";
            openRelationModal(state.currentModalTitleKey, (relatedId) => {
                if (graph.addParent(relatedId, person.id)) {
                    saveGraph();
                    render(true);
                }
            }, person.id);
        };

        updateReadonlyFields();
    }

    function getStoryPreview(person) {
        const chunks = [
            person.bio,
            person.profession,
            person.birthPlace,
            person.livingPlaces
        ].filter(Boolean);

        if (!chunks.length) return t("storyPlaceholder");
        const preview = chunks.join(" • ");
        return preview.length > 170 ? `${preview.slice(0, 167)}...` : preview;
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

        const metrics = getLayoutMetrics();
        const { visibleIds, coords } = buildVisibleLayout(focusId, metrics);

        visibleIds.forEach((id) => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;

            person.children.forEach((childId) => {
                if (visibleIds.has(childId) && coords[childId]) drawParentLink(pos, coords[childId], metrics);
            });

            person.spouses.forEach((spouseId) => {
                if (visibleIds.has(spouseId) && coords[spouseId] && id < spouseId) drawSpouseLink(pos, coords[spouseId], metrics);
            });
        });

        visibleIds.forEach((id) => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;
            scene.appendChild(createNode(id, person, pos, id === focusId, metrics));
        });

        if (autoCenter && coords[focusId]) {
            translateX = window.innerWidth / 2 - coords[focusId].x * zoomLevel;
            translateY = window.innerHeight / 2 - coords[focusId].y * zoomLevel;
        }

        updateTransform();
        updateEmptyState();
    }

    function getLayoutMetrics() {
        const mobile = window.innerWidth < 768;
        return {
            nodeWidth: mobile ? 174 : 204,
            nodeHeight: mobile ? 144 : 152,
            nodeRadius: mobile ? 26 : 28,
            cardGap: mobile ? 20 : 30,
            spouseGap: mobile ? 20 : 26,
            verticalGap: mobile ? 206 : 232,
            photoRadius: mobile ? 29 : 32,
            photoYOffset: mobile ? -20 : -22,
            textStartY: mobile ? 18 : 22,
            storyY: mobile ? 60 : 64
        };
    }

    function buildVisibleLayout(focusId, metrics) {
        const visibleIds = new Set();
        const levels = new Map();
        const queue = [{ id: focusId, level: 0 }];
        const visited = new Set();

        while (queue.length) {
            const current = queue.shift();
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            const person = graph.getPerson(current.id);
            if (!person) continue;

            visibleIds.add(current.id);
            if (!levels.has(current.level)) levels.set(current.level, []);
            levels.get(current.level).push(current.id);

            person.parents.forEach((parentId) => queue.push({ id: parentId, level: current.level - 1 }));
            person.children.forEach((childId) => queue.push({ id: childId, level: current.level + 1 }));
            person.spouses.forEach((spouseId) => queue.push({ id: spouseId, level: current.level }));
        }

        const coords = {};
        const groupGap = metrics.cardGap * 1.4;
        const orderedLevels = Array.from(levels.keys()).sort((left, right) => {
            const leftDistance = Math.abs(left);
            const rightDistance = Math.abs(right);
            if (leftDistance !== rightDistance) return leftDistance - rightDistance;
            return left - right;
        });

        orderedLevels.forEach((level) => {
            const ids = uniqueStable(levels.get(level));
            const groups = buildLevelGroups(ids, focusId);
            const placedGroups = groups.map((group) => {
                const preferredX = getGroupPreferredX(group, coords, focusId);
                const width = group.length * metrics.nodeWidth + Math.max(0, group.length - 1) * metrics.spouseGap;
                return { group, preferredX, width, center: preferredX };
            }).sort((left, right) => left.preferredX - right.preferredX);

            placedGroups.forEach((item, index) => {
                const previous = placedGroups[index - 1];
                if (!previous) {
                    item.center = item.preferredX;
                    return;
                }
                const minCenter = previous.center + previous.width / 2 + groupGap + item.width / 2;
                item.center = Math.max(item.preferredX, minCenter);
            });

            for (let index = placedGroups.length - 2; index >= 0; index -= 1) {
                const current = placedGroups[index];
                const next = placedGroups[index + 1];
                const maxCenter = next.center - next.width / 2 - groupGap - current.width / 2;
                current.center = Math.min(current.center, maxCenter);
            }

            const minX = Math.min(...placedGroups.map((item) => item.center - item.width / 2));
            const maxX = Math.max(...placedGroups.map((item) => item.center + item.width / 2));
            const offsetX = (minX + maxX) / 2;

            placedGroups.forEach((item) => {
                const groupStart = item.center - offsetX - item.width / 2 + metrics.nodeWidth / 2;
                item.group.forEach((id, index) => {
                    coords[id] = {
                        x: groupStart + index * (metrics.nodeWidth + metrics.spouseGap),
                        y: level * metrics.verticalGap
                    };
                });
            });
        });

        return { visibleIds, coords };
    }

    function getGroupPreferredX(group, coords, focusId) {
        if (group.includes(focusId)) return 0;

        const anchors = [];
        group.forEach((id) => {
            const person = graph.getPerson(id);
            if (!person) return;

            [...person.parents, ...person.children, ...person.spouses].forEach((relativeId) => {
                if (coords[relativeId]) anchors.push(coords[relativeId].x);
            });
        });

        if (!anchors.length) return 0;
        return anchors.reduce((sum, value) => sum + value, 0) / anchors.length;
    }

    function uniqueStable(ids) {
        return ids.filter((id, index) => ids.indexOf(id) === index);
    }

    function buildLevelGroups(ids, focusId) {
        const groups = [];
        const handled = new Set();
        const orderedIds = ids.slice().sort((left, right) => {
            if (left === focusId) return -1;
            if (right === focusId) return 1;
            return left.localeCompare(right);
        });

        orderedIds.forEach((id) => {
            if (handled.has(id)) return;
            const person = graph.getPerson(id);
            if (!person) return;

            const group = [id];
            handled.add(id);

            const spouses = Array.from(person.spouses).filter((spouseId) => ids.includes(spouseId) && !handled.has(spouseId));
            spouses.sort((a, b) => a.localeCompare(b));
            spouses.forEach((spouseId) => {
                group.push(spouseId);
                handled.add(spouseId);
            });

            groups.push(group);
        });

        return groups;
    }

    function drawParentLink(from, to, metrics) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midY = (from.y + to.y) / 2;
        path.setAttribute("d", `M ${from.x} ${from.y + metrics.nodeHeight / 2 - 18} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - metrics.nodeHeight / 2 - 10}`);
        path.setAttribute("class", "link");
        scene.appendChild(path);
    }

    function drawSpouseLink(from, to, metrics) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midX = (from.x + to.x) / 2;
        const topY = Math.min(from.y, to.y) - metrics.nodeHeight / 2 - 12;
        const edgeOffset = metrics.nodeWidth / 2 - 12;
        path.setAttribute("d", `M ${from.x + edgeOffset} ${from.y - metrics.nodeHeight / 2 + 24} Q ${midX} ${topY} ${to.x - edgeOffset} ${to.y - metrics.nodeHeight / 2 + 24}`);
        path.setAttribute("class", "spouse-link");
        scene.appendChild(path);
    }

    function createNode(id, person, pos, focused, metrics) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", `person-node${focused ? " focused" : ""}`);
        group.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);

        const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        card.setAttribute("x", String(-metrics.nodeWidth / 2));
        card.setAttribute("y", String(-metrics.nodeHeight / 2));
        card.setAttribute("width", String(metrics.nodeWidth));
        card.setAttribute("height", String(metrics.nodeHeight));
        card.setAttribute("rx", String(metrics.nodeRadius));
        card.setAttribute("class", "node-card");

        const accent = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        accent.setAttribute("x", String(-metrics.nodeWidth / 2));
        accent.setAttribute("y", String(-metrics.nodeHeight / 2));
        accent.setAttribute("width", String(metrics.nodeWidth));
        accent.setAttribute("height", String(metrics.nodeHeight * 0.3));
        accent.setAttribute("rx", String(metrics.nodeRadius));
        accent.setAttribute("class", "node-accent");

        const glow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        glow.setAttribute("x", String(-metrics.nodeWidth / 2 - 4));
        glow.setAttribute("y", String(-metrics.nodeHeight / 2 - 4));
        glow.setAttribute("width", String(metrics.nodeWidth + 8));
        glow.setAttribute("height", String(metrics.nodeHeight + 8));
        glow.setAttribute("rx", String(metrics.nodeRadius + 2));
        glow.setAttribute("class", "node-glow");

        const photoRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        photoRing.setAttribute("cx", "0");
        photoRing.setAttribute("cy", String(metrics.photoYOffset));
        photoRing.setAttribute("r", String(metrics.photoRadius));
        photoRing.setAttribute("class", "node-photo-ring");

        const photo = document.createElementNS("http://www.w3.org/2000/svg", "image");
        photo.setAttribute("href", person.photo || DEFAULT_AVATAR);
        photo.setAttribute("x", String(-metrics.photoRadius + 3));
        photo.setAttribute("y", String(metrics.photoYOffset - metrics.photoRadius + 3));
        photo.setAttribute("width", String(metrics.photoRadius * 2 - 6));
        photo.setAttribute("height", String(metrics.photoRadius * 2 - 6));
        photo.setAttribute("clip-path", `circle(${metrics.photoRadius - 3}px at ${metrics.photoRadius - 3}px ${metrics.photoRadius - 3}px)`);

        const name = createText(0, metrics.textStartY, "node-name", shortenText(person.name || t("noName"), window.innerWidth < 768 ? 16 : 22));
        const years = createText(0, metrics.textStartY + 22, "node-meta", getYearsLabel(person));
        const story = createText(0, metrics.storyY, "node-story", shortenText(getNodeMiniStory(person), window.innerWidth < 768 ? 20 : 28));

        group.append(glow, card, accent, photoRing, photo, name, years, story);
        group.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!isMovingCamera) selectPerson(id, true);
        });
        return group;
    }

    function getNodeMiniStory(person) {
        const line = person.profession || person.birthPlace || person.bio || "";
        return line || t("storyPlaceholder");
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
        if (!guardAdminAction()) return;

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
        updateReadonlyFields();

        aliveToggle.onchange = () => {
            if (aliveToggle.checked) deathPicker.clear();
            updateDeathInput(aliveToggle.checked, deathInput);
        };

        const photoUpload = getEl("uploadPhoto");
        getEl("modalAvatarContainer").onclick = (event) => {
            if (!isAdminMode()) {
                if (!event.target.closest(".upload-badge")) showCustomAlert(t("readonlyToast"));
                return;
            }
            if (!event.target.closest(".upload-badge")) photoUpload.click();
        };

        photoUpload.onchange = (event) => {
            if (!isAdminMode()) return;
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
            if (!guardAdminAction()) return;
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
        if (!isAdminMode()) showCustomAlert(t("profileReadonly"));
    }

    function updateDeathInput(isAlive, deathInput) {
        const readonly = !isAdminMode();
        deathInput.disabled = isAlive || readonly;
        deathInput.style.opacity = isAlive ? "0.5" : "1";
        if (deathPicker && deathPicker._input) deathPicker._input.disabled = isAlive || readonly;
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
            const padding = 90;
            const width = Math.max(420, Math.ceil(bbox.width + padding * 2));
            const height = Math.max(420, Math.ceil(bbox.height + padding * 2));
            const style = getComputedStyle(document.documentElement);
            const bg = style.getPropertyValue("--bg").trim() || "#eef1e8";

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
        const bg = style.getPropertyValue("--card-strong").trim() || "#ffffff";
        const text = style.getPropertyValue("--text").trim() || "#1f3126";
        const muted = style.getPropertyValue("--muted").trim() || "#67756c";
        const line = style.getPropertyValue("--line").trim() || "rgba(31,49,38,0.14)";
        const accent = style.getPropertyValue("--accent").trim() || "#2f7d5b";

        return `
            .link { fill:none; stroke:${line}; stroke-width:2.5; opacity:0.88; }
            .spouse-link { fill:none; stroke:${accent}; stroke-width:3; stroke-dasharray:8 8; opacity:0.82; }
            .node-card { fill:${bg}; stroke:${line}; stroke-width:1.1; }
            .node-accent { fill:rgba(255,255,255,0.22); }
            .node-photo-ring { fill:${bg}; stroke:${accent}; stroke-width:3; }
            .node-name { fill:${text}; font-family:Manrope, Arial, sans-serif; font-weight:800; font-size:13px; }
            .node-meta, .node-story { fill:${muted}; font-family:Manrope, Arial, sans-serif; font-weight:600; font-size:11px; }
            .node-story { font-size:10px; }
        `;
    }
});
