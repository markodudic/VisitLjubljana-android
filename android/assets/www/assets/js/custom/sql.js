var callback		= "";
var query 			= "";
var my_visit_status = 0;

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
    
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	res.items[i] = results.rows.item(i);
    	trips_group = results.rows.item(i).id_group;
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
    res.items[0] = results.rows.item(0);

    swipe 		 = 1;
	current 	 = trip_id;
	sound_file	 = file+res.items[0].sound;
	media_length = parseInt(results.rows.item(0).media_duration_value);


	load_page(template_lang+'trip.html', 'trip', res.items[0], 'fade', true);
}

//map poi
function load_map_poi_coord_success(results) {
    points =  new Array();

    var len = results.rows.length;

    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
    	if (row != undefined) {
    		if ((row.coord_x > x0) && (row.coord_x < x1) && (row.coord_y > y0) && (row.coord_y < y1)) {
    			points.push(new Array(row.coord_x, row.coord_y, 0, row.id, row.type));
    		}
    	}
    }
}

function load_map_poi_data_success(results) {
    poi_data = results.rows.item(0);
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

	trips[0]			= res;
	trips[0].top_events_0 	= res.top_items[0];
	trips[0].top_events_1 	= res.top_items[1];
	trips[0].top_events_2 	= res.top_items[2];
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
    trips[5] 			= res;
    
    load_page(template_lang+'events_filtered.html', 'filtered_events', trips[5], 'fade', false, 0);
}

//event
function load_event_success(results) {
	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).intro = unescape(results.rows.item(0).intro);
	results.rows.item(0).description = unescape(results.rows.item(0).description);
	tmp_event_data.item = results.rows.item(0)

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
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	
    	res.items[i] = results.rows.item(i);
    }

    trips[1] = res;
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

//touri
function tour_list_success(results) {
    var res = {};
    res.items = [];
    var len = results.rows.length;

     for (var i=0; i<len; i++){
     	results.rows.item(i).title = unescape(results.rows.item(i).title);
        tmp = results.rows.item(i).title;
        if (tmp.length > max_dolzina_title) {
            results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
        }
        res.items[i] = results.rows.item(i);
    }
   load_page(template_lang+'tour_category.html', 'tour_category', res, 'fade', false);
}

function tour_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	results.rows.item(i).title = unescape(results.rows.item(i).title);
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	res.items[i] = results.rows.item(i);
    }

    //trips[2] = res;
    load_page(template_lang+'tours.html', 'tours', res, 'fade', false);
}

//tour
function load_tour_success(results) {
	results.rows.item(0).title = unescape(results.rows.item(0).title);
	results.rows.item(0).short_description = unescape(results.rows.item(0).short_description);
	results.rows.item(0).long_description = unescape(results.rows.item(0).long_description);
	results.rows.item(0).content = unescape(results.rows.item(0).content);
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
		alert(synronization_finished_translation[settings.id_lang]);
		edit_settings();
	}
}

