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
	console.log("my_visit --- nalagam nastavitve");
	var res 		 = {};
    res.user 		 = [];

	res.user = check_user();

	console.log("my_visit --- "+ JSON.stringify(res));

	load_page(template_lang+'my_visit_settings.html', 'my_visit_settings', res, 'fade', false);
}

function check_user() {
	return "";
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

	console.log("login --- " + username);
	console.log("login --- " + password);
}