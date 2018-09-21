/**
 * DESCRIBE APP HERE
 */

var twitchApp = require('./twitch/twitch.js');

// use command line args to determine if we show electron window
let showWindow = true;
if (process.argv[2] == '-no-window') {
    showWindow = false;
}
twitchApp.setShowWindow(showWindow);







