
const phoneToSocketIdMap = new Map();
const socketidToPhoneMap = new Map();

const roomHandler = (io) => (socket) => {
  console.log("Socket [", socket.id, "] connected");

  socket.on("room:join", (data) => {
    const { phone, room } = data;
    phoneToSocketIdMap.set(phone, socket.id);
    socketidToPhoneMap.set(socket.id, phone);
    io.to(room).emit("user:joined", { phone, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
};

module.exports = roomHandler;