import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wine, Sparkles, Loader2, Award, Quote } from 'lucide-react';
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
    <Card className="relative overflow-hidden border-2 border-wine/30 bg-gradient-to-br from-wine/5 via-amber-50/30 to-wine/5 dark:from-wine/10 dark:via-background dark:to-wine/10">
      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-wine/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-wine/10 to-transparent rounded-tr-full" />
      
      <CardHeader className="relative pb-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-wine/10 rounded-full">
              <Wine className="text-wine" size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-serif font-semibold tracking-wide">Master Sommelier</h3>
                <Award size={18} className="text-gold" />
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Expert curation from world-class wine professionals
              </p>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-wine/30 to-transparent" />
      </CardHeader>
      
      <CardContent className="relative space-y-5 pb-6">
        {!recommendation && (
          <div className="space-y-4">
            <div className="text-center space-y-2 py-4">
              <Quote className="mx-auto text-wine/40 mb-2" size={32} />
              <p className="text-sm text-muted-foreground italic max-w-md mx-auto leading-relaxed">
                "Let me guide you through this exceptional selection. I'll analyze each wine's character, 
                provenance, and value to help you discover the perfect bottle for your occasion."
              </p>
            </div>
            
            <Button 
              onClick={getRecommendation}
              disabled={isLoading}
              className="w-full bg-wine hover:bg-wine-dark text-white font-medium py-6 text-base shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Consulting with the Master Sommelier...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={18} />
                  Request Expert Recommendations
                </>
              )}
            </Button>
          </div>
        )}

        {recommendation && (
          <div className="space-y-5 animate-fade-in">
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 text-wine/20" size={32} />
              <div className="pl-8 pr-4 py-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-line text-foreground leading-relaxed font-serif text-base">
                    {recommendation}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-wine/5 rounded-lg border border-wine/20">
                <Award size={16} className="text-wine" />
                <span className="text-xs text-muted-foreground italic">
                  Personalized recommendation from your Master Sommelier
                </span>
              </div>
            </div>
            
            <Button 
              onClick={getRecommendation}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="w-full border-wine/30 hover:bg-wine/10"
            >
              <Sparkles className="mr-2" size={14} />
              Request Different Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