//my_visit
function my_visit_success(results) {
	my_visit_status = 0;
	
	var res 		 = {};
    res.poi 		 = [];
    res.evt 		 = [];
    res.tour 		 = [];
	
    var tmp_arr 	 = [];
	var filtered_arr = [];

	var poi_wi 		 = "";
	var evt_wi 		 = "";
	var evt_tt 		 = [];
	var tour_wi 	 = "";

	var len = results.rows.length;
	
	res.has_poi  = "";
	res.has_evt	 = "";
	res.has_tour = "";

	var ett_i = 0;
	for (var i=0; i<len; i++){
		tmp_arr[i] =  results.rows.item(i).main_group;

		if (results.rows.item(i).type == 1) {
			res.has_pois 	= 1;
    		poi_wi			= poi_wi + results.rows.item(i).id+",";
    	} else if (results.rows.item(i).type == 2) {
    		//console.log("my_visit evt--- " + JSON.stringify(results.rows.item(i)));

    		res.has_evt	 	= 1;
    		evt_wi			= evt_wi + results.rows.item(i).id+",";

    		evt_tt[ett_i] = results.rows.item(i);
    		ett_i++;
    	} else if (results.rows.item(i).type == 3) {
    		tour_wi			= tour_wi + results.rows.item(i).id+",";
    		res.has_tour 	= 1;
    	}
    }

    $.each(tmp_arr, function(i, el){
	    if($.inArray(el, filtered_arr) === -1) filtered_arr.push(el);
	});

	//myvisit poi
	var j = 0;
    if (res.has_pois == 1) {
    	poi_wi = poi_wi+"0";
    	var tmp_query = 'SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE id IN ('+poi_wi+') AND zpt.id_language = '+settings.id_lang+' AND zp.record_status = 1 GROUP BY zp.id';
		
    	db.transaction(function(tx) {
			 tx.executeSql(tmp_query, [], function(tx, res_poi) {

			 	var poi_len = res_poi.rows.length;
			 	for (var pj = 0; pj<filtered_arr.length; pj++) {
			 		
                    if (filtered_arr[pj] > 200) {
                        var tmp_title = {};
    			 		tmp_title.group_name = main_menu[mm_pic_group[filtered_arr[pj]]];

    			 		res.poi[j] = tmp_title;
    			 		j++;

    			 		for (var pi = 0; pi<poi_len; pi++) {
    			 			
    			 			if (res_poi.rows.item(pi).id_group == filtered_arr[pj]) {
    			 				res_poi.rows.item(pi).group_name = "";
    			 				res.poi[j]	= res_poi.rows.item(pi);
    			 				j++;
    			 			}
    			 		}
                    }
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
    if (res.has_evt == 1) {
    	evt_wi = evt_wi+"0";

    	var tmp_query 	 = "SELECT  e.id, et.title, ett.timetable_idx AS id_timetable, ett.venue, ett.date FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id WHERE e.id IN ("+evt_wi+") AND et.id_language = "+settings.id_lang+" GROUP BY e.id"; 
    	
    	db.transaction(function(tx) {
			tx.executeSql(tmp_query, [], function(tx, res_evt) {
				var evt_len = res_evt.rows.length;

                res.evt_group_name_translation = main_menu[mm_pic_group[0]];
                
				for (var ej = 0; ej<evt_tt.length; ej++) {
					for (var ei = 0; ei<evt_len; ei++) {
						if ((res_evt.rows.item(ei).id == evt_tt[ej].id) && (res_evt.rows.item(ei).id_timetable == evt_tt[ej].time)) {
							
							res.evt[k] = res_evt.rows.item(ei);
							k++;
						}
					}
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
    if (res.has_evt == 1) {
        tour_wi = tour_wi+"0";
        var tmp_query = "SELECT t.id, tt.title, tt.short_description FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id WHERE t.id IN ("+tour_wi+")";

        db.transaction(function(tx) {
            tx.executeSql(tmp_query, [], function(tx, res_tour) {
                var tour_len = res_tour.rows.length;

                res.tour_group_name_translation = main_menu[mm_pic_group[2]];
                
                for (var ti = 0; ti<tour_len; ti++) {
                 
                    tmp_info_text = res_tour.rows.item(ti).short_description;
                    if (tmp_info_text.length > max_dolzina_short_desc) {
                        res_tour.rows.item(ti).short_description = tmp_info_text.substring(0,max_dolzina_short_desc)+"...";
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
	console.log("my_visit --- status ====== " + my_visit_status);

    //nalozim seznam
    if (my_visit_status == 3) {
        console.log("my_visit --- results : " + JSON.stringify(res.tour));
        console.log("my_visit --- results : " + JSON.stringify(res.tour_group_name_translation));

    	load_page(template_lang+'my_visit_list.html', 'my_visit_list', res, 'fade', false);
    }
}


function decode(string) {
    return String(string)
    .replace('&amp;', /&/g)
    .replace('&quot;', /"/g)
    .replace('&quot;', /'/g);
}

//sql error
function errorCB(err) {
	console.log("err");
	console.log(JSON.stringify(err));
}

//ob prvem zagonu napolni bazo
function populate_db_firstime() {
	db.transaction(function(tx) {
		tx.executeSql('select sqlite_version() AS sqlite_version;', [], function(tx, res) {
			console.log('0 >>>>>>>>>> sqlite_version ' + res.rows.item(0).sqlite_version);
		});
	});
	
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

	$.getScript('./assets/install_db/ztl_info.js', function () {
		db.transaction(populateDB_ztl_info, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_info;', [], function(tx, res) {
					console.log('31 >>>>>>>>>> ztl_info res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_my_visit.js', function () {
		db.transaction(populateDB_ztl_my_visit, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_my_visit;', [], function(tx, res) {
					console.log('32 >>>>>>>>>> ztl_my_visit res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
					add_indexes();
				});
			});
		});
	}); 
}

var processed_files = 0;
function add_indexes() {
	processed_files++;
	console.log('98 >>>>>>>>>> '+processed_files);
	if (processed_files == 21) {
		$.getScript('./assets/install_db/ztl_idx.js', function () {
	        db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
	            console.log('99 >>>>>>>>>> ztl_idx');

	            console.log("zagon --- nalagam nastavitve po insertu");
	            load_mobile();
	        });
	    });		
	}	
}