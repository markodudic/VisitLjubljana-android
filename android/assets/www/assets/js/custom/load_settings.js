//events filter
var date_from      = "";
var date_to 	   = "";
var event_category = 0;

//tmp --
var sound_file 	= "";
var trip_id 	= 0;
//tmp -- end

var tmi = 0;
function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		settings_type 		= 2;
		
		var tmp_query 		= "SELECT name FROM sqlite_master WHERE type='table' AND name='ztl_updates'";
		var tmp_callback	= "check_db_success";
			
		generate_query(tmp_query, tmp_callback);
	} else {
		settings_type = 1;
		load_desktop();
		
		$.getScript('./assets/tmp_settings/db.js', function () {
			db.transaction(populateDB, errorCB);
		});
	}
}


function load_pois(id, trips_menu_id, save_history) {
	swipe = 0;
	
	//shrani v localhost
	if (save_history == 1)  {
		var history_string = "fun--load_pois--"+id+"__"+trips_menu_id;
		add_to_history(history_string);
	}

	if (trips_menu_id > 0) {
		tmi = trips_menu_id;
	}
	
	trips_title[id] = main_menu['img'+tmi];
	
	if (id == 0) {
		alert('menu nima nastavljenih vsebin');
	} else {
		group = id;
		//$.getScript('./assets/js/custom/trips.js', function () {
			var tmp_query 		= 	'SELECT zp.*, zpt.title, zcg.id_group, zpt.description ' + 
									'FROM ztl_poi zp  ' + 
									'LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id  ' + 
									'LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category  ' + 
									'LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id  ' + 
									'WHERE zcg.id_group = '+group+' AND zpt.id_language = '+settings.id_lang+' AND zp.record_status = 1  ' + 
									'GROUP BY zp.id '+
									'ORDER BY zpt.title';
			var tmp_callback	= "load_pois_success";
			
			generate_query(tmp_query, tmp_callback);
		//});
    }
}

//tmp 
function load_trip_content(id, transition, reverse, save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_trip_content--"+id+"__"+transition+"__"+reverse;
		add_to_history(history_string);
	}

	trip_id 	= id;
	sound_file 	= "";

	var tmp_query 		= 	'SELECT zp.*, zpt.title, zpt.description, zcg.id_group '+
							'FROM ztl_poi zp '+
							'LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id  '+
							'LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category  '+
							'LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id  '+
							'WHERE zp.id = '+id+' AND zpt.id_language = '+settings.id_lang+' '+
							'GROUP BY zp.id '+
							'ORDER BY zpt.title';
	var tmp_callback	= "load_poi_success";

	generate_query(tmp_query, tmp_callback);
}

function play_voice_guide(id) {
	if (is_purchased_and_stored() == 0) {
		load_page(template_lang+'guide_buy.html', 'guide_buy', trips[VOICE_GROUP], 'fade', false);
	} else {
		
		$(".media_payer").toggle();
		
		$(".ztl_content").toggle();
		$(".header").toggle();
		$(".footer").toggle();
	
		my_media = null;
		console.log("SOUND="+sound_file);
		load_media_file(sound_file);
	}
}

function  load_media_file(file) {
	my_media = new Media(file,
        function() {
            console.log("Audio Success");
        },
            function(err) {
                console.log(err);
        }
    );

}

function set_media_state(value) {
	media_opened = value;
}
//tmp -- end

function load_events(save_history) {
	swipe_dir 	   = "";
	date_from      = "";
	date_to 	   = "";
	event_category = 0;
	
	swipe = 0;
	if (save_history == 1)  {
		var history_string = "fun--load_events--empty";
		add_to_history(history_string);
	}

	load_event_type();

	trips_title[0] = main_menu['img2'];

	var tmp_query    = "SELECT e.id, e.featured, et.title, ett.venue_id, ett.date, ett.date_first, p.coord_x, p.coord_y, ett.venue as poi_title, e.image " +
						"FROM ztl_event e " +
						"LEFT JOIN ztl_event_translation et ON et.id_event = e.id " +
						"LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id " +
						"LEFT JOIN ztl_poi p ON p.id = ett.venue_id " +
						"WHERE et.id_language = "+settings.id_lang+" AND e.record_status = 1 " +
						"GROUP BY e.id ORDER BY e.id "+
						"ORDER BY ett.date_first";
	var tmp_callback = "events_success";
    generate_query(tmp_query, tmp_callback); 
}

