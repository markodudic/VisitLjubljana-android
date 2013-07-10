   			

function load_guide_buy() {
	voice_guide = 1; 
	
	//ce je kupljen za ta jezik odpri
	//load_page(template_lang+'trips.html', 'trips', trips[4], 'fade', false, 4);
	
	//drugače
	load_page(template_lang+'guide_buy.html', 'guide_buy', trips[4], 'fade', false);
}

function buy_guide() {
	//nakup vodiča in synhronizacija
	
	//na koncu prikaz
	load_guide_buy();
}