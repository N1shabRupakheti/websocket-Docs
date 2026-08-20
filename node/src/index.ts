import { WebSocketServer, WebSocket } from 'ws';
import { addClient, removeClient } from './clients';
import { broadcast } from './broadcast';

const PORT = 8080;

const wss = new WebSocketServer({
    port: PORT,
});

wss.on('connection', (socket: WebSocket, request) => {
    console.log(
        'Client connected:',
        request.socket.remoteAddress
    );

    addClient(socket);

    socket.send(
        JSON.stringify({
            type: 'welcome',
            message: 'Connected to server amigo de la chica del cafe',
        })
    );

    socket.on('message', (data, isBinary) => {
        const message = isBinary
            ? data
            : data.toString();

        console.log('Received:', message);

        socket.send(
            JSON.stringify({
                type: 'echo',
                message,
            })
        );

        broadcast(
            socket,
            JSON.stringify({
                type: 'broadcast',
                message,
            })
        );
    });

    socket.on('close', (code, reason) => {
        console.log(
            'Client disconnected:',
            code,
            reason.toString()
        );

        removeClient(socket);
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

console.log(
    `WebSocket server running on ws://localhost:${PORT}`
);