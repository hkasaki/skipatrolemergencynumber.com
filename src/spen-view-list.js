
// Copyright (c) Hirotaka KASAKI

import { Messages } from "./spen-i18n.js";

export default class ViewList {
    constructor(i18n, registry, viewResort) {
        this.i18n = i18n;
        this.registry = registry;
        this.viewResort = viewResort;

        this.initializeGroupSelectElement();
        this.initializeGroupMemberSelectElement();
    }

    getGroupSelectElement() {
        return document.getElementById("listview-group-select");
    }

    getGroupMemberSelectElement() {
        return document.getElementById("listview-group-member-select");
    }

    initializeGroupSelectElement() {
        const groupSelectElem = this.getGroupSelectElement();
        groupSelectElem.addEventListener("change", (e) => {
            const groupId = e.target.value;
            if (groupId === "#none") {
                this.resetGroupMember([]);
            }
            else {
                const resorts = this.registry.getGroupChildren(groupId);
                this.resetGroupMember(resorts);
            }
        })
    }

    initializeGroupMemberSelectElement() {
        const groupMemberSelectElem = this.getGroupMemberSelectElement();
        groupMemberSelectElem.addEventListener("change", (e) => {
            const resortId = e.target.value;
            if (resortId !== "#none") {
                const resort = this.registry.getFromKey(resortId);
                this.viewResort.resortSelected(resort);
            }
        });
    }

    message(key) {
        return this.i18n.t(Messages[key]);
    }

    createOptionNode(value, text) {
        const optionElem = document.createElement("option");
        optionElem.setAttribute("value", value);
        optionElem.textContent = text;
        return optionElem;
    }

    render() {
        const groupSelectElem = this.getGroupSelectElement();
        groupSelectElem.innerHTML = "";

        groupSelectElem.appendChild(this.createOptionNode("#none", this.message("SelectGroup")));
        for (const group of this.registry.getGroupList()) {
            groupSelectElem.appendChild(this.createOptionNode(group.Id, this.i18n.t(group.Name)));
        }

        this.resetGroupMember([]);
    }

    resetGroupMember(resorts) {
        const groupMemberSelectElem = this.getGroupMemberSelectElement();
        groupMemberSelectElem.innerHTML = "";

        groupMemberSelectElem.appendChild(this.createOptionNode("#none", this.message("SelectSkiResort")));
        for (const resort of resorts) {
            groupMemberSelectElem.appendChild(this.createOptionNode(resort.Id, this.i18n.t(resort.Name)));
        }
    }

    show() {
        document.getElementById("listview").style.display = "block";
    }

    hide() {
        document.getElementById("listview").style.display = "none";
    }
}
