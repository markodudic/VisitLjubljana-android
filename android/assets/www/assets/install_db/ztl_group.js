function populateDB_ztl_group(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_group');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_group (id,id_language,title,record_status)');
	tx.executeSql('INSERT INTO ztl_group (id,id_language,title,record_status) SELECT 215 AS id, 1 AS id_language, "Nastanitve" AS title, 1 AS record_status UNION SELECT 217,1,"Znamenitosti",1 UNION SELECT 218,1,"Kulturne ustanove",1 UNION SELECT 219,1,"Kulinarika",1 UNION SELECT 220,1,"Trgovine",1 UNION SELECT 221,1,"Šport, rekreacija in wellness",1 UNION SELECT 222,1,"Zabava in nočno življenje",1 UNION SELECT 224,1,"Turistične in praktične informacije",1 UNION SELECT 225,1,"Promet in prevozi",1 UNION SELECT 227,1,"Konferenčne zmogljivosti in ponudniki storitev",1 UNION SELECT 215,2,"Accommodation",1 UNION SELECT 217,2,"Sights & attractions",1 UNION SELECT 218,2,"Cultural institutions",1 UNION SELECT 219,2,"Gastronomy",1 UNION SELECT 220,2,"Shops",1 UNION SELECT 221,2,"Sports, recreation & wellness",1 UNION SELECT 222,2,"Entertainment and nightlife",1 UNION SELECT 224,2,"Tourist and practical information",1 UNION SELECT 225,2,"Traffic and transport",1 UNION SELECT 227,2,"Conference facilities & service providers",1 UNION SELECT 215,3,"Unterkünfte",1 UNION SELECT 217,3,"Sehenswürdigkeiten",1 UNION SELECT 218,3,"Kultureinrichtungen",1 UNION SELECT 219,3,"Essen und Trinken",1 UNION SELECT 220,3,"Geschäfte",1 UNION SELECT 221,3,"Sport und Wellness",1 UNION SELECT 222,3,"Unterhaltung und Nachtleben",1 UNION SELECT 224,3,"Touristische und praktische Informationen",1 UNION SELECT 225,3,"Verkehr und Beförderung",1 UNION SELECT 227,3,"Konferenzeinrichtungen und Kongressdienstleister",1 UNION SELECT 215,4,"Alloggio",1 UNION SELECT 217,4,"Curiosità",1 UNION SELECT 218,4,"Istituzioni culturali",1 UNION SELECT 219,4,"Gastronomia",1 UNION SELECT 220,4,"Negozi",1 UNION SELECT 221,4,"Sport, ricreazione e benessere",1 UNION SELECT 222,4,"Intrattenimento e vita notturna",1 UNION SELECT 224,4,"Informazioni turistiche e pratiche",1 UNION SELECT 225,4,"Traffico e trasporti",1 UNION SELECT 227,4,"Strutture congressuali e fornitori di servizi",1 UNION SELECT 215,5,"Hébergements",1 UNION SELECT 217,5,"Attractions",1 UNION SELECT 218,5,"Institutions culturelles",1 UNION SELECT 219,5,"Gastronomie",1 UNION SELECT 220,5,"Magasins",1 UNION SELECT 221,5,"Sport, récréation et wellness",1 UNION SELECT 222,5,"Divertissement et vie nocturne",1 UNION SELECT 224,5,"Informations touristiques et pratiques",1 UNION SELECT 225,5,"Trafic et transports",1 UNION SELECT 227,5,"Capacités d\'accueil conférences et prestateurs",1');
}