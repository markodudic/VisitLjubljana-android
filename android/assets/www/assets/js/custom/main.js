//mobile-desktop version
var db_type	  	  = 1;
var settings_type = 1;
var local_db	  = 0;

//footer
var footer		  = "";

//event_filter
var event_filter  = "";

//my_visit_settings
var my_visit_settings_menu = "";

//navigation
var current		  = 0;
var active_menu	  = 0;
var group 		  = 0;
var trips   	  = {}; //0-event, 1-info, 2-tour, 4 - voice, 5 - filtered events, 6 - tour list
var trips_title   = {}; //0-event, 1-info, 2-tour
var tours		  = {};  //toure po kategorijah. ID kategorije je key
var selected_div  = null;
var main_menu     = null;
var swipe		  = 0;
var swipe_group	  = 0;
var swipe_dir 	  = "";
var backstep	  = 0;

//voice guide
var media_status  = 0;
var media_opened  = 0;
//var media_poi_id  = 0;
var voice_guide   = 0;

//history
var view_main_menu 	= 1;
var current_div		= "";

//iscroll
var myScroll;

//skip update
var skip_update 	 = 0;
var menu_select_lang = 0;
var update_running 	 = 0;

var selected_group = -1;

document.addEventListener("deviceready", on_device_ready, false);

function on_device_ready() {
	db 		= window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);
	
	pOld 	= new Proj4js.Point(0,0);
	
	load_settings();
	init_gps();

	/*var hash = window.location.hash;
	hash = hash.replace(/^.*?#/,'');
	var hash_split = hash.split(";");
	
	if (hash == "go_back") {
		backstep 	= 1;
		skip_update = 1;
	} else if (hash == "voice_guide") {
		$.getScript('./assets/js/custom/trips.js', function () {
	        skip_update = 1;
	        //load_voice_guide(1);
			voice_guide = 1; 
			load_page(template_lang+'trips.html', 'trips', trips[4], 'fade', false, 4);
	    });	
	} else 	if (hash == "lang_settings") {
		swipe 			 = 0;
		settings		 = new Object();
		skip_update 	 = 1;
		menu_select_lang = 1;
	} else if (hash == "content") { 
		skip_update = 1;
	} else {*/
		navigator.splashscreen.show();
		skip_update = 0;
	//}

	//prvic napolnimo po izbiri jezika
	if (localStorage.getItem(localStorage.key('first_run')) != null) {
		get_cache();
	}

	//document.addEventListener("backbutton", go_back, true);

	if (localStorage.getItem(localStorage.key('first_run')) == null) {
		localStorage.setItem('history', JSON.stringify(tmp_history));
		localStorage.setItem('first_run', 0);
	}

}

function reset_cache() {
	show_spinner();
	
	load_main_menu(); 
	
	load_pois(215, 7, 0);
    load_pois(217, 3, 0);
    load_pois(219, 4, 0);
    load_pois(220, 9, 0);
    load_pois(222, 8, 0);
    load_events(0);
    load_info(0);
    load_tour_list(0);
    load_voice_guide(0);
    
    set_cache();
    
    hide_spinner();
}

function set_cache() {
    localStorage.setItem('trips', JSON.stringify(trips));
    localStorage.setItem('trips_title', JSON.stringify(trips_title));
    localStorage.setItem('event_type', JSON.stringify(event_type));
    
}

function get_cache() { 
	console.log("GET CACHE");
	if (localStorage.getItem('trips') == null) {
		reset_cache();
	} else {
		if (localStorage.getItem('trips') != null) {
			trips = JSON.parse(localStorage.getItem('trips'));
		}
		if (localStorage.getItem('trips_title') != null) {
			trips_title = JSON.parse(localStorage.getItem('trips_title'));
		}
		if (localStorage.getItem('event_type') != null) {
			event_type = JSON.parse(localStorage.getItem('event_type'));
		}
	}
}




function load_main_screen(save_history) {
	//shrani v localhost
	if (save_history == 1) {
		var history_string = "fun--load_main_screen--empty";
		add_to_history(history_string);
	}

	swipe = 0;
	load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false, 0);
}

