const discordConnect = require("./Libs/discordConnect")
const expressHost = require("./Libs/expressHost")

// Commands
const Give = require("./Commands/give")
const Roast = require("./Commands/roast")
const Joke = require("./Commands/joke")
const Chart = require("./Commands/chart")
const Remind = require("./Commands/remind")
const Woof = require("./Commands/woof")
const Meow = require("./Commands/meow")
const Quote = require("./Commands/quote")
const Poll = require("./Commands/Poll/poll")
const Poll2_Layer = require("./Commands/Poll/poll2_layer")

const ALL = [Give, Roast, Joke, Chart, Remind, Woof, Meow, Quote]//, Poll, Poll2_Layer]
//

discordConnect.main((client) => {
    console.log("Logged In")

    expressHost.startServer((PORT) => {
        console.log("Express Server running on port", PORT)
    })

    client.on("message", (message) => {
        if (message.author.bot) return;

        if (!message.content.toString().startsWith('sb='))
            return;

        for (var cmd of ALL) {
            var cmd_inst = new cmd(message)

            if (cmd_inst.begin()) {
                console.log("Found!")
                break
            }
        }
    })
}, (err) => {
    console.log("Failure")
    console.log(err)
})