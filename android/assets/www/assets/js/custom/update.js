//poigledamo ce obstajajo updejti
function update_db() {
	var tmp_query 		= "SELECT last_update FROM ztl_updates WHERE id_language ="+settings.id_lang;
	var tmp_callback	= "check_update_success";
	generate_query(tmp_query, tmp_callback);
}

var updt_finished = 0;
function is_updt_finished() {
	updt_finished++;
	
	//vsi updejti
	if (updt_finished == 3) {
		var today     = new Date();
		var sql_today = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate()+" "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
		var sql       = "UPDATE ztl_updates SET last_update = '"+sql_today+"' WHERE id_language = "+settings.id_lang;
		db.transaction(function(tx) {tx.executeSql(sql, [], function(tx, res) {});});
	}
}

function check_update_success(results) {
	var lang_code = "en";
	if (settings.id_lang == 1) {
		lang_code = "si";
	} else if (settings.id_lang == 3) {
		lang_code = "fr";
	} else if (settings.id_lang == 4) {
		lang_code = "if";
	} else if (settings.id_lang == 5) {
		lang_code = "de";
	}
	
	var pois = new Array();
	db.transaction(function(tx) {
	    tx.executeSql("select id from ztl_poi;", [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
        		pois[i] = res.rows.item(i).id;
	        }

	        //update_poi('http://www.visitljubljana.com/'+lang_code+'/mobile_app/poi.json?datemodified='+results.rows.item(0).last_update, pois);
	        update_event('http://www.visitljubljana.com/'+lang_code+'/mobile_app/event.json?datemodified='+results.rows.item(0).last_update);
	        update_tour('http://www.visitljubljana.com/'+lang_code+'/mobile_app/tour.json'); //?datemodified='+results.rows.item(0).last_update
	    });
	});
}

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
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			handle_poi(data);
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
			sql = "INSERT OR REPLACE INTO ztl_poi (id, address, post_number, post, phone, email, www, coord_x, coord_y, turisticna_kartica, ljubljana_quality, recommended_map, image, star, sound, record_status, from_db) ";
			sql+= "VALUES ("+data[i].id+", '"+addslashes(data[i].address)+"', "+data[i].postNumber+",'"+addslashes(data[i].post)+"','"+addslashes(data[i].phone)+"', ";
			sql+= "'"+addslashes(data[i].email)+"', '"+addslashes(data[i].www)+"', '"+data[i].coord.x+"', '"+data[i].coord.y+"', '"+addslashes(data[i].turisticna_kartica)+"', '"+addslashes(data[i].ljubljanaQuality)+"', ";
			sql+= "'"+data[i].recommended_map+"', '"+data[i].images+"', '"+data[i].star+"', '"+data[i].sound+"', 1, 0);";
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
		is_updt_finished();
	});		
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
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			//truncate
			/*
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_translation;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_pricing;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_timetable;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_category;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_event_category;', [], function(tx, res) {});});
			*/
			handle_event_deleted(data['deleted']);
			handle_event(data['events']);
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
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			//console.log(JSON.stringify(data[i]));
			sql = "INSERT OR REPLACE INTO ztl_event (id, record_status) VALUES ("+data[i].id+", 1)";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			sql = "INSERT OR REPLACE INTO ztl_event_translation (id_event, id_language, title, intro, description) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', '"+addslashes(data[i].intro)+"', '"+addslashes(data[i].description)+"')";
			//console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			for(var j = 0; j < data[i].types.length; j++) {
        		var sql = "INSERT OR REPLACE INTO ztl_event_category (id, id_language, name) VALUES ("+data[i].types[j].id+", "+settings.id_lang+", '"+addslashes(data[i].types[j].name)+"')";
        		console.log(sql);
        		tx.executeSql(sql, [], function(tx, res) {});

        		var sql = "INSERT OR REPLACE INTO ztl_event_event_category (id_event, id_event_category) VALUES ("+data[i].id+", "+data[i].types[j].id+")";
        		console.log(sql);
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for(var j = 0; j < data[i].timetable.length; j++) {
				if (!$.isNumeric(data[i].timetable[j].venue_id)) {
					data[i].timetable[j].venue_id = 0;
				}
				
				if (!$.isNumeric(data[i].timetable[j].date_last)) {
					data[i].timetable[j].date_last = data[i].timetable[j].date_first;
				}
        		var sql = "INSERT OR REPLACE INTO ztl_event_timetable (id_event, id_language, venue_id, venue, date, date_first, date_last) VALUES ("+data[i].id+", "+settings.id_lang+", "+data[i].timetable[j].venue_id+", '"+addslashes(data[i].timetable[j].venue)+"', '"+addslashes(data[i].timetable[j].date)+"', "+data[i].timetable[j].date_first+", "+data[i].timetable[j].date_last+")";
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for(var j = 0; j < data[i].pricing.length; j++) {
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
		is_updt_finished();
	});	
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
		},
		success : function(data) {
			console.log(" >>>>>>>>>> ok");
			
			//truncate
			/*
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_translation;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_chaters;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_images;', [], function(tx, res) {});});
			*/
			handle_tour_deleted(data['deleted']);
			handle_tour(data['tours']);
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
		for (var i = 0; i < data.length; i++) {
			sql = "INSERT INTO ztl_tour (id, turisticna_kartica, validity_from, validity_to, record_status) VALUES ("+data[i].id+", '"+data[i].turisticna_kartica+"', '"+data[i].validity_from+"', '"+data[i].validity_to+"', 1)";
			tx.executeSql(sql, [], function(tx, res) {});
			sql = "INSERT INTO ztl_tour_translation (id_tour, id_language, title, short_description, long_description) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', '"+addslashes(data[i].short_description)+"', '"+addslashes(data[i].long_description)+"')";
			tx.executeSql(sql, [], function(tx, res) {});
			
			for(var j = 0; j < data[i].chaters.length; j++) {
				sql = "INSERT INTO ztl_tour_chaters (id_tour, id_language, tour_idx, title, content) VALUES ("+data[i].id+", "+settings.id_lang+", "+j+", '"+addslashes(data[i].chaters[j].title)+"', '"+addslashes(data[i].chaters[j].content)+"')";
				tx.executeSql(sql, [], function(tx, res) {});
			}
	
			for(var j = 0; j < data[i].images.length; j++) {
				sql = "INSERT INTO ztl_tour_images (id_tour, tour_idx, image) VALUES ("+data[i].id+", "+j+", '"+data[i].images[j]+"')";
				tx.executeSql(sql, [], function(tx, res) {});
			}
		}
	
		tx.executeSql('select count(*) as cnt from ztl_tour;', [], function(tx, res) {
			console.log('+21 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
			console.log('+22 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
			console.log('+23 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
			console.log('+24 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		is_updt_finished();
	});	
	
	//images
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFSSuccess, null);
}

var knownfiles = [];
var DATADIR;

function onFSSuccess(fileSystem) {
	fileSystem.root.getDirectory("Android/data/com.vigred.ztl",{create:true}, gotDir, onFSError);
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
		console.log("old local file "+entries[i].fullPath);
	}
}

function readFiles() {
	db.transaction(function(tx) {
		tx.executeSql('select * from ztl_tour_images;', [], function(tx, res) {
	        for (var i=0; i<res.rows.length; i++) {
	        	var url      = res.rows.item(i).image;
	        	var filename = url.split("/").slice(-1)[0];

	        	//lokalno ime
    			var dlPath = DATADIR.fullPath+"/"+filename;
    			
				//shranemo novo pot datoteke v bazo, neglede na to ali obstaja ali ne
    			var updt_sql = 'update ztl_tour_images set image = "'+dlPath+'" where id_tour='+res.rows.item(i).id_tour+' and tour_idx='+res.rows.item(i).tour_idx+';';
    			//console.log(updt_sql);
				tx.executeSql(updt_sql, [], function(tx, res) {	});	

	        	
	        	//samo nove datoteke
	        	if (knownfiles.indexOf(filename) == -1) {
        			var ft = new FileTransfer();
        			ft.download(url, dlPath, function() {
        				//console.log("new local file "+dlPath);
        			}, onFSError);
    			}
	        }
	        
	        //validate
	        /*
			tx.executeSql('select * from ztl_tour_images;', [], function(tx, res) {
		        for (var i=0; i<res.rows.length; i++) {
		        	console.log("LOCALIMAGE "+res.rows.item(i).image);
		        }
			});
			*/
		});
	});
}

function onFSError(e) {
	console.log("FSERROR "+JSON.stringify(e));
}

function addslashes(string) {
	string = $.trim(string);
	if (string.length == 0) {
		return string;
	}
	
    return String(string)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
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