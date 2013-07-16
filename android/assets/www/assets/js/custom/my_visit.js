var only_login 		= 1;
var skip_filter_cat = 0;
var filter_cat;

var sql_filter_group  = -1;
var sql_filer_poi_cat = -1;

function add_to_my_visit(id, ztl_group, type, start, end, autmatic) {
	var tmp_query = "INSERT OR REPLACE INTO ztl_my_visit (id, ztl_group, type, start, end) VALUES ("+id+", "+ztl_group+", "+type+", "+start+", "+end+");";

    db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res) {});

		 if (autmatic != 1) {
			alert(my_visit_transfer_complete_translation[settings.id_lang]);
		}
	});
}

function load_my_visit(save_history, filter_group) {
	if (save_history == 1)  {
		var history_string = "fun--load_my_visit--empty";
		add_to_history(history_string);
	}

	if ((filter_group != undefined) && (filter_group >-1)) {
		var tmp_query  = "SELECT id, ztl_group, type, start, end FROM ztl_my_visit WHERE ztl_group = "+sql_filter_group+" GROUP BY id, ztl_group, type, start, end ORDER BY type, ztl_group";
	} else {
		var tmp_query = "SELECT id, ztl_group, type, start, end FROM ztl_my_visit GROUP BY id, ztl_group, type, start, end ORDER BY type, ztl_group";
	}
	
	
    var tmp_callback   = "my_visit_success";

    generate_query(tmp_query, tmp_callback);
}

function load_my_visit_settings() {
	var res  = {};
	
	var tmp_user = check_user();

	if (tmp_user != false) {
		res.logged_id = 1;
		res.user 	  = check_user();
	} else {
		//alert
	}

	load_page(template_lang+'my_visit_settings.html', 'my_visit_settings', res, 'fade', false);
}

function check_user() {
	var ztl_user = localStorage.getItem('my_visit_ztl_user');
	
	if (ztl_user != null) {
		ztl_user = JSON.parse(ztl_user);

		return  ztl_user;
	} else {
		return false;
	}
}

function my_visit_sync() {
	if (check_user() != false) {
		web_login(0);
	} else {
		load_my_visit_settings();
	}
}

function delete_from_my_visit(id, group) {
	var tmp_query = "DELETE FROM ztl_my_visit WHERE id = "+id+" AND ztl_group = "+group;
    var tmp_callback   = "delete_from_my_visit_success";
    generate_query(tmp_query, tmp_callback);
}

function clear_field(field) {
	$("#"+field).val("");
}

function web_login(sync) {
	only_login = sync;

	var username = $("#my_visit_username").val();
	var password = $("#my_visit_password").val();

	var url = 'http://www.visitljubljana.com/si/mobile_app/service.json?action=login&u='+username+'&p='+password;

	$.ajax( {
		url : url,
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
		},
		success : function(data) {
			handle_web_login(data);
		}
	});
}

function handle_web_login(res) {
	if (res.success == 1) {
		//nastavim localstorage
		var ztl_user = {};

		ztl_user.username = $("#my_visit_username").val();
		ztl_user.password = $("#my_visit_password").val();


		localStorage.setItem('my_visit_ztl_user', JSON.stringify(ztl_user));

		//tu se bodo se sinhronizirali podatki
		sync_my_visit(res);
	} else {
		$("#my_visit_password").val("");
		alert(login_failed_translation[settings.id_lang]);
	}
} 

function sync_my_visit(res) {
	var tmp_group = 0;
	res = res.myVisit.ref_object;
	

	if (only_login == 0) {
		clear_my_visit();

		for (var i = 0; i<res.length; i++) {

			tmp_group = get_mobile_group(res[i].ref_object_type);
			add_to_my_visit(res[i].ref_object, tmp_group, res[i].ref_object_date_type, res[i].ref_object_start, res[i].ref_object_end, 1);
		}

		alert(my_visit_transfer_complete_translation[settings.id_lang]);
	}

	//rediractam na my_visit
	load_my_visit();
}

