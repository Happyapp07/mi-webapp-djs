import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Star, Music, ExternalLink, Users, Crown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DJRanking } from '../../types/ranking';

interface SquadCompetitionProps {
  squad: number;
  djs: DJRanking[];
  planetId: string;
}

const SquadCompetition: React.FC<SquadCompetitionProps> = ({ squad, djs, planetId }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Sort DJs by weekly points and apply tiebreakers
  const sortedDJs = [...djs].sort((a, b) => {
    // Primary: Weekly points
    if (b.stats.weeklyPoints !== a.stats.weeklyPoints) {
      return b.stats.weeklyPoints - a.stats.weeklyPoints;
    }
    // Tiebreaker 1: Geo votes
    if (b.stats.weeklyGeoVotes !== a.stats.weeklyGeoVotes) {
      return b.stats.weeklyGeoVotes - a.stats.weeklyGeoVotes;
    }
    // Tiebreaker 2: Session count
    if (b.stats.weeklySessionCount !== a.stats.weeklySessionCount) {
      return b.stats.weeklySessionCount - a.stats.weeklySessionCount;
    }
    // Tiebreaker 3: Join date (earlier = advantage)
    return new Date(a.stats.joinDate).getTime() - new Date(b.stats.joinDate).getTime();
  });
  
  // Get movement categories
  const rising = sortedDJs.slice(0, 5); // Top 5 rising
  const falling = sortedDJs.slice(-5); // Bottom 5 falling
  const stable = sortedDJs.slice(5, -5); // Middle 15 stable

  // Convert squad number to Roman numerals
  const toRoman = (num: number): string => {
    const romanNumerals = [
      ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
      ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
      ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];
    
    let result = '';
    for (const [letter, value] of romanNumerals) {
      while (num >= value) {
        result += letter;
        num -= value;
      }
    }
    return result;
  };

  // Get squad color based on planet
  const getSquadColor = () => {
    const planetColors: { [key: string]: string } = {
      'house': 'from-brimfull-house-primary to-brimfull-house-secondary',
      'techno': 'from-brimfull-techno-primary to-brimfull-techno-secondary',
      'trance': 'from-brimfull-trance-primary to-brimfull-trance-secondary',
      'progressive': 'from-brimfull-progressive-primary to-brimfull-progressive-secondary',
      'deep-house': 'from-brimfull-house-primary to-brimfull-house-secondary',
      'tech-house': 'from-brimfull-house-primary to-brimfull-house-secondary',
      'progressive-house': 'from-brimfull-progressive-primary to-brimfull-progressive-secondary',
      'minimal-techno': 'from-brimfull-techno-primary to-brimfull-techno-secondary',
      // Add more planet colors as needed
    };
    return planetColors[planetId] || 'from-indigo-500 to-blue-500';
  };

  const getLevelIcon = (dj: DJRanking) => {
    switch (dj.level) {
      case 'Master':
        return <Crown size={16} className="text-yellow-500" />;
      case 'Technic':
        return <Star size={16} className="text-indigo-500" />;
      case 'Pioneer':
        return <Shield size={16} className="text-purple-500" />;
      default:
        return <Shield size={16} className="text-gray-500" />;
    }
  };

  return (
    <motion.div 
      className="glass-card rounded-xl overflow-hidden border border-cyan-500/30 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      {/* Squad Header */}
      <div className={`relative z-10 bg-gradient-to-r ${getSquadColor()} p-6`}>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-display flex items-center">
            <Trophy size={24} className="mr-2" />
            Squad {toRoman(squad)}
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-black/20 px-3 py-1 rounded-full border border-white/10">
              {djs.length} DJs
            </span>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-1.5 rounded-lg bg-black/30 border border-white/20 hover:bg-black/50 hover:border-white/30 transition-all text-sm"
            >
              {showDetails ? 'Hide' : 'View'} Details
            </button>
          </div>
        </div>
      </div>

      {/* Squad Content */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden relative z-10"
          >
            <div className="p-6 space-y-8">
              {/* Top 5 Rising */}
              <div>
                <h4 className="text-lg font-medium flex items-center mb-4">
                  <TrendingUp size={20} className="mr-2 text-green-500" />
                  Top 5 Rising
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {rising.map((dj, index) => (
                    <motion.div
                      key={dj.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative glass-card p-4 rounded-lg border border-green-500/30"
                    >
                      <div className="absolute top-2 right-2 text-green-500 text-sm">
                        +{dj.stats.weeklyPoints} pts
                      </div>
                      <Link 
                        to={`/profile/${dj.djId}`}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-green-500/50">
                          <img 
                            src={`https://api.dicebear.com/7.x/personas/svg?seed=${dj.djId}`}
                            alt={dj.djId}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-medium truncate max-w-[120px] flex items-center justify-center">
                            {getLevelIcon(dj)}
                            <span className="ml-1">DJ {dj.djId.split('_').pop()}</span>
                          </div>
                          <div className="flex items-center justify-center text-xs space-x-1">
                            <span>{dj.area.flag}</span>
                            <span>{dj.area.code}</span>
                          </div>
                        </div>
                      </Link>
                      {dj.currentSession && (
                        <div className="mt-2 text-center">
                          <a 
                            href={dj.currentSession.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center"
                          >
                            <Music size={12} className="mr-1" />
                            View Session
                            <ExternalLink size={10} className="ml-1" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stable DJs */}
              <div>
                <h4 className="text-lg font-medium flex items-center mb-4">
                  <Minus size={20} className="mr-2 text-gray-400" />
                  Stable DJs
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {stable.map((dj, index) => (
                    <motion.div
                      key={dj.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative glass-card p-4 rounded-lg border border-gray-500/30"
                    >
                      <Link 
                        to={`/profile/${dj.djId}`}
                        className="flex flex-col items-center"
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mb-2 ring-2 ring-gray-500/50">
                          <img 
                            src={`https://api.dicebear.com/7.x/personas/svg?seed=${dj.djId}`}
                            alt={dj.djId}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-medium truncate max-w-[100px] text-sm flex items-center justify-center">
                            {getLevelIcon(dj)}
                            <span className="ml-1">DJ {dj.djId.split('_').pop()}</span>
                          </div>
                          <div className="flex items-center justify-center text-xs space-x-1">
                            <span>{dj.area.flag}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom 5 Falling */}
              <div>
                <h4 className="text-lg font-medium flex items-center mb-4">
                  <TrendingDown size={20} className="mr-2 text-red-500" />
                  5 in Decline
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {falling.map((dj, index) => (
                    <motion.div
                      key={dj.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative glass-card p-4 rounded-lg border border-red-500/30"
                    >
                      <div className="absolute top-2 right-2 text-red-500 text-sm">
                        {dj.stats.weeklyPoints} pts
                      </div>
                      <Link 
                        to={`/profile/${dj.djId}`}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2 ring-2 ring-red-500/50">
                          <img 
                            src={`https://api.dicebear.com/7.x/personas/svg?seed=${dj.djId}`}
                            alt={dj.djId}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-medium truncate max-w-[120px] flex items-center justify-center">
                            {getLevelIcon(dj)}
                            <span className="ml-1">DJ {dj.djId.split('_').pop()}</span>
                          </div>
                          <div className="flex items-center justify-center text-xs space-x-1">
                            <span>{dj.area.flag}</span>
                            <span>{dj.area.code}</span>
                          </div>
                        </div>
                      </Link>
                      {dj.currentSession && (
                        <div className="mt-2 text-center">
                          <a 
                            href={dj.currentSession.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center justify-center"
                          >
                            <Music size={12} className="mr-1" />
                            View Session
                            <ExternalLink size={10} className="ml-1" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SquadCompetition;