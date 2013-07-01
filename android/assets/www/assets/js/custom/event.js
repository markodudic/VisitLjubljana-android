var event_type 	   = new Array();
var tmp_event_data = {};
var tmp_tours_data = {};
var event_title    = "title";
var event_date_from = "";	
var event_date_to 	= "";	

function event_filter_toggle() {
	$(".event_filter").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();

	if ($('.event_filter').is(':visible')) {
		console.log("dogodki --- event_filter is visible");
	} else {
		console.log("dogodki --- event_filter is hidden");
	}
}

function load_event_type() {
	console.log("dogodki --- nalozi kategorije dogodkov");

	var tmp_query 	 = "SELECT id, name FROM ztl_event_category e WHERE e.id_language = "+settings.id_lang+" GROUP BY id, name";
	var tmp_callback = "event_category_success";
	generate_query(tmp_query, tmp_callback);

	console.log("dogodki --- nalagam tipe dogodkov");
}


function filter_events()  {
	console.log("*****************************************");
	console.log($('#ztl_trip_filter_date_from').val());
	console.log($('#ztl_trip_filter_date_to').val());
	console.log("*****************************************");

	event_date_from = "";
	event_date_to 	= "";

	if ($('#ztl_trip_filter_date_from').val() != '') {
		event_date_from = $('#ztl_trip_filter_date_from').val().split(" ");
		event_date_from = event_date_from[2]+"-"+event_date_from[1]+"-"+event_date_from[3];

		console.log(event_date_from);
	}

	if ($('#ztl_trip_filter_date_to').val() != '') {
		event_date_to = $('#ztl_trip_filter_date_to').val().split(" ");
		event_date_to = event_date_to[2]+"-"+event_date_to[1]+"-"+event_date_to[3];

		console.log(event_date_to);
	}

	event_filter_toggle();

	var tmp_query 	 = "SELECT name FROM ztl_event_category e WHERE e.id_language = "+settings.id_lang+" AND id = "+$('#event_type').val()+" GROUP BY name";
	var tmp_callback = "event_category_title_success";
	generate_query(tmp_query, tmp_callback);

	var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, p.coord_x, p.coord_y, ett.venue as poi_title, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_event_event_category eec ON eec.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE et.id_language = "+settings.id_lang+" AND eec.id_event_category = "+$('#event_type').val()+" GROUP BY e.id ORDER BY e.id";
    var tmp_callback = "filter_events_success";
    generate_query(tmp_query, tmp_callback);
}

function load_event(id) {
	console.log(id);

	var tmp_query 	 = "SELECT  e.id, et.title, et.intro, et.description, p.coord_x, p.coord_y, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE e.id = "+id+" AND et.id_language = "+settings.id_lang+" GROUP BY e.id"; 
    var tmp_callback = "load_event_success";
    generate_query(tmp_query, tmp_callback);
}

function load_tour(id, save_history) {
	console.log(id);

	if (save_history == 1)  {
		var history_string = "fun--load_tour--"+id+"__fade__false";
		add_to_history(history_string);
	}


	var tmp_query = "SELECT t.id, tt.title, tt.short_description, tt.long_description FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id WHERE t.id = "+id;
	var tmp_callback = "load_tour_success";
    generate_query(tmp_query, tmp_callback);
}