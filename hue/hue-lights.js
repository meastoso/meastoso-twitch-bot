/**
 * TODO: describe this module
 */

var chatOverlayDAO = require('../chat_overlay/chat_overlay_DAO.js');
var overlayConfig = chatOverlayDAO.getConfig();
var hueModule = require("node-hue-api");
var HueApi = hueModule.HueApi;
var lightState = hueModule.lightState;
var username = overlayConfig.hue.username;
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
    api.lights()
	    .then(displayResult)
	    .catch(function(err) {
	    	console.log('chris error');
	    })
	    .done();
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
var loopState = lightState.create().colorLoop(); // TODO: copy this
loopState.longAlert();
var lightIds = [7, 9, 10, 11];
 
function setOfficeLights(state) {
   try {
	for (let i = 0; i < lightIds.length; i++) {
		api.setLightState(lightIds[i], state)
			.then(displayResult)
			.catch(function(err) {
		    	console.log('chris error');
		    })
			.done();
	}
	} catch (e) {
		console.log('exception!');
	}
}

function getLightStateFromRGB(r, g, b) {
	return customState = lightState.create().rgb(r, g, b);
}

function restoreState(lightId, state) {
	console.log('got restorestate call with lightId: ' + lightId);
	console.log(state);
	try {
	api.setLightState(lightId, state)
			.then(displayResult)
			.catch(function(err) {
		    	console.log('chris error');
		    })
			.done();
	} catch (e) {
		console.log('exception!');
	}
}

function loopOfficeLights() {
	try {
   // first retain existing light states
    api.lights()
        .then(function(results) {
        console.log('just finished api.lights() in loop method');
           // store results here then change light state to loop then set back
         var currentStateMap = {};
         if (!results || !results.lights) {
            console.log('ERROR: DID NOT FIND LIGHTS IN RESULTS VARIABLE WHEN CALLING LOOPOFFICELIGHTS()');
            return;
         }
         // loop through each light and store the state as value and ID as key in map
         for (let i = 0; i < results.lights.length; i++) {
                currentStateMap[results.lights[i].id] = results.lights[i].state;
         }
         console.log('currentStateMap is: ');
         console.log(currentStateMap);
         // now set the states to loop
         for (let i = 0; i < lightIds.length; i++) {
				api.setLightState(lightIds[i], loopState);
				let lightState = currentStateMap[lightIds[i]];
				lightState.effect = 'none';
				setTimeout(restoreState, 15000, lightIds[i], lightState);
         }
      })
		.done();
	} catch (e) {
		console.log('exception!');
	}
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
		},
		setColorLoop: function() {
			loopOfficeLights();
		}
}