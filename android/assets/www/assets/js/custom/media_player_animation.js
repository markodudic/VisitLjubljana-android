var media_timer;
var media_status = 0;

var canvas      = document.getElementById('myCanvas');
var context     = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height / 2;
var radius      = 100;
var endPercent  = 110;
var curPerc     = 0;
var counterClockwise = false;
var circ  = Math.PI * 2;
var quart = Math.PI / 2;

context.lineWidth   = 15;
context.strokeStyle = '#ccc';

/*
context.shadowColor   = '#666';
context.shadowOffsetX = 3;
context.shadowOffsetY = 3;
context.shadowBlur    = 3;
*/

//context.clearRect(0, 0, canvas.width, canvas.height);
context.beginPath();
context.arc(x, y, radius, -(quart), ((circ) * 100) - quart, false);
context.stroke();

/*
context.lineWidth   = 2;
context.strokeStyle = '#222222';
context.arc(x, y, 110, -(quart), ((circ) * 100) - quart, false);
context.stroke();

context.lineWidth   = 2;
context.strokeStyle = '#222222';
context.arc(x, y, 99, -(quart), ((circ) * 100) - quart, false);
context.stroke();
*/


context.lineWidth   = 15;
context.strokeStyle = '#ed1b24';

var current = 0;
function animate() {
  context.beginPath();
  context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
  context.stroke();
  
  curPerc++;


  if (curPerc < endPercent) {
      current = curPerc / 100;
      
      console.log(curPerc);

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
//window.setInterval(function() {animate()}, 1000);

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
}

function media_control_pause() {
	$('.player_control_image').attr('src', 'assets/css/ztl_images/media_player_play_start.png');
	clearTimeout(media_timer);
}

function media_control_stop() {
	current = 0;
	curPerc = 0;
	
	var html = "0:00";
	$(".media_player_time").html(html);
	$('.player_control_image').attr('src', 'assets/css/ztl_images/media_player_play_start.png');

	clearTimeout(media_timer);
	play_voice_guide(trip_id);
}