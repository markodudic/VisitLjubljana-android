var lang ='{"language_menu":[{"title":"Vsebine","img1":"Poiščite navdih","img2":"Prireditve","img3":"Znamenitosti","img4":"Kulinarika","img5":"Informacije","img6":"Ogledi in izleti","img7":"Nastanitve","img8":"Zabava","img9":"Nakupovanje","img10":"Kraji"},{"title":"Content","img1":"Get inspired","img2":"Events","img3":"Sights and attractions","img4":"Eating out","img5":"Visitor information","img6":"Tours and excursions","img7":"Accommodation","img8":"Entertainment","img9":"Shopping","img10":"POIGROUP"},{"title":"Inhalt","img1":"Lass dich inspirieren","img2":"Veranstaltungen","img3":"Sehenswürdigkeiten","img4":"Kulinarik","img5":"Informationen","img6":"Führungen und Ausflüge","img7":"Unterkünfte","img8":"Unterhaltung","img9":"Shopping","img10":"POIGROUP"},{"title":"Contenuto","img1":"Trova ispirazioni","img2":"Manifestazioni","img3":"Attrazioni","img4":"Gastronomia","img5":"Informazioni","img6":"Visite e gite","img7":"Allogio","img8":"Divertimento","img9":"Shopping","img10":"POIGROUP"},{"title":"Content","img1":"Laissez-vous insprirer","img2":"Evénements","img3":"Curiosités","img4":"Gastronomie","img5":"Info pour les visiteurs","img6":"Visites et excursions","img7":"Hébergement","img8":"Divertissement","img9":"Shopping","img10":"POIGROUP"}]}';
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
confirm_translation[2]	= "GO";
confirm_translation[3]	= "EINGEBEN";
confirm_translation[4]	= "INVIARE";
confirm_translation[5]	= "ENVOYER";


var events_translation = [];
events_translation[1]	= "PRIKAŽI PRIREDITVE";
events_translation[2]	= "FILTER EVENTS";
events_translation[3]	= "VERANSTALTUNGEN FILTERN";
events_translation[4]	= "FILTRARE LE MANIFESTAZIONI";
events_translation[5]	= "FILTRER LES ÉVÉNEMENTS";

var default_category_translation = [];
default_category_translation[1]	= "Izberi kategorijo";
default_category_translation[2]	= "Choose category";
default_category_translation[3]	= "Choose category";
default_category_translation[4]	= "Choose category";
default_category_translation[5]	= "Choose category";

var settings_translation = [];
settings_translation[1]	= "Nastavitve";
settings_translation[2]	= "Settings";
settings_translation[3]	= "Einstellungen";
settings_translation[4]	= "Impostazioni";
settings_translation[5]	= "Réglages";


var my_visit_account_translation = [];
my_visit_account_translation[1]	= "My Visit račun";
my_visit_account_translation[2]	= "My Visit account";
my_visit_account_translation[3]	= "My Visit Account";
my_visit_account_translation[4]	= "My Visit acconto";
my_visit_account_translation[5]	= "Compte MyVisit";

var my_visit_page_title_translation = [];
my_visit_page_title_translation[1]	= "My Visit";
my_visit_page_title_translation[2]	= "My Visit";
my_visit_page_title_translation[3]	= "My Visit";
my_visit_page_title_translation[4]	= "My Visit";
my_visit_page_title_translation[5]	= "My Visit";


var reminder_translation = [];
reminder_translation[1]	= "Opomnik";
reminder_translation[2]	= "Reminder";
reminder_translation[3]	= "Mahnung";
reminder_translation[4]	= "Opomnik prevod";
reminder_translation[5]	= "Opomnik prevod";


var set_language_translation = [];
set_language_translation[1]	= "Nastavi jezik";
set_language_translation[2]	= "Language settings";
set_language_translation[3]	= "Sprache Einstellen";
set_language_translation[4]	= "Impostare la lingua";
set_language_translation[5]	= "Définir la langue";

var rate_translation = [];
rate_translation[1]	= "Oceni aplikacijo";
rate_translation[2]	= "Rate the appliaction";
rate_translation[3]	= "Mobile-App einschätzen";
rate_translation[4]	= "Valutare l'applicazione";
rate_translation[5]	= "Évaluer l'application";

var about_translation = [];
about_translation[1]	= "O aplikaciji";
about_translation[2]	= "About the application";
about_translation[3]	= "Über die Mobile-App";
about_translation[4]	= "Informazioni sull'applicazione";
about_translation[5]	= "Plus d'infos sur l'application";

