
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

SkiPatrolEmergencyNumber.ViewConfig = class ViewConfig {
    constructor(i18n, registry) {
        this.i18n = i18n;
        this.registry = registry;

        const self = this;
        $("#configview-language-select").change(function() {
            const lang = $(this).val();
            if (lang !== '#none') {
                i18n.setLanguage(lang);
                self.render();
            }
        });
    }

    render() {
        if (this.i18n.getLanguage() === 'ja') {
            $("#configview-description-ja").show();
            $("#configview-description-en").hide();
        }
        else {
            $("#configview-description-ja").hide();
            $("#configview-description-en").show();
        }
    }

    show() {
        $("#configview").show();
    }

    hide() {
        $("#configview").hide();
    }
}
