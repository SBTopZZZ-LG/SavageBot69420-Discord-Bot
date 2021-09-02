const Command = require("../Libs/command")

class Quote extends Command {
    constructor(message) {
        const regex = /^\/quote[ \n]*$/

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
        const request = require("request")

        try {
            request({
                url: "https://api.quotable.io/random",
                encoding: null
            }, (err, res, body) => {
                if (err)
                    return callback([err, null, null])

                const quote = JSON.parse(body.toString())["content"]
                const author = JSON.parse(body.toString())["author"]

                callback([null, quote, author])
            })
        } catch (e) {
            callback([e, null, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const quote = args[1]
        const author = args[2]

        if (err)
            return this.message.reply("Sorry, cannot load any quotes right now!")

        this.message.reply("\"" + quote + "\"" + (author ? "\n- " + author : ""))
    }
}

module.exports = Quote