var synchronization_translation = [];
synchronization_translation[1]	= "Sinhronizacija";
synchronization_translation[2]	= "Sinhronizacija prevod";
synchronization_translation[3]	= "Sinhronizacija prevod";
synchronization_translation[4]	= "Sinhronizacija prevod";
synchronization_translation[5]	= "Sinhronizacija prevod";

var synhronization_title_translation = [];
synhronization_title_translation[1]	= "PRENOS PODATKOV";
synhronization_title_translation[2]	= "PRENOS PODATKOV prevod";
synhronization_title_translation[3]	= "PRENOS PODATKOV prevod";
synhronization_title_translation[4]	= "PRENOS PODATKOV prevod";
synhronization_title_translation[5]	= "PRENOS PODATKOV prevod";


var synhronization_desc_translation = [];
synhronization_desc_translation[1]	= "Za ogled te vsebine potrebujete podatkovno povezavo. Povezovanje s podatkovnim omrežjem lahko povzroči dodatne stroške.";
synhronization_desc_translation[2]	= "To view this content, you need a data connection. Connecting to data network may result in additional charges.";
synhronization_desc_translation[3]	= "Um diese Inhalte anzuzeigen, benötigen Sie eine Datenverbindung. Anschließen an ein Datennetz kann weitere Kosten verursachen.";
synhronization_desc_translation[4]	= "Per visualizzare questo contenuto, è necessaria una connessione dati. Connessione a una rete di dati, può comportare i costi supplementari.";
synhronization_desc_translation[5]	= "Pour voir ce contenu, vous avez besoin d'une connexion de données. Connexion à un réseau de données, peut entraîner des frais supplémentaires.";

var synronization_finished_translation = [];
synronization_finished_translation[1]	= "Sinhronizacija končana";
synronization_finished_translation[2]	= "Sinhronizacija končana prevod";
synronization_finished_translation[3]	= "Sinhronizacija končana prevod";
synronization_finished_translation[4]	= "Sinhronizacija končana prevod";
synronization_finished_translation[5]	= "Sinhronizacija končana prevod";


var synhronization_button_translation = [];
synhronization_button_translation[1]	= "PRENESI PODATKE";
synhronization_button_translation[2]	= "TRANSFER DATA";
synhronization_button_translation[3]	= "ÜBERTRAGEN VON DATEN";
synhronization_button_translation[4]	= "TRASFERIRE I DATI";
synhronization_button_translation[5]	= "TRANSFÉRER DES DONNÉES";

var about_version_translation = [];
about_version_translation[1]	= "VERZIJA";
about_version_translation[2]	= "VERSION";
about_version_translation[3]	= "VERSION";
about_version_translation[4]	= "VERSIONE";
about_version_translation[5]	= "VERSION";

var about_contact_translation = [];
about_contact_translation[1]	= "KONTAKT";
about_contact_translation[2]	= "CONTACT";
about_contact_translation[3]	= "KONTAKT";
about_contact_translation[4]	= "CONTATTO";
about_contact_translation[5]	= "CONTACTEZ-NOUS";

var about_desc_translation = [];
about_desc_translation[1]	= "Izdelavo te aplikacije je sofinanciral Evropski sklad za regionalni razvoj.";
about_desc_translation[2]	= "The development of this application has been co-financed by the European Regional Development Fund.";
about_desc_translation[3]	= "Diese Mobile-App wurde vom Europäischen Fonds für regionale Entwicklung mitfinanziert.";
about_desc_translation[4]	= "Questo applizacione è stato finanziato dal Fondo Europeo di Sviluppo.";
about_desc_translation[5]	= "Ce application bénéficie du soutien du FEDER.";

var wifi_connection_translation = [];
wifi_connection_translation[1]	= "Potrebuješ WIFI povezavo";
wifi_connection_translation[2]	= "You need wifi connection";
wifi_connection_translation[3]	= "You need wifi connection";
wifi_connection_translation[4]	= "You need wifi connection";
wifi_connection_translation[5]	= "You need wifi connection";


var guide_buy_desc_translation = [];
guide_buy_desc_translation[1]	= "PREDSTAVITEV";
guide_buy_desc_translation[2]	= "ABOUT THE AUDIO GUIDE";
guide_buy_desc_translation[3]	= "ÜBER DEN AUDIOFÜHRER";
guide_buy_desc_translation[4]	= "PRESENTAZIONE";
guide_buy_desc_translation[5]	= "PRÉSENTATION";


