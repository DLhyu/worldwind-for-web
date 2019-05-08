/*
添加大气层、星空，模拟地球昼夜变化
 */
define(['../WorldWindShim', './initWorldWind'],
    function (WorldWind, wwd) {
        "use strict";

        var starFieldLayer,atmosphereLayer;
        var now = new Date();
        var simulatedMillisPerDay = 80000; // 昼夜循环实时持续时间80秒
        var startTimeMillis = Date.now(); // 根据浏览器当前时间开始模拟

        var starField = {
            showStarField:function () {
                /* 添加大气层和星空夜景 */
                starFieldLayer = new WorldWind.StarFieldLayer();
                atmosphereLayer = new WorldWind.AtmosphereLayer();
                wwd.addLayer(starFieldLayer);
                wwd.addLayer(atmosphereLayer);
                starFieldLayer.time = now;
                atmosphereLayer.time = now;
            },
            rotateStarField:function () {
                // 计算模拟开始后的模拟天数（或一天的分数）
                var elapsedTimeMillis = Date.now() - startTimeMillis;
                var simulatedDays = elapsedTimeMillis / simulatedMillisPerDay;
                // 根据模拟的天数计算未来的实际日期
                var millisPerDay = 24 * 3600 * 1000; // 24 hours/day * 3600 seconds/hour * 1000 milliseconds/second
                var simulatedMillis = simulatedDays * millisPerDay;
                var simulatedDate = new Date(startTimeMillis + simulatedMillis);
                // 更新星场和大气层中的日期
                starFieldLayer.time = simulatedDate;
                atmosphereLayer.time = simulatedDate;
                wwd.redraw(); // Update the WorldWindow scene.
                requestAnimationFrame(starField.rotateStarField);
            }
        }

        return starField;
    });
