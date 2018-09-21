/**
* Javascript used to communicate with the current 
* express server to get/set configuration 
*/
(function($) {	
	$(document).ready(function(){
		
		// go and get the current configuration
		var req = $.get( "/getConfig", function(data) {
			console.log( "success" );
			console.log("Data is: " + JSON.stringify(data));
			initConfig(data);
		})
		.done(function() {
			console.log( "second success" );
		})
		.fail(function() {
			console.log( "error" );
		})
		.always(function() {
			console.log( "finished" );
		});
			 
		// Perform other work here ...
			 
		// Set another completion function for the request above
		req.always(function() {
			console.log( "second finished" );
		});
		
		$("#addUserButton").on("click", function(e) {
			e.preventDefault();
			$("#addUserFormGroup").slideToggle();
		});
		
		/**
		 * TODO: add javadoc
		 */
		$("#input_addPhrase").keypress(function(e) {
		    if (e.which == 13) {
		        e.preventDefault();
		    }
		});
		
		/**
		 * TODO: add javadoc
		 */
		$("#input_addUser").keypress(function(e) {
		    if (e.which == 13) {
		        e.preventDefault();
		    }
		});
		
		$("#submitUserButton").on("click", function(e) {
			console.log("submit user button clicked");
			e.preventDefault();
			createUserDiv($("#input_addUsername").val());
			$("#input_addUsername").val('');
		});
		
		$("#addPhraseButton").on("click", function(e) {
			e.preventDefault();
			$("#addPhraseFormGroup").slideToggle();
		});
		
		$("#submitPhraseButton").on("click", function(e) {
			console.log("submit phrase button clicked");
			e.preventDefault();
			createPhraseDiv($("#input_addPhrase").val());
			$("#input_addPhrase").val('');
		});
		
		function createUserDiv(username) {
			console.log("creating user div");
			var userImg = $("<img class='img-responsive user-img' src='img/user_icon.svg'>");
			var usernameSpan = $("<span class='name'>" + username + "</span>");
			var delImg = $("<a href='#'><img class='img-responsive del-img' src='img/del_icon.png'></a>");
			var newUserDiv = $("<div class='user'></div>");
			newUserDiv.append(userImg).append(usernameSpan).append(delImg);
			$(".users-container").append(newUserDiv);
			setClickHandlersForDelete();
		}
		
		function createPhraseDiv(phrase) {
			console.log('creating phrase div');
			var phraseImg = $("<img class='img-responsive phrase-img' src='img/phrase_icon.png'>");
			var phraseSpan = $("<span class='the-phrase'>" + phrase + "</span>");
			var delImg = $("<a href='#'><img class='img-responsive del-img' src='img/del_icon.png'></a>");
			var newPhraseDiv = $("<div class='phrase'></div>");
			newPhraseDiv.append(phraseImg).append(phraseSpan).append(delImg);
			$(".phrases-container").append(newPhraseDiv);
			setClickHandlersForDelete();
		}
		
		function setClickHandlersForDelete() {
			$(".del-img").on("click", function(e) {
				e.preventDefault();
				$(this).closest("div.user").remove();
				$(this).closest("div.phrase").remove();
			});
		}
		
		setClickHandlersForDelete(); // do this on page load for any existing delete things
		
		
		/**
		 * SUBMIT CONFIG BELOW HERE
		 */
		//$("#submitConfig").on("click", function(e) {
		$("#form_updateConfig").on("submit", function(e) {
			console.log("submitting config");
			e.preventDefault();
			var configObj = gatherConfig();
			$.get("http://localhost:3000/putConfig", configObj, function(data) {
				console.log("receipved post response: " + JSON.stringify(data));
				alert("SUCCESS! The configuration has been updated and a new chat overlay window has been opened. Please be sure to close the first window that was opened by right-clicking the program icon in Windows task try and choosing 'Close Window'. (Sorry will fix this so you don't have to do this in the future i'm gay). NOTE: If you changed any of the three TWITCH values you must restart the application for the twitch connection to work!");
			});
		});
		
		/**
		 * TODO
		 * @returns
		 */
		function gatherConfig() {
			// loop on each for input and get their val
			var config = {};
			config.chatapp = {};
			config.twitch = {};
			config.chatapp.overlaywindow = {};
			config.chatapp.filters = {};
			config.chatapp.filters.user = {};
			config.chatapp.filters.regex = {};
			
			config.twitch.channelName = $("#channel").val();
			config.twitch.botAccount = {};
			config.twitch.botAccount.username = $("#botUsername").val();
			config.twitch.botAccount.password = $("#botPassword").val();
			
			config.chatapp.overlaywindow.x = parseInt($("#x").val());
			config.chatapp.overlaywindow.y = parseInt($("#y").val());
			config.chatapp.overlaywindow.width = parseInt($("#width").val());
			config.chatapp.overlaywindow.height = parseInt($("#height").val());
			config.chatapp.filters.user.totalMessagesThreshold = parseInt($("#totalMessagesThreshold").val());
			config.chatapp.filters.user.totalBitsDonatedThreshold = parseInt($("#totalBitsDonatedThreshold").val());
			
			// do checkbox logic for these
			config.chatapp.overlaywindow.transparent = $("#transparent").is(":checked");
			config.chatapp.overlaywindow.alwaysOnTop = $("#alwaysOnTop").is(":checked");
			config.chatapp.overlaywindow.frame = $("#frame").is(":checked");
			
			// loop through all div containers and pull out text for values
			var whitelistUsers = [];
			$("div.user").each(function() {
				whitelistUsers.push($(this).find("span.name").text());
			});
			var whitelistPhrases = [];
			$("div.phrase").each(function() {
				whitelistPhrases.push($(this).find("span.the-phrase").text());
			});
			config.chatapp.filters.regex.whitelistUsers = whitelistUsers;
			config.chatapp.filters.regex.whitelistPhrases = whitelistPhrases;
			return config;
		}
		
		function initConfig(config) {
			console.log(config.twitch.channelName);
			if (!isEmpty(config.twitch.channelName)) {
				$("#channel").val(config.twitch.channelName);
				$("#channel").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#channel").val());
			}
			if (!isEmpty(config.twitch.botAccount.username)) {
				$("#botUsername").val(config.twitch.botAccount.username);
				$("#botUsername").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#botUsername").val());
			}
			if (!isEmpty(config.twitch.botAccount.password)) {
				$("#botPassword").val(config.twitch.botAccount.password);
				$("#botPassword").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#botPassword").val());
			}
			$("#x").val(config.chatapp.overlaywindow.x);
			$("#x").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#x").val());
			$("#y").val(config.chatapp.overlaywindow.y);
			$("#y").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#y").val());
			$("#width").val(config.chatapp.overlaywindow.width);
			$("#width").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#width").val());
			$("#height").val(config.chatapp.overlaywindow.height);
			$("#height").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#height").val());
			$("#totalMessagesThreshold").val(config.chatapp.filters.user.totalMessagesThreshold);
			$("#totalMessagesThreshold").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#totalMessagesThreshold").val());
			$("#totalBitsDonatedThreshold").val(config.chatapp.filters.user.totalBitsDonatedThreshold);
			$("#totalBitsDonatedThreshold").closest(".floating-label-form-group").toggleClass("floating-label-form-group-with-value", !!$("#totalBitsDonatedThreshold").val());
			
			var transparent = (config.chatapp.overlaywindow.transparent == 'true');
			var alwaysOnTop = (config.chatapp.overlaywindow.alwaysOnTop == 'true');
			var frame = (config.chatapp.overlaywindow.frame == 'true');
			$("#transparent").prop("checked", transparent);
			$("#alwaysOnTop").prop("checked", alwaysOnTop);
			$("#frame").prop("checked", frame);
			
			var whitelistUsers = config.chatapp.filters.regex.whitelistUsers;
			if (!isEmpty(whitelistUsers)) {
				for (var i = 0; i < whitelistUsers.length; i++) {
					createUserDiv(whitelistUsers[i]);
				}
			}
			var whitelistPhrases = config.chatapp.filters.regex.whitelistPhrases;
			if (!isEmpty(whitelistPhrases)) {
				for (var i = 0; i < whitelistPhrases.length; i++) {
					createPhraseDiv(whitelistPhrases[i]);
				}
			}
		}
		
		function isEmpty(value) {
			return value === undefined || value === null || value === '';
		}
	});
})(jQuery);