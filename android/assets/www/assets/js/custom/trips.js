/*
var sound_file 	= "";
var trip_id 	= 0;
swipe 			= 0;

function load_trip_content(id, transition, reverse, save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_trip_content--"+id+"__"+transition+"__"+reverse;
		add_to_history(history_string);
	}

	trip_id 	= id;
	sound_file 	= "";

	var tmp_query 		= 'SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zp.id = '+id+' AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
	var tmp_callback	= "load_poi_success";

	generate_query(tmp_query, tmp_callback);
}


function play_voice_guide(id) {
	$(".media_payer").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();

	$.getScript('./assets/js/custom/media_player_animation.js', function () {
		load_media_file(sound_file);
	});
}
*/