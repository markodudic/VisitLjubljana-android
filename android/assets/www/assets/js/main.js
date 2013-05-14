var template_root = 'templates/';
var template_lang = 'si/';
var active_menu	  = 0;
var settings	  = null;
var db_type	  	  = 1;

var prev_loaded   = 0;
var curr_loaded   = 0;
var next_loaded   = 0;

$(document).ready(function() {
	document.addEventListener("deviceready", on_device_ready, true);
	
	$('body').on( 'swipeleft', swipe_left_handler );
	$('body').on( 'swiperight', swipe_right_handler );
});

function swipe_left_handler(event) {
	console.log(event);
}

function swipe_right_handler(event) {
	console.log(event);
}

function on_device_ready() {
	load_settings();
}

function load_page(template, div, data, transition, reverse, swipe) {
	console.log("swipe"+swipe);
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
			
			$('body').append(html).trigger('create');
			
			$.mobile.changePage( "#"+div, {
				transition: transition,
				reverse: reverse,
				changeHash: false
			});
			
			console.log(prev_loaded);
			console.log(curr_loaded);
			console.log(next_loaded);
		}
	});
}

function select_language(id) {
	settings.id_lang = id;

	console.log(JSON.stringify(settings));
	//za device bom pol, ko bom mel prikljuceno
	
	//nalozim glavni menu
	load_page(template_lang+'main_menu.html', 'main_menu', null, 'fade', false, 0);
} 

function load_trips() {
	$.getScript('./assets/js/trips.js', function () {
        load_trips();
    });
}