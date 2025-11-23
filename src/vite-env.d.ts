/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SYNCFUSION_LICENSE: string
  // add more env variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
