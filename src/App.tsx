import { useEffect, useState } from 'react';
import { CloudRain, Compass, ThermometerSun, AlertCircle, RefreshCw, Palette, Facebook, Github, Linkedin, Youtube } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { DailyForecastGrid } from './components/DailyForecastGrid';
import { ClimateQualityIndex } from './components/ClimateQualityIndex';
import { WeatherAdvisory } from './components/WeatherAdvisory';
import { SkeletonLoader } from './components/SkeletonLoader';
import { WeatherApiResponse } from './types';

interface ThemePreset {
  id: string;
  name: string;
  bgClass: string;
  glowClass1: string;
  glowClass2: string;
  titleClass: string;
  accentText: string;
  iconBg: string;
  accentBorder: string;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyan',
    name: 'Steel Blue',
    bgClass: 'bg-slate-950',
    glowClass1: 'bg-blue-600/10',
    glowClass2: 'bg-cyan-600/10',
    titleClass: 'from-white via-blue-200 to-blue-400',
    accentText: 'text-blue-400',
    iconBg: 'from-blue-600 to-cyan-500',
    accentBorder: 'border-blue-500/20'
  },
  {
    id: 'aurora',
    name: 'Emerald Aurora',
    bgClass: 'bg-zinc-950',
    glowClass1: 'bg-emerald-600/10',
    glowClass2: 'bg-teal-600/10',
    titleClass: 'from-white via-emerald-100 to-teal-400',
    accentText: 'text-teal-400',
    iconBg: 'from-emerald-600 to-teal-500',
    accentBorder: 'border-emerald-500/20'
  },
  {
    id: 'sunset',
    name: 'Sunset Rose',
    bgClass: 'bg-slate-950',
    glowClass1: 'bg-fuchsia-600/10',
    glowClass2: 'bg-amber-600/10',
    titleClass: 'from-white via-pink-100 to-amber-300',
    accentText: 'text-pink-400',
    iconBg: 'from-fuchsia-600 to-amber-500',
    accentBorder: 'border-pink-500/20'
  },
  {
    id: 'obsidian',
    name: 'Midnight Obsidian',
    bgClass: 'bg-black',
    glowClass1: 'bg-zinc-900/40',
    glowClass2: 'bg-stone-900/40',
    titleClass: 'from-white via-slate-300 to-slate-500',
    accentText: 'text-slate-300',
    iconBg: 'from-slate-700 to-zinc-800',
    accentBorder: 'border-slate-800'
  },
  {
    id: 'amber',
    name: 'Cosmic Amber',
    bgClass: 'bg-slate-950',
    glowClass1: 'bg-amber-600/10',
    glowClass2: 'bg-yellow-600/10',
    titleClass: 'from-white via-amber-100 to-yellow-400',
    accentText: 'text-amber-400',
    iconBg: 'from-amber-600 to-yellow-500',
    accentBorder: 'border-amber-500/20'
  }
];

