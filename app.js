const discordConnect = require("./discordConnect")
const expressHost = require("./expressHost")

const http = require("http")

const insults = require("./Structs/insults.json")["insults"]

var fs = require('fs')

var roastSelfQueue = {}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

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
            const req = http.request({ hostname: "meme-api.herokuapp.com", port: 80, path: "/gimme", method: "GET" }, res => {
                res.on('data', d => {
                    const url = JSON.parse(d.toString())["url"]

                    message.reply(getReply(), { files: [url] });
                })
            })

            req.on('error', err => {
                console.error(err)

                message.reply("Sorry, cannot load a meme right now!")
            })

            req.end()
        } else if (message.content.startsWith("/roast")) {
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
        } else if (message.content.startsWith("/yes")) {
            if (message.channel in roastSelfQueue) {
                var roaster = roastSelfQueue[message.channel]
                message.channel.send("<@" + roaster + ">, " + getInsult())

                delete roastSelfQueue[message.channel]
            } else {
                message.channel.send("<@" + message.author + ">, " + getDenial())
            }
        } else if (message.content.startsWith("/no")) {
            if (message.channel in roastSelfQueue) {
                var roaster = roastSelfQueue[message.channel]
                message.channel.send("<@" + roaster + ">, sure thing.")

                delete roastSelfQueue[message.channel]
            } else {
                message.channel.send("<@" + message.author + ">, " + getDenial())
            }
        }
    })
}, (err) => {
    console.log("Failure")
    console.log(err)
})