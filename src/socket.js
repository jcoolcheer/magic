const socket = io.connect('http://127.0.0.1:8002/',{'reconnect': false})
module.exports = socket