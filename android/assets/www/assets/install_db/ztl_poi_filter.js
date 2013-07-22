function populateDB_ztl_poi_filter(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_poi_filter');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_poi_filter (id,id_language,title,record_status)');
}