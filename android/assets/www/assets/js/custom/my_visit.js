function add_to_my_visit(id, type, time, location) {
	var tmp_query      = "INSERT OR REPLACE INTO ztl_my_visit (id, main_group, type, time, location) VALUES ("+id+", "+selected_group+", "+type+", "+time+", "+location+");";
    db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res) {});
	});
}

function load_my_visit() {
	var tmp_query      = "SELECT id, main_group, type, time, location FROM ztl_my_visit GROUP BY id, main_group, type, time, location ORDER BY type, main_group";
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

function web_login() {
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
	console.log("login --- res: " + JSON.stringify(res));
	console.log("login --- login success: " + res.success);

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
	//rediractam na my_visit
	load_my_visit();
}

function web_user_logout() {
	//zbrisem userja iz localstorage
	localStorage.removeItem('my_visit_ztl_user');

	//spraznim tabelo my_visit
	tmp_query = "DELETE FROM  ztl_my_visit";
	db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res_poi) {
		 	//redirectam na login
		 	load_my_visit();
		 });
	});
}