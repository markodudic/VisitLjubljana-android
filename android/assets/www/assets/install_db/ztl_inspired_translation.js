function populateDB_ztl_inspired_translation(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_inspired_translation');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_inspired_translation (id_inspired, id_language, title, desc)');
}