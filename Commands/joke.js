const Command = require("../Libs/command")

class Joke extends Command {
    constructor(message) {
        const regex = /^\/joke[ \n]*$/

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
        const grps = content.match(this.regex);
        const categories = grps[1] && grps[1].toString().split(" ").join()

        const axios = require("axios").default

        try {
            axios.get(`https://v2.jokeapi.dev/joke/Any?type=twopart${categories ? `&blacklistFlags=${categories}` : ""}`, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                },
                responseType: "json"
            }).then(response => {
                const setup = response.data["setup"]
                const delivery = response.data["delivery"]

                callback([null, setup, delivery])
            }).catch(e => callback([e, null, null]))
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