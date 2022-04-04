const Command = require("../Libs/command")

class Meow extends Command {
    constructor(message) {
        const regex = /^sb=meow[ \n]*$/

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
            axios.get("https://api.thecatapi.com/v1/images/search", {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                responseType: "json"
            }).then(response => {
                const link = response.data[0]["url"]
                callback([null, link])
            }).catch(e => callback([e, null]))
        } catch (e) {
            callback([e, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const link = args[1]

        if (err)
            return this.message.reply("Sorry, but I can't get catto images at the moment!")

        return this.message.reply("There ya go! :)", { files: [link] })
    }
}

module.exports = Meow