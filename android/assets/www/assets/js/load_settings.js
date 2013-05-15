function load_settings() {
	swipe = 0;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
		load_mobile();
	} else {
		load_desktop();
	}
}

function load_mobile() {
	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}

 function gotFS(fileSystem) {
	console.log(fileSystem);
	fileSystem.root.getFile("ztl/settings.txt", {create: true, exclusive: false}, gotFileEntry, fail);
	
}

function gotFileEntry(fileEntry) {
	console.log(fileEntry);
	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer) {
	writer.onwriteend = function(evt) {
		console.log("contents of file now 'some sample text'");
		writer.truncate(11);  
		writer.onwriteend = function(evt) {
			console.log("contents of file now 'some sample'");
			writer.seek(4);
			writer.write(" different text");
			writer.onwriteend = function(evt){
				console.log("contents of file now 'some different text'");
			}
		};
	};
	writer.write("some sample text");
}

function fail(error) {
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
			console.log(resp);
			settings = resp;
		}
	});

	if (settings.id_lang == 0) {
		load_page('select_language.html', 'select_language', null, 'fade', false);
	} else {
		load_page(template_lang+'main_menu.html', 'main_menu', null, 'fade', false);
	}
}