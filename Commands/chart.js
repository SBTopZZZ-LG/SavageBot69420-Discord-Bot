const Command = require("../Libs/command")

class Chart extends Command {
    constructor(message) {
        const regex = /^sb=chart[ \n]*\[([0-9,]+)][ ]*\[([a-zA-Z0-9\-_, ]+)\][ \n]*$/

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
            const grps = content.match(this.regex)
            const values = grps[1].toString().trim()
            const labels = grps[2].split(',').join('|').split(' ').join('%20').toString()

            if (values.split(',').length != labels.split('|').length)
                return callback([1, null])

            axios.get(`https://image-charts.com/chart?cht=p3&chs=600x600&chd=t:${values}&chl=${labels}`, {
                method: "GET",
                responseType: "arraybuffer"
            }).then(response => {
                callback([null, Buffer.from(response.data, 'binary')])
            }).catch(e => callback([err, null]))
        } catch (e) {
            callback([e, null])
        }
    }

    finalize(args) {
        const err = args[0]
        const body = args[1]

        if (err)
            if (err == 1)
                return this.message.reply("Please make sure that the number of values and the number of labels specified match.")
            else
                return this.message.reply("Sorry, cannot load any charts right now!")

        return this.message.reply("There ya go!", { files: [body] })
    }
}

module.exports = Chart