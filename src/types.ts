export interface CurrentWeatherData {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  apparent_temperature?: number;
  wind_speed_10m?: number;
  wind_direction_10m?: number;
  is_day?: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  weather_code: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  uv_index_max?: number[];
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeatherData;
  hourly: HourlyWeatherData;
  daily: DailyWeatherData;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string;
  country?: string;
}

export interface WeatherCondition {
  label: string;
  iconName: string; // Will match Lucide icon keys or customized components
  colorClass: string;
}

export function mapWmoCode(code: number): WeatherCondition {
  // WMO weather code mapping
  switch (code) {
    case 0:
      return { label: 'Clear Sky', iconName: 'Sun', colorClass: 'text-amber-400' };
    case 1:
      return { label: 'Mainly Clear', iconName: 'SunDim', colorClass: 'text-amber-300' };
    case 2:
      return { label: 'Partly Cloudy', iconName: 'CloudSun', colorClass: 'text-blue-300' };
    case 3:
      return { label: 'Overcast', iconName: 'Cloud', colorClass: 'text-slate-400' };
    case 45:
    case 48:
      return { label: 'Foggy', iconName: 'CloudFog', colorClass: 'text-slate-300' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', iconName: 'CloudDrizzle', colorClass: 'text-teal-300' };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', iconName: 'CloudSnow', colorClass: 'text-cyan-200' };
    case 61:
      return { label: 'Slight Rain', iconName: 'CloudRain', colorClass: 'text-blue-400' };
    case 63:
      return { label: 'Moderate Rain', iconName: 'CloudRain', colorClass: 'text-blue-500' };
    case 65:
      return { label: 'Heavy Rain', iconName: 'CloudRainWind', colorClass: 'text-indigo-400' };
    case 66:
    case 67:
      return { label: 'Freezing Rain', iconName: 'CloudSnow', colorClass: 'text-cyan-300' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snowfall', iconName: 'Snowflake', colorClass: 'text-sky-200' };
    case 77:
      return { label: 'Snow Grains', iconName: 'Snowflake', colorClass: 'text-sky-300' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', iconName: 'CloudShowers', colorClass: 'text-blue-400' };
    case 85:
    case 86:
      return { label: 'Snow Showers', iconName: 'CloudSnow', colorClass: 'text-sky-100' };
    case 95:
      return { label: 'Thunderstorm', iconName: 'CloudLightning', colorClass: 'text-purple-400' };
    case 96:
    case 99:
      return { label: 'Heavy Thunderstorm', iconName: 'CloudLightning', colorClass: 'text-indigo-500' };
    default:
      return { label: 'Unknown', iconName: 'HelpCircle', colorClass: 'text-slate-400' };
  }
}
