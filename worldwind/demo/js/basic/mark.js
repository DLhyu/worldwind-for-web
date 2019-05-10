/*
 鼠标单击地球添加mark以及显示位置label
 */
define(['../WorldWindShim', './initWorldWind'],
    function (WorldWind, wwd) {
        "use strict";
        return {
            show: function () {
                // Tell the WorldWindow that we want deep picking.
                wwd.deepPicking = true;

                const handlerClick = function (e) {
                    const x = e.clientX,
                        y = e.clientY;

                    const pickList = wwd.pick(wwd.canvasCoordinates(x, y));

                    if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
                        var position = pickList.objects[0].position;
                        // console.log(position);
                        addPin(position);
                    }
                };

                new WorldWind.ClickRecognizer(wwd, handlerClick);

                // Define the images we'll use for the placemarks.
                const images = [
                    "plain-black.png",
                    "plain-blue.png",
                    "plain-brown.png",
                    "plain-gray.png",
                    "plain-green.png",
                    "plain-orange.png",
                    "plain-purple.png",
                    "plain-red.png",
                    "plain-teal.png",
                    "plain-white.png",
                    "plain-yellow.png",
                    "castshadow-black.png",
                    "castshadow-blue.png",
                    "castshadow-brown.png",
                    "castshadow-gray.png",
                    "castshadow-green.png",
                    "castshadow-orange.png",
                    "castshadow-purple.png",
                    "castshadow-red.png",
                    "castshadow-teal.png",
                    "castshadow-white.png"
                ];

                let pinLibrary = WorldWind.WWUtil.currentUrlSansFilePart() + "/../images/pushpins/", // location of the image files
                    placemark,
                    placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
                    highlightAttributes,
                    placemarkLayer = new WorldWind.RenderableLayer("Placemarks");

                // Set up the common placemark attributes.
                placemarkAttributes.imageScale = 1;
                placemarkAttributes.imageOffset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.3,
                    WorldWind.OFFSET_FRACTION, 0.0);
                placemarkAttributes.imageColor = WorldWind.Color.WHITE;
                placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                    WorldWind.OFFSET_FRACTION, 0.5,
                    WorldWind.OFFSET_FRACTION, 1.0);
                placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
                placemarkAttributes.drawLeaderLine = true;
                placemarkAttributes.leaderLineAttributes.outlineColor = WorldWind.Color.RED;

                function addPin(p) {
                    // Create the placemark and its label.
                    placemark = new WorldWind.Placemark(new WorldWind.Position(p.latitude, p.longitude, 1e2), false, null);
                    placemark.label = "Placemark " + "Position Info" + "\n"
                        + "Lat " + p.latitude.toPrecision(4).toString() + "\n"
                        + "Lon " + p.longitude.toPrecision(5).toString() + "\n"
                        + "Alt " + p.altitude.toFixed(2).toString();
                    placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
                    // placemark.imageRotation = 45;

                    // image URL.
                    placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    placemarkAttributes.imageSource = pinLibrary + images[1];
                    placemark.attributes = placemarkAttributes;

                    // Create the highlight attributes for this placemark
                    highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
                    highlightAttributes.imageScale = 1.2;
                    placemark.highlightAttributes = highlightAttributes;
                    placemark.highlighted = true;

                    // Add the placemark to the layer.
                    placemarkLayer.removeAllRenderables();
                    placemarkLayer.addRenderable(placemark);

                    // Add the placemarks layer to the WorldWindow's layer list.
                    // wwd.addLayer(placemarkLayer);
                }
                wwd.addLayer(placemarkLayer);
            }
        }
    });