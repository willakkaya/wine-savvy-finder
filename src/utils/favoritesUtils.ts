import { WineInfo } from '@/components/wine/WineCard';
import { supabase } from '@/integrations/supabase/client';

/**
 * Utility for managing favorite wines with Supabase
 */

/**
 * Add a wine to favorites
 */
export const addFavorite = async (wine: WineInfo): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be logged in to add favorites');

  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      wine_id: wine.id,
      wine_data: wine as any
    });

  if (error && error.code !== '23505') { // Ignore unique constraint violations
    console.error('Error adding favorite:', error);
    throw error;
  }
};

/**
 * Remove a wine from favorites
 */
export const removeFavorite = async (wineId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be logged in to remove favorites');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('wine_id', wineId);

  if (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * Check if a wine is in favorites
 */
export const isFavorite = async (wineId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('wine_id', wineId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignore not found errors
    console.error('Error checking favorite:', error);
  }

  return !!data;
};

/**
 * Toggle a wine's favorite status
 */
export const toggleFavorite = async (wine: WineInfo): Promise<boolean> => {
  const isFav = await isFavorite(wine.id);
  
  if (isFav) {
    await removeFavorite(wine.id);
    return false;
  } else {
    await addFavorite(wine);
    return true;
  }
};

/**
 * Get all favorite wines
 */
export const getFavorites = async (): Promise<WineInfo[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('wine_data')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getting favorites:', error);
    return [];
  }

  return data?.map(fav => fav.wine_data as unknown as WineInfo) || [];
};

/**
 * Clear all favorites
 */
export const clearFavorites = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be logged in to clear favorites');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};
