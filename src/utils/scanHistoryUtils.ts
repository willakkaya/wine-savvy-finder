import { supabase } from '@/integrations/supabase/client';
import { WineInfo } from '@/components/wine/WineCard';

interface SaveScanHistoryParams {
  userId: string;
  winesFound: number;
  topValueWine?: WineInfo;
  highestRatedWine?: WineInfo;
  scenario?: string;
  imageData?: string;
}

export const saveScanHistory = async ({
  userId,
  winesFound,
  topValueWine,
  highestRatedWine,
  scenario,
  imageData,
}: SaveScanHistoryParams) => {
  try {
    const { error } = await supabase
      .from('scan_history')
      .insert({
        user_id: userId,
        wines_found: winesFound,
        top_value_wine_id: topValueWine?.id || null,
        highest_rated_wine_id: highestRatedWine?.id || null,
        scenario: scenario || null,
        image_data: imageData || null,
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving scan history:', error);
    return { success: false, error };
  }
};