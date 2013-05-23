var lat  =46.052327;
var lon  =14.506416;
var zoom =14;

var map; //complex object of type OpenLayers.Map

//Initialise the 'map' object
function init() {
	var selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {autoActivate:true});
	
	var sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: new OpenLayers.StyleMap({
            externalGraphic: "img/mobile-loc.png",
            graphicOpacity: 1.0,
            graphicWidth: 16,
            graphicHeight: 26,
            graphicYOffset: -26
        })
    });
	
	var sprinters = getFeatures();
    sprintersLayer.addFeatures(sprinters);
	
	map = new OpenLayers.Map ("map", {
		controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            })
        ],
		layers: [sprintersLayer],
		maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
		maxResolution: 156543.0339,
		numZoomLevels: 19,
		units: 'm',
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326")
	} );

	var newLayer = new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
	map.addLayer(newLayer);

	if( ! map.getCenter() ){
		var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		map.setCenter (lonLat, zoom);
	}
	
	function getFeatures() {
        var features = {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [1332700, 7906300]},
                    "properties": {"Name": "Igor Tihonov", "Country":"Sweden", "City":"Gothenburg"}},
                { "type": "Feature", "geometry": {"type": "Point", "coordinates": [-12362007.067301,5729082.2365672]},
                    "properties": {"Name": "Tim Schaub", "Country":"United States of America", "City":"Bozeman"}}
            ]
        };

        var reader = new OpenLayers.Format.GeoJSON();
		console.log(reader);
        return reader.read(features);
    }
}