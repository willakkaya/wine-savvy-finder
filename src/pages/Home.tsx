import React from 'react';
import { Wine, ArrowRight, Camera, Award, Banknote, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-16 wine-background">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center animate-scaleIn">
            <div className="inline-block p-3 rounded-full bg-wine/20 mb-8 backdrop-blur-md">
              <Wine size={40} className="text-cream" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-8 tracking-tight">
              Unlock Hidden Wine Gems
            </h1>
            
            <p className="text-xl text-cream/90 mb-10 max-w-xl mx-auto font-light leading-relaxed">
              Instantly identify the best value wines on any restaurant menu with just a photo.
            </p>
            
            <Button 
              onClick={() => navigate('/scan')} 
              size="lg" 
              className="bg-wine hover:bg-wine-dark/90 text-cream rounded-full text-lg px-8 py-6 shadow-apple-md"
            >
              Scan Wine List <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </section>
        
        <section className="py-24 px-6 bg-secondary/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-serif font-medium text-foreground text-center mb-16">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 rounded-full bg-wine/10 flex items-center justify-center mb-6 shadow-apple">
                  <Camera size={28} className="text-wine" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">Capture</h3>
                <p className="text-muted-foreground">Take a photo of the restaurant wine list</p>
              </div>
              
              <div className="flex flex-col items-center text-center animate-slideUp" style={{ animationDelay: '0.3s' }}>
                <div className="w-20 h-20 rounded-full bg-wine/10 flex items-center justify-center mb-6 shadow-apple">
                  <Award size={28} className="text-wine" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">Analyze</h3>
                <p className="text-muted-foreground">Our AI compares prices with market data</p>
              </div>
              
              <div className="flex flex-col items-center text-center animate-slideUp" style={{ animationDelay: '0.5s' }}>
                <div className="w-20 h-20 rounded-full bg-wine/10 flex items-center justify-center mb-6 shadow-apple">
                  <Banknote size={28} className="text-wine" />
                </div>
                <h3 className="text-2xl font-serif font-medium mb-3">Save</h3>
                <p className="text-muted-foreground">Discover which wines offer the best value</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-medium text-foreground text-center mb-8">
              Featured Wines
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-16">
              Explore some of the exceptional value wines our users have discovered at popular restaurants.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Caymus Cabernet Sauvignon",
                  year: 2018,
                  region: "Napa Valley",
                  valueScore: 92,
                  price: 120,
                  marketPrice: 160,
                  image: "https://images.vivino.com/thumbs/uXOXvx3LSHSEDtyKULBF6Q_pb_600x600.png" // Cabernet image
                },
                {
                  name: "Antinori Tignanello",
                  year: 2019,
                  region: "Tuscany",
                  valueScore: 89,
                  price: 175,
                  marketPrice: 210,
                  image: "https://images.vivino.com/thumbs/DtTrvFLfSdWIridBSpzQWQ_pb_600x600.png" // Super Tuscan image
                },
                {
                  name: "Veuve Clicquot Brut",
                  year: "NV",
                  region: "Champagne",
                  valueScore: 86,
                  price: 85,
                  marketPrice: 110,
                  image: "https://images.vivino.com/thumbs/pEVCVwqLQmOcUugEjfYqYg_pb_600x600.png" // Champagne image
                }
              ].map((wine, index) => (
                <Card key={wine.name} className="overflow-hidden shadow-apple-md transition-all duration-300 hover:shadow-apple-lg hover:translate-y-[-2px] animate-fadeIn" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="h-48 overflow-hidden">
                    <img src={wine.image} alt={wine.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-serif font-medium">{wine.name}</h3>
                        <p className="text-muted-foreground text-sm">{wine.year} • {wine.region}</p>
                      </div>
                      <div className="bg-wine/10 text-wine font-medium rounded-full h-10 w-10 flex items-center justify-center">
                        {wine.valueScore}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Banknote size={14} className="text-muted-foreground" />
                        <span>${wine.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500" />
                        <span>Value: ${wine.marketPrice - wine.price} below market</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6 bg-wine/10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-medium mb-6">Ready to find your next exceptional value?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dining out shouldn't break the bank. Discover wines that offer the best value at your favorite restaurants.
            </p>
            <Button
              onClick={() => navigate('/scan')}
              className="bg-wine text-white hover:bg-wine-dark/90 rounded-full px-8 py-6 font-medium"
              size="lg"
            >
              <Camera size={20} className="mr-2" />
              Scan a Wine List Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
