const config = require("../config");
const io = require('socket.io')(config.PORT_SOCKET || 3001, {
    cors: {
        origin: '*',
    }
})

io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = io;
