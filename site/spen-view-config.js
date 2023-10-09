
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

import { setPreferredLanguageToCookie, getPageUrlForLanguage } from "./spen-i18n.js";

export default class ViewConfig {
    constructor(i18n, registry) {
        this.i18n = i18n;
        this.registry = registry;

        const self = this;
        $("#configview-language-select").change(function() {
            const lang = $(this).val();
            setPreferredLanguageToCookie(lang);
            location.href = getPageUrlForLanguage(lang);
        });
    }

    render() {
    }

    show() {
        $("#configview").show();
    }

    hide() {
        $("#configview").hide();
    }
}
