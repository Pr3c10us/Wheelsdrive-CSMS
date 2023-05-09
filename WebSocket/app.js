const { Socket } = require("dgram");
const express = require("express");
const app = express();
const port = 9000;

const http = require("http");
const server = http.createServer(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

const handlingEndpoint = async () => {
  await server.listen(port, () => console.log("server listening on port 9000"));

  const connection = new Map();

  wss.on("connection", (ws, request) => {
    console.log("Established a new connection with");

    let endpoint = request.url;
    endpoint = endpoint.replace("/", "");
    console.log(endpoint);

    connection.set(endpoint, ws);

    const now = new Date();
    const isoDate = now.toISOString();

    ws.on("message", (msg) => {
      const data = JSON.parse(msg);

      if (data[2] === "BootNotification") {
        ws.send(
          JSON.stringify([
            3,
            data[1],
            {
              currentTime: isoDate,
              interval: 20,
              status: "Accepted",
              reason: "PowerUp",
            },
          ])
        );
      }
      if (data[2] === "Authorize") {
        ws.send(
          JSON.stringify([
            3,
            data[1],
            {
              idTagInfo: { status: "Accepted" },
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
    console.log(connection.keys());
    ws.on("close", () => {
      console.log(`WebSocket connection closed with client ${endpoint}`);
      connection.delete(endpoint);
    });
  });
};

handlingEndpoint();
