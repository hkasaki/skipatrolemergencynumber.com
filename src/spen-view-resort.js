
// Copyright (c) Hirotaka KASAKI

import { Messages } from "./spen-i18n.js";

export default class ViewResort {
    constructor(i18n, registry) {
        this.i18n = i18n;
        this.registry = registry;
        this.onSelected = () => {};
    }

    setOnSelected(proc) {
        this.onSelected = proc;
    }

    message(key) {
        return this.i18n.t(Messages[key]);
    }

    displayListOrMessage(listElem, notFoundElem) {
        if (listElem.innerHTML !== "") {
            listElem.style.display = "grid";
            notFoundElem.style.display = "none";
        }
        else {
            listElem.style.display = "none";
            notFoundElem.style.display = "block";
        }
    }

    resortSelected(resort) {
        this.resortSelectedSetTitle(resort);
        this.resortSelectedSetTelList(resort);
        this.resortSelectedSetLinkList(resort);
        this.resortSelectedSetTree(resort);
        this.onSelected();
    }

    resortSelectedSetTitle(resort) {
        const elem = document.getElementById("resortview-title-name");
        elem.textContent = this.i18n.t(resort.Name);
    }

    resortSelectedSetTelList(resort) {
        const listElem = document.getElementById("resortview-tel-list");
        listElem.innerHTML = "";
        const appendPhone = (img, phoneTitle, phoneNumber) => {
            const newElem = document.createElement("div");
            newElem.className = "resortview-tel-list-element";
            newElem.innerHTML =
              `<a href="tel:${phoneNumber}">` +
                `<img class="phone-image" src="${img}">` +
                `<div class="phone-title">${phoneTitle}</div>` +
                `<div class="phone-number">${phoneNumber}</div>` +
              "</a>"
              listElem.appendChild(newElem);
        };
        if (resort.Tel && resort.Tel.Emergency) {
            appendPhone(
                "/image/icoon-mono-00105-plus-D0D0D0.svg",
                this.message("CallEmergency"),
                resort.Tel.Emergency);
        }
        if (resort.Tel && resort.Tel.Info) {
            appendPhone(
                "/image/icoon-mono-00022-info-D0D0D0.svg",
                this.message("CallInformation"),
                resort.Tel.Info);
        }
        const notFoundElem = document.getElementById("resortview-tel-not-found-message");
        notFoundElem.textContent = this.message("TelNotFound");
        this.displayListOrMessage(listElem, notFoundElem.parentNode);
    }

    resortSelectedSetLinkList(resort) {
        const listElem = document.getElementById("resortview-link-list");
        listElem.innerHTML = "";
        const appendLink = (img, linkTitle, url) => {
            const newElem = document.createElement("div");
            newElem.className = "resortview-link-list-element";
            newElem.innerHTML =
              `<a href="${url}">` +
                `<img class="link-image" src="${img}">` +
                `<div class="link-title">${linkTitle}</div>` +
              "</a>";
              listElem.appendChild(newElem);
        };
        if (resort.Website && resort.Website.ja) {
            appendLink(
                "/image/icoon-mono-14258-snowman-D0D0D0.svg",
                this.message("OfficialSiteJa"),
                resort.Website.ja);
        }
        if (resort.Website && resort.Website.en) {
            appendLink(
                "/image/icoon-mono-14258-snowman-D0D0D0.svg",
                this.message("OfficialSiteEn"),
                resort.Website.en);
        }
        if (resort.Website && resort.Website.common) {
            appendLink(
                "/image/icoon-mono-14258-snowman-D0D0D0.svg",
                this.message("OfficialSiteCommon"),
                resort.Website.common);
        }
        if (resort.ExtWebsite && resort.ExtWebsite.en) {
            appendLink(
                "/image/icoon-mono-14258-snowman-D0D0D0.svg",
                this.message("ExternalSite"),
                resort.ExtWebsite.en);
        }
        const notFoundElem = document.getElementById("resortview-link-not-found-message");
        notFoundElem.textContent = this.message("LinkNotFound");
        this.displayListOrMessage(listElem, notFoundElem.parentNode);
    }

    resortSelectedSetTree(resort) {
        const t = (obj) => {
            return this.i18n.t(obj);
        };
        const parentElem = document.getElementById("resortview-tree-content");
        parentElem.innerHTML = "";
        let hasFamily = false;
        let html = "";
        const reservedProc = [];
        if (resort.Parent) {
            hasFamily = true;
            const parentResort = this.registry.getFromKey(resort.Parent);
            const id = `resort-resortview-tree-${parentResort.Id}`;
            html += `<ul><li><div id="${id}" class="resortview-tree-link">${t(parentResort.Name)}</div>`;
            reservedProc.push( () => {
                const elem = document.getElementById(id);
                elem.addEventListener("click", () => { this.resortSelected(parentResort); });
            });
        }
        html += `<ul><li>${t(resort.Name)}`;
        if (resort.Children) {
            hasFamily = true;
            html += "<ul>";
            for (const childKey of resort.Children) {
                const childResort = this.registry.getFromKey(childKey);
                const id = `resort-resortview-tree-${childResort.Id}`;
                html += `<li><div id="${id}" class="resortview-tree-link">${t(childResort.Name)}</div></li>`;
                reservedProc.push( () => {
                    const elem = document.getElementById(id);
                    elem.addEventListener("click", () => { this.resortSelected(childResort); });
                });
            }
            html += "</ul>";
        }
        html += "</li></ul>";
        if (resort.Parent) {
            html += "</li></ul>";
        }

        const treeViewElem = document.getElementById("resortview-tree");
        if (hasFamily) {
            parentElem.innerHTML = html;
            for (const proc of reservedProc) {
                proc();
            }
            treeViewElem.style.display = "block";
        }
        else {
            treeViewElem.style.display = "none";
        }
    }

    render() {
        // see resortSelected
    }

    show() {
        const resortViewElem = document.getElementById("resortview");
        resortViewElem.style.display = "block";
    }

    hide() {
        const resortViewElem = document.getElementById("resortview");
        resortViewElem.style.display = "none";
    }
}
