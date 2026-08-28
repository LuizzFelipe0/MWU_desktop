/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MWU_API_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
