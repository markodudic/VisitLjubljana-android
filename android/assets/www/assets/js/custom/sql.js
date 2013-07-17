var callback		= "";
var query 			= "";
var my_visit_status = 0;

/*
function generate_query(q, cb) {
	query 		= q;
	callback	= cb;

	db.transaction(db_query, errorCB);
}


function db_query(tx) {
    tx.executeSql(query, [], db_success, errorCB);
}

function db_success (tx, results) {
	window[callback](results);
}
*/

function generate_query(q, cb) {
    db.transaction(function(tx) {
        tx.executeSql(q, [], function(tx, res) {
            window[cb](res);
        });}, errorCB);
}

//preveri ce baza obstaja, ce ne klice funkcijo, ki jo napolni
function check_db_success(results) {
    if (results.rows.length != 1) {
    	populate_db_firstime();
	} else {
		load_mobile();
	}
}

//nalozi poije
function load_pois_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    var trips_group;
    
    var rec = 0;
    for (var i=0; i<len; i++){
    	if (results.rows.item(i).title == undefined) continue;
    	trips_group = results.rows.item(i).id_group;

    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
     	results.rows.item(i).address = unescape(results.rows.item(i).address);
     	results.rows.item(i).post = unescape(results.rows.item(i).post);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	
    	//filtriram po poigrupah
    	if ((trips_group == POI_ZAMENITOSTI_GROUP) ||
    		(trips_group == POI_KULINARIKA_GROUP) ||
    		(trips_group == POI_NAKUPOVANJE_GROUP) ||
    		(trips_group == POI_ZABAVA_GROUP)) {
    		var poigroup = results.rows.item(i).poigroups;
    	    var poigroups = poigroups_map[trips_group];
    		for (var j=0; j<poigroups.length; j++){
    			if (poigroup != undefined) {
	    			if (poigroup.indexOf(poigroups[j]) != -1) {
	    		    	res.items[rec] = results.rows.item(i);
	    		    	rec++;
	    		    	break;
	    			}
    			}
    		}
    	} else {
	    	res.items[i] = results.rows.item(i);
    	}
    }
	
    trips[trips_group] = res;
    //load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
}

//nalozi poi
function load_poi_success(results) {
	console.log("load_poi_success");
	var res = {};
    res.items = [];
    	 
	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).address = unescape(results.rows.item(0).address);
	results.rows.item(0).post = unescape(results.rows.item(0).post);
	results.rows.item(0).phone = unescape(results.rows.item(0).phone);
	results.rows.item(0).email = unescape(results.rows.item(0).email);
	results.rows.item(0).www = unescape(results.rows.item(0).www);
	results.rows.item(0).description = unescape(results.rows.item(0).description);
	res.items[0] = results.rows.item(0);

    swipe 		 = 1;
	current 	 = trip_id;
	console.log("RES SOUND="+res.items[0].sound);
	
	//lokacija za angleske file je drgje kot za ostale ((na SD kartici))
	if (settings.id_lang == 2) {
		sound_file	 = file+res.items[0].sound;
	} else {
		sound_file	 = file_alt+res.items[0].sound;
	}
	media_length = parseInt(results.rows.item(0).media_duration_value);
	load_page(template_lang+'trip.html', 'trip', res.items[0], 'fade', true, results.rows.item(0).id_group);
}


//eventi
function events_success(results) {
	var res 	  = {};
    res.items 	  = [];
    res.top_items = [];
    var len 	  = results.rows.length;

    var tmp_date;
    var tmp_day;
    var tmp_month;

    var k = 0;
    var j = 0;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	results.rows.item(i).date = unescape(results.rows.item(i).date);
    	results.rows.item(i).poi_title = unescape(results.rows.item(i).poi_title);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).poi_title;
    	if (tmp.length > max_dolzina_poi_title) {
    		results.rows.item(i).poi_title = tmp.substring(0,max_dolzina_poi_title)+"...";
    	}
    	
    	if (results.rows.item(i).featured == "true") {
    		tmp_date 	= new Date(parseInt(results.rows.item(i).date_first)*1000); 
    		tmp_month 	= tmp_date.getMonth(); 
    		tmp_day		= tmp_date.getDate();

    		results.rows.item(i).day   = tmp_day;
			results.rows.item(i).month = month_translation[settings.id_lang][tmp_month];

    		res.top_items[j] = results.rows.item(i);
    		j++;
    	} else  {
    		res.items[k] = results.rows.item(i);
    		k++;
    	}
    }

	trips[EVENT_GROUP]			= res;
	trips[EVENT_GROUP].top_events_0 	= res.top_items[0];
	trips[EVENT_GROUP].top_events_1 	= res.top_items[1];
	trips[EVENT_GROUP].top_events_2 	= res.top_items[2];
}