var guide_buy_locations_translation = [];
guide_buy_locations_translation[1]	= "SEZNAM ZANIMIVIH TOČK";
guide_buy_locations_translation[2]	= "POINTS OF INTEREST";
guide_buy_locations_translation[3]	= "INTERESSANTE PUNKTE";
guide_buy_locations_translation[4]	= "ELENCO DEI PUNTI D'INTERESSE";
guide_buy_locations_translation[5]	= "LISTE DES CURIOSITÉS";


var guide_buy_button_translation = [];
guide_buy_button_translation[1]	= "PRENESI VODIČ";
guide_buy_button_translation[2]	= "PRENESI VODIČ prevod";
guide_buy_button_translation[3]	= "PRENESI VODIČ prevod";
guide_buy_button_translation[4]	= "PRENESI VODIČ prevod";
guide_buy_button_translation[5]	= "PRENESI VODIČ prevod";


var guide_buy_desc_text_translation = [];
guide_buy_desc_text_translation[1]	= "Glasovni vodič vam predstavlja 13 zanimivih točk in več mogočih poti, po katerih lahko pridete do njih.";
guide_buy_desc_text_translation[2]	= "The audio guide features 13 points of interest in Ljubljana, their locations and different routes to get to them.";
guide_buy_desc_text_translation[3]	= "Der Audioführer stellt Ihnen 13 interessante Punkte und mehrere mögliche Wege zu ihnen vor.";
guide_buy_desc_text_translation[4]	= "La guida digitale illustra 13 punti d'interesse e i vari percorsi per raggiungerli.";
guide_buy_desc_text_translation[5]	= "L'audioguide visuel présente 13 curiosités et plusieurs itinéraires possibles pour arriver jusqu'à elles.";


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
month_translation[2][4]  = "MAY";
month_translation[2][5]  = "JUN";
month_translation[2][6]  = "JUL";
month_translation[2][7]  = "AUG";
month_translation[2][8]  = "SEP";
month_translation[2][9]  = "OCT";
month_translation[2][10] = "NOV";
month_translation[2][11] = "DEC";

//nemscina
month_translation[3] = [];
month_translation[3][0]  = "JAN";
month_translation[3][1]  = "FEB";
month_translation[3][2]  = "MARZ";
month_translation[3][3]  = "APR";
month_translation[3][4]  = "MAI";
month_translation[3][5]  = "JUNI";
month_translation[3][6]  = "JULI";
month_translation[3][7]  = "AUG";
month_translation[3][8]  = "SEPT";
month_translation[3][9]  = "OKT";
month_translation[3][10] = "NOV";
month_translation[3][11] = "DEZ";

//italjanscina
month_translation[4] = [];
month_translation[4][0]  = "GEN";
month_translation[4][1]  = "FEB";
month_translation[4][2]  = "MAR";
month_translation[4][3]  = "APR";
month_translation[4][4]  = "MAG";
month_translation[4][5]  = "GIU";
month_translation[4][6]  = "LUG";
month_translation[4][7]  = "AGO";
month_translation[4][8]  = "SET";
month_translation[4][9]  = "OTT";
month_translation[4][10] = "NOV";
month_translation[4][11] = "DIC";

//francoscina
month_translation[5] = [];
month_translation[5][0]  = "JAN";
month_translation[5][1]  = "FEV";
month_translation[5][2]  = "MAR";
month_translation[5][3]  = "AVR";
month_translation[5][4]  = "MAI";
month_translation[5][5]  = "JUI";
month_translation[5][6]  = "JUL";
month_translation[5][7]  = "AOÛT";
month_translation[5][8]  = "SEP";
month_translation[5][9]  = "OCT";
month_translation[5][10] = "NOV";
month_translation[5][11] = "DÉC";

//mywisit
var my_visit_download_translation = [];
my_visit_download_translation[1] = "Prenesi MyVisit s spletnega mesta";
my_visit_download_translation[2] = "Import MyVisit from the website";
my_visit_download_translation[3] = "Importieren MyVisit von der Website";
my_visit_download_translation[4] = "Prenesi MyVisit s spletnega mesta prevod";
my_visit_download_translation[5] = "Importer MyVisit depuis le site web";

var user_name_translation = [];
user_name_translation[1] = "Uporabniško ime";
user_name_translation[2] = "User name";
user_name_translation[3] = "Benutzername";
user_name_translation[4] = "Uporabniško ime prevod";
user_name_translation[5] = "Nom d'utilisateur";

var password_translation = [];
password_translation[1] = "Geslo";
password_translation[2] = "Password";
password_translation[3] = "Passwort";
password_translation[4] = "Geslo prevod";
password_translation[5] = "Geslo prevod";

