/**
 * TODO Describe this module's responsibilities
 */

var TwitchJS = require('twitch-js');
var chatOverlayDAO = require('../chat_overlay/chat_overlay_DAO.js');
var chatParser = require('../chat_overlay/chat_parser.js');
var overlayConfig = chatOverlayDAO.getConfig();
var hueController = require('../hue/hue-lights.js'); // TODO: restore after testing at home
var chatOverlay = null; // only set if app.js arg said to show window
var viewerQueue = require('./viewer-queue.js');
var player = require('play-sound')(opts = {});

// configure twitch connection options
var channelName = overlayConfig.twitch.channelName;
var username = overlayConfig.twitch.botAccount.username;
if (channelName == 'channelName' || username == 'username') {
	console.log("Default settings found. Please configure your settings in the file 'config.js' found at the root of this application.");
	process.exit(1);
}
var options = {
        options: {
                debug: true
        },
        connection: {
                cluster: "aws",
                reconnect: true
        },
        identity: {
                username: username,
                password: overlayConfig.twitch.botAccount.password
        },
        channels: [channelName]
};

var client = new TwitchJS.client(options);
console.log("Attempting to log into channel: " + channelName + " with username: " + username);
client.connect();

client.on('connected', function(address, port) {
    console.log("Connected!");
});

client.on('subscription', (channel, username, method, message, userstate) => {
	console.log('-------------------------------------------------------------');
	console.log('SUBSCRIPTION EVENT FIRED!!!');
	console.log('-------------------------------------------------------------');
	
});

let showWindow = false;
let sessionId = '';
let lobbyId = '';
let iterator = 0;
let deathCount = 0;
let garbageCount = 0;
let dc = 'primal';

const setShowWindow = function(showWindowBool) {
    showWindow = showWindowBool;
    if (showWindowBool) {
        chatOverlay = require('../chat_overlay/chat_overlay.js');
    }
};

/**
 * Function to parse chat message for bot commands
 */
