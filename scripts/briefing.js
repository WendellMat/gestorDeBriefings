export class Briefing {
    constructor(identifier, clientName, description, creationTime, state) {
        this.identifier = identifier;
        this.clientName = clientName;
        this.description = description;
        this.creationTime = creationTime;
        this.state = state;
    }

    // Getters
    get identifier() {
        return this._identifier;
    }

    get clientName() {
        return this._clientName;
    }

    get description() {
        return this._description;
    }

    get creationTime() {
        return this._creationTime;
    }

    get state() {
        return this._state;
    }

    // Setters
    set identifier(value) {
        this._identifier = value;
    }

    set clientName(value) {
        this._clientName = value;
    }

    set description(value) {
        this._description = value;
    }

    set creationTime(value) {
        this._creationTime = value;
    }

    set state(value) {
        this._state = value;
    }

    toString() {
        return `Briefing:
    Identifier: ${this._identifier}
    Client Name: ${this._clientName}
    Description: ${this._description}
    Creation Time: ${this._creationTime}
    State: ${this._state}`;
    }
}