//gps
var watchID 	= null;
var source  	= null;
var dest    	= null;
var correctionX = 4999750;
var correctionY = 5000550;
var minDistance = 10;
var pOld 		= null;


//media player
var media		 = "";
var my_media 	 = null;
var media_timer  = null;
var file 		 = "/android_asset/www/uploads/mp3/";


//cssless css
var window_width = $(window).width();
/*
var img_width   = window_width*0.35;
var img_height  = ((window_width*14)/17)*0.35;
var ztl_content_width = window_width - img_width;
*/

//db
var db = null;

//settings
var settings			= new Object();
var template_root 		= 'templates/';
var template_lang 		= 'si/';

var tmp_history = ["fun--load_main_screen--empty"];

//za deploy - ne izpisujejo se komentarji
var console = {};
console.log = function(){};