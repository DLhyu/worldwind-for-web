/*
 地球上的弹出框
 */
/*
 使用二维画布为放置标记创建自定义图像
 */
define(['../WorldWindShim', '../basic/initWorldWind', './AnnotationController'],
    function (WorldWind, wwd, AnnotationController) {
        "use strict";
        return {
            show: function () {
                // Set default annotation attributes.
                const annotationAttributes = new WorldWind.AnnotationAttributes(null);
                annotationAttributes.cornerRadius = 14;
                annotationAttributes.backgroundColor = WorldWind.Color.BLUE;
                annotationAttributes.drawLeader = true;
                annotationAttributes.leaderGapWidth = 30;
                annotationAttributes.leaderGapHeight = 20;
                annotationAttributes.opacity = 1;
                annotationAttributes.scale = 1;
                annotationAttributes.width = 200;
                annotationAttributes.height = 100;
                annotationAttributes.textAttributes.color = WorldWind.Color.WHITE;
                annotationAttributes.insets = new WorldWind.Insets(10, 10, 10, 10);

                const annotationAttributes1 = new WorldWind.AnnotationAttributes(null);
                annotationAttributes1.cornerRadius = 14;
                annotationAttributes1.backgroundColor = WorldWind.Color.YELLOW;
                annotationAttributes1.drawLeader = true;
                annotationAttributes1.leaderGapWidth = 30;
                annotationAttributes1.leaderGapHeight = 20;
                annotationAttributes1.opacity = 0.8;
                annotationAttributes1.scale = 1;
                annotationAttributes1.width = 200;
                annotationAttributes1.height = 100;
                annotationAttributes1.textAttributes.color = WorldWind.Color.WHITE;
                annotationAttributes1.insets = new WorldWind.Insets(10, 10, 10, 10);

                // Set a location for the annotation to point to and create it.
                const location = new WorldWind.Position(32, 110, 1e2);
                const annotation = new WorldWind.Annotation(location, annotationAttributes);
                // Text can be assigned to the annotation after creating it.
                annotation.label = "测试窗口！";

                const location1 = new WorldWind.Position(22, 120, 1e2);
                const annotation1 = new WorldWind.Annotation(location1, annotationAttributes1);
                annotation1.label = "测试窗口2！";

                // Create and add the annotation layer to the WorldWindow's layer list.
                const annotationsLayer = new WorldWind.RenderableLayer("Annotations");
                annotationsLayer.addRenderables([annotation, annotation1]);
                wwd.addLayer(annotationsLayer);

                // Create UI controller to modify annotation properties interactively
                // and load the annotation to it so the UI elements can modify it.
                // var annotationController = new AnnotationController(wwd);
                // annotationController.load(annotation);
                // annotationController.load(annotation1);
                // annotationController.changeLeadSize(40, 30);
            }
        }
    });