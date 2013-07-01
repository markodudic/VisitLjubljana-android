function populateDB_ztl_tour_chaters(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour_chaters');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour_chaters (id_tour,id_language,tour_idx,title,content)');
}