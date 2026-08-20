/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URI_DEVELOPMENT: string
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}