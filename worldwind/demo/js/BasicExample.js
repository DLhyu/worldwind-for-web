/*
 * Copyright 2015-2017 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
requirejs(['./WorldWindShim',
        './LayerManager'],
    function (WorldWind,
              LayerManager) {
        "use strict";

        // 记录警告和错误
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // 配置要使用的GPU内存量
        WorldWind.configuration.gpuCacheSize = 500e6; // 500 MB

        var wwd = new WorldWind.WorldWindow("canvasOne");

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

        /* 大气层和星空夜景 */
        var starFieldLayer = new WorldWind.StarFieldLayer();
        var atmosphereLayer = new WorldWind.AtmosphereLayer();
        wwd.addLayer(starFieldLayer);
        wwd.addLayer(atmosphereLayer);

        /* 根据时间模拟地球自转昼夜变化 */
        var now = new Date();
        starFieldLayer.time = now;
        atmosphereLayer.time = now;

        // In this example, each full day/night cycle lasts 8 seconds in real time.
        var simulatedMillisPerDay = 80000;

        // Begin the simulation at the current time as provided by the browser.
        var startTimeMillis = Date.now();

        function runSimulation() {
            // Compute the number of simulated days (or fractions of a day) since the simulation began.
            var elapsedTimeMillis = Date.now() - startTimeMillis;
            var simulatedDays = elapsedTimeMillis / simulatedMillisPerDay;

            // Compute a real date in the future given the simulated number of days.
            var millisPerDay = 24 * 3600 * 1000; // 24 hours/day * 3600 seconds/hour * 1000 milliseconds/second
            var simulatedMillis = simulatedDays * millisPerDay;
            var simulatedDate = new Date(startTimeMillis + simulatedMillis);

            // Update the date in both the Starfield and the Atmosphere layers.
            starFieldLayer.time = simulatedDate;
            atmosphereLayer.time = simulatedDate;
            wwd.redraw(); // Update the WorldWindow scene.

            requestAnimationFrame(runSimulation);
        }

        // Animate the starry sky as well as the globe's day/night cycle.
        requestAnimationFrame(runSimulation);

        /* 鼠标事件点击地球移动 */
        // The common gesture-handling function.
        var handleClick = function (recognizer) {
            // Obtain the event location.
            var x = recognizer.clientX,
                y = recognizer.clientY;

            // Perform the pick. Must first convert from window coordinates to canvas coordinates, which are
            // relative to the upper left corner of the canvas rather than the upper left corner of the page.
            var pickList = wwd.pick(wwd.canvasCoordinates(x, y));

            // If only one thing is picked and it is the terrain, tell the WorldWindow to go to the picked location.
            if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
                var position = pickList.objects[0].position;
                wwd.goTo(new WorldWind.Location(position.latitude, position.longitude));
            }
        };

        // Listen for mouse clicks.
        var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);

        // Listen for taps on mobile devices.
        var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);

        /* heatmap(热力图) */
        // Generate 10000 random points to display on the HeatMap with varying intensity over the area of the whole world.
        // var locations = [];
        // for (var i = 0; i < 10000; i++) {
        //     locations.push(
        //         new WorldWind.MeasuredLocation(
        //             -89 + (179 * Math.random()),
        //             -179 + (359 * Math.random()),
        //             Math.ceil(100 * Math.random())
        //         )
        //     );
        // }

        // Add new HeatMap Layer with the points as the data source.
        // wwd.addLayer(new WorldWind.HeatMapLayer("HeatMap", locations));

        // 添加wmts
        // Web Map Tiling Service information from
        // var serviceAddress = "http://t0.tianditu.com/img_w/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=img&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=fb0dd2b4158b2f9d4bec0aaaf9722801";
        // // Layer displaying Global Hillshade based on GMTED2010
        // var layerIdentifier = "img";
        //
        // // Called asynchronously to parse and create the WMTS layer
        // var createLayer = function (xmlDom) {
        //     // Create a WmtsCapabilities object from the XML DOM
        //     var wmtsCapabilities = new WorldWind.WmtsCapabilities(xmlDom);
        //     // Retrieve a WmtsLayerCapabilities object by the desired layer name
        //     var wmtsLayerCapabilities = wmtsCapabilities.getLayer(layerIdentifier);
        //     // Form a configuration object from the WmtsLayerCapabilities object
        //     var wmtsConfig = WorldWind.WmtsLayer.formLayerConfiguration(wmtsLayerCapabilities);
        //     // Create the WMTS Layer from the configuration object
        //     var wmtsLayer = new WorldWind.WmtsLayer(wmtsConfig);
        //
        //     // Add the layers to WorldWind and update the layer manager
        //     wwd.addLayer(wmtsLayer);
        //     layerManger.synchronizeLayerList();
        // };
        //
        // // Called if an error occurs during WMTS Capabilities document retrieval
        // var logError = function (jqXhr, text, exception) {
        //     console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        // };
        //
        // $.get(serviceAddress).done(createLayer).fail(logError);

        // 添加自定义标记
        // Create the custom image for the placemark with a 2D canvas.
        var canvas = document.createElement("canvas"),
            ctx2d = canvas.getContext("2d"),
            size = 64, c = size / 2 - 0.5, innerRadius = 5, outerRadius = 20;

        canvas.width = size;
        canvas.height = size;

        var gradient = ctx2d.createRadialGradient(c, c, innerRadius, c, c, outerRadius);
        gradient.addColorStop(0, 'rgb(255, 0, 0)');
        gradient.addColorStop(0.5, 'rgb(0, 255, 0)');
        gradient.addColorStop(1, 'rgb(255, 0, 0)');

        ctx2d.fillStyle = gradient;
        ctx2d.arc(c, c, outerRadius, 0, 2 * Math.PI, false);
        ctx2d.fill();

        // Set placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        // Wrap the canvas created above in an ImageSource object to specify it as the placemarkAttributes image source.
        placemarkAttributes.imageSource = new WorldWind.ImageSource(canvas);
        // Define the pivot point for the placemark at the center of its image source.
        placemarkAttributes.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.5, WorldWind.OFFSET_FRACTION, 0.5);
        placemarkAttributes.imageScale = 1;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;

        // Set placemark highlight attributes.
        // Note that the normal attributes are specified as the default highlight attributes so that all properties
        // are identical except the image scale. You could instead vary the color, image, or other property
        // to control the highlight representation.
        var highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 1.2;

        // Create the placemark with the attributes defined above.
        var placemarkPosition = new WorldWind.Position(32, 110, 1e2);
        var placemark = new WorldWind.Placemark(placemarkPosition, false, placemarkAttributes);
        // Draw placemark at altitude defined above, relative to the terrain.
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        // Assign highlight attributes for the placemark.
        placemark.highlightAttributes = highlightAttributes;

        // Create the renderable layer for placemarks.
        var placemarkLayer = new WorldWind.RenderableLayer("Custom Placemark");

        // Add the placemark to the layer.
        placemarkLayer.addRenderable(placemark);

        // Add the placemarks layer to the WorldWindow's layer list.
        wwd.addLayer(placemarkLayer);

        // Now set up to handle highlighting.
        var highlightController = new WorldWind.HighlightController(wwd);

        // Set up the common placemark attributes.
        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
        placemarkAttributes.imageScale = 0.05;
        placemarkAttributes.imageColor = WorldWind.Color.WHITE;
        placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
            WorldWind.OFFSET_FRACTION, 0.5,
            WorldWind.OFFSET_FRACTION, 1.5);
        placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/white-dot.png";

        var shapeConfigurationCallback = function (geometry, properties) {
            var configuration = {};

            if (geometry.isPointType() || geometry.isMultiPointType()) {
                configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

                if (properties && (properties.name || properties.Name || properties.NAME)) {
                    configuration.name = properties.name || properties.Name || properties.NAME;
                }
                if (properties && properties.POP_MAX) {
                    var population = properties.POP_MAX;
                    configuration.attributes.imageScale = 0.01 * Math.log(population);
                }
            }
            else if (geometry.isLineStringType() || geometry.isMultiLineStringType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);
                configuration.attributes.drawOutline = true;
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.1 * configuration.attributes.interiorColor.red,
                    0.3 * configuration.attributes.interiorColor.green,
                    0.7 * configuration.attributes.interiorColor.blue,
                    1.0);
                configuration.attributes.outlineWidth = 2.0;
            }
            else if (geometry.isPolygonType() || geometry.isMultiPolygonType()) {
                configuration.attributes = new WorldWind.ShapeAttributes(null);

                // Fill the polygon with a random pastel color.
                configuration.attributes.interiorColor = new WorldWind.Color(
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.375 + 0.5 * Math.random(),
                    0.5);
                // Paint the outline in a darker variant of the interior color.
                configuration.attributes.outlineColor = new WorldWind.Color(
                    0.5 * configuration.attributes.interiorColor.red,
                    0.5 * configuration.attributes.interiorColor.green,
                    0.5 * configuration.attributes.interiorColor.blue,
                    1.0);
            }

            return configuration;
        };

        var parserCompletionCallback = function (layer) {
            wwd.addLayer(layer);
            layerManager.synchronizeLayerList();
        };

        var resourcesUrl = "https://worldwind.arc.nasa.gov/web/examples/data/geojson-data/";

        var localJson = "./data/json/china.json";

        // Polygon test
        var polygonLayer = new WorldWind.RenderableLayer("Polygon - China");
        var polygonGeoJSON = new WorldWind.GeoJSONParser(localJson);
        polygonGeoJSON.load(null, shapeConfigurationCallback, polygonLayer);
        wwd.addLayer(polygonLayer);

        // Create a layer manager for controlling layer visibility.
        var layerManger = new LayerManager(wwd);

    });