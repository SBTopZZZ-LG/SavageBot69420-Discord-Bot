class Command {
    constructor(message, regex) {
        this.message = message
        this.regex = regex
    }

    begin() { }

    async process(message) { }
    process(message, callback) { }

    finalize(args) { }
}

module.exports = Command