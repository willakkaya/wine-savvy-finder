
import React from 'react';
import { Wine, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <section className="relative min-h-[60vh] flex items-center justify-center px-6 py-16 wine-background">
          <div className="absolute inset-0 bg-wine-dark/70" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-block p-2 rounded-full bg-gold/20 mb-6">
              <Wine size={40} className="text-gold" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-cream mb-6">
              Find the Best Value Wines at Restaurants
            </h1>
            
            <p className="text-lg text-cream/90 mb-8 max-w-xl mx-auto">
              Snap a photo of the restaurant's wine list and instantly discover which wines offer the best value based on market prices.
            </p>
            
            <Button 
              onClick={() => navigate('/scan')} 
              size="lg" 
              className="bg-wine hover:bg-wine-dark text-cream"
            >
              Scan Wine List <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </section>
        
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-semibold text-wine-dark text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-wine/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-serif text-wine">1</span>
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">Capture</h3>
                <p className="text-muted-foreground">Take a photo of any restaurant wine list</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-wine/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-serif text-wine">2</span>
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">Analyze</h3>
                <p className="text-muted-foreground">Our app scans and compares with market prices</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-wine/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-serif text-wine">3</span>
                </div>
                <h3 className="text-xl font-serif font-medium mb-2">Save</h3>
                <p className="text-muted-foreground">Discover the best value wines on the list</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
