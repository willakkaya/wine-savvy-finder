
import React from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Wine, Heart } from 'lucide-react';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PreferencesSection } from '@/components/preferences/PreferencesSection';

// Home component serves as the landing page
const Home = () => {
  return (
    <PageContainer padding={false} title="Home">
      {/* Hero section with background image */}
      <div className="relative min-h-[50vh] flex items-center justify-center bg-cover bg-center text-white" 
           style={{ backgroundImage: 'url(/wine-background.jpg)' }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center p-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif mb-6">
            Find the Best Value on Wine Lists
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">
            WineCheck helps you discover great wine values at restaurants and wine shops.
          </p>
          <Link to="/scan">
            <Button size="lg" className="bg-wine hover:bg-wine-dark">
              <Search className="mr-2 h-5 w-5" />
              Scan Wine List
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Features section */}
      <div className="bg-background py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm">
              <div className="mb-4 p-3 bg-wine/10 rounded-full w-fit">
                <Search className="h-6 w-6 text-wine" />
              </div>
              <h3 className="text-xl font-medium mb-2">Scan the Wine List</h3>
              <p className="text-muted-foreground">
                Use your camera to scan the restaurant's wine list or menu.
              </p>
            </div>
            
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm">
              <div className="mb-4 p-3 bg-wine/10 rounded-full w-fit">
                <Wine className="h-6 w-6 text-wine" />
              </div>
              <h3 className="text-xl font-medium mb-2">Get Value Insights</h3>
              <p className="text-muted-foreground">
                We analyze the list and show which wines offer the best value for your money.
              </p>
            </div>
            
            <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm">
              <div className="mb-4 p-3 bg-wine/10 rounded-full w-fit">
                <Heart className="h-6 w-6 text-wine" />
              </div>
              <h3 className="text-xl font-medium mb-2">Save Favorites</h3>
              <p className="text-muted-foreground">
                Keep track of wines you love for future reference.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/scan">
              <Button variant="outline" size="lg">
                Try it Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* User preferences section */}
      <PreferencesSection />
      
      {/* Testimonials section */}
      <TestimonialsSection />
    </PageContainer>
  );
};

export default Home;
