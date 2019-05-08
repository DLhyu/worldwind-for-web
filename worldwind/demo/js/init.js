define(['./basic/basicExample', './basic/starField', "./basic/customImage", "./basic/geoJson"],
    function (init3Dglobe, starField, customImage, geoJson) {
        "use strict";
        // 三维地球初始化
        init3Dglobe.show();
        // 添加大气层和星空
        starField.showStarField();
        // 模拟地球昼夜变化
        // starField.rotateStarField();
        // 添加自定义标记
        // customImage.show();
        // 加载geojson数据
        geoJson.show();
    });