var login_translation = [];
login_translation[1] = "Prijava";
login_translation[2] = "Log in";
login_translation[3] = "Anmeldung";
login_translation[4] = "Prijava prevod";
login_translation[5] = "Se connecter";

var my_visit_tours_translation = [];
my_visit_tours_translation[1] = "Poiščite navdih: vnaprej pripravljeni načrti izletov.";
my_visit_tours_translation[2] = "Get inspired: Add one or more prepared lists to MyVisit.";
my_visit_tours_translation[3] = "Lassen Sie sich inspirieren: vorbereitete Ausflugspläne als Vorschlag!";
my_visit_tours_translation[4] = "Poiščite navdih: vnaprej pripravljeni načrti izletov. prevod";
my_visit_tours_translation[5] = "Laissez-vous inspirer : Ajoutez à MyVisit une ou plusieurs listes préparées.";

var my_visit_poi_translation = [];
my_visit_poi_translation[1] = "Brskajte po vsebinah in dodajajte oglede, izlete, nastanitve, prireditve, znamenitosti itd.";
my_visit_poi_translation[2] = "Browse the city tours, excursions, accommodation, events, sights etc. and add them to MyVisit.";
my_visit_poi_translation[3] = "Browsen Sie durch die Inhalte und fügen Sie Besichtigungen, Ausflüge, Übernachtungen, Veranstaltungen, Sehenswürdigkeiten usw. hinzu!";
my_visit_poi_translation[4] = "Brskajte po vsebinah in dodajajte oglede, izlete, nastanitve, prireditve, znamenitosti itd. prevod";
my_visit_poi_translation[5] = "Parcourez les tours de la ville, les excursions, les hébergements, les événements, les curiosités, etc., et les ajouter à MyVisit.";

var download_translation = [];
download_translation[1] = "Prenesi";
download_translation[2] = "Prenesi prevod";
download_translation[3] = "Prenesi prevod";
download_translation[4] = "Prenesi prevod";
download_translation[5] = "Prenesi prevod";

var select_view_translation = [];
select_view_translation[1] = "Izberi pogled";
select_view_translation[2] = "Switch views";
select_view_translation[3] = "Sicht wechseln";
select_view_translation[4] = "Cambia";
select_view_translation[5] = "Changer de vue";

var show_on_map_translation = [];
show_on_map_translation[1] = "Prikaži vse na zemljevidu";
show_on_map_translation[2] = "Show all location details";
show_on_map_translation[3] = "Alle Standorte einzeigen";
show_on_map_translation[4] = "Mostra tutti su mappa";
show_on_map_translation[5] = "Afficher tous l'emplacements";

var logout_translation = [];
logout_translation[1] = "Odjava";
logout_translation[2] = "Log out";
logout_translation[3] = "Abmelden";
logout_translation[4] = "Esci";
logout_translation[5] = "Déconnexion";

var my_visit_sync_translation = [];
my_visit_sync_translation[1] = "Sinhroniziraj";
my_visit_sync_translation[2] = "Synchronize";
my_visit_sync_translation[3] = "Synchronisieren";
my_visit_sync_translation[4] = "Sincronizza";
my_visit_sync_translation[5] = "Synchroniser";

var clear_my_visit_translation = [];
clear_my_visit_translation[1] = "Izprazni MyVisit";
clear_my_visit_translation[2] = "Clear MyVisit";
clear_my_visit_translation[3] = "Löschen den MyVisit";
clear_my_visit_translation[4] = "Svouta la MyVisit";
clear_my_visit_translation[5] = "Vider le MyVisit";

var add_to_myvisit_translation = [];
add_to_myvisit_translation[1] = "Dodaj vse v MyVisit";
add_to_myvisit_translation[2] = "Dodaj vse v MyVisit prevod";
add_to_myvisit_translation[3] = "Dodaj vse v MyVisit prevod";
add_to_myvisit_translation[4] = "Dodaj vse v MyVisit prevod";
add_to_myvisit_translation[5] = "Dodaj vse v MyVisit prevod";

var my_visit_transfer_complete_translation = [];
my_visit_transfer_complete_translation[1] = "Prenos v myVisit opravljen";
my_visit_transfer_complete_translation[2] = "Prenos v myVisit opravljen prevod";
my_visit_transfer_complete_translation[3] = "Prenos v myVisit opravljen prevod";
my_visit_transfer_complete_translation[4] = "Prenos v myVisit opravljen prevod";
my_visit_transfer_complete_translation[5] = "Prenos v myVisit opravljen prevod";

