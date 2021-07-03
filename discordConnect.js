const Discord = require("discord.js");
const config = require("./config.json");

const client = new Discord.Client();

const main = (callback, error) => {

    client.login(config.BOT_TOKEN)
        .then(() => {
            callback(client)
        })
        .catch((err) => {
            error(err)
        })

}

module.exports.main = main;