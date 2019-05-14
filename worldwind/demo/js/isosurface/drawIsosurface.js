/*
 绘制局部温度等值面
 */
define(['../WorldWindShim', '../basic/initWorldWind', './temperatureMap'],
    function (WorldWind, wwd, TemperatureMap) {
        "use strict";
        return {
            show: function () {
                const canvas = document.createElement("canvas"),
                    ctx2d = canvas.getContext("2d"),
                    drw0 = new TemperatureMap(ctx2d);

                canvas.width = 500;
                canvas.height = 500;

                // Set placemark attributes.
                const placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
                // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
                placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
                // Define the pivot point for the placemark at the center of its image source.
                placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
                placemarkAttributes.imageScale = 1;
                placemarkAttributes.imageColor = WorldWind.Color.WHITE;

                // Create the placemark with the attributes defined above.
                const placemarkPosition = new WorldWind.Position(32, 110, 1e2);
                const placemark = new WorldWind.Placemark(placemarkPosition, true, placemarkAttributes);
                // Draw placemark at altitude defined above, relative to the terrain.
                placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;

                // Create the renderable layer for placemarks.
                const placemarkLayer = new WorldWind.RenderableLayer("Custom Placemark");

                // Add the placemark to the layer.
                placemarkLayer.addRenderable(placemark);

                // Add the placemarks layer to the WorldWindow's layer list.
                wwd.addLayer(placemarkLayer);

                drw0.setRandomPoints(25, canvas.width, canvas.height);
                drw0.drawLow(5, 8, false, function () { drw0.drawPoints();  });

                // drw0.setPoints(drw0.points, canvas.width, canvas.height);
                // drw0.drawFull(false, function () { drw0.drawPoints(); });

                // drw0.setPoints(drw0.points, canvas.width, canvas.height);
                // drw0.drawFull(true, function () {  });

            }
        }
    });