var login_failed_translation = [];
login_failed_translation[1] = "Neuspešna prijava";
login_failed_translation[2] = "Neuspesna prijava prevod";
login_failed_translation[3] = "Neuspesna prijava prevod";
login_failed_translation[4] = "Neuspesna prijava prevod";
login_failed_translation[5] = "Neuspesna prijava prevod";


var inspired_translation = [];
inspired_translation[1] = "Priporočeno";
inspired_translation[2] = "Priporočeno prevod";
inspired_translation[3] = "Priporočeno prevod";
inspired_translation[4] = "Priporočeno prevod";
inspired_translation[5] = "Priporočeno prevod";


var prikaz_title_translation = [];
prikaz_title_translation[1] = "IZBERI PRIKAZ";
prikaz_title_translation[2] = "SELECT VIEW";
prikaz_title_translation[3] = "ANSICHT WÄHLEN";
prikaz_title_translation[4] = "SELEZIONARE LA VISTA";
prikaz_title_translation[5] = "SÉLECTIONNEZ";


var prikazi_button_translation = [];
prikazi_button_translation[1] = "PRIKAŽI";
prikazi_button_translation[2] = "SHOW ON MAP";
prikazi_button_translation[3] = "STANDORTE ANZEIGEN";
prikazi_button_translation[4] = "MOSTRA UBICAZIONI";
prikazi_button_translation[5] = "AFFICHER L'EMPLACEMENTS";


var confirm_popup_translation = [];
confirm_popup_translation[1] = "Prekliči, V redu";
confirm_popup_translation[2] = "Cancel, Ok";
confirm_popup_translation[3] = "Prekliči, V redu prevod";
confirm_popup_translation[4] = "Prekliči, V redu prevod";
confirm_popup_translation[5] = "Prekliči, V redu prevod";

var ok_translation = [];
ok_translation[1] = "V redu";
ok_translation[2] = "Ok";
ok_translation[3] = "V redu prevod";
ok_translation[4] = "V redu prevod";
ok_translation[5] = "V redu prevod";

var notification_translation = [];
notification_translation[1] = "Dogodek se bo kmalu zacel ... preveri MyVisit";
notification_translation[2] = "Dogodek se bo kmalu zacel ... preveri MyVisit";
notification_translation[3] = "Dogodek se bo kmalu zacel ... preveri MyVisit";
notification_translation[4] = "Dogodek se bo kmalu zacel ... preveri MyVisit";
notification_translation[5] = "Dogodek se bo kmalu zacel ... preveri MyVisit";

var my_visit_explain_translation = [];
my_visit_explain_translation[1] = "S prijavo boste prenesli načrt izleta, ki ste ga predhodno ustvarili na spletnem mestu www.visitljubljana.com, v mobilno aplikacijo.\n\nOpozorilo: V primeru, da ste načrt izleta ustvarili tudi znotraj mobilne aplikacije, bo ta izbrisan oziroma prepisan z načrtom izleta, ki ste ga predhodno ustvarili na spletnem mestu.";
my_visit_explain_translation[2] = "By logging in you will import the trip you have previously created at the www.visitljubljana.com website into the mobile app.\n\nWarning: In case you have already created a trip within the mobile app, it will be replaced by the trip you have previously created at the website.";
my_visit_explain_translation[3] = "Mit der Anmeldung übertragen Sie Ihren Ausflugsplan, den Sie zuvor auf der Website www.visitljubljana.com zusammengestellt haben, In Ihre mobile App.\n\nHinweis: Falls Sie den Ausflugsplan auch innerhalb Ihrer mobilen App zusammengestellt haben, wird dieser gelöscht bzw. mit dem Ausflugsplan, den Sie zuvor auf der Website zusammengestellt haben, überschrieben.";
my_visit_explain_translation[4] = "V redu prevod";
my_visit_explain_translation[5] = "En vous connectant, vous importerez dans l'application mobile l'excursion préalablement projetée par vous sur le site web www.visitljubljana.com.\n\nAvertissement : Si vous avez également projeté l'excursion dans l'application mobile, elle sera remplacée par celle préalablement projetée par vous sur le site web.";

var from_bigger_than_to_translation = [];
from_bigger_than_to_translation[1] = "Napaka: Datum začetka je večji kot datum konca!";
from_bigger_than_to_translation[2] = "Napaka: Datum od je večji kot datum do!";
from_bigger_than_to_translation[3] = "Napaka: Datum od je večji kot datum do!";
from_bigger_than_to_translation[4] = "Napaka: Datum od je večji kot datum do!";
from_bigger_than_to_translation[5] = "Napaka: Datum od je večji kot datum do!";