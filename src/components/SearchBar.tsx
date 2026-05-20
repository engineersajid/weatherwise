import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { GeocodingResult } from '../types';

interface SearchBarProps {
  onSelectCity: (latitude: number, longitude: number, name: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSelectCity, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced geocoding search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=5&language=en&format=json`
        );
        const data = await response.json();
        if (data.results && Array.isArray(data.results)) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (city: GeocodingResult) => {
    let displayName = city.name;
    const details = [];
    if (city.admin1) details.push(city.admin1);
    if (city.country) details.push(city.country);
    
    if (details.length > 0) {
      displayName += `, ${details.join(', ')}`;
    }

    onSelectCity(city.latitude, city.longitude, displayName);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const quickCities = [
    { name: 'Phulbari', lat: 25.4833, lon: 88.9262 },
    { name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 }
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto z-50">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for a town or city..."
          className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-900/40 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 backdrop-blur-xl transition duration-300"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute w-full mt-2 rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-2 z-50 overflow-hidden divide-y divide-slate-800/50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-6 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Looking up locations...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-800/60 flex items-center justify-between text-white transition duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-sm leading-tight text-slate-100">
                        {result.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {[result.admin1, result.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    {result.latitude.toFixed(2)}°, {result.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="py-6 text-center text-slate-500 text-sm">
              No matching locations found.
            </div>
          ) : (
            <div className="p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-2">
                Popular Cities
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city.lat, city.lon, city.name);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800/40 hover:border-slate-700/80 transition-all text-left"
                  >
                    <MapPin className="h-3 w-3 text-blue-500" />
                    <span className="truncate">{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
