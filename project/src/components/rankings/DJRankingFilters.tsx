import React from 'react';
import { Filter, Search, Globe, MapPin, Crown, Star, Users } from 'lucide-react';
import { RankingFilters, DJLevel, DJRank } from '../../types/ranking';

interface DJRankingFiltersProps {
  filters: RankingFilters;
  onFilterChange: (filters: Partial<RankingFilters>) => void;
  onSearch: () => void;
  availablePlanets: string[];
  availableCountries: { code: string; name: string; flag: string }[];
  availableAreas: { code: string; name: string; country: string; flag: string; provinceFlag?: string }[];
}

const DJRankingFilters: React.FC<DJRankingFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  availablePlanets,
  availableCountries,
  availableAreas
}) => {
  const filteredAreas = filters.country
    ? availableAreas.filter(area => area.country === filters.country)
    : availableAreas;

  return (
    <div className="glass-card p-6 rounded-xl mb-8 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          {/* Glassmorphism filter icon */}
          <div className="w-10 h-10 rounded-xl relative overflow-hidden mr-3
                        backdrop-blur-md border border-cyan-500/30
                        bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                        shadow-[0_0_15px_rgba(0,255,255,0.3)]
                        flex items-center justify-center">
            <Filter size={20} className="text-cyan-400 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
          </div>
          <h3 className="text-lg font-display neon-text">RANKING FILTERS</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Planet Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism globe icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <Globe size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Planet / Music Style
            </label>
            <div className="relative">
              <select
                value={filters.planetId || ''}
                onChange={(e) => onFilterChange({ planetId: e.target.value || undefined })}
                className="w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm"
              >
                <option value="" className="bg-gray-900">All Planets</option>
                {availablePlanets.map((planet) => (
                  <option key={planet} value={planet} className="bg-gray-900">
                    {planet.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Country Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism map pin icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <MapPin size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Country
            </label>
            <div className="relative">
              <select
                value={filters.country || ''}
                onChange={(e) => onFilterChange({ 
                  country: e.target.value || undefined,
                  area: undefined 
                })}
                className="w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm"
              >
                <option value="" className="bg-gray-900">All Countries</option>
                {availableCountries.map((country) => (
                  <option key={country.code} value={country.code} className="bg-gray-900">
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Area Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism map pin icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <MapPin size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Province (IATA)
            </label>
            <div className="relative">
              <select
                value={filters.area || ''}
                onChange={(e) => onFilterChange({ area: e.target.value || undefined })}
                className={`w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm ${!filters.country ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!filters.country}
              >
                <option value="" className="bg-gray-900">All Provinces</option>
                {filteredAreas.map((area) => (
                  <option key={area.code} value={area.code} className="bg-gray-900">
                    {area.flag} {area.name} ({area.code})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism crown icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <Crown size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Level
            </label>
            <div className="relative">
              <select
                value={filters.level || ''}
                onChange={(e) => onFilterChange({ level: e.target.value as DJLevel || undefined })}
                className="w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm"
              >
                <option value="" className="bg-gray-900">All Levels</option>
                {Object.values(DJLevel).map((level) => (
                  <option key={level} value={level} className="bg-gray-900">
                    {level}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Rank Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism star icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <Star size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Rank
            </label>
            <div className="relative">
              <select
                value={filters.rank || ''}
                onChange={(e) => onFilterChange({ rank: e.target.value as DJRank || undefined })}
                className="w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm"
              >
                <option value="" className="bg-gray-900">All Ranks</option>
                {Object.values(DJRank).map((rank) => (
                  <option key={rank} value={rank} className="bg-gray-900">
                    {rank}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>

          {/* Squad Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-cyan-400/80 mb-1 flex items-center">
              {/* Glassmorphism users icon */}
              <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                            backdrop-blur-md border border-cyan-500/30
                            bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                            shadow-[0_0_10px_rgba(0,255,255,0.3)]
                            flex items-center justify-center">
                <Users size={16} className="text-cyan-400 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
              </div>
              Squad
            </label>
            <div className="relative">
              <select
                value={filters.squad?.toString() || ''}
                onChange={(e) => onFilterChange({ squad: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-gray-800/40 border border-cyan-500/30 rounded-lg px-4 py-2.5 appearance-none cursor-pointer hover:border-cyan-500/60 transition-colors focus:outline-none focus:border-cyan-500 text-white backdrop-blur-sm"
              >
                <option value="" className="bg-gray-900">All Squads</option>
                {[1, 2, 3, 4, 5].map((squad) => (
                  <option key={squad} value={squad} className="bg-gray-900">
                    Squad {squad}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            onClick={onSearch}
            className="btn-primary flex items-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-black font-bold shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.7)] transition-all duration-300"
          >
            {/* Glassmorphism search icon */}
            <div className="w-6 h-6 rounded-lg relative overflow-hidden mr-2
                          backdrop-blur-md border border-white/30
                          bg-gradient-to-br from-white/10 to-white/5
                          shadow-[0_0_10px_rgba(255,255,255,0.3)]
                          flex items-center justify-center">
              <Search size={14} className="text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/2 opacity-50"></div>
            </div>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default DJRankingFilters;