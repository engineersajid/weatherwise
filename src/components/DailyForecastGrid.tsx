import { DailyWeatherData, HourlyWeatherData, mapWmoCode } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Clock, Star, Thermometer } from 'lucide-react';

interface DailyForecastGridProps {
  daily: DailyWeatherData;
  hourly: HourlyWeatherData;
}

export function DailyForecastGrid({ daily, hourly }: DailyForecastGridProps) {
  const getDayName = (dateStr: string, index: number) => {
    if (index === 0) return 'Today';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } catch {
      return dateStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    } catch {
      return dateStr;
    }
  };

  // Extract 24-hours for a given daily date (e.g., "2026-05-20")
  const getHourlyDataForDay = (dailyDate: string, isToday: boolean) => {
    const hours: { time: string; temp: number; code: number }[] = [];
    
    for (let i = 0; i < hourly.time.length; i++) {
      const hourlyTime = hourly.time[i];
      if (hourlyTime.startsWith(dailyDate)) {
        hours.push({
          time: hourlyTime,
          temp: hourly.temperature_2m[i],
          code: hourly.weather_code[i],
        });
      }
    }
    
    // Fallback: index based segmentation if date format matching didn't yield anything
    if (hours.length === 0) {
      const dayIndex = daily.time.indexOf(dailyDate);
      if (dayIndex !== -1) {
        const startIdx = dayIndex * 24;
        const endIdx = startIdx + 24;
        for (let i = startIdx; i < Math.min(endIdx, hourly.time.length); i++) {
          hours.push({
            time: hourly.time[i],
            temp: hourly.temperature_2m[i],
            code: hourly.weather_code[i],
          });
        }
      }
    }

    // Filter starting with current time for Today
    if (isToday) {
      const currentHour = new Date().getHours();
      const filtered = hours.filter(h => {
        try {
          // Parse e.g., "2026-05-20T04:00" -> hour is 4
          const parts = h.time.split('T');
          if (parts.length > 1) {
            const hourPart = parseInt(parts[1].split(':')[0], 10);
            return hourPart >= currentHour;
          }
          return true;
        } catch {
          return true;
        }
      });
      // Fallback if filtering left empty
      return filtered.length > 0 ? filtered : hours;
    }

    return hours;
  };

  const formatHourString = (timeStr: string, isNow: boolean) => {
    if (isNow) return 'NOW';
    try {
      const date = new Date(timeStr);
      return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00', '');
    } catch {
      const parts = timeStr.split('T');
      return parts.length > 1 ? parts[1] : timeStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight uppercase">Extended 7-Day & Hourly Intelligence</h3>
          <p className="text-xs text-slate-400 mt-0.5">Persistent hourly breakdowns for other days shown openly below</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-semibold text-blue-400 font-mono uppercase">
          <Clock className="h-3 w-3" /> Fully Open View
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {daily.time.map((dateStr, index) => {
          const maxTemp = daily.temperature_2m_max[index];
          const minTemp = daily.temperature_2m_min[index];
          const code = daily.weather_code[index];
          const condition = mapWmoCode(code);
          const isToday = index === 0;
          const dayHours = getHourlyDataForDay(dateStr, isToday);

          return (
            <div
              key={dateStr}
              className={`rounded-3xl border p-5 sm:p-6 transition-all duration-300 ${
                isToday
                  ? 'bg-gradient-to-b from-slate-900/90 to-slate-900/50 border-blue-500/30 shadow-xl shadow-blue-500/5'
                  : 'bg-slate-900/40 border-white/5'
              } backdrop-blur-xl hover:border-white/10`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 shadow-inner`}>
                    <WeatherIcon
                      name={condition.iconName}
                      className={`${condition.colorClass} h-7 w-7`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                        {getDayName(dateStr, index)}
                      </h4>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-[9px] font-black uppercase text-white tracking-widest animate-pulse">
                          Live Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-medium">{formatDate(dateStr)} • {condition.label}</p>
                  </div>
                </div>

                {/* Day Summary Indicators */}
                <div className="flex items-center gap-4 sm:text-right">
                  <div className="flex items-center gap-3 py-1 px-3 rounded-full bg-white/5 border border-white/5">
                    <Thermometer className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-bold text-white">{Math.round(maxTemp)}°C</span>
                    <span className="text-xs text-slate-500">/</span>
                    <span className="text-xs font-semibold text-slate-400">{Math.round(minTemp)}°C</span>
                  </div>
                </div>
              </div>

              {/* Persistently Open Hourly Forecast timeline */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    <span>Hourly Timeline</span>
                  </div>
                  {isToday && (
                    <span className="text-[9px] text-blue-400 font-bold tracking-tight">Starting from current hour</span>
                  )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {dayHours.map((hour, idx) => {
                    const isNowHour = isToday && idx === 0;
                    const hourCond = mapWmoCode(hour.code);
                    
                    return (
                      <div
                        key={hour.time}
                        className={`flex flex-col items-center justify-between p-3.5 rounded-2xl min-w-[88px] text-center transition-all ${
                          isNowHour
                            ? 'bg-blue-600/20 border-2 border-blue-500 text-white shadow-lg shadow-blue-500/10 shrink-0 scale-105 mx-0.5'
                            : 'bg-white/5 border border-white/5 hover:bg-white/[0.08] text-slate-300'
                        }`}
                      >
                        <span className={`text-[10px] font-bold ${isNowHour ? 'text-blue-300 font-black' : 'text-slate-400'} uppercase font-mono`}>
                          {formatHourString(hour.time, isNowHour)}
                        </span>
                        
                        <div className="my-2.5">
                          <WeatherIcon
                            name={hourCond.iconName}
                            className={`${hourCond.colorClass} h-6 w-6 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}
                          />
                        </div>

                        <span className="text-base font-black tracking-tight self-center">
                          {Math.round(hour.temp)}°
                        </span>

                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1 max-w-[80px] truncate">
                          {hourCond.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
