import { mapWmoCode } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Clock, MapPin, Compass, Eye, Shield, Sun, CloudRain } from 'lucide-react';

interface CurrentWeatherCardProps {
  temperature: number;
  humidity: number;
  weatherCode: number;
  cityName: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export function CurrentWeatherCard({
  temperature,
  humidity,
  weatherCode,
  cityName,
  latitude,
  longitude,
  timezone,
}: CurrentWeatherCardProps) {
  const condition = mapWmoCode(weatherCode);

  // Dynamic scenery generation to act as beautiful, real-time photographic representation
  const renderWeatherArtFrame = () => {
    const isSunny = [0, 1].includes(weatherCode);
    const isCloudy = [2, 3].includes(weatherCode);
    const isFoggy = [45, 48].includes(weatherCode);
    const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode);
    const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
    const isStormy = [95, 96, 99].includes(weatherCode);

    let artBg = 'from-sky-400 to-indigo-600';
    let overlayElements = null;

    if (isSunny) {
      artBg = 'from-amber-400 via-orange-500 to-rose-600';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Radiant Golden Sun Glare */}
          <div className="absolute top-4 right-4 w-28 h-28 rounded-full bg-yellow-250 opacity-90 blur-xl animate-pulse" />
          <div className="absolute top-10 right-10 w-16 h-16 rounded-full bg-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.8)]" />
          {/* Flare Ring */}
          <div className="absolute top-12 right-12 w-20 h-20 rounded-full border border-white/20 scale-125" />
          {/* Ground Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent" />
        </div>
      );
    } else if (isCloudy) {
      artBg = 'from-slate-400 via-blue-500 to-indigo-700';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Overlapping Cloud Vectors */}
          <div className="absolute top-6 left-6 w-24 h-12 rounded-full bg-white/25 blur-sm" />
          <div className="absolute top-12 right-10 w-28 h-14 rounded-full bg-white/15 blur-sm" />
          <div className="absolute top-4 right-16 w-16 h-8 rounded-full bg-white/20 blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900/30 to-transparent" />
        </div>
      );
    } else if (isFoggy) {
      artBg = 'from-zinc-500 via-slate-600 to-zinc-800';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Misty layers */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
          <div className="absolute bottom-4 left-4 w-3/4 h-12 rounded-full bg-white/10 blur-md animate-pulse" />
          <div className="absolute top-12 right-4 w-1/2 h-14 rounded-full bg-slate-300/10 blur-lg" />
        </div>
      );
    } else if (isRainy) {
      artBg = 'from-slate-800 via-indigo-900 to-slate-950';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Falling rain streaks */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(170deg,transparent_45%,rgba(255,255,255,0.15)_50%,transparent_55%)] bg-[size:30px_30px] animate-[pulse_2s_infinite]" />
          <div className="absolute top-2 left-6 w-24 h-12 rounded-full bg-slate-700/30 blur-sm" />
          <div className="absolute top-8 right-12 w-32 h-16 rounded-full bg-slate-700/20 blur-sm" />
          {/* Ground reflection glow */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-blue-500/10 blur-md" />
        </div>
      );
    } else if (isSnowy) {
      artBg = 'from-cyan-700 via-indigo-800 to-slate-900';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Floating snow particles */}
          <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-white/80 blur-[1px] animate-ping" />
          <div className="absolute top-12 right-12 w-1.5 h-1.5 rounded-full bg-white/90" />
          <div className="absolute top-16 left-20 w-2.5 h-2.5 rounded-full bg-white/60 blur-[1px]" />
          <div className="absolute bottom-8 right-8 w-2 h-2 rounded-full bg-white/70" />
          <div className="absolute inset-0 bg-white/[0.03] backdrop-overlay" />
        </div>
      );
    } else if (isStormy) {
      artBg = 'from-purple-950 via-slate-900 to-black';
      overlayElements = (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
          {/* Lightning Flash Simulation */}
          <div className="absolute inset-0 bg-violet-600/10 animate-[pulse_1.5s_infinite]" />
          <div className="absolute top-4 right-1/3 w-0.5 h-20 bg-violet-300/60 blur-[1px] rotate-12" />
          <div className="absolute top-16 right-1/4 w-0.5 h-12 bg-indigo-300/50 blur-[2px] -rotate-12" />
          {/* Storm Clouds */}
          <div className="absolute top-4 left-4 w-32 h-14 rounded-full bg-purple-900/30 blur-md" />
          <div className="absolute top-8 right-6 w-28 h-12 rounded-full bg-slate-900/50 blur-md" />
        </div>
      );
    } else {
      artBg = 'from-slate-700 via-slate-800 to-slate-950';
    }

    return (
      <div className={`relative w-full md:w-64 h-40 md:h-full rounded-2xl bg-gradient-to-br ${artBg} border border-white/10 shadow-inner flex flex-col justify-between p-4 overflow-hidden shrink-0`}>
        {overlayElements}
        
        {/* Landscape Floating Tag */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[9px] font-black text-white bg-black/45 px-2 py-0.5 rounded-md backdrop-blur-md uppercase tracking-wider font-mono">
            Landscape Photo Frame
          </span>
          <span className="text-[10px] font-semibold text-white/90 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
            Live Simulated
          </span>
        </div>

        {/* Ambient landscape mountains visualization */}
        <div className="relative z-10">
          <div className="flex items-baseline gap-1 bg-black/35 p-2 rounded-xl backdrop-blur-md border border-white/5">
            <span className="text-xl font-black text-white">{Math.round(temperature)}°C</span>
            <span className="text-[9px] font-bold text-slate-300 uppercase shrink-0">In {cityName.split(',')[0]}</span>
          </div>
        </div>
      </div>
    );
  };

  const getLocalFormattedTime = () => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone === 'auto' ? undefined : timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (e) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }).format(new Date());
    }
  };

  const getLocalDate = () => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone === 'auto' ? undefined : timezone,
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      };
      return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (e) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date());
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/40 p-5 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
      {/* Dynamic ambient glass backdrop blur glow */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10 h-full">
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4.5 w-4.5 text-blue-400 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{cityName}</h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-400 font-mono">{getLocalDate()}</p>
            
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-sans tracking-tighter text-white">
                {Math.round(temperature)}
              </span>
              <span className="text-2xl sm:text-3xl font-semibold text-slate-300">°C</span>
            </div>
            
            <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <WeatherIcon
                name={condition.iconName}
                className={`${condition.colorClass} h-5 w-5`}
              />
              <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">{condition.label}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Humidity</p>
                <p className="text-base font-black text-white mt-0.5">{humidity}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Time</p>
                <div className="text-base font-black text-white mt-0.5">
                  {getLocalFormattedTime()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Landscape Photo Frame column */}
        {renderWeatherArtFrame()}
      </div>

      <div className="mt-6 pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400/80">
        <div className="flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-blue-400" />
          <span>Coordinates: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E</span>
        </div>
        <div className="bg-white/5 px-2.5 py-1 rounded text-[10px] font-bold tracking-tight">
          <span>{timezone}</span>
        </div>
      </div>
    </div>
  );
}
