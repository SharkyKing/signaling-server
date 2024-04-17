const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const cors = require('cors')
const dotenv = require('dotenv')

const roomHandler = require('./src/room/roomhandler.js')

dotenv.config();

const port = process.env.PORT;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const handleRoom = roomHandler(io);
io.on('connection', handleRoom);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});