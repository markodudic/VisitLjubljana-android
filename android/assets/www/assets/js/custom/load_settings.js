//events filter
var date_from      = "";
var date_to 	   = "";
var event_category = 0;


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
			console.log('local storagage loaded');
			db.transaction(populateDB, errorCB);
		});
	}
}


function load_pois(id, trips_menu_id, save_history) {
	//shrani v localhost
	if (save_history == 1)  {
		var history_string = "fun--load_pois--"+id+"__"+trips_menu_id;
		add_to_history(history_string);
	}

	console.log("local id "+id);
	console.log("local trips_menu_id "+trips_menu_id);

	if (trips_menu_id > 0) {
		tmi = trips_menu_id;
	}
	
	trips_title = main_menu['img'+tmi];
	
	if (id == 0) {
		alert('menu nima nastavljenih vsebin');
	} else {
		group = id;
		$.getScript('./assets/js/custom/trips.js', function () {
			var tmp_query 		= 'SELECT zp.*, zpt.title, zcg.id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zcg.id_group = '+group+' AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
			var tmp_callback	= "load_pois_success";
			
			generate_query(tmp_query, tmp_callback);
		});
    }
}

function load_events(save_history) {
	date_from      = "";
	date_to 	   = "";
	event_category = 0;
	
	swipe = 0;
	if (save_history == 1)  {
		var history_string = "fun--load_events--empty";
		add_to_history(history_string);
	}

	trips_title = main_menu['img2'];

	
	var tmp_query    = "SELECT e.id, et.title, ett.venue_id, ett.date, p.coord_x, p.coord_y, ett.venue as poi_title, p.image FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id LEFT JOIN  ztl_event_timetable ett ON ett.id_event = e.id LEFT JOIN ztl_poi p ON p.id = ett.venue_id WHERE et.id_language = "+settings.id_lang+" GROUP BY e.id ORDER BY e.id";
    var tmp_callback = "events_success";
    generate_query(tmp_query, tmp_callback);

	load_event_type();
}

function load_tours(save_history)  {
    swipe = 0;
    if (save_history == 1)  {
        var history_string = "fun--load_tours--empty";
        add_to_history(history_string);
    }

    trips_title = main_menu['img6'];

    var tmp_query      = "SELECT t.id, tt.title, tt.short_description, ti.image FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id LEFT JOIN ztl_tour_images ti ON t.id = ti.id_tour WHERE tt.id_language = "+settings.id_lang+" GROUP BY t.id";
    var tmp_callback = "tour_success";
    generate_query(tmp_query, tmp_callback);
}

function load_mobile() {
	console.log('zagon --- nalagam mobilno');
	
	//preverim, ce je fajl ze bil kreiran
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("Android/data/com.vigred.ztl/settings.json", null, function(fileEntry) {
			local_db = 1;
		}, fail);
	} , null); 

	if (local_db == 1) {
		console.log('zagon -- fajl obstaja');
		load_moblie_settings();
	} else {
		console.log('zagon -- fajl ne obstaja');
		create_file();
	}
}

function create_file() {
	console.log('zagon -- nalagam create');

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getDirectory("Android/data/com.vigred.ztl", {create: true, exclusive: false}, function(dir){}, fail); 
    } , null); 

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("Android/data/com.vigred.ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);
}

function gotFileEntry(fileEntry) {
	console.log('nalagam gotFileEntry');
	console.log(fileEntry);
	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
	console.log('nalagam writer');
	console.log(writer);
	console.log(JSON.stringify(settings));
	
	writer.onwrite = function(evt) {
		load_main_menu();
		load_moblie_settings(); 
	};
	writer.write(JSON.stringify(settings));
}

function save_mobile_settings() {
	console.log('save_mobile_settings');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("Android/data/com.vigred.ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);
    load_moblie_settings();
}

function load_moblie_settings() {
	console.log('nalagam mobilne nastavitve');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("Android/data/com.vigred.ztl/settings.json", null, function(fileEntry) {
			fileEntry.file(readAsText, fail);
		}, fail);
	} , null); 
}

function readAsText(file) {
	console.log('nalagam readAsText');
	var reader = new FileReader();
	reader.onloadend = function(evt) {

    	var tmp = JSON.parse(evt.target.result);
		console.log("tmp zapis"+tmp.id_lang);
		if (tmp.id_lang == undefined) {
			console.log('nastavitve niso pravilne'); 
			load_page('select_language.html', 'select_language', null, 'fade', false);
		} else {
			console.log('nastavitve pravilne in nalozene');
			settings = tmp;
			load_main_menu();
			swipe = 0;

			
			if (skip_update == 0) {
				check_updates();
			}

			if (backstep == 1) {
				go_back();
			} else {
				localStorage.clear();

				if (menu_select_lang == 1) {
					load_page('select_language.html', 'select_language', null, 'fade', false);
				} else {
					load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
				}
			}
		}

		console.log("zagon --- jezik id" + settings.id_lang);

		menu_select_lang = 0;
	};
	reader.readAsText(file);

	console.log(JSON.stringify(settings));
}

function fail(error) {
	console.log('nalagam error');
	console.log("error code: "+error.code);
}

function check_updates() {
	console.log("check updates");

	var tmp_query    = "SELECT count(id) AS nr FROM ztl_event";
    var tmp_callback = "count_ztl_event_success";
    generate_query(tmp_query, tmp_callback);
}

/*
function load_desktop() {
	$.ajax({
		type:"GET",
		url:'assets/tmp_settings/settings.js',
		cache:false,
		async:false,
		dataType: 'json',
		success:function(resp){
			settings = resp;
			load_main_menu();
		}
	});
	
	if (settings.id_lang == 0) {
		swipe = 0;
		load_page('select_language.html', 'select_language', null, 'fade', false);
	} else {
		swipe = 0;
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
	}
}
*/

function load_settings_page(){
	swipe = 0;
	load_page('select_language.html', 'select_language', null, 'fade', false);
}

function load_main_menu() {
	var language_index = settings.id_lang - 1;
	main_menu = lang.language_menu[language_index];
}