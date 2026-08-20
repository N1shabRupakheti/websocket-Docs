import { WebSocketServer, WebSocket } from 'ws';
import { addClient, removeClient } from './clients';
import { broadcast } from './broadcast';
import { parseClientMessage, searilizeServerMessage } from './protocol';

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
        searilizeServerMessage({
            type: 'Willkommen Freund',
            message: "Connected to the server"
        })
    );

    socket.on('message', (data, isBinary) => {

        if (isBinary) {
            return
        }

        const message = parseClientMessage(data.toString())

        if (!message) {
            console.log('Invalid message received');
            return;
        }

        switch (message.type) {
            case 'document_update':
                console.log(
                    'Document update:',
                    message.content
                );
                break;
        }


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