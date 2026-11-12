require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const messages = [];

io.on('connection', (socket) => {
    console.log('✅ Пользователь подключился');

    socket.emit('history', messages);

    socket.on('join-room', (room) => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach(r => {
            if (r !== socket.id) socket.leave(r);
        });
        socket.join(room);
        socket.data.room = room;
        console.log(`✅ Пользователь вошёл в комнату: ${room}`);
    });

    socket.on('chat message', (data) => {
        const room = socket.data.room || 'default';
        const fullMsg = {
            text: data.text,
            time: new Date().toLocaleTimeString()
        };
        messages.push(fullMsg);
        io.to(room).emit('chat message', fullMsg);
        console.log(`📩 Сообщение в комнату ${room}: ${data.text}`);
    });

    socket.on('typing', () => {
        const room = socket.data.room || 'default';
        socket.to(room).emit('user-typing');
    });

    socket.on('disconnect', () => {
        console.log('❌ Пользователь отключился');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Чат запущен на порту ${PORT}`);
});