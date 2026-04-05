export type Lang = "en" | "ps";

export const translations = {
  en: {
    // Navbar / Footer
    browse: "Browse",
    tagline: "A quiet place to listen.",
    allAudios: "All Audios",
    admin: "Admin",

    // Home
    curatedLibrary: "Curated Audio Library",
    heroTitle: "A quiet place to\u00a0really listen.",
    heroSubtitle:
      "Discover talks, stories, and reflections designed for intentional listening. No infinite scrolling, just warm, unhurried content.",
    startListening: "Start Listening",
    featured: "Featured",
    featuredSubtitle: "Editor's picks for this week.",
    noFeatured: "No featured audio at the moment.",
    browseByTopic: "Browse by Topic",
    latestUploads: "Latest Uploads",
    latestSubtitle: "Fresh thoughts and stories.",
    viewAll: "View All",
    noRecent: "No recent uploads.",

    // Browse
    searchPlaceholder: "Search talks, stories, reflections...",
    allTopics: "All Topics",
    previous: "Previous",
    next: "Next",
    pageOf: (page: number, total: number) => `Page ${page} of ${total}`,
    noAudiosFound: "No audios found matching your criteria.",
    noAudiosDefault: "No audios found.",

    // Audio Detail
    audioNotFound: "Audio not found",
    audioNotFoundDesc:
      "The audio you're looking for doesn't exist or has been removed.",
    browseAllAudios: "Browse all audios",
    about: "About",
    youMightAlsoLike: "You might also like",
    noRelated: "No related audios.",

    // Category Detail
    categoryNotFound: "Category not found",
    categoryNotFoundDesc:
      "The category you're looking for doesn't exist.",
    browseAllTopics: "Browse all topics",
    backToBrowse: "Back to browse",
    audioCount: (n: number) => `${n} ${n === 1 ? "audio" : "audios"}`,
    noAudiosInCategory: (name: string) => `No audios found in ${name}.`,

    // Admin Login
    adminTitle: "Wawra Admin",
    adminLoginSubtitle: "Enter the password to access the dashboard",
    password: "Password",
    accessDashboard: "Access Dashboard",
    loginFailed: "Login failed",
    invalidPassword: "Invalid password",

    // Admin Layout
    dashboard: "Dashboard",
    uploadAudio: "Upload Audio",
    categories: "Categories",
    logout: "Logout",

    // Admin Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Overview of your audio library.",
    totalAudios: "Total Audios",
    recentlyUploaded: (n: number) => `+${n} recently uploaded`,
    published: "Published",
    availableToListeners: "Available to listeners",
    activeTopics: "Active topics",
    featuredStat: "Featured",
    pinnedToHomepage: "Pinned to homepage",
    recentUploads: "Recent Uploads",
    noAudiosYet: "No audios uploaded yet.",
    draft: "Draft",
    actions: "Actions",
    viewPage: "View Page",
    unpublish: "Unpublish",
    publish: "Publish",
    removeFeatured: "Remove Featured",
    markAsFeatured: "Mark as Featured",

    // Admin Upload
    uploadTitle: "Upload Audio",
    uploadSubtitle: "Add a new talk, story, or reflection to your library.",
    audioFileLabel: "Audio File *",
    clickToSelectAudio: "Click to select audio file",
    audioFileHint: "MP3, WAV, OGG up to 50MB",
    duration: "Duration:",
    remove: "Remove",
    coverArtLabel: "Cover Art",
    clickToSelectCover: "Click to select cover art",
    coverHint: "JPG, PNG, WebP up to 5MB",
    changeImage: "Change Image",
    titleLabel: "Title",
    episodeTitlePlaceholder: "Episode title",
    urlSlug: "URL Slug",
    category: "Category",
    selectCategory: "Select a category",
    none: "None",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Write a description...",
    publishImmediately: "Publish immediately",
    publishDesc: "Make this audio visible to listeners",
    featureOnHome: "Feature on Home",
    featureDesc: "Pin this audio to the featured section",
    uploading: "Uploading...",
    saveAudio: "Save Audio",
    audioRequired: "Audio required",
    audioRequiredDesc: "Please select an audio file to upload.",
    uploadSuccess: "Audio uploaded successfully",
    uploadFailed: "Upload failed",
    uploadFailedDesc: "An error occurred during upload. Please try again.",

    // Admin Categories
    categoriesTitle: "Categories",
    categoriesSubtitle: "Manage topics for your audio content.",
    newCategory: "New Category",
    editCategory: "Edit Category",
    createCategory: "Create Category",
    nameLabel: "Name",
    slugLabel: "Slug",
    accentColor: "Accent Color (Hex)",
    saveChanges: "Save Changes",
    create: "Create",
    noCategoriesYet: "No categories found. Create one to get started.",
    audiosUnit: "audios",
    confirmDelete: "Are you sure you want to delete this category?",
    categoryDeleted: "Category deleted",
    categoryUpdated: "Category updated",
    categoryCreated: "Category created",

    // Language switcher
    english: "English",
    pashto: "پښتو",
  },

  ps: {
    // Navbar / Footer
    browse: "لټول",
    tagline: "د اوریدو یوه ارامه ځای",
    allAudios: "ټول غږونه",
    admin: "مدیر",

    // Home
    curatedLibrary: "غوره شوی غږیز کتابتون",
    heroTitle: "د واقعي اوریدو\u00a0یوه ارامه ځای",
    heroSubtitle:
      "خبرې اترې، کیسې، او فکرونه وپلټئ چې د قصدي اوریدو لپاره جوړ شوي دي. بې پایه سکرول نشته، یوازې ګرم او بې چلا مینځپانګه.",
    startListening: "اوریدل پیل کړئ",
    featured: "ځانګړي",
    featuredSubtitle: "د دې اونۍ د مدیر غوره توبونه.",
    noFeatured: "اوس مهال هیڅ ځانګړی غږ نشته.",
    browseByTopic: "د موضوع له مخې لټول",
    latestUploads: "وروستي پورته کول",
    latestSubtitle: "نوي فکرونه او کیسې.",
    viewAll: "ټول وګورئ",
    noRecent: "وروستي پورته کول نشته.",

    // Browse
    searchPlaceholder: "خبرې اترې، کیسې، فکرونه... وپلټئ",
    allTopics: "ټولې موضوعات",
    previous: "مخکنی",
    next: "راتلونکی",
    pageOf: (page: number, total: number) => `مخ ${page} له ${total}`,
    noAudiosFound: "ستاسو معیار سره سم هیڅ غږ ونه موندل شو.",
    noAudiosDefault: "هیڅ غږ ونه موندل شو.",

    // Audio Detail
    audioNotFound: "غږ ونه موندل شو",
    audioNotFoundDesc: "هغه غږ چې تاسو یې لټوئ موجود نه دی یا لرې شوی دی.",
    browseAllAudios: "ټول غږونه وپلټئ",
    about: "د اړه",
    youMightAlsoLike: "تاسو ممکن دا هم خوښ کړئ",
    noRelated: "اړوند غږونه نشته.",

    // Category Detail
    categoryNotFound: "کټګوري ونه موندل شوه",
    categoryNotFoundDesc: "هغه کټګوري چې تاسو یې لټوئ موجوده نه ده.",
    browseAllTopics: "ټولې موضوعات وپلټئ",
    backToBrowse: "لټولو ته ستنیدل",
    audioCount: (n: number) => `${n} غږونه`,
    noAudiosInCategory: (name: string) => `د ${name} کې هیڅ غږ ونه موندل شو.`,

    // Admin Login
    adminTitle: "وړه مدیر",
    adminLoginSubtitle: "د داشبورډ لپاره پاسورډ دننه کړئ",
    password: "پاسورډ",
    accessDashboard: "داشبورډ ته لاسرسی",
    loginFailed: "ننوتل ناکام شو",
    invalidPassword: "پاسورډ سم نه دی",

    // Admin Layout
    dashboard: "داشبورډ",
    uploadAudio: "غږ پورته کول",
    categories: "کټګورۍ",
    logout: "وتل",

    // Admin Dashboard
    dashboardTitle: "داشبورډ",
    dashboardSubtitle: "ستاسو د غږیز کتابتون کتنه.",
    totalAudios: "ټول غږونه",
    recentlyUploaded: (n: number) => `+${n} وروستي پورته کول`,
    published: "خپور شوی",
    availableToListeners: "د اوریدونکو لپاره موجود",
    activeTopics: "فعالې موضوعات",
    featuredStat: "ځانګړي",
    pinnedToHomepage: "د کور پاڼې سره ټاکل شوی",
    recentUploads: "وروستي پورته کول",
    noAudiosYet: "تر اوسه هیڅ غږ پورته نه دی شوی.",
    draft: "مسوده",
    actions: "کړنې",
    viewPage: "پاڼه وګورئ",
    unpublish: "غیر خپور کول",
    publish: "خپرول",
    removeFeatured: "ځانګړتیا لرې کول",
    markAsFeatured: "د ځانګړي په توګه نښه کول",

    // Admin Upload
    uploadTitle: "غږ پورته کول",
    uploadSubtitle: "نوی خبرې اترې، کیسه، یا فکر خپل کتابتون کې اضافه کړئ.",
    audioFileLabel: "د غږ فایل *",
    clickToSelectAudio: "د غږ فایل غوره کولو لپاره کلیک وکړئ",
    audioFileHint: "MP3, WAV, OGG تر 50MB",
    duration: "موده:",
    remove: "لرې کول",
    coverArtLabel: "د پوښ انځور",
    clickToSelectCover: "د پوښ انځور غوره کولو لپاره کلیک وکړئ",
    coverHint: "JPG, PNG, WebP تر 5MB",
    changeImage: "انځور بدلول",
    titleLabel: "سرلیک",
    episodeTitlePlaceholder: "د برنامې سرلیک",
    urlSlug: "URL سلگ",
    category: "کټګوري",
    selectCategory: "کټګوري وټاکئ",
    none: "هیڅ",
    descriptionLabel: "توضیح",
    descriptionPlaceholder: "توضیح ولیکئ...",
    publishImmediately: "سمدلاسه خپرول",
    publishDesc: "دا غږ د اوریدونکو لپاره لید وړ کړئ",
    featureOnHome: "د کور پاڼه کې ځانګړی کول",
    featureDesc: "دا غږ د ځانګړو برخه کې ټاکئ",
    uploading: "پورته کیږي...",
    saveAudio: "غږ خوندي کول",
    audioRequired: "غږ اړین دی",
    audioRequiredDesc: "مهرباني وکړئ د پورته کولو لپاره د غږ فایل غوره کړئ.",
    uploadSuccess: "غږ بریالیتوب سره پورته شو",
    uploadFailed: "پورته کول ناکام شو",
    uploadFailedDesc: "د پورته کولو پرمهال خطا رامنځته شوه. بیا هڅه وکړئ.",

    // Admin Categories
    categoriesTitle: "کټګورۍ",
    categoriesSubtitle: "ستاسو د غږیز مینځپانګه لپاره موضوعات اداره کړئ.",
    newCategory: "نوې کټګوري",
    editCategory: "کټګوري سمول",
    createCategory: "کټګوري جوړول",
    nameLabel: "نوم",
    slugLabel: "سلگ",
    accentColor: "ټکي رنګ (هکس)",
    saveChanges: "بدلونونه خوندي کول",
    create: "جوړول",
    noCategoriesYet: "هیڅ کټګوري ونه موندل شوه. د پیلولو لپاره یوه جوړه کړئ.",
    audiosUnit: "غږونه",
    confirmDelete: "آیا تاسو ډاډه یاست چې دا کټګوري حذف کول غواړئ؟",
    categoryDeleted: "کټګوري حذف شوه",
    categoryUpdated: "کټګوري تازه شوه",
    categoryCreated: "کټګوري جوړه شوه",

    // Language switcher
    english: "English",
    pashto: "پښتو",
  },
} as const;

export type Translations = (typeof translations)["en"];
