const emailToSocketIDMap = new Map();
const socketIDToEmailMap = new Map();

const LogEventHeader = (eventName, isStart) => {
    console.log('===================================================================================================');
    console.log(eventName, isStart ? 'START' : 'END');
    console.log('===================================================================================================');
}

const ErrorOutput = (errorFrom, error) => {
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
    console.error('Error in', errorFrom, 'event:', error);
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
}

const MapSocketToEmail = (socket, email) => {
    console.log('MAPPING USER -', email, '- TO SOCKETID -', socket.id, '-');
    emailToSocketIDMap.set(email, socket.id);
    socketIDToEmailMap.set(socket.id, email);
    console.log(emailToSocketIDMap)
}

const BroadcastToRoom = (socket, roomID ,eventMessage, data) => {
    console.log('BROADCASTING USER:JOINED TO ROOM -', roomID);
    socket.to(roomID).emit(eventMessage, data);
}

const SocketJoinRoom = (socket, roomID) => {
    console.log('SOCKET -', socket.id, '- CONNECTING TO ROOM -', roomID);
    socket.join(roomID);
}

const SendDataBackToSocket = (io, socket, eventMessage, data) => {
    console.log('SENDING DATA OUT BACK TO SOCKET -', socket.id, '-', data);
    io.to(socket.id).emit(eventMessage, data);
}

const SendDataToAnotherSocket = (io, to, eventMessage, data) => {
    console.log('SENDING DATA TO SOCKET -', to, '-', data);
    io.to(to).emit(eventMessage, data)
}

const GetRoomMembers = (io, roomID) => {
    const clients = io.sockets.adapter.rooms.get(roomID) || new Set();
    const clientsArray = Array.from(clients);
    console.log(`Clients in room ${roomID}:`, clientsArray);

    return clientsArray;
}
module.exports = {
    LogEventHeader,
    ErrorOutput,
    MapSocketToEmail,
    BroadcastToRoom,
    SocketJoinRoom,
    SendDataBackToSocket,
    SendDataToAnotherSocket,
    GetRoomMembers
};