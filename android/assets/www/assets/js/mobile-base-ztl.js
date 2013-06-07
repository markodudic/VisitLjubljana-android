
// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;

var lat=46.052327;
var lon=14.506416;
var zoom=13;
var correctionX = 4999750;
var correctionY = 5000550;

var pts = null;
var db = null;

var init = function (onSelectFeatureFunction) {
    db = window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);
    get_poi_data();
    var vector = new OpenLayers.Layer.Vector("Vector Layer", {});
	Proj4js.defs["EPSG:900913"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
    Proj4js.defs["EPSG:31469"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
    source = new Proj4js.Proj('EPSG:31469');
    dest = new Proj4js.Proj('EPSG:900913');

    var sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: new OpenLayers.StyleMap({
        	projection: "EPSG:900913",
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
        tileManager: new OpenLayers.TileManager(),
        controls: [
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            geolocate,
            selectControl
        ],
        layers: [
            new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", 
            			{zoomOffset:13,
            			resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389,1.19432856674194], 
            			alpha: true, 
            			isBaseLayer: true}),
            vector,
            sprintersLayer
        ],
        //zoom: zoom,
		//maxExtent: new OpenLayers.Bounds(1607429.6936506156, 5781678.581444382, 1623213.8244484803, 5794133.482254154),
		//maxResolution: "auto",
		//numZoomLevels: 5,
		units: 'm'
    });


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
        console.log("get features");
    	var points = new Array(pts);
    	var features = new Array();
    	
        //marko tu so koordinate array points je bil prej array arrayev ... tudi zdaj ga tako vracam ... a pogledas zakaj ne izrise pointa
        console.log('********************* --- koordinate poi-a --- ***************************');
        console.log(JSON.stringify(points));
        console.log(points[0]);
        console.log("tocka x:"+points[0][0]);
        console.log("tocka y:"+points[0][1]);
        console.log('********************* --- koordinate poi-a --- ***************************');

    	for (var i=0;i<points.length;i++) {
            //na koordinatePOI-ja iz baze se doda 5.000.000 zato da bo v projekciji GK zona 5 oz. EPSG:31469	
    		//ne vem zakaj ampak koordinate po transformaciji strizejo za -350 in 550. GK koordinate so ok.
	    	var point = transform (parseFloat(points[i][0])+correctionX, parseFloat(points[i][1])+correctionY);
	    	var feature = {	  "type": "Feature", 
				              "geometry": {"type": "Point", 
			       	  		   				"coordinates": [point.lon, point.lat]},
			       	  		   "properties": {"Name": "Central Hotel Ljubljana", 
						       	  			   "Country":"Slovenia", 
						       	  			   "City":"Ljubljana"}
	        }
	    	features.push(feature);
    	}
    	
    	var features = {
            "type": "FeatureCollection",
            "features": features
        };

        var reader = new OpenLayers.Format.GeoJSON();

        return reader.read(features);
    }
    
    function transform (lon, lat) {
        var p = new Proj4js.Point(lon, lat); 
        Proj4js.transform(source, dest, p);  
        var point = new Object();
        point["lat"] = p.y;
        point["lon"] = p.x;
        return point;
    }

};

function get_poi_data() {
    db.transaction(load_poi_query, errorCB);
}

function load_poi_query(tx) {
    var query = 'SELECT zp.* FROM ztl_poi zp WHERE zp.id = '+hash;
    tx.executeSql(query, [], load_poi_success, errorCB);
}

function load_poi_success(tx, results) {
    console.log("load_trip_success  ok");
    console.log(JSON.stringify(results));

    var tmp = results.rows.item(0);

    pts = new Array(tmp.coord_x, tmp.coord_y);
    console.log(JSON.stringify(pts));
}

function errorCB(err) {
    console.log("err");
    console.log(err.code);
    console.log(err);
}
