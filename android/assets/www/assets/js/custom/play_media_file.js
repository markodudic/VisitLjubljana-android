var current_position = 0;
var tmp_pos = 0;

/*
function  load_media_file(file) {
	console.log("MY MEDIA file"+file);
	my_media = new Media(file, onSuccess, onError);
	console.log("MY MEDIA"+my_media);
	play();

}
*/
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback 
//
function onError(error) {
    console.log('code: '    + error.code    + '\n' + 
          'message: ' + error.message + '\n');
}



function  load_media_file(file) {
	console.log("load media file");
	console.log(file);
	my_media = new Media(file,
        function() {
            console.log("Audio Success");
			play();
        },
            function(err) {
                console.log(err);
        }
    ); 
	
	$("#time-slider").on( 'slidestop', function( event ) { 
		console.log("slider move");
		console.log($("#time-slider").val());
		tmp_pos = $("#time-slider").val();
		
		tmp_pos = parseInt(tmp_pos, 10);

		my_media.seekTo(tmp_pos*1000);
		current_position = tmp_pos;
	});

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
		
		/* dobim duration -- resi drugic
		$("#time-slider").attr('max', my_media.getDuration());
		$("#time-slider").slider("refresh");
		*/

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

	console.log(current_position);

	$("#time-slider").val(current_position);
	$("#time-slider").slider("refresh");
}