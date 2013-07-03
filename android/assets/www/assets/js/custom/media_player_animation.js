var current_position = 0;
var tmp_pos 		 = 0;

var media_timer;
var media_status = 0;

var canvas      = document.getElementById('myCanvas');
var context     = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height / 2;
var radius      = 100;
//var endPercent  = 100;
var endPercent  = media_length+1;
var curPerc     = 0;
var counterClockwise = false;
var circ  = Math.PI * 2;
var quart = Math.PI / 2;

context.lineWidth   = 15;
context.strokeStyle = '#ccc';

//context.clearRect(0, 0, canvas.width, canvas.height);
context.beginPath();
context.arc(x, y, radius, -(quart), ((circ) * 100) - quart, false);
context.stroke();

context.lineWidth   = 15;
context.strokeStyle = '#ed1b24';

var media_koef = media_length/100;

var current = 0;

function animate() {
  context.beginPath();
  context.arc(x, y, radius, -(quart), ((circ) * current/media_koef) - quart, false);
  context.stroke();
  
  curPerc++;


  if (curPerc < endPercent) {
      current = curPerc / 100;
      update_time();
  }
}

function update_time() {
	var player_position = seconds_to_time(current*100);

	var sec = player_position.s;
	if (sec < 10) {
		sec = "0"+sec;
	}
	
	var html = player_position.m+":"+sec;
	
	$(".media_player_time").html(html);
}

function seconds_to_time(secs){
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}

function media_control_toggle() {
	if (media_status == 0) {
		media_status = 1;
		media_control_start();
	} else {
		media_status = 0;
		media_control_pause();
	} 
} 


function media_control_start() { 
	$('.player_control_image').attr('src', 'assets/css/ztl_images/media_player_play_pause.png');
	media_timer = window.setInterval(function() {animate()}, 1000);
	play();
}

function media_control_pause() {
	$('.player_control_image').attr('src', 'assets/css/ztl_images/media_player_play_start.png');
	clearTimeout(media_timer);
	pause();
}

function media_control_stop() {
	pause();
	current_position = 0;
	tmp_pos 		 = 0;

	current = 0;
	curPerc = 0;
	
	var html = "0:00";
	$(".media_player_time").html(html);
	$('.player_control_image').attr('src', 'assets/css/ztl_images/media_player_play_start.png');

	clearTimeout(media_timer);
	play_voice_guide(trip_id);
}

function  load_media_file(file) {
	my_media = new Media(file,
        function() {
            console.log("Audio Success");
        },
            function(err) {
                console.log(err);
        }
    ); 
}

function play() {
	if (my_media != null) {
		
		if (current_position > 0) {
			my_media.seekTo(current_position*1000);
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

function pause() {
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
}