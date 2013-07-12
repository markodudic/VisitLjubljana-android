var lang ='{"language_menu":[{"title":"Vsebine","img1":"MyVisit - poiščite navdih","img2":"Prireditve","img3":"Znamenitosti","img4":"Kulinarika","img5":"Informacije","img6":"Ogledi in izleti","img7":"Nastanitve","img8":"Zabava","img9":"Nakupovanje"},{"title":"Content","img1":"MyVisit - get inspired","img2":"Events","img3":"Sights and attractions","img4":"Eating out","img5":"Visitor information","img6":"Tours and excursions","img7":"Accommodation","img8":"Entertainment","img9":"Shopping"},{"title":"Inhalt","img1":"MyVisit - lass dich inspirieren","img2":"Veranstaltungen","img3":"Sehenswürdigkeiten","img4":"Kulinarik","img5":"Informationen","img6":"Führungen und Ausflüge","img7":"Unterkünfte","img8":"Unterhaltung","img9":"Shopping"},{"title":"Contenuto","img1":"MyVisit - trova ispirazioni","img2":"Manifestazioni","img3":"Attrazioni","img4":"Gastronomia","img5":"Informazioni","img6":"Visite e gite","img7":"Allogio","img8":"Divertimento","img9":"Shopping"},{"title":"Content","img1":"MyVisit - laissez-vous insprirer","img2":"Evénements","img3":"Curiosités","img4":"Gastronomie","img5":"Info pour les visiteurs","img6":"Visites et excursions","img7":"Hébergement","img8":"Divertissement","img9":"Shopping"}]}';
lang = JSON.parse(lang);

//veza med sliko in grupo
var mm_pic_group = [];
//mm_pic_group[] 	= "img1";
mm_pic_group[0] 	= "img2";
mm_pic_group[1] 	= "img5";
mm_pic_group[2]		= "img6";
mm_pic_group[215] 	= "img7";
mm_pic_group[217] 	= "img3";
mm_pic_group[219] 	= "img4";
mm_pic_group[222] 	= "img8";
mm_pic_group[220] 	= "img9";

var voice_guide_translation = [];
voice_guide_translation[1]	= "Vodič";
voice_guide_translation[2]	= "Guide";
voice_guide_translation[3]	= "Führer";
voice_guide_translation[4]	= "Guida";
voice_guide_translation[5]	= "Guide";

var voice_guide_translation_full = [];
voice_guide_translation_full[1]         = "GLASOVNI VODIČ";
voice_guide_translation_full[2]         = "AUDIO GUIDE";
voice_guide_translation_full[3]         = "AUDIOFÜHRER";
voice_guide_translation_full[4]         = "AUDIOGUIDA";
voice_guide_translation_full[5]         = "L'AUDIOGUIDE";


var map_translation = [];
map_translation[1]     = "ZEMLJEVID";
map_translation[2]     = "MAP";
map_translation[3]     = "KARTE";
map_translation[4]     = "MAPPA";
map_translation[5]     = "CARTE";

var title_translation = [];
title_translation[1]      = "NASLOV";
title_translation[2]      = "ADDRESS";
title_translation[3]      = "ADRESSE";
title_translation[4]      = "INDIRIZZO";
title_translation[5]      = "ADRESSE";

var description_translation = [];
description_translation[1]      = "OPIS";
description_translation[2]      = "DESCRIPTION";
description_translation[3]      = "BESCHREIBUNG";
description_translation[4]      = "DESCRIZIONE";
description_translation[5]      = "DESCRIPTION";

var venue_translation = [];
venue_translation[1]   = "LOKACIJA";
venue_translation[2]   = "LOCATION";
venue_translation[3]   = "STANDORT";
venue_translation[4]   = "UBICAZIONE";
venue_translation[5]   = "EMPLACEMENT";

var price_translation = [];
price_translation[1]    = "CENA";
price_translation[2]    = "PRICE";
price_translation[3]    = "PREIS";
price_translation[4]    = "PREZZO";
price_translation[5]    = "PRIX";


var confirm_translation = [];
confirm_translation[1]	= "POTRDI";
confirm_translation[2]	= "CONFIRM";
confirm_translation[3]	= "CONFIRM";
confirm_translation[4]	= "CONFIRM";
confirm_translation[5]	= "CONFIRM";

var events_translation = [];
events_translation[1]	= "PRIKAĹ˝I PRIREDITVE";
events_translation[2]	= "SHOW EVENTS";
events_translation[3]	= "SHOW EVENTS";
events_translation[4]	= "SHOW EVENTS";
events_translation[5]	= "SHOW EVENTS";

var default_category_translation = [];
default_category_translation[1]	= "Izberi kategorijo";
default_category_translation[2]	= "Choose category";
default_category_translation[3]	= "Choose category";
default_category_translation[4]	= "Choose category";
default_category_translation[5]	= "Choose category";

