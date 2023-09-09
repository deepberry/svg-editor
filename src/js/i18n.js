i18next.use(i18nextXHRBackend).init({
    // debug: true,
    fallbackLng: localStorage.getItem("editor_lang") || 'cn',
    lng: localStorage.getItem("editor_lang") || 'cn', // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    tName: 't', // --> appends $.t = i18next.t
    i18nName: 'i18n', // --> appends $.i18n = i18next
    handleName: 'localize', // --> appends $(selector).localize(opts);
    selectorAttr: 'data-i18n', // selector for translating elements
    targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if different than itself)
    optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
    useOptionsAttr: false, // see optionsAttr
    parseDefaultValueFromContent: true, // parses default values from content ele.val or ele.text
    backend: {
        loadPath: '/locales/{{lng}}.json',
    }
}, function () {
    console.log("i18n init successfully");
    jqueryI18next.init(i18next, $, { useOptionsAttr: true });
    $(document).ready(function () {
        $('body').localize();
    });
});

// change language
function changeLanguage(lang) {
    i18next.changeLanguage(lang, function (err, t) {
        if (err) return console.log('something went wrong loading', err);
        jqueryI18next.init(i18next, $, { useOptionsAttr: true });
        $('body').localize();
        localStorage.setItem("editor_lang", lang);
    });
}

document.querySelector("#language-button").addEventListener("click", function () {
    let lang = localStorage.getItem("editor_lang") || "cn";
    lang = lang === "cn" ? "en" : "cn";
    changeLanguage(lang);
});