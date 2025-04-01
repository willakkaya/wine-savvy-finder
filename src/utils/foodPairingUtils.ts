
/**
 * Food pairing recommendations for different wine types
 */

export type WineType = 'red' | 'white' | 'sparkling' | 'rose' | 'dessert';

export interface FoodPairing {
  food: string;
  strength: 'excellent' | 'good' | 'fair';
}

// Wine pairing data by wine type
const winePairings: Record<WineType, FoodPairing[]> = {
  red: [
    { food: 'Steak', strength: 'excellent' },
    { food: 'Lamb', strength: 'excellent' },
    { food: 'Hard Cheese', strength: 'good' },
    { food: 'Pasta with Red Sauce', strength: 'good' },
    { food: 'Beef Stew', strength: 'excellent' },
    { food: 'Dark Chocolate', strength: 'good' },
    { food: 'Mushroom Dishes', strength: 'good' },
  ],
  white: [
    { food: 'Fish', strength: 'excellent' },
    { food: 'Shellfish', strength: 'excellent' },
    { food: 'Chicken', strength: 'good' },
    { food: 'Soft Cheese', strength: 'good' },
    { food: 'Salad', strength: 'good' },
    { food: 'Light Pasta', strength: 'good' },
    { food: 'Vegetable Dishes', strength: 'good' },
  ],
  sparkling: [
    { food: 'Oysters', strength: 'excellent' },
    { food: 'Sushi', strength: 'good' },
    { food: 'Caviar', strength: 'excellent' },
    { food: 'Light Appetizers', strength: 'good' },
    { food: 'Fried Foods', strength: 'good' },
    { food: 'Brunch Dishes', strength: 'good' },
    { food: 'Fruit Desserts', strength: 'fair' },
  ],
  rose: [
    { food: 'Grilled Salmon', strength: 'excellent' },
    { food: 'Mediterranean Dishes', strength: 'good' },
    { food: 'Charcuterie', strength: 'good' },
    { food: 'Light Pasta', strength: 'good' },
    { food: 'Salads', strength: 'good' },
    { food: 'Seafood', strength: 'excellent' },
    { food: 'Spicy Foods', strength: 'fair' },
  ],
  dessert: [
    { food: 'Chocolate Desserts', strength: 'excellent' },
    { food: 'Fruit Tarts', strength: 'good' },
    { food: 'Blue Cheese', strength: 'excellent' },
    { food: 'Foie Gras', strength: 'good' },
    { food: 'Crème Brûlée', strength: 'good' },
    { food: 'Nuts', strength: 'fair' },
    { food: 'Apple Pie', strength: 'good' },
  ],
};

/**
 * Get recommended food pairings for a specific wine type
 */
export const getFoodPairings = (wineType: WineType): FoodPairing[] => {
  return winePairings[wineType] || [];
};

/**
 * Get the top 3 food pairings for a specific wine type
 */
export const getTopFoodPairings = (wineType: WineType): FoodPairing[] => {
  const pairings = getFoodPairings(wineType);
  // Sort by strength: excellent > good > fair
  const sortedPairings = [...pairings].sort((a, b) => {
    const strengthValues = { excellent: 3, good: 2, fair: 1 };
    return strengthValues[b.strength] - strengthValues[a.strength];
  });
  
  // Return top 3
  return sortedPairings.slice(0, 3);
};
