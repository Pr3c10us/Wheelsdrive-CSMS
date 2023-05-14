// Create a new WebSocket server
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 9000 });

// Store a map of client connections by UUID
const connections = new Map();

const handleConnection = async () => {
    // When a new WebSocket connection is established
    wss.on("connection", (ws, req) => {
        // Generate a new UUID for this client
        const uuid = req.url.split("/")[1];

        // Store the client connection in the connections map
        connections.set(uuid, ws);

        console.log(`WebSocket connection established with client ${uuid}`);

        // When a message is received from the client
        ws.on("message", (message) => {
            console.log(`Message received from client ${uuid}: ${message}`);
        });

        // When the WebSocket connection is closed
        ws.on("close", () => {
            console.log(`WebSocket connection closed with client ${uuid}`);
            connections.delete(uuid);
        });
    });
};

handleConnection();

// Function to send a message to a specific client by UUID
function sendMessageToClient(uuid, message) {
    const ws = connections.get(uuid);

    if (ws) {
        console.log(`Sending message to client ${uuid}: ${message}`);
        ws.send(message);
    } else {
        console.log(`Client ${uuid} not found`);
    }
}

// Send a message to a specific client
const clientUUID = "dodo";
const message = "Hello, client!";
setInterval(() => {
    sendMessageToClient(clientUUID, message);
}, 5000);