function event_category_success(results) {
	var len = results.rows.length;

    for (var i=0; i<len; i++){
    	results.rows.item(i).name = unescape(results.rows.item(i).name);
    	event_type[i] = results.rows.item(i);
    }
}

function event_category_title_success(results) {
	event_title = unescape(results.rows.item(0).name);
}

function filter_events_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	results.rows.item(i).date = unescape(results.rows.item(i).date);
    	results.rows.item(i).poi_title = unescape(results.rows.item(i).poi_title);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).poi_title;
    	if (tmp.length > max_dolzina_poi_title) {
    		results.rows.item(i).poi_title = tmp.substring(0,max_dolzina_poi_title)+"...";
    	}

    	res.items[i] = results.rows.item(i);
    }

    res.page_sub_title 		= event_title;
    res.page_sub_title_date	= event_date_from;
    
    if (event_date_to != "") {
    	res.page_sub_title_date = res.page_sub_title_date +" - "+event_date_to;
    }

    //res.categories 	= event_type;
    trips[EVENTS_FILTERED_GROUP] 			= res;
    
    load_page(template_lang+'events_filtered.html', 'filtered_events', trips[EVENTS_FILTERED_GROUP], 'fade', false, 0);
}

//event
function load_event_success(results) {
	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).intro = unescape(results.rows.item(0).intro);
	results.rows.item(0).description = unescape(results.rows.item(0).description);
	tmp_event_data.item = results.rows.item(0);

	var tmp_query 	 = "SELECT ep.ticket_type, ep.price FROM ztl_event_pricing ep WHERE ep.id_event = "+results.rows.item(0).id+" AND ep.id_language = "+settings.id_lang+" GROUP BY ep.ticket_type, ep.price";
	var tmp_callback = "load_event_pricing_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event_pricing_success(results) {
	tmp_event_data.pricing = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
		results.rows.item(i).ticket_type = unescape(results.rows.item(i).ticket_type);
		results.rows.item(i).price = unescape(results.rows.item(i).price);
		tmp_event_data.pricing[i] = results.rows.item(i);
    }

    if (len > 0) {
    	tmp_event_data.has_pricing = 1;
    } else {
    	tmp_event_data.has_pricing = "";
    }

    var id_event = tmp_event_data.item.id;
    current 	 = id_event;

	var tmp_query 	 = "SELECT et.venue, et.date, et.timetable_idx as id_time FROM ztl_event_timetable et WHERE et.id_event = "+id_event+" AND et.id_language = "+settings.id_lang+" GROUP BY et.venue, et.date";
	var tmp_callback = "load_event_venue_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event_venue_success(results) {
	tmp_event_data.venue = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
		results.rows.item(i).date = unescape(results.rows.item(i).date);
		results.rows.item(i).venue = unescape(results.rows.item(i).venue);
		tmp_event_data.venue[i] = results.rows.item(i);
    }

    if (len > 0) {
    	tmp_event_data.has_venue = 1;
    } else {
    	tmp_event_data.has_venue = "";
    }

    if (swipe_dir == "left") {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'slide', false);
    } else if (swipe_dir == "right") {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'slide', true);
	} else {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'fade', false);
    }
}

//info
function info_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title_info) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title_info)+"...";
    	}
    	
    	res.items[i] = results.rows.item(i);
    }

    trips[INFO_GROUP] = res;
    //load_page(template_lang+'infos.html', 'infos', res, 'fade', false);
}

