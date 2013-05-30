function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_group');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_group (id,title)');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (215,"Nastanitve")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (217,"Znamenitosti")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (218,"Kulturne ustanove")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (219,"Kulinarika")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (220,"Trgovine")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (221,"Šport, rekreacija in wellness")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (222,"Zabava in nočno življenje")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (224,"Turistične in praktične informacije")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (225,"Promet in prevozi")');
	tx.executeSql('INSERT INTO ztl_group (id,title) VALUES (227,"Konferenčne zmogljivosti in ponudniki storitev")');
}