var settings_translation = [];
settings_translation[1]	= "Nastavitve";
settings_translation[2]	= "Settings";
settings_translation[3]	= "Settings";
settings_translation[4]	= "Settings";
settings_translation[5]	= "Settings";


var my_visit_account_translation = [];
my_visit_account_translation[1]	= "My Visit raÄŤun";
my_visit_account_translation[2]	= "My Visit account";
my_visit_account_translation[3]	= "My Visit account";
my_visit_account_translation[4]	= "My Visit account";
my_visit_account_translation[5]	= "My Visit account";

var my_visit_page_title_translation = [];
my_visit_page_title_translation[1]	= "My Visit";
my_visit_page_title_translation[2]	= "My Visit";
my_visit_page_title_translation[3]	= "My Visit";
my_visit_page_title_translation[4]	= "My Visit";
my_visit_page_title_translation[5]	= "My Visit";


var reminder_translation = [];
reminder_translation[1]	= "Opomnik";
reminder_translation[2]	= "Reminder";
reminder_translation[3]	= "Reminder";
reminder_translation[4]	= "Reminder";
reminder_translation[5]	= "Reminder";


var set_language_translation = [];
set_language_translation[1]	= "Nastavi jezik";
set_language_translation[2]	= "Set language";
set_language_translation[3]	= "Set language";
set_language_translation[4]	= "Set language";
set_language_translation[5]	= "Set language";

var rate_translation = [];
rate_translation[1]	= "Oceni aplikacijo";
rate_translation[2]	= "Rate appliaction";
rate_translation[3]	= "Rate appliaction";
rate_translation[4]	= "Rate appliaction";
rate_translation[5]	= "Rate appliaction";

var synchronization_translation = [];
synchronization_translation[1]	= "Sinhronizacija";
synchronization_translation[2]	= "Synchronization";
synchronization_translation[3]	= "Synchronization";
synchronization_translation[4]	= "Synchronization";
synchronization_translation[5]	= "Synchronization";

var synhronization_title_translation = [];
synhronization_title_translation[1]	= "PRENOS PODATKOV";
synhronization_title_translation[2]	= "SYNHRONIZATION";
synhronization_title_translation[3]	= "SYNHRONIZATION";
synhronization_title_translation[4]	= "SYNHRONIZATION";
synhronization_title_translation[5]	= "SYNHRONIZATION";


var synhronization_desc_translation = [];
synhronization_desc_translation[1]	= "Za prenos podatkov rabite breĹľiÄŤno povezavo,.....";
synhronization_desc_translation[2]	= "You need wifi connection for synhronize the data,....";
synhronization_desc_translation[3]	= "Synchronization";
synhronization_desc_translation[4]	= "Synchronization";
synhronization_desc_translation[5]	= "Synchronization";

var synronization_finished_translation = [];
synronization_finished_translation[1]	= "Sinhronizacija konÄŤana";
synronization_finished_translation[2]	= "Synhronization finished";
synronization_finished_translation[3]	= "Synhronization finished";
synronization_finished_translation[4]	= "Synhronization finished";
synronization_finished_translation[5]	= "Synhronization finished";


var synhronization_button_translation = [];
synhronization_button_translation[1]	= "PRENESI PODATKE";
synhronization_button_translation[2]	= "SYNHRONIZATION";
synhronization_button_translation[3]	= "SYNHRONIZATION";
synhronization_button_translation[4]	= "SYNHRONIZATION";
synhronization_button_translation[5]	= "SYNHRONIZATION";

var about_translation = [];
about_translation[1]	= "O aplikaciji";
about_translation[2]	= "About the application";
about_translation[3]	= "About appliaction";
about_translation[4]	= "About appliaction";
about_translation[5]	= "About appliaction";


var about_version_translation = [];
about_version_translation[1]	= "VERZIJA";
about_version_translation[2]	= "VERSION";
about_version_translation[3]	= "VERSION";
about_version_translation[4]	= "VERSION";
about_version_translation[5]	= "VERSION";

var about_contact_translation = [];
about_contact_translation[1]	= "KONTAKT";
about_contact_translation[2]	= "CONTACT";
about_contact_translation[3]	= "CONTACT";
about_contact_translation[4]	= "CONTACT";
about_contact_translation[5]	= "CONTACT";

var about_desc_translation = [];
about_desc_translation[1]	= "The development of this application has been co-financed by EU, ...";
about_desc_translation[2]	= "The development of this application has been co-financed by EU, ...";
about_desc_translation[3]	= "The development of this application has been co-financed by EU, ...";
about_desc_translation[4]	= "The development of this application has been co-financed by EU, ...";
about_desc_translation[5]	= "The development of this application has been co-financed by EU, ...";

