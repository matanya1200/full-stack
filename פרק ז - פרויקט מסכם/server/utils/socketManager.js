const socketIO = require('socket.io');
const db = require('../db');
const { decodeToken } = require('../middlewares/authMiddleware');

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
                origin: "http://localhost:5173",
                methods: ["GET", "POST"],
                credentials: true,
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

        this.io.use(async (socket, next) => {
          try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
            
            const user = decodeToken(token); // your existing verify
            socket.user = user;            // { id, email, role, name }
            
            next();
          } catch {
            next(new Error('Unauthorized'));
          }
        });

        this.io.on('connection', (socket) => {
          const { id, role } = socket.user;
          
          // map by userId from token (not provided by client)
          if (!this.userSockets.has(id)) {
            this.userSockets.set(id, new Set());
            this.notifyAdmins("onlineUsers", { users: this.userSockets.size });
          }
          this.userSockets.get(id).add(socket);
      
          if (role === 'admin') {
            socket.emit('purchaseFeedBulk', this.purchaseFeedBuffer);
            socket.emit('onlineUsers', { users: this.userSockets.size });
          }
      
          socket.on('disconnect', () => {
            const set = this.userSockets.get(id);
            if (set) {
              set.delete(socket);
              if (set.size === 0) {
                this.userSockets.delete(id);
                this.notifyAdmins("onlineUsers", { users: this.userSockets.size });
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
