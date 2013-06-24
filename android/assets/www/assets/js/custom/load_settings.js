var tmi = 0;
function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		settings_type 		= 2;
		
		var tmp_query 		= "SELECT name FROM sqlite_master WHERE type='table' AND name='ztl_updates'";
		var tmp_callback	= "check_db_success";
			
		generate_query(tmp_query, tmp_callback);

		load_mobile();
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
	swipe = 0;
	if (save_history == 1)  {
		var history_string = "fun--load_events--empty";
		add_to_history(history_string);
	}

	trips_title = main_menu['img2'];


	//top 3 eventi
	var tmp_query 	 = "SELECT e.id, et.title FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id WHERE et.id_language = "+settings.id_lang+" LIMIT 3";
	var tmp_callback = "top_events_success";
	generate_query(tmp_query, tmp_callback);

	var tmp_query 	 = "SELECT e.id, et.title FROM ztl_event e LEFT JOIN ztl_event_translation et ON et.id_event = e.id WHERE et.id_language = "+settings.id_lang+" AND e.id > 26187 ";
	var tmp_callback = "events_success";
	generate_query(tmp_query, tmp_callback);

}

function load_tours(save_history)  {
	swipe = 0;
	if (save_history == 1)  {
		var history_string = "fun--load_tours--empty";
		add_to_history(history_string);
	}

	var tmp_query 	 = "SELECT t.id, tt.title, tt.short_description FROM ztl_tour t LEFT JOIN ztl_tour_translation tt ON tt.id_tour = t.id WHERE tt.id_language = "+settings.id_lang;
	var tmp_callback = "tour_success";
	generate_query(tmp_query, tmp_callback);
}

function load_mobile() {
	console.log('nalagam mobilno');
	
	//preverim, ce je fajl ze bil kreiran
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("ztl/settings.json", null, function(fileEntry) {
			local_db = 1;
		}, fail);
	} , null); 

	if (local_db == 1) {
		console.log('fajl obstaja');
		load_moblie_settings();
	} else {
		console.log('fajl ne obstaja');
		create_file();
	}
}

function create_file() {
	console.log('nalagam create');
	//create folder
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
        fileSystem.root.getDirectory("ztl", {create: true, exclusive: false}, function(dir){}, fail); 
    } , null); 
    
    //write file
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);

    load_page('select_language.html', 'select_language', null, 'fade', false);
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
	document.location.href="index.html";
}

function save_mobile_settings() {
	console.log('save_mobile_settings');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
    	fileSystem.root.getFile("ztl/settings.json", {create: true, exclusive: false}, gotFileEntry, fail);
    }, null);
    load_moblie_settings();
}

function load_moblie_settings() {
	console.log('nalagam mobilne nastavitve');
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("ztl/settings.json", null, function(fileEntry) {
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

			if (backstep == 1) {
				go_back();
			} else {
				load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
			}
		}
	};
	reader.readAsText(file);

	console.log(JSON.stringify(settings));
}

function fail(error) {
	console.log('nalagam error');
	console.log("error code: "+error.code);
}

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
		load_page('select_language.html', 'select_language', null, 'fade', false);
	} else {
		swipe = 0;
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
	}
}

function load_settings_page(){
	load_page('select_language.html', 'select_language', null, 'fade', false);
}

function load_main_menu() {
	var language_index = settings.id_lang - 1;
	main_menu = lang.language_menu[language_index];
}