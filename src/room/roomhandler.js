const emailToSocketIDMap = new Map();
const socketIDToEmailMap = new Map();


const handleConnect = (io, socket, { email, roomID }, isGuest) => {
  console.log('===================================================================================================')
  console.log('handleConnect START')
  console.log('===================================================================================================')

  const data = { email, roomID }

  console.log('USER -', email, '- CONNECTING TO ROOM -', roomID, '-');

  console.log('MAPPING USER -',email,'- TO SOCKETID -', socket.id, '-');
  emailToSocketIDMap.set(email, socket.id);

  console.log('MAPPING SOCKETID -',socket.id,'- TO USER -', email, '-');
  socketIDToEmailMap.set(socket.id, email)

  console.log('SOCKET -',socket.id,'- CONNECTING TO ROOM -',roomID);
  socket.join(roomID);

  console.log('BROADCASTING USER:JOINED TO ROOM -',roomID);
  io.to(roomID).emit('participant:joined', {email, remoteSocketID:socket.id});

  console.log('SENDING DATA OUT BACK TO SOCKET -',socket.id,'-',data);
  if(isGuest){
    io.to(socket.id).emit("guest:room:joinsuccess", data)
  }
  else{
    io.to(socket.id).emit("user:room:joinsuccess", data)
  }
  console.log('===================================================================================================')
  console.log('handleConnect END')
  console.log('===================================================================================================')
};

const roomHandler = (io) => (socket) => {
  console.log("Socket [", socket.id, "] connected");

  socket.on("guest:room:join", (data) => handleConnect(io, socket, data,true))
  socket.on("user:room:join", (data) => handleConnect(io, socket, data,false))
};

module.exports = roomHandler;
