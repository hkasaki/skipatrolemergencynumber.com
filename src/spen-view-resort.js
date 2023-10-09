
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI

import { Messages } from "./spen-i18n.js";
import $ from "jquery";

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

    displayListOrMessage(jqList, jqNotFound) {
        if (jqList.children().length > 0) {
            jqList.show();
            jqNotFound.hide();
        }
        else {
            jqList.hide();
            jqNotFound.show();
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
        const resortName = this.i18n.t(resort.Name);
        $("#resortview-title-name").text(resortName);

    }

    resortSelectedSetTelList(resort) {
        $("#resortview-tel-list").children().remove();
        const appendPhone = (img, phoneTitle, phoneNumber) => {
            $("#resortview-tel-list").append(
                "<div class=\"resortview-tel-list-element\">" +
                  `<a href="tel:${phoneNumber}">` +
                    `<img class="phone-image" src="${img}">` +
                    `<div class="phone-title">${phoneTitle}</div>` +
                    `<div class="phone-number">${phoneNumber}</div>` +
                  "</a>" +
                "</div>"
            );
        };
        if (resort.Tel && resort.Tel.Emergency) {
            appendPhone("/image/icoon-mono-00105-plus-D0D0D0.svg", this.message("CallEmergency"), resort.Tel.Emergency);
        }
        if (resort.Tel && resort.Tel.Info) {
            appendPhone("/image/icoon-mono-00022-info-D0D0D0.svg", this.message("CallInformation"), resort.Tel.Info);
        }
        $("#resortview-tel-not-found-message").text(this.message("TelNotFound"));
        this.displayListOrMessage($("#resortview-tel-list"), $("#resortview-tel-not-found"));
    }

    resortSelectedSetLinkList(resort) {
        $("#resortview-link-list").children().remove();
        const appendLink = (img, linkTitle, url) => {
            $("#resortview-link-list").append(
                "<div class=\"resortview-link-list-element\">" +
                  `<a href="${url}">` +
                    `<img class="link-image" src="${img}">` +
                    `<div class="link-title">${linkTitle}</div>` +
                  "</a>" +
                "</div>"
            );
        };
        if (resort.Website && resort.Website.ja) {
            appendLink("/image/icoon-mono-14258-snowman-D0D0D0.svg", this.message("OfficialSiteJa"), resort.Website.ja);
        }
        if (resort.Website && resort.Website.en) {
            appendLink("/image/icoon-mono-14258-snowman-D0D0D0.svg", this.message("OfficialSiteEn"), resort.Website.en);
        }
        if (resort.Website && resort.Website.common) {
            appendLink("/image/icoon-mono-14258-snowman-D0D0D0.svg", this.message("OfficialSiteCommon"), resort.Website.common);
        }
        if (resort.ExtWebsite && resort.ExtWebsite.en) {
            appendLink("/image/icoon-mono-14258-snowman-D0D0D0.svg", this.message("ExternalSite"), resort.ExtWebsite.en);
        }
        $("#resortview-link-not-found-message").text(this.message("LinkNotFound"));
        this.displayListOrMessage($("#resortview-link-list"), $("#resortview-link-not-found"));
    }

    resortSelectedSetTree(resort) {
        const t = (obj) => {
            return this.i18n.t(obj);
        };
        $("#resortview-tree-content").children().remove();
        let hasFamily = false;
        let html = "";
        const reservedProc = [];
        if (resort.Parent) {
            hasFamily = true;
            const parentResort = this.registry.getFromKey(resort.Parent);
            const id = `resort-resortview-tree-${parentResort.Id}`;
            html += `<ul><li><div id="${id}" class="resortview-tree-link">${t(parentResort.Name)}</div>`;
            reservedProc.push( () => {
                $(`#${id}`).on("click", () => { this.resortSelected(parentResort); });
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
                    $(`#${id}`).on("click", () => { this.resortSelected(childResort); });
                });
            }
            html += "</ul>";
        }
        html += "</li></ul>";
        if (resort.Parent) {
            html += "</li></ul>";
        }

        if (hasFamily) {
            $("#resortview-tree-content").append(html);
            for (const proc of reservedProc) {
                proc();
            }
            $("#resortview-tree").show();
        }
        else {
            $("#resortview-tree").hide();
        }
    }

    render() {
        // see resortSelected
    }

    show() {
        $("#resortview").show();
    }

    hide() {
        $("#resortview").hide();
    }
}
