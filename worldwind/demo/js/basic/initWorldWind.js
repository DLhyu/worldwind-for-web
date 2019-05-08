/*
三维地球初始化
 */
define(['../WorldWindShim'],
    function (WorldWind) {
        "use strict";

       var wwd = new WorldWind.WorldWindow("canvasOne");

       return wwd;
    });