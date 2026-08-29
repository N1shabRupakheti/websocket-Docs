import { WebSocketServer, WebSocket } from 'ws';
import { addClient, removeClient } from './clients';
import { broadcast } from './broadcast';
import { parseClientMessage, searilizeServerMessage, ServerMessage } from './protocol';
import { getRoomContent, setRoomContent } from './rooms';
import { URL } from 'node:url';

const PORT = 8080;

function parseDocumentId(url: URL): string | null {
    const fromQuery =
        url.searchParams.get('documentId') ?? url.searchParams.get('id');

    if (fromQuery) {
        return fromQuery;
    }

    const segments = url.pathname.split('/').filter(Boolean);
    const last = segments.at(-1);

    return last ?? null;
}

const wss = new WebSocketServer({
    port: PORT,
});

wss.on('connection', (socket: WebSocket, request) => {
    const url = new URL(
        request.url ?? '/',
        `http://${request.headers.host}`
    );

    const documentId = parseDocumentId(url);

    if (!documentId) {
        console.log(
            'Rejected connection: missing document id',
            request.url
        );
        socket.close(1008, 'document id required');
        return;
    }

    addClient(socket, documentId);

    console.log(
        'Client connected:',
        request.socket.remoteAddress,
        'document:',
        documentId
    );

    socket.send(
        searilizeServerMessage({
            type: 'document_update',
            content: getRoomContent(documentId),
        })
    );

    socket.on('message', (data, isBinary) => {
        if (isBinary) {
            return;
        }

        const message = parseClientMessage(data.toString());

        if (!message) {
            console.log('Invalid message received');
            return;
        }

        switch (message.type) {
            case 'document_update':
                setRoomContent(documentId, message.content);
                console.log('Document update:', documentId, message.content);
                break;
        }

        const serverMessage: ServerMessage = {
            type: 'document_update',
            content: getRoomContent(documentId),
        };

        const searializedMessage = searilizeServerMessage(serverMessage);
        socket.send(searializedMessage);
        broadcast(socket, searializedMessage, documentId);
    });

    socket.on('close', (code, reason) => {
        console.log(
            'Client disconnected:',
            code,
            reason.toString(),
            'document:',
            documentId
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
