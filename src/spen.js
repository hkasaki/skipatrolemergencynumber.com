
// Copyright (c) Hirotaka KASAKI

import { I18n, getCurrentPageLanguage } from "./spen-i18n.js";
import DataSource from "./spen-datasource.js";
import Registry from "./spen-registry.js";
import ViewResort from "./spen-view-resort.js";
import ViewMap from "./spen-view-map.js";
import ViewList from "./spen-view-list.js";
import ViewConfig from "./spen-view-config.js";

// viewport fix
(() => {
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
})();

document.addEventListener("DOMContentLoaded", async() => {
    //function safeHtml(s) {
    //    return s.replace(/&/g, '&amp;')
    //        .replace(/</g, '&lt;')
    //        .replace(/>/g, '&gt;')
    //        .replace(/"/g, '&quot;')
    //        .replace(/'/g, '&#39;');
    //}
    const version = 8;

    const i18n = new I18n();
    i18n.setLanguage(getCurrentPageLanguage());
    const dataSource = new DataSource(false, version); // debug: false
    const location = await dataSource.prmGetCurrentLocation();
    const registry = new Registry(dataSource);

    const viewResort = new ViewResort(i18n, registry);
    const viewMap = new ViewMap(i18n, registry, viewResort);
    await viewMap.prmInitialize(location);
    const viewList = new ViewList(i18n, registry, viewResort);
    const viewConfig = new ViewConfig(i18n, registry);

    const views = {
        list: viewList,
        map: viewMap,
        resort: viewResort,
        config: viewConfig,
    };

    let prevPage = "";
    let currentPage = "";

    window.addEventListener("popstate", () => {
        if (prevPage) {
            displayPage(prevPage, true);
        }
    });

    function displayPage(nextPage, disablePush) {
        history.pushState(null, null, null);
        for (const view of Object.values(views)) {
            view.hide();
        }

        views[nextPage].render();
        views[nextPage].show();

        if (disablePush) {
            prevPage = "";
            currentPage = nextPage;
        }
        else {
            prevPage = currentPage;
            currentPage = nextPage;
        }
    }

    viewResort.setOnSelected(() => { displayPage("resort"); });

    for (const key of ["map", "list", "config"]) {
        const elem = document.getElementById(`menu-${key}`);
        elem.addEventListener("click", () => { displayPage(key); });
    }

    displayPage("map"); // default
});
