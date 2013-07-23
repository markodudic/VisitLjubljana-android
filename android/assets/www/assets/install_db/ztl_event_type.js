function populateDB_ztl_event_type(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_type');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_type (id,id_language,title)');
}