//single_info
function load_info_success(results) {
	var res = {};
    res.item = [];

	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).content = unescape(results.rows.item(0).content);
	res.item = results.rows.item(0);

	if (swipe_dir == "left") {
    	load_page(template_lang+'info.html', 'info', res, 'slide', false);
    } else if (swipe_dir == "right") {
    	load_page(template_lang+'info.html', 'info', res, 'slide', true);
	} else {
    	load_page(template_lang+'info.html', 'info', res, 'fade', true);
    }
}


//poigroup
function poigroup_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	results.rows.item(i).desc = unescape(results.rows.item(i).desc);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).desc;
    	if (tmp.length > max_dolzina_title_info) {
    		results.rows.item(i).desc = tmp.substring(0,max_dolzina_title_info)+"...";
    	}
    	
    	res.items[i] = results.rows.item(i);
    }

    trips[POIGROUP_GROUP] = res;
}

//nalozi poije poigrupe
function load_poigroup_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    var trips_group;
    
    var rec = 0;
    for (var i=0; i<len; i++){
    	if (results.rows.item(i).title == undefined) continue;
    	trips_group = results.rows.item(i).id_group;

    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
     	results.rows.item(i).address = unescape(results.rows.item(i).address);
     	results.rows.item(i).post = unescape(results.rows.item(i).post);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	
    	res.items[i] = results.rows.item(i);
    }
	
    load_page(template_lang+'trips.html', 'trips', res, 'fade', false, POIGROUP_GROUP);
}


//inspired
function inspired_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	results.rows.item(i).desc = unescape(results.rows.item(i).desc);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).desc;
    	if (tmp.length > max_dolzina_short_desc) {
    		results.rows.item(i).desc = tmp.substring(0,max_dolzina_short_desc)+"...";
    	}
    	
    	res.items[i] = results.rows.item(i);
    }

    trips[INSPIRED_GROUP] = res;
}

//touri
function tour_list_success(results) {
    var res = {};
    res.items = [];
    var len = results.rows.length;

    for (var i=0; i<len; i++){
     	results.rows.item(i).title = unescape(results.rows.item(i).title);
     	results.rows.item(i).address = unescape(results.rows.item(i).address);
     	results.rows.item(i).post = unescape(results.rows.item(i).post);
        res.items[i] = results.rows.item(i);
        
        load_tours(results.rows.item(i).id, 0);
    }
    trips[TOUR_LIST_GROUP] = res;
    trips[TOUR_LIST_GROUP].tours = tours;
}

function tour_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	results.rows.item(i).tour_category = unescape(results.rows.item(i).tour_category);
    	results.rows.item(i).short_description = unescape(results.rows.item(i).short_description);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).tour_category;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).tour_category = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	tmp = results.rows.item(i).short_description;
    	if (tmp.length > max_dolzina_title_info) {
    		results.rows.item(i).short_description = tmp.substring(0,max_dolzina_short_desc)+"...";
    	}
    	res.items[i] = results.rows.item(i);
    }

    tours[results.rows.item(0).tour_category_id] = res;
    //load_page(template_lang+'tours.html', 'tours', res, 'fade', false);
}

//tour
function load_tour_success(results) {
	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).short_description = unescape(results.rows.item(0).short_description);
	results.rows.item(0).long_description = unescape(results.rows.item(0).long_description);
	tmp_tours_data.item = results.rows.item(0);

	var tmp_query = "SELECT ti.image FROM ztl_tour_images ti WHERE ti.id_tour = "+tmp_tours_data.item.id+" ORDER BY ti.tour_idx";
	var tmp_callback = "tour_images_success";
    generate_query(tmp_query, tmp_callback);


}

function tour_images_success(results) {
	tmp_tours_data.images = [];
	tmp_tours_data.main_image = results.rows.item(0).image;

	var len = results.rows.length;
	for (var i=0; i<len; i++){
    	tmp_tours_data.images[i] = results.rows.item(i);
    }

    var id_tour = tmp_tours_data.item.id;

    var tmp_query 	 = " SELECT tc.title, tc.content FROM ztl_tour_chaters tc WHERE tc.id_tour = "+id_tour+" AND tc.id_language = "+settings.id_lang+" GROUP BY  tc.title, tc.content ORDER BY tc.tour_idx";
	var tmp_callback = "tour_charters_success";
	generate_query(tmp_query, tmp_callback);
}

