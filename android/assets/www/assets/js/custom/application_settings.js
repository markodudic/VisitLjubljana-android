   			

function load_current_settings() {
	load_page(template_lang+'ztl_settings.html', 'ztl_settings', settings, 'fade', false);
}

function choose_language() {
	load_page('select_language.html', 'select_language', null, 'fade', false, 0);
}

function reminder_change() {
	var reminder = 0;
	if  ((settings.reminder == undefined) || (settings.reminder == 0)) {
		var reminder = 1;
	}
	
	settings.reminder = reminder;
	save_mobile_settings();
}