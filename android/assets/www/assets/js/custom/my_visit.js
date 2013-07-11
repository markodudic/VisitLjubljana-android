var only_login = 1;

function add_to_my_visit(id, ztl_group, type, start, end) {

	console.log("my_visit -- id: "+id);
	console.log("my_visit -- ztl_group: "+ztl_group);
	console.log("my_visit -- type: "+type);
	console.log("my_visit -- start: "+start);
	console.log("my_visit -- end: "+end);

	var tmp_query = "INSERT OR REPLACE INTO ztl_my_visit (id, ztl_group, type, start, end) VALUES ("+id+", "+ztl_group+", "+type+", "+start+", "+end+");";
    
    db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res) {});
	});
}

function load_my_visit(save_history) {
	if (save_history == 1)  {
		var history_string = "fun--load_my_visit--empty";
		add_to_history(history_string);
	}

	var tmp_query      = "SELECT id, ztl_group, type, start, end FROM ztl_my_visit GROUP BY id, ztl_group, type, start, end ORDER BY type, ztl_group";
    var tmp_callback   = "my_visit_success";

    generate_query(tmp_query, tmp_callback);
}

function load_my_visit_settings() {
	var res  = {};
	
	var tmp_user = check_user();

	if (tmp_user != false) {
		res.logged_id = 1;
		res.user 	  = check_user();
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

function delete_from_my_visit(id, time) {
	if (time == -1) {
		var tmp_query = "DELETE FROM ztl_my_visit WHERE id = "+id;
	} else {
		var tmp_query = "DELETE FROM ztl_my_visit WHERE id = "+id+" AND time = "+time;
	}
	
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
		$("#my_visit_password").val("login failed");
	}
}

function sync_my_visit(res) {
	var tmp_group = 0;
	res = res.myVisit.ref_object;
	

	if (only_login == 0) {
		clear_my_visit();

		for (var i = 0; i<res.length; i++) {
			console.log(JSON.stringify(res[i]));

			tmp_group = get_mobile_group(res[i].ref_object_type);
			add_to_my_visit(res[i].ref_object, tmp_group, res[i].ref_object_date_type, res[i].ref_object_start, res[i].ref_object_end);
		}
	}

	//rediractam na my_visit
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

	if ($('.event_filter').is(':visible')) {
		swipe = 0;
	} else {
		swipe = 1;
	}
}

function add_inspire_to_my_visit(id) {
	var tmp_query = "SELECT zic.ref_object, zic.ref_object_type, zic.ref_object_date_type FROM ztl_inspired_category zic WHERE zic.id_inspired = "+id;
	var tmp_group = 0;
	db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, results) {
		 	
		 	var len = results.rows.length;
			for (var i=0; i<len; i++){
				tmp_group = get_mobile_group(results.rows.item(i).ref_object_type);

				add_to_my_visit(results.rows.item(i).ref_object, tmp_group, results.rows.item(i).ref_object_date_type, 0, 0);
		    }

		    load_my_visit();
		 });
	});
}