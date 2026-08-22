import useWebSocket from "../hooks/useWebsocket";

const Connection = () => {
    const { connection } = useWebSocket()
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