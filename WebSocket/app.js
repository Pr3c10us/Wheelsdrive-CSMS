// Import required modules
require("dotenv").config();

// Import Express
const express = require("express");
const app = express();

// Import modules for webSocket
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

// Import Database modules
const mongoose = require("mongoose");
const connectToMongodb = require("../Database");
const ChargePointModel = require("../Database/models/ChargePoint");

// Import Classes
const chargePointStatus = require("./classes/chargePointStatus");

// Import Handlers
const handleVersion16 = require("./controllers/v16/handleVersion16");

// ######################################################################################################
// ######################################################################################################
// ######################################################################################################

// Create a map to store all connected clients
const clientConnections = new Map();

// Create websocket handler function
wss.on("connection", async (ws, request) => {
    // ######################################################################################################
    // ######################################################################################################
    // STORE WEBSOCKET CONNECTIONS IN A MAP WITH A UNIQUE KEY OF USERID AND CHARGEPOINT ENDPOINT COMBINED FOR EACH CLIENT

    // Get user id and charge point endpoint from request url
    const endpoint = request.url;
    const userId = endpoint.split("/")[1];
    const chargePointEndpoint = endpoint.split("/")[2];

    // close connection if userId or chargePointEndpoint is not provided
    if (!userId || !chargePointEndpoint) {
        ws.close();
        return;
    }

    // close connection if userId is not a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        ws.close();
        return;
    }

    // Combine userId and chargePointEndpoint to create a unique key
    const chargePointKey = userId + chargePointEndpoint;

    // Check if the client is already connected
    if (clientConnections.has(chargePointKey)) {
        // If the client is already connected, close the connection
        ws.close();
        return;
    }
    // add the object to the clients map with chargePointKey as key
    clientConnections.set(chargePointKey, ws);

    // ######################################################################################################
    // ######################################################################################################
    // CHECK DB FOR CHARGEPOINT AND CLIENT CERTIFICATE

    // Check if chargepoint is already registered in the database
    // Pause the websocket connection until we have cleared chargePoint to communicate with the websocket
    ws.pause();
    // Get Info of chargePoint
    const chargePointInfo = await ChargePointModel.findOne({
        admin: userId,
        endpoint: chargePointEndpoint,
    }); // VERY IMPORTANT VARIABLE
    // Resume the websocket connection back
    ws.resume();

    // If chargepoint is not registered in the database, close connection and remove client from map
    if (!chargePointInfo) {
        clientConnections.delete(chargePointKey);
        ws.close();
        return;
    }

    // Create function to check if client certificate matches the certificate in the database
    const checkClientCertificate = async (clientCertificate, socket) => {
        const clientCert = socket.getPeerCertificate();
        return (
            clientCert &&
            clientCert.thumbprint === clientCertificate.toLowerCase()
        );
    };

    if (chargePointInfo.clientCertificate) {
        const certAuthSuccess = await checkClientCertificate(
            chargePointInfo.clientCertificate,
            request.socket
        );
        if (!certAuthSuccess) {
            clientConnections.delete(chargePointKey);
            ws.close();
            return;
        }
    }

    // ######################################################################################################
    // ######################################################################################################
    // CREATE CHARGEPOINT STATUS CLASS
    const chargePointStatusClass = new chargePointStatus(chargePointInfo);

    // ######################################################################################################
    // ######################################################################################################
    // Get Protocol from websocket connection

    const ocppProtocol = ws.protocol; // VERY IMPORTANT VARIABLE
    console.log(ocppProtocol);
    // If the ocppProtocol is not ocpp1.6, ocpp2.0 or ocpp2.0.1 close the connection
    if (
        ocppProtocol != "ocpp1.6" &&
        ocppProtocol != "ocpp2.0" &&
        ocppProtocol != "ocpp2.0.1"
    ) {
        clientConnections.delete(chargePointKey);
        ws.close();
        return;
    }

    // Assign Protocol and websocket connection to the chargePoint Class
    chargePointStatusClass.Protocol = ocppProtocol;
    chargePointStatusClass.WebSocket = ws;

    // If ocpp version is 1.6, pass chargePointStatusClass to ocpp1.6 handler
    if (ocppProtocol == "ocpp1.6") {
        handleVersion16(chargePointStatusClass);
    }
    if (ocppProtocol == "ocpp2.0" || ocppProtocol == "ocpp2.0.1") {
        ws.on("message", async (msg) => {
            const data = JSON.parse(msg);

            console.log(data);
            if (data[3].meterValue) {
                console.log(data[3].meterValue[0]);
            }
        });
    }
    // ######################################################################################################
    // ######################################################################################################
    // IF THE WEBSOCKET CONNECTION IS CLOSED, REMOVE THE CLIENT FROM THE MAP

    ws.on("close", () => {
        // Remove the client from the map
        clientConnections.delete(chargePointKey);
    });
});

// ######################################################################################################
// ######################################################################################################
// Demo api to send message to a specific client
app.get("/send/:userId/:chargePointEndpoint", async (req, res) => {
    const userId = req.params.userId;
    const chargePointEndpoint = req.params.chargePointEndpoint;
    const chargePointKey = userId + chargePointEndpoint;
    const ws = clientConnections.get(chargePointKey);
    if (ws) {
        ws.send(
            JSON.stringify([
                2,
                "jcuwUHUz3mXrcB9TAx29iGt47LDyfF93pWAv",
                "Heartbeat",
                {},
            ])
        );
        res.send("Message sent");
    } else {
        res.send("Client not found");
    }
});

// ######################################################################################################
// ######################################################################################################
// CREATE SERVER
const port = process.env.PORT || 9000;
const serverApp = async () => {
    try {
        await connectToMongodb();
        server.listen(port, () =>
            console.log(`Server listening on port ${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};
serverApp();
