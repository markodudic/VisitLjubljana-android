function populateDB_ztl_event_event_category(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_event_category');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_event_category (id_event,id_event_category)');
}