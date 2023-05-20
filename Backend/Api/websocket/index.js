// Import chargepoint model
// const ChargePoint = require("../models/chargepoint");

// Create a map to store all connected clients
const clients = new Map();

// Create websocket handler function
const webSocketHandler = async (wss, chargePointModel, app) => {
    wss.on("connection", async (ws, request) => {
        // ######################################################################################################
        // ######################################################################################################
        // STORE WEBSOCKET CONNECTIONS IN A MAP WITH A UNIQUE KEY OF USERID AND CHARGEPOINT ENDPOINT COMBINED FOR EACH CLIENT

        // Get user id and charge point endpoint from request url
        const endpoint = request.url;
        const userId = endpoint.split("/")[1];
        const chargePointEndpoint = endpoint.split("/")[2];

        // ######################################################################################################
        // ######################################################################################################
        // CHECK IF THE CLIENT IS IN OUR DATABASE AND IF IT HAS A CLIENT CERTIFICATE
        // IF IT HAS A CLIENT CERTIFICATE, CHECK IF IT MATCHES THE CLIENT CERTIFICATE IN THE DATABASE
        // IF IT DOES NOT MATCH, CLOSE THE CONNECTION AND REMOVE THE CLIENT FROM THE MAP

        // // Find the chargepoint in the database
        // const chargePoint = await chargePointModel.findOne({
        //     admin: userId,
        //     endpoint: chargePointEndpoint,
        // }); // VERY IMPORTANT VARIABLE

        // if (chargePoint) {
        //     // If chargepoint has clientCertificate
        //     // And it does not matches the clientCertificate in the database
        //     // then close the connection
        //     const checkClientCertificate = async (
        //         clientCertificate,
        //         socket
        //     ) => {
        //         const clientCert = socket.getPeerCertificate();
        //         return (
        //             clientCert &&
        //             clientCert.thumbprint === clientCertificate.toLowerCase()
        //         );
        //     };

        //     if (chargePoint.clientCertificate) {
        //         const certAuthSuccess = await checkClientCertificate(
        //             chargePoint.clientCertificate,
        //             request.socket
        //         );
        //         if (!certAuthSuccess) {
        //             clients.delete(chargePointKey);
        //             ws.close();
        //             return;
        //         }
        //     }
        // } else {
        //     // If chargepoint is not found in the database, close the connection
        //     // remove client from map
        //     clients.delete(chargePointKey);
        //     ws.close();
        //     return;
        // }

        // ######################################################################################################
        // ######################################################################################################
        // Get Protocol from websocket connection

        const ocppProtocol = ws.protocol; // VERY IMPORTANT VARIABLE
        // If the ocppProtocol is not ocpp1.6, ocpp2.0 or ocpp2.0.1 close the connection
        if (
            ocppProtocol !== "ocpp1.6" &&
            ocppProtocol !== "ocpp2.0" &&
            ocppProtocol !== "ocpp2.0.1"
        ) {
            clients.delete(chargePointKey);
            ws.close();
            return;
        }

        // ######################################################################################################
        // ######################################################################################################
        // IF THE STATUS IS SUCCESS, HANDLE MESSAGES WITH THE CORRECT OCPP PROTOCOL

        if (ocppProtocol === "ocpp1.6") {
            ws.on("message", (msg) => {
                const data = JSON.parse(msg);

                const now = new Date();
                const isoDate = now.toISOString();

                if (data[2] === "BootNotification") {
                    ws.send(
                        JSON.stringify([
                            3,
                            data[1],
                            {
                                status: "Accepted",
                                currentTime: isoDate,
                                interval: 300,
                            },
                        ])
                    );
                }
                if (data[2] === "Heartbeat") {
                    ws.send(
                        JSON.stringify([
                            3,
                            data[1],
                            {
                                currentTime: isoDate,
                            },
                        ])
                    );
                }
                console.log(data);
            });
        } else if (ocppProtocol === "ocpp2.0" || ocppProtocol === "ocpp2.0.1") {
            console.log("first if");
        }

        // ######################################################################################################
        // ######################################################################################################
        // IF THE WEBSOCKET CONNECTION IS CLOSED, REMOVE THE CLIENT FROM THE MAP

        ws.on("close", () => {
            // Remove the client from the map
            clients.delete(chargePointKey);
        });
    });
};

// Export websocket handler function
module.exports = { webSocketHandler, clients };
