//mobile-desktop version
var db_type	  	  = 1;
var settings_type = 1;
var local_db	  = 0;

//footer
var footer		  = "";

//navigation
var current		  = 0;
var active_menu	  = 0;
var group 		  = 0;
var trips   	  = null;
var trips_title   = "";
var main_menu     = null;
var swipe		  = 0;

//iscroll
var myScroll;

document.addEventListener("deviceready", on_device_ready, false);

function on_device_ready() {
	navigator.splashscreen.show();
	
	db 		= window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);
	pOld 	= new Proj4js.Point(0,0);
	
	load_settings();
	init_gps();
}

function load_main_screen() {
	console.log("load_main_screen");
	swipe = 0;
	load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
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
	console.log("loading page");

	if (footer == "") {
		load_footer();
	}

	if (media == "") {
		load_media();
	}

	$.ajax({
		type:"GET",
		url:template_root+template,
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			
			var extra_div_id = "";
			if (div == 'trips') {
				extra_div_id 		= "_"+group;
				data.extra_div_id 	= group;
				data.page_title 	= trips_title;
			}
			
			var res = $(temp).filter('#tpl_'+div).html();
			
			if (data != null) {
				var html = Mustache.to_html(res, data);
			} else {
				var html = res;
			}

			html = html.replace('[[[ztl_footer]]]', footer);
						
			$('body').append(html);
			
			if (swipe == 1) {
				if (div != "main_menu") {
					div = div+"_"+data['id'];

					$("#"+div).swipe({
					    swipeLeft: function(event, distance, duration, fingerCount) { allowPageScroll:"vertical", swipe_left_handler() },
					    swipeRight: function(event, distance, duration, fingerCount) { allowPageScroll:"vertical", swipe_right_handler() }
					});

				}
			}

			//ce so karte inicializiram skripto
			if (div == "show_map") {
				show_map();
			}

			if (div != "trips") {
				i_scroll(div);
			}
			
			pOld = new Proj4js.Point(0,0);
			navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
			
			animate_div(div+extra_div_id, transition, reverse);
		}
	});
}

function animate_div(div, transition, reverse) {
	if (transition == "slide") {
		$("body").swipe("disable");
		$("#"+div).hide();

		if (reverse == true) {
			 $("#"+div).show("slide", { direction: "left" }, 400, function() {$("body").swipe("enable");}); 
		} else {
			 $("#"+div).show("slide", { direction: "right" }, 400, function() {$("body").swipe("enable");}); 
		}
	}

	remove_old_divs(div);
}

function remove_old_divs(div) {
	var loaded_divs = $('body').find('.ztl_remove_from_page');
	loaded_divs.each(function() {
		if (this.id != div) {
			$(this).remove(); 
		}
	});
}

function i_scroll(div_id) {
	myScroll = new iScroll(div_id);
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

function select_language(id) {
	settings.id_lang = id;

	if (settings_type == 1) {
		//nalozim glavni menu
		swipe = 0;
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
	} else {
		console.log('shrani mobilno');
		save_mobile_settings();
	}
} 

function load_trips() {
	console.log("load_trips");
	$.getScript('./assets/js/custom/trips.js', function () {
        load_trips();
    });
}

function edit_settings() {
	console.log("edit_settings");
	$.getScript('./assets/js/custom/application_settings.js', function () {
        load_current_settings();
    });
}

function load_media() {
	console.log("load_media");
	$.ajax({
		type:"GET",
		url:template_root+template_lang+"ztl_media_player.html",
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			media = $(temp).filter('#tpl_ztl_media_player').html();
		}
	});
}

function play_location_sound() {
	swipe = 0;
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
		$.getScript('./assets/js/custom/play_media_file.js', function () {
			
			load_media_file(file);
		});
	}
}