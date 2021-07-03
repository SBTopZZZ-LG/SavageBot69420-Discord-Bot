const discordConnect = require("./discordConnect")
const httpHost = require("./httpHost")

const http = require("http")

const insults = require("./Structs/insults.json")["insults"]

var fs = require('fs'),
    request = require('request');

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type'])
        console.log('content-length:', res.headers['content-length'])

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

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

discordConnect.main((client) => {
    console.log("Logged In")

    httpHost.startServer((PORT) => {
        console.log("HTTP Server running on port", PORT)
    }, (res) => {
        res.end("Logged In")
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
                message.reply("Whom should I roast? You?")
            }
        }
    })
}, (err) => {
    console.log("Failure")
    console.log(err)
})