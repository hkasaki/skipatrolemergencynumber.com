
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

import { Messages } from "./spen-i18n.js";

export default class ViewList {
    constructor(i18n, registry, viewResort) {
        this.i18n = i18n;
        this.registry = registry;
        this.viewResort = viewResort;

        const self = this;
        $("#listview-group-select").change(function() {
            const groupId = $(this).val();
            if (groupId !== '#none') {
                const resorts = registry.getGroupChildren(groupId);
                self.resetGroupMember(resorts);
            }
        });
    
        $("#listview-group-member-select").change(function() {
            const resortId = $(this).val();
            if (resortId !== '#none') {
                const resort = registry.getFromKey(resortId);
                viewResort.resortSelected(resort);
            }
        });
    }

    message(key) {
        return this.i18n.t(Messages[key]);
    }

    render() {
        $("#listview-group-select").children().remove();
        $("#listview-group-select").append(`<option value="#none">${this.message('SelectGroup')}</option>`);
        for(const group of this.registry.getGroupList()) {
            $("#listview-group-select").append(
                `<option value="${group.Id}">${this.i18n.t(group.Name)}</option>`
            );
        }
        this.resetGroupMember([]);
    }

    resetGroupMember(resorts) {
        $("#listview-group-member-select").children().remove();
        $("#listview-group-member-select").append(`<option value="#none">${this.message('SelectSkiResort')}</option>`);
        for (const resort of resorts) {
            $("#listview-group-member-select").append(
                `<option value="${resort.Id}">${this.i18n.t(resort.Name)}</option>`
            );
        }
    }

    show() {
        $("#listview").show();
    }

    hide() {
        $("#listview").hide();
    }
}
