/*
三维地球添加各种图层、视图、罗盘等
 */
define(['../WorldWindShim', './initWorldWind'],
    function (WorldWind, wwd) {
        "use strict";
        return {
            show: function () {
                // 记录警告和错误
                WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

                // 配置要使用的GPU内存量
                WorldWind.configuration.gpuCacheSize = 500e6; // 500 MB

                // wwd = new WorldWind.WorldWindow("canvasOne");

                var layers = [
                    {layer: new WorldWind.BMNGLayer(), enabled: true},
                    {layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
                    {layer: new WorldWind.BingAerialLayer(null), enabled: false},
                    {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false},
                    {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
                    {layer: new WorldWind.CompassLayer(), enabled: true},	// 罗盘 右键操控
                    {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true},	// 坐标显示
                    {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true},	// 视图控件
                    // {layer: new WorldWind.AtmosphereLayer(), enabled: true}, // 打开大气层
                    {layer: new WorldWind.BoundingBox(), enabled: true},
                    {layer: new WorldWind.FrameStatisticsLayer(wwd), enabled: true}, // 显示当前性能统计信息
                    // {layer: new WorldWind.StarFieldLayer(), enabled: true},
                ];

                for (var l = 0; l < layers.length; l++) {
                    layers[l].layer.enabled = layers[l].enabled;
                    wwd.addLayer(layers[l].layer);
                }

                // 初始化后飞向指定的位置
                wwd.goTo(new WorldWind.Position(32, 110, 26584000));
            }
        };
    });