define(['./basic/basicExample', './basic/starField', "./basic/customImage", "./basic/geoJson",
        "./pop-up/Popup", "./pop-up/click_pop-up"],
    function (init3Dglobe, starField, customImage, geoJson, Popup, clickPopUp) {
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
        // geoJson.show();
        // 弹出框
        // Popup.show();
        // 单击地球显示弹出框
        clickPopUp.show();
    });