
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

var points          = new Array();
var toltip_visible  = 0;
var poi_data        = null; 
var xy              = new Array();

//current position
var current_position_xy = new Array('462704.999999999941792', '104070.000000000000000');

document.addEventListener("deviceready", on_device_ready, false);
function on_device_ready() {
    document.addEventListener("backbutton", back_to_content, true);
    pOld = new Proj4js.Point(0,0);
    //init_gps();


    add_to_history("map.html");
}

OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        ); 
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );
    }, 

    trigger: function(e) {
        xy          = e.xy;
        var lonlat  = map.getLonLatFromPixel(e.xy);

        map.panTo(lonlat);
    }
});

var init = function (onSelectFeatureFunction) {
    $(".txt_popup").hide();
    load_moblie_settings();
    db = window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);

    $("#my_location").live('click', function(){
        $(".txt_popup").hide();
        var center = transform(parseFloat(current_position_xy[0])+correctionX, parseFloat(current_position_xy[1])+correctionY);
        var lonlat = new OpenLayers.LonLat(center.lon, center.lat); 

        map.panTo(lonlat);
    });

    get_poi_data();

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

    var styleMap = new OpenLayers.StyleMap({
        projection: "EPSG:900913",
        externalGraphic: "assets/map/images/map_point.png",
        graphicOpacity: 1.0,
        graphicWidth: 25,
        graphicHeight: 25,
        graphicXOffset: -12,
        graphicYOffset: -12
    })

    var styleMap_my_pos = new OpenLayers.StyleMap({
        projection: "EPSG:900913",
        externalGraphic: "assets/map/images/you_are_here.png",
        graphicOpacity: 1.0,
        graphicWidth: 50,
        graphicHeight: 50,
        graphicXOffset: -25,
        graphicYOffset: -25
    })

    var sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: styleMap
    });

    sprintersLayer.events.on({
        'featureselected': onFeatureSelect,
        'featureunselected': onFeatureUnselect
    });

    var sprintersLayer_my_pos = new OpenLayers.Layer.Vector("Sprinters", {
        styleMap: styleMap_my_pos
    });

    var sprinters = getFeatures(0);
    var sprinters_my_pos = getFeatures(1);

    sprintersLayer.addFeatures(sprinters);
    sprintersLayer_my_pos.addFeatures(sprinters_my_pos);


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
            sprintersLayer_my_pos,
            sprintersLayer
            
        ],
 
        units: 'm'
    });

    var layer_poi = new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", 
        {zoomOffset:13,
        resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389,1.19432856674194], 
        alpha: true, 
        isBaseLayer: true}
    );

    map.addLayer(layer_poi);

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

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
    
    function getFeatures(type) {

        var features = new Array();

        for (var i=0;i<points.length;i++) {
           if (points[i][2] == type) {
                //na koordinatePOI-ja iz baze se doda 5.000.000 zato da bo v projekciji GK zona 5 oz. EPSG:31469    
                //ne vem zakaj ampak koordinate po transformaciji strizejo za -350 in 550. GK koordinate so ok.
                var point = transform (parseFloat(points[i][0])+correctionX, parseFloat(points[i][1])+correctionY);

                var feature = {"geometry": {"type": "Point", "coordinates": [point.lon, point.lat]}}
                features.push(feature);
            }
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

    function onFeatureSelect(evt) {
        console.log("features select");
        var feature = evt.feature;

        load_trip_content(points[0][3]);

        $("#poi_title").html("<span style='font-size:20px;'>"+poi_data.title.toUpperCase()+"<br><br></span>");
        $("#poi_address").html(poi_data.address);

        $(".txt_popup").show();
        toltip_visible = 1;

    }

    function onFeatureUnselect(evt) {
       $(".txt_popup").hide();
       toltip_visible = 0;
    }

};


function get_poi_data() {
    if (hash == "mappage") {
        hash = 645;
    }

    var tmp_query       = 'SELECT zp.id, zp.coord_x, zp.coord_y FROM ztl_poi zp WHERE zp.id = '+hash;
    var tmp_callback    = "load_map_poi_coord_success";
            
    generate_query(tmp_query, tmp_callback);
}


function load_trip_content(id) {
    trip_id = id;
    var tmp_query = 'SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zp.id IN ('+trip_id+') AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
    var tmp_callback    = "load_map_poi_data_success";
            
    generate_query(tmp_query, tmp_callback);
}

function back_to_content() {
    window.location.href = "index.html#go_back";
}

function load_voice_guide() {
    window.location.href = "index.html#voice_guide";
}

function load_main_screen() {
    window.location.href = "index.html#content";
}


function load_lang_settings() {
    window.location.href = "index.html#lang_settings";
}

function load_moblie_settings() {
    console.log('nalagam mobilne nastavitve');
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getFile("Android/data/com.vigred.ztl/settings.json", null, function(fileEntry) {
            fileEntry.file(readAsText, fail);
        }, fail);
    } , null); 
}

function readAsText(file) {
    console.log('nalagam readAsText');
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        settings = JSON.parse(evt.target.result);
    };

    console.log(settings);
    reader.readAsText(file);
}

function fail(error) {
    console.log('nalagam error');
    console.log("error code: "+error.code);
}
