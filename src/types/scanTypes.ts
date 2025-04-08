
import { WineInfo } from "@/components/wine/WineCard";

// Explicitly define ScanStage to include all stages
export type ScanStage = 'idle' | 'capturing' | 'processing' | 'analyzing' | 'complete' | 'error';

export interface ScanState {
  scanStage: ScanStage;
  scanMessage: string;
  isProcessing: boolean;
  foundWines: WineInfo[];
  networkError: boolean;
  offlineAvailable: boolean;
  showOfflineOptions: boolean;
}
