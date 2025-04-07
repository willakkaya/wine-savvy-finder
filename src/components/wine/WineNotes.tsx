
import React from 'react';
import { WineInfo } from './WineCard';
import { cn } from '@/lib/utils';

interface WineNotesProps {
  wine: WineInfo;
  className?: string;
}

const WineNotes: React.FC<WineNotesProps> = ({ wine, className }) => {
  // Generate three unique, concise notes about the wine
  const notes = generateWineNotes(wine);
  
  return (
    <div className={cn("space-y-2", className)}>
      {notes.map((note, index) => (
        <div 
          key={index} 
          className="text-sm bg-muted/50 p-2.5 rounded-md flex items-start gap-2"
        >
          <span className="font-medium text-wine shrink-0 pt-0.5">•</span>
          <span className="text-muted-foreground">{note}</span>
        </div>
      ))}
    </div>
  );
};

const generateWineNotes = (wine: WineInfo): string[] => {
  // Array of possible note templates based on wine characteristics
  const notes: string[] = [];
  
  // Note 1: Rating and general quality
  if (wine.rating >= 95) {
    notes.push(`Exceptional quality with a ${wine.rating}/100 rating. This wine exhibits remarkable depth and character typical of top ${wine.region} wines.`);
  } else if (wine.rating >= 90) {
    notes.push(`Excellent quality rated ${wine.rating}/100. Displays notable complexity and balance characteristic of premium ${wine.region} wines.`);
  } else if (wine.rating >= 87) {
    notes.push(`Good quality wine rated ${wine.rating}/100. Shows typical ${wine.region} characteristics with pleasant flavor intensity.`);
  } else {
    notes.push(`Rated ${wine.rating}/100. A straightforward example of ${wine.region} wine with approachable character.`);
  }
  
  // Note 2: Value and price comparison
  const saving = wine.marketPrice - wine.price;
  const savingPercent = Math.round((saving / wine.marketPrice) * 100);
  
  if (savingPercent > 30) {
    notes.push(`Exceptional value at $${wine.price}, approximately ${savingPercent}% below typical retail price of $${wine.marketPrice}.`);
  } else if (savingPercent > 15) {
    notes.push(`Good value, priced $${saving} below average retail ($${wine.marketPrice}), representing a ${savingPercent}% savings.`);
  } else if (savingPercent > 0) {
    notes.push(`Fair pricing at $${wine.price}, slightly below the average retail price of $${wine.marketPrice}.`);
  } else {
    notes.push(`Market price of $${wine.price} is typical for this ${wine.year} ${wine.region} wine.`);
  }
  
  // Note 3: Region and vintage specific notes
  const regionNotes: Record<string, string[]> = {
    'Bordeaux': ['Typically shows cassis, black cherry, and cedar notes', 'Classic structure with firm tannins', 'Ages well, with evolving complexity'],
    'Burgundy': ['Known for red and black fruit with earthy undertones', 'Silky texture with delicate aromatics', 'Terroir-driven with subtle mineral notes'],
    'Napa Valley': ['Bold with ripe black fruit flavors', 'Often shows vanilla and mocha from oak aging', 'Full-bodied with plush mouthfeel'],
    'Tuscany': ['Exhibits cherry, plum and herbal notes', 'Medium-bodied with bright acidity', 'Traditional style with earthy elements'],
    'Piedmont': ['Displays rose, tar, and red berry aromas', 'Structured with firm tannins', 'Requires aging to show full potential'],
    'Rioja': ['Shows red fruits with vanilla and dill accents', 'Elegant structure with balanced oak influence', 'Traditional aging in American oak barrels'],
    'Champagne': ['Crisp acidity with apple, citrus and toast notes', 'Fine, persistent bubbles', 'Elegant with mineral undertones'],
    'Mosel': ['Delicate with vibrant acidity and stone fruit flavors', 'Low alcohol with slate-driven minerality', 'Can range from dry to sweet in style'],
    'Mendoza': ['Intense dark fruit with violet aromas', 'Full-bodied with smooth tannins', 'High altitude vineyards provide freshness']
  };
  
  // Find the matching region or closest match
  let regionNote = 'Shows characteristic flavors and structure typical of its region and vintage.';
  for (const [region, regionNotesList] of Object.entries(regionNotes)) {
    if (wine.region.includes(region) || region.includes(wine.region)) {
      regionNote = regionNotesList[Math.floor(Math.random() * regionNotesList.length)];
      break;
    }
  }
  
  // Add vintage influence
  const currentYear = new Date().getFullYear();
  const ageClass = currentYear - wine.year;
  
  if (ageClass > 15) {
    notes.push(`${wine.year} vintage (${ageClass} years old) - ${regionNote}. Now fully mature with tertiary flavors developing.`);
  } else if (ageClass > 7) {
    notes.push(`${wine.year} vintage (${ageClass} years old) - ${regionNote}. Entering its prime drinking window.`);
  } else if (ageClass > 3) {
    notes.push(`${wine.year} vintage (${ageClass} years old) - ${regionNote}. Beginning to show its potential.`);
  } else {
    notes.push(`${wine.year} vintage (young) - ${regionNote}. May benefit from additional aging.`);
  }
  
  return notes;
};

export default WineNotes;
