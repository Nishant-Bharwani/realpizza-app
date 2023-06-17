require('dotenv').config({
    path: '../.env'
});
const { HOST } = require('./config');
const path = require('path');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRouter = require('./routes/auth-route');
const pizzaRouter = require('./routes/pizza-router');
const dbConnect = require('./db/conn');
const orderRouter = require('./routes/order-router');
const adminRouter = require('./routes/admin-router');
const Emitter = require('events');
const { RAZORPAY_KEY_ID } = require('./config');

const app = express();
const server = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
dbConnect();

// app.use(session({
//     secret: 
// }));

app.use(cookieParser());
app.use(cors({
    credentials: true,
    // origin: [`${process.env.CLIENT_URL}`]
}));


// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Credentials', true); // Add this line
//     next();
// });

app.use('/storage', express.static('storage'));





app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/pizza', pizzaRouter);
app.use('/api/admin', adminRouter)
app.use('/api/order', orderRouter);



app.get('/api/razorpay/getKey', (req, res) => {
    res.status(200).json({
        key: RAZORPAY_KEY_ID
    });
});


// if (process.env.NODE_ENV === "production") {
app.use(express.static(path.resolve(__dirname, "../frontend/build")));
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")));
// }

server.listen(PORT, HOST, function(err) {
    if (err) return console.log(err);
    console.log(`Listening on http://${HOST}:${PORT}`);
});


const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

const io = require('./socket.js').init(server);
io.on('connection', (socket) => {
    console.log(socket.id);


    socket.on('join', (orderId) => {
        console.log(orderId);
        socket.join(orderId);
    });
});


eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.orderId}`).emit('orderUpdated', data);
});

eventEmitter.on('orderConfirmedCart', (data) => {
    io.to(`adminOrderPage`).emit('orderConfirmedCart', data);
});

eventEmitter.on('orderConfirmed', (data) => {
    io.to('adminOrderPage').emit('orderConfirmed', data);
})

module.exports = { io };