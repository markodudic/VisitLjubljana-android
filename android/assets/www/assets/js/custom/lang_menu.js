var lang ='{"language_menu":[{"title":"Vsebine","img1":"Poiščite navdih","img2":"Prireditve","img3":"Znamenitosti","img4":"Kulinarika","img5":"Informacije","img6":"Ogledi in izleti","img7":"Nastanitve","img8":"Zabava","img9":"Nakupovanje"},{"title":"Content","img1":"Get inspiration","img2":"Events","img3":"Attractions","img4":"Food","img5":"Information","img6":"Tours and excursions","img7":"Accommodation","img8":"Entertainment","img9":"Shopping"},{"title":"Inhalt","img1":"Lassen Sie sich inspirieren","img2":"Geschehen","img3":"Sehenswürdigkeiten","img4":"Küche","img5":"Informationen","img6":"Touren und Ausflüge","img7":"Unterkunft","img8":"Unterhaltung","img9":"Einkaufen"},{"title":"Contenuto","img1":"Lasciatevi ispirare","img2":"Eventi","img3":"Attrazioni","img4":"Cucina","img5":"Informazioni","img6":"Gite ed escursioni","img7":"Sistemazione","img8":"Intrattenimento","img9":"Acquisti"},{"title":"Content","img1":"Laissez-vous inspirer","img2":"Evénements","img3":"Attractions","img4":"Cuisine","img5":"Informations","img6":"Tours et excursions","img7":"Hébergement","img8":"Divertissement","img9":"Magasinage"}]}';
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
voice_guide_translation[3]	= "Führung";
voice_guide_translation[4]	= "Guida";
voice_guide_translation[5]	= "Guidage";

var voice_guide_translation_full = [];
voice_guide_translation_full[1]	= "GLASOVNI VODIČ";
voice_guide_translation_full[2]	= "VOICE GUIDE";
voice_guide_translation_full[3]	= "SPRACHFUHRUNG";
voice_guide_translation_full[4]	= "GUIDA VOCALE";
voice_guide_translation_full[5]	= "GUIDAGE VOCAL";


var map_translation = [];
map_translation[1]	= "ZEMLJEVID";
map_translation[2]	= "MAP";
map_translation[3]	= "MAP";
map_translation[4]	= "MAPPA";
map_translation[5]	= "MAP";

var title_translation = [];
title_translation[1]	= "NASLOV";
title_translation[2]	= "ADDRESS";
title_translation[3]	= "ANSCHRIFT";
title_translation[4]	= "INDIRIZZO";
title_translation[5]	= "ADRESSE";

var description_translation = [];
description_translation[1]	= "OPIS";
description_translation[2]	= "DESCRIPTION";
description_translation[3]	= "BESCHREIBUNG";
description_translation[4]	= "DESCRIZIONE";
description_translation[5]	= "DESCRIPTION";

var venue_translation = [];
venue_translation[1]	= "LOKACIJA";
venue_translation[2]	= "VENUE";
venue_translation[3]	= "VENUE";
venue_translation[4]	= "VENUE";
venue_translation[5]	= "VENUE";


var price_translation = [];
price_translation[1]	= "CENA";
price_translation[2]	= "PRICE";
price_translation[3]	= "PREIS";
price_translation[4]	= "PREZZO";
price_translation[5]	= "PRIX";


var confirm_translation = [];
confirm_translation[1]	= "POTRDI";
confirm_translation[2]	= "CONFIRM";
confirm_translation[3]	= "CONFIRM";
confirm_translation[4]	= "CONFIRM";
confirm_translation[5]	= "CONFIRM";

var events_translation = [];
events_translation[1]	= "PRIKAŽI PRIREDITVE";
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
my_visit_account_translation[1]	= "My Visit račun";
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
synhronization_desc_translation[1]	= "Za prenos podatkov rabite brežično povezavo,.....";
synhronization_desc_translation[2]	= "You need wifi connection for synhronize the data,....";
synhronization_desc_translation[3]	= "Synchronization";
synhronization_desc_translation[4]	= "Synchronization";
synhronization_desc_translation[5]	= "Synchronization";

var synronization_finished_translation = [];
synronization_finished_translation[1]	= "Sinhronizacija končana";
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
wifi_connection_translation[1]	= "Potrebuješ WIFI povezavo";
wifi_connection_translation[2]	= "You need wifi connection";
wifi_connection_translation[3]	= "You need wifi connection";
wifi_connection_translation[4]	= "You need wifi connection";
wifi_connection_translation[5]	= "You need wifi connection";

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
