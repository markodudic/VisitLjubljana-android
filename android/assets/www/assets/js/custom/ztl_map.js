var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";
var map;

var extent = new OpenLayers.Bounds();

var points          = new Array();
var toltip_visible  = 0;
var poi_data        = null; 
var xy              = new Array();
var curr_id;
var curr_type;
var curr_group;
var wgs;

var current_position_xy;

function load_show_map(id, type, group) {
	console.log(id+":"+type+":"+group);
	curr_id = id;
	curr_type = type;
	curr_group = group;
	load_page(template_lang+'ztl_map.html', 'ztl_map', null, 'fade', false);
}

function load_map_selection() {
	load_show_map(0, $('#group_type').val(), 0)
}

//klicem iz main.js 445
function init_map() {
	pOld = new Proj4js.Point(0,0);
    
	//resize
    $("#map").height($(window).height()-$(".header").height()+$(".footer").height());

    init(function(feature) { 
        selectedFeature = feature; 
    });
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
    	showMyLocation(1);
    });

    var lonLat0 = new OpenLayers.LonLat(lon0, lat0).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
    var lonLat1 = new OpenLayers.LonLat(lon1, lat1).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
    extent.extend(lonLat0);
    extent.extend(lonLat1);
    
    var vector = new OpenLayers.Layer.Vector('vector');
    Proj4js.defs["EPSG:900913"]= "+title=GoogleMercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
    Proj4js.defs["EPSG:31469"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    source = new Proj4js.Proj('EPSG:31469');
    dest = new Proj4js.Proj('EPSG:900913');
    wgs = new Proj4js.Proj('EPSG:4326');	//WGS84

    var styleMap = new OpenLayers.StyleMap({
        projection: "EPSG:900913",
        externalGraphic: "assets/map/images/map_point.png",
        graphicOpacity: 1.0,
        graphicWidth: 24,
        graphicHeight: 27,
        graphicXOffset:-12,
        graphicYOffset: -27
    })

    var styleMap_my_pos = new OpenLayers.StyleMap({
        projection: "EPSG:900913",
        externalGraphic: "assets/map/images/you_are_here.png",
        graphicOpacity: 1.0,
        graphicWidth: 76,
        graphicHeight: 76,
        graphicXOffset: -38,
        graphicYOffset: -38
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

    get_poi_data();
    
    //pozicioniram center ce je ena tocka, ce ne pa na center karte
    if ((curr_id != undefined) && (curr_id > 0) && (points != undefined) && (points[0] != undefined)) {
    	var point = transform (parseFloat(points[0][0])+correctionX, parseFloat(points[0][1])+correctionY);
    	var lonLat = new OpenLayers.LonLat(point.lon, point.lat);
    	map.setCenter (lonLat, zoom);
	} else {
	    if( ! map.getCenter() ){
	    	var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), map.getProjectionObject());
	        map.setCenter (lonLat, zoom);
	    }		
	}
    
    var sprinters = getFeatures(0);
    var sprinters_my_pos = getFeatures(1);

    sprintersLayer.addFeatures(sprinters);
    sprintersLayer_my_pos.addFeatures(sprinters_my_pos);

    showMyLocation(0);
    
    function getFeatures(type) {
        var features = new Array();
        console.log("points="+points.length);
        for (var i=0;i<points.length;i++) {
           if (points[i][2] == type) {
                //na koordinatePOI-ja iz baze se doda 5.000.000 zato da bo v projekciji GK zona 5 oz. EPSG:31469    
                //ne vem zakaj ampak koordinate po transformaciji strizejo za -350 in 550. GK koordinate so ok.
        	    var point = transform (parseFloat(points[i][0])+correctionX, parseFloat(points[i][1])+correctionY);
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


    
    function onFeatureSelect(evt) {
        var feature = evt.feature;
        curr_type = feature.attributes.type;
        load_content(feature.attributes.id);
        
    	$("#ztl_cord").val(feature.attributes.id+"#"+poi_data.coord_x+"#"+poi_data.coord_y);
        //zracunam razdaljo
        $("#ztl_distance_value").html(lineDistance( poi_data.coord_x, poi_data.coord_y, current_position_xy[0]-correctionX+myLocationCorrectionX, current_position_xy[1]-correctionY+myLocationCorrectionY ) + " km");
        
        if (poi_data.title.length>max_dolzina_title) {
			poi_data.title=poi_data.title.substring(0,max_dolzina_title)+"...";
		}
        $("#poi_title").html(unescape(poi_data.title.toUpperCase()));
		if (poi_data.address.length>max_dolzina_naslov) {
			poi_data.address=poi_data.address.substring(0,max_dolzina_naslov)+"...";
		}
		$("#poi_address").html(unescape(poi_data.address));
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


    function showMyLocation(pan) {
    	source = new Proj4js.Proj('EPSG:31469');
    	dest = new Proj4js.Proj('EPSG:900913');
    	
    	$(".txt_popup").hide();
    	
    	//samo za test ce nisi v ljubljani
    	//current_position_xy[0] = 5462704;
    	//current_position_xy[1] = 5104170;
    		
    	var center = transform(parseFloat(current_position_xy[0])+myLocationCorrectionX, parseFloat(current_position_xy[1])+myLocationCorrectionY);
    	var lonlat = new OpenLayers.LonLat(center.lon, center.lat); 
    	sprintersLayer_my_pos.removeAllFeatures();
    	sprintersLayer_my_pos.addFeatures(getFeaturesMyLocation(center.lon, center.lat));
    	
    	if (pan == 1) map.panTo(lonlat);
    }
};



function transform (lon, lat) {
	var p = new Proj4js.Point(lon, lat); 
	Proj4js.transform(source, dest, p);
    var point = new Object();
	point["lat"] = p.y;
    point["lon"] = p.x;
    return point;
}

function get_poi_data() {
	points =  new Array();
	if (curr_id != undefined) {
		if (curr_type == VOICE_GROUP) {
			load_map_coords(trips[VOICE_GROUP], VOICE_GROUP);
		} else if (curr_type == EVENT_GROUP) {
		    load_map_coord(trips[EVENT_GROUP], curr_id, EVENT_GROUP);
		} else if (curr_type == POI_GROUP) {
		   	load_map_coord(trips[curr_group], curr_id, POI_GROUP);
		} else if (curr_type == TOUR_LIST_GROUP) {
			load_my_visit_map();
		} else if (curr_type == INSPIRED_GROUP) {
			load_inspired_map();
		}
	}
}

function load_content(id) {
	if (curr_type == EVENT_GROUP) {
        var tmp_query = 'SELECT  '+curr_type+' as type, e.id, et.title, p.address, p.post_number, p.post, p.coord_x, p.coord_y  '+
				        'FROM ztl_event e  '+
				        'LEFT JOIN ztl_event_translation et ON et.id_event = e.id '+ 
				        'LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id  '+
				        'LEFT JOIN ztl_poi p ON p.id = ett.venue_id  '+
				        'WHERE e.id = '+id+' AND et.id_language = '+settings.id_lang+' '+
				        'GROUP BY e.id';    
    } else if ((curr_type == POI_GROUP) || (curr_type == VOICE_GROUP)) {
        var tmp_query = 'SELECT  '+curr_type+' as type, zp.*, zpt.title, zcg.id_group, zp.coord_x, zp.coord_y '+
        				'FROM ztl_poi zp  '+
				        'LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id  '+
				        'LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category  '+
				        'LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id  '+
				        'WHERE zp.id IN ('+id+') AND zpt.id_language = '+settings.id_lang+' '+
        				'GROUP BY zp.id';
    }
    var tmp_callback    = "load_map_poi_data_success";
            
    generate_query(tmp_query, tmp_callback);
}


function load_map_coords(results, type) {
    var len = results.items.length;

	for (var i = 0; i<results.items.length; i++) {
		add_point_on_map(results.items[i], type);
    }
}

function load_map_coord(results, id, type) {
    var len = results.items.length;
    console.log("LEN="+len+":"+id);
    for (var i = 0; i<len; i++) {
    	console.log("COMP="+i+":"+results.items[i].id+":"+id);
        if (results.items[i].id == id) {
    		add_point_on_map(results.items[i], type);
    		return;
    	}
    }
    //Za evente preverim se featured
    if (curr_type == EVENT_GROUP) {
    	if (trips[EVENT_GROUP].top_events_0.id == id) {
    		add_point_on_map(trips[EVENT_GROUP].top_events_0, type);
    	} else if (trips[EVENT_GROUP].top_events_1.id == id) {
    		add_point_on_map(trips[EVENT_GROUP].top_events_1, type);
    	} else if (trips[EVENT_GROUP].top_events_2.id == id) {
    		add_point_on_map(trips[EVENT_GROUP].top_events_2, type);
    	}
    }

}


function add_point_on_map (row, type) {
	console.log("row="+row+":"+type);
    if (row != undefined) {
		if ((row.coord_x > x0) && (row.coord_x < x1) && (row.coord_y > y0) && (row.coord_y < y1)) {
			if (type != undefined) {
				points.push(new Array(row.coord_x, row.coord_y, 0, row.id, type));			
			} else {
				points.push(new Array(row.coord_x, row.coord_y, 0, row.id, row.type));
			}
		}
	}
}


function load_page_content(id, type) {
	if (type==EVENT_GROUP) {
		load_event(id, 0);
	} else if (type==POI_GROUP) {
		load_trip_content(id, 'fade', true, 0);
	}
    
}

function load_map_poi_data_success(results) {
    poi_data = results.rows.item(0);
}

function load_my_visit_map() {
	var tmp_query = "SELECT id, ztl_group " +
					"FROM ztl_my_visit";
    var tmp_callback   = "load_map_success";
    generate_query(tmp_query, tmp_callback);
}

function load_inspired_map() {
	var tmp_query = "SELECT zic.ref_object as id, " + POI_GROUP + " ztl_group " +
					"FROM ztl_inspired_category zic";
    var tmp_callback   = "load_map_success";
    generate_query(tmp_query, tmp_callback);
}

function load_map_success(results) {
	var len = results.rows.length;
    for (var i=0; i<len; i++){
    	var id = results.rows.item(i).id;
    	var group = results.rows.item(i).ztl_group;
    	if (group == POI_GROUP){
        	load_map_coord(trips[POI_ZAMENITOSTI_GROUP], id, POI_GROUP);
    		load_map_coord(trips[POI_KULINARIKA_GROUP], id, POI_GROUP);
    		load_map_coord(trips[POI_NASTANITVE_GROUP], id, POI_GROUP);
    		load_map_coord(trips[POI_NAKUPOVANJE_GROUP], id, POI_GROUP);
    		load_map_coord(trips[POI_ZABAVA_GROUP], id, POI_GROUP);
    	} else if (group == VOICE_GROUP) {
        	load_map_coord(trips[group], id, VOICE_GROUP);
    	} else if (group == EVENT_GROUP) {
        	load_map_coord(trips[group], id, EVENT_GROUP);
    	}
    }
	
}

function map_settings_toggle() {
	$(".map_settings").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();
}

function show_system_maps() {
    source = new Proj4js.Proj('EPSG:31469');
    dest = new Proj4js.Proj('EPSG:4326');	//WGS84

	var saddr = transform(parseFloat(current_position_xy[0])+myLocationCorrectionX, parseFloat(current_position_xy[1])+myLocationCorrectionY);
	
    var x = parseFloat(poi_data.coord_x)+correctionX;
	var y = parseFloat(poi_data.coord_y)+correctionY;   
	var daddr = transform (x, y);
	
	//var geo = 'geo:'+p.lat+','+p.lon+'?z=17';
	//var geo = "http://maps.google.com/maps?daddr="+daddr.lat+","+daddr.lon+"&z=17";
	var geo = "https://maps.google.com/maps?saddr="+saddr.lat+","+saddr.lon+"&daddr="+daddr.lat+","+daddr.lon+"&sll="+daddr.lat+","+daddr.lon+"&mra=mift&z=17";
	console.log(geo);
    window.open(geo,'_system');
}

function back_to_content() {
	backstep 	= 1;
	go_back();
    //window.location.href = "index.html#go_back";
}

