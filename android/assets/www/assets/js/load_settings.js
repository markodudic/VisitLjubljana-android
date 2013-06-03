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
}

function tmp_db() {
	$.getScript('./assets/js/trips.js', function () {
		db.transaction(queryDB, errorCB);
    });
}

function queryDB(tx) {
    tx.executeSql('SELECT * FROM ztl_poi', [], querySuccess, errorCB);
}

function querySuccess(tx, results) {
    var res = {};
    res.items = [];
    var len = results.rows.length;
    //console.log("DEMO table: " + len + " rows found.");
    for (var i=0; i<200; i++){
    	//console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).title);
    	res.items[i] = results.rows.item(i);
    }
     
    trips = res;
    console.log(JSON.stringify(res));  
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
			load_page(template_lang+'main_menu.html', 'main_menu', null, 'fade', false);
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
		}
	});

	if (settings.id_lang == 0) {
		load_page('select_language.html', 'select_language', null, 'fade', false);
	} else {
		load_page(template_lang+'main_menu.html', 'main_menu', null, 'fade', false);
	}
}