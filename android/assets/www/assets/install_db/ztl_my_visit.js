function populateDB_ztl_my_visit(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_my_visit');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_my_visit (id, main_group, type, time, location)');
}