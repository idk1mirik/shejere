document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v1";
    const SETTINGS_KEY = "shedjere-ui-settings-v1";
    const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);

    const themes = [
        { name: "default", labelKey: "themeDefault", color: "#edf1ea" },
        { name: "dark", labelKey: "themeDark", color: "#16201c" },
        { name: "sunset", labelKey: "themeWarm", color: "#f7eadf" },
        { name: "forest", labelKey: "themeForest", color: "#e5efe2" }
    ];

    const branchPalette = ["#2c7a52", "#c25b3c", "#276f65", "#7b4b94", "#d3b66a", "#3a6ea5"];
    const state = {
        language: "ru",
        theme: "default",
        filters: {
            branch: "all",
            line: "all",
            generation: "all"
        },
        currentModalTitleKey: "newPersonTitle"
    };

    const translations = {
        ru: {
            pageTitle: "Мое Шежере | Soft Heritage",
            brandKicker: "Family archive",
            logo: "SHEDJERE",
            tagline: "Семейная память в живом дереве",
            searchPlaceholder: "Найти человека...",
            stories: "Истории",
            familyBook: "Книга рода",
            exportPng: "Скачать PNG",
            createPerson: "Добавить человека",
            treeFilters: "Фильтры дерева",
            resetFilters: "Сбросить",
            branchFilter: "Ветка",
            lineFilter: "Линия",
            generationFilter: "Поколение",
            branchPalette: "Ветки рода",
            allBranches: "Все ветки",
            allLines: "Все",
            fatherLine: "Линия отца",
            motherLine: "Линия матери",
            allGenerations: "Все поколения",
            generationRoot: "Фокусное поколение",
            generationOlder: "Поколение выше",
            generationYounger: "Поколение ниже",
            familyTimelineKicker: "Family timeline",
            familyTimeline: "Время жизни семьи",
            timelineCaption: "Рождения, союзы, переезды и важные вехи",
            storiesKicker: "Memories",
            storiesTitle: "Семейные истории",
            storiesSubtitle: "Живая лента воспоминаний с фото, датами и тегами.",
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
            yearsUnknown: "годы не указаны",
            branchUnknown: "Без ветки",
            focusSummaryAlive: "Живой профиль, можно дополнять историю, фото и семейные связи.",
            focusSummaryPast: "Архивный профиль: годы жизни, ключевые вехи и место в общей истории рода.",
            relationCount: "связей",
            branchBadge: "Ветка",
            statusBadgeAlive: "Жив",
            statusBadgePast: "Архив",
            yearsBadge: "Годы",
            storiesEmpty: "Для этой ветки пока нет истории. Здесь будет красиво смотреться первый семейный эпизод.",
            timelineEmpty: "Таймлайн появится, когда у родственников будут заполнены даты и истории.",
            emptyKicker: "Family archive",
            emptyTitle: "Здесь появится ваше родословное дерево",
            emptyText: "Начните с одного человека, а потом спокойно добавляйте родителей, супругов, детей и семейные истории.",
            familyBookKicker: "Family book",
            exportPdf: "Экспорт в PDF",
            bookIntroTitle: "Книга рода",
            bookIntroText: "Собранный портрет семьи: ветви рода, ключевые фигуры, истории и временная линия.",
            branchSectionTitle: "Ветки рода",
            peopleSectionTitle: "Лица рода",
            storiesSectionTitle: "Семейные истории",
            timelineSectionTitle: "Временная шкала",
            timelineBirth: "Рождение",
            timelineDeath: "Память",
            timelineUnion: "Союз",
            timelineMove: "Переезд",
            themeDefault: "Светлая",
            themeDark: "Темная",
            themeWarm: "Теплая",
            themeForest: "Лесная"
        },
        uz: {
            pageTitle: "Mening Shejerem | Soft Heritage",
            brandKicker: "Family archive",
            logo: "SHEDJERE",
            tagline: "Oila xotirasi jonli daraxtda",
            searchPlaceholder: "Odamni qidirish...",
            stories: "Hikoyalar",
            familyBook: "Nasab kitobi",
            exportPng: "PNG yuklab olish",
            createPerson: "Odam qo'shish",
            treeFilters: "Daraxt filtrlari",
            resetFilters: "Tozalash",
            branchFilter: "Tarmoq",
            lineFilter: "Yo'nalish",
            generationFilter: "Avlod",
            branchPalette: "Urug' tarmoqlari",
            allBranches: "Barcha tarmoqlar",
            allLines: "Hammasi",
            fatherLine: "Ota tomoni",
            motherLine: "Ona tomoni",
            allGenerations: "Barcha avlodlar",
            generationRoot: "Fokus avlodi",
            generationOlder: "Yuqori avlod",
            generationYounger: "Quyi avlod",
            familyTimelineKicker: "Family timeline",
            familyTimeline: "Oilaning vaqt yo'li",
            timelineCaption: "Tug'ilishlar, nikohlar, ko'chishlar va muhim voqealar",
            storiesKicker: "Memories",
            storiesTitle: "Oilaviy hikoyalar",
            storiesSubtitle: "Foto, sana va teglardan iborat tirik xotira lentasi.",
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
            burialLabel: "Dafn tafsiloti",
            bioLabel: "Tarjimai hol va muhim faktlar",
            saveChanges: "Saqlash",
            newPersonTitle: "Yangi odam",
            orCreateNew: "yoki yangisini yarating",
            newPersonPlaceholder: "Ism kiriting...",
            cancel: "Bekor qilish",
            create: "Yaratish",
            founderTitle: "Urug' asoschisi",
            addParentTitle: "Ota-onani qo'shish",
            addSpouseTitle: "Juftini qo'shish",
            addChildTitle: "Farzand qo'shish",
            saveError: "Ma'lumot saqlanmadi. Surat juda katta bo'lishi mumkin.",
            parentLimit: "Bu odam uchun ikkala ota-ona allaqachon ko'rsatilgan.",
            chooseSmallerPhoto: "750 KB dan kichikroq surat tanlang, aks holda brauzer daraxtni saqlamasligi mumkin.",
            enterName: "Iltimos, ism kiriting.",
            addFirstPerson: "Avval kamida bitta odam qo'shing.",
            exportFail: "PNG eksport qilib bo'lmadi.",
            exporting: "Saqlanmoqda...",
            aliveShort: "Tirik",
            noName: "Nomsiz",
            yearsUnknown: "yillar ko'rsatilmagan",
            branchUnknown: "Tarmoq yo'q",
            focusSummaryAlive: "Tirik profil: tarix, surat va oilaviy aloqa bilan to'ldirish mumkin.",
            focusSummaryPast: "Arxiv profili: umr yillari, muhim bosqichlar va urug' tarixidagi o'rni.",
            relationCount: "aloqa",
            branchBadge: "Tarmoq",
            statusBadgeAlive: "Tirik",
            statusBadgePast: "Arxiv",
            yearsBadge: "Yillar",
            storiesEmpty: "Bu tarmoq uchun hali hikoya yo'q. Bu yerda birinchi oilaviy epizod juda yaxshi ko'rinadi.",
            timelineEmpty: "Taymlayn qarindoshlar uchun sana va hikoyalar kiritilganda paydo bo'ladi.",
            emptyKicker: "Family archive",
            emptyTitle: "Bu yerda sizning nasab daraxtingiz paydo bo'ladi",
            emptyText: "Avval bitta odam qo'shing, keyin asta-sekin ota-onalar, juftlar, farzandlar va oilaviy hikoyalarni to'ldiring.",
            familyBookKicker: "Family book",
            exportPdf: "PDF eksport",
            bookIntroTitle: "Nasab kitobi",
            bookIntroText: "Oilaviy tarmoqlar, asosiy shaxslar, hikoyalar va vaqt yo'li jamlangan portret.",
            branchSectionTitle: "Urug' tarmoqlari",
            peopleSectionTitle: "Urug' odamlari",
            storiesSectionTitle: "Oilaviy hikoyalar",
            timelineSectionTitle: "Vaqt yo'li",
            timelineBirth: "Tug'ilish",
            timelineDeath: "Xotira",
            timelineUnion: "Nikoh",
            timelineMove: "Ko'chish",
            themeDefault: "Yorug'",
            themeDark: "Tungi",
            themeWarm: "Issiq",
            themeForest: "Yashil"
        },
        en: {
            pageTitle: "My Family Tree | Soft Heritage",
            brandKicker: "Family archive",
            logo: "SHEDJERE",
            tagline: "Family memory inside a living tree",
            searchPlaceholder: "Search for a person...",
            stories: "Stories",
            familyBook: "Family book",
            exportPng: "Download PNG",
            createPerson: "Add person",
            treeFilters: "Tree filters",
            resetFilters: "Reset",
            branchFilter: "Branch",
            lineFilter: "Line",
            generationFilter: "Generation",
            branchPalette: "Family branches",
            allBranches: "All branches",
            allLines: "All",
            fatherLine: "Father line",
            motherLine: "Mother line",
            allGenerations: "All generations",
            generationRoot: "Focus generation",
            generationOlder: "Older generation",
            generationYounger: "Younger generation",
            familyTimelineKicker: "Family timeline",
            familyTimeline: "The life line of the family",
            timelineCaption: "Births, unions, moves and meaningful milestones",
            storiesKicker: "Memories",
            storiesTitle: "Family stories",
            storiesSubtitle: "A living stream of memories with photos, dates and tags.",
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
            yearsUnknown: "years unknown",
            branchUnknown: "No branch",
            focusSummaryAlive: "Living profile with room for stories, portraits and family links.",
            focusSummaryPast: "Archive profile with life years, milestones and a clear place inside the wider family story.",
            relationCount: "connections",
            branchBadge: "Branch",
            statusBadgeAlive: "Living",
            statusBadgePast: "Archive",
            yearsBadge: "Years",
            storiesEmpty: "There is no story for this branch yet. The first family memory will look great here.",
            timelineEmpty: "The timeline will appear once real dates and family stories are filled in.",
            emptyKicker: "Family archive",
            emptyTitle: "Your family tree will appear here",
            emptyText: "Start with one person, then calmly add parents, spouses, children and family stories.",
            familyBookKicker: "Family book",
            exportPdf: "Export PDF",
            bookIntroTitle: "Family book",
            bookIntroText: "A gathered portrait of the family: branches, key figures, stories and timeline.",
            branchSectionTitle: "Family branches",
            peopleSectionTitle: "Faces of the family",
            storiesSectionTitle: "Family stories",
            timelineSectionTitle: "Timeline",
            timelineBirth: "Birth",
            timelineDeath: "Memory",
            timelineUnion: "Union",
            timelineMove: "Move",
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

    const languageLocales = {
        ru: () => (window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.ru) ? flatpickr.l10ns.ru : "default",
        uz: () => uzLocale,
        en: () => "default"
    };

    let translateX = window.innerWidth / 2;
    let translateY = window.innerHeight / 2;
    let zoomLevel = window.innerWidth < 768 ? 0.72 : 0.84;
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
    let renderedLevels = {};

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
    initStoriesDrawer();
    initBookModal();
    populateBranchFilter();
    populateGenerationFilter();
    applySettings();
    applyTranslations();
    render(true);
    renderStories();
    renderTimeline();
    renderBook();
    updateEmptyState();

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
            locale: languageLocales[state.language](),
            prevArrow: "<span class='flatpickr-nav-arrow'>&lsaquo;</span>",
            nextArrow: "<span class='flatpickr-nav-arrow'>&rsaquo;</span>"
        });
    }

    function t(key) {
        return translations[state.language][key] || translations.ru[key] || key;
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

    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
            if (settings.language && translations[settings.language]) state.language = settings.language;
            if (settings.theme && themes.some(theme => theme.name === settings.theme)) state.theme = settings.theme;
        } catch (error) {
            localStorage.removeItem(SETTINGS_KEY);
        }
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({
            language: state.language,
            theme: state.theme
        }));
    }

    function applySettings() {
        setTheme(state.theme, false);
        updateLanguageButtons();
        updateThemeButtons();
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
        updateDatePickerLocale();
        updateLanguageButtons();
        updateThemePanelLabels();
        render(false);
        renderStories();
        renderTimeline();
        renderBook();
        saveSettings();
    }

    function updateThemePanelLabels() {
        document.querySelectorAll(".theme-tile").forEach(tile => {
            const theme = themes.find(item => item.name === tile.dataset.theme);
            if (!theme) return;
            tile.title = t(theme.labelKey);
            tile.setAttribute("aria-label", t(theme.labelKey));
        });
    }

    function updateLanguageButtons() {
        document.querySelectorAll("#languageSwitcher .segment-btn").forEach(button => {
            button.classList.toggle("active", button.dataset.lang === state.language);
        });
    }

    function updateDatePickerLocale() {
        const locale = languageLocales[state.language]();
        [birthPicker, deathPicker].forEach(picker => {
            if (picker && typeof picker.set === "function") picker.set("locale", locale);
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
        document.querySelectorAll("[data-i18n-option]").forEach(node => {
            node.textContent = t(node.dataset.i18nOption);
        });
        updateThemePanelLabels();
        populateBranchFilter();
        populateGenerationFilter();
        updateFocusPanel();
        updateEmptyState();
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

            const matches = Array.from(graph.people.entries()).filter(([, person]) => person.name.toLowerCase().includes(query));
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
        getEl("openFiltersBtn").addEventListener("click", () => getEl("controlRibbon").classList.toggle("hidden"));
        getEl("openTimelineBtn").addEventListener("click", () => getEl("timelineStrip").classList.toggle("hidden"));
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
        getEl("resetFiltersBtn").addEventListener("click", resetFilters);
        getEl("branchFilter").addEventListener("change", (event) => {
            state.filters.branch = event.target.value;
            render(false);
            renderStories();
            renderBook();
        });
        getEl("lineFilter").addEventListener("change", (event) => {
            state.filters.line = event.target.value;
            render(false);
            renderBook();
        });
        getEl("generationFilter").addEventListener("change", (event) => {
            state.filters.generation = event.target.value;
            render(false);
            renderBook();
        });

        window.addEventListener("resize", () => render(false));

        document.querySelectorAll("[data-date-trigger]").forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.dateTrigger === "fBirth") birthPicker.open();
                if (button.dataset.dateTrigger === "fDeath") deathPicker.open();
            });
        });
    }

    function initStoriesDrawer() {
        getEl("openStoriesBtn").addEventListener("click", () => getEl("storiesDrawer").classList.remove("hidden"));
        getEl("closeStoriesBtn").addEventListener("click", () => getEl("storiesDrawer").classList.add("hidden"));
    }

    function initBookModal() {
        getEl("openBookBtn").addEventListener("click", () => {
            renderBook();
            getEl("bookModal").classList.remove("hidden");
        });
        getEl("closeBookModal").addEventListener("click", () => getEl("bookModal").classList.add("hidden"));
        getEl("bookModal").addEventListener("click", (event) => {
            if (event.target.id === "bookModal") getEl("bookModal").classList.add("hidden");
        });
        getEl("printBookBtn").addEventListener("click", () => {
            document.body.classList.add("printing-book");
            window.print();
            setTimeout(() => document.body.classList.remove("printing-book"), 50);
        });
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
            populateBranchFilter();
            render(false);
            renderStories();
            renderBook();
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
            isMovingCamera = Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 4;
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
        zoomLevel = Math.min(2.8, Math.max(0.26, value));
        updateTransform();
    }

    function updateTransform() {
        scene.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${zoomLevel})`);
    }

    function resetFilters() {
        state.filters.branch = "all";
        state.filters.line = "all";
        state.filters.generation = "all";
        getEl("branchFilter").value = "all";
        getEl("lineFilter").value = "all";
        getEl("generationFilter").value = "all";
        render(false);
        renderStories();
        renderBook();
    }

    function populateBranchFilter() {
        const select = getEl("branchFilter");
        const branches = getAllBranches();
        const currentValue = state.filters.branch;
        select.innerHTML = [`<option value="all">${t("allBranches")}</option>`].concat(
            branches.map(branch => `<option value="${branch}">${branch}</option>`)
        ).join("");
        select.value = branches.includes(currentValue) ? currentValue : "all";
        state.filters.branch = select.value;
        renderBranchLegend(branches);
    }

    function populateGenerationFilter() {
        const select = getEl("generationFilter");
        select.innerHTML = [
            `<option value="all">${t("allGenerations")}</option>`,
            `<option value="0">${t("generationRoot")}</option>`,
            `<option value="-1">${t("generationOlder")}</option>`,
            `<option value="1">${t("generationYounger")}</option>`
        ].join("");
        if (!["all", "0", "-1", "1"].includes(state.filters.generation)) state.filters.generation = "all";
        select.value = state.filters.generation;
    }

    function renderBranchLegend(branches) {
        const container = getEl("branchLegend");
        container.innerHTML = branches.map(branch => `
            <div class="legend-chip">
                <span class="legend-color" style="background:${getBranchColor(branch)}"></span>
                <span>${branch}</span>
            </div>
        `).join("");
    }

    function getAllBranches() {
        return Array.from(graph.people.values())
            .map(person => getBranchLabel(person))
            .filter(Boolean)
            .filter((value, index, arr) => arr.indexOf(value) === index)
            .sort((a, b) => a.localeCompare(b));
    }

    function getBranchLabel(person) {
        if (!person || !person.name) return t("branchUnknown");
        const parts = person.name.trim().split(/\s+/);
        return parts.length > 1 ? parts[parts.length - 1] : parts[0];
    }

    function getBranchColor(branch) {
        const source = branch || t("branchUnknown");
        let hash = 0;
        for (let index = 0; index < source.length; index += 1) hash += source.charCodeAt(index);
        return branchPalette[hash % branchPalette.length];
    }

    function selectPerson(id, autoCenter = false) {
        if (!id) return;
        graph.setFocus(id);
        updateFocusPanel();
        render(autoCenter);
        renderStories();
        renderTimeline();
        renderBook();
    }

    function updateFocusPanel() {
        const id = graph.getFocus();
        const person = graph.getPerson(id);
        if (!person) {
            getEl("personPanel").classList.add("hidden");
            return;
        }

        getEl("panelAvatar").src = person.photo || DEFAULT_AVATAR;
        getEl("personNameInput").value = person.name || "";
        getEl("quickBirth").value = person.birthDate || "—";
        getEl("quickDeath").value = person.isAlive !== false && !person.deathDate ? t("aliveShort") : (person.deathDate || "—");
        getEl("panelBranchChip").innerHTML = `<span>${t("branchBadge")}</span><strong>${getBranchLabel(person)}</strong>`;
        getEl("focusSummary").textContent = `${person.isAlive ? t("focusSummaryAlive") : t("focusSummaryPast")} ${getRelationCount(person.id)} ${t("relationCount")}.`;
        getEl("personPanel").classList.remove("hidden");

        getEl("addParent").onclick = () => {
            if (person.parents.size >= 2) {
                showCustomAlert(t("parentLimit"));
                return;
            }
            state.currentModalTitleKey = "addParentTitle";
            openRelationModal(state.currentModalTitleKey, relatedId => {
                if (graph.addParent(id, relatedId)) {
                    saveGraph();
                    populateBranchFilter();
                    render(true);
                    renderStories();
                    renderTimeline();
                    renderBook();
                }
            }, id);
        };

        getEl("addSpouse").onclick = () => {
            state.currentModalTitleKey = "addSpouseTitle";
            openRelationModal(state.currentModalTitleKey, relatedId => {
                if (graph.addSpouse(id, relatedId)) {
                    saveGraph();
                    render(true);
                    renderTimeline();
                    renderBook();
                }
            }, id);
        };

        getEl("addChild").onclick = () => {
            state.currentModalTitleKey = "addChildTitle";
            openRelationModal(state.currentModalTitleKey, relatedId => {
                if (graph.addParent(relatedId, id)) {
                    saveGraph();
                    populateBranchFilter();
                    render(true);
                    renderStories();
                    renderTimeline();
                    renderBook();
                }
            }, id);
        };
    }

    function getRelationCount(id) {
        const person = graph.getPerson(id);
        if (!person) return 0;
        return person.parents.size + person.children.size + person.spouses.size;
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
            updateEmptyState();
        };

        getEl("profileModal").classList.remove("hidden");
    }

    function closeRelationModal() {
        getEl("profileModal").classList.add("hidden");
        getEl("newPersonName").value = "";
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
                renderStories();
                renderBook();
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
            populateBranchFilter();
            getEl("fullProfileModal").classList.add("hidden");
            selectPerson(id);
            updateEmptyState();
        };

        getEl("fullProfileModal").classList.remove("hidden");
    }

    function updateDeathInput(isAlive, deathInput) {
        deathInput.disabled = isAlive;
        deathInput.style.opacity = isAlive ? "0.5" : "1";
        if (deathPicker && deathPicker._input) deathPicker._input.disabled = isAlive;
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

        const { levels, coords, visibleIds } = buildVisibleLayout(focusId);
        renderedLevels = levels;

        visibleIds.forEach(id => {
            const person = graph.getPerson(id);
            const pos = coords[id];
            if (!person || !pos) return;
            person.children.forEach(childId => {
                if (coords[childId] && visibleIds.has(childId)) drawPath(pos, coords[childId], "link");
            });
            person.spouses.forEach(spouseId => {
                if (coords[spouseId] && visibleIds.has(spouseId) && id < spouseId) drawSpousePath(pos, coords[spouseId], getBranchColor(getBranchLabel(person)));
            });
        });

        visibleIds.forEach(id => {
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
        const coords = {};
        const levels = {};
        const visibleIds = new Set();
        const queue = [{ id: focusId, level: 0, line: "self" }];
        const visited = new Set();

        while (queue.length) {
            const item = queue.shift();
            if (visited.has(item.id)) continue;
            visited.add(item.id);
            const person = graph.getPerson(item.id);
            if (!person) continue;

            const generationPass = state.filters.generation === "all" || String(item.level) === state.filters.generation;
            const branchPass = state.filters.branch === "all" || getBranchLabel(person) === state.filters.branch;
            const linePass = state.filters.line === "all" || item.line === state.filters.line || item.line === "self";

            if ((generationPass && branchPass && linePass) || item.id === focusId) {
                visibleIds.add(item.id);
                if (!levels[item.level]) levels[item.level] = [];
                levels[item.level].push(item.id);
            }

            const parents = Array.from(person.parents);
            parents.forEach((parentId, index) => {
                const parentLine = index === 0 ? "father" : "mother";
                queue.push({ id: parentId, level: item.level - 1, line: item.line === "self" ? parentLine : item.line });
            });
            person.children.forEach(childId => queue.push({ id: childId, level: item.level + 1, line: item.line === "self" ? "self" : item.line }));
            person.spouses.forEach(spouseId => queue.push({ id: spouseId, level: item.level, line: item.line }));
        }

        Object.keys(levels).forEach(levelKey => {
            const ids = levels[levelKey];
            ids.forEach((id, index) => {
                coords[id] = {
                    x: index * 290 - ((ids.length - 1) * 290) / 2,
                    y: Number(levelKey) * (window.innerWidth < 768 ? 208 : 236)
                };
            });
        });

        return { levels, coords, visibleIds };
    }

    function drawPath(from, to, className) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", `M ${from.x} ${from.y + 6} C ${from.x} ${from.y + 96}, ${to.x} ${to.y - 88}, ${to.x} ${to.y}`);
        path.setAttribute("class", className);
        scene.appendChild(path);
    }

    function drawSpousePath(from, to, color) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const midX = (from.x + to.x) / 2;
        path.setAttribute("d", `M ${from.x + 104} ${from.y - 30} Q ${midX} ${from.y - 72} ${to.x - 104} ${to.y - 30}`);
        path.setAttribute("class", "spouse-link");
        path.style.stroke = color;
        scene.appendChild(path);
    }

    function createNode(id, person, pos, focused) {
        const branch = getBranchLabel(person);
        const branchColor = getBranchColor(branch);
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("class", `person-node${focused ? " focused" : ""}`);
        group.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
        group.style.setProperty("--node-branch", branchColor);

        const shadow = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        shadow.setAttribute("x", "-118");
        shadow.setAttribute("y", "-58");
        shadow.setAttribute("width", "236");
        shadow.setAttribute("height", "126");
        shadow.setAttribute("rx", "28");
        shadow.setAttribute("class", "node-shadow-card");

        const card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        card.setAttribute("x", "-114");
        card.setAttribute("y", "-62");
        card.setAttribute("width", "228");
        card.setAttribute("height", "118");
        card.setAttribute("rx", "26");
        card.setAttribute("class", "node-card-bg");

        const accent = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        accent.setAttribute("x", "-114");
        accent.setAttribute("y", "-62");
        accent.setAttribute("width", "228");
        accent.setAttribute("height", "10");
        accent.setAttribute("rx", "26");
        accent.setAttribute("class", "node-card-accent");

        const avatarRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        avatarRing.setAttribute("cx", "-68");
        avatarRing.setAttribute("cy", "-6");
        avatarRing.setAttribute("r", "34");
        avatarRing.setAttribute("class", "node-avatar-ring");

        const avatar = document.createElementNS("http://www.w3.org/2000/svg", "image");
        avatar.setAttribute("href", person.photo || DEFAULT_AVATAR);
        avatar.setAttribute("x", "-98");
        avatar.setAttribute("y", "-36");
        avatar.setAttribute("width", "60");
        avatar.setAttribute("height", "60");
        avatar.setAttribute("clip-path", "circle(30px at 30px 30px)");

        const name = createSvgText(-20, -18, "node-name", shortenName(person.name, 23));
        const years = createSvgText(-20, 4, "node-meta", getYearsLabel(person));
        const branchText = createSvgText(-20, 26, "node-meta branch-text", branch);
        const statusChip = createChip(66, -26, person.isAlive ? t("statusBadgeAlive") : t("statusBadgePast"), person.isAlive ? branchColor : "#6f7a73");
        const yearsChip = createChip(48, 18, t("yearsBadge"), branchColor, true);

        group.append(shadow, card, accent, avatarRing, avatar, name, years, branchText, statusChip, yearsChip);
        group.addEventListener("click", (event) => {
            event.stopPropagation();
            if (!isMovingCamera) selectPerson(id, true);
        });
        return group;
    }

    function createSvgText(x, y, className, text) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", "text");
        node.setAttribute("x", String(x));
        node.setAttribute("y", String(y));
        node.setAttribute("class", className);
        node.textContent = text;
        return node;
    }

    function createChip(x, y, text, color, outlined = false) {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("transform", `translate(${x}, ${y})`);

        const width = Math.max(54, text.length * 7 + 18);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", String(-width / 2));
        rect.setAttribute("y", "-13");
        rect.setAttribute("width", String(width));
        rect.setAttribute("height", "26");
        rect.setAttribute("rx", "13");
        rect.setAttribute("class", outlined ? "node-chip node-chip-outline" : "node-chip");
        rect.style.fill = outlined ? "transparent" : color;
        rect.style.stroke = color;

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("class", outlined ? "node-chip-text node-chip-text-outline" : "node-chip-text");
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("y", "5");
        label.textContent = text;
        if (!outlined) label.style.fill = "#fff";
        if (outlined) label.style.fill = color;

        group.append(rect, label);
        return group;
    }

    function shortenName(name, maxLength) {
        const source = name || t("noName");
        return source.length > maxLength ? `${source.slice(0, maxLength - 3)}...` : source;
    }

    function getYearsLabel(person) {
        if (!person.birthDate && !person.deathDate) return t("yearsUnknown");
        return [person.birthDate || "?", person.isAlive ? "..." : (person.deathDate || "?")].join(" - ");
    }

    function updateEmptyState() {
        const visible = graph.people.size === 0;
        getEl("emptyState").classList.toggle("hidden", !visible);
        getEl("personPanel").classList.toggle("hidden", visible);
        getEl("controlRibbon").classList.toggle("hidden", visible || getEl("controlRibbon").classList.contains("hidden"));
        getEl("timelineStrip").classList.toggle("hidden", visible || getEl("timelineStrip").classList.contains("hidden"));
    }

    function getStoriesData() {
        return Array.from(graph.people.values())
            .filter(person => person.bio && person.bio.trim())
            .map(person => ({
                id: `story-${person.id}`,
                personId: person.id,
                branch: getBranchLabel(person),
                date: person.birthDate || "",
                title: person.name,
                body: person.bio,
                tags: [getBranchLabel(person), person.profession || person.birthPlace || t("stories")].filter(Boolean),
                image: person.photo || DEFAULT_AVATAR
            }));
    }

    function renderStories() {
        const list = getEl("storiesList");
        const currentPerson = graph.getPerson(graph.getFocus());
        const activeBranch = state.filters.branch !== "all" ? state.filters.branch : (currentPerson ? getBranchLabel(currentPerson) : "all");

        const stories = getStoriesData().filter(story => activeBranch === "all" || story.branch === activeBranch);
        if (!stories.length) {
            list.innerHTML = `<div class="empty-story">${t("storiesEmpty")}</div>`;
            return;
        }

        list.innerHTML = stories.map(story => `
            <article class="story-card">
                <img src="${story.image}" alt="${story.title}">
                <div class="story-card-body">
                    <div class="story-meta">
                        <span>${story.date}</span>
                        <span>${story.branch}</span>
                    </div>
                    <h3>${story.title}</h3>
                    <p>${story.body}</p>
                    <div class="story-tags">${story.tags.map(tag => `<span>${tag}</span>`).join("")}</div>
                </div>
            </article>
        `).join("");
    }

    function buildTimelineEvents() {
        const items = [];
        graph.people.forEach(person => {
            if (person.birthDate) items.push({ date: person.birthDate, label: t("timelineBirth"), title: person.name, subtitle: person.birthPlace || getBranchLabel(person), personId: person.id });
            if (person.deathDate) items.push({ date: person.deathDate, label: t("timelineDeath"), title: person.name, subtitle: person.deathPlace || getBranchLabel(person), personId: person.id });
        });

        getStoriesData().forEach(story => {
            items.push({
                date: story.date,
                label: t("stories"),
                title: story.title,
                subtitle: story.branch,
                personId: story.personId
            });
        });

        return items.sort((a, b) => normalizeYear(a.date) - normalizeYear(b.date)).slice(0, 16);
    }

    function normalizeYear(value) {
        const match = String(value).match(/(\d{4})/);
        return match ? Number(match[1]) : 0;
    }

    function renderTimeline() {
        const track = getEl("timelineTrack");
        const events = buildTimelineEvents();
        if (!events.length) {
            track.innerHTML = `<div class="empty-story timeline-empty">${t("timelineEmpty")}</div>`;
            return;
        }
        track.innerHTML = events.map(event => `
            <button class="timeline-event" type="button" data-person-id="${event.personId || ""}">
                <span class="timeline-event-year">${event.date}</span>
                <span class="timeline-event-label">${event.label}</span>
                <strong>${event.title}</strong>
                <small>${event.subtitle}</small>
            </button>
        `).join("");

        track.querySelectorAll(".timeline-event").forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.personId) selectPerson(button.dataset.personId, true);
            });
        });
    }

    function renderBook() {
        const container = getEl("bookContent");
        const people = Array.from(graph.people.values()).filter(person => state.filters.branch === "all" || getBranchLabel(person) === state.filters.branch);
        const branches = Array.from(new Set(people.map(getBranchLabel)));
        const stories = getStoriesData().filter(story => state.filters.branch === "all" || story.branch === state.filters.branch);
        const timeline = buildTimelineEvents().slice(0, 10);

        container.innerHTML = `
            <section class="book-hero">
                <h3>${t("bookIntroTitle")}</h3>
                <p>${t("bookIntroText")}</p>
            </section>
            <section class="book-section">
                <h4>${t("branchSectionTitle")}</h4>
                <div class="book-branch-grid">
                    ${branches.map(branch => `
                        <div class="book-branch-card">
                            <span class="book-branch-dot" style="background:${getBranchColor(branch)}"></span>
                            <strong>${branch}</strong>
                            <small>${people.filter(person => getBranchLabel(person) === branch).length} ${t("relationCount")}</small>
                        </div>
                    `).join("")}
                </div>
            </section>
            <section class="book-section">
                <h4>${t("peopleSectionTitle")}</h4>
                <div class="book-people-list">
                    ${people.map(person => `
                        <article class="book-person-row">
                            <div>
                                <strong>${person.name}</strong>
                                <p>${getYearsLabel(person)}</p>
                            </div>
                            <span>${getBranchLabel(person)}</span>
                        </article>
                    `).join("")}
                </div>
            </section>
            <section class="book-section">
                <h4>${t("storiesSectionTitle")}</h4>
                <div class="book-story-list">
                    ${stories.map(story => `
                        <article class="book-story-row">
                            <strong>${story.title}</strong>
                            <p>${story.body}</p>
                            <span>${story.date} · ${story.branch}</span>
                        </article>
                    `).join("")}
                </div>
            </section>
            <section class="book-section">
                <h4>${t("timelineSectionTitle")}</h4>
                <div class="book-timeline-list">
                    ${timeline.map(event => `
                        <div class="book-timeline-row">
                            <strong>${event.date}</strong>
                            <div>
                                <b>${event.title}</b>
                                <span>${event.label} · ${event.subtitle}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </section>
        `;
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
            const width = Math.max(420, Math.ceil(bbox.width + padding * 2));
            const height = Math.max(420, Math.ceil(bbox.height + padding * 2));
            const style = getComputedStyle(document.documentElement);
            const bg = style.getPropertyValue("--bg").trim() || "#edf1ea";

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
        const text = style.getPropertyValue("--text").trim() || "#233127";
        const card = style.getPropertyValue("--white").trim() || "#ffffff";
        const line = style.getPropertyValue("--line").trim() || "rgba(35,49,39,0.16)";
        return `
            .link { fill:none; stroke:${line}; stroke-width:2.5; opacity:0.7; }
            .spouse-link { fill:none; stroke-width:3; stroke-dasharray:8 8; opacity:0.82; }
            .node-shadow-card { fill:rgba(0,0,0,0.08); }
            .node-card-bg { fill:${card}; }
            .node-card-accent { fill:var(--node-branch); }
            .node-avatar-ring { fill:${card}; stroke:var(--node-branch); stroke-width:3; }
            .node-name { font-family:Sora, Arial, sans-serif; fill:${text}; font-weight:800; font-size:13px; }
            .node-meta { font-family:Sora, Arial, sans-serif; fill:${text}; font-weight:600; font-size:11px; opacity:0.76; }
            .branch-text { fill:var(--node-branch); opacity:1; }
            .node-chip-text { font-family:Sora, Arial, sans-serif; font-weight:800; font-size:10px; }
            .node-chip-text-outline { font-family:Sora, Arial, sans-serif; font-weight:800; font-size:10px; }
        `;
    }
});
