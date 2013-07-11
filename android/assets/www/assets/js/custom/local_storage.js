function add_to_history(history_string) {
	var history = local_storage_load();
	
	history.push(history_string);
	localStorage.setItem('history', JSON.stringify(history));
}

function local_storage_load() {
	var history = [];
	if (localStorage.getItem('history') != null) {
		history = JSON.parse(localStorage.getItem('history'));
	} else {
		history = tmp_history;
	}
	return history; 
}

function go_back() {
	var history = JSON.parse(localStorage.getItem('history'));
	
	console.log("localStorage --- " + JSON.stringify(history));

	/*
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
					//load_pois(params[0],params[1],0);
					load_page(template_lang+'trips.html', 'trips', trips[params[0]], 'fade', false, params[0]);
				}

				if (go_to[1] == "load_main_screen") {
					load_main_screen(0);
				}

				if (go_to[1] == "load_voice_guide") {
					//load_voice_guide(0);
					voice_guide = 1; 
					load_page(template_lang+'trips.html', 'trips', trips[4], 'fade', false, 4);
				}

				if (go_to[1] == "load_events") {
					//load_events(0);
					load_page(template_lang+'events.html', 'events', trips[0], 'fade', false, 0);
				}

				if (go_to[1] == "load_tours") {
					load_tours(0);
				}


				if (go_to[1] == "load_tour") {
					//load_tour(params[0], 0);
					load_page(template_lang+'tours.html', 'tours', trips[2], 'fade', false, 2);
				}

				//to mora vedno preverit aktualno stanje iz baze
				if (go_to[1] == "load_my_visit") {
					load_my_visit(0);
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
					//load_info(0);
					load_page(template_lang+'infos.html', 'infos', trips[1], 'fade', false, 1);
				}		
			}

		} else {
			if (main_menu == 0) {
				view_main_menu = 1;
			}
			load_main_screen(0);
		}
	//}
}