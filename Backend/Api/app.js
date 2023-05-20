// Import required modules
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import Express
const express = require("express");
const app = express();

// Import modules for webSocket
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

// Import Database connection function
const connectToMongodb = require("../Database");

// Import Websocket handler
const { webSocketHandler } = require("./websocket");

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
// Routes

// HOME ROUTE
app.get("/", (req, res) => {
    res.json({ msg: "Welcome To Wheelsdrive" });
});

// ADMIN ROUTES
const adminAuthRoutes = require("./routes/adminAuth");
app.use("/api/admin/auth", adminAuthRoutes);

// LOCATION ROUTES
const locationRoutes = require("./routes/location");
app.use("/api/location", locationRoutes);

// RATE ROUTES
const rateRoutes = require("./routes/rates");
app.use("/api/rate", rateRoutes);

// CHARGEPOINT ROUTES
const chargePointRoutes = require("./routes/chargePoint");
app.use("/api/chargePoint", chargePointRoutes);

// APIUSER ROUTES
const apiUserRoutes = require("./routes/apiUser");
app.use("/api/apiUser", apiUserRoutes);

// RFID ROUTES
const rfidRoutes = require("./routes/rfid");
app.use("/api/rfid", rfidRoutes);

// ######################################################################################################
// ######################################################################################################
// Handler Middleware

// ROUTE NOT FOUND HANDLER MIDDLEWARE
const routeNotFound = require("./middlewares/routeNotFoundMiddleware");
app.use(routeNotFound);

// ERROR HANDLER MIDDLEWARE
const errorHandler = require("./middlewares/errorHandlerMiddleware");
app.use(errorHandler);

// ######################################################################################################
// ######################################################################################################
// CREATE SERVER
const port = process.env.PORT || 5000;
const serverApp = async () => {
    try {
        await connectToMongodb();
        server.listen(port, () =>
            console.log(`Server listening on port ${port}`)
        );
        // await webSocketHandler(wss)
    } catch (error) {
        console.log(error);
    }
};
serverApp();

// ######################################################################################################
// ######################################################################################################
