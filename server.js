
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

const logs = [];
const stats = {
    BTC: [],
    BCH: [],
    BCA: [],
};

const MAX_HISTORY = 180; // 180 minutes of historical data

// Serve static frontend
app.use(express.static('public'));

// Log and emit messages
const addLog = (message) => {
    logs.push(message);
    if (logs.length > 100) logs.shift();
    io.emit('log_update', { message });
};

const updateStats = (coin, hashRate) => {
    const time = new Date().toLocaleTimeString();
    stats[coin].push({ time, hashRate });
    if (stats[coin].length > MAX_HISTORY) stats[coin].shift();
    io.emit('stats_update', { coin, data: { time, hashRate } });
};

// Simulate Miner Connections and Hash Rates
const simulateMinerUpdates = () => {
    setInterval(() => {
        updateStats("BTC", 50 + Math.random() * 5);
        updateStats("BCH", 25 + Math.random() * 3);
        updateStats("BCA", 15 + Math.random() * 2);
    }, 60000); // Update every 1 minute
};

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('initial_logs', logs);
    socket.emit('initial_stats', stats);
    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
    simulateMinerUpdates();
});
