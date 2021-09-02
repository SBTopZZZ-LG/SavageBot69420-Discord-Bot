const Command = require("../Libs/command")

class Meow extends Command {
    constructor(message) {
        const regex = /^\/meow[ \n]*$/

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
        const request = require('request')

        try {
            request({
                url: "https://api.thecatapi.com/v1/images/search",
                encoding: null
            }, (err, res, body) => {
                if (err)
                    return callback([err, null])

                const link = JSON.parse(body.toString())[0]["url"]

                callback([null, link])
            })
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