/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BANK_BIN?: string;
  readonly VITE_BANK_ACCOUNT?: string;
  readonly VITE_BANK_ACCOUNT_NAME?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
