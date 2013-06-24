var callback	= "";
var query 		= "";

function generate_query(q, cb) {
	console.log("generate_query");

	query 		= q;
	callback	= cb;

	db.transaction(db_query, errorCB);
}


function db_query(tx) {
	console.log("db_query");

	console.log(query);
	console.log(callback);

    tx.executeSql(query, [], db_success, errorCB);
}

function db_success (tx, results) {
	window[callback](results);
}


//preveri ce baza obstaja, ce ne klice funkcijo, ki jo napolni
function check_db_success(results) {
	console.log(JSON.stringify(results));
    if (results.rows.length != 1) {
    	console.log("polnim bazo");
    	populate_db_firstime();
	}
}

//nalozi poije
function load_pois_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    for (var i=0; i<len; i++){
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

function top_events_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    for (var i=0; i<len; i++){
    	res.items[i] = results.rows.item(i);
    }

	top_events = res.items;
}

function events_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    for (var i=0; i<len; i++){
    	res.items[i] = results.rows.item(i);
    }

    var data 			= {};
	data.top_events_0 	= top_events[0];
	data.top_events_1 	= top_events[1];
	data.top_events_2 	= top_events[2];
	data.items 			= res.items;

	load_page(template_lang+'events.html', 'events', data, 'fade', false);
}

function tour_success(results) {
	var res = {};
    res.items = [];
    var len = results.rows.length;
    for (var i=0; i<len; i++){
    	res.items[i] = results.rows.item(i);
    }

    load_page(template_lang+'tours.html', 'tours', res, 'fade', false);
}

//sql error
function errorCB(err) {
	console.log("err");
	console.log(err.code);
	console.log(err);
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
					console.log('7 >>>>>>>>>> ztl_event res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_translation.js', function () {
		db.transaction(populateDB_ztl_event_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_translation;', [], function(tx, res) {
					console.log('8 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_event_pricing.js', function () {
		db.transaction(populateDB_ztl_event_pricing, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_pricing;', [], function(tx, res) {
					console.log('9 >>>>>>>>>> ztl_event_pricing res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_category.js', function () {
		db.transaction(populateDB_ztl_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_category;', [], function(tx, res) {
					console.log('10 >>>>>>>>>> ztl_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_event_event_category.js', function () {
		db.transaction(populateDB_ztl_event_event_category, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_event_event_category;', [], function(tx, res) {
					console.log('11 >>>>>>>>>> ztl_event_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour.js', function () {
		db.transaction(populateDB_ztl_tour, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
					console.log('12 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});

	$.getScript('./assets/install_db/ztl_tour_translation.js', function () {
		db.transaction(populateDB_ztl_tour_translation, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
					console.log('13 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour.js', function () {
		db.transaction(populateDB_ztl_tour, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
					console.log('14 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_chaters.js', function () {
		db.transaction(populateDB_ztl_tour_chaters, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
					console.log('15 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
	
	$.getScript('./assets/install_db/ztl_tour_images.js', function () {
		db.transaction(populateDB_ztl_tour_images, errorCB, function(tx) {
			db.transaction(function(tx) {
				tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
					console.log('16 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
				});
			});
		});
	});
}