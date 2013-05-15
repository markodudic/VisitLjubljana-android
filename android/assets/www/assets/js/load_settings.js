function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		settings_type = 2;
		load_mobile();
	} else {
		settings_type = 1;
		load_desktop();
	}
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