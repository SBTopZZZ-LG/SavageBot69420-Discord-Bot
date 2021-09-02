const Command = require("../../Libs/command")
const PollData = require("./poll_data")
const Poll2 = require("./poll2")

class Poll extends Command {
    constructor(client, message) {
        const regex = /^\/poll[ ]*([01]{1})[ ]*\[(.+)\]$/

        super(message, regex)

        this.message = message
        this.client = client
    }

    begin() {
        console.log(this.message.content)

        this.channel = this.message.guild.channels.cache.get(args[0].substring(2).substring(0, 18))

        if (!this.message.content.toString().match(this.regex))
            return false

        this.process(this.message.content.toString(), (args) => {
            this.finalize(args)
        })

        return true
    }

    process(content, callback) {
        try {
            if (this.channel in PollData.data)
                return callback([null, false])

            PollData.data[this.channel] = new Poll2(this.client, this.message, content.match(this.regex)[2].split(','))

            return callback([null, true])
        } catch (e) {
            callback([e, false])
        }
    }

    finalize(args) {
        const err = args[0]
        const result = args[1]

        if (err)
            return this.message.reply("Sorry, cannot initiate a poll right now!")

        if (!result)
            return this.message.reply("This channel already has a poll initiated. Cannot initiate multiple polls on one channel.")

        PollData.data[this.channel].begin()
    }
}

module.exports = Poll