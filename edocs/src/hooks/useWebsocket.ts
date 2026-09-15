import { useEffect, useState, useRef } from "react";
import { parseServerMessage, ServerMessage } from "../websocket/protocol";


interface UseWebSocketParameter {
    onDocumentUpdate?: (content: string) => void
    documentId?: string
}

const useWebSocket = ({ onDocumentUpdate, documentId }: UseWebSocketParameter = {}) => {
    const [connection, setConnection] = useState(false)
    const wRef = useRef<WebSocket | null>(null);
    const backendURI = import.meta.env.VITE_BACKEND_URI_DEVELOPMENT;

    const sendMessage = (content: string) => {
        const ws = wRef.current;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("Websocket is not open")
            return;
        }

        const message = JSON.stringify({
            type: "document_update",
            content: content
        });

        ws.send(message);
    }

    useEffect(() => {

        const ws = new WebSocket(`${backendURI}/document/${documentId}`);
        wRef.current = ws

        ws.onopen = () => {
            console.log("WebSocket connected");
            setConnection(true)
        };

        ws.onmessage = (event) => {

            try {

                const message = parseServerMessage(event.data)

                if (!message) {
                    console.log('Invalid message returned from the server message parser')
                    return
                }

                switch (message.type) {

                    case "Willkommen Freund":
                        console.log("Server:", message.message);
                        break;

                    case 'document_update':
                        console.log('Document received : ', message.content)
                        onDocumentUpdate?.(message.content)
                        break;
                }
            }
            catch (err) {
                console.log('Error in Omessage handler WS. ', err)
            }

        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            ws.close()
            wRef.current = null
        };

    }, [])

    return {
        connection,
        sendMessage
    }

}

export default useWebSocket