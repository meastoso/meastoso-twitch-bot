/**
 * TODO: describe this module
 */

var chatOverlayDAO = require('../chat_overlay/chat_overlay_DAO.js');
var overlayConfig = chatOverlayDAO.getConfig();
var hueModule = require("node-hue-api");
var HueApi = hueModule.HueApi;
var lightState = hueModule.lightState;
var username = overlayConfig.twitch.channelName;
var host;
var api;

// office lights are: 7, 9 and 10

var displayResult = function(result) {
	console.log(JSON.stringify(result));
};

// get bridges and set host/api from bridge result
hueModule.nupnpSearch(function(err, result) {
    if (err) throw err;
    host = result[0].ipaddress;
    api = new HueApi(host, username);
});

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//var state = lightState.create().on().white(500, 100);
//var state = lightState.create().colorLoop().transitionFast();
//var state = lightState.create().rgb(254, 0, 0);
//var state = lightState.create().rgb(0, 254, 0);
//var state = lightState.create().rgb(0, 0, 254);
//var state = lightState.create().longAlert();
//var state = lightState.create().effect('none');
var redState = lightState.create().rgb(255, 0, 0);
var yellowState = lightState.create().rgb(255, 255, 0);
var greenState = lightState.create().rgb(0, 255, 0);
var cyanState = lightState.create().rgb(0, 254, 254);
var blueState = lightState.create().rgb(0, 0, 255);
var magentaState = lightState.create().rgb(255, 0, 255);
 
function setOfficeLights(state) {
	api.setLightState(7, state)
	    .then(displayResult)
	    .done();
	api.setLightState(9, state)
	    .then(displayResult)
	    .done();
	api.setLightState(10, state)
	    .then(displayResult)
	    .done();
}

function getLightStateFromRGB(r, g, b) {
	return customState = lightState.create().rgb(r, g, b);
}

// public methods
module.exports = {
		test123: function() {
			console.log('testing123 success from hue-lights');
		},
		setOfficeRed: function() {
			setOfficeLights(redState);
		},
		setOfficeYellow: function() {
			setOfficeLights(yellowState);
		},
		setOfficeGreen: function() {
			setOfficeLights(greenState);
		},
		setOfficeCyan: function() {
			setOfficeLights(cyanState);
		},
		setOfficeBlue: function() {
			setOfficeLights(blueState);
		},
		setOfficeMagenta: function() {
			setOfficeLights(magentaState);
		},
		setCustom: function(r, g, b) {
			var customState = getLightStateFromRGB(r, g, b);
			setOfficeLights(customState);
		},
		setHex: function(hexValue) {
			var rgbObj = hexToRgb(hexValue);
            var hexState = getLightStateFromRGB(rgbObj.r, rgbObj.g, rgbObj.b);
            setOfficeLights(hexState);
		}
}