function load_tour_list(save_history)  {
	swipe 			= 0;
	var tmp_query    = "SELECT * " +
						"FROM ztl_tour_category " +
						"WHERE id_language = "+settings.id_lang+" AND record_status = 1 " +
						"ORDER BY title";
	var tmp_callback = "tour_list_success";

	generate_query(tmp_query, tmp_callback); 
}

function load_tours(id_tour_category, save_history)  {
	swipe_dir 	= "";
    swipe 		= 0;
    if (save_history == 1)  {
        var history_string = "fun--load_tours--empty";
        add_to_history(history_string);
    }

    trips_title[2] = main_menu['img6'];

    var tmp_query = "SELECT t.id, tt.title, tt.short_description, ti.image, tc.id as tour_category_id, tc.title as tour_category " +
    				"FROM ztl_tour t " +
    				"LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id " +
    				"LEFT JOIN ztl_tour_tour_category ttc ON ttc.id_tour = t.id " +
    				"LEFT JOIN ztl_tour_category tc ON ttc.id_tour_category = tc.id " +
    				"LEFT JOIN ztl_tour_images ti ON t.id = ti.id_tour " +
    				"WHERE tt.id_language = "+settings.id_lang+" AND ttc.id_tour_category = "+id_tour_category+" " +
    				"GROUP BY t.id "+
    				"ORDER BY tt.title";
    var tmp_callback   = "tour_success";
    generate_query(tmp_query, tmp_callback);
}

function load_info(save_history)  {
	swipe_dir 	= "";
    swipe 		= 0;
    if (save_history == 1)  {
        var history_string = "fun--load_info--empty";
        add_to_history(history_string);
    }

    trips_title[1] = main_menu['img5'];

    var tmp_query      = "SELECT i.* " +
    					"FROM ztl_info i " +
    					"WHERE i.id_language = "+settings.id_lang+" AND i.record_status = 1 " +
    					"GROUP BY i.id "+
    					"ORDER BY title";
    var tmp_callback   = "info_success";
    generate_query(tmp_query, tmp_callback);
}


function load_inspired(save_history)  {
	swipe_dir 	= "";
    swipe 		= 0;
    if (save_history == 1)  {
        var history_string = "fun--load_inspired--empty";
        add_to_history(history_string);
    }

    trips_title[1] = main_menu['img5'];

    var tmp_query      = "SELECT i.*, it.title, it.desc " +
    					"FROM ztl_inspired i " +
    					"LEFT JOIN ztl_inspired_translation it ON it.id_inspired = i.id " +
    					"WHERE it.id_language = "+settings.id_lang+" AND i.record_status = 1 " +
    					"GROUP BY i.id "+
						"ORDER BY it.title";
    var tmp_callback   = "inspired_success";
    generate_query(tmp_query, tmp_callback);
}


function load_voice_guide(save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_voice_guide--empty";
		add_to_history(history_string);
	}

	swipe		= 0;

	var tmp_query 		= "SELECT zp.*, zpt.title, " + VOICE_GROUP + " as id_group, zp.coord_x, zp.coord_y " +
							"FROM ztl_poi zp " +
							"LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id " +
							"LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category " +
							"LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id " +
							"WHERE zpt.id_language = "+settings.id_lang+" AND sound != '' " +
							"GROUP BY zp.id "+
							"ORDER BY zpt.title";
	var tmp_callback	= "load_pois_success";
	
	generate_query(tmp_query, tmp_callback);
}



function load_event_type() {
	var tmp_query 	 = 	"SELECT id, name +" +
						"FROM ztl_event_category e " +
						"WHERE e.id_language = "+settings.id_lang+" " +
						"GROUP BY id, name "+
						"ORDER BY name";
	var tmp_callback = "event_category_success";
	generate_query(tmp_query, tmp_callback);
}

