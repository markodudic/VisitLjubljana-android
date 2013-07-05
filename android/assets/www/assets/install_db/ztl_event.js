function populateDB_ztl_event(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event (id, image, featured, record_status)');
}