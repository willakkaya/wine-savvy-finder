
import { WineInfo } from "@/components/wine/WineCard";

// Updated ScanStage to explicitly include all stages
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
