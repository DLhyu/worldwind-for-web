/*
 热力图
 */
define(['../WorldWindShim', './initWorldWind'],
    function (WorldWind, wwd) {
        "use strict";
        return {
            show: function () {
                const locations = [];
                for (let i = 0; i < 10000; i++) {
                    locations.push(
                        new WorldWind.MeasuredLocation(
                            -89 + (179 * Math.random()),
                            -179 + (359 * Math.random()),
                            Math.ceil(100 * Math.random())
                        )
                    );
                }
                wwd.addLayer(new WorldWind.HeatMapLayer("HeatMap", locations));
            }
        }
    });