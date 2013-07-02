function populateDB_ztl_tour_images(tx) {
	tx.executeSql('CREATE INDEX ztl_poi__id ON ztl_poi (id ASC)');
	tx.executeSql('CREATE INDEX ztl_poi_translation__id_poi ON ztl_poi_translation (id_poi ASC)');
	tx.executeSql('CREATE INDEX ztl_poi_translation__id_language ON ztl_poi_translation (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_category__id ON ztl_category (id ASC)');
	tx.executeSql('CREATE INDEX ztl_category__id_language ON ztl_category (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_group__id ON ztl_group (id ASC)');
	tx.executeSql('CREATE INDEX ztl_group__id_language ON ztl_group (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_poi_category__id_poi ON ztl_poi_category (id_poi ASC)');
	tx.executeSql('CREATE INDEX ztl_poi_category__id_category ON ztl_poi_category (id_category ASC)');
	tx.executeSql('CREATE INDEX ztl_category_group__id_category ON ztl_category_group (id_category ASC)');
	tx.executeSql('CREATE INDEX ztl_category_group__id_group ON ztl_category_group (id_group ASC)');

	tx.executeSql('CREATE INDEX ztl_event__id ON ztl_poi (id ASC)');
	tx.executeSql('CREATE INDEX ztl_event_translation__id_event ON ztl_event_translation (id_event ASC)');
	tx.executeSql('CREATE INDEX ztl_event_translation__id_language ON ztl_event_translation (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_event_category__id ON ztl_event_category (id ASC)');
	tx.executeSql('CREATE INDEX ztl_event_category__id_language ON ztl_event_category (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event ON ztl_event_event_category (id_event ASC)');
	tx.executeSql('CREATE INDEX ztl_event_event_category__id_event_category ON ztl_event_event_category (id_event_category ASC)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_event ON ztl_event_pricing (id_event ASC)');
	tx.executeSql('CREATE INDEX ztl_event_pricing__id_language ON ztl_event_pricing (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__id_event ON ztl_event_timetable (id_event ASC)');
	tx.executeSql('CREATE INDEX ztl_event_timetable__venue_id ON ztl_event_timetable (venue_id ASC)');

	tx.executeSql('CREATE INDEX ztl_tour__id ON ztl_poi (id ASC)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_tour ON ztl_tour_translation (id_tour ASC)');
	tx.executeSql('CREATE INDEX ztl_tour_translation__id_language ON ztl_tour_translation (id_language ASC)');
	tx.executeSql('CREATE INDEX ztl_tour_images__id_tour ON ztl_tour_images (id_tour ASC)');
	tx.executeSql('CREATE INDEX ztl_tour_chaters__id_tour ON ztl_tour_chaters (id_tour ASC)');
	
	tx.executeSql('CREATE UNIQUE INDEX ztl_group__u ON ztl_group (id, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_category__u ON ztl_group (id, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_category_group__u ON ztl_category_group (id_category, id_group);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_poi__u ON ztl_poi (id);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_poi_translation__u ON ztl_poi_translation (id_poi, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_poi_category__u ON ztl_poi_category (id_poi, id_category);');

	tx.executeSql('CREATE UNIQUE INDEX ztl_event__u ON ztl_event (id);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_event_translation__u ON ztl_event_translation (id_event, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_event_category__u ON ztl_event_category (id, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_event_event_category__u ON ztl_event_event_category (id_event, id_event_category);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_event_timetable__u ON ztl_event_timetable (id_event, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_event_pricing__u ON ztl_event_pricing (id_event, id_language);');
	
	tx.executeSql('CREATE UNIQUE INDEX ztl_tour__u ON ztl_tour (id);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_tour_translation__u ON ztl_tour_translation (id_tour, id_language);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_tour_chaters__u ON ztl_tour_chaters (id_tour, id_language, tour_idx);');
	tx.executeSql('CREATE UNIQUE INDEX ztl_tour_images__u ON ztl_tour_images (id_tour, tour_idx);');
}