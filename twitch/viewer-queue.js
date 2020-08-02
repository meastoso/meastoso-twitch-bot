/**
 * TODO: Describe this module
 */

const subQueue = [];
const regQueue = [];

/**
 * TODO: javadocs
 * @param userObj
 */
const addUserToQueue = function(user) {
    if (user.subscriber) {
        subQueue.push(user);
    }
    else {
        regQueue.push(user);
    }
    return subQueue.length + regQueue.length;
};

/**
 * TODO: Javadocs
 */
const getUserFromQueue = function() {
    let username;
    if (subQueue.length) {
        // there are subs in the queue, grab them first
        const firstUserObj = subQueue.shift();
        username = firstUserObj.username;
    }
    else if (regQueue.length) {
        // there are no subs in queue, grab anyone
        const firstUserObj = regQueue.shift();
        username = firstUserObj.username;
    }
    console.log('returning from getUserFromQueue with username: ' + username);
    console.log(subQueue);
    console.log(regQueue);
    return username;
};

const getPlaceInQueue = function(user) {
	try {
		for (let i = 0; i < subQueue.length; i++) {
			const thisUser = subQueue[i];
			if (thisUser.username == user.username) {
				return i + 1;
			}
		}
		return -1;
	}
	catch (e) {
		console.log('caught exception in getPlaceInQueue()');
	}
}

// public methods
module.exports = {
    addUserToQueue: addUserToQueue,
    getUserFromQueue: getUserFromQueue,
    getPlaceInQueue: getPlaceInQueue
}