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

// public methods
module.exports = {
    addUserToQueue: addUserToQueue,
    getUserFromQueue: getUserFromQueue
}