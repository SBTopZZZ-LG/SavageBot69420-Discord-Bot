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
        const axios = require("axios").default

        try {
            axios.get("https://api.quotable.io/random", {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                responseType: "json"
            }).then(response => {
                const quote = response.data["content"]
                const author = response.data["author"]
                callback([null, quote, author])
            }).catch(e => callback([e, null, null]))
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