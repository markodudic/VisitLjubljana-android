   			

function load_current_settings() {
	load_page(template_lang+'ztl_settings.html', 'ztl_settings', settings, 'fade', false);
}

function choose_language() {
	load_page('select_language.html', 'select_language', null, 'fade', false, 0);
}

function reminder_change(sel) {
	localStorage.setItem('reminder', sel);
	reminder_toggle();
}

function reminder_toggle() {
	if ((localStorage.getItem('reminder') == null) || (localStorage.getItem('reminder') == 0)) {
		$("#reminder_on").css('display','none');;
		$("#reminder_off").css('display','inline');;
	} else {
		$("#reminder_on").css('display','inline');;
		$("#reminder_off").css('display','none');;		
	}
}

function synhronization(){
	load_page(template_lang+'ztl_synhronization.html', 'ztl_synhronization', null, 'fade', false);
}

function rate() {
	if ((navigator.userAgent.match(/iPhone/i))  == "iPhone") {
	   window.open('itms-apps://itunes.apple.com/us/app/domainsicle-domain-name-search/id511364723?ls=1&mt=8','_system'); 
	} else if ((navigator.userAgent.match(/Android/i)) == "Android") {
	   window.open('market://details?id=com.innovatif.visitljubljana','_system');
	}
}

function about(){
	load_page(template_lang+'ztl_about.html', 'ztl_about', null, 'fade', false);
}