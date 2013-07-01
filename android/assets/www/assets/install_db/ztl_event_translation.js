function populateDB_ztl_event_translation(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_translation');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_translation (id_event,id_language,title,intro,description)');
}