
// Copyright (c) Hirotaka KASAKI

import { setPreferredLanguageToCookie, getPageUrlForLanguage } from "./spen-i18n.js";

export default class ViewConfig {
    constructor(i18n, registry) {
        this.i18n = i18n;
        this.registry = registry;

        const languageSelect = document.getElementById("configview-language-select");
        languageSelect.addEventListener("change", (e) => {
            const lang = e.target.value;
            setPreferredLanguageToCookie(lang);
            location.href = getPageUrlForLanguage(lang);
        });
    }

    render() {
    }

    show() {
        document.getElementById("configview").style.display = "block";
    }

    hide() {
        document.getElementById("configview").style.display = "none";
    }
}
