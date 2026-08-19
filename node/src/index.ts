import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// Track connected clients
const clients = new Set<WebSocket>();

wss.on('connection', (socket: WebSocket, request) => {
    console.log('Client connected:', request.socket.remoteAddress);
    clients.add(socket);

    socket.send(JSON.stringify({ type: 'welcome', message: 'Connected to server' }));

    socket.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log('Received:', message);

        // Echo back to sender
        socket.send(JSON.stringify({ type: 'echo', message }));

        // Or broadcast to everyone else
        broadcast(socket, JSON.stringify({ type: 'broadcast', message }));
    });

    socket.on('close', (code, reason) => {
        console.log('Client disconnected:', code, reason.toString());
        clients.delete(socket);
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

function broadcast(sender: WebSocket, message: string) {
    for (const client of clients) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}

console.log(`WebSocket server running on ws://localhost:${PORT}`);