export default function App() {
  const [coords, setCoords] = useState({ lat: 25.4833, lon: 88.9262 }); // Default Phulbari
  const [cityName, setCityName] = useState('Phulbari, Bangladesh');
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(THEME_PRESETS[0]);

  // Fetch weather when coordinates change, specifying new UV & Apparent & Wind parameters
  const fetchWeather = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve weather data from the weather service.');
      }
      
      const data: WeatherApiResponse = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred while fetching weather. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
  }, [coords]);

  const handleSelectCity = (latitude: number, longitude: number, name: string) => {
    setCoords({ lat: latitude, lon: longitude });
    setCityName(name);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setError(null);
    setCityName('Acquiring device GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });
        setCityName(`Resolving mapping for ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E...`);
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            {
              headers: {
                'Accept-Language': 'en',
                'User-Agent': 'Weatherwise-Forecast-Applet'
              }
            }
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const placeName = addr.city || addr.town || addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || addr.municipality || addr.county || addr.state_district;
            const state = addr.state;
            const country = addr.country;
            
            let label = '';
            if (placeName && country) {
              label = `${placeName}, ${country}`;
            } else if (placeName && state) {
              label = `${placeName}, ${state}`;
            } else if (state && country) {
              label = `${state}, ${country}`;
            } else if (data.display_name) {
              const parts = data.display_name.split(',');
              label = parts.slice(0, 2).map((p: any) => p.trim()).join(', ');
            } else {
              label = `Coordinates (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
            }
            setCityName(label);
          } else {
            setCityName(`Coordinates (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
          }
        } catch {
          setCityName(`Coordinates (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError('Location access denied or timed out. Defaulting back to Phulbari coordinates.');
        setCityName('Phulbari, Bangladesh');
        setCoords({ lat: 25.4833, lon: 88.9262 });
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} text-slate-100 flex flex-col antialiased overflow-x-hidden relative transition-colors duration-500 selection:bg-blue-500/35 selection:text-white`}>
      {/* Dynamic ambient glow graphics matching the active theme */}
      <div className="absolute top-0 left-0 right-0 h-[650px] bg-radial from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      <div className={`absolute top-[15%] right-[-10%] h-[500px] w-[500px] rounded-full ${currentTheme.glowClass1} blur-[140px] pointer-events-none transition-all duration-700`} />
      <div className={`absolute bottom-[25%] left-[-10%] h-[500px] w-[500px] rounded-full ${currentTheme.glowClass2} blur-[150px] pointer-events-none transition-all duration-700`} />

      {/* Main Container */}
      <div className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col gap-5 sm:gap-6">
        
        {/* App Title Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${currentTheme.iconBg} shadow-lg shadow-black/30 text-white transition-all`}>
              <ThermometerSun className="h-6 w-6" />
            </div>
            <div>
              <h1 className={`text-xl font-black tracking-tight bg-gradient-to-r ${currentTheme.titleClass} bg-clip-text text-transparent transition-all duration-500`}>
                Weatherwise FORECAST
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                Precision Climate Intelligence
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end">
            {/* Theme Presets Buttons */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-xl">
              <span className="p-1 px-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                <Palette className="h-2.5 w-2.5" />
                Theme:
              </span>
              <div className="flex gap-1">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTheme(t)}
                    title={t.name}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      currentTheme.id === t.id
                        ? 'bg-white/10 text-white shadow'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.name.split(' ')[1] || t.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleUseLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border border-white/5 bg-slate-900/40 hover:bg-slate-900/75 text-slate-300 hover:text-white transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locationLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />
              ) : (
                <Compass className="h-3.5 w-3.5 text-blue-400" />
              )}
              <span>Device Location</span>
            </button>
          </div>
        </header>

        {/* Dynamic Search Autocomplete bar */}
        <section>
          <SearchBar onSelectCity={handleSelectCity} isLoading={isLoading} />
        </section>

        {/* Info/Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/20 bg-red-950/20 text-red-200">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <h5 className="font-bold">Weather Query Failed</h5>
              <p className="text-red-300/80 mt-1">{error}</p>
            </div>
            <button
              onClick={() => fetchWeather(coords.lat, coords.lon)}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-bold transition duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Active main content dashboard views */}
        <main className="flex-grow flex flex-col gap-6">
          {isLoading ? (
            <SkeletonLoader />
          ) : weatherData ? (
            <>
              {/* Primary Present Day Panel */}
              <CurrentWeatherCard
                cityName={cityName}
                temperature={weatherData.current.temperature_2m}
                humidity={weatherData.current.relative_humidity_2m}
                weatherCode={weatherData.current.weather_code}
                latitude={weatherData.latitude}
                longitude={weatherData.longitude}
                timezone={weatherData.timezone}
              />

              {/* High-Fidelity Climate Quality Indicators Dashboard */}
              <ClimateQualityIndex
                temperature={weatherData.current.temperature_2m}
                humidity={weatherData.current.relative_humidity_2m}
                apparentTemperature={weatherData.current.apparent_temperature}
                windSpeed={weatherData.current.wind_speed_10m}
                windDirection={weatherData.current.wind_direction_10m}
                uvIndexMax={weatherData.daily.uv_index_max?.[0] ?? 3}
              />

              {/* Dynamic Health Advisories & Personalized Tips */}
              <WeatherAdvisory
                temperature={weatherData.current.temperature_2m}
                humidity={weatherData.current.relative_humidity_2m}
                weatherCode={weatherData.current.weather_code}
                windSpeed={weatherData.current.wind_speed_10m}
                uvIndex={weatherData.daily.uv_index_max?.[0] ?? 3}
              />

              {/* Weekly Extended Outlook Card list and collapsible hourly timelines */}
              <DailyForecastGrid
                daily={weatherData.daily}
                hourly={weatherData.hourly}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-slate-850 rounded-3xl bg-slate-900/10">
              <CloudRain className="h-10 w-10 text-slate-500 mb-4 animate-bounce" />
              <p className="text-slate-400 text-sm">No weather forecast loaded.</p>
              <button
                onClick={() => fetchWeather(coords.lat, coords.lon)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition duration-200"
              >
                Reload Default Location
              </button>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full max-w-4xl mx-auto px-6 py-8 border-t border-white/5 text-center relative z-10 flex flex-col items-center justify-center gap-6 mt-12">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="https://github.com/engineersajid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-slate-500 hover:bg-white/10 text-slate-300 hover:text-white font-mono text-xs font-bold tracking-tight transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Github className="h-4 w-4 text-emerald-400" />
            <span>GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/developersajid/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 text-slate-300 hover:text-blue-400 font-mono text-xs font-bold tracking-tight transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Linkedin className="h-4 w-4 text-blue-400" />
            <span>LinkedIn</span>
          </a>
          <a
            href="https://www.facebook.com/programmer.sajid"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-550/30 hover:bg-blue-600/5 text-slate-300 hover:text-blue-500 font-mono text-xs font-bold tracking-tight transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Facebook className="h-4 w-4 text-blue-500" />
            <span>Facebook</span>
          </a>
          <a
            href="https://www.youtube.com/@ExplorerMotivation"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-slate-300 hover:text-red-400 font-mono text-xs font-bold tracking-tight transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Youtube className="h-4 w-4 text-red-500" />
            <span>YouTube</span>
          </a>
        </div>
        <p className="text-xs font-mono text-slate-500">© 2026 Weatherwise FORECAST. All rights reserved by Sajid.</p>
      </footer>
    </div>
  );
}
