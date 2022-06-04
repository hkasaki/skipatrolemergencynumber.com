
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

SkiPatrolEmergencyNumber.ViewConfig = class ViewConfig {
    constructor(i18n, registry) {
        this.i18n = i18n;
        this.registry = registry;

        const self = this;
        $("#configview-language-select").change(function() {
            const lang = $(this).val();
            SkiPatrolEmergencyNumber.setPreferredLanguageToCookie(lang);
            location.href = SkiPatrolEmergencyNumber.getPageUrlForLanguage(lang);
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
