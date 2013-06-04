function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		
		check_db();

		settings_type = 2;
		load_mobile();
	} else {
		settings_type = 1;
		load_desktop();
		
		$.getScript('./assets/tmp_settings/db.js', function () {
			console.log('local storagage loaded');
			
			//db = window.openDatabase("Database", "1.0", "ztl", 200000);
			db.transaction(populateDB, errorCB);
		});
	}
}

function check_db() {
	db.transaction(check_db_query, errorCB);
}

function check_db_query(tx) {
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='ztl_poi'", [], check_db_success, errorCB);
}


function check_db_success(tx, results) {
    console.log("database ok");
    console.log(JSON.stringify(results));
    
    console.log(results.rows.length);
    
    if (results.rows.length != 1) {
    	populate_db_firstime();
    }
}

function populate_db_firstime() {
	$.getScript('./assets/install_db/ztl_category.js', function () {
		console.log('ztl_category local storagage loaded');

		db.transaction(populateDB_ztl_category, errorCB);
	});

	$.getScript('./assets/install_db/ztl_category_group.js', function () {
		console.log('ztl_category_group.js local storagage loaded');
		
		db.transaction(populateDB_ztl_category_group, errorCB);
	});

	$.getScript('./assets/install_db/ztl_group.js', function () {
		console.log('ztl_group.js local storagage loaded');
		
		db.transaction(populateDB_ztl_group, errorCB);
	});

	$.getScript('./assets/install_db/ztl_poi.js', function () {
		console.log('ztl_poi.js local storagage loaded');
		
		db.transaction(populateDB_ztl_poi, errorCB);
	});

	$.getScript('./assets/install_db/ztl_poi_category.js', function () {
		console.log('ztl_poi_category.js local storagage loaded');

		db.transaction(populateDB_ztl_poi_category, errorCB);
	});
	
	$.getScript('./assets/install_db/ztl_poi_translation.js', function () {
		console.log('ztl_poi_translation.js local storagage loaded');

		db.transaction(populateDB_ztl_poi_translation, errorCB);
	});
}

function tmp_db(id) {
	group = id;
	$.getScript('./assets/js/trips.js', function () {
		db.transaction(queryDB, errorCB);
    });
}

function queryDB(tx) {
	console.log("group: "+group);
	
	var query = 'SELECT zp.*, zpt.* FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zcg.id_group = '+group+' AND zpt.id_language = '+settings.id_lang+' GROUP BY zp.id';
	
	console.log(query);
    tx.executeSql(query, [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var res = {};
    res.items = [];
    var len = results.rows.length;
    //console.log("DEMO table: " + len + " rows found.");
    for (var i=0; i<len; i++){
    	//console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).title);
    	res.items[i] = results.rows.item(i);
    }
     
    trips = res;
    console.log("podatki osvezeni");
    load_page(template_lang+'trips.html', 'trips', res, 'fade', false);
}

function errorCB(err) {
	console.log("err");
	console.log(err.code);
	console.log(err);
}

function load_mobile() {
	console.log('nalagam mobilno');
	
	//preverim, ce je fajl ze bil kreiran
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("ztl/settings.json", null, function(fileEntry) {
			local_db = 1;
		}, fail);
	} , null); 

	local_db = 0;


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

	writer.onwrite = function(evt) {
		load_moblie_settings(); 
	};

	writer.write(JSON.stringify(settings));
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
			load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
		}
	};
	reader.readAsText(file);
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
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
	}
}

function load_main_menu() {
	var language_index = settings.id_lang - 1;
	
	main_menu = settings.language_menu[language_index];
	console.log(main_menu);
}