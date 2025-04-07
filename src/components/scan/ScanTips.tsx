
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Sun, Move, BatteryFull } from 'lucide-react';

interface ScanTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ScanTip: React.FC<ScanTipProps> = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3 mb-3 last:mb-0">
      <div className="p-2 bg-wine/10 rounded-full text-wine">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const ScanTips: React.FC = () => {
  const tips = [
    {
      icon: <Sun className="h-4 w-4" />,
      title: "Good Lighting",
      description: "Ensure adequate lighting to capture clear images of the wine list."
    },
    {
      icon: <Move className="h-4 w-4" />,
      title: "Hold Steady",
      description: "Keep your device stable to avoid motion blur in the captured image."
    },
    {
      icon: <Camera className="h-4 w-4" />,
      title: "Frame the List",
      description: "Position the entire wine list within the camera frame."
    },
    {
      icon: <BatteryFull className="h-4 w-4" />,
      title: "Battery Check",
      description: "Ensure you have sufficient battery for scanning and processing."
    }
  ];

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium mb-3">Tips for Better Scanning</h3>
        {tips.map((tip, index) => (
          <ScanTip 
            key={index} 
            icon={tip.icon} 
            title={tip.title} 
            description={tip.description} 
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ScanTips;
