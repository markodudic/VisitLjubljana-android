var trip_id = 0;
swipe = 0;

function load_trip_content(id, transition, reverse, save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_trip_content--"+id+"__"+transition+"__"+reverse;
		add_to_history(history_string);
	}

	trip_id = id;

	var tmp_query 		= 'SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zp.id = '+id+' AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
	var tmp_callback	= "load_poi_success";

	generate_query(tmp_query, tmp_callback);
}

function load_voice_guide(save_history) {
	console.log('load_voice_guide');
	if (save_history == 1)  {
		var history_string = "fun--load_voice_guide--empty";
		add_to_history(history_string);
	}


	voice_guide = 1;
	swipe		= 0;

	var tmp_query 		= "SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zpt.id_language = "+settings.id_lang+" AND sound = 'sound' GROUP BY zp.id";
	var tmp_callback	= "load_pois_success";
	
	generate_query(tmp_query, tmp_callback);
}

function play_voice_guide(id) {
	console.log('play_voice_guide');
	$(".media_payer").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();

	$.getScript('./assets/js/custom/media_player_animation.js', function () {
		console.log("animation loaded");
	});
}

function play_sound() {
	console.log('play_sound');
}