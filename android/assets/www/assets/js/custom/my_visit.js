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

function delete_from_my_visit(id, time) {
	if (time == -1) {
		var tmp_query = "DELETE FROM ztl_my_visit WHERE id = "+id;
	} else {
		var tmp_query = "DELETE FROM ztl_my_visit WHERE id = "+id+" AND time = "+time;
	}
	
    var tmp_callback   = "delete_from_my_visit_success";
    generate_query(tmp_query, tmp_callback);
}