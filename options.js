
window.addEventListener('load', function load(event){
    document.getElementById('saveColor').addEventListener('click', function() { saveOptions(); });
})
window.addEventListener('load', function load(event){
    document.getElementById('restoreDefault').addEventListener('click', function() { restoreDefault(); });
})

// NOTE: Color is saved as 6 digit hex (without the #)

function saveOptions() {
	// Get Input:
	var newColor = document.getElementById("color").value

	// Remove # if it starts with one
	newColor = newColor.replace("#", "")

	if (isRGB(newColor)) {
		handleRGB(newColor)
	}
	else {
		handleHex(newColor)
	}
}

function isRGB(newColor) {
	return newColor.indexOf(",") !== -1
}

function handleRGB(newColor) {
	// Sanitize Input:
	newColor = newColor.replace("rgb", "").replace("(", "").replace(")", "").replace(/\s/g,'')
	newColor = newColor.split(",")
	// Check if valid and handle:
	if (isValidRGB(newColor)) {
		newColor = RGBtoHex(newColor)
		// alert("37 -"+newColor+"-")
		localStorage["textColor"] = newColor
		alert("Give me a hex number, I said. I didn't say an RGB number, did I?\nI didn't say I wanted to handle RGB.\nI didn't say I COULD handle RGB.\nBut you're too good for instructions, huh?\nThat's OK. I was made for assholes like you.\nI can hande RGB.\n\nColor saved successfully, Asshole.")
	}
	else {
		alert("An error occured while trying to save. Recheck hex code and try again")
	}
}

function handleHex(newColor) {
	// Sanitize Input:
	newColor = newColor.toUpperCase().trim() // Make it all uppercase and remove whitespace
	
	// Check if valid and handle:
	if (isValidHex(newColor)) {
		localStorage["textColor"] = newColor;
		alert("Color saved successfully")
	}
	else {
		alert("An error occured while trying to save. Recheck hex code and try again")
	}
}

function isValidHex(input) {
	if (input.length !== 6) {
		return false
	}
	if (!/^[0-9A-F]{6}$/i.test(input)) { 
		return false
	}
	return true
}

function isValidRGB(input) {
	if (input.length !== 3) {
		return false
	}
	// Check if everything in the array is a number between 0 and 255
	try { // If something doesn't parse as a number it's not valid RGB
		for (var i=0; i<3; i++) {
			var num = parseInt(input[i], 10)
			if (num < 0 || num > 255) {
				return false
			}
		}
	}
	catch(e) {
		return false
	}
	return true
}

function RGBtoHex(color) {
	return rgb2hex(color[0], color[1], color[2])
}

function rgb2hex(red, green, blue) {
    var rgb = blue | (green << 8) | (red << 16);
    return (0x1000000 + rgb).toString(16).slice(1)
}

function restoreDefault() {
	localStorage.removeItem("textColor");
}