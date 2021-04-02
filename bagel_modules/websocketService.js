let wsService = {};
// The purpose of this module is to provide a layer of abstraction for communicating between the server and client using websockets.

const Server = require('websocket').server;
let http = require('http');
let event = require('./wsEvents.json');


let server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(8000);

let ws = new Server({
    httpServer: server,
    autoAcceptConnections: false
});

/**
 * Function to validate if an origin should be allowed to connect to the websocket server. This must authenticate properly before release to prod.
 * @param {String} origin - The origin of the connection.
 * @returns {Boolean} - If this origin should be allowed to connect to the websocket server.
 */
function authenticateOrigin(origin) {
    const secure_origins = ["http://localhost:3000"] // In order (LTR) : React testing endpoint / end
    return secure_origins.includes(origin);
    // THIS MUST HAVE LOGIC TO AUTHENTICATE REQUEST ORIGINS IN PROD! DO NOT MERGE IF THE LOGIC DOES NOT EXIST.
}



let userDatabase = {};
let userDatabase_inv = {};
let callbacks = {};

ws.on('request', function(request) {
    if (!authenticateOrigin(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        callBind(event.ws_connection_reject, request);
        return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    connection.isAlive = true;
    callBind(event.ws_connection_accept, request);

    connection.on('message', function(message) {

        let {header, data} = getObjFromPacket(message.utf8Data);

        if(header === "ws_get") {
            callBind(event.get, {user: userDatabase[connection], data: data, netUser: connection});
            return;
        }

        if(header === "ws_post") {
            callBind(event.post, {user: userDatabase[connection], data: data, netUser: connection});
            return;
        }

        if(header === "ident") {
            callBind(event.identify, {user: userDatabase[connection], data: data, netUser: connection});
            return;
        }

        if(header === "ping") {
            connection.isAlive = true;
            connection.send(Packet("pong", data));
            callBind(event.ping, {user: userDatabase[connection], data: data, netUser: connection});
            return;
        }

        callBind(event.message, {user: userDatabase[connection], data: data});

    });


    connection.on('close', function(reasonCode, description) {
        callBind(event.ws_connection_drop, {user: userDatabase[connection], reasonCode: reasonCode, desc: description, netUser: connection});
    });
});


const keepAliveInterval = setInterval(function ping() {
    ws.connections.forEach(function each(client) {
        if (client.isAlive === false) {
            return client.close(1001, "Timeout");
        }

        client.isAlive = false;
    });
}, 5000);


/**
 * Decodes a websocket packet
 * @param {String} packetString - The packet data
 * @returns {Object} - The decoded header and data of the packet.
 */
function getObjFromPacket(packetString) {
    let [header, obj] = packetString.split(":ws:");
    return {header: header, data: JSON.parse(obj)};
}

/**
 * Makes a string from header and a data object.
 * @param {String} header - The header of the packet.
 * @param {Object} data - The data to be sent.
 * @returns {String} - The websocket packet
 */
function Packet(header, data) {
    return header + ":ws:" + (JSON.stringify(data) || "null");
}

/**
 * Calls a bound function (for abstractions on top of this service)
 * @param {WebsocketEvent} event - The event.
 * @param {Object} data - The data to be sent to the bound function.
 */
function callBind(event, data) {
    const list = callbacks[event.callback];
    if(!list) return;
    list.forEach(func => func(data));
}

/**
 * Bind a function to a websocket event
 * @param {WebsocketEvent} event - The event.
 * @param {Function} func - The function to bind.
 */
wsService.bind = (event, func) => {
    if(callbacks[event.callback]) {
        let list = callbacks[event.callback];
        list.push(func);
        callbacks[event.callback] = list;
        return;
    }
    callbacks[event.callback] = [func];
}

wsService.event = event;

/**
 * Export to test the origin authentication
 * @param {String} origin - The origin to test.
 * @returns {Boolean} If the origin will be authenticated.
 */
wsService.originAuth = (origin) => {
    return authenticateOrigin(origin);
}

module.exports = wsService;