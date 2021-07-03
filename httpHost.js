const http = require("http")

const PORT = process.env.PORT || 3000

function startServer(callback, onRequestCallback) {
    const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

        onRequestCallback(res)
    });

    server.listen(PORT, "127.0.0.1", () => {
        callback(PORT)
    })
}

module.exports.startServer = startServer