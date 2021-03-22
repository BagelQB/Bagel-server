let wsServer = {};

const ws = require('../bagel_modules/websocketService');
require("colors");

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
    wslog(" !! CONNECTION REJECTED ".bold.red + `[${data.remoteAddress}]`.cyan);
})

ws.bind(ws.event.ping, (data) => {
    wslog(" ? PING ".blue.bold + `[${data.netUser.remoteAddress}]`.cyan);
})


module.exports = wsServer;