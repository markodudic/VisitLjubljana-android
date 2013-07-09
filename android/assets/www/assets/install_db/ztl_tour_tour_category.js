function populateDB_ztl_tour_tour_category(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour_tour_category');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour_tour_category (id_tour,id_tour_category)');
}