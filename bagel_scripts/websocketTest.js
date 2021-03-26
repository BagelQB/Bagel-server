let W3CWebSocket = require('websocket').w3cwebsocket;

let client = new W3CWebSocket('ws://localhost:8000/', 'echo-protocol');
require("colors");

client.onerror = function() {
    console.log('Connection Error');
};

function Packet(header, data) {
    return header + ":ws:" + (JSON.stringify(data) || "null");
}

function getObjFromPacket(packetString) {
    let [header, obj] = packetString.split(":ws:");
    return {header: header, data: JSON.parse(obj)};
}

client.onopen = function() {
    console.log('WebSocket Client Connected');

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            setInterval(() => {
                client.send(Packet("ping", {time: Date.now()}));
            }, 500)
        }
    }
    sendNumber();
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

let ping = 0;

client.onmessage = function(e) {
    let {header, data} = getObjFromPacket(e.data);

    if(header === "pong") {
        ping = Date.now() - parseInt(data.time);
        console.log("Ping: ".dim + " " + ping.toString().bold.green);
    }
};