function swipe_right_handler() {
	if (swipe == 1) {
		if (db_type == 1) {
			var j = 0;
			if (trips != null) {
				if (selected_div == 'tour') {
					var res = trips[6].tours[selected_group];
				} else {
					var res = trips[selected_group];
				}
				
				for (i=0; i<res.items.length; i++) {
					if (res.items[i]['id'] == current) {
						j = i-1;
					}
				}
				
				if (j == -1) {
					j = res.items.length-1;
				}
				
				current = res.items[j]['id'];
				
				if (swipe_group == 1) {
					load_page(template_lang+'trip.html', 'trip', res.items[j], 'slide', true, selected_group);
				} else if (swipe_group == 2) {
					swipe_dir = "right";
					load_event(res.items[j].id);
				} else if (swipe_group == 3) {
					swipe_dir = "right";
					load_tour(res.items[j].id);
				} else if (swipe_group == 4) {
					swipe_dir = "right";
					load_single_info(res.items[j].id);
				}
			}
		}
	}
}

function swipe_left_handler() {
	if (swipe == 1) {
		if (db_type == 1) {
			var j = 0;
			if (selected_div == 'tour') {
				var res = trips[6].tours[selected_group];
			} else {
				var res = trips[selected_group];
			}
			
			for (i=0; i<res.items.length; i++) {
				if (res.items[i]['id'] == current) {
					j = i+1;
				}
			}
			
			if (j == res.items.length) {
				j = 0;
			}
			
			current = res.items[j]['id'];

			if (swipe_group == 1) {
				load_page(template_lang+'trip.html', 'trip', res.items[j], 'slide', false, selected_group);
			} else if (swipe_group == 2) {
				swipe_dir = "left";
				load_event(res.items[j].id);
			} else if (swipe_group == 3) {
				swipe_dir = "left";
				load_tour(res.items[j].id);
			} else if (swipe_group == 4) {
				swipe_dir = "left";
				load_single_info(res.items[j].id);
			}
		}
	}
}

/*
function save_swipe_history(index, direction) {
	if (direction == true) {
		direction = false;
	} else {
		direction = true;
	}

	var history_string = "fun--load_trip_content--"+index+"__slide__"+direction;
	add_to_history(history_string);
	
}
*/

