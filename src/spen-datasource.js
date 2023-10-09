
// Copyright (c) Hirotaka KASAKI

export default class DataSource {
    constructor(isDebug, version) {
        this.isDebug = isDebug;
        this.version = version;
    }

    async prmGetCurrentLocation() {
        const tokyoStation = [139.7673068, 35.6809591];
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (arg) => { resolve([arg.coords.longitude, arg.coords.latitude]); },
                () => { resolve(tokyoStation); }
            );
        });
    }

    async prmGetResortDatabase() {
        const testData = {
            "Ochanomizu": {
                "Name": {
                    "ja": "お茶の水スキー場",
                    "en": "Ochanomizu Ski Resort"
                },
                "Website": {
                    "ja": "https://www.meiji.ac.jp/koho/academeprofile/activity/environmental/libertytower/libertytower.html",
                },
                "Tel": {
                },
                "Location": {
                    "Country": "JP",
                    "ZipCode": "101-0062",
                    "Address": {
                        "ja": "東京都千代田区神田駿河台1丁目"
                    },
                    "Geometry": {
                        "Point": {
                            "Lng": 139.76213550861564,
                            "Lat": 35.697570616080036
                        }
                    }
                }
            },
            "Maboroshizaka": {
                "Name": {
                    "ja": "まぼろし坂激坂スノーパーク",
                    "en": "Maboroshi-Zaka STEEP snow park"
                },
                "Website": {
                    "ja": "https://ameblo.jp/xhtbf524/entry-12062423415.html"
                },
                "Tel": {
                },
                "Location": {
                    "Country": "JP",
                    "ZipCode": "140-0001",
                    "Address": {
                        "ja": "東京都品川区北品川6丁目4"
                    },
                    "Geometry": {
                        "Point": {
                            "Lng": 139.73103072883532,
                            "Lat": 35.626891081011145
                        }
                    }
                }
            }
        };
        const ret = await(await fetch(`/JP.json?v=${this.version}`)).json();
        if (this.isDebug) {
            Object.assign(ret.Resorts, testData);
        }
        return ret;
    }
}
