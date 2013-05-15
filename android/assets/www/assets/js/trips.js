var trips = null;
swipe = 0;
function load_trips() {
	if (db_type == 1) {
		$.getJSON("./assets/tmp_settings/ztl_db.json", function(res) {
			trips = res;
			load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
		});
	}
}

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