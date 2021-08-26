const insults = require("../Structs/insults.json")["insults"]

class Funcs {
    static getReply() {
        const replies = ["There ya go!", "Have fun!", "Ofcourse!", "Sending 'em riiiiiiight now!", "Anytime friend :)", "L. A. U. G. H. Laugh!"]

        return replies[Math.floor(Math.random() * replies.length)]
    }

    static getInsult() {
        return insults[Math.floor(Math.random() * insults.length)]
    }

    static getDenial() {
        const denials = ["Hmmm.... Nah!", "I don't remember asking you.", "And so who the fuck asked you?", "Eat a pile of shut the fuck up.",
            "Why do I care?", "None of your business, pal!", "*sigh* Sure.", "I don't remember roasting anyone. Do you?"]

        return denials[Math.floor(Math.random() * denials.length)]
    }
}

module.exports = Funcs