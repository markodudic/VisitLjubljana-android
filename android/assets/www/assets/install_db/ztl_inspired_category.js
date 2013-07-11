function populateDB_ztl_inspired_category(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_inspired_category');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_inspired_category (id_inspired, id_language, category_idx, ref_object, ref_object_date_type, ref_object_end, ref_object_start, ref_object_type, title)');
}