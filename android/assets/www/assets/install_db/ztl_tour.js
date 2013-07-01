function populateDB_ztl_tour(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour (id,turisticna_kartica,validity_from,validity_to)');
}