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

const ALL = [Give, Roast, Joke, Chart, Remind, Woof, Meow]
//

discordConnect.main((client) => {
    console.log("Logged In")

    expressHost.startServer((PORT) => {
        console.log("Express Server running on port", PORT)
    })

    client.on("message", (message) => {
        if (message.author.bot) return;

        for (var cmd of ALL) {
            var cmd_inst = new cmd(message)
            if (cmd_inst.begin())
                break
        }
    })
}, (err) => {
    console.log("Failure")
    console.log(err)
})