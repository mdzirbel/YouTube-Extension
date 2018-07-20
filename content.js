// content.js
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.message === "toggle_playing") {
			var video = document.getElementsByTagName("video")[0];
			if (video.paused) {
				video.play();
			} else {
				video.pause();
			}
    	}
    	else if (request.message === "skip") {
    		var nextButton = document.getElementsByClassName("ytp-next-button")[0]
    		console.log("Next Button: "+nextButton)
    		nextButton.click(); // Clicks on the next video button
    	}
    	else if (request.message === "request_video_data") {
			var video = document.getElementsByTagName("video")[0];
			var duration = video.duration; // Duration of video in minutes
			var currentTime = video.currentTime; // Current playback time on the video in minutes
			sendResponse({"duration": duration, "currentTime": currentTime});
    	}
  	}
);


