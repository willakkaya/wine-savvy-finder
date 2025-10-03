import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wine, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WineInfo } from '@/components/wine/WineCard';

interface SommelierRecommendationsProps {
  wines: WineInfo[];
}

export const SommelierRecommendations = ({ wines }: SommelierRecommendationsProps) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sommelier-recommend', {
        body: { wines }
      });

      if (error) throw error;

      if (data?.recommendation) {
        setRecommendation(data.recommendation);
      } else {
        throw new Error('No recommendation received');
      }
    } catch (error) {
      console.error('Error getting sommelier recommendation:', error);
      toast.error('Failed to get sommelier recommendation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-wine/20 bg-gradient-to-br from-wine/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wine className="text-wine" size={24} />
          <div>
            <CardTitle className="font-serif">Master Sommelier Recommendations</CardTitle>
            <CardDescription>Expert guidance on which wines to order</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!recommendation && (
          <Button 
            onClick={getRecommendation}
            disabled={isLoading}
            className="w-full bg-wine hover:bg-wine-dark text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Analyzing wine list...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" size={16} />
                Get Sommelier Recommendations
              </>
            )}
          </Button>
        )}

        {recommendation && (
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-foreground leading-relaxed">
                {recommendation}
              </p>
            </div>
            <Button 
              onClick={getRecommendation}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Get New Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
