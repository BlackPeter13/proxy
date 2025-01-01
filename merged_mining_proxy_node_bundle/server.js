
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const net = require('net');

const CONFIG = {
    coins: {
        BTC: { host: 'btc-pool.example.com', port: 3333 },
        BCH: { host: 'bch-pool.example.com', port: 3334 },
        BCA: { host: 'bca-pool.example.com', port: 3335 },
    },
    proxy: { port: 8080 },
    web: { port: 5000 },
};

let logs = [];
let stats = { sharesSubmitted: 0, hashRate: 0 };

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(express.static('public'));

app.get('/stats', (req, res) => {
    res.json(stats);
});

io.on('connection', (socket) => {
    socket.emit('initialLogs', logs);
    socket.emit('statsUpdate', stats);
    console.log('Client connected to WebSocket');
});

function addLog(message) {
    logs.push(message);
    if (logs.length > 100) logs.shift();
    io.emit('logUpdate', { message });
}

function updateStats(shares, hashRate) {
    stats.sharesSubmitted += shares;
    stats.hashRate = hashRate;
    io.emit('statsUpdate', stats);
}

const proxyServer = net.createServer((minerSocket) => {
    const clientAddress = minerSocket.remoteAddress + ':' + minerSocket.remotePort;
    addLog(`New miner connected: ${clientAddress}`);
    updateStats(1, 50.5);

    minerSocket.on('data', (data) => {
        console.log(`Received data from miner: ${data}`);
    });

    minerSocket.on('close', () => {
        addLog(`Miner disconnected: ${clientAddress}`);
    });
});

proxyServer.listen(CONFIG.proxy.port, () => {
    console.log(`Proxy server running on port ${CONFIG.proxy.port}`);
});

server.listen(CONFIG.web.port, () => {
    console.log(`Web server running on port ${CONFIG.web.port}`);
});
