import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingDown, DollarSign, Trophy, Wine } from 'lucide-react';
import { WineInfo } from '@/components/wine/WineCard';

interface ResultsStatsProps {
  wines: WineInfo[];
}

const ResultsStats: React.FC<ResultsStatsProps> = ({ wines }) => {
  const totalSavings = wines.reduce((sum, wine) => sum + (wine.marketPrice - wine.price), 0);
  const avgValueScore = Math.round(wines.reduce((sum, wine) => sum + wine.valueScore, 0) / wines.length);
  const bestValue = wines.reduce((best, wine) => wine.valueScore > best.valueScore ? wine : best, wines[0]);
  const avgPrice = Math.round(wines.reduce((sum, wine) => sum + wine.price, 0) / wines.length);

  const stats = [
    {
      icon: TrendingDown,
      label: 'Total Savings',
      value: `$${totalSavings.toFixed(0)}`,
      description: 'vs. market price',
      color: 'text-green-600'
    },
    {
      icon: Trophy,
      label: 'Avg Value Score',
      value: `${avgValueScore}`,
      description: 'out of 100',
      color: 'text-amber-600'
    },
    {
      icon: Wine,
      label: 'Best Value',
      value: bestValue?.name.split(' ').slice(0, 2).join(' '),
      description: `Score: ${bestValue?.valueScore}`,
      color: 'text-wine'
    },
    {
      icon: DollarSign,
      label: 'Avg Price',
      value: `$${avgPrice}`,
      description: 'per bottle',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-serif mb-1 truncate" title={stat.value}>
            {stat.value}
          </p>
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default ResultsStats;
