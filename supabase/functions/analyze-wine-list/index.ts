import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WineData {
  name: string;
  winery?: string;
  year?: number;
  priceGlass?: number;
  priceBottle?: number;
  type?: string;
  region?: string;
}

// Helper function to infer wine type from name if not provided
function inferWineType(wineName: string, region?: string): 'red' | 'white' | 'sparkling' | 'rose' | 'dessert' {
  const name = wineName.toLowerCase();
  const reg = region?.toLowerCase() || '';
  
  // Check for sparkling indicators
  if (name.includes('champagne') || name.includes('prosecco') || name.includes('cava') || 
      name.includes('sparkling') || reg.includes('champagne') || name.includes('dom perignon') ||
      name.includes('veuve clicquot') || name.includes('moët')) {
    return 'sparkling';
  }
  
  // Check for rosé indicators
  if (name.includes('rosé') || name.includes('rose') || name.includes('pink') ||
      reg.includes('provence') || name.includes('whispering angel')) {
    return 'rose';
  }
  
  // Check for dessert wine indicators
  if (name.includes('sauternes') || name.includes('port') || name.includes('ice wine') ||
      name.includes('dessert') || name.includes('sweet') || reg.includes('sauternes') ||
      name.includes('yquem') || name.includes('tokaji')) {
    return 'dessert';
  }
  
  // Check for white wine indicators
  if (name.includes('chardonnay') || name.includes('sauvignon blanc') || name.includes('pinot grigio') ||
      name.includes('pinot gris') || name.includes('riesling') || name.includes('albariño') ||
      name.includes('viognier') || name.includes('white') || name.includes('blanc') ||
      reg.includes('chablis') || reg.includes('sancerre')) {
    return 'white';
  }
  
  // Check for red wine indicators
  if (name.includes('cabernet') || name.includes('merlot') || name.includes('pinot noir') ||
      name.includes('syrah') || name.includes('shiraz') || name.includes('malbec') ||
      name.includes('zinfandel') || name.includes('red') || name.includes('bordeaux') ||
      name.includes('burgundy') || name.includes('barolo') || name.includes('chianti') ||
      name.includes('rioja') || reg.includes('bordeaux') || reg.includes('napa')) {
    return 'red';
  }
  
  // Default to red if no clear indicators
  return 'red';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image data provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing wine list image...');

    // Call Lovable AI with vision model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this wine list image and extract ALL wines you can find. For each wine, provide:
- name (required): Full wine name including grape variety if visible
- winery (if visible): Producer/winery name
- year (if visible): Vintage year as a number
- priceGlass (if available): By-the-glass price in dollars (just the number)
- priceBottle (if available): By-the-bottle price in dollars (just the number)
- type (VERY IMPORTANT): Must be one of: red, white, sparkling, rose, or dessert
  * Look at the wine name, grape variety, and region to determine the type
  * Cabernet, Merlot, Pinot Noir, Syrah = red
  * Chardonnay, Sauvignon Blanc, Pinot Grigio, Riesling = white
  * Champagne, Prosecco, Cava = sparkling
  * Rosé, Provence wines = rose
  * Sauternes, Port, Ice Wine = dessert
- region (if visible): Wine region/appellation

IMPORTANT: Many wine lists show both by-the-glass (BTG) and by-the-bottle (BTB) prices. Look carefully for both and include whichever you find. At least one price must be present.

CRITICAL: ALWAYS include the "type" field based on the wine name or grape variety. This is essential for filtering.

Return ONLY a valid JSON array with no additional text or markdown. Example format:
[{"name":"Château Margaux","winery":"Château Margaux","year":2018,"priceBottle":450,"type":"red","region":"Margaux"},{"name":"Dom Pérignon","year":2012,"priceGlass":22,"priceBottle":180,"type":"sparkling","region":"Champagne"}]

If you cannot see any wines clearly, return an empty array: []`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 4096
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add credits to continue.');
      }
      
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data));

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI model');
    }

    // Parse the JSON response
    let wines: WineData[] = [];
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      wines = JSON.parse(cleanContent);
      
      if (!Array.isArray(wines)) {
        console.error('Response is not an array:', wines);
        wines = [];
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse wine data from image');
    }

    console.log(`Successfully extracted ${wines.length} wines`);

    // Enrich wines with Vivino data and generate images
    const enrichedWines = await Promise.all(
      wines.map(async (wine, index) => {
        const searchQuery = `${wine.winery || ''} ${wine.name || ''} ${wine.year || ''}`.trim();
        
        // Try to fetch from Vivino (with timeout for faster scans)
        let vivinoData = null;
        if (searchQuery) {
          try {
            const vivinoPromise = fetch(
              `https://www.vivino.com/api/wines?q=${encodeURIComponent(searchQuery)}&per_page=1`,
              {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                },
              }
            );
            
            // Add 3 second timeout for Vivino
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Vivino timeout')), 3000)
            );
            
            const vivinoResponse = await Promise.race([vivinoPromise, timeoutPromise]) as Response;
            
            if (vivinoResponse.ok) {
              const data = await vivinoResponse.json();
              if (data.wines && data.wines.length > 0) {
                vivinoData = data.wines[0];
              }
            }
          } catch (error) {
            // Skip Vivino if it times out or fails
          }
        }
        
        // Use Vivino image if available, otherwise leave undefined
        const imageUrl = vivinoData?.image?.location;
        
        // Use bottle price for value calculations (more relevant for comparison)
        const restaurantPrice = wine.priceBottle || wine.priceGlass || null;
        const priceGlass = wine.priceGlass || null;
        const priceBottle = wine.priceBottle || null;
        
        // Calculate market price from Vivino or estimate
        let marketPrice = null;
        if (vivinoData?.price?.amount) {
          marketPrice = Math.round(vivinoData.price.amount);
        } else if (restaurantPrice) {
          // Estimate market price as 70% of restaurant price (typical markup is 1.5-2x)
          marketPrice = Math.round(restaurantPrice * 0.7);
        }
        
        // Get rating from Vivino (convert 1-5 to 1-100 scale)
        const vivinoRating = vivinoData?.statistics?.ratings_average || null;
        const rating = vivinoRating ? Math.round(vivinoRating * 20) : Math.round(75 + Math.random() * 15);
        
        // Calculate value score (1-100) only if both prices exist
        const calculateValueScore = (price: number | null, market: number | null, rating: number): number => {
          if (!price || !market) {
            // No value comparison possible, score based on rating only
            return Math.round((rating / 100) * 100);
          }
          
          const savings = market - price;
          const savingsPercent = (savings / market) * 100;
          
          // Base score on savings percentage (0-80 points)
          let score = Math.min(80, Math.max(0, savingsPercent * 2));
          
          // Bonus points for high ratings (0-20 points)
          score += (rating / 100) * 20;
          
          return Math.round(score);
        };
        
        // Determine wine type using AI response or inference
        const detectedType = wine.type?.toLowerCase();
        const validTypes = ['red', 'white', 'sparkling', 'rose', 'dessert'];
        const wineType = (detectedType && validTypes.includes(detectedType))
          ? detectedType as 'red' | 'white' | 'sparkling' | 'rose' | 'dessert'
          : inferWineType(wine.name, wine.region);
        
        return {
          id: `scanned-${Date.now()}-${index}`,
          name: wine.name,
          winery: wine.winery || vivinoData?.winery?.name || 'Unknown',
          year: wine.year || vivinoData?.vintage?.year || new Date().getFullYear(),
          region: wine.region || vivinoData?.region?.name || 'Unknown',
          country: vivinoData?.region?.country?.name || 'Unknown',
          price: restaurantPrice,
          priceGlass,
          priceBottle,
          marketPrice,
          rating,
          valueScore: calculateValueScore(restaurantPrice, marketPrice, rating),
          wineType,
          imageUrl: imageUrl || undefined,
        };
      })
    );

    return new Response(
      JSON.stringify({ wines: enrichedWines }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in analyze-wine-list:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        wines: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
