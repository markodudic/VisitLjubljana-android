function populateDB_ztl_category_group(tx) {
	tx.executeSql('DROP TABLE IF EXISTS ztl_category_group');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ztl_category_group (id_category,id_group)');
	tx.executeSql('INSERT INTO ztl_category_group (id_category,id_group) SELECT 364 AS id_category, 227 AS id_group UNION SELECT 366,215 UNION SELECT 369,215 UNION SELECT 371,219 UNION SELECT 373,219 UNION SELECT 376,222 UNION SELECT 379,222 UNION SELECT 386,224 UNION SELECT 387,220 UNION SELECT 388,219 UNION SELECT 388,220 UNION SELECT 394,218 UNION SELECT 395,220 UNION SELECT 396,218 UNION SELECT 397,221 UNION SELECT 398,215 UNION SELECT 399,217 UNION SELECT 400,219 UNION SELECT 401,215 UNION SELECT 402,227 UNION SELECT 404,222 UNION SELECT 405,224 UNION SELECT 406,221 UNION SELECT 407,221 UNION SELECT 408,224 UNION SELECT 409,221 UNION SELECT 410,218 UNION SELECT 410,222 UNION SELECT 411,222 UNION SELECT 412,220 UNION SELECT 413,218 UNION SELECT 414,227 UNION SELECT 416,220 UNION SELECT 419,224 UNION SELECT 420,225 UNION SELECT 421,225 UNION SELECT 422,222 UNION SELECT 426,219 UNION SELECT 427,219 UNION SELECT 428,219 UNION SELECT 431,215 UNION SELECT 432,217 UNION SELECT 432,218 UNION SELECT 437,217 UNION SELECT 438,215 UNION SELECT 439,222 UNION SELECT 440,220 UNION SELECT 441,218 UNION SELECT 442,224 UNION SELECT 443,224 UNION SELECT 444,220 UNION SELECT 448,222 UNION SELECT 449,219 UNION SELECT 451,222 UNION SELECT 453,227 UNION SELECT 454,227 UNION SELECT 455,227 UNION SELECT 456,215 UNION SELECT 459,225 UNION SELECT 461,220 UNION SELECT 462,227 UNION SELECT 463,225 UNION SELECT 466,221 UNION SELECT 467,224 UNION SELECT 468,219 UNION SELECT 469,219 UNION SELECT 470,219 UNION SELECT 471,219 UNION SELECT 474,219 UNION SELECT 474,222 UNION SELECT 475,217 UNION SELECT 476,219 UNION SELECT 477,220 UNION SELECT 478,221 UNION SELECT 484,217 UNION SELECT 485,220 UNION SELECT 486,225 UNION SELECT 487,227 UNION SELECT 489,217 UNION SELECT 491,220 UNION SELECT 492,218 UNION SELECT 496,224 UNION SELECT 497,224 UNION SELECT 500,219 UNION SELECT 501,220 UNION SELECT 502,219 UNION SELECT 502,220 UNION SELECT 503,221 UNION SELECT 504,219 UNION SELECT 505,225 UNION SELECT 506,221 UNION SELECT 506,222 UNION SELECT 507,219 UNION SELECT 511,222 UNION SELECT 7969,224 UNION SELECT 11088,221 UNION SELECT 13905,219 UNION SELECT 18404,218 UNION SELECT 18414,221 UNION SELECT 18433,221 UNION SELECT 18452,224');
	tx.executeSql('INSERT INTO ztl_category_group (id_category,id_group) SELECT 18765 AS id_category, 217 AS id_group UNION SELECT 18768,217 UNION SELECT 18773,217');
}