function load_page(template, div, data, transition, reverse, id_group) {
	console.log("load page="+id_group+":"+template+":"+data+":"+voice_guide);

	if (footer == "") {
		footer = load_template("ztl_footer.html", "#tpl_ztl_footer");
	}

	if (media == "") {
		media = load_template("ztl_media_player.html", "#tpl_ztl_media_player");
	}
	
	if (event_filter == "") {
		event_filter = load_template("event_filter.html", "#tpl_event_filter");
	}

	if (my_visit_settings_menu == "") {
		my_visit_settings_menu = load_template("my_visit_settings_menu.html", "#tpl_my_visit_settings_menu");
	}
	
	if (id_group != undefined) {
		selected_group = id_group;
	}
	selected_div = div;

	$.ajax({
		type:"GET",
		url:template_root+template,
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			var menu_icon 	 = 3;
			var extra_div_id = "";
			
			if (div == 'trips') {
				extra_div_id 		= "_"+id_group;
				data.extra_div_id 	= id_group;
				data.page_title 	= trips_title[id_group];
			} else if (div == 'events') {
				data.categories 	= event_type;
				data.page_title 	= trips_title[id_group];
				data.map_button 	= map_translation[settings.id_lang];
				data.events_title 	= events_translation[settings.id_lang];
				data.default_category = default_category_translation[settings.id_lang];
				data.potrdi_button 	= confirm_translation[settings.id_lang];
				$('body').html("");
			} else if (div == 'filtered_events') {
				data.page_title 	= trips_title[id_group];
				data.categories 	= event_type;
				data.page_title 	= trips_title[id_group];
				data.events_title 	= events_translation[settings.id_lang];
				data.default_category = default_category_translation[settings.id_lang];
				data.potrdi_button 	= confirm_translation[settings.id_lang];
				$('body').html("");
			} else if (div == 'event') {
				data.categories 				= event_type;
				data.ztl_item_details_title 	= title_translation[settings.id_lang];
				data.events_title 				= events_translation[settings.id_lang];
				data.ztl_item_details_description = description_translation[settings.id_lang];
				data.ztl_item_details_venue 	= venue_translation[settings.id_lang];
				data.ztl_item_details_price 	= price_translation[settings.id_lang];
				data.default_category 			= default_category_translation[settings.id_lang];
				data.guide_button				= voice_guide_translation_full[settings.id_lang];
				data.potrdi_button 				= confirm_translation[settings.id_lang];
				data.map_button 				= map_translation[settings.id_lang];
				extra_div_id 					= "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			} else 	if (div == 'tour') {
				data.ztl_item_details_description = description_translation[settings.id_lang];
				data.guide_button				= voice_guide_translation_full[settings.id_lang];
				data.tour_category_id 			= selected_group;
				extra_div_id 					= "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			} else if (div == 'tours') {
				data.page_title 	= data.items[id_group].tour_category;
			} else if (div == 'tour_category') {
				data.page_title 	= main_menu['img6'];
			} else if (div == 'infos') {
				data.page_title 	= trips_title[id_group];
			} else if (div == 'info') {
				data.ztl_item_details_description = description_translation[settings.id_lang];
				extra_div_id 		= "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			} else if (div == 'trip') {
				data.ztl_item_details_description = description_translation[settings.id_lang];
				data.map_button 				= map_translation[settings.id_lang];
				data.ztl_item_details_title 	= title_translation[settings.id_lang];
				data.guide_button				= voice_guide_translation_full[settings.id_lang];
				data.id_group 					= id_group;
				data.tmi = tmi;
				if (data.title.length>max_dolzina_naslov) {
					data.title=data.title.substring(0,max_dolzina_naslov)+"...";
				}
				if (data.star != 0) {
					data.shadow="true";
				}
			} else if (div == 'main_menu') {
				view_main_menu 	= 1;
				voice_guide		= 0;
			} else if (div == 'ztl_settings') {
				menu_icon 	= 5;
				data = {};
				data.title 				= settings_translation[settings.id_lang];
				data.my_visit_account 	= my_visit_account_translation[settings.id_lang];
				data.reminder 			= reminder_translation[settings.id_lang];
				data.set_language		= set_language_translation[settings.id_lang];
				data.synchronization	= synchronization_translation[settings.id_lang];
				data.rate 				= rate_translation[settings.id_lang];
				data.about				= about_translation[settings.id_lang];
				voice_guide				=0;
			} else if (div == 'ztl_synhronization') {
				data = {};
				data.synhronization_title 	= synhronization_title_translation[settings.id_lang];
				data.synhronization_desc 	= synhronization_desc_translation[settings.id_lang];
				data.synhronization_button 	= synhronization_button_translation[settings.id_lang];
			} else if (div == 'ztl_about') {
				data = {};
				data.about_title	= about_translation[settings.id_lang];
				data.about_version 	= about_version_translation[settings.id_lang];
				data.about_contact 	= about_contact_translation[settings.id_lang];
				data.about_desc		= about_desc_translation[settings.id_lang];
			} else if (div == "my_visit_list") {
				data.page_title  	= my_visit_page_title_translation[settings.id_lang];
				data.select_view 	= select_view_translation[settings.id_lang];
				data.confirm 	 	= confirm_translation[settings.id_lang];
				data.show_on_map 	= show_on_map_translation[settings.id_lang];
				data.my_visit_sync  = my_visit_sync_translation[settings.id_lang];
				data.logout 		= logout_translation[settings.id_lang];
				data.clear_my_visit = clear_my_visit_translation[settings.id_lang];
				data.dots 		 	= 1;
				voice_guide			= 0;
			} else if (div == "guide_buy") {
				data.title 				= voice_guide_translation[settings.id_lang].toUpperCase();
				data.guide_buy_desc 	= guide_buy_desc_translation[settings.id_lang].toUpperCase();
				data.guide_buy_desc_text= guide_buy_desc_text_translation[settings.id_lang].toUpperCase();
				data.guide_buy_locations= guide_buy_locations_translation[settings.id_lang].toUpperCase();
				data.guide_buy_button	= guide_buy_button_translation[settings.id_lang].toUpperCase();
			} else if (div == "my_visit_settings") {
				data.page_title 					= my_visit_page_title_translation[settings.id_lang];
				data.my_visit_download_translation 	= my_visit_download_translation[settings.id_lang];
				data.user_name						= user_name_translation[settings.id_lang];
				data.password						= password_translation[settings.id_lang];
				data.forgotten_pass					= forgotten_pass_translation[settings.id_lang];
				data.register_translation			= register_translation[settings.id_lang];
				data.login						    = login_translation[settings.id_lang];
				data.my_visit_tours					= my_visit_tours_translation[settings.id_lang];
				data.my_visit_poi					= my_visit_poi_translation[settings.id_lang];
				data.download 						= download_translation[settings.id_lang];
				data.logout 						= logout_translation[settings.id_lang];
				data.dots 							= 1;
			} else if (div == "ztl_map") {
				data = {};
				data.title 					= map_translation[settings.id_lang];			
			}

			if (voice_guide == 1)  {
				if (div == 'trips') {
					extra_div_id 		= "_voice_guide";
					data.extra_div_id 	= "voice_guide";
					data.page_title 	= voice_guide_translation[settings.id_lang];
				}
				data.dots 			= 1;
				data.id_group 		= VOICE_GROUP;
				menu_icon 			= 2;
			} 
			
			var res = $(temp).filter('#tpl_'+div).html();
			
			if (data != null) {
				var html = Mustache.to_html(res, data);
			} else {
				var html = res;
			}
			
			html = html.replace('[[[ztl_footer]]]', footer);
			
			if ((div == 'events') || (div == 'event') || (div == 'filtered_events')) {
				var html_event_filter = Mustache.to_html(event_filter, data);
				html = html.replace('[[[event_filter]]]', html_event_filter);
			}

			if (div == 'my_visit_list') {
				var html_my_visit_settings_menu = Mustache.to_html(my_visit_settings_menu, data);
				html = html.replace('[[[my_visit_settings_menu]]]', html_my_visit_settings_menu);
			}

			$('body').html(html);
			window.scrollTo(0,0);
			
			if (swipe == 1) {
				if (div != "main_menu") {
					var ts_div = "";
					if (div == 'trip') {
						ts_div 		= div+"_"+data['id'];
						div 		= div+"_"+data['id'];
						swipe_group = 1;
					} else if (div == 'event') {
						ts_div  = div+extra_div_id;
						swipe_group = 2;
					} else if (div == 'tour') {
						ts_div  = div+extra_div_id;
						swipe_group = 3;
					} else if (div == 'info') {
						ts_div  = div+extra_div_id;
						swipe_group = 4;
					}

					$("#"+ts_div).on('touchstart', function(e) {
					     var d = new Date();
					     touchStartTime     = d.getTime();
					     touchStartLocation = e.originalEvent.targetTouches[0].pageX;
					});

					$("#"+ts_div).on('touchmove', function(e) {
						touchEndLocation    = e.originalEvent.targetTouches[0].pageX;
					});
					
					$("#"+ts_div).on('touchend', function(e) {
					     var d = new Date();
					     touchEndTime       = d.getTime();
					     doTouchLogic();
					});
				}
			}

			if (swipe == 1) {
				animate_div(div+extra_div_id, transition, reverse);
			} 

			//ce so karte inicializiram skripto. sele po nalaganju 
			if (div == "ztl_map") {
				voice_guide=0;
				menu_icon=4;
				init_map();
			}
			
			$('.icon_'+menu_icon).attr("src","assets/css/ztl_images/icon_"+menu_icon+"_red.png");

			
			if ((div != "trips") && 
				(div != "select_language") && 
				(div != "ztl_settings") && 
				(div != "synhronization")) {
				i_scroll(div+extra_div_id);
			}
			
			pOld = new Proj4js.Point(0,0);
			navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
			
			current_div = div+extra_div_id;
		}
	});
}

