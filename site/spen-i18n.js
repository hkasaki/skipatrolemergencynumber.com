
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

SkiPatrolEmergencyNumber.I18n = class I18n {
    constructor() {
        this.language = this.getBrowserLanguage();
    }

    getBrowserLanguage() {
        const language = (window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage;
        return language === 'ja' ? 'ja' : 'en';
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