function add_to_myvisit(res) {
	for (var i = 0; i<res.items.length; i++) {
		add_to_my_visit(res.items[i].id, POI_GROUP, 0, 0, 0, 1);
	}

	alert(my_visit_transfer_complete_translation[settings.id_lang]);

	load_my_visit();
}

function get_mobile_group(object_type) {
	var tmp_group = 0;

	if (object_type == ZTL_EVENT_GROUP) {
		tmp_group = EVENT_GROUP;
	} else if (object_type == ZTL_TOUR_GROUP) {
		tmp_group = TOUR_GROUP;
	} else if (object_type == ZTL_POI_GROUP) {
		tmp_group = POI_GROUP;
	}

	return tmp_group;
}

function web_user_logout() {
	//zbrisem userja iz localstorage
	localStorage.removeItem('my_visit_ztl_user');

	//spraznim tabelo my_visit
	clear_my_visit();
}

function clear_my_visit() {
	tmp_query = "DELETE FROM ztl_my_visit";
	db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res_poi) {
		 	//redirectam na login
		 	load_my_visit();
		 });
	});
}

function my_visit_settings_menu_toggle() {
	$(".event_filter").toggle();
	
	$(".ztl_content").toggle();
	$(".header").toggle();
	$(".footer").toggle();

	/*
	if ($('.event_filter').is(':visible')) {
		get_active_my_visti_categories();
	}
	*/
}

function add_inspire_to_my_visit(id) {
	var tmp_query = "SELECT zic.ref_object, zic.ref_object_type, zic.ref_object_date_type FROM ztl_inspired_category zic WHERE zic.id_inspired = "+id;
	var tmp_group = 0;
	db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, results) {
		 	
		 	var len = results.rows.length;
			for (var i=0; i<len; i++){
				tmp_group = get_mobile_group(results.rows.item(i).ref_object_type);

				add_to_my_visit(results.rows.item(i).ref_object, tmp_group, results.rows.item(i).ref_object_date_type, 0, 0, 1);
		    }

			alert(my_visit_transfer_complete_translation[settings.id_lang]);
		    load_my_visit();
		 });
	});
}

function my_visit_item_date(id, group) {
	var myNewDate = new Date();
	window.plugins.datePicker.show({
		date : myNewDate,
		mode : 'date', // date or time or blank for both
		allowOldDates : false
		}, function(returnDate) {
			var newDate = new Date(returnDate);

			var time = newDate.getTime() / 1000;


			var tmp_query = "UPDATE ztl_my_visit SET start = "+time+" WHERE id = "+id+" AND ztl_group = "+group;
			db.transaction(function(tx) {
				 tx.executeSql(tmp_query, [], function(tx, results) {
				    load_my_visit();
				 });
			});
		}
	);	
}

function render_time() {
	var tmp_id 	  = "";
	var hide_time = 0;
	
	$("[id^=non_formated_]" ).each(function() {

		if ($(this).val() > 0) {
			tmp_id = $(this).attr('id').substring(4, $(this).attr('id').length);
			
			var n = $(this).attr('id').indexOf("event");
			if (n > 0){
				hide_time = 0;
			} else {
				hide_time = 1;
			}

			format_date($(this).val(), tmp_id, hide_time);
		}
	});
}

function filter_visits () {
	var id_filter 	= parseInt($("#visit_type").val());
	skip_filter_cat = 1;

	if (id_filter == EVENT_GROUP) {
		sql_filter_group = EVENT_GROUP;
	} else if (id_filter == TOUR_GROUP) {
		sql_filter_group = TOUR_GROUP;
	} else {
		sql_filter_group  = POI_GROUP;
		sql_filer_poi_cat = id_filter;
	}

	load_my_visit(0, id_filter);
}

function  my_visit_explain(){
	navigator.notification.confirm(
		my_visit_explain_translation[settings.id_lang],
        null,
        my_visit_download_translation[settings.id_lang],
        ok_translation[settings.id_lang]
	);
}