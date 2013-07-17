function populateDB_ztl_poigroup(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_poigroup');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_poigroup (id,id_language,title,image,desc,record_status)');
}