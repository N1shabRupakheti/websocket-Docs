import { useEffect } from "react"

const Connection = () => {

    const backendURI = import.meta.env.VITE_BACKEND_URI_DEVELOPMENT;
    useEffect(() => {
        const ws = new WebSocket(backendURI);

        ws.onopen = () => {
            console.log("WebSocket connected");
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


    return (
        <>
            <h1>Connection success </h1>
        </>
    )

}

export default Connection