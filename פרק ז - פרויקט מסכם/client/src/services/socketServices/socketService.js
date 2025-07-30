import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    initialize(userId) {
        // Connect to the WebSocket server
        this.socket = io('http://localhost:3000'); // Replace with your server URL

        this.socket.on('connect', () => {
            this.isConnected = true;
            if (userId) {
                this.register(userId);
            }
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
        });

        // Listen for various events
        this.setupEventListeners();
    }

    register(userId) {
        if (this.isConnected && userId) {
            this.socket.emit('register', userId);
        }
    }

    setupEventListeners() {
        this.socket.on('cartUpdated', (_) => {
            const relevantPaths = ['/cart', '/carts']; // Add all cart-related routes
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("cart updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('orderUpdated', (_) => {
            const relevantPaths = ['/orders'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("order updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('productUpdated', (_) => {
            console.log(window.location.pathname);
            
            const relevantPaths = ['/product', '/'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("product updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('departmentUpdated', (_) => {
            const relevantPaths = ['/department'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("department updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('userUpdated', (_) => {
            const relevantPaths = ['/user', '/users'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("user updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('rankingUpdated', (_) => {
            const relevantPaths = ['/rank', '/products']; // check paths
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("rating updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('restockUpdated', (_) => {
            const relevantPaths = ['/Restock', '/pendingRestock'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("restock updated - refreshing");
                window.location.reload();
            }
        });

        this.socket.on('paymentUpdated', (_) => {
            const relevantPaths = ['/payment'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("payment updated - refreshing");
                window.location.reload();
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

export default new SocketService();
