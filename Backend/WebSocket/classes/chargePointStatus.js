class chargePointStatus {
    constructor(chargePointInfo) {
        this.Id = chargePointInfo._id;
        this.Protocol = null;
        this.WebSocket = null;
    }
}

module.exports = chargePointStatus;
