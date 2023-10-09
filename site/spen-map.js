
// Copyright (c) Hirotaka KASAKI 

export default class Map {
    constructor(id) {
        this.id = id;
        this.map = null;
        this.markerLayer = null;

        this.blackStroke = new ol.style.Stroke({color: 'black', width: 2});
        this.selfStyle = new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({color: 'lightgreen'}),
                stroke: this.blackStroke,
                radius: 10,
            })
        });

        this.resortStyle = new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({color: 'red'}),
                stroke: this.blackStroke,
                points: 3,
                radius: 10,
                angle: 0,
            })
        });
        this.centerStyle = new ol.style.Style({
            image: new ol.style.RegularShape({
                //fill: fill,
                stroke: this.blackStroke,
                points: 4,
                radius: 10,
                radius2: 0,
                angle: 0,
            })
        })
        this.onMoveEnd = (center, zoomLevel) => {};
        this.keyFeatureMap = {};
        this.centerFeature = null; // working
    }

    initialize(pos, zoomLevel) {
        this.map = new ol.Map({
            target: this.id,
            // to stop weird behavior
            interactions: ol.interaction.defaults({
                altShiftDragRotate: false,
                pinchRotate: false
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: pos,
                zoom: zoomLevel,
                maxZoom: 15
            })
        });
        this.markerLayer = new ol.layer.Vector({
            source: new ol.source.Vector()
        });
        this.map.addLayer(this.markerLayer);
        this.map.on('moveend', () => {
            const center = this.map.getView().getCenter();
            this.onMoveEnd(center, this.map.getView().getZoom());
        });
        this.map.getView().on("change:center", () => {
            const center = this.map.getView().getCenter();
            if (! this.centerFeature) {
                this.centerFeature = new ol.Feature();
                this.centerFeature.setStyle(this.centerStyle);
                this.markerLayer.getSource().addFeature(this.centerFeature);
            }
            this.centerFeature.setGeometry(new ol.geom.Point(center));
            this.map.render();
        });
    }

    _addMarkerImpl(pos, style, key) {
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(pos)
        });
        feature.setStyle(style);
        this.markerLayer.getSource().addFeature(feature);
        this.keyFeatureMap[key] = feature;
    }

    addSelfMarker(pos) {
        this._addMarkerImpl(pos, this.selfStyle, "me");
    }

    addResortMarker(pos, key) {
        this._addMarkerImpl(pos, this.resortStyle, key);
    }

    removeMarker(key) {
        const feature = this.keyFeatureMap[key];
        this.markerLayer.getSource().removeFeature(feature);
    }

    setOnMoveEnd(f) {
        this.onMoveEnd = f;
    }
};
