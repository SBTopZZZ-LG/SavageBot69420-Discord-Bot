const Command = require("../Libs/command")

// Other
const Funcs = require("../Libs/funcs")

class Roast extends Command {
    constructor(message) {
        const regex = /^sb=roast[ \n]*<@!(\d+)>[ \n]*$/

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
        try {
            const tag_id = content.match(this.regex)[1]

            callback([null, tag_id])
        } catch (e) {
            callback([e, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const tag_id = args[1]

        if (err)
            return this.message.reply("Sorry, cannot roast anyone at the moment!")

        return this.message.channel.send("<@" + tag_id + ">, " + Funcs.getInsult())
    }
}

module.exports = Roast