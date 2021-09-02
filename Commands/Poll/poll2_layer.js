const Command = require("../../Libs/command")
const PollData = require("./poll_data")

class Poll2_Layer extends Command {
    constructor(message) {
        const regex = /^\/vote[ ]*(\d+)$/

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
        const channel = this.message.channel.id.toString()

        var poll = PollData.data[channel]

        if (!poll)
            return callback([null, false])

        poll.vote(this.message)

        callback([null, true])
    }

    finalize(args) {
        const err = args[0]
        const poll_exists = args[1]

        if (err)
            return this.message.reply("Sorry, cannot cast any votes right now!")

        if (!poll_exists)
            return this.message.reply("To cast a vote, please initiate a poll beforehand.")
    }
}

module.exports = Poll2_Layer