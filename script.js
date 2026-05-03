document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_KEY = "shedjere-family-tree-v2";
    const SETTINGS_KEY = "shedjere-ui-settings-v2";
    const SESSION_MODE_KEY = "shedjere-session-mode";
    const VIEWER_GUIDE_KEY = "shedjere-viewer-guide-seen-v1";
    const DEFAULT_AVATAR = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="120" fill="#e7efe5"/><circle cx="120" cy="91" r="40" fill="#8aa691"/><path d="M48 196c10-34 36-55 72-55s62 21 72 55" fill="#8aa691"/></svg>'
    )}`;
    const ACCESS_CODES = {
        admin: "mir67",
        viewer: "guests123"
    };
    const REMOTE_AUTH_CONFIG = window.SHEDJERE_AUTH || null;
    const SUPABASE_CONFIG = window.SHEDJERE_SUPABASE || null;
    const CLOUD_TREE_TABLE = "family_tree_states";
    const CLOUD_ROLE_TABLE = "family_tree_roles";
    const CLOUD_TREE_SLUG = (SUPABASE_CONFIG && SUPABASE_CONFIG.treeSlug) || "main-family-tree";
    const FEEDBACK_EMAIL = "mmirkamalov0210@gmail.com";

    const graph = new FamilyGraph();
    const scene = document.getElementById("scene");
    const svg = document.getElementById("viewport");
    const getEl = (id) => document.getElementById(id);
    let supabaseClient = null;
    let remoteSaveTimer = null;
    let remoteSaveInFlight = false;
    let remoteSaveQueued = false;

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
            tagline: "Семейная память в живом древе",
            searchPlaceholder: "Найти человека...",
            exportPng: "Скачать PNG",
            createPerson: "Добавить человека",
            emptyKicker: "Family archive",
            emptyTitle: "Здесь появится ваше родословное древо",
            emptyText: "Начните с одного человека, а потом спокойно добавляйте родителей, супругов и детей.",
            focusTree: "Показать центр древа",
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
            chooseSmallerPhoto: "Лучше выбрать фото до 750 КБ, иначе браузер может не сохранить древо.",
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
            accessTitle: "Вход в семейное древо",
            accessText: "Введите код, чтобы открыть режим редактирования или гостевой просмотр.",
            accessLabel: "Код доступа",
            accessPlaceholder: "Введите код",
            showAccessCode: "Показать код",
            hideAccessCode: "Скрыть код",
            adminEmailLabel: "Email администратора",
            adminEmailPlaceholder: "you@example.com",
            adminPasswordPlaceholder: "Введите пароль",
            showPassword: "Показать пароль",
            hidePassword: "Скрыть пароль",
            adminLogin: "Войти в админку",
            adminCloudHint: "Безопасный вход администратора работает через Supabase.",
            adminAuthHint: "Для редактирования войдите через email и пароль администратора.",
            viewerCloudHint: "Гостевой код нужен только для входа на просмотр. Он не заменяет настоящую защиту.",
            unlock: "Открыть",
            enterAdmin: "Войти как админ",
            enterViewer: "Войти как гость",
            accessHint: "Подсказка: позже это можно заменить на настоящую авторизацию с сервером.",
            accessDenied: "Неверный код доступа.",
            accessAdminReady: "Режим администратора активирован.",
            accessViewerReady: "Гостевой режим активирован.",
            adminLoginFailed: "Не удалось войти как администратор. Проверь email и пароль.",
            adminRoleDenied: "Этот аккаунт не имеет права редактировать дерево.",
            cloudLoadFail: "Не удалось загрузить дерево из облака. Оставил локальную копию.",
            cloudSaveFail: "Не удалось сохранить изменения в облако.",
            cloudSyncReady: "Облачная синхронизация включена.",
            cloudSdkMissing: "Не удалось подключить Supabase. Проверь интернет и адрес проекта в конфиге.",
            switchMode: "Сменить режим",
            modeLabel: "Режим",
            treeLabel: "Древо",
            tipLabel: "Подсказка",
            tipAdmin: "Нажмите на карточку человека чтобы открыть анкету и править данные.",
            tipViewer: "Нажмите на карточку человека чтобы открыть анкету и посмотреть историю.",
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
            openTreeMode: "К древу",
            howItWorks: "Как это работает",
            backToMenu: "Меню",
            viewerGuideTitle: "Как смотреть древо",
            viewerGuideText: "Здесь открыт безопасный режим просмотра для родственников без редактирования.",
            viewerGuidePoint1: "Нажмите на карточку человека, чтобы открыть профиль и историю.",
            viewerGuidePoint2: "Кнопка «К древу» на телефоне прячет верхнюю панель и оставляет чистый просмотр.",
            viewerGuidePoint3: "Можно искать людей, менять язык, тему и масштаб, не боясь что-то испортить.",
            viewerGuideCta: "Понятно",
            bioLanguageHint: "Заполняйте только нужные языки: пустые вкладки автоматически берут текст из доступной версии.",
            mapPlacesTitle: "Места на карте",
            mapPlacesHint: "Выберите место ниже, и карта откроется прямо в анкете.",
            mapPlacesEmpty: "Пока нет мест, которые можно открыть на карте.",
            openOnMap: "Открыть на карте",
            showOnMap: "Показать на карте",
            authRemoteHint: "Можно подключить серверную проверку кода через auth-config.js.",
            familyStory: "История рода",
            familyStoryText: "Короткий обзор по людям, фамилиям, местам и незаполненным данным.",
            suggestUpdate: "Предложить правку",
            feedbackMailSubject: "Предложение по семейному древу",
            feedbackMailIntro: "Здравствуйте! Хочу предложить изменение или дополнение для семейного древа.",
            feedbackMailPerson: "О ком идет речь",
            feedbackMailChange: "Что нужно изменить или добавить",
            feedbackMailContact: "Мой контакт для уточнения",
            feedbackModalTitle: "Предложить правку",
            feedbackModalText: "Если заметили ошибку или хотите дополнить историю семьи, отправьте сообщение владельцу сайта.",
            feedbackEmailLabel: "Почта для связи",
            openGmail: "Открыть Gmail",
            copyEmail: "Скопировать почту",
            copyTemplate: "Скопировать текст",
            emailCopied: "Почта скопирована.",
            feedbackCopied: "Текст для сообщения скопирован.",
            timelineLabel: "Хронология жизни",
            timelineHint: "По одному событию на строку: рождение, переезд, учёба, брак, служба и так далее.",
            mediaLinksLabel: "Фото и документы",
            mediaLinksHint: "Вставляйте ссылки по одной на строку: фото, видео, документы, аудио.",
            mediaLinksEmpty: "Ссылки на фото и документы пока не добавлены.",
            marriageDateLabel: "Дата бракосочетания",
            marriagePlaceLabel: "Место бракосочетания",
            photoAlbumLabel: "Фотоальбом",
            photoAlbumHint: "Фотографии хранятся прямо в анкете. Лучше загружать изображения до 700 КБ.",
            addPhotos: "Добавить фото",
            photoAlbumEmpty: "Фотографии пока не добавлены.",
            removePhoto: "Удалить",
            summarySurnames: "Фамилии",
            summaryPlaces: "Ключевые места",
            summaryGaps: "Нужно заполнить",
            summaryTimeline: "Хронология",
            summaryMedia: "Материалы",
            incompleteBadge: "неполно",
            noDataYet: "Пока данных мало, но основа уже собрана."
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
            showAccessCode: "Kodni ko'rsatish",
            hideAccessCode: "Kodni yashirish",
            adminEmailLabel: "Administrator emaili",
            adminEmailPlaceholder: "you@example.com",
            adminPasswordPlaceholder: "Parolni kiriting",
            showPassword: "Parolni ko'rsatish",
            hidePassword: "Parolni yashirish",
            adminLogin: "Admin panelga kirish",
            adminCloudHint: "Administratorning xavfsiz kirishi Supabase orqali ishlaydi.",
            adminAuthHint: "Tahrirlash uchun administrator emaili va paroli bilan kiring.",
            viewerCloudHint: "Mehmon kodi faqat ko'rish rejimiga kirish uchun. Bu haqiqiy himoya o'rnini bosa olmaydi.",
            unlock: "Ochish",
            enterAdmin: "Admin sifatida kirish",
            enterViewer: "Mehmon sifatida kirish",
            accessHint: "Keyinroq buni serverdagi haqiqiy avtorizatsiyaga almashtirish mumkin.",
            accessDenied: "Kirish kodi noto'g'ri.",
            accessAdminReady: "Administrator rejimi yoqildi.",
            accessViewerReady: "Mehmon rejimi yoqildi.",
            adminLoginFailed: "Administrator sifatida kirib bo'lmadi. Email va parolni tekshiring.",
            adminRoleDenied: "Bu akkaunt daraxtni tahrirlash huquqiga ega emas.",
            cloudLoadFail: "Bulutdan daraxtni yuklab bo'lmadi. Mahalliy nusxa qoldirildi.",
            cloudSaveFail: "O'zgarishlarni bulutga saqlab bo'lmadi.",
            cloudSyncReady: "Bulutli sinxronizatsiya yoqildi.",
            cloudSdkMissing: "Supabase ulanmagan. Internet va konfiguratsiyadagi loyiha manzilini tekshiring.",
            switchMode: "Rejimni almashtirish",
            modeLabel: "Rejim",
            treeLabel: "Daraxt",
            tipLabel: "Maslahat",
            tipAdmin: "Нажмите на карточку человека чтобы открыть анкету и править данные.",
            tipViewer: "Нажмите на карточку человека чтобы открыть анкету и посмотреть историю.",
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
            viewerGuideCta: "Tushunarli",
            bioLanguageHint: "Har bir til alohida saqlanadi: RU matni UZ yoki EN maydoniga o'tmaydi.",
            mapPlacesTitle: "Xaritadagi joylar",
            mapPlacesHint: "Quyidagi joylardan birini tanlang, xarita anketaning ichida ochiladi.",
            mapPlacesEmpty: "Xaritada ko'rsatish uchun hali joylar yo'q.",
            openOnMap: "Xaritada ochish",
            showOnMap: "Xaritada ko'rsatish",
            authRemoteHint: "Server tomondagi kod tekshiruvini auth-config.js orqali ulash mumkin.",
            familyStory: "Urug' hikoyasi",
            familyStoryText: "Odamlar, familiyalar, joylar va to'ldirilmagan ma'lumotlar bo'yicha qisqa ko'rinish.",
            suggestUpdate: "Tuzatish taklif qilish",
            feedbackMailSubject: "Nasab daraxti bo'yicha taklif",
            feedbackMailIntro: "Salom! Nasab daraxtiga o'zgartirish yoki qo'shimcha taklif qilmoqchiman.",
            feedbackMailPerson: "Gap qaysi odam haqida ketmoqda",
            feedbackMailChange: "Nimani o'zgartirish yoki qo'shish kerak",
            feedbackMailContact: "Aniqlashtirish uchun mening kontaktim",
            feedbackModalTitle: "Tuzatish taklif qilish",
            feedbackModalText: "Agar xatoni ko'rsangiz yoki oilaviy tarixni to'ldirmoqchi bo'lsangiz, sayt egasiga xabar yuboring.",
            feedbackEmailLabel: "Bog'lanish uchun pochta",
            openGmail: "Gmailni ochish",
            copyEmail: "Pochtani nusxalash",
            copyTemplate: "Matnni nusxalash",
            emailCopied: "Pochta nusxalandi.",
            feedbackCopied: "Xabar matni nusxalandi.",
            timelineLabel: "Hayot xronologiyasi",
            timelineHint: "Har satrga bitta voqea yozing: tug'ilish, ko'chish, o'qish, nikoh, xizmat va boshqalar.",
            mediaLinksLabel: "Foto va hujjatlar",
            mediaLinksHint: "Har satrga bittadan havola qo'ying: foto, video, hujjat yoki audio.",
            mediaLinksEmpty: "Foto va hujjatlarga havolalar hali qo'shilmagan.",
            marriageDateLabel: "Nikoh sanasi",
            marriagePlaceLabel: "Nikoh joyi",
            photoAlbumLabel: "Fotoalbom",
            photoAlbumHint: "Suratlar anketaning o'zida saqlanadi. 700 KB gacha bo'lgan fayllar yaxshiroq.",
            addPhotos: "Surat qo'shish",
            photoAlbumEmpty: "Suratlar hali qo'shilmagan.",
            removePhoto: "O'chirish",
            summarySurnames: "Familiyalar",
            summaryPlaces: "Asosiy joylar",
            summaryGaps: "To'ldirish kerak",
            summaryTimeline: "Xronologiya",
            summaryMedia: "Materiallar",
            incompleteBadge: "to'liq emas",
            noDataYet: "Hozircha ma'lumot kam, ammo asos tayyor."
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
            showAccessCode: "Show code",
            hideAccessCode: "Hide code",
            adminEmailLabel: "Administrator email",
            adminEmailPlaceholder: "you@example.com",
            adminPasswordPlaceholder: "Enter password",
            showPassword: "Show password",
            hidePassword: "Hide password",
            adminLogin: "Sign in as admin",
            adminCloudHint: "Secure administrator sign-in runs through Supabase.",
            adminAuthHint: "Use the administrator email and password to unlock editing.",
            viewerCloudHint: "The guest code only opens viewing mode. It is not a real privacy wall.",
            unlock: "Unlock",
            enterAdmin: "Enter as admin",
            enterViewer: "Enter as guest",
            accessHint: "Later this can be replaced with real server-side authentication.",
            accessDenied: "Invalid access code.",
            accessAdminReady: "Administrator mode enabled.",
            accessViewerReady: "Viewer mode enabled.",
            adminLoginFailed: "Could not sign in as administrator. Check the email and password.",
            adminRoleDenied: "This account is not allowed to edit the tree.",
            cloudLoadFail: "Could not load the tree from the cloud. Kept the local copy.",
            cloudSaveFail: "Could not save the latest changes to the cloud.",
            cloudSyncReady: "Cloud sync is enabled.",
            cloudSdkMissing: "Could not connect to Supabase. Check your internet connection and project URL.",
            switchMode: "Switch mode",
            modeLabel: "Mode",
            treeLabel: "Tree",
            tipLabel: "Tip",
            tipAdmin: "Нажмите на карточку человека чтобы открыть анкету и править данные.",
            tipViewer: "Нажмите на карточку человека чтобы открыть анкету и посмотреть историю.",
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
            viewerGuideCta: "Got it",
            bioLanguageHint: "Each language is stored separately: RU text does not overwrite UZ or EN.",
            mapPlacesTitle: "Places on the map",
            mapPlacesHint: "Pick a place below and the map will open inside the profile.",
            mapPlacesEmpty: "There are no places to display on the map yet.",
            openOnMap: "Open on map",
            showOnMap: "Show on map",
            authRemoteHint: "You can connect server-side code validation through auth-config.js.",
            familyStory: "Family story",
            familyStoryText: "A short overview of people, surnames, places and missing details.",
            suggestUpdate: "Suggest an edit",
            feedbackMailSubject: "Suggestion for the family tree",
            feedbackMailIntro: "Hello! I would like to suggest a change or addition for the family tree.",
            feedbackMailPerson: "Person concerned",
            feedbackMailChange: "What should be changed or added",
            feedbackMailContact: "My contact for follow-up",
            feedbackModalTitle: "Suggest an edit",
            feedbackModalText: "If you notice an error or want to add family history details, send a message to the site owner.",
            feedbackEmailLabel: "Contact email",
            openGmail: "Open Gmail",
            copyEmail: "Copy email",
            copyTemplate: "Copy message",
            emailCopied: "Email copied.",
            feedbackCopied: "Message template copied.",
            timelineLabel: "Life timeline",
            timelineHint: "One event per line: birth, move, studies, marriage, service and so on.",
            mediaLinksLabel: "Photos and documents",
            mediaLinksHint: "Paste one link per line: photo, video, document or audio.",
            mediaLinksEmpty: "No photo or document links have been added yet.",
            marriageDateLabel: "Marriage date",
            marriagePlaceLabel: "Marriage place",
            photoAlbumLabel: "Photo album",
            photoAlbumHint: "Photos are stored directly in the profile. Images under 700 KB work best.",
            addPhotos: "Add photos",
            photoAlbumEmpty: "No photos added yet.",
            removePhoto: "Remove",
            summarySurnames: "Surnames",
            summaryPlaces: "Key places",
            summaryGaps: "Needs filling",
            summaryTimeline: "Timeline",
            summaryMedia: "Materials",
            incompleteBadge: "incomplete",
            noDataYet: "There is not much data yet, but the foundation is already here."
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
        currentModalTitleKey: "newPersonTitle",
        profileBioLanguage: "ru",
        draftDetailsTranslations: null,
        activeMapQuery: "",
        isFocusPanelOpen: false,
        isMobileTreeFocus: false,
        cloudSyncEnabled: false,
        cloudDataLoaded: false
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
    let suppressNodeSelectionUntil = 0;
    let cameraAnimationFrame = null;

    const birthPicker = initDatePicker("#fBirth");
    const deathPicker = initDatePicker("#fDeath");
    const marriagePicker = initDatePicker("#fMarriageDate");

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
    void initCloudAccess();

    function t(key) {
        return translations[state.language][key] || translations.ru[key] || key;
    }

    function suppressNodeSelection(duration = 420) {
        suppressNodeSelectionUntil = Date.now() + duration;
    }

    function getPhotoSrc(value) {
        return typeof value === "string" && value.trim() ? value : DEFAULT_AVATAR;
    }

    function setFocusPanelVisibility(visible) {
        state.isFocusPanelOpen = Boolean(visible);
        const personPanel = getEl("personPanel");
        const hasFocusPerson = Boolean(graph.getPerson(graph.getFocus()));
        personPanel.classList.toggle("hidden", !state.isFocusPanelOpen || !hasFocusPerson);
    }

    function syncViewerMobileActions() {
        const actions = document.querySelector(".mobile-viewer-actions");
        const backMenu = getEl("mobileBackToMenu");
        const isViewer = state.mode === "viewer";
        const showTreeActions = isViewer && !state.isMobileTreeFocus;
        const showBackMenu = isViewer && state.isMobileTreeFocus;

        if (actions) {
            actions.classList.toggle("hidden", !showTreeActions);
            actions.querySelectorAll("button").forEach((button) => {
                button.disabled = !showTreeActions;
            });
        }

        if (backMenu) {
            backMenu.classList.toggle("hidden", !showBackMenu);
            backMenu.querySelectorAll("button").forEach((button) => {
                button.disabled = !showBackMenu;
            });
        }

        syncMobileShellInteractivity();
    }

    function syncMobileShellInteractivity() {
        const shouldLock = state.mode === "viewer" && state.isMobileTreeFocus && window.innerWidth < 768;
        document.querySelectorAll(".ui-shell button, .ui-shell input").forEach((element) => {
            if (shouldLock) {
                if (!element.dataset.lockedDisabledState) {
                    element.dataset.lockedDisabledState = element.disabled ? "1" : "0";
                }
                element.disabled = true;
                return;
            }

            if (!Object.prototype.hasOwnProperty.call(element.dataset, "lockedDisabledState")) return;
            element.disabled = element.dataset.lockedDisabledState === "1";
            delete element.dataset.lockedDisabledState;
        });
    }

    function updateAccessCodeToggleUi() {
        const toggle = getEl("toggleAccessCodeVisibility");
        const input = getEl("accessCodeInput");
        if (!toggle || !input) return;

        const isVisible = input.type === "text";
        toggle.classList.toggle("is-visible", isVisible);
        toggle.setAttribute("aria-pressed", String(isVisible));
        toggle.setAttribute("aria-label", t(isVisible ? "hideAccessCode" : "showAccessCode"));
    }

    function updatePasswordToggleUi(toggleId, inputId, showKey = "showPassword", hideKey = "hidePassword") {
        const toggle = getEl(toggleId);
        const input = getEl(inputId);
        if (!toggle || !input) return;

        const isVisible = input.type === "text";
        toggle.classList.toggle("is-visible", isVisible);
        toggle.setAttribute("aria-pressed", String(isVisible));
        toggle.setAttribute("aria-label", t(isVisible ? hideKey : showKey));
    }

    function getSupabaseProjectUrl() {
        if (!SUPABASE_CONFIG || !SUPABASE_CONFIG.url) return "";
        return String(SUPABASE_CONFIG.url)
            .replace(/\/+$/, "")
            .replace(/\/rest\/v1$/i, "");
    }

    function getSupabaseConfigured() {
        return Boolean(
            SUPABASE_CONFIG &&
            getSupabaseProjectUrl() &&
            SUPABASE_CONFIG.anonKey
        );
    }

    function getSupabaseEnabled() {
        return Boolean(
            getSupabaseConfigured() &&
            window.supabase &&
            typeof window.supabase.createClient === "function"
        );
    }

    function initSupabaseClient() {
        if (!getSupabaseEnabled()) return null;
        if (!supabaseClient) {
            supabaseClient = window.supabase.createClient(getSupabaseProjectUrl(), SUPABASE_CONFIG.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });
        }
        return supabaseClient;
    }

    async function initCloudAccess() {
        if (!getSupabaseEnabled()) return;

        try {
            await loadRemoteGraph(false);
        } catch (error) {
            showCustomAlert(t("cloudLoadFail"));
        }

        try {
            const client = initSupabaseClient();
            const { data } = await client.auth.getSession();
            if (!data || !data.session) {
                if (state.mode === "admin") {
                    state.mode = null;
                    persistMode();
                    updateModeUi();
                    getEl("accessGate").classList.remove("hidden");
                }
                updateAccessModeButtons();
                updateAccessGateUi();
                return;
            }

            const role = await getCloudRole();
            if (role !== "admin") {
                await client.auth.signOut();
                state.mode = null;
                persistMode();
                updateModeUi();
                getEl("accessGate").classList.remove("hidden");
                updateAccessModeButtons();
                updateAccessGateUi();
                return;
            }

            state.cloudSyncEnabled = true;
            state.pendingMode = "admin";
            await applyAccessMode("admin", false, true);
        } catch (error) {
            showCustomAlert(t("cloudLoadFail"));
        }
    }

    async function loadRemoteGraph(showToastOnFail = true) {
        const client = initSupabaseClient();
        if (!client) return false;

        const { data, error } = await client
            .from(CLOUD_TREE_TABLE)
            .select("data")
            .eq("slug", CLOUD_TREE_SLUG)
            .maybeSingle();

        if (error) {
            if (showToastOnFail) showCustomAlert(t("cloudLoadFail"));
            return false;
        }

        if (!data || !data.data) return false;

        graph.load(data.data);
        state.cloudDataLoaded = true;
        render(true);
        updateFocusPanel();
        updateEmptyState();
        return true;
    }

    async function getCloudRole() {
        const client = initSupabaseClient();
        if (!client) return null;

        const { data, error } = await client
            .from(CLOUD_ROLE_TABLE)
            .select("role")
            .maybeSingle();

        if (error) return null;
        return data?.role || null;
    }

    function queueRemoteSave() {
        if (!getSupabaseEnabled() || !isAdminMode()) return;
        window.clearTimeout(remoteSaveTimer);
        remoteSaveTimer = window.setTimeout(() => {
            void flushRemoteSave();
        }, 420);
    }

    async function flushRemoteSave(force = false) {
        if (!getSupabaseEnabled() || (!isAdminMode() && !force)) return;
        if (remoteSaveInFlight) {
            remoteSaveQueued = true;
            return;
        }

        remoteSaveInFlight = true;
        remoteSaveQueued = false;

        const client = initSupabaseClient();
        const payload = {
            slug: CLOUD_TREE_SLUG,
            data: graph.toJSON(),
            updated_at: new Date().toISOString()
        };

        const { error } = await client
            .from(CLOUD_TREE_TABLE)
            .upsert(payload, { onConflict: "slug" });

        remoteSaveInFlight = false;

        if (error) {
            showCustomAlert(t("cloudSaveFail"));
            return;
        }

        state.cloudSyncEnabled = true;
        state.cloudDataLoaded = true;
        if (remoteSaveQueued) {
            remoteSaveQueued = false;
            void flushRemoteSave();
        }
    }

    async function signInCloudAdmin() {
        const client = initSupabaseClient();
        if (!client) {
            showCustomAlert(t("cloudSdkMissing"));
            return false;
        }

        const email = getEl("adminEmailInput").value.trim();
        const password = getEl("adminPasswordInput").value;
        if (!email || !password) {
            showCustomAlert(t("adminLoginFailed"));
            return false;
        }

        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) {
            showCustomAlert(t("adminLoginFailed"));
            return false;
        }

        const role = await getCloudRole();
        if (role !== "admin") {
            await client.auth.signOut();
            showCustomAlert(t("adminRoleDenied"));
            return false;
        }

        state.cloudSyncEnabled = true;
        const loaded = await loadRemoteGraph(false);
        if (!loaded && graph.people.size) {
            await flushRemoteSave(true);
        }
        showCustomAlert(t("cloudSyncReady"));
        return true;
    }

    async function signOutCloudAdmin() {
        const client = initSupabaseClient();
        if (!client) return;
        await client.auth.signOut();
    }

    function normalizeBioTranslations(value, fallback = "") {
        const result = { ru: "", uz: "", en: "" };
        if (value && typeof value === "object") {
            Object.keys(result).forEach((lang) => {
                result[lang] = typeof value[lang] === "string" ? value[lang] : "";
            });
        }
        if (!result.ru && fallback) result.ru = fallback;
        return result;
    }

    function getLocalizedBio(person, lang = state.language) {
        const bioTranslations = normalizeBioTranslations(person.bioTranslations, person.bio || "");
        return bioTranslations[lang] || "";
    }

    function normalizeDetailsTranslations(value, fallback = {}) {
        const createLang = () => ({
            birthPlace: "",
            deathPlace: "",
            livingPlaces: "",
            burialPlace: "",
            profession: "",
            education: "",
            marriagePlace: ""
        });
        const result = { ru: createLang(), uz: createLang(), en: createLang() };
        if (value && typeof value === "object") {
            Object.keys(result).forEach((lang) => {
                if (!value[lang] || typeof value[lang] !== "object") return;
                Object.keys(result[lang]).forEach((field) => {
                    result[lang][field] = typeof value[lang][field] === "string" ? value[lang][field] : "";
                });
            });
        }
        Object.keys(result.ru).forEach((field) => {
            if (!result.ru[field] && typeof fallback[field] === "string") {
                result.ru[field] = fallback[field];
            }
        });
        return result;
    }

    function syncCurrentProfileLanguageFields() {
        if (!state.draftDetailsTranslations) return;
        state.draftDetailsTranslations[state.profileBioLanguage] = {
            birthPlace: getEl("fBirthPlace").value.trim(),
            deathPlace: getEl("fDeathPlace").value.trim(),
            livingPlaces: getEl("fLiving").value.trim(),
            burialPlace: getEl("fBurial").value.trim(),
            profession: getEl("fProf").value.trim(),
            education: getEl("fEdu").value.trim(),
            marriagePlace: getEl("fMarriagePlace").value.trim()
        };
    }

    function applyProfileLanguageFields(lang) {
        const details = normalizeDetailsTranslations(state.draftDetailsTranslations || {}, {})[lang];
        getEl("fBirthPlace").value = details.birthPlace || "";
        getEl("fDeathPlace").value = details.deathPlace || "";
        getEl("fLiving").value = details.livingPlaces || "";
        getEl("fBurial").value = details.burialPlace || "";
        getEl("fProf").value = details.profession || "";
        getEl("fEdu").value = details.education || "";
        getEl("fMarriagePlace").value = details.marriagePlace || "";
        renderProfileMapPlaces({
            birthPlace: details.birthPlace,
            livingPlaces: details.livingPlaces,
            deathPlace: details.deathPlace,
            burialPlace: details.burialPlace,
            marriagePlace: details.marriagePlace
        });
    }

    function getLocalizedDetail(person, field, lang = state.language) {
        const details = normalizeDetailsTranslations(person.detailsTranslations, {
            birthPlace: person.birthPlace || "",
            deathPlace: person.deathPlace || "",
            livingPlaces: person.livingPlaces || "",
            burialPlace: person.burialPlace || "",
            profession: person.profession || "",
            education: person.education || "",
            marriagePlace: person.marriagePlace || ""
        });
        return details[lang]?.[field] || "";
    }

    function getBioInput(lang) {
        return document.querySelector(`[data-bio-input="${lang}"]`);
    }

    function getBioTranslationsFromInputs() {
        return {
            ru: getBioInput("ru")?.value.trim() || "",
            uz: getBioInput("uz")?.value.trim() || "",
            en: getBioInput("en")?.value.trim() || ""
        };
    }

    function setBioTranslationsToInputs(value, fallback = "") {
        const translationsMap = normalizeBioTranslations(value, fallback);
        Object.keys(translationsMap).forEach((lang) => {
            const input = getBioInput(lang);
            if (input) input.value = translationsMap[lang];
        });
    }

    function setActiveBioLanguage(lang) {
        if (state.profileBioLanguage !== lang) {
            syncCurrentProfileLanguageFields();
        }
        state.profileBioLanguage = ["ru", "uz", "en"].includes(lang) ? lang : "ru";
        updateBioLanguageButtons();
        document.querySelectorAll("[data-bio-input]").forEach((node) => {
            node.classList.toggle("hidden", node.dataset.bioInput !== state.profileBioLanguage);
        });
        applyProfileLanguageFields(state.profileBioLanguage);
    }

    function getRemoteAuthEnabled() {
        return Boolean(REMOTE_AUTH_CONFIG && REMOTE_AUTH_CONFIG.endpoint);
    }

    async function resolveAccessMode(code, requestedMode) {
        if (getSupabaseEnabled() && requestedMode === "admin") {
            return null;
        }

        if (!getRemoteAuthEnabled()) {
            const detectedMode = Object.entries(ACCESS_CODES).find(([, value]) => value === code)?.[0];
            const finalMode = detectedMode || requestedMode;
            const expectedCode = ACCESS_CODES[finalMode];
            if (code !== expectedCode) return null;
            return { mode: finalMode, source: "local" };
        }

        const controller = new AbortController();
        const timeoutMs = Number(REMOTE_AUTH_CONFIG.timeoutMs) || 8000;
        const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(REMOTE_AUTH_CONFIG.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(REMOTE_AUTH_CONFIG.siteKey ? { "x-site-key": REMOTE_AUTH_CONFIG.siteKey } : {})
                },
            body: JSON.stringify({
                    code,
                    requestedMode
                }),
                signal: controller.signal
            });

            if (!response.ok) return null;
            const payload = await response.json();
            if (!payload || (payload.mode !== "admin" && payload.mode !== "viewer")) return null;
            return { mode: payload.mode, source: "remote" };
        } catch (error) {
            return null;
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    function isAdminMode() {
        return state.mode === "admin";
    }

    function getMissingFields(person) {
        const missing = [];
        if (!person.birthDate) missing.push(t("birthDateLabel"));
        if (!person.name) missing.push(t("fullNameLabel"));
        if (!getLocalizedDetail(person, "birthPlace") && !person.birthDate) {
            missing.push(t("birthPlaceLabel"));
        }
        if (!getLocalizedBio(person)) {
            missing.push(t("bioLabel"));
        }
        return missing;
    }

    function initDatePicker(selector) {
        if (!window.flatpickr) {
            return {
                clear: () => {},
                setDate: () => {},
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

    function setPickerValue(picker, inputId, value) {
        const normalized = String(value || "").trim();
        const input = getEl(inputId);
        if (picker && typeof picker.setDate === "function") {
            picker.setDate(normalized, false, "d.m.Y");
        } else if (input) {
            input.value = normalized;
        }
        if (input) input.value = normalized;
    }

    function getPickerValue(picker, inputId) {
        if (picker && picker._input) {
            return String(picker._input.value || "").trim();
        }
        const input = getEl(inputId);
        return input ? String(input.value || "").trim() : "";
    }

    function getCalendarLocale() {
        if (state.language === "ru" && window.flatpickr && flatpickr.l10ns && flatpickr.l10ns.ru) return flatpickr.l10ns.ru;
        if (state.language === "uz") return uzLocale;
        return "default";
    }

    function saveGraph() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(graph.toJSON()));
            queueRemoteSave();
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
            const guardTap = (event) => {
                if (!event.target.closest(".segment-btn[data-lang]")) return;
                event.stopPropagation();
                suppressNodeSelection();
            };
            switcher.addEventListener("pointerdown", guardTap);
            switcher.addEventListener("touchstart", guardTap, { passive: true });
            switcher.addEventListener("click", (event) => {
                const button = event.target.closest(".segment-btn[data-lang]");
                if (!button) return;
                event.preventDefault();
                event.stopPropagation();
                suppressNodeSelection();
                setLanguage(button.dataset.lang);
            });
        });
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        suppressNodeSelection();
        state.language = lang;
        animateUiTransition("locale", { x: window.innerWidth * 0.16, y: window.innerHeight * 0.12 });
        document.documentElement.lang = lang;
        if (!getEl("fullProfileModal").classList.contains("hidden")) {
            setActiveBioLanguage(lang);
        }
        applyTranslations();
        [birthPicker, deathPicker, marriagePicker].forEach((picker) => {
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

    function updateBioLanguageButtons() {
        document.querySelectorAll(".segment-btn[data-bio-lang]").forEach((button) => {
            button.classList.toggle("active", button.dataset.bioLang === state.profileBioLanguage);
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
        updateBioLanguageButtons();
        updateThemeLabels();
        if (getRemoteAuthEnabled()) {
            getEl("accessHint").textContent = t("authRemoteHint");
        }
        updateAccessCodeToggleUi();
        updatePasswordToggleUi("toggleAdminPasswordVisibility", "adminPasswordInput");
        updateAccessGateUi();
        updateEmptyState();
        updateFocusPanel();
        renderProfileMapPlaces(graph.getPerson(graph.getFocus()));
        if (!getEl("fullProfileModal").classList.contains("hidden")) {
            setActiveBioLanguage(state.profileBioLanguage);
        }
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

    function openImageLightbox(src) {
        if (!src) return;
        getEl("imageLightboxPreview").src = src;
        getEl("imageLightboxModal").classList.remove("hidden");
    }

    function closeImageLightbox() {
        getEl("imageLightboxModal").classList.add("hidden");
        getEl("imageLightboxPreview").removeAttribute("src");
    }

    function buildFeedbackDraft() {
        const focusedPerson = graph.getPerson(graph.getFocus());
        const personValue = getEl("feedbackPersonInput")?.value.trim() || focusedPerson?.name || "—";
        const messageValue = getEl("feedbackMessageInput")?.value.trim() || "";
        const contactValue = getEl("feedbackContactInput")?.value.trim() || "";
        return {
            subject: t("feedbackMailSubject"),
            body: [
                t("feedbackMailIntro"),
                "",
                `${t("feedbackMailPerson")}: ${personValue}`,
                `${t("feedbackMailChange")}:`,
                messageValue || "—",
                "",
                `${t("feedbackMailContact")}: ${contactValue || "—"}`
            ].join("\n")
        };
    }

    function fillFeedbackForm() {
        const focusedPerson = graph.getPerson(graph.getFocus());
        const personInput = getEl("feedbackPersonInput");
        if (personInput && !personInput.value.trim()) personInput.value = focusedPerson?.name || "";
    }

    async function copyTextToClipboard(value) {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            await navigator.clipboard.writeText(value);
            return true;
        }

        const helper = document.createElement("textarea");
        helper.value = value;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        return copied;
    }

    function openFeedbackModal() {
        getEl("feedbackEmailValue").textContent = FEEDBACK_EMAIL;
        fillFeedbackForm();
        getEl("feedbackModal").classList.remove("hidden");
    }

    function closeFeedbackModal() {
        getEl("feedbackModal").classList.add("hidden");
    }

    function openFeedbackGmail() {
        const draft = buildFeedbackDraft();
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(FEEDBACK_EMAIL)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.open(gmailUrl, "_blank", "noopener");
    }

    function openFeedbackMailApp() {
        const draft = buildFeedbackDraft();
        const mailtoUrl = `mailto:${encodeURIComponent(FEEDBACK_EMAIL)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
        window.location.href = mailtoUrl;
    }

    function updateAccessGateUi() {
        const useCloudAdmin = getSupabaseConfigured() && state.pendingMode === "admin";
        getEl("codeAccessPanel").classList.toggle("hidden", useCloudAdmin);
        getEl("adminAuthPanel").classList.toggle("hidden", !useCloudAdmin);

        const hint = getEl("accessHint");
        if (!hint) return;

        if (useCloudAdmin) {
            hint.textContent = t("adminAuthHint");
            return;
        }

        if (getSupabaseConfigured()) {
            hint.textContent = t("viewerCloudHint");
            return;
        }

        if (getRemoteAuthEnabled()) {
            hint.textContent = t("authRemoteHint");
            return;
        }

        hint.textContent = t("accessHint");
    }

    async function applyAccessMode(finalMode, showToast = true, skipRemoteLoad = false) {
        state.mode = finalMode;
        state.pendingMode = finalMode;
        persistMode();
        state.isMobileTreeFocus = false;
        setFocusPanelVisibility(false);
        updateModeUi();
        getEl("accessGate").classList.add("hidden");
        getEl("accessCodeInput").value = "";
        getEl("accessCodeInput").type = "password";
        getEl("adminPasswordInput").value = "";
        updateAccessCodeToggleUi();
        updatePasswordToggleUi("toggleAdminPasswordVisibility", "adminPasswordInput");

        if (!skipRemoteLoad && getSupabaseEnabled()) {
            await loadRemoteGraph(false);
        }

        if (showToast) {
            showCustomAlert(isAdminMode() ? t("accessAdminReady") : t("accessViewerReady"));
        }

        updateFocusPanel();
        if (finalMode === "viewer") {
            maybeOpenViewerGuide();
        } else {
            closeViewerGuide();
            setMobileTreeFocus(false);
        }
    }

    function initAccessGate() {
        const gate = getEl("accessGate");
        const input = getEl("accessCodeInput");
        const unlockBtn = getEl("unlockBtn");
        const toggleBtn = getEl("toggleAccessCodeVisibility");
        const adminEmailInput = getEl("adminEmailInput");
        const adminPasswordInput = getEl("adminPasswordInput");
        const adminLoginBtn = getEl("adminLoginBtn");
        const adminToggleBtn = getEl("toggleAdminPasswordVisibility");
        const hint = getEl("accessHint");

        if (hint && getRemoteAuthEnabled()) {
            hint.textContent = t("authRemoteHint");
        }

        document.querySelectorAll("[data-mode-trigger]").forEach((button) => {
            button.addEventListener("click", () => {
                state.pendingMode = button.dataset.modeTrigger;
                updateAccessModeButtons();
                updateAccessGateUi();
                if (getSupabaseConfigured() && state.pendingMode === "admin") {
                    adminEmailInput.focus();
                    adminEmailInput.select();
                } else {
                    input.focus();
                    input.select();
                }
            });
        });

        unlockBtn.addEventListener("click", () => {
            unlockWithCode();
        });
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") unlockWithCode();
        });
        adminLoginBtn.addEventListener("click", () => {
            unlockAdminCloud();
        });
        adminEmailInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                unlockAdminCloud();
            }
        });
        adminPasswordInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                unlockAdminCloud();
            }
        });
        toggleBtn.addEventListener("click", () => {
            input.type = input.type === "password" ? "text" : "password";
            updateAccessCodeToggleUi();
            input.focus();
            const length = input.value.length;
            input.setSelectionRange(length, length);
        });
        adminToggleBtn.addEventListener("click", () => {
            adminPasswordInput.type = adminPasswordInput.type === "password" ? "text" : "password";
            updatePasswordToggleUi("toggleAdminPasswordVisibility", "adminPasswordInput");
            adminPasswordInput.focus();
            const length = adminPasswordInput.value.length;
            adminPasswordInput.setSelectionRange(length, length);
        });
        updateAccessCodeToggleUi();
        updatePasswordToggleUi("toggleAdminPasswordVisibility", "adminPasswordInput");
        if (SUPABASE_CONFIG && SUPABASE_CONFIG.adminEmail) {
            adminEmailInput.value = SUPABASE_CONFIG.adminEmail;
        }
        updateAccessGateUi();

        if (state.mode) {
            gate.classList.add("hidden");
        } else {
            updateAccessModeButtons();
            if (getSupabaseConfigured() && state.pendingMode === "admin") {
                adminEmailInput.focus();
            } else {
                input.focus();
            }
        }
    }

    async function unlockWithCode() {
        const input = getEl("accessCodeInput");
        const unlockBtn = getEl("unlockBtn");
        const code = input.value.trim();
        if (!code) {
            showCustomAlert(t("accessDenied"));
            return;
        }

        const requestedMode = state.pendingMode || "viewer";
        unlockBtn.disabled = true;
        const authResult = await resolveAccessMode(code, requestedMode);
        unlockBtn.disabled = false;

        if (!authResult) {
            showCustomAlert(t("accessDenied"));
            input.select();
            return;
        }

        await applyAccessMode(authResult.mode);
    }

    async function unlockAdminCloud() {
        const adminLoginBtn = getEl("adminLoginBtn");
        adminLoginBtn.disabled = true;
        const success = await signInCloudAdmin();
        adminLoginBtn.disabled = false;
        if (!success) return;
        await applyAccessMode("admin", true, true);
        if (!state.cloudDataLoaded && graph.people.size) {
            await flushRemoteSave(true);
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
        if (window.innerWidth > 768) {
            state.isMobileTreeFocus = false;
            syncViewerMobileActions();
            return;
        }
        const nextState = Boolean(enabled && state.mode === "viewer");
        state.isMobileTreeFocus = nextState;
        document.body.classList.toggle("mobile-tree-focus", nextState);
        if (nextState) {
            setFocusPanelVisibility(false);
            getEl("fullProfileModal").classList.add("hidden");
        }
        syncViewerMobileActions();
        suppressNodeSelection(260);
        updateMobileViewportMetrics();
        render(false);
    }

    function updateAccessModeButtons() {
        document.querySelectorAll("[data-mode-trigger]").forEach((button) => {
            const isActive = button.dataset.modeTrigger === state.pendingMode;
            button.classList.toggle("accent-fill", isActive);
            button.classList.toggle("primary", !isActive);
        });
        updateAccessGateUi();
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
                person.bio,
                ...Object.values(normalizeBioTranslations(person.bioTranslations, person.bio || ""))
                    .concat(Object.values(normalizeDetailsTranslations(person.detailsTranslations, {
                        birthPlace: person.birthPlace || "",
                        deathPlace: person.deathPlace || "",
                        livingPlaces: person.livingPlaces || "",
                        burialPlace: person.burialPlace || "",
                        profession: person.profession || "",
                        education: person.education || ""
                    })).flatMap((entry) => Object.values(entry)))
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
        getEl("closePersonPanel").addEventListener("click", () => {
            setFocusPanelVisibility(false);
            isMovingCamera = false;
        });
        getEl("zoomInBtn").addEventListener("click", () => setZoom(zoomLevel * 1.15));
        getEl("zoomOutBtn").addEventListener("click", () => setZoom(zoomLevel * 0.85));
        getEl("modeSwitchBtn").addEventListener("click", async () => {
            if (getSupabaseEnabled() && isAdminMode()) {
                await signOutCloudAdmin();
                state.cloudSyncEnabled = false;
            }
            state.mode = null;
            persistMode();
            state.pendingMode = "viewer";
            state.isMobileTreeFocus = false;
            setFocusPanelVisibility(false);
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
        getEl("closeImageLightbox").addEventListener("click", closeImageLightbox);
        getEl("imageLightboxModal").addEventListener("click", (event) => {
            if (event.target.id === "imageLightboxModal") closeImageLightbox();
        });
        getEl("familyStoryBtn").addEventListener("click", () => {
            renderFamilyStory();
            getEl("familyStoryModal").classList.remove("hidden");
        });
        getEl("viewerFeedbackBtn").addEventListener("click", openFeedbackModal);
        getEl("viewerFeedbackMobileBtn").addEventListener("click", openFeedbackModal);
        getEl("closeFamilyStoryBtn").addEventListener("click", () => getEl("familyStoryModal").classList.add("hidden"));
        getEl("familyStoryModal").addEventListener("click", (event) => {
            if (event.target.id === "familyStoryModal") getEl("familyStoryModal").classList.add("hidden");
        });
        getEl("closeFeedbackModalBtn").addEventListener("click", closeFeedbackModal);
        getEl("feedbackModal").addEventListener("click", (event) => {
            if (event.target.id === "feedbackModal") closeFeedbackModal();
        });
        getEl("openFeedbackMailBtn").addEventListener("click", openFeedbackMailApp);
        getEl("openFeedbackGmailBtn").addEventListener("click", openFeedbackGmail);
        getEl("copyFeedbackTextBtn").addEventListener("click", async () => {
            const copied = await copyTextToClipboard(buildFeedbackDraft().body);
            if (copied) showCustomAlert(t("feedbackCopied"));
        });

        document.querySelectorAll("[data-date-trigger]").forEach((button) => {
            button.addEventListener("click", () => {
                if (!guardAdminAction()) return;
                if (button.dataset.dateTrigger === "fBirth") birthPicker.open();
                if (button.dataset.dateTrigger === "fDeath") deathPicker.open();
                if (button.dataset.dateTrigger === "fMarriageDate") marriagePicker.open();
            });
        });

        window.addEventListener("resize", () => render(false));
        window.addEventListener("resize", updateMobileViewportMetrics);
    }

    function updateMobileViewportMetrics() {
        const topBar = document.querySelector(".top-bar");
        const topBarHeight = state.isMobileTreeFocus
            ? 0
            : (topBar ? Math.ceil(topBar.getBoundingClientRect().height) : 0);
        document.documentElement.style.setProperty("--top-ui-height", `${topBarHeight}px`);
        if (window.innerWidth > 768 && state.isMobileTreeFocus) {
            state.isMobileTreeFocus = false;
            document.body.classList.remove("mobile-tree-focus");
            syncViewerMobileActions();
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
        const closeProfileModal = () => {
            getEl("fullProfileModal").classList.add("hidden");
            if (window.innerWidth < 768 && state.mode === "viewer" && !state.isMobileTreeFocus) {
                setFocusPanelVisibility(true);
            }
        };
        getEl("closeFullProfile").addEventListener("click", closeProfileModal);
        getEl("closeProfileViewerBtn").addEventListener("click", closeProfileModal);
        getEl("closeModalBtn").addEventListener("click", closeRelationModal);
        getEl("profileModal").addEventListener("click", (event) => {
            if (event.target.id === "profileModal") closeRelationModal();
        });
        getEl("fullProfileModal").addEventListener("click", (event) => {
            if (event.target.id === "fullProfileModal") closeProfileModal();
        });
        getEl("openFullProfileBtn").addEventListener("click", openFullProfile);
        getEl("bioLanguageSwitcher").addEventListener("click", (event) => {
            const button = event.target.closest(".segment-btn[data-bio-lang]");
            if (!button) return;
            event.preventDefault();
            setActiveBioLanguage(button.dataset.bioLang);
        });
        getEl("openActiveMapBtn").addEventListener("click", () => {
            if (!state.activeMapQuery) return;
            window.open(`https://www.google.com/maps?q=${encodeURIComponent(state.activeMapQuery)}`, "_blank", "noopener");
        });

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

    function animateCameraTo(targetX, targetY, duration = 340) {
        if (cameraAnimationFrame) {
            cancelAnimationFrame(cameraAnimationFrame);
            cameraAnimationFrame = null;
        }

        const startX = translateX;
        const startY = translateY;
        const deltaX = targetX - startX;
        const deltaY = targetY - startY;

        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
            translateX = targetX;
            translateY = targetY;
            updateTransform();
            return;
        }

        const startTime = performance.now();
        const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

        const frame = (now) => {
            const progress = Math.min(1, (now - startTime) / duration);
            const eased = easeOutCubic(progress);
            translateX = startX + deltaX * eased;
            translateY = startY + deltaY * eased;
            updateTransform();

            if (progress < 1) {
                cameraAnimationFrame = requestAnimationFrame(frame);
            } else {
                cameraAnimationFrame = null;
            }
        };

        cameraAnimationFrame = requestAnimationFrame(frame);
    }

    function updateEmptyState() {
        const isEmpty = graph.people.size === 0;
        getEl("emptyState").classList.toggle("hidden", !isEmpty);
        if (isEmpty) setFocusPanelVisibility(false);
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

    function selectPerson(id, autoCenter = false, revealPanel = true) {
        if (!id) return;
        graph.setFocus(id);
        if (revealPanel) setFocusPanelVisibility(true);
        updateFocusPanel();
        if (!getEl("feedbackModal").classList.contains("hidden")) {
            const personInput = getEl("feedbackPersonInput");
            if (personInput) personInput.value = graph.getPerson(id)?.name || "";
        }
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
        syncViewerMobileActions();
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
            "fMarriageDate",
            "fBirthPlace",
            "fDeathPlace",
            "fEdu",
            "fProf",
            "fLiving",
            "fBurial",
            "fMarriagePlace",
            "fBioRu",
            "fBioUz",
            "fBioEn"
        ].forEach((id) => {
            getEl(id).readOnly = shouldLock;
        });

        getEl("fIsAlive").disabled = shouldLock;
        getEl("uploadPhoto").disabled = shouldLock;
        getEl("uploadGalleryPhotos").disabled = shouldLock;
        updateDeathInput(getEl("fIsAlive").checked, getEl("fDeath"));
    }

    function updateFocusPanel() {
        const person = graph.getPerson(graph.getFocus());
        if (!person) {
            setFocusPanelVisibility(false);
            return;
        }

        setFocusPanelVisibility(state.isFocusPanelOpen);
        getEl("panelAvatar").src = getPhotoSrc(person.photo);
        getEl("panelAvatar").onclick = () => openImageLightbox(getPhotoSrc(person.photo));
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
            getLocalizedBio(person),
            getLocalizedDetail(person, "profession"),
            getLocalizedDetail(person, "birthPlace"),
            getLocalizedDetail(person, "livingPlaces"),
            person.marriageDate ? `${t("marriageDateLabel")}: ${person.marriageDate}` : ""
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
            const targetX = window.innerWidth / 2 - coords[focusId].x * zoomLevel;
            const targetY = window.innerHeight / 2 - coords[focusId].y * zoomLevel;
            animateCameraTo(targetX, targetY);
        } else {
            updateTransform();
        }
        updateEmptyState();
    }

    function getLayoutMetrics() {
        const mobile = window.innerWidth < 768;
        return {
            nodeWidth: mobile ? 182 : 216,
            nodeHeight: mobile ? 150 : 168,
            nodeRadius: mobile ? 26 : 28,
            cardGap: mobile ? 28 : 42,
            spouseGap: mobile ? 28 : 34,
            verticalGap: mobile ? 228 : 270,
            photoRadius: mobile ? 29 : 32,
            photoYOffset: mobile ? -24 : -26,
            textStartY: mobile ? 26 : 34,
            storyY: mobile ? 74 : 86
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
        const groupGap = metrics.cardGap * 1.7;
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
        const missingFields = getMissingFields(person);
        group.setAttribute("class", `person-node${focused ? " focused" : ""}${missingFields.length ? " has-gaps" : ""}`);
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
        photo.setAttribute("href", getPhotoSrc(person.photo));
        photo.setAttribute("x", String(-metrics.photoRadius + 3));
        photo.setAttribute("y", String(metrics.photoYOffset - metrics.photoRadius + 3));
        photo.setAttribute("width", String(metrics.photoRadius * 2 - 6));
        photo.setAttribute("height", String(metrics.photoRadius * 2 - 6));
        photo.setAttribute("preserveAspectRatio", "xMidYMid slice");
        photo.setAttribute("clip-path", `circle(${metrics.photoRadius - 3}px at ${metrics.photoRadius - 3}px ${metrics.photoRadius - 3}px)`);

        const miniStory = window.innerWidth < 768 ? "" : getNodeMiniStory(person);
        const name = createText(0, metrics.textStartY, "node-name", shortenText(person.name || t("noName"), window.innerWidth < 768 ? 16 : 22));
        const years = createText(0, metrics.textStartY + 26, "node-meta", getYearsLabel(person));
        const story = miniStory ? createText(0, metrics.storyY, "node-story", shortenText(miniStory, 26)) : null;

        group.append(glow, card, accent, photoRing, photo, name, years);
        if (story) group.appendChild(story);

        if (missingFields.length) {
            const badge = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            badge.setAttribute("cx", String(metrics.nodeWidth / 2 - 18));
            badge.setAttribute("cy", String(-metrics.nodeHeight / 2 + 18));
            badge.setAttribute("r", "11");
            badge.setAttribute("class", "node-gap-badge");

            const badgeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            badgeText.setAttribute("x", String(metrics.nodeWidth / 2 - 18));
            badgeText.setAttribute("y", String(-metrics.nodeHeight / 2 + 22));
            badgeText.setAttribute("text-anchor", "middle");
            badgeText.setAttribute("class", "node-gap-text");
            badgeText.textContent = "!";

            group.append(badge, badgeText);
        }

        group.addEventListener("click", (event) => {
            event.stopPropagation();
            if (Date.now() < suppressNodeSelectionUntil) return;
            if (!isMovingCamera) selectPerson(id, true);
        });
        group.addEventListener("touchend", (event) => {
            event.stopPropagation();
            if (Date.now() < suppressNodeSelectionUntil) return;
            if (!isMovingCamera) {
                selectPerson(id, true);
            }
        }, { passive: true });
        return group;
    }

    function getNodeMiniStory(person) {
        const line = getLocalizedBio(person) || getLocalizedDetail(person, "profession") || getLocalizedDetail(person, "birthPlace") || "";
        return line.trim();
    }

    function createText(x, y, className, text) {
        const node = document.createElementNS("http://www.w3.org/2000/svg", "text");
        node.setAttribute("x", String(x));
        node.setAttribute("y", String(y));
        node.setAttribute("text-anchor", "middle");
        node.setAttribute("dominant-baseline", "middle");
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

    function getMapPlaceEntries(person) {
        if (!person) return [];
        return [
            { label: t("birthPlaceLabel"), value: getLocalizedDetail(person, "birthPlace") || person.birthPlace },
            { label: t("livingPlaceLabel"), value: getLocalizedDetail(person, "livingPlaces") || person.livingPlaces },
            { label: t("deathPlaceLabel"), value: getLocalizedDetail(person, "deathPlace") || person.deathPlace },
            { label: t("burialLabel"), value: getLocalizedDetail(person, "burialPlace") || person.burialPlace },
            { label: t("marriagePlaceLabel"), value: getLocalizedDetail(person, "marriagePlace") || person.marriagePlace }
        ].filter((item) => item.value);
    }

    function getMapEmbedUrl(query) {
        return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=6&output=embed`;
    }

    function setActiveMapPlace(place, row = null) {
        const embedCard = getEl("profileMapEmbedCard");
        const frame = getEl("profileMapFrame");
        const label = getEl("profileMapActiveLabel");

        if (!place) {
            state.activeMapQuery = "";
            embedCard.classList.add("hidden");
            frame.removeAttribute("src");
            label.textContent = "";
            return;
        }

        state.activeMapQuery = place.value;
        embedCard.classList.remove("hidden");
        frame.src = getMapEmbedUrl(place.value);
        label.textContent = `${place.label}: ${place.value}`;

        document.querySelectorAll(".map-place-item").forEach((item) => item.classList.remove("active"));
        if (row) row.classList.add("active");
    }

    function renderProfileMapPlaces(person) {
        const container = getEl("profileMapPlaces");
        if (!container) return;

        const places = getMapPlaceEntries(person);
        container.textContent = "";

        if (!places.length) {
            setActiveMapPlace(null);
            const empty = document.createElement("div");
            empty.className = "map-empty";
            empty.textContent = t("mapPlacesEmpty");
            container.appendChild(empty);
            return;
        }

        places.forEach((place) => {
            const row = document.createElement("div");
            row.className = "map-place-item";

            const copy = document.createElement("div");
            copy.className = "map-place-copy";

            const label = document.createElement("span");
            label.className = "map-place-label";
            label.textContent = place.label;

            const value = document.createElement("span");
            value.className = "map-place-value";
            value.textContent = place.value;

            const button = document.createElement("button");
            button.type = "button";
            button.className = "glass-btn";
            button.textContent = t("showOnMap");
            button.addEventListener("click", () => setActiveMapPlace(place, row));

            row.addEventListener("click", () => setActiveMapPlace(place, row));

            copy.append(label, value);
            row.append(copy, button);
            container.appendChild(row);
        });

        setActiveMapPlace(places[0], container.querySelector(".map-place-item"));
    }

    function renderPhotoGallery(list, person = null) {
        const container = getEl("profileMediaList");
        if (!container) return;
        container.textContent = "";
        if (!list.length) {
            const empty = document.createElement("div");
            empty.className = "map-empty";
            empty.textContent = t("photoAlbumEmpty");
            container.appendChild(empty);
            return;
        }

        list.forEach((url, index) => {
            const item = document.createElement("div");
            item.className = "media-photo-item";

            const image = document.createElement("img");
            image.src = url;
            image.alt = "Family photo";
            image.addEventListener("click", () => openImageLightbox(url));
            item.appendChild(image);

            if (isAdminMode() && person) {
                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.className = "glass-btn media-photo-remove";
                removeBtn.textContent = "×";
                removeBtn.title = t("removePhoto");
                removeBtn.addEventListener("click", (event) => {
                    event.stopPropagation();
                    person.photoGallery = (person.photoGallery || []).filter((_, photoIndex) => photoIndex !== index);
                    saveGraph();
                    renderPhotoGallery(person.photoGallery, person);
                });
                item.appendChild(removeBtn);
            }

            container.appendChild(item);
        });
    }

    function renderFamilyStory() {
        const container = getEl("familyStoryContent");
        if (!container) return;

        const people = Array.from(graph.people.values());
        container.textContent = "";

        if (!people.length) {
            const section = document.createElement("div");
            section.className = "story-section";
            section.textContent = t("noDataYet");
            container.appendChild(section);
            return;
        }

        const surnames = people
            .map((person) => (person.name || "").trim().split(/\s+/).slice(-1)[0])
            .filter((value) => value && value.length > 1);

        const places = people.flatMap((person) => [
            getLocalizedDetail(person, "birthPlace"),
            getLocalizedDetail(person, "livingPlaces"),
            getLocalizedDetail(person, "deathPlace"),
            getLocalizedDetail(person, "burialPlace"),
            getLocalizedDetail(person, "marriagePlace")
        ].filter(Boolean));

        const gaps = people
            .map((person) => ({ name: person.name || t("noName"), gaps: getMissingFields(person) }))
            .filter((item) => item.gaps.length);

        const sections = [
            { title: t("summarySurnames"), values: topValues(surnames) },
            { title: t("summaryPlaces"), values: topValues(places) },
            { title: t("summaryGaps"), values: gaps.map((item) => `${item.name}: ${item.gaps.join(", ")}`) }
        ];

        sections.forEach((sectionData) => {
            const section = document.createElement("div");
            section.className = "story-section";
            const heading = document.createElement("h4");
            heading.textContent = sectionData.title;
            section.appendChild(heading);

            if (!sectionData.values.length) {
                const paragraph = document.createElement("p");
                paragraph.textContent = t("noDataYet");
                section.appendChild(paragraph);
            } else {
                const list = document.createElement("ul");
                sectionData.values.slice(0, 8).forEach((value) => {
                    const item = document.createElement("li");
                    item.textContent = value;
                    list.appendChild(item);
                });
                section.appendChild(list);
            }

            container.appendChild(section);
        });
    }

    function topValues(values) {
        const counts = new Map();
        values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
        return Array.from(counts.entries())
            .sort((left, right) => right[1] - left[1])
            .map(([value, count]) => `${value} (${count})`);
    }

    function openFullProfile() {
        const person = graph.getPerson(graph.getFocus());
        if (!person) return;

        setFocusPanelVisibility(false);
        getEl("fName").value = person.name || "";
        getEl("fMaidenName").value = person.maidenName || "";
        getEl("modalAvatarPreview").src = getPhotoSrc(person.photo);
        getEl("modalAvatarPreview").onclick = () => openImageLightbox(getPhotoSrc(person.photo));
        setPickerValue(birthPicker, "fBirth", person.birthDate || "");
        setPickerValue(deathPicker, "fDeath", person.deathDate || "");
        state.draftDetailsTranslations = normalizeDetailsTranslations(person.detailsTranslations, {
            birthPlace: person.birthPlace || "",
            deathPlace: person.deathPlace || "",
            livingPlaces: person.livingPlaces || "",
            burialPlace: person.burialPlace || "",
            profession: person.profession || "",
            education: person.education || "",
            marriagePlace: person.marriagePlace || ""
        });
        setBioTranslationsToInputs(person.bioTranslations, person.bio || "");
        setActiveBioLanguage(translations[state.language] ? state.language : "ru");
        setPickerValue(marriagePicker, "fMarriageDate", person.marriageDate || "");
        renderPhotoGallery(person.photoGallery || [], person);

        const syncMapPlacesPreview = () => {
            renderProfileMapPlaces({
                birthPlace: getEl("fBirthPlace").value.trim(),
                livingPlaces: getEl("fLiving").value.trim(),
                deathPlace: getEl("fDeathPlace").value.trim(),
                burialPlace: getEl("fBurial").value.trim(),
                marriagePlace: getEl("fMarriagePlace").value.trim()
            });
        };
        ["fBirthPlace", "fLiving", "fDeathPlace", "fBurial", "fMarriagePlace"].forEach((id) => {
            getEl(id).oninput = syncMapPlacesPreview;
        });

        const aliveToggle = getEl("fIsAlive");
        const deathInput = getEl("fDeath");
        aliveToggle.checked = person.isAlive !== false;
        updateDeathInput(aliveToggle.checked, deathInput);
        updateReadonlyFields();

        aliveToggle.onchange = () => {
            if (aliveToggle.checked) deathPicker.clear();
            if (aliveToggle.checked) setPickerValue(deathPicker, "fDeath", "");
            updateDeathInput(aliveToggle.checked, deathInput);
        };

        const photoUpload = getEl("uploadPhoto");
        getEl("modalAvatarContainer").onclick = (event) => {
            if (!isAdminMode()) {
                if (!event.target.closest(".upload-badge") && !event.target.closest("#modalAvatarPreview")) showCustomAlert(t("readonlyToast"));
                return;
            }
            if (event.target.closest(".upload-badge")) return;
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

        const galleryUpload = getEl("uploadGalleryPhotos");
        galleryUpload.onchange = (event) => {
            if (!isAdminMode()) return;
            const files = Array.from(event.target.files || []);
            if (!files.length) return;
            const currentGallery = Array.isArray(person.photoGallery) ? person.photoGallery.slice() : [];

            files.forEach((file) => {
                if (file.size > 700 * 1024) {
                    showCustomAlert(t("chooseSmallerPhoto"));
                    return;
                }
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    currentGallery.push(readerEvent.target.result);
                    person.photoGallery = currentGallery.slice(-18);
                    saveGraph();
                    renderPhotoGallery(person.photoGallery, person);
                };
                reader.readAsDataURL(file);
            });
            galleryUpload.value = "";
        };

        getEl("saveProfileBtn").onclick = () => {
            if (!guardAdminAction()) return;
            person.name = getEl("fName").value.trim() || t("noName");
            person.maidenName = getEl("fMaidenName").value.trim();
            person.birthDate = getPickerValue(birthPicker, "fBirth");
            person.marriageDate = getPickerValue(marriagePicker, "fMarriageDate");
            person.isAlive = aliveToggle.checked;
            person.deathDate = person.isAlive ? "" : getPickerValue(deathPicker, "fDeath");
            syncCurrentProfileLanguageFields();
            person.detailsTranslations = normalizeDetailsTranslations(state.draftDetailsTranslations, {});
            person.birthPlace = person.detailsTranslations.ru.birthPlace || "";
            person.deathPlace = person.detailsTranslations.ru.deathPlace || "";
            person.livingPlaces = person.detailsTranslations.ru.livingPlaces || "";
            person.education = person.detailsTranslations.ru.education || "";
            person.profession = person.detailsTranslations.ru.profession || "";
            person.burialPlace = person.detailsTranslations.ru.burialPlace || "";
            person.marriagePlace = person.detailsTranslations.ru.marriagePlace || "";
            person.bioTranslations = normalizeBioTranslations(getBioTranslationsFromInputs(), person.bio || "");
            person.bio = person.bioTranslations.ru || "";
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

    async function exportPng() {
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
            const pixelRatio = Math.max(2, Math.min(4, Math.ceil(window.devicePixelRatio || 1)));

            const svgClone = svg.cloneNode(true);
            svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            svgClone.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            svgClone.setAttribute("width", width);
            svgClone.setAttribute("height", height);
            svgClone.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svgClone.querySelector("#scene").setAttribute("transform", `translate(${-bbox.x + padding}, ${-bbox.y + padding})`);
            svgClone.querySelectorAll("image").forEach((node) => {
                const href = node.getAttribute("href");
                if (href) node.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
                node.setAttribute("preserveAspectRatio", "xMidYMid slice");
            });

            const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
            styleElement.textContent = getExportStyles();
            svgClone.insertBefore(styleElement, svgClone.firstChild);

            const svgData = new XMLSerializer().serializeToString(svgClone);
            const image = await new Promise((resolve, reject) => {
                const exportImage = new Image();
                exportImage.decoding = "sync";
                exportImage.onload = () => resolve(exportImage);
                exportImage.onerror = reject;
                exportImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
            });

            const canvas = document.createElement("canvas");
            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;
            const ctx = canvas.getContext("2d");
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0, width, height);

            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((result) => {
                    if (result) resolve(result);
                    else reject(new Error("PNG export failed"));
                }, "image/png");
            });

            const link = document.createElement("a");
            const blobUrl = URL.createObjectURL(blob);
            link.download = `Shedjere-${Date.now()}.png`;
            link.href = blobUrl;
            link.click();
            window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        } catch (error) {
            showCustomAlert(t("exportFail"));
        } finally {
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
            image { image-rendering:auto; }
            .node-name { fill:${text}; font-family:Manrope, Arial, sans-serif; font-weight:800; font-size:13px; }
            .node-meta, .node-story { fill:${muted}; font-family:Manrope, Arial, sans-serif; font-weight:600; font-size:11px; }
            .node-story { font-size:10px; }
        `;
    }
});
