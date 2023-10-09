
// Copyright (c) Hirotaka KASAKI

export const Messages = {
    TelNotFound: {
        ja: "電話番号が見つかりません",
        en: "Phone Number Not Found",
    },
    LinkNotFound: {
        ja: "Webリンクが見つかりません",
        en: "Web Link Not Found",
    },
    SelectGroup: {
        ja: "グループを選択してください",
        en: "Select Group",
    },
    SelectSkiResort: {
        ja: "スキー場を選択してください",
        en: "Select Ski Resort",
    },
    CallEmergency: {
        ja: "緊急連絡先に電話",
        en: "Call Emergency",
    },
    CallInformation: {
        ja: "受付に電話",
        en: "Call Information",
    },
    OfficialSiteJa: {
        ja: "公式サイト(日)",
        en: "Official Site(ja)",
    },
    OfficialSiteEn: {
        ja: "公式サイト(英)",
        en: "Official Site(en)",
    },
    OfficialSiteCommon: {
        ja: "公式サイト",
        en: "Official Site",
    },
    ExternalSite: {
        ja: "外部サイト",
        en: "External Site",
    },
};

const getPreferredLanguageFromCookie = function() {
    for (let kv of document.cookie.split(";")) {
        const [key, value] = kv.split("=");
        if (key === "lang") {
            return value;
        }
    }
    return "";
};

export const setPreferredLanguageToCookie = function(language) {
    const oneWeek = 60 * 60 * 24 * 7;
    document.cookie = `lang=${language};max-age=${oneWeek};path=/`;
};

//const cleanUpCookie = function() {
//    document.cookie = 'lang=en;max-age=0;path=/';
//};

const getBrowserLanguage = function() {
    const language =
        (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;
    return language === "ja" ? "ja" : "en";
};

export const getCurrentPageLanguage = function() {
    return location.pathname.startsWith("/ja") ? "ja" : "en";
};

export const getPageUrlForLanguage = function(language) {
    return `${location.protocol}//${location.host}/` + (language === "ja" ? "ja/" : "");
};

export const I18n = class I18n {
    constructor() {
        this.language = getBrowserLanguage();
    }

    setLanguage(language) {
        this.language = language;
    }

    getLanguage() {
        return this.language;
    }

    t(obj) {
        if (obj[this.language]) {
            return obj[this.language];
        }
        if (obj.en) {
            return obj.en;
        }
        if (obj.ja) {
            return obj.ja;
        }
        return "";
    }
};

//cleanUpCookie();
let userLanguage = getPreferredLanguageFromCookie();
if (!userLanguage) {
    userLanguage = getBrowserLanguage();
}
const currentPageLanguage = getCurrentPageLanguage();
if (userLanguage !== currentPageLanguage) {
    location.href = getPageUrlForLanguage(userLanguage);
}
