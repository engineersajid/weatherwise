import * as Icons from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function WeatherIcon({ name, className = '', size = 24 }: WeatherIconProps) {
  // Map some fallback/alternate names if they don't exist in the current lucide version
  let LucideComponent = (Icons as any)[name];
  
  if (!LucideComponent) {
    if (name === 'CloudShowers') {
      LucideComponent = Icons.CloudRain;
    } else if (name === 'SunDim') {
      LucideComponent = Icons.SunDim || Icons.Sun;
    } else if (name === 'CloudRainWind') {
      LucideComponent = Icons.CloudRain;
    } else {
      LucideComponent = Icons.HelpCircle;
    }
  }

  return <LucideComponent className={className} size={size} />;
}