function load_event(id, save_history) {
	swipe = 1;

	if (save_history == 1)  {
		var history_string = "fun--load_event--"+id+"__fade__false";
		add_to_history(history_string);
	}

	var tmp_query 	 = "SELECT  e.id, et.title, et.intro, et.description, p.coord_x, p.coord_y, e.image " +
						"FROM ztl_event e " +
						"LEFT JOIN ztl_event_translation et ON et.id_event = e.id " +
						"LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id " +
						"LEFT JOIN ztl_poi p ON p.id = ett.venue_id " +
						"WHERE e.id = "+id+" AND et.id_language = "+settings.id_lang+" " +
						"GROUP BY e.id"; 
    var tmp_callback = "load_event_success";
    generate_query(tmp_query, tmp_callback);
}

function load_tour(id, save_history) {
	swipe = 1;

	if (save_history == 1)  {
		var history_string = "fun--load_tour--"+id+"__fade__false";
		add_to_history(history_string);
	}


	var tmp_query = "SELECT t.id, tt.title, tt.short_description, tt.long_description " +
					"FROM ztl_tour t " +
					"LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id " +
					"WHERE t.id = "+id;

	var tmp_callback = "load_tour_success";
    generate_query(tmp_query, tmp_callback);
}

function load_single_info(id, save_history) {
	swipe = 1;

	if (save_history == 1)  {
		var history_string = "fun--load_single_info--"+id+"__fade__false";
		add_to_history(history_string);
	}

	//ko bo osbstajala tabela se popravi query
	var tmp_query = "SELECT i.* " +
				"FROM ztl_info i " +
				"WHERE i.id_language = "+settings.id_lang+" AND i.id = "+id+" AND i.record_status = 1 " +
				"GROUP BY i.id";
	var tmp_callback = "load_info_success";
    generate_query(tmp_query, tmp_callback);
}

function load_mobile() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        fileSystem.root.getFile("Android/data/com.innovatif.ztl/settings.json", { create: false }, fileExists, fileDoesNotExist);
    }, getFSFail); 
}

function fileExists(fileEntry){
	local_db = 1;
    load_moblie_settings();
}
function fileDoesNotExist(){
   create_file();
}
function getFSFail(evt) {
    create_file();
}

function create_file() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getDirectory("Android/data/com.innovatif.ztl", {create: true, exclusive: false}, function(dir){}, fail); 
    } , null); 

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("Android/data/com.innovatif.ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);
}

function gotFileEntry(fileEntry) {
	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
	writer.onwrite = function(evt) {
		load_main_menu();
		load_moblie_settings(); 
	};
	writer.write(JSON.stringify(settings));
}

function save_mobile_settings() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("Android/data/com.innovatif.ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);
    //load_moblie_settings();
}

function load_moblie_settings() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("Android/data/com.innovatif.ztl/settings.json", null, function(fileEntry) {
			fileEntry.file(readAsText, fail);
		}, fail);
	} , null); 
}

function readAsText(file) {
	var reader = new FileReader();
	reader.onloadend = function(evt) {

    	var tmp = JSON.parse(evt.target.result);

		if (tmp.id_lang == undefined) {
			load_page('select_language.html', 'select_language', null, 'fade', false, 0);
		} else {
			settings = tmp;
			load_main_menu();
			swipe = 0;

			/*if (skip_update == 0) {
				if (localStorage.getItem(localStorage.key('first_run')) == null) {
					check_updates();
				}
			}*/

			if (backstep == 1) {
				go_back();
			} else {
				//localStorage.clear();

				if (menu_select_lang == 1) {
					load_page('select_language.html', 'select_language', null, 'fade', false, 0);
				} else {
					load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false, 0);
				}
			}
		}
		menu_select_lang = 0;
	};
	reader.readAsText(file);
}

function fail(error) {
	console.log('nalagam error');
	console.log("error code: "+error.code);
}

function check_updates() {
	var tmp_query    = "SELECT last_update AS lu " +
						"FROM ztl_updates " +
						"WHERE id_language = "+settings.id_lang;
    var tmp_callback = "last_update_success";
    generate_query(tmp_query, tmp_callback);
}

function load_settings_page(){
	swipe = 0;
	load_page('select_language.html', 'select_language', null, 'fade', false, 0);
}

function load_main_menu() {
	var language_index = settings.id_lang - 1;
	main_menu = lang.language_menu[language_index];
}