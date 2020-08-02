/**
 * TODO: describe this module
 */

const chatOverlayDAO = require('../chat_overlay/chat_overlay_DAO.js');
const overlayConfig = chatOverlayDAO.getConfig();
const ipAddress = overlayConfig.hue.ipAddress;
const v3 = require('node-hue-api').v3
	, hueApi = v3.api;
let api = null;
const LightState = v3.lightStates.LightState;
const username = overlayConfig.hue.username;

const displayResult = function(result) {
	console.log(JSON.stringify(result));
};

console.log("attempting to connect to hue bridge");
hueApi.createLocal(ipAddress).connect(username)
	.then(authenticatedApi => {
		api = authenticatedApi;
		authenticatedApi.configuration.getConfiguration()
			.then(bridgeConfig => {
				console.log(`Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`);
			})
			.catch(err => {
				console.log("error getting bridge config:");
				console.log(err);
			})
	})
	.catch(err => {
		console.log("ERROR getting authenticated Hue API:");
		console.log(err);
	});

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const redState = new LightState().rgb(255, 0, 0);
const yellowState = new LightState().rgb(255, 255, 0);
const greenState = new LightState().rgb(0, 255, 0);
const cyanState = new LightState().rgb(0, 254, 254);
const blueState = new LightState().rgb(0, 0, 255);
const magentaState = new LightState().rgb(255, 0, 255);
const loopState = new LightState().effectColorLoop(); // TODO: copy this
// NOTE: Light ID 7 is the bloom
const lightIds = [9, 10, 11];
 
function setOfficeLights(state) {
   try {
	for (let i = 0; i < lightIds.length; i++) {
		api.lights.setLightState(lightIds[i], state)
			.then(displayResult)
			.catch(function(err) {
		    	console.log('Error calling setLightState for lightId: ' + lightIds[i]);
		    	console.log(err);
		    });
	}
	} catch (e) {
		console.log('exception!');
		console.log(e);
	}
}

function getLightStateFromRGB(r, g, b) {
	return new LightState().rgb(r, g, b);
}

function restoreState(lightId, state) {
	try {
		api.lights.setLightState(lightId, state)
			.then(displayResult)
			.catch(function(err) {
		    	console.log('Error setLightState in restoreState():');
		    	console.log(err);
		    })
	} catch (e) {
		console.log('exception!');
		console.log(e);
	}
}

function loopOfficeLights() {
	try {
		lightIds.forEach(lightId => {
			// first get LightState to reset after loop
			api.lights.getLightState(lightId)
				.then(existingState => {
					// now set to loop
					api.lights.setLightState(lightId, loopState)
						.then(response => {
							existingState.effect = 'none';
							// timeout and restoreState after loop is done running
							setTimeout(restoreState, 15000, lightId, existingState);
						})
						.catch(err1 => {
							console.log("failed to setLightState to loop for LightId: " + lightId);
							console.log(err1);
						})
				})
				.catch(err => {
					console.log("error getting lightstate for ID: " + lightId);
					console.log(err);
				})
		});
	} catch (e) {
		console.log('exception!');
		console.log(e);
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
			const customState = getLightStateFromRGB(r, g, b);
			setOfficeLights(customState);
		},
		setHex: function(hexValue) {
			const rgbObj = hexToRgb(hexValue);
			const hexState = getLightStateFromRGB(rgbObj.r, rgbObj.g, rgbObj.b);
            setOfficeLights(hexState);
		},
		setColorLoop: function() {
			loopOfficeLights();
		}
}