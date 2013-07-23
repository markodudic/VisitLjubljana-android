function populateDB_ztl_tour_images(tx) {
	
	//indexes for preformance
	
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
	tx.executeSql('CREATE INDEX ztl_event_type__id ON ztl_event_type (id)');
	tx.executeSql('CREATE INDEX ztl_event_type__id_language ON ztl_event_type (id_language)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event ON ztl_event_event_category (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event_category ON ztl_event_event_category (id_event_category)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_event ON ztl_event_pricing (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_language ON ztl_event_pricing (id_language)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__id_event ON ztl_event_timetable (id_event)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__venue_id ON ztl_event_timetable (venue_id)');

	tx.executeSql('CREATE INDEX ztl_tour__id ON ztl_tour (id)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_tour ON ztl_tour_translation (id_tour)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_language ON ztl_tour_translation (id_language)');
	tx.executeSql('CREATE INDEX ztl_tour_category__id ON ztl_tour_category (id)');
	tx.executeSql('CREATE INDEX ztl_tour_category__id_language ON ztl_tour_category (id_language)');
	tx.executeSql('CREATE INDEX ztl_tour_tour_category__id_tour ON ztl_tour_tour_category (id_tour)');
	tx.executeSql('CREATE INDEX ztl_tour_tour_category__id_tour_category ON ztl_tour_tour_category (id_tour_category)');
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
	
	tx.executeSql('CREATE INDEX ztl_poi_filter__id ON ztl_poi_filter (id)');
	tx.executeSql('CREATE INDEX ztl_poi_filter__id_language ON ztl_poi_filter (id_language)');

	tx.executeSql('CREATE INDEX ztl_poigroup__id ON ztl_poigroup (id)');
	tx.executeSql('CREATE INDEX ztl_poigroup__id_language ON ztl_poigroup (id_language)');

	//unique indexes for insert or replace
	
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_poi ON ztl_poi (id)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_poi_translation ON ztl_poi_translation (id_poi, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_poi_category ON ztl_poi_category (id_poi, id_category)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_category ON ztl_category (id, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_group ON ztl_group (id, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_category_group ON ztl_category_group (id_category, id_group)');	
	
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event ON ztl_event (id)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event_translation ON ztl_event_translation (id_event, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event_type ON ztl_event_type (id, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event_event_category ON ztl_event_event_category (id_event, id_event_category)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event_pricing ON ztl_event_pricing (id_event, id_language, price)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_event_timetable ON ztl_event_timetable (id_event, id_language, timetable_idx)');

	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour ON ztl_tour (id)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour_translation ON ztl_tour_translation (id_tour, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour_category ON ztl_tour_category (id, id_language)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour_tour_category ON ztl_tour_tour_category (id_tour, id_tour_category)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour_images ON ztl_tour_images (id_tour, tour_idx)');
	tx.executeSql('CREATE UNIQUE INDEX unique_ztl_tour_chaters ON ztl_tour_chaters (id_tour, id_language, tour_idx)');
}