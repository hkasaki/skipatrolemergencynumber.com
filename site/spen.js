
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

// viewport fix
(() => {
    const setVh = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
})();

$(async ()=>{

    function safeHtml(s) {
        return s.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    const version = 7;

    const i18n = new SkiPatrolEmergencyNumber.I18n();
    const dataSource = new SkiPatrolEmergencyNumber.DataSource(true); // debug
    const location = await dataSource.prmGetCurrentLocation(version);
    const registry = new SkiPatrolEmergencyNumber.Registry(dataSource);

    const viewResort = new SkiPatrolEmergencyNumber.ViewResort(i18n, registry);
    const viewMap = new SkiPatrolEmergencyNumber.ViewMap(i18n, registry, viewResort);
    await viewMap.prmInitialize(location);
    const viewList = new SkiPatrolEmergencyNumber.ViewList(i18n, registry, viewResort);
    const viewConfig = new SkiPatrolEmergencyNumber.ViewConfig(i18n, registry);

    const views = {
        list: viewList,
        map: viewMap,
        resort: viewResort,
        config: viewConfig,
    };

    let prevPage = "";
    let currentPage = "";

    window.addEventListener('popstate', () => {
        if (prevPage) {
            displayPage(prevPage, true);
        }
    });

    function displayPage(nextPage, disablePush) {
        history.pushState(null, null, null);
        for(const view of Object.values(views)) {
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

    $("#menu-map").on("click", () => { displayPage("map"); });
    $("#menu-list").on("click", () => { displayPage("list"); });
    $("#menu-config").on("click", () => { displayPage("config"); });

    displayPage("map"); // default
});
