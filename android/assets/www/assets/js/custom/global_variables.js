var server_url = 'http://www.visitljubljana.com/';


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

//ztl grupe -- my_visit sinhronizacija
var ZTL_EVENT_GROUP = 1;
var ZTL_TOUR_GROUP 	= 10031;
var ZTL_POI_GROUP 	= 10027;

var UPDATE_GROUPS	= 5;

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
var file 		 = "/android_asset/www/uploads/mp3/";
var file_alt 	 = "Android/data/com.innovatif.ztl/audio/"; //lokacija na SD kartici
var file_uploads = "/uploads/images/"; //lokacija slik v instalaciji - tabela ztl_poi se updejta prvem zagonu

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
var max_dolzina_short_desc = 80;

//bbox ljubljane
var lon0 = 14.434;
var lat0 = 46;
var lon1 = 14.587;
var lat1 = 46.1;
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

//za deploy - ne izpisujejo se komentarji
/*
var console = {};
console.log = function(){};
*/