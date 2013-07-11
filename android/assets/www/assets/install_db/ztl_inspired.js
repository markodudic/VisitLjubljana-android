function populateDB_ztl_inspired(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_inspired');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_inspired (id, image, record_status)');
}