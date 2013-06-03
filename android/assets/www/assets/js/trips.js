//var trips   = null;
var trip_id = 0;
swipe = 0;
function load_trips() {
	swipe = 0;
	console.log('load trips 2');
	console.log(template_lang);
	if (db_type == 1) {
		$.getJSON("./assets/tmp_settings/ztl_db.json", function(res) {
			trips = res;
			console.log('nalozi tripe');
			console.log(res);
			load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
		});
	} 
}

function load_trips_benchmark() {
	swipe = 0;
	console.log(template_lang);
	if (db_type == 1) {
		$.getJSON("./assets/tmp_settings/ztl_db.json", function(res) {
			trips = res;
			console.log('nalozi tripe');
			console.log(res);
			load_page(template_lang+'trips_benchmark.html', 'trips', res, 'fade', false);
		});
	} 
}

function load_trip_content(id, transition, reverse) {
	console.log("id   "+id);
	trip_id = id;
	console.log("trip id  "+trip_id);
	console.log("load_trip_content");
	db.transaction(load_trip_query, errorCB);
}

function load_trip_query(tx) {
	console.log("trip id  "+trip_id);
	console.log("SELECT * FROM ztl_poi WHERE id='"+trip_id+"'");
	console.log(trip_id);
    tx.executeSql("SELECT * FROM ztl_poi WHERE id="+trip_id, [], load_trip_success, errorCB);
}


function load_trip_success(tx, results) {
    console.log("load_trip_success  ok");
    console.log(JSON.stringify(results));
    
    var res = {};
    res.items = [];
    	
    res.items[0] = results.rows.item(0);

    swipe 	= 1;
	current = trip_id;
	
	console.log(JSON.stringify(res));
	load_page(template_lang+'trip.html', 'div_trip', res.items[0], 'fade', true);
}

/*
function load_trip_content(id, transition, reverse) {
	if (db_type == 1) {
		//dobim izbran object
		for (i=0; i<trips.items.length; i++) {
			if (trips.items[i]['id'] == id) {
				swipe 	= 1;
				current = id;
				load_page(template_lang+'trip.html', 'div_trip', trips.items[i], transition, reverse);
			}
		}
	}
}
*/

function remove_trip_from_list(id) {
	console.log('tu prozim se funkcijo, ki ga zbrise iz local storage');
	$('#ztl_trips_item_'+id).remove();
}

function play_sound() {
	console.log('play_sound');
}