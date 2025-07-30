import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Music, Award, Trophy, ChevronRight, Play, ThumbsUp, Zap, Target, Crown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DJRanking, DJLevel, DJRank } from '../../types/ranking';

interface DJRankingTableProps {
  djs: DJRanking[];
  onFilterPlanet: (planetId: string) => void;
  onFilterRank: (rank: DJRank) => void;
  onFilterLevel: (level: DJLevel) => void;
  onFilterSquad: (squad: number) => void;
  onFilterArea: (area: string) => void;
}

export default function DJRankingTable({
  djs,
  onFilterPlanet,
  onFilterRank,
  onFilterLevel,
  onFilterSquad,
  onFilterArea
}: DJRankingTableProps) {
  const sortedDJs = [...djs].sort((a, b) => b.lightyears - a.lightyears);

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

  const getLevelIcon = (level: DJLevel) => {
    switch (level) {
      case DJLevel.MASTER:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-yellow-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10 flex">
                <Star size={8} className="text-yellow-500" fill="currentColor" />
                <Star size={8} className="text-yellow-500 mx-0.5" fill="currentColor" />
                <Star size={8} className="text-yellow-500" fill="currentColor" />
              </div>
              <div className="relative z-10 flex flex-col mt-1">
                <div className="w-4 h-0.5 bg-yellow-500 mb-0.5"></div>
                <div className="w-4 h-0.5 bg-yellow-500 mb-0.5"></div>
                <div className="w-4 h-0.5 bg-yellow-500"></div>
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-yellow-500">{level}</span>
          </div>
        );
      case DJLevel.TECHNIC:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-cyan-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10 flex">
                <Star size={8} className="text-cyan-400" fill="currentColor" />
                <Star size={8} className="text-cyan-400 mx-0.5" fill="currentColor" />
              </div>
              <div className="relative z-10 flex flex-col mt-1">
                <div className="w-4 h-0.5 bg-cyan-400 mb-0.5"></div>
                <div className="w-4 h-0.5 bg-cyan-400"></div>
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-cyan-400">{level}</span>
          </div>
        );
      case DJLevel.PIONEER:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-purple-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10">
                <Star size={8} className="text-purple-400" fill="currentColor" />
              </div>
              <div className="relative z-10 mt-1">
                <div className="w-4 h-0.5 bg-purple-400"></div>
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-purple-400">{level}</span>
          </div>
        );
    }
  };

  const getRankIcon = (rank: DJRank) => {
    switch (rank) {
      case DJRank.COMMANDER:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-yellow-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10 flex flex-col">
                <Crown size={16} className="text-yellow-500" />
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-yellow-500">{rank}</span>
          </div>
        );
      case DJRank.CAPTAIN:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-cyan-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10 flex flex-col">
                <Star size={16} className="text-cyan-400" />
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-cyan-400">{rank}</span>
          </div>
        );
      case DJRank.CADET:
        return (
          <div className="flex items-center">
            <div className="flex flex-col items-center justify-center w-10 h-10 glass-card rounded-lg border border-purple-500/50 mr-2 relative overflow-hidden">
              <div className="holographic-bg absolute inset-0"></div>
              <div className="relative z-10">
                <Shield size={16} className="text-purple-400" />
              </div>
            </div>
            <span className="text-sm font-medium neon-text text-purple-400">{rank}</span>
          </div>
        );
    }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-cyan-500/30 relative">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="overflow-x-auto relative z-10">
        <table className="w-full">
          <thead className="bg-black/40 border-b border-cyan-500/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                RANK
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                PILOT
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider hidden md:table-cell font-mono">
                SECTOR
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                LEVEL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                RANK
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                LY
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-cyan-400 uppercase tracking-wider font-mono">
                SESSION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/20">
            {sortedDJs.map((dj, index) => (
              <motion.tr 
                key={dj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-cyan-500/10 transition-all duration-300 group"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {index < 3 ? (
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full relative overflow-hidden ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' :
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                        'bg-gradient-to-r from-amber-600 to-amber-700 text-black'
                      }`}>
                        <Trophy size={14} fill="currentColor" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full glass-card border border-cyan-500/30 flex items-center justify-center relative overflow-hidden">
                        <div className="holographic-bg absolute inset-0"></div>
                        <span className="text-xs font-mono text-cyan-400 relative z-10">{index + 1}</span>
                      </div>
                    )}
                    <button
                      onClick={() => onFilterSquad(dj.squad)}
                      className="text-[10px] text-cyan-400/70 hover:text-cyan-400 font-mono px-1.5 py-0.5 rounded bg-black/30 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
                    >
                      S{toRoman(dj.squad)}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link 
                    to={`/profile/${dj.djId}`}
                    className="flex items-center group-hover:scale-105 transition-transform"
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3 relative border-2 border-cyan-500/30">
                      <img 
                        src={`https://api.dicebear.com/7.x/bottts/svg?seed=${dj.djId}`}
                        alt="Pilot Avatar"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-cyan-400/20 rounded-full"></div>
                      {dj.isStar && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center border border-black">
                          <Star size={8} className="text-black" fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors font-mono">
                        PILOT {dj.djId}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          onFilterPlanet(dj.planetId);
                        }}
                        className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                      >
                        {dj.planetId.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </button>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                  <button
                    onClick={() => onFilterArea(dj.area.code)}
                    className="flex items-center text-cyan-400/70 hover:text-cyan-400 transition-colors group"
                  >
                    <span className="mr-2 text-lg">{dj.area.flag}</span>
                    <div>
                      <div className="text-xs font-mono">{dj.area.name}</div>
                      <div className="text-xs text-cyan-400/50 font-mono">({dj.area.code})</div>
                    </div>
                    {dj.area.provinceFlag && (
                      <img 
                        src={dj.area.provinceFlag} 
                        alt={`${dj.area.name} flag`}
                        className="w-4 h-3 ml-2 rounded border border-cyan-500/30"
                      />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => onFilterLevel(dj.level)}>
                    {getLevelIcon(dj.level)}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => onFilterRank(dj.rank)}>
                    {getRankIcon(dj.rank)}
                  </button>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-mono text-cyan-400 font-bold">{dj.lightyears.toLocaleString()}</span>
                    {dj.momentum.trend !== 'stable' && (
                      <span className={`ml-2 text-xs font-mono px-2 py-1 rounded-full border ${
                        dj.momentum.trend === 'up' 
                          ? 'text-green-400 border-green-500/30 bg-green-500/10' 
                          : 'text-red-400 border-red-500/30 bg-red-500/10'
                      }`}>
                        {dj.momentum.trend === 'up' ? '↑' : '↓'}{dj.momentum.percentage}%
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {dj.currentSession ? (
                    <div className="flex items-center">
                      <Link 
                        to={dj.currentSession.url}
                        className="flex items-center group mr-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-16 h-9 rounded overflow-hidden mr-2 border border-cyan-500/30 relative">
                          <img 
                            src={dj.currentSession.thumbnail}
                            alt={dj.currentSession.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-cyan-400/20 group-hover:bg-cyan-400/30 transition-colors"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 rounded-full backdrop-blur-md border border-cyan-500/30 bg-black/30 flex items-center justify-center">
                              <Play size={12} className="text-cyan-400" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-xs text-cyan-400 group-hover:text-cyan-300 truncate max-w-[120px] font-mono">
                            {dj.currentSession.title}
                          </div>
                          <div className="text-[10px] text-cyan-400/70 font-mono">
                            {dj.currentSession.votes} votes
                            {dj.currentSession.frozen && (
                              <span className="ml-1 text-yellow-500">• FROZEN</span>
                            )}
                          </div>
                        </div>
                      </Link>
                      {!dj.currentSession.frozen && (
                        <button className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors border border-cyan-500/30">
                          <ThumbsUp size={12} className="text-cyan-400" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-cyan-400/50 font-mono">NO SESSION</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}