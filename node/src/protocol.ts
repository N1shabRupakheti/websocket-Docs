export type ClientMessage = | {
    type: 'document_update';
    content: string;
};

export type ServerMessage =
    | {
        type: 'Willkommen Freund';
        message: string;
    }
    | {
        type: 'document_update';
        content: string;
    };

export function parseClientMessage(data: string): ClientMessage | null {
    try {
        const message: unknown = JSON.parse(data);

        if (
            typeof message === 'object' &&
            message !== null &&
            'type' in message &&
            (message as Record<string, unknown>).type === 'document_update' &&
            'content' in message &&
            typeof (message as Record<string, unknown>).content === 'string'
        ) {
            return {
                type: 'document_update',
                content: (message as { content: string }).content,
            };
        }

        return null;
    } catch (error) {
        console.log("Error in protocol_parseClientMessage", error);
        return null;
    }
}

export function searilizeServerMessage(message: ServerMessage): string {
    return JSON.stringify(message)
}