// send only to other clients in the same document room

import { WebSocket } from 'ws';
import { getRoomClients } from './rooms';

export function broadcast(sender: WebSocket, message: string, documentId: string) {
    for (const client of getRoomClients(documentId)) {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}
