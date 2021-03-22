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

function authenticateOrigin(origin) {
    return false; // THIS MUST HAVE LOGIC TO AUTHENTICATE REQUEST ORIGINS IN PROD! DO NOT MERGE IF THE LOGIC DOES NOT EXIST.
    // This is only safe to merge if it is false.
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

function getObjFromPacket(packetString) {
    let [header, obj] = packetString.split(":ws:");
    return {header: header, data: JSON.parse(obj)};
}

function Packet(header, data) {
    return header + ":ws:" + (JSON.stringify(data) || "null");
}

function callBind(event, data) {
    const list = callbacks[event.callback];
    if(!list) return;
    list.forEach(func => func(data));
}

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

wsService.originAuth = (origin) => {
    return authenticateOrigin(origin);
}

module.exports = wsService;