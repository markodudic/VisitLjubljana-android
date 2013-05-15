var template_root = 'templates/';
var template_lang = 'si/';

var active_menu	  = 0;

var settings	  = new Object();

var db_type	  	  = 1;
var settings_type = 1;
var swipe		  = 0;
var current		  = 0;
var local_db	  = 0;

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

			if (swipe == 1) {
				div = div+"_"+data['id'];
			}

			$('body').append(html).trigger('create');
			
			$.mobile.changePage( "#"+div, {
				transition: transition,
				reverse: reverse,
				changeHash: false
			});
			
			remove_old_divs(div);
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