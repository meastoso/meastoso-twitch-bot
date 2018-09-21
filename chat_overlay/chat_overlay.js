/**
 * THIS IS THE ELECTRON APP
 * NOTE: This is actually the primary entrance point for the app
 */

var chatOverlayDAO = require('./chat_overlay_DAO.js');
var overlayConfig = chatOverlayDAO.getConfig();

const {app, BrowserWindow} = require('electron');

var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(1338, function() { });

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});
var connection;
// WebSocket server
wsServer.on('request', function(request) {
    //var connection = request.accept(null, request.origin);
    connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

/**
 * TODO: document object type used here
 */
const sendClientMsg = function(msgObj) {
    if (connection === undefined) {
        console.log("Client hasn't been opened.");
        return;
    }
    connection.sendUTF(JSON.stringify(msgObj));
}


/*********************************
 *   ELECTRON CODE HERE
 *********************************/
//if (config.electron === undefined || config.electron === null || config.electron == true) {
//const {app, BrowserWindow} = require('electron')
//const remote = require('electron').remote;
//if (showWindow) {

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    var frame = (overlayConfig.chatapp.overlaywindow.frame == 'true');
    var transparent = (overlayConfig.chatapp.overlaywindow.transparent == 'true');
    var alwaysOnTop = (overlayConfig.chatapp.overlaywindow.alwaysOnTop == 'true');
    win = new BrowserWindow({width: parseInt(overlayConfig.chatapp.overlaywindow.width), height: parseInt(overlayConfig.chatapp.overlaywindow.height), frame: frame, transparent: transparent, alwaysOnTop: alwaysOnTop, x: parseInt(overlayConfig.chatapp.overlaywindow.x), y: parseInt(overlayConfig.chatapp.overlaywindow.y)})

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    //win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})


//}
//}

// public methods
module.exports = {
    sendClientMsg: sendClientMsg
}
