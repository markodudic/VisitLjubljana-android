function populateDB_ztl_info(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_info');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_info (id,id_language,title,content,record_status)');
}