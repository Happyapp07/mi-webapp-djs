import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, Music, MapPin } from 'lucide-react';
import { DJRanking } from '../../types/ranking';

interface DJRankingStatsProps {
  ranking: DJRanking;
}

const DJRankingStats: React.FC<DJRankingStatsProps> = ({ ranking }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <motion.div 
        className="glass-card p-4 rounded-lg border border-indigo-500/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            {/* Glassmorphism music icon */}
            <div className="w-8 h-8 rounded-lg relative overflow-hidden
                          backdrop-blur-md border border-indigo-500/30
                          bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                          shadow-[0_0_10px_rgba(99,102,241,0.3)]
                          flex items-center justify-center">
              <Music className="text-indigo-400 relative z-10" size={16} />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50"></div>
            </div>
            <span className="text-sm text-gray-400">Monthly Plays</span>
          </div>
          <div className="text-2xl font-bold text-indigo-400">
            {ranking.stats.monthlyPlays.toLocaleString()}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="glass-card p-4 rounded-lg border border-purple-500/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            {/* Glassmorphism users icon */}
            <div className="w-8 h-8 rounded-lg relative overflow-hidden
                          backdrop-blur-md border border-purple-500/30
                          bg-gradient-to-br from-purple-500/10 to-indigo-500/10
                          shadow-[0_0_10px_rgba(147,51,234,0.3)]
                          flex items-center justify-center">
              <Users className="text-purple-400 relative z-10" size={16} />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-50"></div>
            </div>
            <span className="text-sm text-gray-400">Total Votes</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {ranking.stats.totalVotes.toLocaleString()}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="glass-card p-4 rounded-lg border border-green-500/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            {/* Glassmorphism map pin icon */}
            <div className="w-8 h-8 rounded-lg relative overflow-hidden
                          backdrop-blur-md border border-green-500/30
                          bg-gradient-to-br from-green-500/10 to-emerald-500/10
                          shadow-[0_0_10px_rgba(16,185,129,0.3)]
                          flex items-center justify-center">
              <MapPin className="text-green-400 relative z-10" size={16} />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-50"></div>
            </div>
            <span className="text-sm text-gray-400">Geo Votes</span>
          </div>
          <div className="text-2xl font-bold text-green-400">
            {ranking.stats.geoVotes.toLocaleString()}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="glass-card p-4 rounded-lg border border-yellow-500/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            {/* Glassmorphism bar chart icon */}
            <div className="w-8 h-8 rounded-lg relative overflow-hidden
                          backdrop-blur-md border border-yellow-500/30
                          bg-gradient-to-br from-yellow-500/10 to-amber-500/10
                          shadow-[0_0_10px_rgba(245,158,11,0.3)]
                          flex items-center justify-center">
              <BarChart2 className="text-yellow-400 relative z-10" size={16} />
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/5 opacity-50"></div>
            </div>
            <span className="text-sm text-gray-400">Events</span>
          </div>
          <div className="text-2xl font-bold text-yellow-400">
            {ranking.stats.eventParticipation}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DJRankingStats;