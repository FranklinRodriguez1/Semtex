export interface Transaction {
  id: string;
  filename: string;
  sender: string;
  status: 'ENCRYPTING' | 'UPLOADING' | 'COMPLETED' | 'ERROR';
  timestamp: string;
}

export interface UploadProgress {
  percentage: number;
  bytesUploaded: number;
  bytesTotal: number;
}

export type UploadStatus = 'idle' | 'uploading' | 'completed' | 'error';

export interface TransferState {
  status: UploadStatus;
  currentFile: File | null;
  progress: UploadProgress;
  transactions: Transaction[];
  error: string | null;
}
