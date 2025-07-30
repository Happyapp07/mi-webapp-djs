import React from 'react';
import { motion } from 'framer-motion';
import { Filter, Disc, GraduationCap, Radio, ShoppingBag, MapPin, Search } from 'lucide-react';
import { EntityType } from '../../types/entity';

interface EntityFilterProps {
  selectedType: EntityType | null;
  onTypeChange: (type: EntityType | null) => void;
  selectedMusicStyle: string;
  onMusicStyleChange: (style: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const EntityFilter: React.FC<EntityFilterProps> = ({
  selectedType,
  onTypeChange,
  selectedMusicStyle,
  onMusicStyleChange,
  selectedLocation,
  onLocationChange,
  searchTerm,
  onSearchChange
}) => {
  const musicStyles = [
    'house', 'techno', 'trance', 'progressive-house', 'deep-house', 
    'tech-house', 'minimal-techno', 'drum-and-bass', 'dubstep'
  ];
  
  const locations = [
    'Barcelona, Spain', 'Berlin, Germany', 'London, United Kingdom', 
    'Amsterdam, Netherlands', 'Ibiza, Spain', 'Paris, France'
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl mb-6"
    >
      <div className="flex items-center mb-4">
        <Filter size={18} className="mr-2 text-indigo-400" />
        <h3 className="text-lg font-medium">Filtrar Entidades</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Entity Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Tipo de Entidad
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTypeChange(null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedType === null
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => onTypeChange(EntityType.MENTOR_LABEL)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                selectedType === EntityType.MENTOR_LABEL
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Disc size={14} className="mr-1" />
              Labels
            </button>
            <button
              onClick={() => onTypeChange(EntityType.ACADEMY)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                selectedType === EntityType.ACADEMY
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <GraduationCap size={14} className="mr-1" />
              Academias
            </button>
            <button
              onClick={() => onTypeChange(EntityType.FREQUENCY_STATION)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                selectedType === EntityType.FREQUENCY_STATION
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Radio size={14} className="mr-1" />
              Radios
            </button>
            <button
              onClick={() => onTypeChange(EntityType.MUSIC_DEPOT)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors flex items-center ${
                selectedType === EntityType.MUSIC_DEPOT
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <ShoppingBag size={14} className="mr-1" />
              Tiendas
            </button>
          </div>
        </div>
        
        {/* Music Style Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Estilo Musical
          </label>
          <select
            value={selectedMusicStyle}
            onChange={(e) => onMusicStyleChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos los estilos</option>
            {musicStyles.map(style => (
              <option key={style} value={style}>
                {style.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Ubicación
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todas las ubicaciones</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Buscar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Buscar entidades..."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EntityFilter;