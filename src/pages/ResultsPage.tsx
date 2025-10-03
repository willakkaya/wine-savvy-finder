
import React, { useEffect, useState, useMemo } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Camera, Info, WifiOff, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import WineCardLink from '@/components/wine/WineCardLink';
import { WineInfo } from '@/components/wine/WineCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { storeWineResults } from '@/utils/wineUtils';
import { getOfflineWines, storeWinesOffline } from '@/utils/offlineUtils'; 
import WineNotes from '@/components/wine/WineNotes';
import { Card } from '@/components/ui/card';
import ResultsFilters from '@/components/results/ResultsFilters';
import ResultsStats from '@/components/results/ResultsStats';
import { SommelierRecommendations } from '@/components/results/SommelierRecommendations';

const ResultsPage: React.FC = () => {
  const [wines, setWines] = useState<WineInfo[]>([]);
  const [expandedWine, setExpandedWine] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [offlineTimestamp, setOfflineTimestamp] = useState<number | null>(null);
  
  // Filter and sort states
  const [sortBy, setSortBy] = useState<string>('value');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const scenario = location.state?.scenario || 'casual';
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => setNetworkError(false);
    const handleOffline = () => setNetworkError(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial network status
    setNetworkError(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load results from navigation state or sessionStorage on component mount
  useEffect(() => {
    setLoading(true);
    
    // Check if we're offline
    const isOffline = !navigator.onLine;
    setNetworkError(isOffline);
    
    // First, check if wines were passed via navigation state (from scan page)
    const stateWines = location.state?.wines;
    
    if (stateWines && Array.isArray(stateWines) && stateWines.length > 0) {
      setWines(stateWines);
      
      // Store wines in our cache for easy access from detail pages
      storeWineResults(stateWines);
      
      // Also store in offline storage for future use
      storeWinesOffline(stateWines);
      
      setLoading(false);
      setIsOfflineData(false);
    } else if (isOffline) {
      // No navigation state and we're offline, load from local storage
      loadOfflineData();
    } else {
      // No results found, show a toast and then navigate back after a delay
      toast.error('No scan results found', {
        description: 'Please scan a wine list first'
      });
      setTimeout(() => navigate('/scan'), 2000);
      setLoading(false);
    }
  }, [navigate, location.state]);
  
  // Load data from offline storage
  const loadOfflineData = () => {
    const { wines: offlineWines, timestamp } = getOfflineWines();
    
    if (offlineWines.length > 0) {
      setWines(offlineWines);
      setIsOfflineData(true);
      setOfflineTimestamp(timestamp);
      setLoading(false);
      
      toast.info('Showing previously scanned wines', {
        description: 'You are viewing offline data'
      });
    } else {
      // No offline data available either
      toast.error('No scan results found', {
        description: 'Please scan a wine list first'
      });
      setTimeout(() => navigate('/scan'), 2000);
      setLoading(false);
    }
  };
  
  // Get unique wine types
  const wineTypes = useMemo(() => {
    const types = [...new Set(wines.map(w => w.wineType).filter(Boolean))];
    return types as string[];
  }, [wines]);

  // Filter and sort wines
  const filteredAndSortedWines = useMemo(() => {
    let result = [...wines];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(wine => 
        wine.name.toLowerCase().includes(query) ||
        wine.winery.toLowerCase().includes(query) ||
        wine.region.toLowerCase().includes(query) ||
        wine.country.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(wine => wine.wineType === filterType);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return b.valueScore - a.valueScore;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'savings':
          return (b.marketPrice - b.price) - (a.marketPrice - a.price);
        default:
          return 0;
      }
    });

    return result;
  }, [wines, searchQuery, filterType, sortBy]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setSortBy('value');
  };
  
  // Toggle notes expansion
  const toggleNotes = (wineId: string) => {
    setExpandedWine(prev => prev === wineId ? null : wineId);
  };
  
  // Format timestamp for display
  const formatOfflineTimestamp = (timestamp: number | null): string => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <PageContainer title="Scan Results" className="pb-6">
      <div className="flex flex-col items-center max-w-4xl mx-auto">
        <div className="w-full flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/scan')}
            className="text-wine hover:bg-wine/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scanner
          </Button>
          
          <h1 className="text-xl md:text-2xl font-serif">Wine Analysis</h1>
          
          <div className="w-[88px]"> {/* Empty div for flex balance */}
          </div>
        </div>
        
        {/* Network Error Alert */}
        {networkError && (
          <Alert variant="destructive" className="mb-6">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>Network Unavailable</AlertTitle>
            <AlertDescription>
              Showing {isOfflineData ? 'previously cached' : 'current'} wine data. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Offline Data Notice */}
        {isOfflineData && offlineTimestamp && (
          <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200">
            <History className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-700">Offline Data</AlertTitle>
            <AlertDescription className="text-amber-700">
              Showing wine data from {formatOfflineTimestamp(offlineTimestamp)}
            </AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center">
            <div className="animate-spin h-12 w-12 rounded-full border-4 border-wine border-t-transparent mb-4"></div>
            <h2 className="text-xl font-serif">Loading results...</h2>
          </div>
        ) : wines.length > 0 ? (
          <>
            {/* Stats Cards */}
            <ResultsStats wines={wines} />

            {/* Sommelier Recommendations */}
            <div className="w-full mb-6">
              <SommelierRecommendations wines={wines} scenario={scenario} />
            </div>

            {/* Filters */}
            <ResultsFilters
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              wineTypes={wineTypes}
              onReset={handleResetFilters}
            />

            {/* Results Info */}
            <div className="mb-6">
              <Alert className="bg-wine/5 border-wine/20">
                <Info className="h-4 w-4 text-wine" />
                <AlertTitle>
                  {filteredAndSortedWines.length === wines.length 
                    ? `Showing all ${wines.length} wines`
                    : `Showing ${filteredAndSortedWines.length} of ${wines.length} wines`
                  }
                </AlertTitle>
                <AlertDescription>
                  Tap a wine card to view detailed notes and food pairings.
                </AlertDescription>
              </Alert>
            </div>
            
            {/* Wine Grid */}
            {filteredAndSortedWines.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredAndSortedWines.map((wine, index) => (
                <div 
                  key={wine.id} 
                  className="animate-fadeIn flex flex-col"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div onClick={() => toggleNotes(wine.id)}>
                    <WineCardLink 
                      wine={wine} 
                      rank={index + 1} 
                      className=""
                    />
                  </div>
                  
                  {expandedWine === wine.id && (
                    <Card className="mt-2 p-3 border-wine/20">
                      <WineNotes wine={wine} />
                      <div className="mt-2 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs" 
                          onClick={() => navigate(`/wine/${wine.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card>
                  )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No wines match your filters</p>
                <Button variant="outline" onClick={handleResetFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-12 text-center">
            <Camera className="h-16 w-16 text-wine/30 mb-4" />
            <h2 className="text-xl font-serif mb-2">No wines found</h2>
            <p className="text-muted-foreground mb-6">
              Please scan a wine list to see results here
            </p>
            <Button onClick={() => navigate('/scan')} className="bg-wine hover:bg-wine-dark">
              Scan Wine List
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default ResultsPage;