function tour_charters_success(results) {
	tmp_tours_data.charters = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
		results.rows.item(i).content = unescape(results.rows.item(i).content);
    	tmp_tours_data.charters[i] = results.rows.item(i);
    }

    if (swipe_dir == "left") {
    	load_page(template_lang+'tour.html', 'tour', tmp_tours_data, 'slide', false);
    } else if (swipe_dir == "right") {
    	load_page(template_lang+'tour.html', 'tour', tmp_tours_data, 'slide', true);
	} else {
    	load_page(template_lang+'tour.html', 'tour', tmp_tours_data, 'fade', false);
    }
}

function last_update_success(results) {
	var parts = results.rows.item(0).lu.split(" ");
	var last_update = new Date(parts[0]);
	last_update.setHours(23);
	last_update.setMinutes(59);
	last_update.setSeconds(59);
	var today = new Date();
	if (last_update < today)  {
		update_db();
	} else {
		navigator.notification.confirm(
			synronization_finished_translation[settings.id_lang],
			load_current_div,
	        synchronization_translation[settings.id_lang],
	        ok_translation[settings.id_lang]
		);
	} 
}

//my_visit
function my_visit_success(results) {
	my_visit_status = 0;

	var res 		      = {};
    res.poi 		      = [];
    res.evt 		      = [];
    res.tour 		      = [];
    res.my_visit_filter   = [];

	var poi_wi 		 = "";
	var evt_wi 		 = "";
	var evt_tt 		 = [];
	var tour_wi 	 = "";

	var len = results.rows.length;
	
    res.len      = len;
	res.has_poi  = "";
	res.has_evt	 = "";
	res.has_tour = "";

	var ett_i = 0;
	for (var i=0; i<len; i++){
		if (results.rows.item(i).ztl_group == POI_GROUP) {
			res.has_poi 	= 1;
    		poi_wi			= poi_wi + results.rows.item(i).id+",";
    	} else if (results.rows.item(i).ztl_group == EVENT_GROUP) {
    		res.has_evt	 	= 1;
    		evt_wi			= evt_wi + results.rows.item(i).id+",";

    		evt_tt[ett_i] = results.rows.item(i);
    		ett_i++;
    	} else if (results.rows.item(i).ztl_group == TOUR_GROUP) {
    		tour_wi			= tour_wi + results.rows.item(i).id+",";
    		res.has_tour 	= 1;
    	}
    }
   
	//myvisit poi
	var j               = 0;
    var current_group   = 0;
    var cgi             = 0;

    if (res.has_poi == 1) {
    	poi_wi = poi_wi+"0";
    	
        if (sql_filer_poi_cat > -1) {
            var tmp_query = 'SELECT zp.id, zp.address, zp.post_number, zp.post, zp.record_status, zpt.title, zcg.id_group, zmi.start, zmi.end FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id LEFT JOIN ztl_my_visit zmi ON (zmi.id = zp.id AND zmi.ztl_group = '+POI_GROUP+') WHERE zp.id IN ('+poi_wi+') AND zcg.id_group = '+sql_filer_poi_cat+' AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id ORDER BY id_group';
        } else {
            var tmp_query = 'SELECT zp.id, zp.address, zp.post_number, zp.post, zp.record_status, zpt.title, zcg.id_group, zmi.start, zmi.end FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id LEFT JOIN ztl_my_visit zmi ON (zmi.id = zp.id AND zmi.ztl_group = '+POI_GROUP+') WHERE zp.id IN ('+poi_wi+') AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id ORDER BY id_group';            
        }

    	db.transaction(function(tx) {
			 tx.executeSql(tmp_query, [], function(tx, res_poi) {
			 	
                var poi_len = res_poi.rows.length;

                for (var pi = 0; pi<poi_len; pi++) {
                    if (current_group < res_poi.rows.item(pi).id_group) {
                        var tmp_title = {};
                        tmp_title.group_name = main_menu[mm_pic_group[res_poi.rows.item(pi).id_group]];
                        tmp_title.visible    = true;

                        var tmp     = {};
                        tmp.id      = res_poi.rows.item(pi).id_group;
                        tmp.title   = main_menu[mm_pic_group[res_poi.rows.item(pi).id_group]];

                        res.my_visit_filter[cgi] = tmp;
                        cgi++;

                        res.poi[j] = tmp_title;
                        j++;

                        current_group = res_poi.rows.item(pi).id_group;
                    }

                    res_poi.rows.item(pi).group_name = "";
                    res_poi.rows.item(pi).title = unescape(res_poi.rows.item(pi).title);
                    res_poi.rows.item(pi).address = unescape(res_poi.rows.item(pi).address);
                    res_poi.rows.item(pi).post = unescape(res_poi.rows.item(pi).post);
                	
                    if (res_poi.rows.item(pi).record_status == 0) {
                        res_poi.rows.item(pi).visible = "";
                    } else {
                        res_poi.rows.item(pi).visible = true;
                    }

                    if (res_poi.rows.item(pi).title.length > max_dolzina_title) {
                        res_poi.rows.item(pi).title.title = res_poi.rows.item(pi).title.substring(0,max_dolzina_title)+"...";
                    }

                    res.poi[j]  = res_poi.rows.item(pi);
                    j++;
                }

    		 	my_visit_status++;
    		 	check_my_visit(res);
			 });
		});
    } else {
    	my_visit_status++;
    	check_my_visit(res);
    }


    //myvisit event
    var k = 0;
    var curr_time = new Date();
    curr_time = parseInt(curr_time.getTime() / 1000);

    if (res.has_evt == 1) {
    	evt_wi = evt_wi+"0";

        var tmp_query  = "SELECT e.id, et.title, zmi.start, zmi.end, ett.date_last, e.record_status FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_my_visit zmi ON (zmi.id = e.id AND zmi.ztl_group = "+EVENT_GROUP+") WHERE e.id IN ("+evt_wi+") AND et.id_language = "+settings.id_lang+" GROUP BY e.id ORDER BY  ett.date_last DESC";

    	db.transaction(function(tx) {
			tx.executeSql(tmp_query, [], function(tx, res_evt) {
				var evt_len = res_evt.rows.length;

                res.evt_group_name_translation = main_menu[mm_pic_group[EVENT_GROUP]];
                
                //vrinem grupo
                var tmp     = {};
                tmp.id      = EVENT_GROUP;
                tmp.title   = main_menu[mm_pic_group[EVENT_GROUP]];
                res.my_visit_filter.unshift(tmp);


                for (var ei = 0; ei<evt_len; ei++) {
                    res_evt.rows.item(ei).title = unescape(res_evt.rows.item(ei).title);

                    if (res_evt.rows.item(ei).title.length > max_dolzina_title) {
                        res_evt.rows.item(ei).title = res_evt.rows.item(ei).title.substring(0,max_dolzina_title)+"...";
                    }

                     if ((res_evt.rows.item(ei).record_status == 0) || (res_evt.rows.item(ei).date_last < curr_time)) {
                        res_evt.rows.item(ei).visible = "";
                    } else {
                        res_evt.rows.item(ei).visible = true;
                    }

                    res.evt[k] = res_evt.rows.item(ei);
					k++;
				}

				my_visit_status++;
				check_my_visit(res);
			});
		});
    } else {
    	my_visit_status++;
    	check_my_visit(res);
    }

    //myvisit tour
    var l = 0;
    var tmp_info_text = "";
    if (res.has_tour == 1) {
        tour_wi = tour_wi+"0";
        var tmp_query = "SELECT t.id, t.record_status, tt.title, tt.short_description, zmi.start, zmi.end FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id  LEFT JOIN ztl_my_visit zmi ON (zmi.id = t.id AND zmi.ztl_group = "+TOUR_GROUP+") WHERE t.id IN ("+tour_wi+")";

        db.transaction(function(tx) {
            tx.executeSql(tmp_query, [], function(tx, res_tour) {
                var tour_len = res_tour.rows.length;

                res.tour_group_name_translation = main_menu[mm_pic_group[TOUR_GROUP]];
                
                var tmp     = {};
                tmp.id      = TOUR_GROUP;
                tmp.title   = main_menu[mm_pic_group[TOUR_GROUP]];
                res.my_visit_filter.push(tmp);


                for (var ti = 0; ti<tour_len; ti++) {
                 
                    tmp_info_text = unescape(res_tour.rows.item(ti).short_description);
                    if (tmp_info_text.length > max_dolzina_short_desc) {
                        res_tour.rows.item(ti).short_description = tmp_info_text.substring(0,max_dolzina_short_desc)+"...";
                    }

                    res_tour.rows.item(ti).title = unescape(res_tour.rows.item(ti).title);

                    if (res_tour.rows.item(ti).title.length > max_dolzina_my_visit_tour_title) {
                        res_tour.rows.item(ti).title = res_tour.rows.item(ti).title.substring(0,max_dolzina_my_visit_tour_title)+"...";
                    }
                    
                    if (res_tour.rows.item(ti).record_status == 0) {
                        res_tour.rows.item(ti).visible = "";
                    } else {
                        res_tour.rows.item(ti).visible = true;
                    }

                    res.tour[l] = res_tour.rows.item(ti);
                    l++;
                }

                my_visit_status++;
                check_my_visit(res);
            });
        });
    } else {
        my_visit_status++;
        check_my_visit(res);
    }

} 

