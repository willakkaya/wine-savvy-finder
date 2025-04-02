
import { WineInfo } from '@/components/wine/WineCard';
import { ExtractedWineData, OCRResult } from './ocrUtils';
import { getWineById, searchWines } from './wineApi';
import { toast } from '@/hooks/use-toast';

/**
 * Service class to handle OCR processing and wine data enrichment
 */
export class WineOcrService {
  /**
   * Process OCR results to extract structured wine data
   */
  static parseOcrResults(ocrResults: OCRResult[]): ExtractedWineData[] {
    console.log('Parsing wine information from OCR results...');
    
    const extractedWines: ExtractedWineData[] = [];
    let currentWine: ExtractedWineData = {};
    
    // Process each OCR text block
    for (let i = 0; i < ocrResults.length; i++) {
      const text = ocrResults[i].text;
      
      // Detect price pattern (e.g., $85)
      if (text.match(/\$\d+/)) {
        currentWine.price = text.replace('$', '');
        
        // Add the wine to extracted list and start a new one
        if (Object.keys(currentWine).length > 0) {
          extractedWines.push(currentWine);
          currentWine = {};
        }
      }
      // Detect region pattern (e.g., "Bordeaux, France")
      else if (text.includes(',') && !text.match(/\d{4}/)) {
        const parts = text.split(',').map(part => part.trim());
        if (parts.length >= 2) {
          currentWine.region = parts[0];
          currentWine.country = parts[1];
        }
      }
      // Detect name and year pattern
      else {
        const yearMatch = text.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          const year = yearMatch[0];
          currentWine.year = year;
          
          // Extract winery and name from the text
          const nameText = text.replace(year, '').trim();
          
          const nameParts = nameText.split(' ');
          if (nameParts.length >= 2) {
            currentWine.winery = nameParts[0] + ' ' + nameParts[1];
            currentWine.name = nameText;
          } else {
            currentWine.name = nameText;
          }
        }
      }
    }
    
    // Add the last wine if it has data
    if (Object.keys(currentWine).length > 0) {
      extractedWines.push(currentWine);
    }
    
