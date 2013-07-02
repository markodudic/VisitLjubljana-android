var callback	= "";
var query 		= "";

function generate_query(q, cb) {
	console.log("generate_query");

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
	console.log(JSON.stringify(results));
    if (results.rows.length != 1) {
    	console.log("zagon --- polnim bazo");
    	populate_db_firstime();
	} else {
		console.log("zagon --- berem nastavitve");
		load_mobile();
	}
}

//nalozi poije
function load_pois_success(results) {
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

    trips = res;
    load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
}

//nalozi poi
function load_poi_success(results) {
    var res = {};
    res.items = [];
    	
    res.items[0] = results.rows.item(0);

    swipe 	= 1;
	current = trip_id;
	console.log("load poi success");
	load_page(template_lang+'trip.html', 'div_trip', res.items[0], 'fade', true);
}

//map poi
function load_map_poi_coord_success(results) {
    console.log("loading  mappoi results");
    
    points =  new Array();

    var row = results.rows.item(0);
    var tmp = new Array(row.coord_x, row.coord_y, 0, row.id);
    points.push(tmp);

    //current location -- to preberemo iz gsm -- je pofejkan zarad tega ker se drgac ne vidi na karti //me ni v LJ
    tmp = new Array('462704.999999999941792', '104070.000000000000000', 1, 0);
    points.push(tmp);
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

    var k = 0;
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
    	
    	
    	if (i<3) {
    		res.top_items[i] = results.rows.item(i);
    	} else  {
    		res.items[k] = results.rows.item(i);
    		k++;
    	}
    }

    var data 			= {};
    
	data.top_events_0 	= res.top_items[0];
	data.top_events_1 	= res.top_items[1];
	data.top_events_2 	= res.top_items[2];
	
	data.items 			= res.items;
	data.categories 	= event_type;
	trips 				= res;

	console.log("dogodki --- "+JSON.stringify(data));

	load_page(template_lang+'events.html', 'events', data, 'fade', false);
}

function event_category_success(results) {
	console.log("dogodki --- query ok");

	var len = results.rows.length;
    
    console.log("dogodki --- poizvedba "+ query);
	console.log("dogodki --- kategorije "+ JSON.stringify(results));

    for (var i=0; i<len; i++){
    	console.log("dogodki ---- "+JSON.stringify(results.rows.item(i)));
    	event_type[i] = results.rows.item(i);
    }

    console.log("dogodki --- kategorije eventov" + JSON.stringify(event_type));
}

function event_category_title_success(results) {
	event_title = results.rows.item(0).name;
}

function filter_events_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    for (var i=0; i<len; i++){
    	res.items[i] = results.rows.item(i);
    }

    res.page_sub_title 		= event_title;


    res.page_sub_title_date	= event_date_from;
    
    if (event_date_to != "") {
    	res.page_sub_title_date = res.page_sub_title_date +"-"+event_date_to;
    }

    res.categories 	   		= event_type;

    console.log("dogodki --- events_filtered.html");

    load_page(template_lang+'events_filtered.html', 'filtered_events', res, 'fade', false);
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

    var tmp_query 	 = "SELECT et.venue, et.date FROM ztl_event_timetable et WHERE et.id_event = "+id_event;
	var tmp_callback = "load_event_venue_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event_venue_success(results) {
	tmp_event_data.venue = [];

	var len = results.rows.length;
	for (var i=0; i<len; i++){
    	tmp_event_data.venue[i] = results.rows.item(i);
    }

    console.log(tmp_event_data);
    console.log(JSON.stringify(tmp_event_data));

    if (swipe_dir == "left") {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'slide', false);
    } else if (swipe_dir == "right") {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'slide', true);
	} else {
    	load_page(template_lang+'event.html', 'event', tmp_event_data, 'fade', false);
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

    trips = res;
    load_page(template_lang+'tours.html', 'tours', res, 'fade', false);
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

function count_ztl_event_success(results) {
	console.log("event check");
	console.log(results.rows.item(0));
	console.log(JSON.stringify(results.rows.item(0).nr));

	if (results.rows.item(0).nr == 0)  {
		console.log("update events and trips");
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

	$.getScript('./assets/install_db/ztl_idx.js', function () {
        db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
            console.log('99 >>>>>>>>>> ztl_idx');

            console.log("zagon --- nalagam nastavitve po insertu");
            load_mobile();

            //to naj se pol odstrani
            tmp_update_sound();
        });
    });
}

/*samo 1x povozim sound, da nebo 300 pojev v glasovnem vodicu --- ko bo urejen atribut v eportu se lahk zbrise*/
function tmp_update_sound() {
	var tmp_query 		= "UPDATE ztl_poi SET sound = ''";
	var tmp_callback	= "tmp_sound_update_success";
			
	generate_query(tmp_query, tmp_callback);

	console.log("update sound: vse na 0:"+tmp_query);
}

function tmp_sound_update_success(results) {
	var tmp_query 		= "UPDATE ztl_poi SET sound = 'sound' WHERE id IN (546, 538, 645, 652, 672, 606, 578, 586, 582, 1760, 1761, 1762, 1773, 1774)";
	var tmp_callback	= "tmp_sound_set_update_success";

	generate_query(tmp_query, tmp_callback);
	console.log("update sound: nekaj na sound:"+tmp_query);
}

function tmp_sound_set_update_success(results) {
	console.log("update sound: poi sound pofejkan");
}