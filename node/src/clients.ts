// who is connected ?? 

import { WebSocket } from 'ws';

const clients = new Set<WebSocket>();

export function addClient(socket: WebSocket) {
    clients.add(socket);
}

export function removeClient(socket: WebSocket) {
    clients.delete(socket);
}

export function getClients() {
    return clients;
}