    return extractedWines;
  }

  /**
   * Enhance wine data with market prices, ratings, and value scores
   */
  static async enrichWineData(extractedWines: ExtractedWineData[]): Promise<WineInfo[]> {
    console.log('Enhancing wine data with market prices and ratings...');
    
    if (extractedWines.length === 0) {
      toast({
        title: "No wines detected",
        description: "Try capturing a clearer image of the wine list",
        variant: "destructive"
      });
      return [];
    }
    
    const enhancedWines: WineInfo[] = [];
    
    // Process each extracted wine entry
    for (const extractedWine of extractedWines) {
      // Construct search query from available wine data
      let searchQuery = '';
      if (extractedWine.name) searchQuery += extractedWine.name + ' ';
      if (extractedWine.winery) searchQuery += extractedWine.winery + ' ';
      if (extractedWine.year) searchQuery += extractedWine.year + ' ';
      
      searchQuery = searchQuery.trim();
      
      if (searchQuery) {
        try {
          // Search for the wine in the database
          const searchResults = await searchWines(searchQuery);
          
          if (searchResults.length > 0) {
            // Found a match in the database
            const matchedWine = searchResults[0];
            
            // If we have a restaurant price from OCR, use it instead of the API price
            if (extractedWine.price) {
              const restaurantPrice = parseInt(extractedWine.price);
              if (!isNaN(restaurantPrice)) {
                // Update the value score based on new price difference
                const priceDifferencePercent = (matchedWine.marketPrice - restaurantPrice) / matchedWine.marketPrice;
                const valueScore = Math.round(
                  (priceDifferencePercent * 50) + // Price difference component (0-50)
                  ((matchedWine.rating - 85) / 13 * 50)  // Quality component (0-50)
                );
                
                // Create new wine object with updated price and value score
                enhancedWines.push({
                  ...matchedWine,
                  price: restaurantPrice,
                  valueScore
                });
              } else {
                enhancedWines.push(matchedWine);
              }
            } else {
              enhancedWines.push(matchedWine);
            }
          } else {
            // No match found, generate a wine entry with the extracted data
            const generatedWine = this.generateWineFromExtractedData(extractedWine);
            enhancedWines.push(generatedWine);
          }
        } catch (error) {
          console.error('Error searching wine database:', error);
          // Generate a wine entry from the extracted data as fallback
          const generatedWine = this.generateWineFromExtractedData(extractedWine);
          enhancedWines.push(generatedWine);
        }
      }
    }
    
    return enhancedWines;
  }

  /**
   * Generate a wine entry from extracted OCR data
   */
  private static generateWineFromExtractedData(wine: ExtractedWineData): WineInfo {
    // Generate a random ID
    const id = `wine-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Parse price or generate one if missing
    const price = wine.price ? parseInt(wine.price) : Math.floor(Math.random() * 150) + 50;
    
    // Generate a market price
    const marketPriceVariance = Math.random();
    let marketPrice;
    if (marketPriceVariance > 0.8) {
      marketPrice = price * (1.5 + Math.random() * 1.5);
    } else if (marketPriceVariance > 0.5) {
      marketPrice = price * (1.1 + Math.random() * 0.3);
    } else {
      marketPrice = price * (0.9 + Math.random() * 0.1);
    }
    marketPrice = Math.round(marketPrice);
    
    // Generate random rating between 85 and 98
    const rating = Math.floor(Math.random() * 14) + 85;
    
    // Calculate value score
    const priceDifferencePercent = (marketPrice - price) / marketPrice;
    const valueScore = Math.round(
      (priceDifferencePercent * 50) + // Price difference component (0-50)
      ((rating - 85) / 13 * 50)       // Quality component (0-50)
    );
    
    // Match wine to a realistic image based on the wine name/region
    let imageUrl = this.findWineImage(wine);
    
    // Fill in missing details with realistic values if needed
    const winery = wine.winery || 'Unknown Producer';
    const name = wine.name || `${winery} ${Math.random() > 0.5 ? 'Reserve' : 'Estate'}`;
    const year = wine.year ? parseInt(wine.year) : 2015 + Math.floor(Math.random() * 7);
    const region = wine.region || 'Unknown Region';
    const country = wine.country || 'Unknown Country';
    
    return {
      id,
      name,
      winery,
      year,
      region,
      country,
      price,
      marketPrice,
      rating,
      valueScore,
      imageUrl,
    };
  }

  /**
   * Find an appropriate wine image based on the wine details
   */
  private static findWineImage(wine: ExtractedWineData): string {
    // Sample wine bottle images from Vivino
    const sampleImages = [
      'https://images.vivino.com/thumbs/4RHhCzeQTsCeyCScxO0LOw_pb_600x600.png', // Bordeaux
      'https://images.vivino.com/thumbs/FGfB1q0wSs-ySFhMN5uE1Q_pb_600x600.png', // Pinot Noir
      'https://images.vivino.com/thumbs/ElcyI1YpRSes_LvNodMeSQ_pb_600x600.png', // Italian
      'https://images.vivino.com/thumbs/SeG1G9CqR0KQHBnBcgkGvA_pb_600x600.png', // Burgundy
      'https://images.vivino.com/thumbs/O-f9VelHQTiR-KJVYIXJcw_pb_600x600.png', // Champagne
      'https://images.vivino.com/thumbs/bIsxa3jeTb-Kl-FJzEeI1g_pb_600x600.png', // Napa Cab
      'https://images.vivino.com/thumbs/IEmxs47ITIaHXPJkvE9j7Q_pb_600x600.png', // Chardonnay
      'https://images.vivino.com/thumbs/ZkO93a8nSyON5sjEGYlEEw_pb_600x600.png', // Spanish
      'https://images.vivino.com/thumbs/wQnG9vl6Tp-TgTUB-C3gYw_pb_600x600.png'  // German
    ];
    
    // The region and country would typically give us a good hint about the wine
    if (wine.region && wine.region.toLowerCase().includes('bordeaux')) {
      return sampleImages[0];
    } else if (wine.name && wine.name.toLowerCase().includes('pinot noir')) {
      return sampleImages[1];
    } else if (wine.country && wine.country.toLowerCase().includes('italy')) {
      return sampleImages[2];
    } else if (wine.region && wine.region.toLowerCase().includes('burgundy')) {
      return sampleImages[3];
    } else if (wine.region && wine.region.toLowerCase().includes('champagne')) {
      return sampleImages[4];
    } else if (wine.region && wine.region.toLowerCase().includes('napa')) {
      return sampleImages[5];
    } else if (wine.name && wine.name.toLowerCase().includes('chardonnay')) {
      return sampleImages[6];
    } else if (wine.country && wine.country.toLowerCase().includes('spain')) {
      return sampleImages[7];
    } else if (wine.country && wine.country.toLowerCase().includes('germany')) {
      return sampleImages[8];
    }
    
    // If no match, return a random image
    return sampleImages[Math.floor(Math.random() * sampleImages.length)];
  }
}
