import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    initialize(token) {
        // Connect to the WebSocket server
        this.socket = io('http://localhost:3000', {
            transports: ['websocket'],
            auth: { token },
            withCredentials: true,
        });
        console.log("connected to server with token: ", token);

        this.socket.on('connect', () => {
            console.log("successfully connected to server");
            this.isConnected = true;
        });

        this.socket.on('disconnect', () => {
            this.isConnected = false;
        });

        // Listen for various events
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.socket.on('cartUpdated', (_) => {
            const relevantPaths = ['/cart', '/carts']; // Add all cart-related routes
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("cart updated - refreshing");
                sessionStorage.setItem('notification', 'עגלה עודכנה!');
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
                sessionStorage.setItem('notification', 'מוצר עודכן!');
                window.location.reload();
            }
        });

        this.socket.on('departmentUpdated', (_) => {
            const relevantPaths = ['/department'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("department updated - refreshing");
                sessionStorage.setItem('notification', 'מחלקה עודכנה!');
                window.location.reload();
            }
        });

        this.socket.on('userUpdated', (_) => {
            const relevantPaths = ['/user', '/users'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("user updated - refreshing");
                sessionStorage.setItem('notification', 'משתמש עודכן!');
                window.location.reload();
            }
        });

        this.socket.on('rankingUpdated', (_) => {
            const relevantPaths = ['/rank', '/products']; // check paths
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("rating updated - refreshing");
                sessionStorage.setItem('notification', 'דירוג עודכן!');
                window.location.reload();
            }
        });

        this.socket.on('restockUpdated', (_) => {
            const relevantPaths = ['/Restock', '/pendingRestock'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("restock updated - refreshing");
                sessionStorage.setItem('notification', 'בקשת מלאי עודכנה!');
                window.location.reload();
            }
        });

        this.socket.on('paymentUpdated', (_) => {
            const relevantPaths = ['/payment'];
            if (relevantPaths.includes(window.location.pathname)) {
                console.log("payment updated - refreshing");
                sessionStorage.setItem('notification', 'שיטת תשלום עודכנה!');
                window.location.reload();
            }
        });

        this.socket.on('onlineUsers', (data) => {
            sessionStorage.setItem('onlineUsers', JSON.stringify(data));
        });

        this.socket.on('purchaseFeedBulk', (feed) => {
            sessionStorage.setItem('purchaseFeed', JSON.stringify(feed));
        });

        this.socket.on('purchaseFeed', (purchase) => {
            let feed = JSON.parse(sessionStorage.getItem('purchaseFeed') || "[]");
            feed.unshift(purchase);
            sessionStorage.setItem('purchaseFeed', JSON.stringify(feed));
            // Optional: trigger a UI refresh if on admin dashboard
        });

        this.socket.on('stockUpdate', ({ productId, newStock }) => {
            console.log(`Product ${productId} stock changed: ${newStock}`);
            // If you're on a product page, update stock state or reload if needed
            if (window.location.pathname.startsWith("/products")) {
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
