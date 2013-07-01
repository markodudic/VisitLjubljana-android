//poigledamo ce obstajajo updejti
function update_db() {
	var tmp_query 		= "SELECT last_update FROM ztl_updates WHERE id_language ="+settings.id_lang;
	var tmp_callback	= "check_update_success";
	generate_query(tmp_query, tmp_callback);
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
	        	if (i < 10) {
	        		pois[i] = res.rows.item(i).id;
	        	}
	        }

	        update_poi('http://www.visitljubljana.com/'+lang_code+'/mobile_app/poi.json?datemodified='+results.rows.item(0).last_update, pois);
	        update_event('http://www.visitljubljana.com/'+lang_code+'/mobile_app/event.json?datemodified='+results.rows.item(0).last_update);
	        update_tour('http://www.visitljubljana.com/'+lang_code+'/mobile_app/tour.json'); //?datemodified='+results.rows.item(0).last_update
	    });
	});
}

function update_poi(url, pois) {
	console.log("update DB " +  url);
	url = url+'&pois='+pois.join(",");
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
			handle_poi(data);
		}
	});	        
}

function handle_poi(data) {
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
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_translation;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_pricing;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_timetable;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_category;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_event_event_category;', [], function(tx, res) {});});
			handle_event(data['events']);
		}
	});	
}

var knowntypes = [];
function handle_event(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			console.log(JSON.stringify(data[i]));
			sql = "INSERT INTO ztl_event (id) VALUES ("+data[i].id+")";
			console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			sql = "INSERT INTO ztl_event_translation (id_event, id_language, title, intro, description) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].title)+"', '"+addslashes(data[i].intro)+"', '"+addslashes(data[i].description)+"')";
			console.log(sql);
			tx.executeSql(sql, [], function(tx, res) {});
			
			for(var j = 0; j < data[i].types.length; j++) {
	        	if (knowntypes.indexOf(data[i].types[j].id) == -1) {
	        		knowntypes.push(data[i].types[j].id);
	        		var sql = "INSERT INTO ztl_event_category (id, id_language, name) VALUES ("+data[i].types[j].id+", "+settings.id_lang+", '"+addslashes(data[i].types[j].name)+"')";
	        		tx.executeSql(sql, [], function(tx, res) {});
	        	}
        		var sql = "INSERT INTO ztl_event_event_category (id_event, id_event_category) VALUES ("+data[i].id+", "+data[i].types[j].id+")";
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for(var j = 0; j < data[i].timetable.length; j++) {
				
				if (!$.isNumeric(data[i].timetable[j].venue_id)) {
					data[i].timetable[j].venue_id = 0;
				}
        		var sql = "INSERT INTO ztl_event_timetable (id_event, venue_id, venue, date) VALUES ("+data[i].id+", "+data[i].timetable[j].venue_id+", '"+addslashes(data[i].timetable[j].venue)+"', '"+addslashes(data[i].timetable[j].date)+"')";
        		tx.executeSql(sql, [], function(tx, res) {});
			}
			
			for(var j = 0; j < data[i].pricing.length; j++) {
        		var sql = "INSERT INTO ztl_event_pricing (id_event, id_language, price, ticket_type) VALUES ("+data[i].id+", "+settings.id_lang+", '"+addslashes(data[i].pricing[j].price)+"', '"+addslashes(data[i].pricing[j].ticket_type)+"')";
        		tx.executeSql(sql, [], function(tx, res) {});
			}

		}

		tx.executeSql('select count(*) as cnt from ztl_event;', [], function(tx, res) {
			console.log('+8 >>>>>>>>>> ztl_event res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_translation;', [], function(tx, res) {
			console.log('+9 >>>>>>>>>> ztl_event_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_pricing;', [], function(tx, res) {
			console.log('+10 >>>>>>>>>> ztl_event_pricing res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_timetable;', [], function(tx, res) {
			console.log('+11 >>>>>>>>>> ztl_event_timetable res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_category;', [], function(tx, res) {
			console.log('+12 >>>>>>>>>> ztl_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_event_event_category;', [], function(tx, res) {
			console.log('+13 >>>>>>>>>> ztl_event_event_category res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
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
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_translation;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_chaters;', [], function(tx, res) {});});
			db.transaction(function(tx) {tx.executeSql('delete from ztl_tour_images;', [], function(tx, res) {});});
			handle_tour(data['tours']);
		}
	});
}

function handle_tour(data) {
	db.transaction(function(tx) {
		var sql = "";
		for (var i = 0; i < data.length; i++) {
			sql = "INSERT INTO ztl_tour (id, turisticna_kartica, validity_from, validity_to) VALUES ("+data[i].id+", '"+data[i].turisticna_kartica+"', '"+data[i].validity_from+"', '"+data[i].validity_to+"')";
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
			console.log('+14 >>>>>>>>>> ztl_tour res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_translation;', [], function(tx, res) {
			console.log('+15 >>>>>>>>>> ztl_tour_translation res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_chaters;', [], function(tx, res) {
			console.log('+16 >>>>>>>>>> ztl_tour_chaters res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
		tx.executeSql('select count(*) as cnt from ztl_tour_images;', [], function(tx, res) {
			console.log('+17 >>>>>>>>>> ztl_tour_images res.rows.item(0).cnt: ' + res.rows.item(0).cnt);
		});
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
    			console.log(updt_sql);
				tx.executeSql(updt_sql, [], function(tx, res) {	});	

	        	
	        	//samo nove datoteke
	        	if (knownfiles.indexOf(filename) == -1) {
        			var ft = new FileTransfer();
        			ft.download(url, dlPath, function() {
        				console.log("new local file "+dlPath);
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