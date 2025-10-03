import { TrendingUp, Coffee, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type ScenarioType = 'impress' | 'casual' | 'savings';

interface ScenarioPreferencesProps {
  selectedScenario: ScenarioType;
  onSelectScenario: (scenario: ScenarioType) => void;
}

const scenarios: { type: ScenarioType; label: string; icon: any; description: string; gradient: string }[] = [
  { 
    type: 'impress', 
    label: 'Impress', 
    icon: TrendingUp, 
    description: 'Wow your guests',
    gradient: 'from-wine/10 to-wine-dark/5'
  },
  { 
    type: 'casual', 
    label: 'Casual', 
    icon: Coffee, 
    description: 'Easy drinking',
    gradient: 'from-amber-500/10 to-amber-600/5'
  },
  { 
    type: 'savings', 
    label: 'Best Value', 
    icon: DollarSign, 
    description: 'Highest savings',
    gradient: 'from-green-500/10 to-green-600/5'
  },
];

export const ScenarioPreferences = ({ selectedScenario, onSelectScenario }: ScenarioPreferencesProps) => {
  return (
    <Card className="border-wine/20 bg-gradient-to-br from-wine/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-wine" />
          <div>
            <CardTitle className="text-base font-serif">What's the occasion?</CardTitle>
            <CardDescription className="text-xs">
              Help us find the perfect wine for your situation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {scenarios.map(({ type, label, icon: IconComponent, description, gradient }) => (
            <Button
              key={type}
              variant={selectedScenario === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSelectScenario(type)}
              className={`flex flex-col items-center gap-1.5 h-auto py-3 transition-all ${
                selectedScenario === type 
                  ? 'bg-wine hover:bg-wine-dark text-white shadow-md' 
                  : 'hover:bg-gradient-to-b hover:scale-105 ' + gradient
              }`}
            >
              <IconComponent size={18} />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] opacity-70">{description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