var wifi_connection_translation = [];
wifi_connection_translation[1]	= "PotrebujeĹˇ WIFI povezavo";
wifi_connection_translation[2]	= "You need wifi connection";
wifi_connection_translation[3]	= "You need wifi connection";
wifi_connection_translation[4]	= "You need wifi connection";
wifi_connection_translation[5]	= "You need wifi connection";


var guide_buy_desc_translation = [];
guide_buy_desc_translation[1]	= "PREDSTAVITEV";
guide_buy_desc_translation[2]	= "DESCRIPTION";
guide_buy_desc_translation[3]	= "DESCRIPTION";
guide_buy_desc_translation[4]	= "DESCRIPTION";
guide_buy_desc_translation[5]	= "DESCRIPTION";


var guide_buy_locations_translation = [];
guide_buy_locations_translation[1]	= "SEZNAM LOKACIJ";
guide_buy_locations_translation[2]	= "LOCATIONS";
guide_buy_locations_translation[3]	= "LOCATIONS";
guide_buy_locations_translation[4]	= "LOCATIONS";
guide_buy_locations_translation[5]	= "LOCATIONS";


var guide_buy_button_translation = [];
guide_buy_button_translation[1]	= "PRENESI VODIÄŚ";
guide_buy_button_translation[2]	= "DOWNLOAD";
guide_buy_button_translation[3]	= "DOWNLOAD";
guide_buy_button_translation[4]	= "DOWNLOAD";
guide_buy_button_translation[5]	= "DOWNLOAD";


var guide_buy_desc_text_translation = [];
guide_buy_desc_text_translation[1]	= "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
guide_buy_desc_text_translation[2]	= "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
guide_buy_desc_text_translation[3]	= "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
guide_buy_desc_text_translation[4]	= "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";
guide_buy_desc_text_translation[5]	= "Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum ";


//prevodi mesecov za top evente
var month_translation = [];

//slovenscina
month_translation[1] = [];
month_translation[1][0]  = "JAN";
month_translation[1][1]  = "FEB";
month_translation[1][2]  = "MAR";
month_translation[1][3]  = "APR";
month_translation[1][4]  = "MAJ";
month_translation[1][5]  = "JUN";
month_translation[1][6]  = "JUL";
month_translation[1][7]  = "AVG";
month_translation[1][8]  = "SEP";
month_translation[1][9]  = "OKT";
month_translation[1][10] = "NOV";
month_translation[1][11] = "DEC";

//anglescina
month_translation[2] = [];
month_translation[2][0]  = "JAN";
month_translation[2][1]  = "FEB";
month_translation[2][2]  = "MAR";
month_translation[2][3]  = "APR";
month_translation[2][4]  = "MAJ";
month_translation[2][5]  = "JUN";
month_translation[2][6]  = "JUL";
month_translation[2][7]  = "AVG";
month_translation[2][8]  = "SEP";
month_translation[2][9]  = "OKT";
month_translation[2][10] = "NOV";
month_translation[2][11] = "DEC";

//nemscina
month_translation[3] = [];
month_translation[3][0]  = "JAN";
month_translation[3][1]  = "FEB";
month_translation[3][2]  = "MAR";
month_translation[3][3]  = "APR";
month_translation[3][4]  = "MAJ";
month_translation[3][5]  = "JUN";
month_translation[3][6]  = "JUL";
month_translation[3][7]  = "AVG";
month_translation[3][8]  = "SEP";
month_translation[3][9]  = "OKT";
month_translation[3][10] = "NOV";
month_translation[3][11] = "DEC";

//italjanscina
month_translation[4] = [];
month_translation[4][0]  = "JAN";
month_translation[4][1]  = "FEB";
month_translation[4][2]  = "MAR";
month_translation[4][3]  = "APR";
month_translation[4][4]  = "MAJ";
month_translation[4][5]  = "JUN";
month_translation[4][6]  = "JUL";
month_translation[4][7]  = "AVG";
month_translation[4][8]  = "SEP";
month_translation[4][9]  = "OKT";
month_translation[4][10] = "NOV";
month_translation[4][11] = "DEC";

//francoscina
month_translation[5] = [];
month_translation[5][0]  = "JAN";
month_translation[5][1]  = "FEB";
month_translation[5][2]  = "MAR";
month_translation[5][3]  = "APR";
month_translation[5][4]  = "MAJ";
month_translation[5][5]  = "JUN";
month_translation[5][6]  = "JUL";
month_translation[5][7]  = "AVG";
month_translation[5][8]  = "SEP";
month_translation[5][9]  = "OKT";
month_translation[5][10] = "NOV";
month_translation[5][11] = "DEC";

