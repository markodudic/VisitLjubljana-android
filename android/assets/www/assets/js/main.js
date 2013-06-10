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
var media		  = "";
var my_media 	  = null;
var media_timer   = null;

var db 			  = null;
var group 		  = 0;

var trips   	  = null;
var trips_title   = "";
var main_menu     = null;

var window_width = $(window).width();

var img_width   = window_width*0.35;
var img_height  = ((window_width*14)/17)*0.35;
var ztl_content_width = window_width - img_width;

var file = "/android_asset/www/uploads/mp3/mp3_test.mp3";
//var file = "uploads/mp3/mp3_test.mp3";



document.addEventListener("deviceready", on_device_ready, false);
//navigator.splashscreen.show();


function on_device_ready() {
	console.log("device ready");
	db = window.sqlitePlugin.openDatabase("Database", "1.0", "ztl", -1);

	$(function() {      
		//Enable swiping...
		$("body").swipe( {
		//Generic swipe handler for all directions
		swipe:function(event, direction, distance, duration, fingerCount) {
			console.log("You swiped " + direction );  

			if (direction == "left") {
				swipe_left_handler();
			} else if (direction == "right") {
				swipe_right_handler();
		  }
		},
		//Default is 75px, set to 0 for demo so any distance triggers swipe
			threshold:150,
			allowPageScroll:"vertical"
		});
	});

	$("body").swipe("disable");
	//$('body').on( 'swipeleft', swipe_left_handler );
	//$('body').on( 'swiperight', swipe_right_handler );

	/*
	if (window.location.hash == "#poi_list") {
		load_trips();
	} else {
		load_settings();	
	}

	var hash_string = window.location.hash;
	hash_string = hash_string.split("_");
	console.log("hash string:"+hash_string);
	
	/*
	if (hash_string[1] > 0) {
		console.log("nalozi vsebino");
		$.getScript('./assets/js/trips.js', function () {
			console.log("nalozi vsebino content");
	        load_trip_content(hash_string[1] , 'fade', false);
	    });
	}
	*/

	load_settings();
	init_gps();
	//navigator.splaschscreen.hide();
}


var watchID = null;
var source  = null;
var dest    = null;
var correctionX = 4999750;
var correctionY = 5000550;
var minDistance = 10;
var pOld = new Proj4js.Point(0,0);

function init_gps() {
	console.log("init gps");
	
    //WGS84
	Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    //GK
    Proj4js.defs["EPSG:31469"] = "+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs";
    source = new Proj4js.Proj('EPSG:4326');	//WGS84
    dest = new Proj4js.Proj('EPSG:31469');	//GK

    //timeout pomeni kolk casa caka na novo pozicijo, enableHighAccuracy ali naj uporabi gps ali samo wifi
    var options = { timeout: 10000, enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
    //watchID = navigator.geolocation.watchPosition(onSuccess_gps, onError_gps, options);
}

function onError_gps(error) {
	console.log("error");
}

function onSuccess_gps(position) {
	console.log("work gps");

    var p = new Proj4js.Point(position.coords.longitude, position.coords.latitude); 
    Proj4js.transform(source, dest, p);  
    
	//gremo crez vse elemente na pregledu, ki imajo kooridinate
	$('input[name^="ztl_cord_"]').each(function( index ) {
		var geo_stuff = $(this).val().split("#");
	    //if ((Math.abs(p.x - pOld.x) > minDistance) || (Math.abs(p.y - pOld.y) > minDistance)) {
		       pOld = p;
		       var px=p.x-correctionX;
		       var py=p.y-correctionY;
		       if (geo_stuff[1] != "0" || geo_stuff[2] != "0") {
		    	   $("div#ztl_distance_value_"+geo_stuff[0]).html(lineDistance(px, py, geo_stuff[1], geo_stuff[2])+" km");
		       }
	    //}
	});
}

function lineDistance( p1x, p1y, p2x, p2y ) {
       var xs = p2x - p1x;
       xs = xs * xs;
       var ys = p2y - p1y;
       ys = ys * ys;
       //return Math.round( (Math.floor(Math.sqrt( xs + ys )/1000)) * 10 ) / 10;
       var num = Math.sqrt( xs + ys )/1000;
       //num = Math.round(num*Math.pow(10,1))/Math.pow(10,1);
       if (num > 1)
               return num.toFixed(1);
       else
               return num.toFixed(3);
}

function load_main_screen() {
	console.log("load_main_screen");
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
				console.log(group);
				
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

					console.log("slide left/right");
				}
				$("body").swipe("enable");
			} else {

				$("body").swipe("disable");
			}


			//$('body').append(html);
			//$('body').append(html).trigger('create');

			//console.log(html);
			

			//$("#media_payer").html(media);

			//ce so karte inicializiram skripto
			console.log("div: "+div);
			if (div == "show_map") {
				show_map();
			}

			/*
			console.log("redirect here #"+div+extra_div_id);

			$.mobile.changePage("#"+div+extra_div_id, {
				transition: transition,
				reverse: reverse,
				changeHash: false,
			});

			
			*/
			
			/*borut temp iscrol je treba dodat verzijo za jq in ne jqm
			if (div == "trips") {
				i_scroll("trips");
			} else if (div == "trip") {
				i_scroll("trip");
			} else if (div == "main_menu") {
				i_scroll("main_menu");
			}
			*/

			//borut temp zakomentiram racunanje razdalje
			//navigator.geolocation.getCurrentPosition(onSuccess_gps, onError_gps);
			
			animate_div(div+extra_div_id, transition, reverse);
		}
	});
}

