function add_to_history(history_string) {
	var history = local_storage_load();
	
	history.push(history_string);
	localStorage.setItem('history', JSON.stringify(history));
}

function local_storage_load() {
	var history = [];
	if (localStorage.getItem(localStorage.key('history')) != null) {
		history = JSON.parse(localStorage.getItem(localStorage.key('history')));
	} else {
		history = tmp_history;
	}
	return history; 
}

function go_back() {
	var history = JSON.parse(localStorage.getItem(localStorage.key('history')));
	
	console.log("localStorage --- " + JSON.stringify(history));

	/*
	//media player sranje
	media_opened = 0;
	
	if (media_opened == 1) {
		$('body').html("");

		current_position = 0;
		tmp_pos 		 = 0;

		current = 0;
		curPerc = 0;

		my_media.release();
		load_trip_content(trip_id, 'fade', true, 0);
		media_opened = 0;
	} else {*/
		if (history.length > 1) {
			view_main_menu	= 0;
			var history = local_storage_load();
			var go_to 	= history[history.length-2];
			
			if (go_to != null) {
				var go_to 	= go_to.split("--"); 
			}

			history.pop();
			localStorage.setItem('history', JSON.stringify(history));

			if (go_to[0] == 'fun') {
				slide 		= 0;
				var params 	= "";

				if (go_to[2] != 'empty') {
					params = go_to[2].split("__");
				}

				if (go_to[1] == "load_pois") {
					load_pois(params[0],params[1],0);
				}

				if (go_to[1] == "load_main_screen") {
					load_main_screen(0);
				}

				if (go_to[1] == "load_voice_guide") {
					load_voice_guide(0);
				}

				if (go_to[1] == "load_events") {
					load_events(0);
				}

				if (go_to[1] == "load_tours") {
					load_tours(0);
				}


				if (go_to[1] == "load_tour") {
					load_tour(params[0], 0);
				}

				if (go_to[1] == "load_trip_content") {
					slide = 1;
					
					var tmp_transition = false;
					if (params[2] == "true") {
						tmp_transition = true;
					}

					if (backstep == 1) {
						$.getScript('./assets/js/custom/trips.js', function () {
							load_trip_content(params[0],params[1],tmp_transition,0);					
						});
					} else {
						load_trip_content(params[0],params[1],tmp_transition,0);
					}			
				}

				if (go_to[1] == "load_info") {
					load_info(0);
				}		
			}

		} else {
			if (main_menu == 0) {
				view_main_menu = 1;
				load_main_screen(0);
			}
		}
	//}
}