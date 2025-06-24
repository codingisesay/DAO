const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const options = {
  key: fs.readFileSync(path.resolve(__dirname, './payvance.co.in.key')),
  cert: fs.readFileSync(path.resolve(__dirname, './payvance.co.in.crt.txt'))
};
const server = https.createServer(options, app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push(socket.id);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal', { sender: socket.id, data });
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      socket.to(roomId).emit('user-left', socket.id);
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
        if (rooms[roomId].length === 0) delete rooms[roomId];
      }
    }
  });
});

server.listen(5000, () => {
  console.log('Signaling server running on port 5000');
});