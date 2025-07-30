import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star } from 'lucide-react';
import { useAchievementStore } from '../stores/achievementStore';
import { useAuthStore } from '../stores/authStore';
import AchievementsList from '../components/achievements/AchievementsList';
import AchievementProgress from '../components/achievements/AchievementProgress';

const AchievementsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchAchievements, fetchUserAchievements } = useAchievementStore();
  
  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return;
      
      await fetchAchievements();
      await fetchUserAchievements(user.id);
    };
    
    loadAchievements();
  }, [user, fetchAchievements, fetchUserAchievements]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <Trophy size={24} className="text-indigo-400 relative z-10" />
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          <div>
            <h1 className="text-3xl font-display neon-text">Logros Cósmicos</h1>
            <p className="text-gray-400 mt-2">
              Desbloquea logros y gana recompensas en tu viaje por el cosmos
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* In Progress Achievements */}
      <AchievementProgress showViewAll={false} />
      
      {/* All Achievements */}
      <AchievementsList />
      
      {/* Achievement Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/30"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Star size={20} className="mr-2 text-yellow-400" />
          Bonus Único: "Galactic Influencer"
        </h3>
        
        <p className="text-gray-300 mb-4">
          Desbloquea 3 logros en nivel Platino para conseguir el prestigioso estatus de "Galactic Influencer" con ventajas exclusivas:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="font-medium mb-1 flex items-center">
              <Star size={16} className="mr-1 text-yellow-400" fill="currentColor" />
              Visibilidad Global
            </div>
            <div className="text-sm text-gray-400">Tu perfil aparecerá destacado en toda la plataforma</div>
          </div>
          
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="font-medium mb-1 flex items-center">
              <Trophy size={16} className="mr-1 text-indigo-400" />
              Acceso Prioritario
            </div>
            <div className="text-sm text-gray-400">Acceso prioritario a eventos físicos patrocinados</div>
          </div>
          
          <div className="p-3 bg-black/30 rounded-lg">
            <div className="font-medium mb-1 flex items-center">
              <Award size={16} className="mr-1 text-purple-400" />
              Badge Animado Premium
            </div>
            <div className="text-sm text-gray-400">Insignia exclusiva animada en tu perfil</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AchievementsPage;