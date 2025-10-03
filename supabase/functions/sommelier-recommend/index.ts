import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Wine {
  name: string;
  winery: string;
  year: number;
  region: string;
  country: string;
  price: number;
  marketPrice: number;
  rating: number;
  valueScore: number;
  wineType: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wines, scenario = 'casual' } = await req.json();
    
    if (!wines || wines.length === 0) {
      throw new Error('No wines provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Generating sommelier recommendations for ${wines.length} wines (${scenario} scenario)...`);

    // Professional Master Sommelier evaluation framework
    const scenarioContext = {
      impress: {
        focus: 'selections that demonstrate sophistication and wine knowledge',
        methodology: `MASTER SOMMELIER EVALUATION CRITERIA:
1. PROVENANCE & PEDIGREE: First-growth estates, benchmark producers, historic vintages
2. TERROIR EXPRESSION: Authentic regional character, site-specific qualities
3. CRITICAL ACCLAIM: Ratings, awards, vintage conditions, aging potential
4. NARRATIVE VALUE: Compelling stories about winemaker, estate history, or unique production
5. PRESTIGE SIGNALING: Wines that demonstrate refined taste and wine knowledge
6. FOOD PAIRING: Versatility with fine dining, proper service considerations`,
        tone: 'authoritative yet approachable, use professional terminology'
      },
      casual: {
        focus: 'approachable wines that are immediately enjoyable and conversation-friendly',
        methodology: `MASTER SOMMELIER EVALUATION CRITERIA:
1. APPROACHABILITY: Balanced structure, immediate drinkability, no demanding characteristics
2. FLAVOR PROFILE: Clean fruit expression, integrated oak (if any), pleasant finish
3. FOOD VERSATILITY: Pairs well across cuisines, good acidity, moderate alcohol
4. VALUE PERCEPTION: Quality-to-price ratio, authentic varietal/regional character
5. ACCESSIBILITY: Recognizable style, not intimidating, conversation-starter potential
6. BY-THE-GLASS APPEAL: Would work well for casual dining or aperitif`,
        tone: 'warm and educational, demystify wine without condescension'
      },
      savings: {
        focus: 'exceptional value wines offering the best quality-to-price ratios',
        methodology: `MASTER SOMMELIER EVALUATION CRITERIA:
1. MARKUP ANALYSIS: Calculate savings percentage, compare to typical restaurant markups
2. MARKET INTELLIGENCE: Reference current retail/market prices, availability
3. HIDDEN GEMS: Lesser-known regions, emerging producers, undervalued vintages
4. QUALITY BENCHMARKING: Compare to prestigious wines at higher price points
5. VALUE STORYTELLING: Explain WHY this wine is priced favorably
6. OPPORTUNITY RECOGNITION: Wines normally inaccessible at this price point`,
        tone: 'savvy and insider-knowledge, celebrate smart wine choices'
      }
    };

    const context = scenarioContext[scenario as keyof typeof scenarioContext] || scenarioContext.casual;

    // Build comprehensive wine data for professional analysis
    const topWines = wines.slice(0, 8);
    const wineList = topWines.map((w: Wine, i: number) => {
      const savings = w.marketPrice && w.price ? Math.round(((w.marketPrice - w.price) / w.marketPrice) * 100) : 0;
      const savingsDisplay = savings > 0 ? ` → ${savings}% below market` : '';
      return `${i + 1}. ${w.name} ${w.year}
   Producer: ${w.winery}
   Origin: ${w.region}, ${w.country}
   Category: ${w.wineType}
   Restaurant Price: $${w.price}${w.marketPrice ? ` | Market Value: $${w.marketPrice}${savingsDisplay}` : ''}
   Professional Rating: ${w.rating}/100 | Value Score: ${w.valueScore}/100`;
    }).join('\n\n');

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - AI taking too long')), 25000); // 25 second timeout
    });

    // Call Lovable AI for sommelier recommendations with timeout
    const aiPromise = fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a certified Master Sommelier with Court of Master Sommeliers credentials. You have:
- Decades of experience evaluating wines through blind tastings
- Deep knowledge of viticulture, winemaking, and wine regions worldwide  
- Expertise in wine and food pairing, service, and cellar management
- The ability to identify terroir characteristics and production methods
- Professional wine evaluation skills using deductive tasting methodology

Your recommendations should reflect this expertise through:
- Proper use of professional tasting terminology (structure, tannins, acidity, finish, etc.)
- Recognition of vintage conditions and aging potential
- Understanding of regional typicity and producer reputation
- Practical food pairing suggestions based on the wine's characteristics
- Value assessment considering typical restaurant markups (usually 2-3x retail)

Tone: ${context.tone}`
          },
          {
            role: 'user',
            content: `The guest is dining out and wants to ${context.focus}.

EVALUATION FRAMEWORK:
${context.methodology}

From the wine list below, recommend exactly 3 wines that best serve this goal.

STRUCTURE YOUR RECOMMENDATIONS AS A MASTER SOMMELIER WOULD:

For each wine, provide:
1. **Selection Rationale** (1 sentence): Why this wine specifically for this occasion
2. **Professional Tasting Notes** (1-2 sentences): Key aromatic/flavor profiles, structure, finish
3. **Pairing & Service** (1 sentence): Food pairing suggestions OR service notes

Use professional wine terminology naturally. Reference specific characteristics like vintage, terroir, or production methods when relevant.

Keep each wine recommendation to 3-4 sentences maximum. Be ${context.tone}.

WINE LIST:
${wineList}

Format your response with clear wine names as headers, then your recommendation beneath each.`
          }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });
    
    const response = await Promise.race([aiPromise, timeoutPromise]) as Response;

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
    console.log('AI Response received');

    const recommendation = data.choices?.[0]?.message?.content;
    if (!recommendation) {
      throw new Error('No recommendation from AI model');
    }

    console.log('Sommelier recommendation generated successfully');

    return new Response(
      JSON.stringify({ recommendation }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in sommelier-recommend:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
