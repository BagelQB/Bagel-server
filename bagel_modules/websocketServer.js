let wsServer = {};

const ws = require('../bagel_modules/websocketService');
require("colors");

console.log(console.log("[WSServer] SERVER START  ".bold + (new Date()).toString().gray));

/**
 * Function to format a log message for the websocket server
 * @param {String} msg - The message to send
 */
function wslog(msg) {
    console.log("[WSServer] ".bold + (new Date()).toString().gray + msg);
}

ws.bind(ws.event.ws_connection_accept, (data) => {
    wslog(" + CONNECTION ACCEPTED ".bold.green + `[${data.remoteAddress}]`.cyan);
});

ws.bind(ws.event.get, (data) => {
    wslog(" << GET ".bold.yellow + `[${data.netUser.remoteAddress}]`.cyan);
})

ws.bind(ws.event.post, (data) => {
    wslog(" <! POST ".bold.magenta + `[${data.netUser.remoteAddress}]`.cyan);
})

ws.bind(ws.event.ws_connection_drop, (data) => {
    wslog(" ! CONNECTION DROPPED ".bold.yellow + `[${data.netUser.remoteAddress}]`.cyan);
})

ws.bind(ws.event.ws_connection_reject, (data) => {
    console.log(data.origin);
    wslog(" !! CONNECTION REJECTED ".bold.red + `[${data.remoteAddress}]`.cyan);
})

ws.bind(ws.event.ping, (data) => {
    //wslog(" ? PING ".blue.bold + `[${data.netUser.remoteAddress}]`.cyan);
})


module.exports = wsServer;