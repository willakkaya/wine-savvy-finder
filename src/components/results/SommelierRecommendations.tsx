import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wine, Sparkles, Loader2, Award, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { WineInfo } from '@/components/wine/WineCard';

interface SommelierRecommendationsProps {
  wines: WineInfo[];
  scenario?: 'impress' | 'casual' | 'savings';
}

export const SommelierRecommendations = ({ wines, scenario = 'casual' }: SommelierRecommendationsProps) => {
  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('sommelier-recommend', {
        body: { wines, scenario }
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
    <Card className="relative overflow-hidden border border-wine/20 bg-gradient-to-br from-background via-wine/5 to-background dark:from-background dark:via-wine/10 dark:to-background shadow-xl">
      {/* Elegant header accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wine to-transparent" />
      
      <CardHeader className="relative pb-6 pt-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-gradient-to-br from-wine/20 to-wine/10 rounded-lg border border-wine/30">
            <Wine className="text-wine" size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-serif font-bold tracking-tight bg-gradient-to-br from-wine to-wine-dark bg-clip-text text-transparent">
                Master Sommelier Consultation
              </h3>
              <Award size={20} className="text-gold flex-shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Personalized wine expertise tailored to your selection and occasion
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-6 pb-8">
        {!recommendation && (
          <div className="space-y-6">
            <div className="bg-wine/5 dark:bg-wine/10 rounded-xl p-6 border border-wine/20">
              <Quote className="text-wine/30 mb-3" size={28} />
              <p className="text-foreground leading-relaxed font-serif text-base">
                Allow me to provide a detailed analysis of your wine list selections. I will evaluate each option's 
                characteristics, regional authenticity, value proposition, and suitability for your dining experience, 
                offering professional guidance to elevate your wine selection.
              </p>
            </div>
            
            <Button 
              onClick={getRecommendation}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-wine to-wine-dark hover:from-wine-dark hover:to-wine text-white font-semibold py-7 text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Consulting with Master Sommelier...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={20} />
                  Request Expert Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {recommendation && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-wine/5 via-background to-wine/5 dark:from-wine/10 dark:via-background dark:to-wine/10 rounded-xl p-8 border border-wine/20 shadow-inner">
              <div className="flex items-start gap-4 mb-4">
                <Quote className="text-wine/40 flex-shrink-0 mt-1" size={32} />
                <div className="flex-1">
                  <div className="prose prose-base max-w-none dark:prose-invert">
                    <div className="whitespace-pre-line text-foreground leading-relaxed font-serif">
                      {recommendation}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-wine/20">
                <Award size={18} className="text-wine flex-shrink-0" />
                <p className="text-sm text-muted-foreground font-medium">
                  Professional wine consultation • Tailored to your preferences
                </p>
              </div>
            </div>
            
            <Button 
              onClick={getRecommendation}
              disabled={isLoading}
              variant="outline"
              className="w-full border-wine/30 hover:bg-wine/10 hover:border-wine/50 transition-all duration-300 py-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Consulting...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={16} />
                  Request Alternative Analysis
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
