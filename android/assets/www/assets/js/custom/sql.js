var callback	= "";
var query 		= "";

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
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	res.items[i] = results.rows.item(i);
    	trips_group = results.rows.item(i).id_group;
    }
    console.log(trips_group+"++++"+JSON.stringify(res));
    trips[trips_group] = res;
    //load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
}

//nalozi poi
function load_poi_success(results) {
	console.log("load_poi_success");
	var res = {};
    res.items = [];
    	 
    res.items[0] = results.rows.item(0);

    swipe 		 = 1;
	current 	 = trip_id;
	sound_file	 = file+res.items[0].sound;
	media_length = parseInt(results.rows.item(0).media_duration_value);


	load_page(template_lang+'trip.html', 'div_trip', res.items[0], 'fade', true);
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

    //current location -- to preberemo iz gsm -- je pofejkan zarad tega ker se drgac ne vidi na karti //me ni v LJ
    //tmp = new Array('462704.999999999941792', '104070.000000000000000', 1, 0);
    //points.push(tmp);
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

    var data = {};

    console.log(JSON.stringify(res.top_items));

	data.top_events_0 	= res.top_items[0];
	data.top_events_1 	= res.top_items[1];
	data.top_events_2 	= res.top_items[2];
	
	data.items 			= res.items;
	data.categories 	= event_type;
	trips[0]			= res;
	trips[0].top_events_0 	= res.top_items[0];
	trips[0].top_events_1 	= res.top_items[1];
	trips[0].top_events_2 	= res.top_items[2];
	trips[0].categories 	= event_type;

	//load_page(template_lang+'events.html', 'events', data, 'fade', false);
}

function event_category_success(results) {
	var len = results.rows.length;

    for (var i=0; i<len; i++){
    	event_type[i] = results.rows.item(i);
    }
}

function event_category_title_success(results) {
	event_title = results.rows.item(0).name;
}

function filter_events_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
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

    res.categories 	= event_type;
    trips[5] 			= res;
    trips[5].categories 			= event_type;
    
    load_page(template_lang+'events_filtered.html', 'filtered_events', trips[5], 'fade', false);
}

//event
function load_event_success(results) {
	tmp_event_data.item = results.rows.item(0)

	var tmp_query 	 = "SELECT ep.ticket_type, ep.price FROM ztl_event_pricing ep WHERE ep.id_event = "+results.rows.item(0).id+" AND ep.id_language = "+settings.id_lang;
	var tmp_callback = "load_event_pricing_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event_pricing_success(results) {
	tmp_event_data.pricing = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
    	tmp_event_data.pricing[i] = results.rows.item(i);
    }

    var id_event = tmp_event_data.item.id;
    current 	 = id_event;

    var tmp_query 	 = "SELECT et.venue, et.date FROM ztl_event_timetable et WHERE et.id_event = "+id_event+" AND et.id_language = "+settings.id_lang;
	var tmp_callback = "load_event_venue_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event_venue_success(results) {
	tmp_event_data.venue = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
    	tmp_event_data.venue[i] = results.rows.item(i);
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
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	
    	//pofejkam image -- ko bo v bazi se zbrise
    	results.rows.item(i).image = "file:///storage/emulated/0/Android/data/com.vigred.ztl/fmpgtmp_8fwmuh.jpeg";

    	res.items[i] = results.rows.item(i);
    }

    trips[1] = res;
    //load_page(template_lang+'infos.html', 'infos', res, 'fade', false);
}

//single_info
function load_info_success(results) {
	var res = {};
    res.item = [];

    //pofejkam -- pol se sam zbrise
    results.rows.item(0).image = "file:///storage/emulated/0/Android/data/com.vigred.ztl/fmpgtmp_8fwmuh.jpeg";
    
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
function tour_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    var tmp;
    for (var i=0; i<len; i++){
    	//skrajsam dolzino
    	tmp = results.rows.item(i).title;
    	if (tmp.length > max_dolzina_title) {
    		results.rows.item(i).title = tmp.substring(0,max_dolzina_title)+"...";
    	}
    	res.items[i] = results.rows.item(i);
    }

    trips[2] = res;
    //load_page(template_lang+'tours.html', 'tours', res, 'fade', false);
}

//tour
function load_tour_success(results) {
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
	console.log("LAST UPDATE= "+last_update+":"+today);
	if (last_update < today)  {
		update_db();
	}
}

//sql error
function errorCB(err) {
	console.log("err");
	console.log(JSON.stringify(err));
}

//ob prvem zagonu napolni bazo
function populate_db_firstime() {
	$.getScript('./assets/install_db/ztl_updates.js', function () {
		db.transaction(populateDB_ztl_updates, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_updates;', [], function(tx, res) {
					console.log('0 >>>>>>>>>> ztl_updates res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_category.js', function () {
		db.transaction(populateDB_ztl_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_category;', [], function(tx, res) {
					console.log('1 >>>>>>>>>> ztl_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_group.js', function () {
		db.transaction(populateDB_ztl_group, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_group;', [], function(tx, res) {
					console.log('2 >>>>>>>>>> ztl_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_category_group.js', function () {
		db.transaction(populateDB_ztl_category_group, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_category_group;', [], function(tx, res) {
					console.log('3 >>>>>>>>>> ztl_category_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi.js', function () {
		db.transaction(populateDB_ztl_poi, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi;', [], function(tx, res) {
					console.log('4 >>>>>>>>>> ztl_poi res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi_category.js', function () {
		db.transaction(populateDB_ztl_poi_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi_category;', [], function(tx, res) {
					console.log('5 >>>>>>>>>> ztl_poi_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_poi_translation.js', function () {
		db.transaction(populateDB_ztl_poi_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_poi_translation;', [], function(tx, res) {
					console.log('6 >>>>>>>>>> ztl_poi_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_event.js', function () {
		db.transaction(populateDB_ztl_event, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event;', [], function(tx, res) {
					console.log('11 >>>>>>>>>> ztl_event res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_translation.js', function () {
		db.transaction(populateDB_ztl_event_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_translation;', [], function(tx, res) {
					console.log('12 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_timetable.js', function () {
		db.transaction(populateDB_ztl_event_timetable, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_timetable;', [], function(tx, res) {
					console.log('13 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_event_pricing.js', function () {
		db.transaction(populateDB_ztl_event_pricing, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_pricing;', [], function(tx, res) {
					console.log('14 >>>>>>>>>> ztl_event_pricing res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_category.js', function () {
		db.transaction(populateDB_ztl_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_category;', [], function(tx, res) {
					console.log('15 >>>>>>>>>> ztl_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_event_category.js', function () {
		db.transaction(populateDB_ztl_event_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_event_category;', [], function(tx, res) {
					console.log('16 >>>>>>>>>> ztl_event_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour.js', function () {
		db.transaction(populateDB_ztl_tour, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
					console.log('21 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_tour_translation.js', function () {
		db.transaction(populateDB_ztl_tour_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
					console.log('22 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_chaters.js', function () {
		db.transaction(populateDB_ztl_tour_chaters, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
					console.log('23 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_images.js', function () {
		db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
					console.log('24 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_info.js', function () {
		db.transaction(populateDB_ztl_info, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_info;', [], function(tx, res) {
					console.log('31 >>>>>>>>>> ztl_info res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_idx.js', function () {
        db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
            console.log('99 >>>>>>>>>> ztl_idx');

            console.log("zagon --- nalagam nastavitve po insertu");
            load_mobile();
        });
    });
}