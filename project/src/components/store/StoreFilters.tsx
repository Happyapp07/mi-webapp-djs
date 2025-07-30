import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Tag, ShoppingBag, Star, Zap, Award, Gift } from 'lucide-react';
import { useStoreStore } from '../../stores/storeStore';
import { StoreCategory, StoreItemType } from '../../types/store';
import { UserType } from '../../types';

const StoreFilters: React.FC = () => {
  const { filters, updateFilters, applyFilters } = useStoreStore();
  const [localFilters, setLocalFilters] = useState(filters);
  
  const handleFilterChange = (key: string, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const handleApplyFilters = () => {
    updateFilters(localFilters);
    applyFilters();
  };
  
  const handleResetFilters = () => {
    const resetFilters = {
      category: 'all',
      type: 'all',
      minPrice: 0,
      maxPrice: 1000,
      userType: 'all',
      search: '',
      sortBy: 'newest'
    };
    
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
    applyFilters();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 rounded-xl sticky top-24 relative overflow-hidden"
    >
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <Filter size={18} className="mr-2 text-indigo-400" />
          <h3 className="font-medium">Filtros</h3>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Buscar
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Categoría
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleFilterChange('category', 'all')}
              className={`p-2 rounded-lg text-center text-sm ${
                localFilters.category === 'all'
                  ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-indigo-500/30 text-gray-400'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => handleFilterChange('category', StoreCategory.PHYSICAL)}
              className={`p-2 rounded-lg text-center text-sm flex flex-col items-center ${
                localFilters.category === StoreCategory.PHYSICAL
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-blue-500/30 text-gray-400'
              }`}
            >
              <ShoppingBag size={16} className="mb-1" />
              Físico
            </button>
            <button
              onClick={() => handleFilterChange('category', StoreCategory.EXPERIENCE)}
              className={`p-2 rounded-lg text-center text-sm flex flex-col items-center ${
                localFilters.category === StoreCategory.EXPERIENCE
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-purple-500/30 text-gray-400'
              }`}
            >
              <Star size={16} className="mb-1" />
              Experiencia
            </button>
            <button
              onClick={() => handleFilterChange('category', StoreCategory.DIGITAL)}
              className={`p-2 rounded-lg text-center text-sm flex flex-col items-center ${
                localFilters.category === StoreCategory.DIGITAL
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-cyan-500/30 text-gray-400'
              }`}
            >
              <Zap size={16} className="mb-1" />
              Digital
            </button>
            <button
              onClick={() => handleFilterChange('category', StoreCategory.COMPETITION)}
              className={`p-2 rounded-lg text-center text-sm flex flex-col items-center ${
                localFilters.category === StoreCategory.COMPETITION
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-yellow-500/30 text-gray-400'
              }`}
            >
              <Award size={16} className="mb-1" />
              Competición
            </button>
            <button
              onClick={() => handleFilterChange('category', StoreCategory.SPECIAL)}
              className={`p-2 rounded-lg text-center text-sm flex flex-col items-center ${
                localFilters.category === StoreCategory.SPECIAL
                  ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400'
                  : 'bg-gray-800/50 border border-gray-700 hover:border-pink-500/30 text-gray-400'
              }`}
            >
              <Gift size={16} className="mb-1" />
              Especial
            </button>
          </div>
        </div>
        
        {/* Price Range */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Rango de Precio (Beatcoins)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max={localFilters.maxPrice}
              value={localFilters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span>-</span>
            <input
              type="number"
              min={localFilters.minPrice}
              max="1000"
              value={localFilters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        {/* User Type Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Rol de Usuario
          </label>
          <select
            value={localFilters.userType}
            onChange={(e) => handleFilterChange('userType', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todos los roles</option>
            <option value={UserType.DJ}>DJ (Piloto)</option>
            <option value={UserType.PARTYGOER}>Fiestero (Aliado)</option>
            <option value={UserType.CLUB}>Club (Hangar)</option>
            <option value={UserType.REPORTER}>Reportero</option>
          </select>
        </div>
        
        {/* Sort By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Ordenar Por
          </label>
          <select
            value={localFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="newest">Más recientes</option>
            <option value="price_asc">Precio: menor a mayor</option>
            <option value="price_desc">Precio: mayor a menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
          </select>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleResetFilters}
            className="flex-1 glassmorphism-button px-4 py-2"
          >
            Reiniciar
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 glassmorphism-primary-button px-4 py-2"
          >
            Aplicar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreFilters;