// Import required modules
require("dotenv").config();

// Import Express
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
const Admin = require("../Database/models/Admin");

// Import Middleware
const {
    adminAuthorization,
    userAuthorization,
} = require("./middleware/adminAuthorization");

// Import ocpp version 1.6 remote functions
const remoteReset16 = require("./controllers/v16 remote api controller/reset");
const remoteUnlockConnectors16 = require("./controllers/v16 remote api controller/unlockConnector");
const RFID = require("../Database/models/RFID");
const remoteStartTransaction16 = require("./controllers/v16 remote api controller/startTransaction");
const Transaction = require("../Database/models/Transaction");
const Connector = require("../Database/models/Connector");
const remoteStopTransaction16 = require("./controllers/v16 remote api controller/stopTransaction");
const User = require("../Database/models/User");
const Rate = require("../Database/models/Rates");

// ######################################################################################################
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
    const chargePointId = endpoint.split("/")[1];
    // const userId = endpoint.split("/")[1];
    // const chargePointId = endpoint.split("/")[2];

    // close connection if userId or chargePointId is not provided
    // if (!userId || !chargePointId) {
    //     ws.close();
    //     return;
    // }
    if (!chargePointId) {
        ws.close();
        return;
    }

    // close connection if userId is not a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(userId)) {
    //     ws.close();
    //     return;
    // }
    // if (!mongoose.Types.ObjectId.isValid(chargePointId)) {
    //     ws.close();
    //     return;
    // }

    // Combine userId and chargePointId to create a unique key
    // const chargePointKey = userId + chargePointId;
    const chargePointKey = chargePointId;

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
    // const chargePointInfo = await ChargePointModel.findOne({
    //     admin: userId,
    //     _id: chargePointId,
    // }); // VERY IMPORTANT VARIABLE
    const chargePointInfo = await ChargePointModel.findOne({
        connectionId: chargePointId,
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
        try {
            const certAuthSuccess = await checkClientCertificate(
                chargePointInfo.clientCertificate,
                request.socket
            );
            if (!certAuthSuccess) {
                clientConnections.delete(chargePointKey);
                ws.close();
                return;
            }
        } catch (error) {
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
        });
    }
    // ######################################################################################################
    // ######################################################################################################
    // IF THE WEBSOCKET CONNECTION IS CLOSED, REMOVE THE CLIENT FROM THE MAP

    ws.on("close", async () => {
        // Remove the client from the map
        clientConnections.delete(chargePointKey);

        // Change chargePoint status to unconnected
        await ChargePointModel.findOneAndUpdate(
            { _id: chargePointInfo._id },
            { isConnected: false }
        );
    });
});

// ######################################################################################################
// ######################################################################################################
// ######################################################################################################
// ######################################################################################################
// Middleware

// CORS MIDDLEWARE
// Set up cors options and middleware
const corsOptions = {
    origin: [
        process.env.CLIENT_ORIGIN_1,
        process.env.CLIENT_ORIGIN_2,
        process.env.CLIENT_ORIGIN_3,
    ],
    credentials: true,
};
app.use(cors(corsOptions));

// COOKIE PARSER MIDDLEWARE
app.use(cookieParser(process.env.COOKIE_SECRET));

// HANDLE JSON REQUESTS MIDDLEWARE
app.use(express.json());

// ######################################################################################################
// ######################################################################################################
// Api Request handlers
app.get("/send/", async (req, res) => {
    // const userId = req.params.userId;
    // const chargePointId = req.params.chargePointId;
    // const chargePointKey = userId + chargePointId;
    // const ws = clientConnections.get(chargePointKey);
    // if (!ws) {
    //     return res.status(404).json({ msg: "Charger has been disconnected" });
    // }
    // if (ws) {
    //     ws.send(
    //         JSON.stringify([
    //             2,
    //             "jcuwUHUz3mXrcB9TAx29iGt47LDyfF93pWAv",
    //             "Heartbeat",
    //             {},
    //         ])
    //     );
    //     res.send("Message sent");
    // } else {
    // }
    res.send("Client not found");
});

// Remote reset handler
app.post("/admin/reset/:connectorId", adminAuthorization, async (req, res) => {
    // Get User Info from request
    const { id } = req.admin;
    // get user info
    const admin = await Admin.findById(id);
    if (!admin) {
        return res.status(404).json({ msg: "Admin Not found" });
    }
    // // Get Admin from database
    // if (!admin) {
    //     return res.status(404).json({ msg: "Admin not found" });
    // }
    // get connector info
    const connectorId = req.params.connectorId;

    const connectorInfo = await Connector.findById(connectorId).populate(
        "chargePoint"
    );
    if (!connectorInfo) {
        return res.status(404).json({ msg: "Connector not found" });
    }

    // Get ChargePoint Info from request
    const connectionId = connectorInfo.chargePoint.connectionId;
    const chargePointKey = connectionId;
    const ws = clientConnections.get(chargePointKey);
    if (!ws) {
        return res.status(404).json({ msg: "Charger has been disconnected" });
    }

    // Get ChargePoint Info from database
    const chargePointInfo = await ChargePointModel.findOne({
        admin,
        connectionId,
    });
    if (!chargePointInfo) {
        return res.status(404).json({ msg: "ChargePoint not found" });
    }

    if (!chargePointInfo.ocppVersion) {
        return res.status(404).json({ msg: "ChargePoint not connected" });
    }

    // Run respective function depending on the protocol
    if (chargePointInfo.ocppVersion == "ocpp1.6") {
        await remoteReset16(chargePointInfo, ws, res);
    } else if (
        chargePointInfo.ocppVersion == "ocpp2.0" ||
        chargePointInfo.ocppVersion == "ocpp2.0.1"
    ) {
        return;
    }
});

// Remote Unlock Connector handler
app.post(
    "/admin/unlockConnector/:connectorId",
    adminAuthorization,
    async (req, res) => {
        // Get User Info from request
        const { id } = req.admin;
        // get user info
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: "Admin Not found" });
        }
        // // Get Admin from database
        // if (!admin) {
        //     return res.status(404).json({ msg: "Admin not found" });
        // }

        // get connector info
        const connector = req.params.connectorId;

        const connectorInfo = await Connector.findById(connector).populate(
            "chargePoint"
        );

        if (!connectorInfo) {
            return res.status(404).json({ msg: "Connector not found" });
        }

        // Get ChargePoint Info from request
        const connectionId = connectorInfo.chargePoint.connectionId;
        const chargePointKey = connectionId;
        const ws = clientConnections.get(chargePointKey);
        if (!ws) {
            return res
                .status(404)
                .json({ msg: "Charger has been disconnected" });
        }

        // Get connectorId from request query, convert to number and set to 0 if not provided
        let connectorId = Number(req.body.connectorId);
        if (!connectorId) {
            connectorId = 0;
        } else {
            connectorId = Number(connectorId);
        }

        // Get ChargePoint Info from database
        const chargePointInfo = await ChargePointModel.findOne({
            admin,
            connectionId,
        });
        if (!chargePointInfo) {
            return res.status(404).json({ msg: "ChargePoint not found" });
        }

        if (!chargePointInfo.ocppVersion) {
            return res.status(404).json({ msg: "ChargePoint not connected" });
        }

        // Run respective function depending on the protocol
        if (chargePointInfo.ocppVersion == "ocpp1.6") {
            await remoteUnlockConnectors16(
                chargePointInfo,
                ws,
                res,
                connectorId
            );
        } else if (
            chargePointInfo.ocppVersion == "ocpp2.0" ||
            chargePointInfo.ocppVersion == "ocpp2.0.1"
        ) {
            return;
        }
    }
);

// Remote Start Transaction handler
app.post(
    "/admin/startTransaction/:connectorId",
    adminAuthorization,
    async (req, res) => {
        // Get User Info from request
        const { id } = req.admin;
        // get user info
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: "Admin Not found" });
        }
        // Get admin Rfid from database
        const adminRfid = await RFID.findOne({ admin });
        // // Get Admin from database
        // if (!admin) {
        //     return res.status(404).json({ msg: "Admin not found" });
        // }
        // get connector info
        const connector = req.params.connectorId;

        const connectorInfo = await Connector.findById(connector).populate(
            "chargePoint"
        );

        if (!connectorInfo) {
            return res.status(404).json({ msg: "Connector not found" });
        }
        if (connectorInfo.lastStatus != "Available") {
            return res.status(404).json({ msg: "Connector is in use" });
        }

        // Get ChargePoint Info from request
        const connectionId = connectorInfo.chargePoint.connectionId;
        const chargePointKey = connectionId;
        const ws = clientConnections.get(chargePointKey);
        if (!ws) {
            return res
                .status(404)
                .json({ msg: "Charger has been disconnected" });
        }

        // Get ChargePoint Info from database
        const chargePointInfo = await ChargePointModel.findOne({
            admin,
            connectionId,
        });
        if (!chargePointInfo) {
            return res.status(404).json({ msg: "ChargePoint not found" });
        }

        // Get connectorId from request query, convert to number and set to 0 if not provided
        let connectorId = Number(req.body.connectorId);
        if (!connectorId) {
            return res.status(400).json({ msg: "ConnectorId not provided" });
        }
        // const connector = await Connector.findOne({
        //     chargePoint: chargePointInfo,
        //     connectorId,
        // });

        let idTag = req.body.idTag || adminRfid.rfid;

        // If connector is not found don't add connector to the transaction
        let latestTransaction;
        // Get transaction
        latestTransaction = await Transaction.findOne({
            chargePoint: chargePointInfo,
            admin,
            connectorInfo,
        }).sort({
            createdAt: -1,
        });
        if (latestTransaction) {
            if (!latestTransaction.stopTime) {
                return res.status(404).json({ msg: "Connector is Occupied" });
            }
        }

        if (!chargePointInfo.ocppVersion) {
            return res.status(404).json({ msg: "ChargePoint not connected" });
        }

        // Run respective function depending on the protocol
        if (chargePointInfo.ocppVersion == "ocpp1.6") {
            await remoteStartTransaction16(
                chargePointInfo,
                ws,
                res,
                idTag,
                connectorId
            );
        } else if (
            chargePointInfo.ocppVersion == "ocpp2.0" ||
            chargePointInfo.ocppVersion == "ocpp2.0.1"
        ) {
            return;
        }
    }
);

// Remote Stop Transaction handler
app.post(
    "/admin/stopTransaction/:connectorId",
    adminAuthorization,
    async (req, res) => {
        // Get User Info from request
        const { id } = req.admin;
        // get user info
        const admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).json({ msg: "Admin Not found" });
        }
        // Get admin Rfid from database
        const adminRfid = await RFID.findOne({ admin });
        // // Get Admin from database
        // if (!admin) {
        //     return res.status(404).json({ msg: "Admin not found" });
        // }

        // get connector info
        const connector = req.params.connectorId;

        const connectorInfo = await Connector.findById(connector).populate(
            "chargePoint"
        );

        if (!connectorInfo) {
            return res.status(404).json({ msg: "Connector not found" });
        }

        // Get ChargePoint Info from request
        const connectionId = connectorInfo.chargePoint.connectionId;
        const chargePointKey = connectionId;
        // console.log({
        //     chargePointKey,
        //     clientConnections,
        //     connectorInfo,
        // });
        const ws = clientConnections.get(chargePointKey);
        if (!ws) {
            return res
                .status(404)
                .json({ msg: "Charger has been disconnected" });
        }

        // Get ChargePoint Info from database
        const chargePointInfo = await ChargePointModel.findOne({
            admin,
            connectionId,
        });
        if (!chargePointInfo) {
            return res.status(404).json({ msg: "ChargePoint not found" });
        }

        // let idTag = req.body.idTag || adminRfid.rfid;
        let connectorId = connectorInfo.connectorId || 0;
        // const connector = await Connector.findOne({
        //     chargePoint: chargePointInfo,
        //     connectorId,
        // });
        // If connector is not found don't add connector to the transaction
        let latestTransaction;
        if (connector) {
            // Get transaction
            latestTransaction = await Transaction.findOne({
                chargePoint: chargePointInfo,
                admin,
                connector,
            }).sort({
                createdAt: -1,
            });
            if (!latestTransaction || latestTransaction.stopTime) {
                return res.status(404).json({ msg: "No transaction to Stop" });
            }
        } else {
            // Get transaction
            latestTransaction = await Transaction.findOne({
                chargePoint: chargePointInfo,
                admin,
            }).sort({
                createdAt: -1,
            });
            if (!latestTransaction || latestTransaction.stopTime) {
                return res.status(404).json({ msg: "No transaction to Stop" });
            }
        }
        let transactionId =
            req.body.transactionId || latestTransaction.transactionUniqueId;

        if (!chargePointInfo.ocppVersion) {
            return res.status(404).json({ msg: "ChargePoint not connected" });
        }

        // Run respective function depending on the protocol
        if (chargePointInfo.ocppVersion == "ocpp1.6") {
            await remoteStopTransaction16(
                chargePointInfo,
                ws,
                res,
                transactionId,
                connectorId
            );
        } else if (
            chargePointInfo.ocppVersion == "ocpp2.0" ||
            chargePointInfo.ocppVersion == "ocpp2.0.1"
        ) {
            return;
        }
    }
);

// User Start Transaction handler
app.post(
    "/user/startTransaction/:connectorId",
    userAuthorization,
    async (req, res) => {
        // Get User Info from request
        const { id } = req.user;
        // get user info
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User Not found" });
        }
        if (user.balance <= 0) {
            return res.status(404).json({ msg: "Fund your Account" });
        }
        // Get admin Rfid from database
        const userRfid = await RFID.findOne({ user });

        const connector = req.params.connectorId;

        const connectorInfo = await Connector.findById(connector).populate(
            "chargePoint"
        );

        if (connectorInfo.rate) {
            const rate = await Rate.findById(connectorInfo.rate);
            if (rate) {
                const chargingTime = user.balance / rate.price;
                const chargingTimeInMilliSeconds = chargingTime * 3600000;
                // if chargingTimeInMilliSeconds is less than 1 minute then block the user
                if (chargingTimeInMilliSeconds < 300000) {
                    return res
                        .status(404)
                        .json({
                            msg: "Fund your Account, you can't charge for more than 5 minute with balance in your account",
                        });
                }
            }
        }

        if (!connectorInfo) {
            return res.status(404).json({ msg: "Connector not found" });
        }
        if (connectorInfo.lastStatus != "Available") {
            return res.status(404).json({ msg: "Connector is in use" });
        }

        // Get ChargePoint Info from request
        const connectionId = connectorInfo.chargePoint.connectionId;
        const chargePointKey = connectionId;
        const ws = clientConnections.get(chargePointKey);
        if (!ws) {
            return res
                .status(404)
                .json({ msg: "Charger has been disconnected" });
        }

        // Get ChargePoint Info from database
        const chargePointInfo = await ChargePointModel.findOne({
            // admin,
            connectionId,
        });
        if (!chargePointInfo) {
            return res.status(404).json({ msg: "ChargePoint not found" });
        }
        // get admin of chargePoint
        const admin = await Admin.findById(chargePointInfo.admin);
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }
        // get admin Rfid from database
        const adminRfid = await RFID.findOne({ admin });

        // make admin rfid as parent rfid for user
        userRfid.parentRFID = adminRfid.rfid;

        // Get connectorId from request query, convert to number and set to 0 if not provided
        let connectorId = Number(req.body.connectorId);
        if (!connectorId) {
            return res.status(400).json({ msg: "ConnectorId not provided" });
        }
        // const connector = await Connector.findOne({
        //     chargePoint: chargePointInfo,
        //     connectorId,
        // });

        let idTag = userRfid.rfid;

        // If connector is not found don't add connector to the transaction
        let latestTransaction;
        // Get transaction
        latestTransaction = await Transaction.findOne({
            chargePoint: chargePointInfo,
            connectorInfo,
            // startRFID: idTag,
            admin,
        }).sort({
            createdAt: -1,
        });
        if (latestTransaction) {
            if (!latestTransaction.stopTime) {
                return res.status(404).json({ msg: "Connector is Occupied" });
            }
        }

        if (!chargePointInfo.ocppVersion) {
            return res.status(404).json({ msg: "ChargePoint not connected" });
        }

        await userRfid.save();

        // Run respective function depending on the protocol
        if (chargePointInfo.ocppVersion == "ocpp1.6") {
            await remoteStartTransaction16(
                chargePointInfo,
                ws,
                res,
                idTag,
                connectorId
            );
        } else if (
            chargePointInfo.ocppVersion == "ocpp2.0" ||
            chargePointInfo.ocppVersion == "ocpp2.0.1"
        ) {
            return;
        }
    }
);

