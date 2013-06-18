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

//sql error
function errorCB(err) {
	console.log("err");
	console.log(err.code);
	console.log(err);
}

//ob prvem zagonu napolni bazo
function populate_db_firstime() {
	$.getScript('./assets/install_db/ztl_category.js', function () {
		console.log('ztl_category local storagage loaded');

		db.transaction(populateDB_ztl_category, errorCB);
	});

	$.getScript('./assets/install_db/ztl_category_group.js', function () {
		console.log('ztl_category_group.js local storagage loaded');
		
		db.transaction(populateDB_ztl_category_group, errorCB);
	});

	$.getScript('./assets/install_db/ztl_group.js', function () {
		console.log('ztl_group.js local storagage loaded');
		
		db.transaction(populateDB_ztl_group, errorCB);
	});

	$.getScript('./assets/install_db/ztl_poi.js', function () {
		console.log('ztl_poi.js local storagage loaded');
		
		db.transaction(populateDB_ztl_poi, errorCB);
	});

	$.getScript('./assets/install_db/ztl_poi_category.js', function () {
		console.log('ztl_poi_category.js local storagage loaded');

		db.transaction(populateDB_ztl_poi_category, errorCB);
	});
	
	$.getScript('./assets/install_db/ztl_poi_translation.js', function () {
		console.log('ztl_poi_translation.js local storagage loaded');

		db.transaction(populateDB_ztl_poi_translation, errorCB);
	});
}