function animate_div(div, transition, reverse) {
	
	console.log("remove_old_divs");
	console.log("nalozen div: *********************");
	console.log("nalozen div: izbran div      :"+div);
	
	//$("#"+div).slideDown();
	

	

	remove_old_divs(div);
}

function remove_old_divs(div) {
	var loaded_divs = $('body').find('.ztl_remove_from_page');
	loaded_divs.each(function() {
		console.log("nalozen div: "+this.id);
		console.log(this);
		if (this.id != div) {
			console.log("nalozen div: ------------- odstrani ----------------- "+this.id);
			$(this).remove(); 
		}
	});

	console.log("nalozen div: *********************");
}

function i_scroll(div_id) {
	// create our own namespace
	var RocknCoder = RocknCoder || {};
	RocknCoder.Pages = RocknCoder.Pages || {};

	RocknCoder.Pages.Kernel = function (event) {
	  var that = this,
	    eventType = event.type,
	    pageName = $(this).attr("data-rockncoder-jspage");
	  if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
	    RocknCoder.Pages[pageName][eventType].call(that);
	  }
	};

	RocknCoder.Pages.Events = (function () {
	  $("div[data-rockncoder-jspage]").on(
	    'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
	    RocknCoder.Pages.Kernel
	  );
	}());

	RocknCoder.Dimensions = (function () {
	  var width, height, headerHeight, footerHeight, contentHeight,
		isIPhone = (/iphone/gi).test(navigator.appVersion),
		iPhoneHeight = (isIPhone ? 60 : 0);
	  return {
		init:function () {
		  width = $(window).width();
		  height = $(window).height();
		  headerHeight = $("header", $.mobile.activePage).height();
		  footerHeight = $("footer", $.mobile.activePage).height();
		  contentHeight = height - headerHeight - footerHeight + iPhoneHeight;
		},
		getContent:function () {
		  return {
			width:width,
			height:contentHeight
		  };
		}
	  };
	}());				


	if (div_id == "trips") {
		RocknCoder.Pages.trips = (function () {
		  var myScroll;
		  return {
		    pageshow:function () {
		      RocknCoder.Dimensions.init();
		      // determine the height dynamically
		      var dim = RocknCoder.Dimensions.getContent();
		      $("#verticalWrapper").css('height', dim.height);
		      myScroll = new iScroll('verticalWrapper', { hScrollbar: false, vScrollbar: false} );
		      console.log("iscroll> ****");
		    },
		    pagehide:function () {
		      myScroll.destroy();
		      myScroll = null;
		    }
		  };
		}());
	} else if (div_id == "trip") {
		RocknCoder.Pages.trip = (function () {
		  var myScroll;
		  return {
		    pageshow:function () {
		      RocknCoder.Dimensions.init();
		      // determine the height dynamically
		      var dim = RocknCoder.Dimensions.getContent();
		      $("#verticalWrapper").css('height', dim.height);
		      myScroll = new iScroll('verticalWrapper', { hScrollbar: false, vScrollbar: false} );
		      console.log("iscroll> ****");
		    },
		    pagehide:function () {
		      myScroll.destroy();
		      myScroll = null;
		    }
		  };
		}());
	} else if (div_id == "main_menu") {
		RocknCoder.Pages.main_menu = (function () {
		  var myScroll;
		  return {
		    pageshow:function () {
		      RocknCoder.Dimensions.init();
		      // determine the height dynamically
		      var dim = RocknCoder.Dimensions.getContent();
		      $("#verticalWrapper").css('height', dim.height);
		      myScroll = new iScroll('verticalWrapper', { hScrollbar: false, vScrollbar: false} );
		      console.log("iscroll> ****");
		    },
		    pagehide:function () {
		      myScroll.destroy();
		      myScroll = null;
		    }
		  };
		}());
	}
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

function select_language(id) {
	settings.id_lang = id;

	console.log(JSON.stringify(settings));
	console.log(db_type);

	if (settings_type == 1) {
		//nalozim glavni menu
		load_page(template_lang+'main_menu.html', 'main_menu', main_menu, 'fade', false);
	} else {
		console.log('shrani mobilno');
		save_mobile_settings();
	}
} 

function load_trips() {
	console.log("load_trips");
	$.getScript('./assets/js/trips.js', function () {
        load_trips();
    });
}

function load_trips_benchmark() {
	console.log("load_trips_benchmark");
	$.getScript('./assets/js/trips.js', function () {
        load_trips_benchmark();
    });
}

function edit_settings() {
	console.log("edit_settings");
	$.getScript('./assets/js/application_settings.js', function () {
        load_current_settings();
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
		$.getScript('./assets/js/play_media_file.js', function () {
			
			load_media_file(file);
		});
	}
}