// User Stop Transaction handler
app.post(
    "/user/stopTransaction/:connectorId",
    userAuthorization,
    async (req, res) => {
        // Get User Info from request
        const { id } = req.user;
        // get user info
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "User Not found" });
        }
        // Get admin Rfid from database
        const userRfid = await RFID.findOne({ user });
        // // Get Admin from database
        // if (!admin) {
        //     return res.status(404).json({ msg: "Admin not found" });
        // }

        // get connector info
        const connector = req.params.connectorId;

        const connectorInfo = await Connector.findById(connector).populate(
            "chargePoint"
        );

        if (!connectorInfo) {
            return res.status(404).json({ msg: "Connector not found" });
        }

        // Get ChargePoint Info from request
        const connectionId = connectorInfo.chargePoint.connectionId;
        const chargePointKey = connectionId;
        // console.log({
        //     chargePointKey,
        //     clientConnections,
        //     connectorInfo,
        // });
        const ws = clientConnections.get(chargePointKey);
        if (!ws) {
            return res
                .status(404)
                .json({ msg: "Charger has been disconnected" });
        }

        // Get ChargePoint Info from database
        const chargePointInfo = await ChargePointModel.findOne({
            // admin,
            connectionId,
        });
        if (!chargePointInfo) {
            return res.status(404).json({ msg: "ChargePoint not found" });
        }

        // let idTag = req.body.idTag || adminRfid.rfid;
        let connectorId = connectorInfo.connectorId;
        // const connector = await Connector.findOne({
        //     chargePoint: chargePointInfo,
        //     connectorId,
        // });
        // If connector is not found don't add connector to the transaction
        let latestTransaction;
        if (connector) {
            // Get transaction
            latestTransaction = await Transaction.findOne({
                chargePoint: chargePointInfo,
                startRFID: userRfid.rfid,
                connector,
            }).sort({
                createdAt: -1,
            });
            if (!latestTransaction || latestTransaction.stopTime) {
                return res.status(404).json({ msg: "No transaction to Stop" });
            }
        } else {
            return res.status(404).json({ msg: "Connector not found" });
        }
        let transactionId = latestTransaction.transactionUniqueId;

        if (!chargePointInfo.ocppVersion) {
            return res.status(404).json({ msg: "ChargePoint not connected" });
        }

        // Run respective function depending on the protocol
        if (chargePointInfo.ocppVersion == "ocpp1.6") {
            await remoteStopTransaction16(
                chargePointInfo,
                ws,
                res,
                transactionId,
                connectorId
            );
        } else if (
            chargePointInfo.ocppVersion == "ocpp2.0" ||
            chargePointInfo.ocppVersion == "ocpp2.0.1"
        ) {
            return;
        }
    }
);

// ######################################################################################################
// ######################################################################################################
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
