import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Zap, Globe, Target, Activity, Filter, Search, Calendar, Users, Star, Crown } from 'lucide-react';
import { useRankingStore } from '../stores/rankingStore';
import { useAreaStore } from '../stores/areaStore';
import DJRankingTable from '../components/rankings/DJRankingTable';
import DJRankingFilters from '../components/rankings/DJRankingFilters';
import SquadCompetition from '../components/rankings/SquadCompetition';
import AdSection from '../components/common/AdSection';
import { DJLevel, DJRank } from '../types/ranking';
import DJRankingStats from '../components/rankings/DJRankingStats';

const DjRankings: React.FC = () => {
  const { planetId } = useParams<{ planetId?: string }>();
  const { 
    djRankings: rankings, 
    filters,
    isLoading: rankingsLoading,
    error: rankingsError,
    fetchRankings,
    updateFilters
  } = useRankingStore();

  const {
    countries,
    areas,
    isLoading: areasLoading,
    error: areasError,
    fetchAreas
  } = useAreaStore();

  const [currentFilters, setCurrentFilters] = useState(filters);
  const [viewMode, setViewMode] = useState<'table' | 'squads'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Exactly 25 DJs per page

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  const handleSearch = () => {
    fetchRankings(currentFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (planetId) {
      const newFilters = { ...currentFilters, planetId };
      setCurrentFilters(newFilters);
      fetchRankings(newFilters);
    }
  }, [planetId]);

  const availablePlanets = Array.from(new Set(rankings.map(r => r.planetId)));
  const squadGroups = rankings.reduce((groups, dj) => {
    if (!groups[dj.squad]) {
      groups[dj.squad] = [];
    }
    groups[dj.squad].push(dj);
    return groups;
  }, {} as { [key: number]: typeof rankings });

  const isLoading = rankingsLoading || areasLoading;
  const error = rankingsError || areasError;

  // Pagination
  const totalPages = Math.ceil(rankings.length / itemsPerPage);
  const paginatedRankings = rankings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/30 border-b-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-4 glass-card rounded-xl border border-red-500/30">
        <div className="hologram-grid"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">SYSTEM ERROR</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl floating-element"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl floating-element" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl floating-element" style={{ animationDelay: '4s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <div className="glass-card p-6 rounded-xl border border-cyan-500/30 relative overflow-hidden">
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display flex items-center neon-text">
                  <Trophy size={32} className="mr-3 text-yellow-500 energy-pulse" />
                  DJ RANKING SYSTEM
                </h1>
                <p className="text-cyan-400/70 mt-2 font-mono">
                  GALACTIC PILOT LEADERBOARD • REAL-TIME SYNC
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center px-3 py-1 rounded-full bg-black/40 border border-green-500/30">
                  <Activity size={14} className="text-green-400 mr-1" />
                  <span className="text-xs font-mono text-green-400">LIVE</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-black/40 border border-cyan-500/30">
                  <Globe size={14} className="text-cyan-400 mr-1" />
                  <span className="text-xs font-mono text-cyan-400">{rankings.length} PILOTS</span>
                </div>
                <div className="flex items-center px-3 py-1 rounded-full bg-black/40 border border-purple-500/30">
                  <Calendar size={14} className="text-purple-400 mr-1" />
                  <span className="text-xs font-mono text-purple-400">SEASON 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Ad Banner */}
      <AdSection position="top" className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <DJRankingFilters
            filters={currentFilters}
            onFilterChange={(newFilters) => setCurrentFilters({ ...currentFilters, ...newFilters })}
            onSearch={handleSearch}
            availablePlanets={availablePlanets}
            availableCountries={countries}
            availableAreas={areas}
          />

          {/* Stats Overview */}
          {rankings.length > 0 && viewMode === 'table' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <DJRankingStats ranking={rankings[0]} />
            </motion.div>
          )}

          {/* View Mode Toggle */}
          <div className="flex justify-end mb-6 space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'table' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-400' 
                  : 'bg-gray-800/40 border border-gray-700 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400'
              }`}
            >
              <Target size={16} className="mr-2" />
              TABLE VIEW
            </button>
            <button
              onClick={() => setViewMode('squads')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'squads' 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/50 text-cyan-400' 
                  : 'bg-gray-800/40 border border-gray-700 text-gray-400 hover:border-cyan-500/30 hover:text-cyan-400'
              }`}
            >
              <Zap size={16} className="mr-2" />
              SQUAD VIEW
            </button>
          </div>

          {viewMode === 'table' ? (
            <>
              <DJRankingTable
                djs={paginatedRankings}
                onFilterPlanet={(planetId) => setCurrentFilters({ ...currentFilters, planetId })}
                onFilterRank={(rank) => setCurrentFilters({ ...currentFilters, rank })}
                onFilterLevel={(level) => setCurrentFilters({ ...currentFilters, level })}
                onFilterSquad={(squad) => setCurrentFilters({ ...currentFilters, squad })}
                onFilterArea={(area) => setCurrentFilters({ ...currentFilters, area })}
              />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === 1 
                        ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800/60 text-cyan-400 hover:bg-gray-700/60'
                    } border border-cyan-500/30`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                            currentPage === pageNum 
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' 
                              : 'bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-cyan-500/30 hover:text-cyan-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="self-end mb-1 text-gray-500">...</span>}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 border border-gray-700 hover:border-cyan-500/30 hover:text-cyan-400"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === totalPages 
                        ? 'bg-gray-800/40 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-800/60 text-cyan-400 hover:bg-gray-700/60'
                    } border border-cyan-500/30`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {Object.entries(squadGroups).map(([squad, djs]) => (
                <SquadCompetition
                  key={squad}
                  squad={parseInt(squad)}
                  djs={djs}
                  planetId={currentFilters.planetId || 'house'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* System Status */}
            <div className="glass-card p-6 rounded-xl border border-cyan-500/30 relative overflow-hidden">
              <div className="hologram-grid absolute inset-0 opacity-20"></div>
              <div className="scanner-effect"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-4 neon-text">SYSTEM STATUS</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-400/70">Network</span>
                    <span className="text-sm text-green-400 font-mono">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-400/70">Sync Rate</span>
                    <span className="text-sm text-cyan-400 font-mono">99.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-400/70">Last Update</span>
                    <span className="text-sm text-purple-400 font-mono">2.3s ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-400/70">Active Pilots</span>
                    <span className="text-sm text-yellow-400 font-mono">{rankings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-cyan-400/70">Squads</span>
                    <span className="text-sm text-indigo-400 font-mono">{Object.keys(squadGroups).length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Competition Schedule */}
            <div className="glass-card p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
              <div className="hologram-grid absolute inset-0 opacity-20"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Calendar size={18} className="mr-2 text-purple-400" />
                  <span className="neon-text-pink">COMPETITION SCHEDULE</span>
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-black/30 rounded-lg border border-purple-500/20">
                    <div className="text-sm font-medium text-purple-400 mb-1">Submission Window</div>
                    <div className="text-xs text-gray-300">Monday 13:00 - Friday 13:00</div>
                  </div>
                  
                  <div className="p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                    <div className="text-sm font-medium text-cyan-400 mb-1">Voting Period</div>
                    <div className="text-xs text-gray-300">Friday 13:00 - Sunday 23:59</div>
                  </div>
                  
                  <div className="p-3 bg-black/30 rounded-lg border border-yellow-500/20">
                    <div className="text-sm font-medium text-yellow-400 mb-1">Results Update</div>
                    <div className="text-xs text-gray-300">Monday 07:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Benefits */}
            <div className="glass-card p-6 rounded-xl border border-yellow-500/30 relative overflow-hidden">
              <div className="hologram-grid absolute inset-0 opacity-20"></div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Star size={18} className="mr-2 text-yellow-400" />
                  <span className="neon-text">MEMBERSHIP BENEFITS</span>
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black/30 border border-yellow-500/30 flex items-center justify-center mr-3">
                      <Crown size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium text-yellow-400">Expert</div>
                      <div className="text-xs text-gray-400">Analytics & Multi-planet</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black/30 border border-cyan-500/30 flex items-center justify-center mr-3">
                      <Star size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-medium text-cyan-400">Pro</div>
                      <div className="text-xs text-gray-400">Competition Access</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black/30 border border-gray-500/30 flex items-center justify-center mr-3">
                      <Users size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-400">Basic</div>
                      <div className="text-xs text-gray-500">Limited Features</div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 hover:bg-yellow-500/30 transition-colors text-sm">
                  Upgrade Membership
                </button>
              </div>
            </div>

            <AdSection position="sidebar" />
          </div>
        </div>
      </div>

      {/* Footer Ad */}
      <AdSection position="footer" className="mt-8" />
    </div>
  );
};

export default DjRankings;