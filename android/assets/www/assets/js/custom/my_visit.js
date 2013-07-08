function add_to_my_visit(id, type, time, location) {
	var tmp_query      = "INSERT OR REPLACE INTO ztl_my_visit (id, main_group, type, time, location) VALUES ("+id+", "+selected_group+", "+type+", "+time+", "+location+");";
    db.transaction(function(tx) {
		 tx.executeSql(tmp_query, [], function(tx, res) {});
	});
}

function load_my_visit() {
	console.log("my_visit --- load");

	var tmp_query      = "SELECT * FROM ztl_my_visit ORDER BY type, main_group";
    var tmp_callback   = "my_visit_success";

    generate_query(tmp_query, tmp_callback);
}

function delete_from_my_visit() {
	console.log("my_visit --- delete");
}