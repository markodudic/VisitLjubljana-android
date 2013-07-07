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
var trips   	  = {}; //0-event, 1-info, 2-tour, 4 - voice, 5 - filtered events
var trips_title   = {}; //0-event, 1-info, 2-tour
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

	var hash = window.location.hash;
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
	} else if (hash == "lang_settings") {
		swipe 			 = 0;
		settings		 = new Object();
		skip_update 	 = 1;
		menu_select_lang = 1;
	} else if (hash == "content") { 
		skip_update = 1;
	} else if (hash_split[0] == "load_content") {
		$.getScript('./assets/js/custom/trips.js', function () {
			skip_update = 1;
			console.log("LOAD*****"+hash_split[1]);
			get_cache();
			if (hash_split[2]==0) {
				load_event(hash_split[1], 0);
			} else if (hash_split[2]==1) {
				load_trip_content(hash_split[1], 'fade', true, 0);
			}
	    });	
	} else {
		navigator.splashscreen.show();
		skip_update = 0;
	}

	//za sprazniti cache
	//localStorage.clear();
	get_cache();

	document.addEventListener("backbutton", go_back, true);

	if (localStorage.getItem(localStorage.key('first_run')) == null) {
		//localStorage.clear();
		localStorage.setItem('history', JSON.stringify(tmp_history));
		localStorage.setItem('first_run', 0);
	}
}

function reset_cache() {
	
	load_main_menu(); 
	
	load_pois(215, 7, 0);
    load_pois(217, 3, 0);
    load_pois(219, 4, 0);
    load_pois(220, 9, 0);
    load_pois(222, 8, 0);
    load_events(0);
    load_info(0);
    load_tours(0);
    load_voice_guide(0);
    
    localStorage.setItem('trips', JSON.stringify(trips));
    localStorage.setItem('trips_title', JSON.stringify(trips_title));
    
}

function get_cache() { 
	console.log("GET CACHE="+localStorage.getItem('trips'));
	if (localStorage.getItem('trips') == null) {
		reset_cache();
	} else {
		if (localStorage.getItem('trips') != null) {
			trips = JSON.parse(localStorage.getItem('trips'));
		}
		if (localStorage.getItem('trips_title') != null) {
			trips_title = JSON.parse(localStorage.getItem('trips_title'));
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
				var res = trips[selected_group];
				
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
					load_page(template_lang+'trip.html', 'div_trip', res.items[j], 'slide', true, selected_group);
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
			var res = trips[selected_group];
			
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
				load_page(template_lang+'trip.html', 'div_trip', res.items[j], 'slide', false, selected_group);
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
	console.log("load page="+id_group+":"+template);
	console.log("load page="+JSON.stringify(data));

	if (footer == "") {
		load_footer();
	}

	if (media == "") {
		load_media();
	}
	
	if (id_group != undefined) {
		selected_group = id_group;
	}
		

	$.ajax({
		type:"GET",
		url:template_root+template,
		cache:false,
		async:false,
		dataType: 'html',
		success:function(temp){
			var menu_icon 	 = 3;
			var extra_div_id = "";

			if (settings.id_lang!=undefined) {
				data.guide_button			= voice_guide_translation_full[settings.id_lang];
				data.map_button 				= map_translation[settings.id_lang];
				data.ztl_item_details_title 	= title_translation[settings.id_lang];
				data.ztl_item_details_description = description_translation[settings.id_lang];
				data.ztl_item_details_venue 	= venue_translation[settings.id_lang];
				data.ztl_item_details_price 	= price_translation[settings.id_lang];
				data.potrdi_button 				= confirm_translation[settings.id_lang];
				data.events_title 				= events_translation[settings.id_lang];
				data.default_category 			= default_category_translation[settings.id_lang];
			}
		
			
			if (div == 'trips') {
				extra_div_id 		= "_"+group;
				data.extra_div_id 	= group;
				data.page_title 	= trips_title[id_group];
			}

			if (div == 'events') {
				data.page_title 	= trips_title[id_group];
				$('body').html("");
			}

			if (div == 'filtered_events') {
				data.page_title 	= trips_title[id_group];
				$('body').html("");
			}
			 
			if (div == 'event') {
				data.categories = event_type;
				extra_div_id = "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			}

			if (div == 'tour') {
				extra_div_id 		= "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			}
			
			if (div == 'tours') {
				data.page_title 	= trips_title[id_group];
			}

			if (div == 'infos') {
				data.page_title 	= trips_title[id_group];
			}

			if (div == 'info') {
				extra_div_id 		= "_"+data.item.id;
				if (data.item.title.length>max_dolzina_naslov) {
					data.item.title=data.item.title.substring(0,max_dolzina_naslov)+"...";
				}
			}

			if (voice_guide == 1)  {
				extra_div_id 		= "_voice_guide";
				data.extra_div_id 	= "voice_guide";
				data.page_title 	= voice_guide_translation[settings.id_lang];
				
				menu_icon 	= 2;
				voice_guide = 0;
			}

			if (div == 'div_trip') {
				data.tmi = tmi;
				if (data.title.length>max_dolzina_naslov) {
					data.title=data.title.substring(0,max_dolzina_naslov)+"...";
				}
				if (data.star != 0) {
					data.shadow="true";
				}
			}

			if (div == 'main_menu') {
				view_main_menu = 1;
			}

			var res = $(temp).filter('#tpl_'+div).html();
			
			if (data != null) {
				var html = Mustache.to_html(res, data);
			} else {
				var html = res;
			}

			html = html.replace('[[[ztl_footer]]]', footer);



			/*
			if (div == "main_menu") {
				if (current_div != "main_menu") {
					$('body').append(html);
				}
			} else {
				$('body').append(html);
			}
			*/

			

			if (swipe == 1) {
				$('body').append(html);

				if (div != "main_menu") {
					var ts_div = "";
					if (div == 'div_trip') {
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
			} else {
				$('body').html(html);
			}

			$('.icon_'+menu_icon).attr("src","assets/css/ztl_images/icon_"+menu_icon+"_red.png");

			//ce so karte inicializiram skripto
			if (div == "show_map") {
				show_map();
			}
			
			if ((div != "trips") && (div != "select_language")) {
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

    
    if (duration > 120 && distance > 120) {
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

	if (localStorage.getItem(localStorage.key('first_run')) == null) {
		check_updates();
		reset_cache();
	}

	if (settings_type == 1) {
		//nalozim glavni menu
		swipe = 0;
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false, 0);
	} else {
		save_mobile_settings();
	}
} 

function load_trips() {
	$.getScript('./assets/js/custom/trips.js', function () {
        load_trips();
    });
}

function edit_settings() {
	$.getScript('./assets/js/custom/application_settings.js', function () {
        load_current_settings();
    });
}

function load_media() {
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

/*
function play_location_sound() {
	swipe = 0;
	
	if (my_media != null) {
		my_media.stop();
		my_media.release();
		
		my_media 	= null;
		media_timer = null;
		
	} else {
		$.getScript('./assets/js/custom/play_media_file.js', function () {
			
			load_media_file(file);
		});
	}
}
*/

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