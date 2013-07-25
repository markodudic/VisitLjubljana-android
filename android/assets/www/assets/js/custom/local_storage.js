function add_to_history(history_string) {
	var history = local_storage_load();
	
	console.log("localhistory --- add: "+history_string);

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

	console.log("localhistory --- "+JSON.stringify(history));

	if (my_visit_filter == 1) {
		my_visit_settings_menu_toggle();
		my_visit_filter = 0;
	}
	else if (media_opened == 1) {
		media_control_stop();
		media_opened = 0;
	} else {
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
					load_page(template_lang+'trips.html', 'trips', trips[VOICE_GROUP], 'fade', false, VOICE_GROUP);
				}

				if (go_to[1] == "load_events") {
					//load_events(0);
					load_page(template_lang+'events.html', 'events', trips[EVENT_GROUP], 'fade', false, EVENT_GROUP);
				}

				if (go_to[1] == "load_tours") {
					load_tours(0);
				}


				if (go_to[1] == "load_tour") {
					//load_tour(params[0], 0);
					load_page(template_lang+'tours.html', 'tours', trips[TOUR_GROUP], 'fade', false, TOUR_GROUP);
				}

				//to mora vedno preverit aktualno stanje iz baze
				if (go_to[1] == "load_my_visit") {
					load_my_visit(0);
				}

				if (go_to[1] == "load_poi") {
					slide = 1;
					
					var tmp_transition = false;
					if (params[2] == "true") {
						tmp_transition = true;
					}

					load_poi(params[0],params[1],tmp_transition,0);
				}

				if (go_to[1] == "load_info") {
					//load_info(0);
					load_page(template_lang+'infos.html', 'infos', trips[INFO_GROUP], 'fade', false, INFO_GROUP);
				}

				if (go_to[1] == "load_guide_buy") {
					load_guide_buy();
				}

				if (go_to[1] == "load_show_map") {
					load_guide_buy();
				}

				if (go_to[1] == "load_current_settings") {
					load_current_settings();
				}

				if (go_to[1] == "load_tours_menu") {
					load_page(template_lang+'tours.html', 'tours', trips[TOUR_LIST_GROUP].tours[params[0]], 'fade', false, params[0]);
				}

				if (go_to[1] == "filter_visits") {
					filter_visits(params[0]);
				}

				if (go_to[1] == "filter_events") {
					event_call_from_history = 1;
					filter_events();
				}
				
				if (go_to[1] == "poi_filter") {
					poi_filter();
				}
				
			} else if (go_to[0] == 'main_menu') {
				voice_guide = 0;
				if (go_to[1] == INSPIRED_GROUP) {
					load_page(template_lang+'inspired.html', 'inspired', trips[INSPIRED_GROUP], 'fade', false, INSPIRED_GROUP);
				}

				if (go_to[1] == EVENT_GROUP) {
					load_page(template_lang+'events.html', 'events', trips[EVENT_GROUP], 'fade', false, EVENT_GROUP);
				}

				if (go_to[1] == POI_ZAMENITOSTI_GROUP) {
					load_page(template_lang+'trips.html', 'trips', trips[POI_ZAMENITOSTI_GROUP], 'fade', false, POI_ZAMENITOSTI_GROUP);
				}

				if (go_to[1] == POI_KULINARIKA_GROUP) {
					load_page(template_lang+'trips.html', 'trips', trips[POI_KULINARIKA_GROUP], 'fade', false, POI_KULINARIKA_GROUP);
				}

				if (go_to[1] == INFO_GROUP) {
					load_page(template_lang+'infos.html', 'infos', trips[INFO_GROUP], 'fade', false, INFO_GROUP);
				}

				if (go_to[1] == TOUR_LIST_GROUP) {
					load_page(template_lang+'tour_category.html', 'tour_category', trips[TOUR_LIST_GROUP], 'fade', false, TOUR_LIST_GROUP);
				}

				if (go_to[1] == POI_NASTANITVE_GROUP) {
					load_page(template_lang+'trips.html', 'trips', trips[POI_NASTANITVE_GROUP], 'fade', false, POI_NASTANITVE_GROUP);
				}

				if (go_to[1] == POI_ZABAVA_GROUP) {
					load_page(template_lang+'trips.html', 'trips', trips[POI_ZABAVA_GROUP], 'fade', false, POI_ZABAVA_GROUP);
				}

				if (go_to[1] == POI_NAKUPOVANJE_GROUP) {
					load_page(template_lang+'trips.html', 'trips', trips[POI_NAKUPOVANJE_GROUP], 'fade', false, POI_NAKUPOVANJE_GROUP);
				}
			} else {
				if (main_menu == 0) {
					view_main_menu = 1;
				}
				load_main_screen(0);
			}
		}
	}
}