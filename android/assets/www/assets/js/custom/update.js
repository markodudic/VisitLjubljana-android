//poigledamo ce obstajajo updejti
function update_db() {
	var tmp_query 		= "SELECT last_update FROM ztl_updates WHERE id_language ="+settings.id_lang;
	var tmp_callback	= "check_update_success";
	generate_query(tmp_query, tmp_callback);
	//update_audio();
}

var updt_finished = 0;
var updt_running  = 0;
function is_updt_finished() {
	updt_finished++;
	//vsi updejti
	if (updt_finished == UPDATE_GROUPS) {

	    //all images
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);
		
		var today     = new Date();
		var sql_today = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
		var sql       = "UPDATE ztl_updates SET last_update = '"+sql_today+"' WHERE id_language = "+settings.id_lang;
		db.transaction(function(tx) {tx.executeSql(sql, [], function(tx, res) {});});
		
		updt_finished = 0;
		updt_running  = 0;
		spinner.stop();
		alert(synronization_finished_translation[settings.id_lang]);
		edit_settings();		
	}
}

function check_update_success(results) {
	if (updt_running  == 1) {
		return;
	}
	updt_running  = 1;
	
	console.log("**********update**************"+localStorage.getItem('first_synhronization'));
	show_spinner();
	var lang_code = "en";
	if (settings.id_lang == 1) {
		lang_code = "si";
	} else if (settings.id_lang == 3) {
		lang_code = "de";
	} else if (settings.id_lang == 4) {
		lang_code = "it";
	} else if (settings.id_lang == 5) {
		lang_code = "fr";
	}
	
	//updatam poi-je
	var pois = new Array();
	db.transaction(function(tx) {
	    tx.executeSql("select id from ztl_poi;", [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
        		pois[i] = res.rows.item(i).id;
	        }
	        update_poi(server_url+lang_code+'/mobile_app/poi.json?datemodified='+results.rows.item(0).last_update, pois);
	    });
	});
		        
	//updatam dogodke. prvic vse
	if (localStorage.getItem('first_synhronization') == 0) {
		update_event(server_url+lang_code+'/mobile_app/event.json');
    	update_tour(server_url+lang_code+'/mobile_app/tour.json');
    	localStorage.setItem('first_synhronization', 1);
	} else {
		//pol pa samo od datuma
		var events = new Array();
		db.transaction(function(tx) {
			tx.executeSql("select id from ztl_event;", [], function(tx, res) {
				for (var i=0; i<res.rows.length; i++) {
					events[i] = res.rows.item(i).id;
				}
				update_event_deleted(server_url+lang_code+'/mobile_app/event.json?datemodified='+results.rows.item(0).last_update, events);
			});
		});
    
		//updatam ogled. 
	    var tours = new Array();
		db.transaction(function(tx) {
		    tx.executeSql("select id from ztl_tour;", [], function(tx, res) {
		        for (var i=0; i<res.rows.length; i++) {
		        	tours[i] = res.rows.item(i).id;
		        }
		        update_tour_deleted(server_url+lang_code+'/mobile_app/tour.json?datemodified='+results.rows.item(0).last_update, tours); 
		    });
		});
	}
	
	//updatam info. vedno vse
    update_info(server_url+lang_code+'/mobile_app/info.json');
    update_inspired(server_url+lang_code+'/mobile_app/inspired.json');
}

/*********************** POI ***********************/

function update_poi(url, pois) {
	url = url+'&pois='+pois.join(",");
	console.log("update DB " +  url);
	$.ajax( {
		url : url,
		//type: "POST",
		//data: {pois: pois.join(",")},
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
			is_updt_finished();
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			handle_poi(data);
		    load_pois(215, 7, 1);
		    load_pois(217, 3, 1);
		    load_pois(219, 4, 1);
		    load_pois(220, 9, 1);
		    load_pois(222, 8, 1);
		    load_voice_guide(0);
		    set_cache();
		    console.log("XXX >>> poi");
			is_updt_finished();
		}
	});	        
}

function handle_poi(data) {
	handle_poi_deleted(data['deleted']);
	handle_poi_groups(data['groups']);
	handle_poi_categories(data['categories']);
	handle_poi_new(data['pois']);
}

function handle_poi_deleted(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			sql = "UPDATE ztl_poi SET record_status = 0 WHERE id = "+data[i];
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
		}
	});
}

