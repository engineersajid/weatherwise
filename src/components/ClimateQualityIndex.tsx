import { Wind, Sun, Heart, Gauge, ShieldAlert, Navigation, Activity, Thermometer } from 'lucide-react';

interface ClimateQualityIndexProps {
  temperature: number;
  humidity: number;
  apparentTemperature?: number;
  windSpeed?: number;
  windDirection?: number;
  uvIndexMax?: number;
}

export function ClimateQualityIndex({
  temperature,
  humidity,
  apparentTemperature,
  windSpeed = 12,
  windDirection = 180,
  uvIndexMax = 3,
}: ClimateQualityIndexProps) {
  
  // Calculate a rich comfort index percentage (from 0 to 100) based on humidity and temperature
  const calculateComfortScore = () => {
    // Human sweet spot is relative humidity around 45-55% and temperature around 21-24°C
    const tempDiff = Math.abs(temperature - 22.5);
    const humidityDiff = Math.abs(humidity - 50);
    
    // Penalize comfort score for high deviation from the ideal zone
    const tempPenal = Math.min(tempDiff * 4, 50);
    const humPenal = Math.min(humidityDiff * 0.8, 50);
    
    const rawScore = 100 - (tempPenal + humPenal);
    return Math.max(Math.round(rawScore), 5);
  };

  const comfortScore = calculateComfortScore();

  const getComfortStatus = (score: number) => {
    if (score >= 85) return { label: 'Optimal Comfort', desc: 'Ideal humidity & pleasantly balanced temperature.', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' };
    if (score >= 70) return { label: 'Good Climate', desc: 'Mild temperature, pleasant breathing air.', color: 'text-teal-400 border-teal-500/30 bg-teal-500/5' };
    if (score >= 50) return { label: 'Moderate Quality', desc: 'Slightly humid or cool. Fully manageable.', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5' };
    return { label: 'Uncomfortable', desc: 'Extreme moisture levels or heavy temperatures.', color: 'text-rose-400 border-rose-500/30 bg-rose-500/5' };
  };

  const getUvRiskLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low (Safe)', desc: 'Safe outer exposure. Standard sun safety applies.', color: 'text-emerald-400 bg-emerald-500/10' };
    if (uv <= 5) return { level: 'Moderate', desc: 'Moderate solar risk. Apply screen lotion at noon.', color: 'text-amber-400 bg-amber-500/10' };
    if (uv <= 7) return { level: 'High Risk', desc: 'High solar exposure. Use protective sunglasses.', color: 'text-orange-400 bg-orange-500/10' };
    if (uv <= 10) return { level: 'Very High', desc: 'Extremely high. Seek shaded spots where possible.', color: 'text-rose-400 bg-rose-500/10' };
    return { level: 'Extreme', desc: 'Critical exposure risk. Avoid direct mid-day overhead sun.', color: 'text-purple-400 bg-purple-500/10' };
  };

  const getWindStrengthStatus = (speed: number) => {
    if (speed < 5) return 'Calm Draft';
    if (speed < 12) return 'Gentle Breeze';
    if (speed < 20) return 'Moderate Breeze';
    if (speed < 38) return 'Fresh/Strong Wind';
    return 'Gale/High Alert Wind';
  };

  // Magnus-Tetens Equation for Dew Point
  const calculateDewPoint = () => {
    const a = 17.27;
    const b = 237.7;
    const temp = temperature;
    const rh = humidity / 100;
    if (rh === 0) return temperature;
    const alpha = ((a * temp) / (b + temp)) + Math.log(rh);
    const dp = (b * alpha) / (a - alpha);
    return isNaN(dp) ? temp : Math.round(dp);
  };

  // Activity suitabilities rating
  const getOutdoorSuitability = () => {
    let score = 100;
    // Temperature deductions
    if (temperature > 30) {
      score -= (temperature - 30) * 5;
    } else if (temperature < 15) {
      score -= (15 - temperature) * 4;
    }
    // Humidity deductions
    if (humidity > 70) {
      score -= (humidity - 70) * 1.0;
    } else if (humidity < 25) {
      score -= (25 - humidity) * 0.8;
    }
    // Wind deductions
    if (windSpeed > 18) {
      score -= (windSpeed - 18) * 1.5;
    }
    
    const finalScore = Math.max(Math.min(Math.round(score), 100), 10);
    
    if (finalScore >= 80) return { score: finalScore, rating: 'Excellent', desc: 'Perfect for workouts, running, or outdoor chores.', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' };
    if (finalScore >= 60) return { score: finalScore, rating: 'Good', desc: 'Pleasant atmosphere for general active travel.', color: 'text-teal-400 border-teal-500/20 bg-teal-500/5' };
    if (finalScore >= 40) return { score: finalScore, rating: 'Fair', desc: 'Sub-optimal temperatures but manageable outdoors.', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' };
    return { score: finalScore, rating: 'Poor', desc: 'Stressful conditions. Limit intense physical labor.', color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' };
  };

  const comfort = getComfortStatus(comfortScore);
  const uvInfo = getUvRiskLevel(uvIndexMax);
  const windLabel = getWindStrengthStatus(windSpeed);
  const dewPoint = calculateDewPoint();
  const suitability = getOutdoorSuitability();

  // Compass text from degrees
  const getCompassDirection = (deg: number) => {
    const sectors = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) / 45)) % 8;
    return sectors[index];
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-slate-900/40 p-5 sm:p-6 backdrop-blur-2xl relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-5">
        <div>
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Gauge className="h-4.5 w-4.5 text-blue-400" />
            <span>Active Quality Indices</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Multi-variable microclimate & health indexes calculated in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Comfort Index Score Ring */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Comfort Score</span>
            <Heart className="h-4.5 w-4.5 text-rose-400 animate-pulse" />
          </div>
          
          <div className="flex items-center gap-4 my-2">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-16 h-16">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" className="text-blue-500" fill="transparent"
                  strokeDasharray={175}
                  strokeDashoffset={175 - (175 * comfortScore) / 100}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-black text-white">{comfortScore}%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">{comfort.label}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-1">{comfort.desc}</p>
            </div>
          </div>
        </div>

        {/* UV Exposure Ratings */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">UV Exposure Index</span>
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{uvIndexMax.toFixed(1)}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded text-white bg-white/10">{uvInfo.level}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">{uvInfo.desc}</p>
          </div>
        </div>

        {/* Wind Performance Metrics */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Wind Status</span>
            <Wind className="h-4.5 w-4.5 text-cyan-400" />
          </div>

          <div className="my-1 flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
              <Navigation className="h-5 w-5 text-blue-400" style={{ transform: `rotate(${windDirection}deg)` }} />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{Math.round(windSpeed)}</span>
                <span className="text-xs text-slate-400">km/h</span>
                <span className="text-xs font-bold text-slate-300 ml-1.5">({getCompassDirection(windDirection)})</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{windLabel}</p>
            </div>
          </div>
        </div>

        {/* Apparent Heat Sensation */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Real Apparent Feel</span>
            <ShieldAlert className="h-4.5 w-4.5 text-indigo-400" />
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {Math.round(apparentTemperature || temperature)}
              </span>
              <span className="text-lg font-bold text-slate-300">°C</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">
              {Math.round(apparentTemperature || temperature) > 30 
                ? 'High metabolic heat stress level outside.' 
                : 'Balanced body metabolic standard equilibrium.'}
            </p>
          </div>
        </div>

        {/* Dew Point Indicator */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dew Point Level</span>
            <Thermometer className="h-4.5 w-4.5 text-blue-400" />
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{dewPoint}</span>
              <span className="text-lg font-bold text-slate-300">°C</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">
              {dewPoint >= 20 
                ? 'Muggy air density. High sweat evaporation barrier.' 
                : 'Dry and highly comfortable atmospheric content.'}
            </p>
          </div>
        </div>

        {/* Outdoor Venture & Sport Suitability */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Outdoor Venture Suitability</span>
            <Activity className="h-4.5 w-4.5 text-emerald-400" />
          </div>

          <div className="my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{suitability.score}%</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white bg-white/10">{suitability.rating}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-tight">
              {suitability.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
