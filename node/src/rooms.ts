import { WebSocket } from 'ws';

type Room = {
    content: string;
    clients: Set<WebSocket>;
};

const rooms = new Map<string, Room>();

function getOrCreateRoom(documentId: string): Room {
    let room = rooms.get(documentId);

    if (!room) {
        room = { content: '', clients: new Set() };
        rooms.set(documentId, room);
    }

    return room;
}

export function joinRoom(documentId: string, socket: WebSocket): Room {
    const room = getOrCreateRoom(documentId);
    room.clients.add(socket);
    return room;
}

export function leaveRoom(documentId: string, socket: WebSocket): void {
    const room = rooms.get(documentId);

    if (!room) {
        return;
    }

    room.clients.delete(socket);
}

export function setRoomContent(documentId: string, content: string): void {
    getOrCreateRoom(documentId).content = content;
}

export function getRoomContent(documentId: string): string {
    return getOrCreateRoom(documentId).content;
}

export function getRoomClients(documentId: string): Set<WebSocket> {
    return rooms.get(documentId)?.clients ?? new Set();
}
