//mobile-desktop version
var db_type	  	  = 1;
var settings_type = 1;
var local_db	  = 0;

//footer
var footer		  = "";

//event_filter
var event_filter  = "";

//map_settings
var map_settings  = "";

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
	reinit();
	
	db 		= window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);
	
	pOld 	= new Proj4js.Point(0,0);
	
	load_settings();
	init_gps();

	//navigator.splashscreen.show();
	skip_update = 0;

	//za test
	//prvic napolnimo po izbiri jezika
	if (localStorage.getItem(localStorage.key('first_run')) != null) {
		get_cache();
	}

	document.addEventListener("backbutton", go_back, true);

	if (localStorage.getItem(localStorage.key('first_run')) == null) {
		localStorage.setItem('history', JSON.stringify(tmp_history));
		localStorage.setItem('first_run', 0);
	}

	//skopiram bazo za backup
	if (develop==1) copyDB();
}


function copy_success(entry) {
    console.log("New Path: " + entry.fullPath);
}

function copy_fail(error) {
	console.log(error.code+":"+FileError.NOT_FOUND_ERR);
}



function copyDB() {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
		fileSystem.root.getFile("/data/data/com.innovatif.ztl/databases/Database.db", null, function(fileEntry) {
		    
		    var parent = "/mnt/sdcard/Android/data/com.innovatif.ztl";
		    var parentName = parent.substring(parent.lastIndexOf('/')+1);
		    var parentEntry = new DirectoryEntry(parentName, parent);
		    
			fileEntry.copyTo(parentEntry, "Database.db", copy_success, copy_fail);
		}, copy_fail);
	} , null);
}
 

function reset_cache() {
	show_spinner();
	//spiner se noce prikazati ce ni zamika pred klicem funkcije za reset
	window.setTimeout(reset_cache_cont,500);
}

function reset_cache_cont() {
	load_main_menu(); 
	
	load_pois(POI_NASTANITVE_GROUP, 7, 0);
    /*load_pois(POI_ZAMENITOSTI_GROUP, 3, 0);
    load_pois(POI_KULINARIKA_GROUP, 4, 0);
    load_pois(POI_NAKUPOVANJE_GROUP, 9, 0);
    load_pois(POI_ZABAVA_GROUP, 8, 0);
    load_events(0);
    load_info(0);
    load_tour_list(0);*/
    load_voice_guide(0);
    //load_inspired(0);
    
    set_cache();
	
	select_language_cont();
}

function set_cache() {
	window.localStorage.removeItem('trips');
    window.localStorage.removeItem('trips_title');
    window.localStorage.removeItem('event_type');

    window.localStorage.setItem('trips', JSON.stringify(trips));
    window.localStorage.setItem('trips_title', JSON.stringify(trips_title));
    window.localStorage.setItem('event_type', JSON.stringify(event_type));
    
}

