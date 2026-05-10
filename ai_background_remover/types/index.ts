export type AppState =
  | { status: 'idle' }
  | { status: 'preview'; file: File; preview: string }
  | { status: 'processing'; progress?: number }
  | { status: 'success'; original: string; result: string; filename: string }
  | { status: 'error'; message: string; code?: string };

export interface ApiKeyStatus {
  isValid: boolean;
  isTested: boolean;
  error?: string;
  credits?: {
    total: number;
    used: number;
  };
}

export interface ProcessedImage {
  id: string;
  filename: string;
  originalUrl: string;
  resultUrl: string;
  timestamp: number;
}
