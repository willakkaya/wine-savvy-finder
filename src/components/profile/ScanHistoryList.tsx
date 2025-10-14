import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Camera, Calendar, Wine, TrendingUp, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAnalytics } from '@/hooks/use-analytics';

interface ScanHistory {
  id: string;
  scan_date: string;
  wines_found: number;
  scenario: string | null;
  top_value_wine: any;
  highest_rated_wine: any;
}

const ScanHistoryList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logEvent, EventType } = useAnalytics();
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('scan_history')
        .select(`
          *,
          top_value_wine:wine_database!scan_history_top_value_wine_id_fkey(*),
          highest_rated_wine:wine_database!scan_history_highest_rated_wine_id_fkey(*)
        `)
        .eq('user_id', user?.id)
        .order('scan_date', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading scan history:', error);
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      logEvent(EventType.SCAN_DELETE, { scan_id: id });
      
      const { error } = await supabase
        .from('scan_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "Scan history deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting scan:', error);
      toast({
        title: "Error",
        description: "Failed to delete scan history",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wine"></div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Camera className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Scan History</h3>
          <p className="text-muted-foreground mb-4">
            You haven't scanned any wine lists yet
          </p>
          <Button onClick={() => window.location.href = '/scan'}>
            Start Scanning
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((scan) => (
        <Card key={scan.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <CardDescription>
                    {formatDistanceToNow(new Date(scan.scan_date), { addSuffix: true })}
                  </CardDescription>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Wine className="h-5 w-5" />
                  {scan.wines_found} {scan.wines_found === 1 ? 'Wine' : 'Wines'} Found
                </CardTitle>
                {scan.scenario && (
                  <Badge variant="secondary" className="mt-2">
                    {scan.scenario}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(scan.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {scan.top_value_wine && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Top Value Wine
                </div>
                <div className="pl-6">
                  <p className="font-medium">{scan.top_value_wine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {scan.top_value_wine.winery} • {scan.top_value_wine.vintage || 'NV'}
                  </p>
                </div>
              </div>
            )}
            
            {scan.highest_rated_wine && scan.highest_rated_wine.id !== scan.top_value_wine?.id && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Wine className="h-4 w-4 text-wine" />
                    Highest Rated Wine
                  </div>
                  <div className="pl-6">
                    <p className="font-medium">{scan.highest_rated_wine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {scan.highest_rated_wine.winery} • {scan.highest_rated_wine.vintage || 'NV'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScanHistoryList;