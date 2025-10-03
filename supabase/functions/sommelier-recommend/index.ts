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

    // Scenario-specific guidance
    const scenarioContext = {
      impress: {
        focus: 'prestigious wines that will impress',
        criteria: 'highest-rated, acclaimed producers, prestigious regions, and wines with compelling stories',
        tone: 'sophisticated and confident'
      },
      casual: {
        focus: 'approachable, easy-drinking wines',
        criteria: 'balanced, food-friendly wines that are enjoyable without pretension',
        tone: 'relaxed and friendly'
      },
      savings: {
        focus: 'best value wines with highest savings',
        criteria: 'wines with the biggest discount from market price and strong value scores',
        tone: 'savvy and practical'
      }
    };

    const context = scenarioContext[scenario as keyof typeof scenarioContext] || scenarioContext.casual;

    // Build wine list summary for the AI (limit to top 8 wines for faster processing)
    const topWines = wines.slice(0, 8);
    const wineList = topWines.map((w: Wine, i: number) => 
      `${i + 1}. ${w.name} - ${w.winery} ${w.year}
         Region: ${w.region}, ${w.country}
         Type: ${w.wineType}
         Restaurant: $${w.price} | Market: $${w.marketPrice || 'N/A'}
         Rating: ${w.rating}/100 | Value Score: ${w.valueScore}/100`
    ).join('\n\n');

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
            content: `You are a Master Sommelier providing ${context.tone} recommendations. Focus on ${context.focus}.`
          },
          {
            role: 'user',
            content: `The guest wants to ${context.focus}. Recommend the TOP 3 wines that best match this goal.

Selection Criteria: Prioritize ${context.criteria}.

For each wine, briefly explain:
1. Why it's perfect for this occasion
2. Key characteristics
3. What makes it stand out

Wine List:
${wineList}

Keep each recommendation to 2-3 sentences total. Be ${context.tone}.`
          }
        ],
        max_tokens: 800,
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
