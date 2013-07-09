function populateDB_ztl_event_timetable(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_event_timetable');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_event_timetable (id_event,id_language,timetable_idx,venue_id,venue,date,date_first,date_last)');
}