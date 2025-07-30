import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, MapPin, Users, Star, TrendingUp } from 'lucide-react';
import { getGlobalStats, GLOBAL_CLUBS } from '../../data/globalClubs';

const ClubsStats: React.FC = () => {
  const stats = getGlobalStats();
  
  const topCountries = GLOBAL_CLUBS.reduce((acc, club) => {
    acc[club.country] = (acc[club.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = Object.entries(topCountries)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const topMusicStyles = GLOBAL_CLUBS.reduce((acc, club) => {
    club.musicStyles.forEach(style => {
      acc[style] = (acc[style] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const sortedStyles = Object.entries(topMusicStyles)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Global Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <Building2 size={24} className="mx-auto mb-2 text-indigo-400" />
          <div className="text-2xl font-bold">{stats.totalClubs}</div>
          <div className="text-sm text-gray-400">Total Clubs</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <Globe size={24} className="mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold">{stats.countries}</div>
          <div className="text-sm text-gray-400">Countries</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <MapPin size={24} className="mx-auto mb-2 text-purple-400" />
          <div className="text-2xl font-bold">{stats.cities}</div>
          <div className="text-sm text-gray-400">Cities</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4 rounded-xl text-center"
        >
          <Users size={24} className="mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold">{stats.totalCapacity.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Capacity</div>
        </motion.div>
      </div>

      {/* Top Countries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2 text-indigo-400" />
          Top Countries by Club Count
        </h3>
        <div className="space-y-3">
          {sortedCountries.map(([country, count], index) => (
            <div key={country} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-6 text-gray-400 text-sm">{index + 1}</span>
                <span className="font-medium">{country}</span>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-2 bg-gray-800 rounded-full mr-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / Math.max(...sortedCountries.map(([,c]) => c))) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                <span className="text-sm text-gray-400 w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Music Styles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Star size={20} className="mr-2 text-purple-400" />
          Most Popular Music Styles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sortedStyles.map(([style, count], index) => (
            <motion.div
              key={style}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-gray-800/50 p-3 rounded-lg text-center"
            >
              <div className="font-medium text-sm">{style}</div>
              <div className="text-xs text-gray-400">{count} clubs</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Average Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 rounded-xl text-center"
      >
        <Star size={32} className="mx-auto mb-3 text-yellow-500" />
        <div className="text-3xl font-bold mb-1">{stats.averageRating}</div>
        <div className="text-gray-400">Average Club Rating</div>
        <div className="flex justify-center mt-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={16}
              className={i < Math.floor(stats.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-600'}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ClubsStats;