function handle_poi_groups(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			sql = "INSERT OR REPLACE INTO ztl_group (id, id_language, title, record_status) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', 1)";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
		}
	});
}

function handle_poi_categories(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			sql = "INSERT OR REPLACE INTO ztl_category (id, id_language, title, record_status) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', 1)";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			//dolocene kategorije niso v nobeni grupi
			if (data[i].groups != null) {
				for (var j = 0; j < data[i].groups.length; j++) {
					sql = "INSERT OR REPLACE INTO ztl_category_group (id_category, id_group) VALUES ("+data[i].id+", "+data[i].groups[j]+")";
					//console.log(sql);
					tx.executeSql(sql, [], function(tx, res) {});
				}
			}
		}
	});
}

function handle_poi_new(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {

			if (data[i].image == null) {
				data[i].image = '';
			}
			
			if (data[i].star == null) {
				data[i].star = 0;
			}
			
			if (data[i].sound == null) {
				data[i].sound = '';
			}
			
			sql = "INSERT OR REPLACE INTO ztl_poi (id, address, post_number, post, phone, email, www, coord_x, coord_y, turisticna_kartica, ljubljana_quality, recommended_map, image, star, sound, record_status, from_db) ";
			sql+= "VALUES ("+data[i].id+", '"+addslashes(data[i].address)+"', '"+data[i].postNumber+"','"+addslashes(data[i].post)+"','"+addslashes(data[i].phone)+"', ";
			sql+= "'"+addslashes(data[i].email)+"', '"+addslashes(data[i].www)+"', '"+data[i].coord.x+"', '"+data[i].coord.y+"', '"+addslashes(data[i].turisticna_kartica)+"', '"+addslashes(data[i].ljubljanaQuality)+"', ";
			sql+= "'"+data[i].recommended_map+"', '"+data[i].image+"', '"+data[i].star+"', '"+data[i].sound+"', 1, 0);";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			sql = "INSERT OR REPLACE INTO ztl_poi_translation (id_poi, id_language, title, description) ";
			sql+= "VALUES ("+data[i].id+",  "+settings.id_lang+", '"+addslashes(data[i].title)+"', '"+addslashes(data[i].description)+"');";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			if (data[i].cats != null) {
				for (var j = 0; j < data[i].cats.length; j++) {
					sql = "INSERT OR REPLACE INTO ztl_poi_category (id_poi, id_category) VALUES ("+data[i].id+", "+data[i].cats[j]+")";
					//console.log(sql);
					tx.executeSql(sql, [], function(tx, res) {});
				}
			}
		}
		
		tx.executeSql('select count(*) as cnt from ztl_category;', [], function(tx, res) {
			console.log('+1 >>>>>>>>>> ztl_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});

		tx.executeSql('select count(*) as cnt from ztl_group;', [], function(tx, res) {
			console.log('+2 >>>>>>>>>> ztl_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});

		tx.executeSql('select count(*) as cnt from ztl_category_group;', [], function(tx, res) {
			console.log('+3 >>>>>>>>>> ztl_category_group res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});

		tx.executeSql('select count(*) as cnt from ztl_poi;', [], function(tx, res) {
			console.log('+4 >>>>>>>>>> ztl_poi res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});

		tx.executeSql('select count(*) as cnt from ztl_poi_category;', [], function(tx, res) {
			console.log('+5 >>>>>>>>>> ztl_poi_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});

		tx.executeSql('select count(*) as cnt from ztl_poi_translation;', [], function(tx, res) {
			console.log('+6 >>>>>>>>>> ztl_poi_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
	});		
}

/*********************** EVENT ***********************/

function update_event_deleted(url, events) {
	url = url+'&pois='+events.join(",");
	update_event(url);
}
	
function update_event(url) {
	console.log("update DB " +  url);	
	$.ajax( {
		url : url,
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
			is_updt_finished();
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			handle_event_deleted(data['deleted']);
			handle_event(data['events']);
		    load_events(0);
		    set_cache();
		    console.log("XXX >>> events");
			is_updt_finished();
		}
	});	
}

function handle_event_deleted(data) {
	db.transaction(function(tx) {
		var sql = "";
		if (data != null) {
			for (var i = 0; i < data.length; i++) {
				sql = "UPDATE ztl_event SET record_status = 0 WHERE id = "+data[i];
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
	});
}

function handle_event(data) {
	db.transaction(function(tx) {
		var sql 		= "";
		for (var i = 0; i < data.length; i++) {
			if (data[i].image == null) {
				 data[i].image = "";
			}

			//console.log(JSON.stringify(data[i]));
			sql = "INSERT OR REPLACE INTO ztl_event (id, image, featured, record_status) VALUES ("+data[i].id+", '"+data[i].image+"', '"+data[i].featured+"', 1)";		
			tx.executeSql(sql, [], function(tx, res) {});
			sql = "INSERT OR REPLACE INTO ztl_event_translation (id_event, id_language, title, intro, description) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', '"+addslashes(data[i].intro)+"', '"+addslashes(data[i].description)+"')";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			for (var j = 0; j < data[i].types.length; j++) {
        		var sql = "INSERT OR REPLACE INTO ztl_event_category (id, id_language, name) VALUES ("+data[i].types[j].id+", "+settings.id_lang+", '"+addslashes(data[i].types[j].name)+"')";
        		//console.log(sql);
        		tx.executeSql(sql, [], function(tx, res) {});

        		var sql = "INSERT OR REPLACE INTO ztl_event_event_category (id_event, id_event_category) VALUES ("+data[i].id+", "+data[i].types[j].id+")";
        		//console.log(sql);
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for (var j = 0; j < data[i].timetable.length; j++) {
				if (!$.isNumeric(data[i].timetable[j].venue_id)) {
					data[i].timetable[j].venue_id = 0;
				}
				
				if (!$.isNumeric(data[i].timetable[j].date_last)) {
					data[i].timetable[j].date_last = data[i].timetable[j].date_first;
				}
        		var sql = "INSERT OR REPLACE INTO ztl_event_timetable (id_event, id_language, timetable_idx, venue_id, venue, date, date_first, date_last) VALUES ("+data[i].id+", "+settings.id_lang+", "+j+", "+data[i].timetable[j].venue_id+", '"+addslashes(data[i].timetable[j].venue)+"', '"+addslashes(data[i].timetable[j].date)+"', "+data[i].timetable[j].date_first+", "+data[i].timetable[j].date_last+")";
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for (var j = 0; j < data[i].pricing.length; j++) {
        		var sql = "INSERT OR REPLACE INTO ztl_event_pricing (id_event, id_language, price, ticket_type) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].pricing[j].price)+"', '"+addslashes(data[i].pricing[j].ticket_type)+"')";
        		tx.executeSql(sql, [], function(tx, res) {});
			}

		}

		tx.executeSql('select count(*) as cnt from ztl_event;', [], function(tx, res) {
			console.log('+11 >>>>>>>>>> ztl_event res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_translation;', [], function(tx, res) {
			console.log('+12 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_pricing;', [], function(tx, res) {
			console.log('+13 >>>>>>>>>> ztl_event_pricing res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_timetable;', [], function(tx, res) {
			console.log('+14 >>>>>>>>>> ztl_event_timetable res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_category;', [], function(tx, res) {
			console.log('+15 >>>>>>>>>> ztl_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_event_category;', [], function(tx, res) {
			console.log('+16 >>>>>>>>>> ztl_event_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
	});	
}

/*********************** TOUR ***********************/

function update_tour_deleted(url, tours) {
	url = url+'&pois='+tours.join(",");
	update_tour(url)
}

function update_tour(url) {
	console.log("update DB " +  url);
	$.ajax( {
		url : url,
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
			is_updt_finished();
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			handle_tour_deleted(data['deleted']);
			handle_tour(data['tours']);
			load_tour_list(0);	
		    set_cache();
		    console.log("XXX >>> tours");
			is_updt_finished();
		}
	});
}

function handle_tour_deleted(data) {
	db.transaction(function(tx) {
		var sql = "";
		if (data != null) {
			for (var i = 0; i < data.length; i++) {
				sql = "UPDATE ztl_tour SET record_status = 0 WHERE id = "+data[i];
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
	});
}

function handle_tour(data) {
	db.transaction(function(tx) {
		var sql = "";

		//h inddex !
		for (var h = 0; h < data.length; h++) {
			sql = "INSERT INTO ztl_tour_category (id,id_language,title,record_status) VALUES ("+h+", "+settings.id_lang+", '"+addslashes(data[h].title)+"', 1);";
			tx.executeSql(sql, [], function(tx, res) {});
			
			for (var i = 0; i<data[h].objects.length; i++) {
				sql = "INSERT INTO ztl_tour_tour_category (id_tour, id_tour_category) VALUES ("+data[h].objects[i].id+","+h+")";
				tx.executeSql(sql, [], function(tx, res) {});
				
				sql = "INSERT INTO ztl_tour (id, turisticna_kartica, validity_from, validity_to, record_status) VALUES ("+data[h].objects[i].id+", '"+data[h].objects[i].turisticna_kartica+"', '"+data[h].objects[i].validity_from+"', '"+data[h].objects[i].validity_to+"', 1)";
				tx.executeSql(sql, [], function(tx, res) {});
				
				sql = "INSERT INTO ztl_tour_translation (id_tour, id_language, title, short_description, long_description) VALUES ("+data[h].objects[i].id+", "+settings.id_lang+", '"+addslashes(data[h].objects[i].title)+"', '"+addslashes(data[h].objects[i].short_description)+"', '"+addslashes(data[h].objects[i].long_description)+"')";
				tx.executeSql(sql, [], function(tx, res) {});
				
				for (var j = 0; j < data[h].objects[i].chaters.length; j++) {
					sql = "INSERT INTO ztl_tour_chaters (id_tour, id_language, tour_idx, title, content) VALUES ("+data[h].objects[i].id+", "+settings.id_lang+", "+j+", '"+addslashes(data[h].objects[i].chaters[j].title)+"', '"+addslashes(data[h].objects[i].chaters[j].content)+"')";
					tx.executeSql(sql, [], function(tx, res) {});
				}
		
				//for (var j = 0; j < data[i].images.length; j++) {
					sql = "INSERT INTO ztl_tour_images (id_tour, tour_idx, image) VALUES ("+data[h].objects[i].id+", "+j+", '"+data[h].objects[i].image+"')";
					tx.executeSql(sql, [], function(tx, res) {});
				//}
			}
		}
	
		tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
			console.log('+21 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_category;', [], function(tx, res) {
			console.log('+22 >>>>>>>>>> ztl_tour_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_tour_category;', [], function(tx, res) {
			console.log('+23 >>>>>>>>>> ztl_tour_tour_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
			console.log('+24 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
			console.log('+25 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
			console.log('+26 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
	});	
}

/*********************** INSPIRED ***********************/

function update_inspired(url) {
	console.log("update DB " +  url);
	$.ajax( {
		url : url,
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
			is_updt_finished();
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			
			//truncate
			db.transaction(function(tx) {tx.executeSql('delete from ztl_inspired;', [], function(tx, res) {});});
			//handle_inspired_deleted(data['deleted']);
			handle_inspired(data['getInspired']);
		    load_inspired(0);
		    set_cache();
		    console.log("XXX >>> inspired");
			is_updt_finished();
		}
	});
}

function handle_inspired_deleted(data) {
	db.transaction(function(tx) {
		var sql = "";
		if (data != null) {
			for (var i = 0; i < data.length; i++) {
				sql = "UPDATE ztl_inspired SET record_status = 0 WHERE id = "+data[i];
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
	});
}

function handle_inspired(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			if (data[i].image == null) {
				 data[i].image = "";
			}
			
			sql = "INSERT INTO ztl_inspired (id, image, cnt, record_status) VALUES ("+data[i].id+", '"+data[i].image+"', "+data[i].refs.length+",1)";
			tx.executeSql(sql, [], function(tx, res) {});
			
			sql = "INSERT INTO ztl_inspired_translation (id_inspired, id_language, title, desc) VALUES ("+data[i].id+", "+settings.id_lang+",'"+addslashes(data[i].title)+"','"+addslashes(data[i].desc)+"')";
			tx.executeSql(sql, [], function(tx, res) {});
			
			for (var j = 0; j<data[i].refs.length; j++) {
				sql  = "INSERT INTO ztl_inspired_category (id_inspired, id_language, category_idx, ref_object, ref_object_date_type, ref_object_start, ref_object_end, ref_object_type, title) ";
				sql += "VALUES ("+data[i].id+", "+settings.id_lang+", "+j+", "+data[i].refs[j].ref_object+", "+data[i].refs[j].ref_object_date_type+", '"+addslashes(data[i].refs[j].ref_object_start)+"', '"+addslashes(data[i].refs[j].ref_object_end)+"', "+data[i].refs[j].ref_object_type+", '"+addslashes(data[i].refs[j].title)+"')";
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
		
		tx.executeSql('select count(*) as cnt from ztl_inspired;', [], function(tx, res) {
			console.log('+31 >>>>>>>>>> ztl_inspired res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_inspired_translation;', [], function(tx, res) {
			console.log('+32 >>>>>>>>>> ztl_inspired_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_inspired_category;', [], function(tx, res) {
			console.log('+33 >>>>>>>>>> ztl_inspired_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
	});
}

/*********************** INFO ***********************/

function update_info(url) {
	console.log("update DB " +  url);
	$.ajax( {
		url : url,
		dataType : 'json',
		beforeSend : function(xhr) {
	          xhr.setRequestHeader("Authorization", "Basic RWlqdTN6YW86dXRoMWplaUY=");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			//napaka
			console.log(" >>>>>>>>>> failed "+url);
			console.log(JSON.stringify(thrownError));
			is_updt_finished();
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			
			//truncate
			db.transaction(function(tx) {tx.executeSql('delete from ztl_info;', [], function(tx, res) {});});
			//handle_info_deleted(data['deleted']);
			handle_info(data['info']);
		    load_info(0);
		    set_cache();
		    console.log("XXX >>> info");
			is_updt_finished();
		}
	});
}

function handle_info_deleted(data) {
	db.transaction(function(tx) {
		var sql = "";
		if (data != null) {
			for (var i = 0; i < data.length; i++) {
				sql = "UPDATE ztl_info SET record_status = 0 WHERE id = "+data[i];
				//console.log(sql);
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
	});
}

function handle_info(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			sql = "INSERT INTO ztl_info (id, id_language, title, image, content, record_status) VALUES ("+data[i].objects[0].id+", "+settings.id_lang+", '"+addslashes(data[i].objects[0].title)+"', '"+data[i].objects[0].image+"', '"+addslashes(data[i].objects[0].content)+"', 1)";
			tx.executeSql(sql, [], function(tx, res) {});
		}
		
		tx.executeSql('select count(*) as cnt from ztl_info;', [], function(tx, res) {
			console.log('+41 >>>>>>>>>> ztl_info res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
	});	
}

/*********************** IMAGES ***********************/

var knownfiles = [];
var DATADIR;

function onFSSuccess(fileSystem) {
	fileSystem.root.getDirectory("Android/data/com.innovatif.ztl",{create:true}, gotDir, onFSError);
}

function gotDir(d) {
	DATADIR = d;
	var reader = DATADIR.createReader();
	reader.readEntries(function(d) {
		gotFiles(d);
		readFiles();
	}, onFSError);
}

function gotFiles(entries) {
	for (var i=0; i<entries.length; i++) {
		knownfiles.push(entries[i].name);
	}
}

function readFiles() {
	db.transaction(function(tx) {
		tx.executeSql('select * from ztl_tour_images;', [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
	        	var url      = res.rows.item(i).image;
	        	var filename = url.split("/").slice(-1)[0];
	        	filename = $.trim(filename);
    			
	        	//filename ni prazen && ni na lokalnem FS && se zacne s http
	        	if (filename != "" && url.indexOf(DATADIR.fullPath) != 0 && url.indexOf("http") == 0) {
	    			var dlPath = DATADIR.fullPath+"/"+filename;
    				var updt_sql0 = 'update ztl_tour_images set image = "'+dlPath+'" where id_tour='+res.rows.item(i).id_tour+' and tour_idx='+res.rows.item(i).tour_idx+';';
					tx.executeSql(updt_sql0, [], function(tx, res) {});	
				}

	        	if (knownfiles.indexOf(filename) == -1) {
        			var ft = new FileTransfer();
        			ft.download(url, dlPath, function() {
        				console.log("==== new local file ztl_tour_images "+dlPath);
        			}, onFSError);
    			}
	        }
		});


		tx.executeSql('select * from ztl_event where image != ""', [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
	        	var url      = res.rows.item(i).image;
	        	var filename = url.split("/").slice(-1)[0];
	        	filename = $.trim(filename);

	        	//filename ni prazen && ni na lokalnem FS && se zacne s http
	        	if (filename != "" && url.indexOf(DATADIR.fullPath) != 0 && url.indexOf("http") == 0) {
	    			var dlPath = DATADIR.fullPath+"/"+filename;
	    			var updt_sql1 = 'update ztl_event set image = "'+dlPath+'" where id='+res.rows.item(i).id+';';
					tx.executeSql(updt_sql1, [], function(tx, res) {});	
					
		        	if (knownfiles.indexOf(filename) == -1) {
	        			var ft = new FileTransfer();
	        			ft.download(url, dlPath, function() {
	        				console.log("==== new local file ztl_event "+dlPath);
	        			}, onFSError);
	    			}
    			}
	        }
		});

		tx.executeSql('select * from ztl_inspired where image != ""', [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
	        	var url      = res.rows.item(i).image;
	        	var filename = url.split("/").slice(-1)[0];
	        	filename = $.trim(filename);

	        	//filename ni prazen && ni na lokalnem FS && se zacne s http
	        	if (filename != "" && url.indexOf(DATADIR.fullPath) != 0 && url.indexOf("http") == 0) {
	    			var dlPath = DATADIR.fullPath+"/"+filename;
	    			var updt_sql2 = 'update ztl_inspired set image = "'+dlPath+'" where id='+res.rows.item(i).id+';';
					tx.executeSql(updt_sql2, [], function(tx, res) {});	
					
		        	if (knownfiles.indexOf(filename) == -1) {
	        			var ft = new FileTransfer();
	        			ft.download(url, dlPath, function() {
	        				console.log("==== new local file ztl_inspired "+dlPath);
	        			}, onFSError);
	    			}
    			}
	        }
		});
		
		tx.executeSql('select * from ztl_info where image != ""', [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
	        	var url      = res.rows.item(i).image;
	        	var filename = url.split("/").slice(-1)[0];
	        	filename = $.trim(filename);

	        	//filename ni prazen && ni na lokalnem FS && se zacne s http
	        	if (filename != "" && url.indexOf(DATADIR.fullPath) != 0 && url.indexOf("http") == 0) {
	    			var dlPath = DATADIR.fullPath+"/"+filename;
	    			var updt_sql3 = 'update ztl_info set image = "'+dlPath+'" where id='+res.rows.item(i).id+';';
					tx.executeSql(updt_sql3, [], function(tx, res) {});	
					
		        	if (knownfiles.indexOf(filename) == -1) {
	        			var ft = new FileTransfer();
	        			ft.download(url, dlPath, function() {
	        				console.log("==== new local file ztl_info "+dlPath);
	        			}, onFSError);
	    			}
    			}
	        }
		});
	});
}

/*********************** AUDIO ***********************/

function update_audio() {
	//audio
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccessAudio, null);
}

var knownfiles_audio = [];
var DATADIR_audio;

function onFSSuccessAudio(fileSystem) {
	fileSystem.root.getDirectory("Android/data/com.innovatif.ztl/audio",{create:true}, gotDirAudio, onFSError);
}

function gotDirAudio(d) {
	DATADIR_audio = d;
	var reader = DATADIR_audio.createReader();
	reader.readEntries(function(d) {
		gotFilesAudio(d);
		readFilesAudio();
	}, onFSError);
}

function gotFilesAudio(entries) {
	for (var i=0; i<entries.length; i++) {
		knownfiles_audio.push(entries[i].name);
	}
}

function readFilesAudio() {
	for (var i = 0; i < trips[VOICE_GROUP]['items'].length; i++) {
		var filename  = trips[VOICE_GROUP]['items'][i]['sound'];
		var filearray = filename.split("_");
    	var url       = "http://www.visitljubljana.com/file/"+filearray[0]+"/"+filearray[1]+filearray[2];

    	//lokalno ime
		var dlPath = DATADIR_audio.fullPath+"/"+filename;
		
    	//samo nove datoteke
    	if (knownfiles_audio.indexOf(filename) == -1) {
			var ft = new FileTransfer();
			ft.download(url, dlPath, function() {
				console.log("new local file audio "+dlPath);
			}, onFSError);
		}
	}
}

/*********************** UTILS ***********************/ 

function onFSError(e) {
	console.log("FSERROR "+JSON.stringify(e));
}

function addslashes(string) {
	string = $.trim(string);
	if (string.length == 0) {
		return string;
	}
	return escape(string);
    /*return String(string)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&quot;');*/
}


function has_tours() {
	db.transaction(function(tx) {
		tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
			if (res.rows.item(0).cnt > 0) {
				return true;
			}
		});
	});
	return false;
}

function has_events() {
	db.transaction(function(tx) {
		tx.executeSql('select count(*) as cnt from ztl_event;', [], function(tx, res) {
			if (res.rows.item(0).cnt > 0) {
				return true;
			}
		});
	});
	return false;	
}