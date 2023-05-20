// To get OCPP protocol from machine with ws
wss.on("connection", (ws, request) => {
    console.log(ws.protocol);
});

// OCPP remote control to implement
// 1. Change Availability (G03)
// 2. Remote Start Transaction (F01 & F02)
// 3. Remote Stop Transaction (F03)
// 4. Unlock Connector (F05)
// 5. Reset (B11 & B12)

// OCPP local control to implement
// 1. Connection of charger to csms - 
//      1.1. Boot Notification (B01)
//      1.2  Status Notification (B01)
//  2. EV Driver Authorization using RFID (C01)
// 


// OCPP USE CASES we need
// 1. G01
// 2. G02


// when deleting a chargePoint, we need to delete all the connectors associated with it and also the transactions associated with it and also remove the chargePoint from the location
// when deleting a location, we need to delete all the chargePoints associated with it and also the transactions associated with it and also remove the location from the admin
// when 