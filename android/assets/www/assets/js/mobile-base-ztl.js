
// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;

var lat=46.052327;
var lon=14.506416;
var zoom=14;

var init = function (onSelectFeatureFunction) {

    var vector = new OpenLayers.Layer.Vector("Vector Layer", {});

    var sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "assets/map/images/marker-blue.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });

    var sprinters = getFeatures();
	console.log(sprinters);
	
	
    sprintersLayer.addFeatures(sprinters);

	console.log(sprintersLayer);
	
    var selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });
	
	
	
    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        numZoomLevels: 18,
        tileManager: new OpenLayers.TileManager(),
        controls: [
            //new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate,
            selectControl
        ],
        layers: [
            new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true}),
            vector,
            sprintersLayer
        ],
        zoom: zoom,
		maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
		maxResolution: 156543.0339,
		numZoomLevels: 19,
		units: 'm'
    });

	/*
	var newLayer = new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
	map.addLayer(newLayer);
	*/
	

	if( ! map.getCenter() ){
		var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		map.setCenter (lonLat, zoom);
	}

	
    var style = {
        fillOpacity: 0.1,
        fillColor: '#000',
        strokeColor: '#f00',
        strokeOpacity: 0.6
    };
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                e.point,
                {},
                {
                    graphicName: 'cross',
                    strokeColor: '#f00',
                    strokeWidth: 2,
                    fillOpacity: 0,
                    pointRadius: 10
                }
            ),
            new OpenLayers.Feature.Vector(
                OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
                ),
                {},
                style
            )
        ]);
        map.zoomToExtent(vector.getDataExtent());
    });

    function getFeatures() {
        var features = {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [1717430.147101, 5954568.7127565]},
                    "properties": {"Name": "Central Hotel Ljubljana", "Country":"Slovenia", "City":"Ljubljana"}},
				 { "type": "Feature", "geometry": {"type": "Point", "coordinates": [1614430.147101, 5788068.7127565]},
                    "properties": {"Name": "Central Hotel Ljubljana", "Country":"Slovenia", "City":"Ljubljana"}}
            ]
        };

        var reader = new OpenLayers.Format.GeoJSON();

        return reader.read(features);
    }

};