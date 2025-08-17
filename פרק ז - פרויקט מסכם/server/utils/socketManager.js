const socketIO = require('socket.io');
const db = require('../db');

class SocketManager {
    constructor() {
        this.userSockets = new Map(); // userId -> Set of socket instances
        this.purchaseFeedBuffer = [];
        this.MAX_FEED_ITEMS = 50;
        this._initializedFeed = false;
    }

    async initialize(server) {
        this.io = socketIO(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Populate purchaseFeedBuffer from DB on first init
        if (!this._initializedFeed) {
            try {
                const [orders] = await db.query(`
                    SELECT o.id AS orderId, u.name AS buyer, o.total_price AS total, o.created_at AS time
                    FROM Orders o
                    JOIN Users u ON o.user_id = u.id
                    ORDER BY o.created_at DESC
                    LIMIT ?
                `, [this.MAX_FEED_ITEMS]);
                // Format to match emitPurchase
                this.purchaseFeedBuffer = orders.map(order => ({
                    orderId: order.orderId,
                    buyer: order.buyer,
                    total: order.total,
                    time: order.time
                }));
                this._initializedFeed = true;
            } catch (err) {
                console.error('Failed to load initial purchase feed:', err.message);
            }
        }

        this.io.on('connection', (socket) => {
            socket.on('register', (userId) => {
                if (!userId) return;
                if (!this.userSockets.has(userId)) {
                    this.userSockets.set(userId, new Set());
                    // notify admin(s) when count changes
                    console.log(`notifying admins of user id ${userId}`);
                    this.notifyAdmins("onlineUsers", { users: this.userSockets.size });
                }
                this.userSockets.get(userId).add(socket);
                socket.userId = userId;

                // If this is an admin, send them initial snapshot
                if (userId === 1) { // adjust for your admin ID
                    socket.emit("purchaseFeedBulk", this.purchaseFeedBuffer);
                    socket.emit("onlineUsers", { users: this.userSockets.size });
                }
            });

            socket.on('disconnect', () => {
                if (socket.userId) {
                    const userSockets = this.userSockets.get(socket.userId);
                    if (userSockets) {
                        userSockets.delete(socket);
                        if (userSockets.size === 0) {
                            this.userSockets.delete(socket.userId);
                            console.log(`notifying admins of user id ${socket.userId} disconnecting`);
                            this.notifyAdmins("onlineUsers", { users: this.userSockets.size });
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

    notifyAdmins(event, data={}) {
        this.notifyUser(1, event, data);
    }

    broadcast(event, data={}) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }

    emitPurchase(purchase) {
        this.purchaseFeedBuffer.unshift(purchase);
        if (this.purchaseFeedBuffer.length > this.MAX_FEED_ITEMS) {
            this.purchaseFeedBuffer.pop();
        }
        this.notifyAdmins("purchaseFeed", purchase);
    }

    emitStockUpdate(update) {
        this.broadcast("stockUpdate", update);
    }
}

module.exports = new SocketManager();
