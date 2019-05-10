/*
三维地球初始化
 */
define(['../WorldWindShim'],
    function (WorldWind) {
        "use strict";

        const wwd = new WorldWind.WorldWindow("canvasOne");

        return wwd;
    });