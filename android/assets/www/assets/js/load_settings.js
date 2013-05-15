function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		load_mobile();
		//mrn prikljucit tablco
	} else {
		load_desktop();
	}
}

function load_mobile() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		console.log(fileSystem);
		fileSystem.root.getFile("ztl/settings.txt", null, function(fileEntry) {
			fileEntry.file(readAsText, fail);
		}, fail);
	} , null); 
}

function fail(error) {
	console.log(error.code);
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