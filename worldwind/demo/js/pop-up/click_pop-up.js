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

                // 创建鼠标单击事件
                const handleClick = function (recognizer) {
                    // Obtain the event location.
                    const x = recognizer.clientX,
                        y = recognizer.clientY;

                    // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
                    // relative to the upper left corner of the canvas rather than the upper left corner of the page.
                    const pickList = wwd.pick(wwd.canvasCoordinates(x, y));

                    // If only one thing is picked and it is the terrain, tell the WorldWindow to go to the picked location.
                    if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
                        var position = pickList.objects[0].position;
                        popUp(position);
                    }
                };

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

                let annotationsLayer;

                function popUp(position) {
                    // Set a location for the annotation to point to and create it.
                    const location = new WorldWind.Position(position.latitude, position.longitude, 1e2);
                    const annotation = new WorldWind.Annotation(location, annotationAttributes);
                    // Text can be assigned to the annotation after creating it.
                    annotation.label = "测试窗口！";

                    // Create and add the annotation layer to the WorldWindow's layer list.
                    annotationsLayer = new WorldWind.RenderableLayer("Annotations");
                    annotationsLayer.removeAllRenderables();
                    annotationsLayer.addRenderable(annotation);
                    wwd.addLayer(annotationsLayer);
                }

                // Listen for mouse clicks.
                const clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

                const handlePick = function (recognizer) {
                    const x = recognizer.clientX,
                        y = recognizer.clientY;
                    console.log(x + ',' + y);
                };

                // Listen for mouse move.
                // wwd.addEventListener("mousemove", handlePick);

                // Listen for mousedown.
                // wwd.addEventListener("mousedown", handlePick);

                // Listen for mouseup.
                // wwd.addEventListener("mouseup", handlePick);
            }
        }
    });