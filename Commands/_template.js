const Command = require("../Libs/command")

// Other
const Funcs = require("../Libs/funcs")

class _Template extends Command {
    constructor(message) {
        const regex = /^\/give$/

        super(message, regex)
    }

    begin() {
        if (!this.message.content.toString().match(this.regex))
            return false

        this.process(this.message.content.toString(), (args) => {
            this.finalize(args)
        })

        return true
    }

    process(content, callback) {

    }

    finalize(args) {
        const err = args[0]

        if (err)
            return this.message.reply("Sorry, cannot load a <something> right now!")
    }
}

module.exports = _Template