const express = require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000

function startServer(callback) {
    app.listen(PORT, () => {
        callback(PORT)
    })

    app.get("/", async (req, res, next) => {
        return res.status(200).send("Running")
    })
}

module.exports.startServer = startServer