function populateDB_ztl_tour_images(tx) {
	tx.executeSql('CREATE INDEX ztl_poi__id ON ztl_poi (id)');
	tx.executeSql('CREATE INDEX ztl_poi_translation__id_poi ON ztl_poi_translation (id_poi)');
	tx.executeSql('CREATE INDEX ztl_poi_translation__id_language ON ztl_poi_translation (id_language)');
	tx.executeSql('CREATE INDEX ztl_category__id ON ztl_category (id)');
	tx.executeSql('CREATE INDEX ztl_category__id_language ON ztl_category (id_language)');
	tx.executeSql('CREATE INDEX ztl_group__id ON ztl_group (id)');
	tx.executeSql('CREATE INDEX ztl_group__id_language ON ztl_group (id_language)');
	tx.executeSql('CREATE INDEX ztl_poi_category__id_poi ON ztl_poi_category (id_poi)');
	tx.executeSql('CREATE INDEX ztl_poi_category__id_category ON ztl_poi_category (id_category)');
	tx.executeSql('CREATE INDEX ztl_category_group__id_category ON ztl_category_group (id_category)');
	tx.executeSql('CREATE INDEX ztl_category_group__id_group ON ztl_category_group (id_group)');

	tx.executeSql('CREATE INDEX ztl_event__id ON ztl_event (id)');
	tx.executeSql('CREATE INDEX ztl_event__record_status ON ztl_event (record_status)');
	tx.executeSql('CREATE INDEX ztl_event_translation__id_event ON ztl_event_translation (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_translation__id_language ON ztl_event_translation (id_language)');
	tx.executeSql('CREATE INDEX ztl_event_category__id ON ztl_event_category (id)');
	tx.executeSql('CREATE INDEX ztl_event_category__id_language ON ztl_event_category (id_language)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event ON ztl_event_event_category (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event_category ON ztl_event_event_category (id_event_category)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_event ON ztl_event_pricing (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_language ON ztl_event_pricing (id_language)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__id_event ON ztl_event_timetable (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__venue_id ON ztl_event_timetable (venue_id)');

	tx.executeSql('CREATE INDEX ztl_tour__id ON ztl_tour (id)');
	tx.executeSql('CREATE INDEX ztl_tour_category__id ON ztl_tour_category (id)');
	tx.executeSql('CREATE INDEX ztl_tour_category__id_language ON ztl_tour_category (id_language)');
	tx.executeSql('CREATE INDEX ztl_tour_tour_category__id_tour ON ztl_tour_tour_category (id_tour)');
	tx.executeSql('CREATE INDEX ztl_tour_tour_category__id_tour_category ON ztl_tour_tour_category (id_tour_category)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_tour ON ztl_tour_translation (id_tour)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_language ON ztl_tour_translation (id_language)');
	tx.executeSql('CREATE INDEX ztl_tour_images__id_tour ON ztl_tour_images (id_tour)');
	tx.executeSql('CREATE INDEX ztl_tour_chaters__id_tour ON ztl_tour_chaters (id_tour)');
	
	tx.executeSql('CREATE INDEX ztl_info__id ON ztl_info (id)');
	tx.executeSql('CREATE INDEX ztl_info__id_language ON ztl_info (id_language)');
	
	tx.executeSql('CREATE INDEX ztl_inspired__id ON ztl_inspired (id)');
	tx.executeSql('CREATE INDEX ztl_inspired_translation__id_inspired ON ztl_inspired_translation (id_inspired)');
	tx.executeSql('CREATE INDEX ztl_inspired_translation__id_language ON ztl_inspired_translation (id_language)');
	tx.executeSql('CREATE INDEX ztl_inspired_category__id_inspired ON ztl_inspired_category (id_inspired)');
	tx.executeSql('CREATE INDEX ztl_inspired_category__id_language ON ztl_inspired_category (id_language)');
	tx.executeSql('CREATE INDEX ztl_inspired_category__ref_object ON ztl_inspired_category (ref_object)');
}