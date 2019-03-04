// background.js

var doubleClickTime = 500 // Time (ms) within which two clicks count as a double click
lastTimeClicked = (new Date()).getTime() // Keep track for double clicks

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// Send a message to the active tab
	chrome.tabs.query({url: '*://www.youtube.com/watch?v*'}, function(tabs) { // Gets all tabs with youtube playing a video
		var firstYouTube = tabs[0]; // If there are multiple tabs with youtube playing videos just take the first one
		var timeSinceLastClicked = (new Date()).getTime() - lastTimeClicked
		if (timeSinceLastClicked <= doubleClickTime) { // If you clicked in a short enough time to count it as a double click
			chrome.tabs.sendMessage(firstYouTube.id, {"message": "skip"}) // Sends a message to content.js to skip to the next video
		}
		else {
			chrome.tabs.sendMessage(firstYouTube.id, {"message": "toggle_playing"})
		}
		lastTimeClicked = (new Date()).getTime() // Keep track for double clicks
	});
});

setInterval( function(){ // every two seconds ask the youtube tab for time information

    chrome.tabs.query({url: '*://www.youtube.com/watch?v*'}, function(tabs) {
    	if (tabs.length >= 1) {
	    	var firstYouTube = tabs[0]
	    	chrome.tabs.sendMessage(firstYouTube.id, {"message": "request_video_data"}, function(response) {
	    		if (!(response === undefined)) {
					updateIcon(response.duration, response.currentTime)
				}
			});
	    }
	    else {
	    	updateIcon("--", "--")
	    }
    })
}, 2000)

function formatTime(time, allowZero=true) {
	if (typeof time == "string") { // If you want some sort of default string like "--" keep it the same
		return time
	}
	time = time / 60 // Convert to minutes
	time = Math.floor(time) // Trunicate
	// If the total time is less than a minute this will keep it at 1 so you don't get 0/0 for time
	if (!allowZero && time == 0) {
		time = 1
	}
	// If the time is over an hour, this puts it into hr:min form then returns it
	if (time > 60) {
		var hours = "" + Math.floor(time / 60);
		time = "" + (time % 60)
		return hours + ":" + time
	}
	return time
}

// Makes a canvas with the correct times for the icon and sets it as the extension icon
function updateIcon(duration, currentTime) {

	duration = formatTime(duration, false)
	currentTime = formatTime(currentTime)

	var height = 32
	var width = 32

	var c = document.createElement("canvas")
	c.height = height
	c.width = width

	var newIcon = c.getContext("2d")
	newIcon.font = "15px Arial"
	newIcon.textAlign = "center"
	newIcon.fillStyle = "#" + getTextColor() // "rgb(180,0,0)"

	newIcon.fillText(currentTime, width/2, 12)
	newIcon.fillText(duration, width/2, 31)

	// Draw horizontal line
	newIcon.beginPath()
	newIcon.lineWidth = 0
	newIcon.strokeStyle = "#" + getTextColor() // "rgb(100,0,0)"; //
	newIcon.moveTo(0, height/2)
	newIcon.lineTo(width, height/2)
	newIcon.stroke()

	chrome.browserAction.setIcon({imageData: newIcon.getImageData(0, 0, width, height)})

}

function getTextColor() {
	var defaultColor = "640000"  // rgb(100,0,0)
	try {
		if (localStorage["textColor"] != NaN && localStorage["textColor"] != undefined) {
			console.log(localStorage["textColor"])
			return localStorage["textColor"]
		}
	}
	catch (e) {
	}
	return defaultColor
}
