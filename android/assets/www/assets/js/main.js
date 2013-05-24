var template_root = 'templates/';
var template_lang = 'si/';
var active_menu	  = 0;
var settings	  = new Object();
var db 			  = null;
var db_type	  	  = 1;
var settings_type = 1;
var swipe		  = 0;
var current		  = 0;
var local_db	  = 0;
var footer		  = "";
var my_media 	  = null;
var media_timer   = null;

var file = "/android_asset/www/uploads/mp3/mp3_test.mp3";
//var file = "uploads/mp3/mp3_test.mp3";

document.addEventListener("deviceready", on_device_ready, false);

function on_device_ready() {
	$('body').on( 'swipeleft', swipe_left_handler );
	$('body').on( 'swiperight', swipe_right_handler );
	
	load_settings();
}

function swipe_left_handler(event) {
	if (swipe == 1) {
		if (db_type == 1) {
			var j = 0;
			var items = trips.items;

			for (i=0; i<items.length; i++) {
				if (items[i]['id'] == current) {
					j = i-1;
				}
			}
			
			if (j == -1) {
				j = items.length-1;
			}
			
			current = items[j]['id'];
			
			load_page(template_lang+'trip.html', 'div_trip', trips.items[j], 'slide', false);
		}
	}
}

function swipe_right_handler(event) {
	if (swipe == 1) {
		if (db_type == 1) {
			var j = 0;
			var items = trips.items;

			for (i=0; i<items.length; i++) {
				if (items[i]['id'] == current) {
					j = i+1;
				}
			}
			
			if (j == items.length) {
				j = 0;
			}
			
			current = items[j]['id'];
			
			load_page(template_lang+'trip.html', 'div_trip', trips.items[j], 'slide', true);
		}
	}
}

function load_page(template, div, data, transition, reverse) {
	if (footer == "") {
		load_footer();
	}

	$.ajax({
		type:"GET",
		url:template_root+template,
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			var res = $(temp).filter('#tpl_'+div).html();
			
			if (data != null) {
				var html = Mustache.to_html(res, data);
			} else {
				var html = res;
			}

			html = html.replace('[[[ztl_footer]]]', footer);

			if (swipe == 1) {
				div = div+"_"+data['id'];
			}

			$('body').append(html).trigger('create');;

			/*
			$('#sortable').sortable();
			$("#sortable").disableSelection();
			*/
			
			//ce so karte inicializiram skripto
			console.log("div: "+div);
			if (div == "show_map") {
				show_map();
			}
			
			$.mobile.changePage( "#"+div, {
				transition: transition,
				reverse: reverse,
				changeHash: false,
			});
			
			console.log($('.img_crop').width());
			console.log($('.img_crop').height());
			
			console.log($('.ztl_list_li').width());
			console.log($('.ztl_list_li').height());
			
			//remove_old_divs(div);
		}
	});
}

function load_footer() {
	$.ajax({
		type:"GET",
		url:template_root+template_lang+"ztl_footer.html",
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			footer = $(temp).filter('#tpl_ztl_footer').html();
		}
	});
}

function remove_old_divs(div) {
	var loaded_divs = $('body').find('.ztl_remove_from_page');
	loaded_divs.each(function() {
		if (this.id != div) {
			$('body').remove(this);
		}
	});
}

function select_language(id) {
	settings.id_lang = id;

	console.log(JSON.stringify(settings));
	console.log(db_type);

	if (settings_type == 1) {
		//nalozim glavni menu
		load_page(template_lang+'main_menu.html', 'main_menu', null, 'fade', false);
	} else {
		console.log('shrani mobilno');
		save_mobile_settings();
	}
} 

function load_trips() {
	$.getScript('./assets/js/trips.js', function () {
        load_trips();
    });
}

function edit_settings() {
	console.log("edit_settings");
	$.getScript('./assets/js/application_settings.js', function () {
        load_current_settings();
    });
}

function play_location_sound() {
	console.log("play_location_sound");
	console.log("my media "+my_media);
	
	if (my_media != null) {
		console.log("stop");
		my_media.stop();
		my_media.release();
		
		my_media 	= null;
		media_timer = null;
		
	} else {
		console.log("start");
		$.getScript('./assets/js/play_media_file.js', function () {
			
			load_media_file(file);
		});
	}
}