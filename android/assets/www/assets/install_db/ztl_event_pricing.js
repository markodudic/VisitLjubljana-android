function populateDB_ztl_event_pricing(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_pricing');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_pricing (id_event,id_language,price,ticket_type)');
}