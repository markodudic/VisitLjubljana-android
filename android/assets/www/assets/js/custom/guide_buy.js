var audio_guides;
var lang_has_purchased = 0;
var lang_has_stored    = 0;

function read_audio_guides_settings() {
	var stored_audio_guides = window.localStorage.getItem("audio_guides");
	if (stored_audio_guides == null) {
		var defaults = {"1": {"purchased": "0", "stored": "1"},
						"2": {"purchased": "0", "stored": "0"},
						"3": {"purchased": "0", "stored": "0"},
						"4": {"purchased": "0", "stored": "0"},
						"5": {"purchased": "0", "stored": "0"}};
		localStorage.setItem('audio_guides', JSON.stringify(defaults));
		audio_guides = defaults;
	} else {
		audio_guides = $.parseJSON(stored_audio_guides);
	}
}

function load_guide_buy() {
	read_audio_guides_settings();
	console.log(JSON.stringify(audio_guides[settings.id_lang]));
	lang_has_purchased = audio_guides[settings.id_lang].purchased;
	lang_has_stored    = audio_guides[settings.id_lang].stored;
	
	if (lang_has_purchased == 1 && lang_has_stored == 1) {
		load_page(template_lang+'trips.html', 'trips', trips[4], 'fade', false, 4);
	} else {
		load_page(template_lang+'guide_buy.html', 'guide_buy', trips[4], 'fade', false);		
	}
}

//klik na gumb
function buy_guide() {
	//recimo da smo kupili, za vsak jezik svoj sku
	
	//sinhronizacija v update.js:644
	update_audio();
	
	//shranimo
	lang_has_purchased = 1;
	lang_has_stored    = 1;
	audio_guides[settings.id_lang]["purchased"] = lang_has_purchased;
	audio_guides[settings.id_lang]["stored"]    = lang_has_stored;
	localStorage.setItem('audio_guides', JSON.stringify(audio_guides));
	
	//zrendramo na novo
	load_guide_buy();
}