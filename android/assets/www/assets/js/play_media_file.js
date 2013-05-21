var current_position = 0;
var tmp_pos = 0;

function  load_media_file(file) {
	console.log(file);
	my_media = new Media(file,
        function() {
            alert("Audio Success");
			
        },
            function(err) {
                alert(err);
        }
    ); 
	
	play();
}

function play() {
	console.log(media_timer);
	console.log(my_media.getDuration());
	console.log('position '+current_position);
	if (my_media != null) {
		
		if (current_position > 0) {
			console.log("seek "+current_position*1000);
			my_media.seekTo(current_position*1000);
			console.log(my_media);
		}
		
		my_media.play();
		
		if (media_timer == null) {
			media_timer = setInterval(function() {
				// get my_media position
				my_media.getCurrentPosition(
					// success callback
					function(position) {
						if (position > -1) {
							setAudioPosition((position));
						}
					},
					// error callback
					function(e) {
						console.log("Error getting pos=" + e);
						setAudioPosition("Error: " + e);
					}
				);
			}, 1000);
		}
	} else {
		play_location_sound();
	}
}

function stop() {
	if (my_media != null) {
		my_media.pause();
		setAudioPosition(0);
		my_media.seekTo(0);
		
		current_position  = 0;
	} else {
		play_location_sound();
	}
}

function pause() {
	console.log('position '+current_position);
	if (my_media != null) {
		my_media.pause();
	} else {
		play_location_sound();
	}
}

function setAudioPosition(position) {
	if (tmp_pos != position) {
		tmp_pos = position;
		current_position = current_position+1;
	}

	$("#time-slider").val(current_position);
	$("#time-slider").slider("refresh");
}