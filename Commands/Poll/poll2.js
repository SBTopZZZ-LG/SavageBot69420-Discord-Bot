const Command = require("../../Libs/command")

class Poll2 extends Command {
    constructor(client, message, options) {
        super(message, null)

        this.client = client
        this.options = options
        this.voters = []
    }

    begin() {
        var msg = ""
        msg += "----------Poll----------\n"
        for (var i = 0; i < this.options.length; i++)
            msg += (i + 1) + " -> " + this.options[i] + '\n'

        msg += "Cast your votes now!\n"

        this.message.reply(msg)

        this.process(this.message.content.toString(), (args) => {
            this.finalize(args)
        })

        return true
    }

    vote(message) {
        const author = message.author.toString()

        if (this.voters.includes(author))
            return message.reply("Looks like you have already passed your vote.")

        this.voters.push(author)

        // Delete message
        message.delete()

        message.channel.send("<@" + author + "> has voted!")
    }

    process(content, callback) {
        try {
            const channel = this.message.channel.id.toString()
            const list = this.client.guilds.get(channel)

            console.log(list)
        } catch (e) {
            callback([e])
        }
    }

    finalize(args) {
        const err = args[0]

        if (err)
            return this.message.reply("Sorry, cannot load a <something> right now!")
    }
}

module.exports = Poll2