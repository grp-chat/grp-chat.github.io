const http = require ('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 8080;
const RpsGame = require('./rps-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static files from path ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {
    
    if (waitingPlayer) {
        new RpsGame(waitingPlayer, sock);
        waitingPlayer = null;
    } else {
        waitingPlayer = sock;
        waitingPlayer.emit('message', 'Waiting for an opponent');
    }

    sock.on('message', (text) => {
        io.emit('message', text);
    });
});

server.on('error', (err) => {
    console.error('Server error: ', err);
});

server.listen(PORT, () => {
    console.log('Grp-chat app started on 8080');
});