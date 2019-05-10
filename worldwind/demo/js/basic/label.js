/*
 鼠标单击地球添加mark以及显示位置label
 */
define(['../WorldWindShim', './initWorldWind'],
    function (WorldWind, wwd) {
        "use strict";
        return {
            show: function () {
                let text,
                    textAttributes = new WorldWind.TextAttributes(null),
                    textLayer = new WorldWind.RenderableLayer("Oregon Peaks"),
                    // 文本示例内容
                    peaks = [
                        {'name': "South Sister", 'elevation': 3159, 'latitude': 44.1035, 'longitude': -121.7693},
                        {'name': "Mount Hood", 'elevation': 3429, 'latitude': 45.3735, 'longitude': -121.6959},
                        {'name': "Sacajawea Peak", 'elevation': 3000, 'latitude': 45.2450, 'longitude': -117.2929},
                        {'name': "Mount Jefferson", 'elevation': 3201, 'latitude': 44.6743, 'longitude': -121.7996}
                    ];

                // Set up the common text attributes.
                textAttributes.color = WorldWind.Color.CYAN;

                // Set the depth test property such that the terrain does not obscure the text.
                textAttributes.depthTest = false;

                // For each peak, create a text shape.
                let i = 0, len = peaks.length;
                for (i; i < len; i++) {
                    const peak = peaks[i],
                        peakPosition = new WorldWind.Position(peak.latitude, peak.longitude, peak.elevation);

                    // 设置文本位置和内容
                    text = new WorldWind.GeographicText(peakPosition, peak.name + "\n" + peak.elevation + " m");

                    // Set the text attributes for this shape.
                    text.attributes = textAttributes;

                    // Add the text to the layer.
                    textLayer.addRenderable(text);
                }

                // Add the text layer to the WorldWindow's layer list.
                wwd.addLayer(textLayer);

                wwd.goTo(new WorldWind.Position(44.00, -120.33, 800000));
            }
        }
    });