client.on('chat', function(channel, user, message, self) {
    console.log('user id is: ' + user['user-id']);
    if (self) return;
    try {
        var username = user['username'];
        var msgObj = {
            'user': user,
            'message': message
        }
        // TODO: COME BACK TO THIS AND FIX AFTER TWITCH CLIENT IS WORKING
        // pass the message through the filter method
        if (showWindow && chatParser.isMsgImportant(msgObj)) {
            chatOverlay.sendClientMsg(msgObj);
        }
        /* ###########################
         *     !misszo
         * ########################### */
        if (message.startsWith("!misszo")) {
        //if (message.startsWith("!misszo")) { // TODO: restore this after we get the the sendClientMsg() function working with electron
            var msg = "did you guys know @miss_zo is an AMAZING cook?!?! check out her cooking blog at https://misszocooks.wordpress.com";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !hype
         * ########################### */
        else if (message.startsWith("!hype")) {
            var msg = "meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype meastoHype";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !server
         * ########################### */
        else if (message.startsWith("!server")) {
            var msg = "~-.-~ meast is playing on Behemoth [Primal] ~-.-~";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !mizzteq
         * ########################### */
        else if (message.startsWith("!pldpov") || message.startsWith("!mizzteq")) {
            var msg = "Are you in Mizzteq's group?! I DON'T KNOW HER!! twitch.tv/mtqcapture";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !discord
         * ########################### */
        else if (message.startsWith("!discord")) {
            var msg = "We have a stream DISCORD! Come hang out! https://discord.gg/P8AdrAQ";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !meangirls
         * ########################### */
        else if (message.startsWith("!meangirls")) {
            var msg = "commands are: !getinloser, !karen, !sears, !fetch, !butter, !pink, !shedoesntgohere and !youcantsitwithus LELEL";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !shoutout
         * ########################### */
        else if (message.startsWith("!shoutout ") || message.startsWith("!so ")) {
            var shoutoutTarget = message.substring(10, message.length);
            if (message.startsWith("!so ")) {
            	shoutoutTarget = message.substring(4, message.length);
            }
            var msg = "My dear friend " + shoutoutTarget + " is an AWESOME STREAMER! Check them out at www.twitch.tv/" + shoutoutTarget;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !trivia
         * ########################### */
        else if (message.startsWith("!trivia")) {
            var msg = "meastoso is the creator of TriviaChamp, the twitch extension you see in the top-left corner of the screen! Give it a whirl and let us know what you think!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !getinloser
         * ########################### */
        else if (message.startsWith("!getinloser")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\getInLoser.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !karen
         * ########################### */
        else if (message.startsWith("!karen")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\ohMyGodKaren.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !sears
         * ########################### */
        else if (message.startsWith("!sears")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\sears.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !fetch
         * ########################### */
        else if (message.startsWith("!fetch")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\fetch.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !butter
         * ########################### */
        else if (message.startsWith("!butter")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\butterCarb.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !pink
         * ########################### */
        else if (message.startsWith("!pink")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\pink.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !shedoesntgohere
         * ########################### */
        else if (message.startsWith("!shedoesntgohere")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\doesntGoHere.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !youcantsitwithus
         * ########################### */
        else if (message.startsWith("!youcantsitwithus")) {
            // $ mplayer foo.mp3
            player.play('D:\\twitch_plugins\\sounds\\youCantSitWithUs.mp3', function(err){
                if (err) {
                    console.log("error playing sound");
                    console.log(err);
                }
            })
        }
        /* ###########################
         *     !colors
         * ########################### */
        else if (message.startsWith("!colors")) {
            var msg = "Set the color of meast's room with the new !setcolor command. Available colors are: red, yellow, green, cyan, blue and magenta. Use !customcolor <red> <green> <blue> to set a custom color of your choice where each color is a number between 0 and 255!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !setcolor
         * ########################### */
        else if (message.startsWith("!setcolor ")) {
            var color = message.substring(10, message.length);
            if (color == 'red') {
                hueController.setOfficeRed();
            }
            else if (color == 'yellow') {
                hueController.setOfficeYellow();
            }
            else if (color == 'green') {
                hueController.setOfficeGreen();
            }
            else if (color == 'cyan') {
                hueController.setOfficeCyan();
            }
            else if (color == 'blue') {
                hueController.setOfficeBlue();
            }
            else if (color == 'magenta') {
                hueController.setOfficeMagenta();
            }
            else {
                var msg = 'That color is not yet supported.';
                client.say(channelName, msg);
            }
        }
        /* ###########################
         *     !customcolor
         * ########################### */
        else if (message.startsWith("!customcolor ")) {
            var commandArgs = message.substring(13, message.length).split(" ");
            var msg = 'Invalid: must specify 3 numbers between 0-255, i.e. !customcolor 255 255 255';
            if (commandArgs.length != 3) {
                client.say(channelName, msg);
            }
            else {
                var r = parseInt(commandArgs[0]);
                var g = parseInt(commandArgs[1]);
                var b = parseInt(commandArgs[2]);
                if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
                    client.say(channelName, msg);
                }
                else {
                    hueController.setCustom(r, g, b);
                }
            }
        }
        /* ###########################
         *     !subcolor
         * ########################### */
        else if (message.startsWith("!subcolor")) {
            // first check is user is a sub
            if (!user.subscriber) {
                var errormsg = "The !subcolor command is a subscriber benefit!";
                client.say(channelName, errormsg);
                return;
            }
            // user is a subscriber, continue
            const subColorHex = user.color;
            var msg = "Welcome back " + username + " you sexy bear-backer! Setting Meastoso's room to your twitch username color: " + subColorHex;
            client.say(channelName, msg);
            hueController.setHex(subColorHex);
        }
        /* ###########################
         *     !setsession
         * ########################### */
        else if (username === channelName && message.startsWith("!setsession ")) {
            sessionId = message.substring(12, message.length);
            var msg = "Successfully set session ID to: " + sessionId;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !session
         * ########################### */
        else if (message.startsWith("!session")) {
            var msg = "Meastoso's current Monster Hunter Session ID: " + sessionId;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !vote
         * ########################### */
        else if (message.startsWith("!vote")) {
            var msg = "VOTE! VOTE! VOTE! If you are one of our American cohorts make sure you get out and vote on Nov. 6th which is THIS TUESDAY OMG!!!!!! It will make meast SUPER WET!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !act
         * ########################### */
        else if (message.startsWith("!act")) {
            var msg = "The damage meter is a plugin for Advanced Combat Tracker (ACT) which you can find the base program and FFXIV plugin here: https://advancedcombattracker.com/download.php  The overlay is called MopiMopi which you can find here: https://docs.google.com/presentation/d/1U7-Vgv6UA2_EFdvw3m8BI-5-9T91WeKTflDuR7rEx-U/edit#slide=id.p";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !cactbot
         * ########################### */
        else if (message.startsWith("!cactbot")) {
            var msg = "Interested in the ACT plugin that shows the upcoming boss abilities? Go check out FFXIV Cactbot plugin here: https://github.com/quisquous/cactbot";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !aethernet
         * ########################### */
        else if (message.startsWith("!aethernet")) {
            var msg = "The Aethernet Team is currently running our FFXIV 5.3 marathon! Earn !anima just by hanging out here and use the anima you collect to bid on raffle giveaways!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !suzaku
         * ########################### */
        /*else if (message.startsWith("!extreme")) {
            var msg = "Meastoso is running Titania Extreme and Innocence Extreme with viewers ALL DAY on the Primal DC! CLEAR GUARANTEED! Use !join to get in the queue!";
            client.say(channelName, msg);
        }*/
        /* ###########################
         *     !join
         * ########################### */
        else if (message.startsWith("!join")) {
            var placeInQueue = viewerQueue.addUserToQueue(user);
            //var msg = "User " + username + " has been added the party queue! Please have the encounter unlocked. If you do not have the encounter unlocked before joining the party we will move to the next person in queue.";
            //var msg = "User " + username + " has been added to the Ex Primal queue! You are #" + placeInQueue + " in line!";
            var msg = "User " + username + " has been added to the duet queue! You are #" + placeInQueue + " in line!";
            client.say(channelName, msg);
        }
        else if (message.startsWith("!position")) {
            var placeInQueue = viewerQueue.getPlaceInQueue(user);
            //var msg = "User " + username + " has been added the party queue! Please have the encounter unlocked. If you do not have the encounter unlocked before joining the party we will move to the next person in queue.";
            var msg = "You are #" + placeInQueue + " in queue!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !youtube
         * ########################### */
        else if (message.startsWith("!youtube")) {
            var msg = "Meast co-hosts a Gaymer Bear YouTube show called 'The Big Gay Lets Play'! Check it out here: https://www.youtube.com/biggayletsplay";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !botcheck
         * ########################### */
        else if (message.startsWith("!botcheck")) {
            var msg = "meastoLUL meastoLove meastoLUL";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !testjoin
         * ########################### */
        else if (message.startsWith("!testjoin")) {
            const testUser = {
                username: 'whocares' + iterator,
            };
            iterator++;
            viewerQueue.addUserToQueue(testUser);
            var msg = "User " + testUser.username + " has been added the party queue! Please have the encounter unlocked. If you do not have the encounter unlocked before joining the party we will move to the next person in queue.";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !pull
         * ########################### */
        else if (username === channelName && message.startsWith("!pull")) {
            const pulledUsername = viewerQueue.getUserFromQueue();
            if (pulledUsername === undefined || pulledUsername === null || pulledUsername === '') {
                var errormsg = "No users in queue!";
                client.say(channelName, errormsg);
                return;
            }
            //var msg = pulledUsername + "! Come on down! Please join the Private Party Finder hosted by Meastoso on Primal Datacenter with password: 6969";
            var msg = pulledUsername + "! LET'S SING! ARE YOU HERE???";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !friendcode
         * ########################### */
        else if (message.startsWith("!friendcode") || message.startsWith("!friend")) {
        		var fc = "SW-4417-9441-6707";
            var msg = "Meastoso's friend code is: " + fc;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !setlobby
         * ########################### */
        else if (username === channelName && message.startsWith("!setlobby ")) {
            lobbyId = message.substring(10, message.length);
            var msg = "Successfully set Lobby ID to: " + lobbyId;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !lobby
         * ########################### */
        else if (message.startsWith("!lobby")) {
            var msg = "Meastoso's current game lobby ID: " + lobbyId;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !vocalrest
         * ########################### */
        else if (message.startsWith("!vocalrest")) {
            var msg = "Meast strained his voice and must stay on light vocal rest for a while; he'll be back to normal again soon!";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !bnet
         * ########################### */
        else if (message.startsWith("!bnet")) {
            var msg = "Add meast on battle.net: --> meastoso#1418 <--";
            client.say(channelName, msg);
        }
        // setColorLoop
        /* ###########################
         *     !loop
         * ########################### */
        else if (message.startsWith("!loop")) {
            hueController.setColorLoop();
        }
        /* ###########################
         *     !shedead
         * ########################### */
        else if (message.startsWith("!shedead")) {
            deathCount++;
            var msg = "This dumb bitch has now died " + deathCount + " times...";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !setdeathcount
         * ########################### */
        else if (username === channelName && message.startsWith("!setdeathcount ")) {
            deathCount = message.substring(15, message.length);
            var msg = "Successfully set Death Count to: " + deathCount;
            client.say(channelName, msg);
        }
        /* ###########################
         *     !linkshell
         * ########################### */
        else if (message.startsWith("!linkshell")) {
            var msg = "We have a community linkshell on Primal DC! To join, world-transfer to Behemoth server, player search for 'meastoso disperde' or 'mysidia baron' and send us a tell for invite!";
            if (dc == 'crystal') {
            	msg = "We have a community linkshell on Crystal DC! To join, world-transfer to Coeurl server, player search for 'meastoso crystal' or world-transfer to Mateus and search for 'ashirani riki' and send us a tell for invite!";
            } else if (dc == 'aether') {
            	msg = "We have a community linkshell on Aether DC! To join, world-transfer to Faerie server, player search for 'meastoso adipem'";
            }
            client.say(channelName, msg);
        }
        /* ###########################
         *     !crystal
         * ########################### */
        else if (message.startsWith("!crystal")) {
            dc = 'crystal';
        }
        /* ###########################
         *     !aether
         * ########################### */
        else if (message.startsWith("!aether")) {
            dc = 'aether';
        }
        /* ###########################
         *     !garbage
         * ########################### */
        else if (message.startsWith("!garbage")) {
				garbageCount++;
            var msg = "meastoLUL meastoLUL meastoLUL Meast has now referred to himself as 'garbage' " + garbageCount + " times! meastoLUL meastoLUL meastoLUL";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !help
         * ########################### */
        else if (message.startsWith("!help")) {
            var msg = "Commands are: !meangirls, !linkshell, !garbage, !friendcode, !bnet, !aethernet, !act, !cactbot, !subcolor, !colors, !so, !discord, !server, !hype";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !hebi
         * ########################### */
        else if (message.startsWith("!hebi")) {
            var msg = "meastoDaddy meastoCry FeelsHebiMan meastoCry meastoDaddy";
            client.say(channelName, msg);
        }
        /* ###########################
         *     !aly
         * ########################### */
        else if (message.startsWith("!aly")) {
            var msg = "meastoLove meastoLove FEELS ALY LADIES meastoLove meastoLove";
            client.say(channelName, msg);
        }
        
    }
    catch(error) {
        console.log("ERROR: " + error);
    }

});

client.on("subscription", function (channel, username) {
    var msg = 'Thanks for bearbacking, ' + username + '! Also, make sure to practice safe-sex, xoxo';
    client.say(channelName, msg);
    hueController.setColorLoop();
});

client.on("resub", (channel, username, months, message, userstate, methods) => {
    hueController.setColorLoop();
});

// public methods
module.exports = {
    getTwitchClient: function() {
        return client;
    },
    setShowWindow: setShowWindow
}

