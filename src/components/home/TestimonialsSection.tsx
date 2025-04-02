
import React from 'react';
import { Users, Quote } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const testimonials = [
  {
    text: "Found a $65 Barolo that was priced $30 below market at my anniversary dinner. This app paid for itself in one use!",
    author: "Michael S.",
    location: "New York, NY"
  },
  {
    text: "I was always intimidated by restaurant wine lists. Now I feel confident making selections that impress my clients.",
    author: "Jennifer T.",
    location: "Chicago, IL"
  },
  {
    text: "Discovered an amazing Pinot Noir that was actually fairly priced. Would have never ordered it without this app.",
    author: "David L.",
    location: "San Francisco, CA"
  }
];

const TestimonialsSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-20 px-6 bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <Users className="text-wine mr-3" size={24} />
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
            What Our Users Say
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-apple relative animate-fadeIn"
              style={{ animationDelay: `${isMobile ? 0 : index * 0.2}s` }}
            >
              <Quote className="absolute text-wine/10 h-16 w-16 -top-2 -left-2" />
              <div className="relative">
                <p className="text-foreground/90 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{testimonial.author}</span>
                  <span className="text-sm text-muted-foreground">{testimonial.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
