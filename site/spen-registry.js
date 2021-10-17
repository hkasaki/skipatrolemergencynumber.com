
/* jshint esversion: 8 */

// Copyright (c) Hirotaka KASAKI 

var SkiPatrolEmergencyNumber = SkiPatrolEmergencyNumber || {};

SkiPatrolEmergencyNumber.Registry = class Registry {
    constructor(dataSource) {
        this.resorts = {};

        this.currentLocation = undefined;
        this.dataSource = dataSource;
        this.nearestResorts = []; // { resort: obj, distance: 100 };
        this.displayedKeySet = new Set();
        this.location = undefined;
        this.groupIdToResortKeyList = {};
        this.groupIdToGroup = {};
    }

    //static FarDistanceEliminateThreshold = 100000; // 100km
    //static FarDistanceEliminateThreshold = 5000000; // 500km
    async prmReadData() {
        const data = await this.dataSource.prmGetResortDatabase();

        const groupsData = data.ResortGroups;
        // set group Id
        for (const groupKey of Object.keys(groupsData)) {
            const group = groupsData[groupKey];
            group.Id = groupKey;
            this.groupIdToResortKeyList[groupKey] = [];
            this.groupIdToGroup[groupKey] = group;
        }

        const resortsData = data.Resorts;
        // set resort Id
        for (const resortKey of Object.keys(resortsData)) {
            const resort = resortsData[resortKey];
            resort.Id = resortKey;
            this.resorts[resortKey] = resort;

            // set group
            // TODO: NOT TESTED YET
            for(const groupKey of (resort.Groups || [])) {
                this.groupIdToResortKeyList[groupKey].push(resortKey);
            }
        }
        // set parent, children
        for (const resortKey of Object.keys(resortsData)) {
            const resort = this.resorts[resortKey];
            if (resort.Parent) {
                const parent = this.resorts[resort.Parent];
                if (! parent.Children) {
                    parent.Children = [resortKey];
                }
                else {
                    parent.Children.push(resortKey);
                }
            }
        }

        // set groups
    }

    parse(zoomLevel, listener) {
        const isDisplayForZoomLevel = (resort, zoomLevel) => {
            // think case of: hakuba valley 10, goryu 11, goryu toomi none
            if (resort.Location.ZoomLevelThreshold && zoomLevel >= resort.Location.ZoomLevelThreshold) {
                return false;
            }
            if (resort.Parent) {
                const parent = this.resorts[resort.Parent];
                return zoomLevel >= parent.Location.ZoomLevelThreshold;
            }
            return true;
        };
        this.nearestResorts = [];

        for (const resortKey of Object.keys(this.resorts)) {
            const resort = this.resorts[resortKey];

            const coord = this._getResortCoord(resort);
            if( typeof coord !== 'undefined') {
                const distance = geolib.getDistance(this.location, coord);
                const isToDisplay = isDisplayForZoomLevel(resort, zoomLevel);
                const isDisplayed = this.displayedKeySet.has(resortKey);
                if (isToDisplay) {
                    this.nearestResorts.push({
                        resort: resort,
                        distance: distance
                    });
                }

                if (isToDisplay && ! isDisplayed) {
                    listener.onDisplayResortFound(resort, coord);
                    this.displayedKeySet.add(resortKey);
                }
                else if(!isToDisplay && isDisplayed){
                    listener.onRemoveResortFound(resort, coord);
                    this.displayedKeySet.delete(resortKey);
                }
            }
        }
    }

    _getResortCoord(resort) {
        if (resort.Location && resort.Location.Geometry) {
            const geometry = resort.Location.Geometry;
            if (geometry.Point && geometry.Point.Lng && geometry.Point.Lat) {
                return [geometry.Point.Lng, geometry.Point.Lat];
            }
        }
        return undefined;
    }

    getNearestResorts(number) {
        for (const resort of this.nearestResorts) {
            const coord = this._getResortCoord(resort.resort);
            if( typeof coord !== 'undefined') {
                resort.distance = geolib.getDistance(this.location, coord);
            }
        }
        this.nearestResorts.sort((a, b) => a.distance - b.distance);
        return this.nearestResorts.slice(0, number);
    }

    getFromKey(resortKey) {
        return this.resorts[resortKey];
    }

    getGroupList() {
        return Object.values(this.groupIdToGroup);
    }

    getGroupChildren(groupId) {
        return this.groupIdToResortKeyList[groupId].map(resortId => this.resorts[resortId]);
    }

    setLocation(location) {
        this.location = location;
    }
};
