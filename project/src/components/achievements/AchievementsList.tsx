import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Filter, Search, Star, Trophy } from 'lucide-react';
import { useAchievementStore } from '../../stores/achievementStore';
import { useAuthStore } from '../../stores/authStore';
import { Achievement, AchievementCategory, AchievementLevel } from '../../types/achievement';
import AchievementCard from './AchievementCard';
import AchievementDetailModal from './AchievementDetailModal';
import GalacticInfluencerBadge from './GalacticInfluencerBadge';

interface AchievementsListProps {
  userId?: string;
  showFilters?: boolean;
  maxDisplay?: number;
}

const AchievementsList: React.FC<AchievementsListProps> = ({
  userId,
  showFilters = true,
  maxDisplay
}) => {
  const { user } = useAuthStore();
  const { 
    fetchUserAchievements, 
    userAchievements, 
    isLoading,
    getAchievementProgress
  } = useAchievementStore();
  
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    search: ''
  });
  
  const [hasGalacticInfluencer, setHasGalacticInfluencer] = useState(false);
  
  useEffect(() => {
    const loadAchievements = async () => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return;
      
      await fetchUserAchievements(targetUserId);
    };
    
    loadAchievements();
  }, [userId, user, fetchUserAchievements]);
  
  useEffect(() => {
    // Apply filters
    let filtered = [...userAchievements];
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(a => a.category === filters.category);
    }
    
    // Filter by level
    if (filters.level !== 'all') {
      filtered = filtered.filter(a => a.unlockedLevel === filters.level);
    }
    
    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search) || 
        a.description.toLowerCase().includes(search)
      );
    }
    
    // Check for Galactic Influencer
    const hasGI = userAchievements.some(a => a.id === 'galactic_influencer' && a.unlockedLevel === AchievementLevel.PLATINUM);
    setHasGalacticInfluencer(hasGI);
    
    // Limit display if maxDisplay is provided
    if (maxDisplay && filtered.length > maxDisplay) {
      filtered = filtered.slice(0, maxDisplay);
    }
    
    setFilteredAchievements(filtered);
  }, [userAchievements, filters, maxDisplay]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Galactic Influencer Badge */}
      {hasGalacticInfluencer && (
        <GalacticInfluencerBadge />
      )}
      
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl mb-6 relative overflow-hidden"
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <Filter size={18} className="mr-2 text-indigo-400" />
              <h3 className="font-medium">Filtrar Logros</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Categoría
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="all">Todas las categorías</option>
                  <option value={AchievementCategory.CONTENT}>Contenido</option>
                  <option value={AchievementCategory.SOCIAL}>Social</option>
                  <option value={AchievementCategory.ATTENDANCE}>Asistencia</option>
                  <option value={AchievementCategory.PERFORMANCE}>Rendimiento</option>
                  <option value={AchievementCategory.ENGAGEMENT}>Engagement</option>
                </select>
              </div>
              
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nivel
                </label>
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                >
                  <option value="all">Todos los niveles</option>
                  <option value={AchievementLevel.BRONZE}>Bronce</option>
                  <option value={AchievementLevel.SILVER}>Plata</option>
                  <option value={AchievementLevel.GOLD}>Oro</option>
                  <option value={AchievementLevel.PLATINUM}>Platino</option>
                </select>
              </div>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Buscar
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar logros..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="glass-card p-4 rounded-xl text-center relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <Award size={24} className="mx-auto mb-2 text-indigo-400" />
            <div className="text-2xl font-bold">{userAchievements.length}</div>
            <div className="text-sm text-gray-400">Logros Totales</div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl text-center relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <Trophy size={24} className="mx-auto mb-2 text-amber-600" />
            <div className="text-2xl font-bold">
              {userAchievements.filter(a => a.unlockedLevel === AchievementLevel.BRONZE).length}
            </div>
            <div className="text-sm text-gray-400">Nivel Bronce</div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl text-center relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <Trophy size={24} className="mx-auto mb-2 text-gray-300" />
            <div className="text-2xl font-bold">
              {userAchievements.filter(a => a.unlockedLevel === AchievementLevel.SILVER).length}
            </div>
            <div className="text-sm text-gray-400">Nivel Plata</div>
          </div>
        </div>
        
        <div className="glass-card p-4 rounded-xl text-center relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <Trophy size={24} className="mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">
              {userAchievements.filter(a => a.unlockedLevel === AchievementLevel.GOLD || a.unlockedLevel === AchievementLevel.PLATINUM).length}
            </div>
            <div className="text-sm text-gray-400">Nivel Oro/Platino</div>
          </div>
        </div>
      </motion.div>
      
      {/* Achievements Grid */}
      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementCard 
                achievement={achievement}
                progress={getAchievementProgress(achievement.id)}
                onClick={() => setSelectedAchievement(achievement)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Award size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-medium mb-2">No se encontraron logros</h3>
          <p className="text-gray-400">
            {filters.search || filters.category !== 'all' || filters.level !== 'all'
              ? 'Prueba a ajustar los filtros'
              : 'Aún no has desbloqueado ningún logro'}
          </p>
        </div>
      )}
      
      {/* Show More Button */}
      {maxDisplay && userAchievements.length > maxDisplay && (
        <div className="text-center mt-6">
          <button className="glassmorphism-button px-6 py-2.5 inline-flex items-center">
            <Award size={16} className="mr-2" />
            Ver todos los logros
          </button>
        </div>
      )}
      
      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <AchievementDetailModal
          achievement={selectedAchievement}
          isOpen={!!selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
          progress={getAchievementProgress(selectedAchievement.id)}
        />
      )}
    </div>
  );
};

export default AchievementsList;