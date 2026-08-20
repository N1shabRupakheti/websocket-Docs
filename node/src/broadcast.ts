// who recieves ?? 

import { WebSocket } from 'ws';
import { getClients } from './clients';

export function broadcast(sender: WebSocket, message: string) {
    for (const client of getClients()) {
        if (
            client !== sender &&
            client.readyState === WebSocket.OPEN
        ) {
            client.send(message);
        }
    }
}