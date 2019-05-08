define(['./basic/basicExample', './basic/starField'],
    function (init3Dglobe, starField) {
        "use strict";
        // 三维地球初始化
        init3Dglobe.show();
        // 添加大气层和星空
        starField.showStarField();
        // 模拟地球昼夜变化
        starField.rotateStarField();
    });