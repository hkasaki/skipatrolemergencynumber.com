
// Copyright (c) Hirotaka KASAKI

import Map from "./spen-map.js";

export default class ViewMap {
    constructor(i18n, registry, resortView) {
        this.i18n = i18n;
        this.registry = registry;
        this.resortView = resortView;
        this.map = new Map("mapview-map");
    }

    async prmInitialize(location) {
        const defaultZoomLevel = 12;
        this.registry.setLocation(location);
        await this.registry.prmReadData(location);
        this.map.initialize(location, defaultZoomLevel);
        this.map.addSelfMarker(location);
        this.map.setOnMoveEnd((center, zoomLevel) => {
            this.onUpdateLocation(center, zoomLevel);
        });
        this.onUpdateLocation(location, defaultZoomLevel);
    }

    render() {
        const nearestResorts = this.registry.getNearestResorts(5);
        const listElem = document.getElementById("mapview-list");
        listElem.innerHTML = "";
        const reservedProc = [];

        for (const resortInfo of nearestResorts) {
            const resort = resortInfo.resort;
            const id = `resort-mapview-${resort.Id}`;
            const name = this.i18n.t(resort.Name);
            const newElem = document.createElement("div");
            newElem.id = id;
            newElem.className = "mapview-list-element";
            newElem.innerHTML = `<div class="mapview-list-element-resort-name">${name}</div>`;
            listElem.appendChild(newElem);
            reservedProc.push( () => {
                const elem = document.getElementById(id);
                elem.addEventListener("click", () => {
                    this.resortView.resortSelected(resort);
                });
            });
        }
        for (const proc of reservedProc) {
            proc();
        }
    }

    onUpdateLocation(location, zoomLevel) {
        const self = this;
        class MapListener {
            onDisplayResortFound(resort, pos) {
                self.map.addResortMarker(pos, resort.Id);
            }
            onRemoveResortFound(resort, _pos) {
                self.map.removeMarker(resort.Id);
            }
        }
        const mapListener = new MapListener();
        this.registry.setLocation(location);
        this.registry.parse(zoomLevel, mapListener);
        this.render();
    }

    show() {
        document.getElementById("mapview").style.display = "grid";
    }

    hide() {
        document.getElementById("mapview").style.display = "none";
    }
}