var touchStartTime;
var touchStartLocation;
var touchEndTime;
var touchEndLocation;

function doTouchLogic() {
    var direction = touchStartLocation-touchEndLocation;
    var distance  = Math.abs(direction);
    var duration  = touchEndTime - touchStartTime;

    
    if (duration > 170 && distance > 120) {
         if (direction > 0) {
        	 swipe_left_handler();
         } else {
        	 swipe_right_handler();
         }
    }
}

function animate_div(div, transition, reverse) {
	if (transition == "slide") {
		$("#"+div).hide();

		if (reverse == true) {
			$("#"+div).show("slide", { direction: "left" }, 200, function() { /*$("body").swipe("enable");*/ }); 
		} else {
			$("#"+div).show("slide", { direction: "right" }, 200, function() { /*$("body").swipe("enable");*/ }); 
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

function load_template(src, tpl) {
	var tmp;
	$.ajax({
		type:"GET",
		url:template_root+template_lang+src,
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			tmp = $(temp).filter(tpl).html();
		}
	});
	//console.log("TMP="+tmp);
	return tmp;
}

function select_language(id) {
	if (settings.id_lang == id) {
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false, 0);
	} else {
		settings.id_lang = id;
		
		reset_cache();
		//samo za test sinhronizacije
		//check_updates();
		localStorage.setItem('first_synhronization', 0);
		
		if (settings_type == 1) {
			//nalozim glavni menu
			swipe = 0;
			load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false, 0);
		} else {
			save_mobile_settings();
		}
	} 
}


