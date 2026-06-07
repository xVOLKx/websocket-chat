const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const messages = [];

io.on('connection', (socket) => {
    console.log('✅ Пользователь подключился');

    socket.emit('history', messages);

    socket.on('chat message', (msg) => {
        const fullMsg = { text: msg, time: new Date().toLocaleTimeString() };
        messages.push(fullMsg);
        io.emit('chat message', fullMsg);
    });

    socket.on('disconnect', () => {
        console.log('❌ Пользователь отключился');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Чат запущен на http://localhost:${PORT}`);
});