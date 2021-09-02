const Command = require("../Libs/command")

class Remind extends Command {
    constructor(message) {
        const regex = /\/remind[ \n]*(\d{1,3}[smh]{1})[ \n]*((?:(?:ne)|e){1})[ \n]*\"(.+)\"[ \n]*/

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
        try {
            const grps = content.match(this.regex);
            const duration = grps[1].toString()
            var tag_flag = grps[2].toString()
            const msg = grps[3].toString()

            if (this.message.channel.type == "dm" && tag_flag == "e") {
                tag_flag = "ne"
            }

            const duration_value = parseInt(duration.substr(0, duration.length - 1)) * (duration.substr(duration.length - 1, 1) == 's' ? 1000 : duration.substr(duration.length - 1, 1) == 'm' ? 60000 : 3600000)

            callback([null, duration_value, msg, tag_flag])
        } catch (e) {
            callback([e, null, null, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const duration_value = args[1]
        const msg = args[2]
        const tag_flag = args[3]

        if (err)
            return this.message.reply("Sorry, cannot set reminders right now!")

        setTimeout(() => {
            if (tag_flag == "ne") {
                this.message.reply("Reminder: " + msg)
            } else {
                this.message.channel.send("@everyone, Reminder: " + msg)
            }
        }, duration_value)

        try {
            this.message.delete()
        } catch (e) { }

        this.message.reply("Reminder set!").then(msg => setTimeout(() => msg.delete(), 5000))
    }
}

module.exports = Remind