function dprun(t) {
	var currentField = $(t);
	var hiddenField  = $("#"+currentField.attr("id")+"_hidden");
	//var myNewDate = Date.parse(currentField.val()) || new Date();
	var myNewDate = new Date();
	window.plugins.datePicker.show({
		date : myNewDate,
		mode : 'date', // date or time or blank for both
		allowOldDates : false
		}, function(returnDate) {
			var date_array = returnDate.split("-");
			var date_obj   = new Date(date_array[0], date_array[1], date_array[2]);

			navigator.globalization.dateToString(
			  date_obj,
			  function (date) {currentField.val(date.value);},
			  function () {currentField.val(returnDate);},
			  {formatLength:'short', selector:'date'});
			
			hiddenField.val(Math.round(date_obj.getTime()/1000));
			currentField.blur();
		}
	);	
}

function load_voice_guide(save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_voice_guide--empty";
		add_to_history(history_string);
	}

	swipe		= 0;

	var tmp_query 		= "SELECT zp.*, zpt.title, 4 as id_group FROM ztl_poi zp LEFT JOIN ztl_poi_category zpc ON zpc.id_poi = zp.id LEFT JOIN ztl_category_group zcg ON zcg.id_category = zpc.id_category LEFT JOIN ztl_poi_translation zpt ON zpt.id_poi = zp.id WHERE zpt.id_language = "+settings.id_lang+" AND sound != '' GROUP BY zp.id";
	var tmp_callback	= "load_pois_success";
	
	generate_query(tmp_query, tmp_callback);
}

function do_synhronization() {
	if (navigator.network.connection.type == Connection.WIFI) {
		check_updates();
	} else {
	    alert(wifi_connection_translation[settings.id_lang]);
	}

}

var spinner; 
	
function show_spinner() {
	var opts = {
			  lines: 13, // The number of lines to draw
			  length: window.innerWidth/8, // The length of each line
			  width: window.innerWidth/24, // The line thickness
			  radius: 30, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#ff0000', // #rgb or #rrggbb
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: 'auto', // Top position relative to parent in px
			  left: 'auto' // Left position relative to parent in px
			};
	var target = document.getElementById('body');
	spinner = new Spinner(opts).spin(target);

}

function hide_spinner() {
	spinner.stop();
}