//mywisit
var my_visit_download_translation = [];
my_visit_download_translation[1] = "Prenesi MyVisit s spletnega mesta";
my_visit_download_translation[2] = "Prenesi MyVisit s spletnega mesta";
my_visit_download_translation[3] = "Prenesi MyVisit s spletnega mesta";
my_visit_download_translation[4] = "Prenesi MyVisit s spletnega mesta";
my_visit_download_translation[5] = "Prenesi MyVisit s spletnega mesta";

var user_name_translation = [];
//user_name_translation[1] = "UporabniĹˇko ime";
user_name_translation[1] = "markodudic@gmail.com";
user_name_translation[2] = "UporabniĹˇko ime";
user_name_translation[3] = "UporabniĹˇko ime";
user_name_translation[4] = "UporabniĹˇko ime";
user_name_translation[5] = "UporabniĹˇko ime";

var password_translation = [];
//password_translation[1] = "Geslo";
password_translation[1] = "okram";
password_translation[2] = "Geslo";
password_translation[3] = "Geslo";
password_translation[4] = "Geslo";
password_translation[5] = "Geslo";

var forgotten_pass_translation = [];
forgotten_pass_translation[1] = "Pozabljeno geslo";
forgotten_pass_translation[2] = "Pozabljeno geslo";
forgotten_pass_translation[3] = "Pozabljeno geslo";
forgotten_pass_translation[4] = "Pozabljeno geslo";
forgotten_pass_translation[5] = "Pozabljeno geslo";

var register_translation = [];
register_translation[1] = "Registriraj se";
register_translation[2] = "Registriraj se";
register_translation[3] = "Registriraj se";
register_translation[4] = "Registriraj se";
register_translation[5] = "Registriraj se";

var login_translation = [];
login_translation[1] = "Prijava";
login_translation[2] = "Prijava";
login_translation[3] = "Prijava";
login_translation[4] = "Prijava";
login_translation[5] = "Prijava";

var my_visit_tours_translation = [];
my_visit_tours_translation[1] = "Pripravljeni predlogi izletov";
my_visit_tours_translation[2] = "Pripravljeni predlogi izletov";
my_visit_tours_translation[3] = "Pripravljeni predlogi izletov";
my_visit_tours_translation[4] = "Pripravljeni predlogi izletov";
my_visit_tours_translation[5] = "Pripravljeni predlogi izletov";

var my_visit_poi_translation = [];
my_visit_poi_translation[1] = "Preglej in dodaj oglede, nastanitve, prireditve, zanimivosti ...";
my_visit_poi_translation[2] = "Preglej in dodaj oglede, nastanitve, prireditve, zanimivosti ...";
my_visit_poi_translation[3] = "Preglej in dodaj oglede, nastanitve, prireditve, zanimivosti ...";
my_visit_poi_translation[4] = "Preglej in dodaj oglede, nastanitve, prireditve, zanimivosti ...";
my_visit_poi_translation[5] = "Preglej in dodaj oglede, nastanitve, prireditve, zanimivosti ...";

var download_translation = [];
download_translation[1] = "Prenesi";
download_translation[2] = "Prenesi";
download_translation[3] = "Prenesi";
download_translation[4] = "Prenesi";
download_translation[5] = "Prenesi";

var select_view_translation = [];
select_view_translation[1] = "Izberi pogled";
select_view_translation[2] = "Izberi pogled";
select_view_translation[3] = "Izberi pogled";
select_view_translation[4] = "Izberi pogled";
select_view_translation[5] = "Izberi pogled";

var show_on_map_translation = [];
show_on_map_translation[1] = "PrikaĹľi vse na zemljevidu";
show_on_map_translation[2] = "PrikaĹľi vse na zemljevidu";
show_on_map_translation[3] = "PrikaĹľi vse na zemljevidu";
show_on_map_translation[4] = "PrikaĹľi vse na zemljevidu";
show_on_map_translation[5] = "PrikaĹľi vse na zemljevidu";

var logout_translation = [];
logout_translation[1] = "Odjava";
logout_translation[2] = "Odjava";
logout_translation[3] = "Odjava";
logout_translation[4] = "Odjava";
logout_translation[5] = "Odjava";

var my_visit_sync_translation = [];
my_visit_sync_translation[1] = "Sinhroniziraj";
my_visit_sync_translation[2] = "Sinhroniziraj";
my_visit_sync_translation[3] = "Sinhroniziraj";
my_visit_sync_translation[4] = "Sinhroniziraj";
my_visit_sync_translation[5] = "Sinhroniziraj";

var clear_my_visit_translation = [];
clear_my_visit_translation[1] = "Izprazni celotni MyVisit";
clear_my_visit_translation[2] = "Izprazni celotni MyVisit";
clear_my_visit_translation[3] = "Izprazni celotni MyVisit";
clear_my_visit_translation[4] = "Izprazni celotni MyVisit";
clear_my_visit_translation[5] = "Izprazni celotni MyVisit";