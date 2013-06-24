function populateDB_ztl_tour(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_tour');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_tour (id,turisticna_kartica,validity_from,validity_to)');
	tx.executeSql('INSERT INTO ztl_tour (id,turisticna_kartica,validity_from,validity_to) SELECT 22631 AS id, "" AS turisticna_kartica, "" AS validity_from, "" AS validity_to UNION SELECT 6731,"","","" UNION SELECT 6743,"","","" UNION SELECT 6752,"","","" UNION SELECT 7706,"","","" UNION SELECT 43687,"","",""');
}