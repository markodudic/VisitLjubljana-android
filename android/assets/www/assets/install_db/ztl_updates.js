function populateDB_ztl_updates(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_updates');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_updates (id_language,last_update)');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) VALUES (1,"2013-06-01 12:00:00")');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) VALUES (2,"2013-06-01 12:00:00")');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) VALUES (3,"2013-06-01 12:00:00")');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) VALUES (4,"2013-06-01 12:00:00")');
	tx.executeSql('INSERT INTO ztl_updates (id_language,last_update) VALUES (5,"2013-06-01 12:00:00")');
}