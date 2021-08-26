const Command = require("../Libs/command")

class Woof extends Command {
    constructor(message) {
        const regex = /^\/woof$/

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
                url: "https://dog.ceo/api/breeds/image/random",
                encoding: null
            }, (err, res, body) => {
                if (err)
                    return callback([err, null])

                const link = JSON.parse(body.toString())["message"]

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
            return this.message.reply("Sorry, but I can't get doggo images at the moment!")

        return this.message.reply("There ya go! :)", { files: [link] })
    }
}

module.exports = Woof