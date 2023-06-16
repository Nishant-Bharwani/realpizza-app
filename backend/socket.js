let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: `${process.env.CLIENT_URL}`,
                methods: ['GET', "POST"]
            }
        });
        // io.origins('*:*');
        return io;
    },
    get: () => {
        if (!io) {
            throw new Error("socket is not initialized");
        }
        return io;
    }
};