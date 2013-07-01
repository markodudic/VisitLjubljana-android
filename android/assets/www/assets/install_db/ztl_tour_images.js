function populateDB_ztl_tour_images(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour_images');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour_images (id_tour,tour_idx,image)');
}