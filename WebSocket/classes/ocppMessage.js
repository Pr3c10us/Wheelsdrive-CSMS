class OCPPMessage {
    constructor(messageType, uniqueId, action, jsonPayload) {
        this.MessageType = messageType;
        this.UniqueId = uniqueId;
        this.Action = action;
        this.JsonPayload = jsonPayload;
    }

    get MessageType() {
        return this._messageType;
    }

    set MessageType(value) {
        this._messageType = value;
    }

    get UniqueId() {
        return this._uniqueId;
    }

    set UniqueId(value) {
        this._uniqueId = value;
    }

    get Action() {
        return this._action;
    }

    set Action(value) {
        this._action = value;
    }

    get JsonPayload() {
        return this._jsonPayload;
    }

    set JsonPayload(value) {
        this._jsonPayload = value;
    }

    get ErrorCode() {
        return this._errorCode;
    }

    set ErrorCode(value) {
        this._errorCode = value;
    }

    get ErrorDescription() {
        return this._errorDescription;
    }

    set ErrorDescription(value) {
        this._errorDescription = value;
    }

    get TaskCompletionSource() {
        return this._taskCompletionSource;
    }

    set TaskCompletionSource(value) {
        this._taskCompletionSource = value;
    }
}

module.exports = OCPPMessage;