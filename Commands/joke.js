const Command = require("../Libs/command")

class Joke extends Command {
    constructor(message) {
        const regex = /^\/joke$/

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
            const req = http.request({ hostname: "official-joke-api.appspot.com", port: 80, path: "/jokes/ten", method: "GET" }, res => {
                res.on('data', d => {
                    const parsed = JSON.parse(d.toString())[0]
                    const setup = parsed["setup"].toString()
                    const answer = parsed["punchline"].toString()

                    callback([null, setup, answer])
                })
            })

            req.on('error', err => {
                callback([err, null, null])
                message.reply("Sorry, cannot load any jokes right now!")
            })

            req.end()
        } catch (e) {
            callback([e, null, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const setup = args[1]
        const answer = args[2]

        if (err)
            return this.message.reply("Sorry, cannot load a meme right now!")

        this.message.reply(setup);

        setTimeout(() => {
            this.message.reply(answer)
        }, setup.split(' ').length / 3 * 1000)
    }
}

module.exports = Joke