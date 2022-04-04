const Command = require("../Libs/command")

// Other
const Funcs = require("../Libs/funcs")

class Give extends Command {
    constructor(message) {
        const regex = /^sb=give[ \n]*$/

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
            axios.get("https://meme-api.herokuapp.com/gimme", {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                responseType: "json"
            }).then(response => {
                const url = response.data["url"]
                callback([null, url])
            }).catch(e => callback([e, null]))
        } catch (e) {
            callback([e, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const url = args[1]

        if (err)
            return this.message.reply("Sorry, cannot load a meme right now!")

        return this.message.reply(Funcs.getReply(), { files: [url] })
    }
}

module.exports = Give