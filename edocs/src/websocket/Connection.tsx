import { useEffect, useState, useRef } from "react";

const Connection = ({ content, onDocumentUpdate }: { content: string, onDocumentUpdate: (content: string) => void }) => {

    const [connection, setConnection] = useState(false)

    // websocket reference
    const wRef = useRef<WebSocket | null>(null);

    const backendURI = import.meta.env.VITE_BACKEND_URI_DEVELOPMENT;
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
            ws.close();
        };
    }, []);

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


    return (
        <div
            role="alert"
            className={`flex items-center justify-between rounded-md border border-slate-200 bg-white p-4 shadow-sm border-l-4 ${connection ? "border-l-teal-500" : "border-l-rose-500"
                }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${connection ? "bg-teal-50 text-teal-600" : "bg-rose-50 text-rose-600"
                        }`}
                >
                    {connection ? "✓" : "!"}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-800">
                        {connection ? "Connected" : "Connection error"}
                    </p>
                    <p className="text-xs text-slate-500">
                        {connection ? "Ready to sync data" : "Could not reach the server"}
                    </p>
                </div>
            </div>
        </div>
    );

}

export default Connection