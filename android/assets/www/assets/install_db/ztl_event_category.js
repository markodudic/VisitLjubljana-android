function populateDB_ztl_event_category(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_category');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_category (id,id_language,name)');
}