function check_my_visit(res) {
    if (my_visit_status == 3) {
        sql_filter_group  = -1;
        sql_filer_poi_cat = -1;

        if (skip_filter_cat == 0) {
            filter_cat = res.my_visit_filter;
        } else {
            res.my_visit_filter = filter_cat;
            skip_filter_cat = 0;
        }

        if (res.len > 0) {
           res.user = check_user();

    	   load_page(template_lang+'my_visit_list.html', 'my_visit_list', res, 'fade', false);
        } else {
            load_my_visit_settings();
        }
    }
}


function delete_from_my_visit_success(results) {
    load_my_visit();
}

function decode(string) {
    return String(string)
    .replace('&amp;', /&/g)
    .replace('&quot;', /"/g)
    .replace('&quot;', /'/g);
}

//sql error
function errorCB(err) {
	console.log(">>> err "+JSON.stringify(err));
}

//ob prvem zagonu napolni bazo
function populate_db_firstime() {
	/*
	db.transaction(function(tx) {
		tx.executeSql('select sqlite_version() AS sqlite_version;', [], function(tx, res) {
			console.log('0 >>>>>>>>>> sqlite_version ' + res.rows.item(0).sqlite_version);
		});
	});
	*/
	
	$.getScript('./assets/install_db/ztl_updates.js', function () {
		db.transaction(populateDB_ztl_updates, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_updates;', [], function(tx, res) {
					console.log('0 >>>>>>>>>> ztl_updates res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_category.js', function () {
		db.transaction(populateDB_ztl_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_category;', [], function(tx, res) {
					console.log('1 >>>>>>>>>> ztl_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_group.js', function () {
		db.transaction(populateDB_ztl_group, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_group;', [], function(tx, res) {
					console.log('2 >>>>>>>>>> ztl_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_category_group.js', function () {
		db.transaction(populateDB_ztl_category_group, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_category_group;', [], function(tx, res) {
					console.log('3 >>>>>>>>>> ztl_category_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi.js', function () {
		db.transaction(populateDB_ztl_poi, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi;', [], function(tx, res) {
					console.log('4 >>>>>>>>>> ztl_poi res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi_category.js', function () {
		db.transaction(populateDB_ztl_poi_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi_category;', [], function(tx, res) {
					console.log('5 >>>>>>>>>> ztl_poi_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi_translation.js', function () {
		db.transaction(populateDB_ztl_poi_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi_translation;', [], function(tx, res) {
					console.log('6 >>>>>>>>>> ztl_poi_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_event.js', function () {
		db.transaction(populateDB_ztl_event, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event;', [], function(tx, res) {
					console.log('11 >>>>>>>>>> ztl_event res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_translation.js', function () {
		db.transaction(populateDB_ztl_event_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_translation;', [], function(tx, res) {
					console.log('12 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_timetable.js', function () {
		db.transaction(populateDB_ztl_event_timetable, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_timetable;', [], function(tx, res) {
					console.log('13 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_event_pricing.js', function () {
		db.transaction(populateDB_ztl_event_pricing, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_pricing;', [], function(tx, res) {
					console.log('14 >>>>>>>>>> ztl_event_pricing res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_category.js', function () {
		db.transaction(populateDB_ztl_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_category;', [], function(tx, res) {
					console.log('15 >>>>>>>>>> ztl_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_event_category.js', function () {
		db.transaction(populateDB_ztl_event_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_event_category;', [], function(tx, res) {
					console.log('16 >>>>>>>>>> ztl_event_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour.js', function () {
		db.transaction(populateDB_ztl_tour, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
					console.log('21 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_tour_category.js', function () {
		db.transaction(populateDB_ztl_tour_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_category;', [], function(tx, res) {
					console.log('22 >>>>>>>>>> ztl_tour_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_tour_category.js', function () {
		db.transaction(populateDB_ztl_tour_tour_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_tour_category;', [], function(tx, res) {
					console.log('23 >>>>>>>>>> ztl_tour_tour_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_translation.js', function () {
		db.transaction(populateDB_ztl_tour_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
					console.log('24 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_chaters.js', function () {
		db.transaction(populateDB_ztl_tour_chaters, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
					console.log('25 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_images.js', function () {
		db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
					console.log('26 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_inspired.js', function () {
		db.transaction(populateDB_ztl_inspired, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_inspired;', [], function(tx, res) {
					console.log('31 >>>>>>>>>> ztl_inspired res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	}); 
	
	$.getScript('./assets/install_db/ztl_inspired_translation.js', function () {
		db.transaction(populateDB_ztl_inspired_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_inspired_translation;', [], function(tx, res) {
					console.log('32 >>>>>>>>>> ztl_inspired_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	}); 
	
	$.getScript('./assets/install_db/ztl_inspired_category.js', function () {
		db.transaction(populateDB_ztl_inspired_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_inspired_category;', [], function(tx, res) {
					console.log('33 >>>>>>>>>> ztl_inspired_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	}); 
	
	$.getScript('./assets/install_db/ztl_info.js', function () {
		db.transaction(populateDB_ztl_info, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_info;', [], function(tx, res) {
					console.log('41 >>>>>>>>>> ztl_info res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_poigroup.js', function () {
		db.transaction(populateDB_ztl_poigroup, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poigroup;', [], function(tx, res) {
					console.log('41 >>>>>>>>>> ztl_poigroup res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_my_visit.js', function () {
		db.transaction(populateDB_ztl_my_visit, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_my_visit;', [], function(tx, res) {
					console.log('51 >>>>>>>>>> ztl_my_visit res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	}); 
}

var processed_files = 0;
function add_indexes() {
	processed_files++;
	if (processed_files == 24) {
		$.getScript('./assets/install_db/ztl_idx.js', function () {
	        db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
	        	db.transaction(function(tx) {
	        		console.log('99 >>>>>>>>>> ztl_idx');
	        		/* po novem ze pripralvjeni podatki 
	        		console.log("zagon +++ postprocesiranje");
	        		
		        	tx.executeSql('select id, image from ztl_poi where image != "" ', [], function(tx, res) {
		        		for (var i=0; i<res.rows.length; i++) {
		        			var sqli = 'update ztl_poi set image = "'+file_uploads+res.rows.item(i).image+'" where id = '+res.rows.item(i).id;
		        			console.log(sqli);
		        			tx.executeSql(sqli, [], function(tx, res) {});
		        		}
		        	});
	
		        	tx.executeSql('select id, sound, media_duration_string, media_duration_value from ztl_poi where sound != "" ', [], function(tx, res) {
		        		for (var i=0; i<res.rows.length; i++) {
		        			var sqla = 'update ztl_poi_translation set sound = "'+res.rows.item(i).sound+'", media_duration_string = "'+res.rows.item(i).media_duration_string+'", media_duration_value = "'+res.rows.item(i).media_duration_value+'" where id_poi='+res.rows.item(i).id+' and id_language = 2';
		        			console.log(sqla);
		        			tx.executeSql(sqla, [], function(tx, res) {});
		        		}
		        	});
		        	*/
		            console.log("zagon --- nalagam nastavitve po insertu");
		            load_mobile();
	        	});
	        });
	    });
	}	
}