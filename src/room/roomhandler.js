const SocketHelper = require('../SocketHelper/SocketHelper');

const handleConnect = (io, socket, { email, roomID }, isGuest) => {
  try {
    SocketHelper.LogEventHeader(handleConnect.name, true);

    const data = { email, roomID };

    SocketHelper.MapSocketToEmail(socket, email);
    SocketHelper.SocketJoinRoom(socket, roomID);
    SocketHelper.BroadcastToRoom(socket, roomID, "participant:joined", { email, remoteSocketID: socket.id });

    if (isGuest) {
      SocketHelper.SendDataBackToSocket(io, socket, "guest:room:joinsuccess", data);
    } else {
      SocketHelper.SendDataBackToSocket(io, socket, "user:room:joinsuccess", data);
    }

    SocketHelper.LogEventHeader(handleConnect.name, false);
  } catch (error) {
    console.error('Error in handleConnect:', error);
  }
};

const handleUserReady = (io, socket, {to, offer}) => {
  SocketHelper.LogEventHeader(handleUserReady.name, true);

  SocketHelper.SendDataToAnotherSocket(io, to, 'user:prepared', {from: socket.id, offer})

  SocketHelper.LogEventHeader(handleUserReady.name, false);
}

const handleGuestCallAccepted = (io, socket, {to, answer}) => {
  SocketHelper.LogEventHeader(handleGuestCallAccepted.name, true);

  SocketHelper.SendDataToAnotherSocket(io, to, 'guestcall:prepared', {from: socket.id, answer})

  SocketHelper.LogEventHeader(handleGuestCallAccepted.name, false);
}

const handlePeerNegoNeeded = (io, socket, {to, offer}) => {
  SocketHelper.LogEventHeader(handlePeerNegoNeeded.name, true);

  SocketHelper.SendDataToAnotherSocket(io, to, 'peer:nego:needed', {from: to, offer})

  SocketHelper.LogEventHeader(handlePeerNegoNeeded.name, false);
}

const handlePeerNegoDone = (io, socket, {to, ans}) => {
  SocketHelper.LogEventHeader(handlePeerNegoDone.name, true);

  SocketHelper.SendDataToAnotherSocket(io, to, 'peer:nego:final', {from: socket.id, ans})

  SocketHelper.LogEventHeader(handlePeerNegoDone.name, false);
}

const roomHandler = (io) => (socket) => {
  console.log("Socket [", socket.id, "] connected");

  const listenEvents = {
    GUESTROOMJOIN: "guest:room:join",
    USERROOMJOIN: "user:room:join",
    USERREADY: "user:ready",
    GUESTCALLACCPETED: "guestcall:accepted",
    PEERNEGONEEDED: "peer:nego:needed",
    PEERNEGODONE: "peer:nego:done"
  };

  socket.on(listenEvents.GUESTROOMJOIN, (data) => {
    try {
      handleConnect(io, socket, data, true);
    } catch (error) {
      SocketHelper.ErrorOutput(listenEvents.GUESTROOMJOIN, error)
    }
  });

  socket.on(listenEvents.USERROOMJOIN, (data) => {
    try {
      handleConnect(io, socket, data, false);
    } catch (error) {
      SocketHelper.ErrorOutput(listenEvents.USERROOMJOIN, error)
    }
  });

  socket.on(listenEvents.USERREADY, (data) =>{
    try{
      handleUserReady(io, socket, data)
    }catch(error){
      SocketHelper.ErrorOutput(listenEvents.USERREADY, error)
    }
  })

  socket.on(listenEvents.GUESTCALLACCPETED, (data) => {
    try{
      handleGuestCallAccepted(io, socket, data)
    }catch(error){
      SocketHelper.ErrorOutput(listenEvents.GUESTCALLACCPETED, error)
    }
  })

  socket.on(listenEvents.PEERNEGONEEDED, (data) => {
    try{
      console.log(data);
      handlePeerNegoNeeded(io, socket, data)
    }catch(error){
      SocketHelper.ErrorOutput(listenEvents.PEERNEGONEEDED, error)
    }
  })

  socket.on(listenEvents.PEERNEGODONE, (data) => {
    try{
      console.log(data);
      handlePeerNegoDone(io, socket, data)
    }catch(error){
      SocketHelper.ErrorOutput(listenEvents.PEERNEGODONE, error)
    }
  })
};

module.exports = roomHandler;
