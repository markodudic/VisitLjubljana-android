var event_type 	   = new Array();
var tmp_event_data = {};
var tmp_tours_data = {};
var event_title    = "";
var event_date_from 	 = "";	
var event_date_to 		 = "";
var event_date_from_sql  = 0;
var event_date_to_sql 	 = 0;

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
	swipe = 0;

	event_title    		 = "";
	event_date_from 	 = "";
	event_date_to 		 = "";
	event_date_from_sql  = 0;
	event_date_to_sql 	 = 0;

	if ($('#ztl_trip_filter_date_from').val() != '') {
		event_date_from 	= $('#ztl_trip_filter_date_from').val();
		event_date_from_sql = $('#ztl_trip_filter_date_from_hidden').val();
	}

	if ($('#ztl_trip_filter_date_to').val() != '') {
		event_date_to 		= $('#ztl_trip_filter_date_to').val();
		event_date_to_sql	= $('#ztl_trip_filter_date_to_hidden').val();
	}

	console.log("datumi -- from " + $('#ztl_trip_filter_date_from_hidden').val());
	console.log("datumi -- to " + $('#ztl_trip_filter_date_to_hidden').val());
	console.log("datumi timetable --- "+event_date_from_sql+" --- "+event_date_to_sql);

	event_filter_toggle();

	if ($('#event_type').val() > 0) {
		var tmp_query 	 = "SELECT name FROM ztl_event_category e WHERE e.id_language = "+settings.id_lang+" AND id = "+$('#event_type').val()+" GROUP BY name";
		var tmp_callback = "event_category_title_success";
		generate_query(tmp_query, tmp_callback);
	}


	//nastavim datume za sql
	console.log("datumi timetable --- "+event_date_from_sql+" --- "+event_date_to_sql);
	if (event_date_to_sql == 0) {
		event_date_to_sql = 2379800800;
	}

	if ($('#event_type').val() > 0) {
		var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, p.coord_x, p.coord_y, ett.venue as poi_title, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_event_event_category eec ON eec.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE et.id_language = "+settings.id_lang+" AND eec.id_event_category = "+$('#event_type').val()+" AND e.record_status = 1 AND date_first >= "+event_date_from_sql+" AND date_last <= "+event_date_to_sql+" GROUP BY e.id ORDER BY e.id";
    } else {
    	var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, p.coord_x, p.coord_y, ett.venue as poi_title, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_event_event_category eec ON eec.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE et.id_language = "+settings.id_lang+" AND e.record_status = 1 AND date_first >= "+event_date_from_sql+" AND date_last <= "+event_date_to_sql+" GROUP BY e.id ORDER BY e.id";
    }
    var tmp_callback = "filter_events_success";
    generate_query(tmp_query, tmp_callback);
}

function load_event(id) {
	swipe = 1;

	var tmp_query 	 = "SELECT  e.id, et.title, et.intro, et.description, p.coord_x, p.coord_y, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE e.id = "+id+" AND et.id_language = "+settings.id_lang+" GROUP BY e.id"; 
    var tmp_callback = "load_event_success";
    generate_query(tmp_query, tmp_callback);
}

function load_tour(id, save_history) {
	swipe = 1;
	console.log(id);

	if (save_history == 1)  {
		var history_string = "fun--load_tour--"+id+"__fade__false";
		add_to_history(history_string);
	}


	var tmp_query = "SELECT t.id, tt.title, tt.short_description, tt.long_description FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id WHERE t.id = "+id;
	var tmp_callback = "load_tour_success";
    generate_query(tmp_query, tmp_callback);
}