import { useEffect, useState, useRef } from "react";


const useWebSocket = () => {
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

        const ws = new WebSocket(backendURI);
        wRef.current = ws

        ws.onopen = () => {
            console.log("WebSocket connected");
            setConnection(true)
        };

        ws.onmessage = (event) => {
            console.log("Message from server:", event.data);
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