
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

var SkiPatrolEmergencyNumber = SkiPatrolEmergencyNumber || {};

SkiPatrolEmergencyNumber.Messages = {
    TelNotFound: {
        ja: '電話番号が見つかりません',
        en: 'Phone Number Not Found',
    },
    LinkNotFound: {
        ja: 'Webリンクが見つかりません',
        en: 'Web Link Not Found',
    },
    SelectGroup: {
        ja: 'グループを選択してください',
        en: 'Select Group',
    },
    SelectSkiResort: {
        ja: 'スキー場を選択してください',
        en: 'Select Ski Resort',
    },
    CallEmergency: {
        ja: '緊急連絡先に電話',
        en: 'Call Emergency',
    },
    CallInformation: {
        ja: '受付に電話',
        en: 'Call Information',
    },
    OfficialSiteJa: {
        ja: '公式サイト(日)',
        en: 'Official Site(ja)',
    },
    OfficialSiteEn: {
        ja: '公式サイト(英)',
        en: 'Official Site(en)',
    },
    OfficialSiteCommon: {
        ja: '公式サイト',
        en: 'Official Site',
    },
    ExternalSite: {
        ja: '外部サイト',
        en: 'External Site',
    },
};

SkiPatrolEmergencyNumber.getPreferredLanguageFromCookie = function() {
    for(let kv of document.cookie.split(';')) {
        const [key, value] = kv.split('=');
        if (key === "lang") {
            return value;
        }
    }
    return "";
};

SkiPatrolEmergencyNumber.setPreferredLanguageToCookie = function(language) {
    const oneWeek = 60*60*24*7;
    document.cookie = `lang=${language};max-age=${oneWeek};path=/`;
};

SkiPatrolEmergencyNumber.cleanUpCookie = function() {
    document.cookie = 'lang=en;max-age=0;path=/';
};

SkiPatrolEmergencyNumber.getBrowserLanguage = function() {
    const language =
        (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        window.navigator.browserLanguage;
    return language === 'ja' ? 'ja' : 'en';
};

SkiPatrolEmergencyNumber.getCurrentPageLanguage = function() {
    return location.pathname.startsWith("/ja") ? 'ja' : 'en';
};

SkiPatrolEmergencyNumber.getPageUrlForLanguage = function(language) {
    return `${location.protocol}//${location.host}/` + (language === 'ja' ? 'ja/' : '');
};

SkiPatrolEmergencyNumber.I18n = class I18n {
    constructor() {
        this.language = SkiPatrolEmergencyNumber.getBrowserLanguage();
    }

    setLanguage(language) {
        this.language = language;
    }

    getLanguage() {
        return this.language;
    }

    t(obj) {
        if(obj[this.language]) {
            return obj[this.language];
        }
        if(obj.en) {
            return obj.en;
        }
        if(obj.ja) {
            return obj.ja
        }
        return '';
    }
}

//SkiPatrolEmergencyNumber.cleanUpCookie();
let userLanguage = SkiPatrolEmergencyNumber.getPreferredLanguageFromCookie();
if(!userLanguage) {
    userLanguage = SkiPatrolEmergencyNumber.getBrowserLanguage();
}
const currentPageLanguage = SkiPatrolEmergencyNumber.getCurrentPageLanguage();
if(userLanguage !== currentPageLanguage) {
    location.href = SkiPatrolEmergencyNumber.getPageUrlForLanguage(userLanguage);
}
