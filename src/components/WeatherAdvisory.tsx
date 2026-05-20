import { Shield, Sparkles, AlertCircle, ShoppingBag, Eye, HeartHandshake, CloudRain, Sun, Wind, HelpCircle } from 'lucide-react';
import { mapWmoCode } from '../types';

interface WeatherAdvisoryProps {
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed?: number;
  uvIndex?: number;
}

export function WeatherAdvisory({
  temperature,
  humidity,
  weatherCode,
  windSpeed = 12,
  uvIndex = 3,
}: WeatherAdvisoryProps) {
  const condition = mapWmoCode(weatherCode);

  // Generate customized instructions and tips
  const generateTips = () => {
    const tips = [];

    // 1. UV Exposure Index Tips
    if (uvIndex >= 6) {
      tips.push({
        type: 'protection',
        label: 'Sunscreen Required',
        desc: 'High UV exposure risk. Apply SPF 30+ sunscreen, wear a wide-brimmed sun hat, and avoid direct exposure.',
        icon: Shield,
        color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
      });
    } else if (uvIndex >= 3) {
      tips.push({
        type: 'protection',
        label: 'Moderate Shielding',
        desc: 'Moderate sun index. Wear sunglasses and stay under the shade if planning long outdoor tasks around midday.',
        icon: Eye,
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      });
    } else {
      tips.push({
        type: 'protection',
        label: 'Low Solar Skin Risk',
        desc: 'Minimal sun burn risks. Perfect time for outdoor walks, chores, or enjoying natural daylight.',
        icon: Sparkles,
        color: 'text-teal-400 border-teal-500/20 bg-teal-500/5',
      });
    }

    // 2. Temperature & Comfort Tips
    if (temperature >= 32) {
      tips.push({
        type: 'apparel',
        label: 'Extreme Thermal Wear',
        desc: 'Hot conditions. Opt for light-colored, loose, ultra-breathable cotton shirts. Keep cooling towels near.',
        icon: ShoppingBag,
        color: 'text-orange-400 border-orange-500/20 bg-orange-500/5',
      });
    } else if (temperature <= 16) {
      tips.push({
        type: 'apparel',
        label: 'Thermal Isolation Layer',
        desc: 'Cool climate. Pack a light windbreaker jacket or sweater layers before going outdoors to preserve body heat.',
        icon: ShoppingBag,
        color: 'text-sky-400 border-sky-500/20 bg-sky-500/5',
      });
    } else {
      tips.push({
        type: 'apparel',
        label: 'Pleasant Relaxed Apparel',
        desc: 'Comfortable temperature. Any casual shirt or light spring jacket is perfectly suited for today.',
        icon: ShoppingBag,
        color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      });
    }

    // 3. Hydration & Metabolic Tips
    if (temperature >= 30 || humidity >= 75) {
      tips.push({
        type: 'health',
        label: 'Active Electrolyte Hydration',
        desc: 'High sweat rates. Drink 250ml of clean drinking water every hour. Add pure salts or minerals if training.',
        icon: HeartHandshake,
        color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      });
    } else {
      tips.push({
        type: 'health',
        label: 'Standard Fluid Hydration',
        desc: 'Standard metabolic rate. Ensure basic daily water targets (2-3 liters) are met to preserve maximum energy.',
        icon: HeartHandshake,
        color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      });
    }

    // 4. Rainy / Atmospheric Condition Tips
    const isRain = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode);
    const isStorm = [95, 96, 99].includes(weatherCode);

    if (isStorm) {
      tips.push({
        type: 'safety',
        label: 'Severe Weather Warning',
        desc: 'Active Thunderstorms! Disconnect vulnerable grid electronics, find indoor shelter, and avoid tall metal posts.',
        icon: AlertCircle,
        color: 'text-red-400 border-red-500/20 bg-red-500/5',
      });
    } else if (isRain) {
      tips.push({
        type: 'safety',
        label: 'Rain Shower Advisory',
        desc: 'Precipitation active. Carry a compact umbrella, wear water-resistant shoes, and drive with alert caution.',
        icon: CloudRain,
        color: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      });
    } else if (windSpeed >= 20) {
      tips.push({
        type: 'safety',
        label: 'High Wind Velocity Alert',
        desc: 'Strong gusts detected. Fasten loose outdoor objects, protect eyes from air draft particles, and wear face cover.',
        icon: Wind,
        color: 'text-pink-400 border-pink-500/20 bg-pink-500/5',
      });
    } else {
      tips.push({
        type: 'safety',
        label: 'Stable Atmosphere Ideal',
        desc: 'No major weather system threats. Roads, activities, and aerial visibility metrics are inside perfect bounds.',
        icon: Sparkles,
        color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
      });
    }

    return tips;
  };

  const activeTips = generateTips();

  return (
    <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-2xl relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
        <div>
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <HeartHandshake className="h-4.5 w-4.5 text-blue-400" />
            <span>Weatherwise Voice Guide & Health Advisory</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Highly personalized health suggestions and instructions for current condition</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTips.map((tip, i) => {
          const IconComponent = tip.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all duration-350 hover:bg-slate-900/60 flex items-start gap-3.5 ${tip.color}`}
            >
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 shrink-0 mt-0.5">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white leading-tight">{tip.label}</h4>
                <p className="text-xs text-slate-300/95 leading-relaxed font-medium">{tip.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
