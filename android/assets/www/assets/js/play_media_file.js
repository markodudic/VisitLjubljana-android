function  play_file(file) {
	console.log(file);
	my_media = new Media(file,
        function() {
            alert("playAudio():Audio Success");
        },
            function(err) {
                alert(err);
        }
        );
      my_media.play();
}