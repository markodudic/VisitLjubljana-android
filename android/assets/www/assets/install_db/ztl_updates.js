function populateDB_ztl_updates(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_updates');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_updates (id_language,last_update)');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) SELECT 1 AS id_language, "2013-06-01 12:00:00" AS last_update UNION SELECT 2,"2013-06-01 12:00:00" UNION SELECT 3,"2013-06-01 12:00:00" UNION SELECT 4,"2013-06-01 12:00:00" UNION SELECT 5,"2013-06-01 12:00:00"');
}