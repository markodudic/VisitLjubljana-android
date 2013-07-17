var event_type 	   			= new Array();
var tmp_event_data 			= {};
var tmp_tours_data 			= {};
var event_title    			= "";
var event_date_from 	 	= "";	
var event_date_to 		 	= "";
var event_date_from_sql  	= 0;
var event_date_to_sql 	 	= 0;
var event_category_filter 	= 0;
var event_call_from_history = 0;

function event_filter_toggle() {
	$(".event_filter").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();

	if ($('.event_filter').is(':visible')) {
		swipe = 0;
	} else {
		swipe = 1;
	}
}

function filter_events()  {
	swipe = 0;

	if (event_call_from_history == 0) {
		var history_string = "fun--filter_events--empty";
		add_to_history(history_string);

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

		event_category_filter = $('#event_type').val();

		event_filter_toggle();
	}

	event_call_from_history = 0;

	if (event_date_from_sql > event_date_to_sql) {
		navigator.notification.confirm(
				from_bigger_than_to_translation[settings.id_lang],
				null,
		        events_translation[settings.id_lang],
		        ok_translation[settings.id_lang]
		);	
	} else {
		//event_filter_toggle();

		if ($('#event_type').val() > 0) {
			var tmp_query 	 = "SELECT name " +
								"FROM ztl_event_category e " +
								"WHERE e.id_language = "+settings.id_lang+" AND id = "+$('#event_type').val()+" " +
								"GROUP BY name "+
								"ORDER BY name";
			var tmp_callback = "event_category_title_success";
			generate_query(tmp_query, tmp_callback);
		}


		//nastavim datume za sql
		if (event_date_to_sql == 0) {
			event_date_to_sql = 2379800800;
		}

		if ($('#event_type').val() > 0) {
			
			var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, ett.date_first, p.coord_x, p.coord_y, ett.venue as poi_title, e.image " +
							"FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id " +
							"LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id " +
							"LEFT JOIN ztl_event_event_category eec ON eec.id_event = e.id " +
							"LEFT JOIN ztl_poi p ON p.id = ett.venue_id " +
							"WHERE et.id_language = "+settings.id_lang+" AND eec.id_event_category = "+event_category_filter+" AND e.record_status = 1 AND date_first >= "+event_date_from_sql+" AND date_last <= "+event_date_to_sql+" " +
							"GROUP BY e.id  " +
							"ORDER BY ett.date_first";
	    } else {
	    	var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, ett.date_first, p.coord_x, p.coord_y, ett.venue as poi_title, e.image " +
				    			"FROM ztl_event e " +
				    			"LEFT JOIN ztl_event_translation et ON et.id_event = e.id " +
				    			"LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id " +
				    			"LEFT JOIN ztl_event_event_category eec ON eec.id_event = e.id " +
				    			"LEFT JOIN ztl_poi p ON p.id = ett.venue_id " +
				    			"WHERE et.id_language = "+settings.id_lang+" AND e.record_status = 1 AND date_first >= "+event_date_from_sql+" AND date_last <= "+event_date_to_sql+" " +
				    			"GROUP BY e.id " +
				    			"ORDER BY ett.date_first ";
	    }
	    var tmp_callback = "filter_events_success";
	    generate_query(tmp_query, tmp_callback);
	}
}

