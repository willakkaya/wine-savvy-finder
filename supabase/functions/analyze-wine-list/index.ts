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
  price: number;
  type?: string;
  region?: string;
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
- name (required): Full wine name
- winery (if visible): Producer/winery name
- year (if visible): Vintage year as a number
- price (required): Price in dollars (extract just the number)
- type (if you can determine): red, white, sparkling, rose, or dessert
- region (if visible): Wine region/appellation

Return ONLY a valid JSON array with no additional text or markdown. Example format:
[{"name":"Château Margaux","winery":"Château Margaux","year":2018,"price":450,"type":"red","region":"Margaux"},{"name":"Dom Pérignon","year":2012,"price":180,"type":"sparkling","region":"Champagne"}]

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

    // Enrich wines with IDs and additional data
    const enrichedWines = wines.map((wine, index) => ({
      id: `scanned-${Date.now()}-${index}`,
      name: wine.name,
      winery: wine.winery || 'Unknown',
      year: wine.year || new Date().getFullYear(),
      region: wine.region || 'Unknown',
      country: 'Unknown', // Could enhance with region lookup
      price: wine.price,
      marketPrice: Math.round(wine.price * 1.3), // Estimate 30% markup
      rating: 4.0 + Math.random(), // Mock rating for now
      valueScore: Math.round(70 + Math.random() * 25), // Mock value score
      wineType: wine.type || 'red',
    }));

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
