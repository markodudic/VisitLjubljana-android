var server_url = 'http://www.visitljubljana.com/';
var develop = 1;
var populateDB = 0;


//settings
var SETTINGS_FILE           = "settings.js"
var SETTINGS_FOLDER     	= "Android/data/com.innovatif.ztl/";
var ASSETS_FOLDER     		= "/android_asset/www/";

//grupe za cache
var EVENT_GROUP 			= 0;
var INFO_GROUP 				= 1;
var TOUR_GROUP				= 2;
var POI_GROUP				= 3;
var VOICE_GROUP				= 4;
var EVENTS_FILTERED_GROUP	= 5;
var TOUR_LIST_GROUP			= 6;
var INSPIRED_GROUP			= 7;
var POI_ZAMENITOSTI_GROUP	= 217;
var POI_KULINARIKA_GROUP	= 219;
var POI_NASTANITVE_GROUP	= 215;
var POI_NAKUPOVANJE_GROUP	= 220;
var POI_ZABAVA_GROUP		= 222;

var POI_ZAMENITOSTI_POI_GROUPS 	= [34268, 15780, 15860, 15863, 15874, 15774, 15781];
var POI_KULINARIKA_POI_GROUPS 	= [15906, 15907, 15818, 15919, 43996, 43995];
var POI_ZABAVA_POI_GROUPS 		= [15927, 39095, 15931, 16756, 15782, 44001];
var POI_NAKUPOVANJE_POI_GROUPS 	= [15921, 15969, 15848, 43997];


//ztl grupe -- my_visit sinhronizacija
var ZTL_EVENT_GROUP = 1;
var ZTL_TOUR_GROUP 	= 10031;
var ZTL_POI_GROUP 	= 10027;

var UPDATE_GROUPS	= 5;

var APP_NAME = "Visit Ljubljana and more";

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
var media_length = 0;
var file 		 = ASSETS_FOLDER+"uploads/mp3/";
var file_alt 	 = SETTINGS_FOLDER+"audio/"; //lokacija na SD kartici
var file_uploads = "./uploads/images/"; //lokacija slik v instalaciji - tabela ztl_poi se updejta prvem zagonu

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


//text dolzina max
var max_dolzina_naslov = 25;
var max_dolzina_poi_title = 30;
var max_dolzina_title = 45;
var max_dolzina_my_visit_tour_title = 25;
var max_dolzina_short_desc = 60;

//regija
//14.106,45.793 x 15.054,46.269
var lon0 = 14.106;
var lat0 = 45.793;
var lon1 = 15.054;
var lat1 = 46.269;
/* ljubljana
var lon0 = 14.434;
var lat0 = 46;
var lon1 = 14.587;
var lat1 = 46.1;*/
var x0 = 456516;
var y0 = 95835;
var x1 = 467838;
var y1 = 104993;

//centar ljubljane
var lat=46.052327;
var lon=14.506416;
var zoom=13;

//korekcije projekcij
var correctionX = 4999650;
var correctionY = 5000450;
var myLocationCorrectionX = -100;
var myLocationCorrectionY = -50;

//notification refresh time in seconds
var notification_refresh_time = 60;

//za deploy - ne izpisujejo se komentarji
/*
var console = {};
console.log = function(){};
*/

//iOS overrides
function reinit() {
	if (device.platform == "iOS") {
		SETTINGS_FOLDER     	= "com.innovatif.ztl/";
		ASSETS_FOLDER     		= "www/";
		
		file 		 			= ASSETS_FOLDER+"uploads/mp3/";
		file_alt 	 			= SETTINGS_FOLDER+"audio/"; //lokacija na SD kartici
	}
}