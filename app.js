const discordConnect = require("./discordConnect")
const expressHost = require("./expressHost")

var request = require("request"), fs = require("fs")

const http = require("http")

const insults = require("./Structs/insults.json")["insults"]

var fs = require('fs')

var roastSelfQueue = {}, reminderQueue = {}

// Regex
const get_chart_regex = new RegExp(/^\/chart[ ]*\[([0-9,]+)][ ]*\[([a-zA-Z0-9\-_,]+)\]$/)
// const remind_regex_1 = new RegExp(/\/remind[ ]*((?:[0-1]{1})?[0-9|10|11|12]{1}[:]{1}(?:[0-5]{1})?[0-9]{1}[aApP]{1})[ ]*((?:(?:ne)|e){1})[ ]*\"(.+)\"/)
const remind_regex_2 = new RegExp(/\/remind[ ]*(\d{1,3}[smh]{1})[ ]*((?:(?:ne)|e){1})[ ]*\"(.+)\"/)
//

function getReply() {
    const replies = ["There ya go!", "Have fun!", "Ofcourse!", "Sending 'em riiiiiiight now!", "Anytime friend :)", "L. A. U. G. H. Laugh!"]

    return replies[Math.floor(Math.random() * replies.length)]
}

function getInsult() {
    return insults[Math.floor(Math.random() * insults.length)]
}

function getDenial() {
    const denials = ["Hmmm.... Nah!", "I don't remember asking you.", "And so who TF asked you?", "Eat a pile of shut the f+xk up.",
        "Why do I care?", "None of your business, pal!", "*sign* Sure.", "I don't remember roasting anyone. Do you?"]

    return denials[Math.floor(Math.random() * denials.length)]
}

discordConnect.main((client) => {
    console.log("Logged In")

    expressHost.startServer((PORT) => {
        console.log("Express Server running on port", PORT)
    })

    client.on("message", (message) => {
        if (message.author.bot) return;

        if (message.content == "/give") {
            try {
                const req = http.request({ hostname: "meme-api.herokuapp.com", port: 80, path: "/gimme", method: "GET" }, res => {
                    res.on('data', d => {
                        const url = JSON.parse(d.toString())["url"]

                        message.reply(getReply(), { files: [url] })
                    })
                })

                req.on('error', err => {
                    console.error(err)

                    message.reply("Sorry, cannot load a meme right now!")
                })

                req.end()
            } catch (e) { }
        } else if (message.content.startsWith("/roast")) {
            try {
                if (message.mentions.members.first()) {
                    message.channel.send("<@" + message.mentions.members.first() + ">, " + getInsult())
                } else {
                    if (message.channel in roastSelfQueue) {
                        delete roastSelfQueue[message.channel]
                        message.reply(getInsult())
                    } else {
                        roastSelfQueue[message.channel] = message.author
                        message.reply("Whom should I roast? You?")
                    }
                }
            } catch (e) { }
        } else if (message.content.startsWith("/yes")) {
            try {
                if (message.channel in roastSelfQueue) {
                    var roaster = roastSelfQueue[message.channel]
                    message.channel.send("<@" + roaster + ">, " + getInsult())

                    delete roastSelfQueue[message.channel]
                } else {
                    message.channel.send("<@" + message.author + ">, " + getDenial())
                }
            } catch (e) { }
        } else if (message.content.startsWith("/no")) {
            try {
                if (message.channel in roastSelfQueue) {
                    var roaster = roastSelfQueue[message.channel]
                    message.channel.send("<@" + roaster + ">, sure thing.")

                    delete roastSelfQueue[message.channel]
                } else {
                    message.channel.send("<@" + message.author + ">, " + getDenial())
                }
            } catch (e) { }
        } else if (message.content.startsWith("/joke")) {
            try {
                const req = http.request({ hostname: "official-joke-api.appspot.com", port: 80, path: "/jokes/ten", method: "GET" }, res => {
                    res.on('data', d => {
                        const parsed = JSON.parse(d.toString())[0]
                        const setup = parsed["setup"].toString()
                        const answer = parsed["punchline"].toString()

                        message.reply(setup);

                        setTimeout(() => {
                            message.reply(answer)
                        }, setup.split(' ').length / 3 * 1000)
                    })
                })

                req.on('error', err => {
                    console.error(err)

                    message.reply("Sorry, cannot load any jokes right now!")
                })

                req.end()
            } catch (e) { }
        } else if (message.content.toString().match(get_chart_regex)) {
            try {
                const grps = message.content.toString().match(get_chart_regex);
                const values = grps[1].toString().trim()
                const labels = grps[2].split(',').join('|').toString()

                if (values.split(',').length != labels.split('|').length) {
                    message.reply("Please make sure that the number of values and the number of labels specified match.")

                    return;
                }

                request({
                    url: "https://image-charts.com/chart?cht=p3&chs=400x400&chd=t:" + values + "&chl=" + labels,
                    encoding: null
                }, (err, res, body) => {
                    if (err)
                        return console.error(err)

                    message.reply("There ya go!", { files: [body] });
                })
            } catch (e) { }
        } else if (message.content.toString().match(remind_regex_2)) {
            try {
                const grps = message.content.toString().match(remind_regex_2);
                const duration = grps[1].toString()
                var tag_flag = grps[2].toString()
                const msg = grps[3].toString()

                if (message.channel.type == "dm" && tag_flag == "e") {
                    tag_flag = "ne"
                    message.reply("Note: Replying to everyone is not available in DMs. Only you will be notified.")
                }

                const duration_value = parseInt(duration.substr(0, duration.length - 1)) * (duration.substr(duration.length - 1, 1) == 's' ? 1000 : duration.substr(duration.length - 1, 1) == 'm' ? 60000 : 3600000)

                setTimeout(() => {
                    if (tag_flag == "ne") {
                        message.reply("Reminder: " + msg)
                    } else {
                        message.channel.send("@everyone, Reminder: " + msg)
                    }
                }, duration_value)

                message.reply("Reminder set!")
            } catch (e) {
                console.error(e)
            }
        } else if (message.content == "/woof") {
            try {
                request({
                    url: "https://dog.ceo/api/breeds/image/random",
                    encoding: null
                }, (err, res, body) => {
                    if (err)
                        return message.reply("Sorry, but I can't get doggo images at the moment!")

                    const link = JSON.parse(body.toString())["message"]

                    message.reply("There ya go! :)", { files: [link] })
                })
            } catch (e) {

            }
        }
    })
}, (err) => {
    console.log("Failure")
    console.log(err)
})