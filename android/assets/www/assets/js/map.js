var map;
var lat=46.052327;
var lon=14.506416;
var zoom=14;

function load_map(c_1, c_2) {
	console.log(c_1+" --- "+c_2);
	
	load_page(template_lang+'show_map.html', 'show_map', null, 'fade', false);
}

function show_map() {
	console.log(lon);

	map = new OpenLayers.Map ("ztl_map", {
		controls:[
			new OpenLayers.Control.Navigation(),
			new OpenLayers.Control.PanZoomBar(),
			new OpenLayers.Control.Permalink(),
			new OpenLayers.Control.ScaleLine({geodesic: true}),
			new OpenLayers.Control.Permalink('permalink'),
			new OpenLayers.Control.MousePosition(),                    
			new OpenLayers.Control.Attribution()],
		maxExtent: new OpenLayers.Bounds(-20037508.34,-20037508.34,20037508.34,20037508.34),
		maxResolution: 156543.0339,
		numZoomLevels: 19,
		units: 'm',
		projection: new OpenLayers.Projection("EPSG:900913"),
		displayProjection: new OpenLayers.Projection("EPSG:4326")
	} );

	//layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
	//layerMapnik.setOpacity(0.4);
	//map.addLayer(layerMapnik); 

	//layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
	//layerCycleMap.setOpacity(0.4);
	//map.addLayer(layerCycleMap);

	// This is the layer that uses the locally stored tiles
	var newLayer = new OpenLayers.Layer.OSM("Local Tiles", "Tiles/${z}/${x}/${y}.png", {numZoomLevels: 19, alpha: true, isBaseLayer: true});
	map.addLayer(newLayer);
	// This is the end of the layer

		//var switcherControl = new OpenLayers.Control.LayerSwitcher();
		//map.addControl(switcherControl);
		//switcherControl.maximizeControl();

	if( ! map.getCenter() ){
		var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
		map.setCenter (lonLat, zoom);
	}
	
	console.log(map);
}