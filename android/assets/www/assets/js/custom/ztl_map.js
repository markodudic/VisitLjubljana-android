function load_show_map() {
	load_page(template_lang+'ztl_map.html', 'ztl_map', settings, 'fade', false);
}

var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
var map;

var extent = new OpenLayers.Bounds();

var points          = new Array();
var toltip_visible  = 0;
var poi_data        = null; 
var xy              = new Array();

var current_position_xy;

//klicem iz main.js 445
function init_map() {
	//document.addEventListener("backbutton", back_to_content, true); //TODO ??
    pOld = new Proj4js.Point(0,0);
    
	//resize
    $("#map").height($(window).height()-$(".header").height()+$(".footer").height());

    init(function(feature) { 
        selectedFeature = feature; 
    });
	
    /*
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });
    */
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

    $("#plus").on('click', function(){
        map.zoomIn();
    });

    $("#minus").on('click', function(){
        map.zoomOut();
    });
    
    $("#my_location").on('click', function(){
        source = new Proj4js.Proj('EPSG:31469');
        dest = new Proj4js.Proj('EPSG:900913');
        
        $(".txt_popup").hide();
        
        current_position_xy[0] = 5462704;
        current_position_xy[1] = 5104170;
        	
        var center = transform(parseFloat(current_position_xy[0])+myLocationCorrectionX, parseFloat(current_position_xy[1])+myLocationCorrectionY);
        var lonlat = new OpenLayers.LonLat(center.lon, center.lat); 
        
        sprintersLayer_my_pos.addFeatures(getFeaturesMyLocation(center.lon, center.lat));
        
        map.panTo(lonlat);
    });

    var lonLat0 = new OpenLayers.LonLat(lon0, lat0).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
    var lonLat1 = new OpenLayers.LonLat(lon1, lat1).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
    extent.extend(lonLat0);
    extent.extend(lonLat1);
    
    var vector = new OpenLayers.Layer.Vector('vector');
    Proj4js.defs["EPSG:900913"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
    Proj4js.defs["EPSG:31469"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
    source = new Proj4js.Proj('EPSG:31469');
    dest = new Proj4js.Proj('EPSG:900913');

    var styleMap = new OpenLayers.StyleMap({
        projection: "EPSG:900913",
        externalGraphic: "assets/map/images/map_point.png",
        graphicOpacity: 1.0,
        graphicWidth: 16,
        graphicHeight: 18,
        graphicXOffset:-8,
        graphicYOffset: -18
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

    var selectControl = new OpenLayers.Control.SelectFeature(sprintersLayer, {
        autoActivate:true,
        onSelect: onSelectFeatureFunction});
    
    /*var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        geolocationOptions: {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: 7000
        }
    });*/
    
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
            //geolocate,
            selectControl
        ],

        layers: [
            sprintersLayer_my_pos,
            sprintersLayer
        ],
 
        units: 'm',
        restrictedExtent: extent
    });

    
    var layer_tiles = new OpenLayers.Layer.OSM("Local Tiles", "assets/map/tiles/${z}/${x}/${y}.png", 
        {zoomOffset:13,
        resolutions: [19.1092570678711,9.55462853393555,4.77731426696777,2.38865713348389,1.19432856674194], 
        alpha: true, 
        isBaseLayer: true}
    );

    map.addLayer(layer_tiles);

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();

    if( ! map.getCenter() ){
    	var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
        map.setCenter (lonLat, zoom);
    }

    get_poi_data();

    var sprinters = getFeatures(0);
    var sprinters_my_pos = getFeatures(1);

    sprintersLayer.addFeatures(sprinters);
    sprintersLayer_my_pos.addFeatures(sprinters_my_pos);

    
    function getFeatures(type) {
        var features = new Array();
        for (var i=0;i<points.length;i++) {
           if (points[i][2] == type) {
                //na koordinatePOI-ja iz baze se doda 5.000.000 zato da bo v projekciji GK zona 5 oz. EPSG:31469    
                //ne vem zakaj ampak koordinate po transformaciji strizejo za -350 in 550. GK koordinate so ok.
        	    console.log("ID="+points[i][3]);
        	    var point = transform (parseFloat(points[i][0])+correctionX, parseFloat(points[i][1])+correctionY);
                //var feature = {"geometry": {"type": "Point", "coordinates": [point.lon, point.lat]},
                //				"attributes": {"id": points[i][3]},
                //				"fid": points[i][3]}
                //features.push(feature);
                
                var attributes = {id: points[i][3], type: points[i][4]};

                feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.lon, point.lat), attributes);
                features.push(feature);
            }
        }
        return features;
    }

    function getFeaturesMyLocation(lon, lat) {
        var features = new Array();

        var feature = {"geometry": {"type": "Point", "coordinates": [lon, lat]}}
        features.push(feature);

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
        var feature = evt.feature;
        load_content(feature.attributes.id);
        
        $("#ztl_cord").val(feature.attributes.id+"#"+poi_data.coord_x+"#"+poi_data.coord_y);
        //zracunam razdaljo
        $("#ztl_distance_value").html(lineDistance( poi_data.coord_x, poi_data.coord_y, current_position_xy[0]-correctionX+myLocationCorrectionX, current_position_xy[1]-correctionY+myLocationCorrectionY ) + " km");
        
        if (poi_data.title.length>max_dolzina_title) {
			poi_data.title=poi_data.title.substring(0,max_dolzina_title)+"...";
		}
        $("#poi_title").html(poi_data.title.toUpperCase());
		if (poi_data.address.length>max_dolzina_naslov) {
			poi_data.address=poi_data.address.substring(0,max_dolzina_naslov)+"...";
		}
		$("#poi_address").html(poi_data.address);
        $(".map_info").click(function() {
       		load_page_content(feature.attributes.id, feature.attributes.type);        		
        }); 

        $(".txt_popup").show();
        toltip_visible = 1;
    }

    function onFeatureUnselect(evt) {
       $(".txt_popup").hide();
       toltip_visible = 0;
    }

};

function get_poi_data() {
	//TODO paramter?
	/*
    if (hash == "mappage") {
        hash = -1;
    }
    */
    var hash = 774;
    from_view = "poi";

    if (from_view == "event") {
       var tmp_query = 'SELECT 0 as type, e.id, p.coord_x, p.coord_y FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE e.id = '+hash+' AND et.id_language = '+settings.id_lang+' GROUP BY e.id';
    } else {
//       var tmp_query = 'SELECT 1 as type, zp.id, zp.coord_x, zp.coord_y FROM ztl_poi zp';
       var tmp_query = 'SELECT 1 as type, zp.id, zp.coord_x, zp.coord_y FROM ztl_poi zp WHERE zp.id = '+hash;
    }

    var tmp_callback = "load_map_poi_coord_success";
    generate_query(tmp_query, tmp_callback);
}

function load_content(id) {
    if (from_view == "event") {
        var tmp_query = 'SELECT 0 as type, e.id, et.title, p.address, p.post_number, p.post, p.coord_x, p.coord_y  FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE e.id = '+id+' AND et.id_language = '+settings.id_lang+' GROUP BY e.id';    
    } else {
        var tmp_query = 'SELECT 1 as type, zp.*, zpt.title, zcg.id_group, zp.coord_x, zp.coord_y FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zp.id IN ('+id+') AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
    }
    var tmp_callback    = "load_map_poi_data_success";
            
    generate_query(tmp_query, tmp_callback);
}