function get_cache() { 
	if (window.localStorage.getItem('trips') == null) {
		reset_cache();
	} else {
		if (window.localStorage.getItem('trips') != null) {
			trips = JSON.parse(window.localStorage.getItem('trips'));
		}
		if (window.localStorage.getItem('trips_title') != null) {
			trips_title = JSON.parse(window.localStorage.getItem('trips_title'));
		}
		if (window.localStorage.getItem('event_type') != null) {
			event_type = JSON.parse(window.localStorage.getItem('event_type'));
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
					var res = trips[TOUR_LIST_GROUP].tours[selected_group];
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
				var res = trips[TOUR_LIST_GROUP].tours[selected_group];
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

function onConfirm(buttonIndex) {
	if (buttonIndex == 2) do_synhronization();
    else load_main_screen();
}

function load_page(template, div, data, transition, reverse, id_group) {
	console.log("load page="+id_group+":"+div+":"+data+":"+voice_guide);
	
	if ((div == "inspired") || (div == "events") || (div == "infos") || (div == "tour_category")) {
		if ((data == undefined) || (data.items == undefined) || (data.items == null) || (data.items.length == 0)) {
		navigator.notification.confirm(
				synhronization_desc_translation[settings.id_lang],
		        onConfirm,
		        synchronization_translation[settings.id_lang],
		        confirm_popup_translation[settings.id_lang]
		    );
		};
	}
	
	
	if ((div == "trips") || (div == "events")) { 
		show_spinner();
	}
	
	if (footer == "") {
		footer = load_template("ztl_footer.html", "#tpl_ztl_footer");
	}

	if (media == "") {
		media = load_template("ztl_media_player.html", "#tpl_ztl_media_player");
	}
	
	if (event_filter == "") {
		event_filter = load_template("event_filter.html", "#tpl_event_filter");
	}

	if (map_settings == "") {
		map_settings = load_template("ztl_map_settings.html", "#tpl_ztl_map_settings");
	}

	
	if (id_group != undefined) {
		selected_group = id_group;
	}
	selected_div = div;

	 
	if ((div == "trips") && (voice_guide == 0)) {
		data = sort_by_distance(data);
   }
	
	$.ajax({
		type:"GET",
		url:template_root+template,
		cache:false,
		async:true,
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
				voice_guide				= 0;
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
				data.page_title  		= my_visit_page_title_translation[settings.id_lang];
				data.select_view 		= select_view_translation[settings.id_lang];
				data.confirm 	 		= confirm_translation[settings.id_lang];
				data.show_on_map 		= show_on_map_translation[settings.id_lang];
				data.my_visit_sync  	= my_visit_sync_translation[settings.id_lang];
				data.logout 			= logout_translation[settings.id_lang];
				data.clear_my_visit 	= clear_my_visit_translation[settings.id_lang];
				data.default_category 	= default_category_translation[settings.id_lang];
				data.dots 		 		= 1;
				voice_guide				= 0;
				menu_icon				= 1;
			} else if (div == "guide_buy") {
				data = {};
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
				data.login						    = login_translation[settings.id_lang];
				data.my_visit_tours					= my_visit_tours_translation[settings.id_lang];
				data.my_visit_poi					= my_visit_poi_translation[settings.id_lang];
				data.download 						= download_translation[settings.id_lang];
				data.logout 						= logout_translation[settings.id_lang];
				data.dots 							= 0;
				menu_icon							= 1;
			} else if (div == "ztl_map") {
				data.title 					= map_translation[settings.id_lang];
				data.voice_guide 		= voice_guide_translation[settings.id_lang];
				data.inspired			= inspired_translation[settings.id_lang];
				data.prikaz_title		= prikaz_title_translation[settings.id_lang];
				data.prikazi_button		= prikazi_button_translation[settings.id_lang];
				data.tour_list_group	= TOUR_LIST_GROUP;
				data.voice_group		= VOICE_GROUP;
				data.inspired_group		= INSPIRED_GROUP;
			} else if (div == "inspired") {
				data.page_title 	= main_menu['img1'];
			} else if (div == "ztl_guide_settings") {
				data = {};
				data.show_on_map 		= show_on_map_translation[settings.id_lang];
				data.add_to_myvisit		= add_to_myvisit_translation[settings.id_lang];
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
				html = html.replace('[[[event_filter]]]', Mustache.to_html(event_filter, data));
			}
			if (div == 'ztl_map') {
				html = html.replace('[[[map_settings]]]', Mustache.to_html(map_settings, data));
			}

			$('body').html(html);
			window.scrollTo(0,0);
			
			if (swipe == 1) {
//				if (div != "main_menu") {
				if ((div == "trip") || 
						(div == "event") || 
						(div == "info") || 
						(div == "tour")) {
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
			
			if (div == 'ztl_settings') {
				reminder_toggle();
			}

			
			console.log("menu icon " + menu_icon);

			$('.icon_'+menu_icon).attr("src","assets/css/ztl_images/icon_"+menu_icon+"_red.png");

			
			if ((div == "trip") || 
				(div == "event") || 
				(div == "info") || 
				(div == "tour")) {
				i_scroll(div+extra_div_id);
			}
			
			pOld = new Proj4js.Point(0,0);
			navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
			
			current_div = div+extra_div_id;

			//ko nalozim my_visit grem se cez case
			if (div == "my_visit_list") {
				render_time();
			}
			
			console.log("load page end");
			hide_spinner();
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
	}
}

function select_language_cont() {
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


function do_synhronization() {
	//if (navigator.network.connection.type == Connection.WIFI) {
		check_updates();
	/*} else {
	    alert(wifi_connection_translation[settings.id_lang]);
	}*/

}

function sort_by_distance(unsorted) {
	var len = unsorted.items.length;
	var cx = current_position_xy[0]-correctionX;
	var cy = current_position_xy[1]-correctionY;
	var keys = [];
	var datas = {};
	for (var i=0; i<len; i++){
		if (unsorted.items[i] == undefined) continue;
		var id = unsorted.items[i].id;
		var x = unsorted.items[i].coord_x;
		var y = unsorted.items[i].coord_y;
		var dist = lineDistanceAll(x, y, cx, cy);
		if ((x==0) || (x='')) dist = 99999-i;
		
		keys.push(dist);
		datas[dist] = id;
	}
	var aa = keys.sort(function(a,b){return a-b});
	
	var sorted = new Array();
	
	var cur = 0;
	$.each(aa, function(index, value){
		sorted[cur] = datas[value];
	    cur++;
	})
	 
	var data_sorted = {};
	data_sorted.items = [];
	for (var i=0; i<len; i++){
		if (unsorted.items[i] == undefined) continue;
		var id = unsorted.items[i].id;
		var indx = sorted.indexOf(id);
		data_sorted.items[indx] = unsorted.items[i];
	}
	
	return data_sorted;
}

var spinner; 
	
function show_spinner() {
	var opts = {
			  lines: 13, // The number of lines to draw
			  length: window.innerWidth/16, // The length of each line
			  width: window.innerWidth/48, // The line thickness
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
			  top: (window.innerHeight-window.innerWidth/4)/2, // Top position relative to parent in px
			  left: (window.innerWidth-window.innerWidth/4)/2 // Left position relative to parent in px
			};
	var target = document.getElementById("body");
	spinner = new Spinner(opts).spin(target);

}

function hide_spinner() {
	if (spinner != undefined) spinner.stop();
}

function format_date(date_string, id, hide_time) {
    console.log("render ---- date string "+date_string);
    console.log("render ---- id "+ id);
    console.log("render ---- hide_time "+ hide_time);

    var date_obj = new Date(date_string*1000);
    
    var selector = "date and time";
    if (hide_time == 1) {
    	selector = "date";
    }


    navigator.globalization.dateToString(
        date_obj,
    function (date) {
        console.log("render --- " + date.value);
        $("#"+id).html(date.value);
    },
    function () {alert('Error getting dateString\n');},
    {formatLength:'short', selector:selector}
    );
}