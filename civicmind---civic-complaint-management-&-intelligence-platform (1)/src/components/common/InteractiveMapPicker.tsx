import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers } from 'lucide-react';
import { LocationCoordinates } from '../../types';

interface InteractiveMapPickerProps {
  coordinates: LocationCoordinates;
  ward: string;
  onChange: (coords: LocationCoordinates, wardName: string, suggestedAddress?: string) => void;
  interactive?: boolean;
  heightClass?: string;
  showHotspotPins?: boolean;
}

const WARDS = [
  { id: 'w4', name: 'Ward 4 - Metro Center', center: { lat: 37.7749, lng: -122.4194 }, x: 48, y: 44, color: '#2563EB' },
  { id: 'w2', name: 'Ward 2 - Commercial Harbor', center: { lat: 37.7915, lng: -122.3998 }, x: 74, y: 26, color: '#0284C7' },
  { id: 'w7', name: 'Ward 7 - South Heights', center: { lat: 37.7523, lng: -122.4412 }, x: 26, y: 72, color: '#D97706' },
  { id: 'w3', name: 'Ward 3 - East District', center: { lat: 37.7681, lng: -122.4082 }, x: 68, y: 62, color: '#10B981' },
  { id: 'w5', name: 'Ward 5 - Northgate', center: { lat: 37.8010, lng: -122.4280 }, x: 38, y: 18, color: '#8B5CF6' },
  { id: 'w1', name: 'Ward 1 - West Parklands', center: { lat: 37.7690, lng: -122.4780 }, x: 12, y: 48, color: '#059669' }
];

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  coordinates,
  ward,
  onChange,
  interactive = true,
  heightClass = 'h-72',
  showHotspotPins = false
}) => {
  const [pinPosition, setPinPosition] = useState<{ xPercent: number; yPercent: number }>(() => {
    // Map initial coords to percentage
    const matched = WARDS.find(w => ward.includes(w.name) || w.name.includes(ward));
    return matched ? { xPercent: matched.x, yPercent: matched.y } : { xPercent: 48, yPercent: 44 };
  });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setPinPosition({ xPercent: x, yPercent: y });

    // Derive simulated lat/lng from percentage
    const lat = Number((37.75 + (1 - y / 100) * 0.06).toFixed(4));
    const lng = Number((-122.48 + (x / 100) * 0.09).toFixed(4));

    // Find nearest ward
    let nearestWard = WARDS[0];
    let minDistance = 999999;
    WARDS.forEach(w => {
      const dist = Math.hypot(w.x - x, w.y - y);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWard = w;
      }
    });

    const streetSuggestions = [
      '742 Elmwood Ave', '318 Market Promenade', '890 Lincoln Way', 
      '1240 Bayview Blvd', '450 Pineview Trail', '128 Mission Arterial'
    ];
    const pickedStreet = streetSuggestions[Math.floor(Math.random() * streetSuggestions.length)];

    onChange({ lat, lng }, nearestWard.name, `${pickedStreet}, ${nearestWard.name.split(' - ')[0]}`);
  };

  const handleSelectWard = (targetWard: typeof WARDS[0]) => {
    setPinPosition({ xPercent: targetWard.x, yPercent: targetWard.y });
    onChange(targetWard.center, targetWard.name, `Central Sector, ${targetWard.name}`);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Map Canvas */}
      <div 
        onClick={handleMapClick}
        className={`relative w-full ${heightClass} bg-slate-900 rounded-lg overflow-hidden border border-slate-200 select-none ${interactive ? 'cursor-crosshair' : 'cursor-default'}`}
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 1)),
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 24px 24px, 24px 24px'
        }}
      >
        {/* Stylized Municipal Topography & Roads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
          {/* River / Coastline */}
          <path d="M 0,160 Q 150,140 280,210 T 600,180" fill="none" stroke="#0284c7" strokeWidth="18" strokeOpacity="0.4" />
          <path d="M 0,160 Q 150,140 280,210 T 600,180" fill="none" stroke="#38bdf8" strokeWidth="4" strokeOpacity="0.7" />
          
          {/* Arterial Highways */}
          <path d="M 50,0 L 450,400" stroke="#475569" strokeWidth="5" strokeDasharray="6 4" />
          <path d="M 0,180 L 600,180" stroke="#334155" strokeWidth="4" />
          <path d="M 300,0 L 300,400" stroke="#334155" strokeWidth="4" />
          <path d="M 120,0 Q 220,180 180,400" stroke="#475569" strokeWidth="3" />
          <path d="M 460,0 Q 420,200 520,400" stroke="#475569" strokeWidth="3" />

          {/* District Boundary Rings */}
          <circle cx="48%" cy="44%" r="65" fill="#2563eb" fillOpacity="0.04" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="74%" cy="26%" r="50" fill="#0284c7" fillOpacity="0.04" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="26%" cy="72%" r="55" fill="#d97706" fillOpacity="0.04" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Hotspot indicators if enabled */}
        {showHotspotPins && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[42%] left-[46%] px-2 py-0.5 rounded bg-rose-500/90 text-white text-[10px] font-bold shadow-md animate-pulse">
              19 Incidents · Ward 4
            </div>
            <div className="absolute top-[24%] left-[72%] px-2 py-0.5 rounded bg-amber-500/90 text-white text-[10px] font-bold shadow-md">
              12 Incidents · Ward 2
            </div>
            <div className="absolute top-[70%] left-[24%] px-2 py-0.5 rounded bg-sky-500/90 text-white text-[10px] font-bold shadow-md">
              8 Incidents · Ward 7
            </div>
          </div>
        )}

        {/* Map Header Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2 pointer-events-none">
          <div className="px-2 py-1 rounded bg-slate-900/90 backdrop-blur border border-slate-700/80 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-blue-400" />
            <span>GIS Grid: SF-METRO-CAD</span>
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-2 pointer-events-none">
          <div className="px-2 py-1 rounded bg-slate-900/90 backdrop-blur border border-slate-700/80 text-[11px] font-mono tabular-nums text-slate-300">
            {coordinates.lat.toFixed(4)}° N, {Math.abs(coordinates.lng).toFixed(4)}° W
          </div>
        </div>

        {/* Dynamic Selected Pin Marker */}
        <div 
          className="absolute -translate-x-1/2 -translate-y-full transition-all duration-150 pointer-events-none"
          style={{ left: `${pinPosition.xPercent}%`, top: `${pinPosition.yPercent}%` }}
        >
          <div className="relative flex flex-col items-center">
            <div className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold tracking-wide shadow-lg whitespace-nowrap mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Incident Pin</span>
            </div>
            <div className="w-6 h-6 text-blue-500 drop-shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            {/* Ripple pulse */}
            <div className="w-3 h-1.5 bg-blue-500/40 rounded-full animate-ping" />
          </div>
        </div>

        {/* Map Bottom Hint */}
        {interactive && (
          <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none px-2 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-blue-400" />
              Click any sector on the grid to position the complaint location
            </span>
            <span className="text-slate-300 font-medium">
              {ward}
            </span>
          </div>
        )}
      </div>

      {/* Ward Quick Jump Buttons */}
      {interactive && (
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          <span className="text-slate-500 text-xs shrink-0 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3" /> Quick Ward:
          </span>
          {WARDS.map(w => {
            const isSelected = ward.includes(w.id.toUpperCase()) || ward.includes(w.name);
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleSelectWard(w)}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {w.name.split(' - ')[0]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
