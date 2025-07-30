const socketIO = require('socket.io');

class SocketManager {
    constructor() {
        this.userSockets = new Map(); // userId -> Set of socket instances
    }

    initialize(server) {
        this.io = socketIO(server, {
            cors: {
                origin: "*", // In production, replace with your actual client domain
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            socket.on('register', (userId) => {
                if (!userId) return;
                if (!this.userSockets.has(userId)) {
                    this.userSockets.set(userId, new Set());
                }
                this.userSockets.get(userId).add(socket);
                socket.userId = userId;
            });
            socket.on('disconnect', () => {
                if (socket.userId) {
                    const userSockets = this.userSockets.get(socket.userId);
                    if (userSockets) {
                        userSockets.delete(socket);
                        if (userSockets.size === 0) {
                            this.userSockets.delete(socket.userId);
                        }
                    }
                }
            });
        });
    }

    notifyUser(userId, event, data={}) {
        const userSockets = this.userSockets.get(userId);
        if (userSockets) {
            userSockets.forEach(socket => {
                socket.emit(event, data);
            });
        }
    }

    broadcast(event, data={}) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}

module.exports = new SocketManager();
