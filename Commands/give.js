const Command = require("../Libs/command")

// Other
const Funcs = require("../Libs/funcs")

class Give extends Command {
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
        const http = require('http')

        try {
            const req = http.request({ hostname: "meme-api.herokuapp.com", port: 80, path: "/gimme", method: "GET" }, res => {
                res.on('data', d => {
                    const url = JSON.parse(d.toString())["url"]

                    callback([null, url])
                })
            })

            req.on('error', err => {
                console.error(err)

                callback([err, null])
            })

            req.end()
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