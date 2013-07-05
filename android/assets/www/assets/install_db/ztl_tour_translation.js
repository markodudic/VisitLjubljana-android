function populateDB_ztl_tour_translation(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour_translation');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour_translation (id_tour,id_language,title,short_description,long_description)');
}