// who is connected, and to which document

import { WebSocket } from 'ws';
import { joinRoom, leaveRoom } from './rooms';

const clients = new Map<WebSocket, string>();

export function addClient(socket: WebSocket, documentId: string) {
    clients.set(socket, documentId);
    joinRoom(documentId, socket);
}

export function removeClient(socket: WebSocket) {
    const documentId = clients.get(socket);

    if (documentId) {
        leaveRoom(documentId, socket);
    }

    clients.delete(socket);
}

export function getClientDocumentId(socket: WebSocket): string | undefined {
    return clients.get(socket);
}
