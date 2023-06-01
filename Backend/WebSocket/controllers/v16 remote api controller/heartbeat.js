export const remoteHeartbeat16 = async (req, res) => {
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
}