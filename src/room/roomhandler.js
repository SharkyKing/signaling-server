const peerConnections = {};

const roomHandler = (io) => (socket) => {
  console.log('A user connected:', socket.id);

  // Handle join-room event
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle offer event
  socket.on('offer', (data) => {
    const { roomId, offer } = data;
    socket.to(roomId).emit('offer', offer);
  });

  // Handle answer event
  socket.on('answer', (data) => {
    const { roomId, answer } = data;
    socket.to(roomId).emit('answer', answer);
  });

  // Handle ice-candidate event
  socket.on('ice-candidate', (data) => {
    const { roomId, candidate } = data;
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
};

module.exports = roomHandler;