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


export function parseServerMessage(data: string): ServerMessage | null {
    try {
        const message: unknown = JSON.parse(data);

        if (
            typeof message === 'object' &&
            message !== null &&
            'type' in message
        ) {
            const type = (message as Record<string, unknown>).type;

            if (type === 'Willkommen Freund') {
                if (
                    'message' in message &&
                    typeof (message as Record<string, unknown>).message === 'string'
                ) {
                    return {
                        type: 'Willkommen Freund',
                        message: (message as { message: string }).message,
                    };
                }
            }

            if (type === 'document_update') {
                if (
                    'content' in message &&
                    typeof (message as Record<string, unknown>).content === 'string'
                ) {
                    return {
                        type: 'document_update',
                        content: (message as { content: string }).content,
                    };
                }
            }
        }

        return null;
    } catch (error) {
        console.log("Error in protocol_parseServerMessage", error);
        return null;
    }
}