var trips = null;
function load_trips() {
	prev_loaded   = 0;
	curr_loaded   = 0;
	next_loaded   = 0;
	
	if (db_type == 1) {
		$.getJSON("./assets/tmp_settings/ztl_db.json", function(res) {
			trips = res;
			load_page(template_lang+'trips.html', 'trips', res, 'fade', false, 0);
		});
	}
}

function load_trip_content(id, transition, reverse) {
	if (db_type == 1) {
		//dobim izbran object
		for (i=0; i<trips.items.length; i++) {
			if (trips.items[i]['id'] == id) {
				curr_loaded = 1;
				load_page(template_lang+'trip.html', 'trip', trips.items[i], transition, reverse, 1);
			}
		}
	}
}