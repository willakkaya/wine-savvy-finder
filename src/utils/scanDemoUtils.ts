
import { toast } from 'sonner';
import { ScanStage } from '@/types/scanTypes';
import { handleScanError } from '@/utils/scanErrorUtils';
import { WineInfo } from '@/components/wine/WineCard';
import { demoWines } from '@/data/demoWines';

/**
 * Simulates a wine scan process for demo mode
 */
export const simulateWineScan = async (
  callbacks: {
    setIsProcessing: (value: boolean) => void;
    setScanStage: (stage: ScanStage) => void;
    setScanMessage: (message: string) => void;
    setFoundWines: (wines: WineInfo[]) => void;
  }
) => {
  const { setIsProcessing, setScanStage, setScanMessage, setFoundWines } = callbacks;
  
  setIsProcessing(true);
  setScanStage('processing');
  setScanMessage('Processing wine list image...');
  
  setTimeout(() => {
    setScanStage('analyzing');
    setScanMessage('Analyzing wines and matching with database...');
    
    setTimeout(() => {
      try {
        // Select random wines from demo data
        const randomCount = Math.floor(Math.random() * 4) + 6;
        const shuffled = [...demoWines].sort(() => 0.5 - Math.random());
        const selectedWines = shuffled.slice(0, randomCount);
        
        setFoundWines(selectedWines);
        setScanStage('complete');
        setScanMessage(`Analysis complete! Found ${selectedWines.length} wines on the list.`);
        setIsProcessing(false);
        
        toast.success('Wine list processed successfully', {
          description: `We found ${selectedWines.length} wines on the list`
        });
      } catch (error) {
        handleScanError("Failed to process demo wines", {
          setIsProcessing,
          setScanStage,
          setScanMessage
        });
      }
    }, 2500);
  }, 2000);
};
