import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Disc, Building2, X, Radio, GraduationCap, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DJProfile, PartygoerProfile, ClubProfile, UserType } from '../../types';
import { EntityType, EntityProfile } from '../../types/entity';
import { useEntityStore } from '../../stores/entityStore';

interface GlobalSearchProps {
  onClose?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<{
    djs: DJProfile[];
    partygoers: PartygoerProfile[];
    clubs: ClubProfile[];
    entities: EntityProfile[];
  }>({
    djs: [],
    partygoers: [],
    clubs: [],
    entities: []
  });
  
  const { entities, fetchEntities } = useEntityStore();
  
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  // Mock search function - in a real app this would call an API
  useEffect(() => {
    const search = async () => {
      if (!searchTerm.trim()) {
        setResults({ djs: [], partygoers: [], clubs: [], entities: [] });
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock data - in a real app this would come from the API
      const mockResults = {
        djs: Array.from({ length: 3 }).map((_, i) => ({
          id: `dj_${i}`,
          userType: UserType.DJ,
          artistName: `DJ ${searchTerm} ${i + 1}`,
          username: `dj_${searchTerm}_${i}`,
          profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=dj_${i}`,
          level: Math.floor(Math.random() * 50) + 1,
          planetId: ['house', 'techno', 'trance'][i % 3]
        })) as DJProfile[],

        partygoers: Array.from({ length: 2 }).map((_, i) => ({
          id: `user_${i}`,
          userType: UserType.PARTYGOER,
          username: `party_${searchTerm}_${i}`,
          profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=party_${i}`,
          level: Math.floor(Math.random() * 30) + 1
        })) as PartygoerProfile[],

        clubs: Array.from({ length: 2 }).map((_, i) => ({
          id: `club_${i}`,
          userType: UserType.CLUB,
          clubName: `Club ${searchTerm} ${i + 1}`,
          username: `club_${searchTerm}_${i}`,
          profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=club_${i}`,
          location: {
            city: 'Barcelona',
            country: 'Spain'
          }
        })) as ClubProfile[],
        
        entities: entities.filter(entity => 
          entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entity.musicStyles.some(style => style.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 3)
      };

      setResults(mockResults);
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, entities]);

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case EntityType.MENTOR_LABEL:
        return <Disc size={12} className="text-purple-400" />;
      case EntityType.ACADEMY:
        return <GraduationCap size={12} className="text-blue-400" />;
      case EntityType.FREQUENCY_STATION:
        return <Radio size={12} className="text-green-400" />;
      case EntityType.MUSIC_DEPOT:
        return <ShoppingBag size={12} className="text-orange-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl"
      >
        {/* Search Input */}
        <div className="glass-card p-4 rounded-xl mb-4">
          <div className="relative">
            {/* Glassmorphism search icon */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                          backdrop-blur-md border border-cyan-500/30
                          bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                          shadow-[0_0_15px_rgba(0,255,255,0.3)]
                          flex items-center justify-center">
              <Search size={16} className="text-cyan-400" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
            </div>
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search DJs, partygoers, clubs, or entities..."
              className="w-full pl-16 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
              autoFocus
            />
            
            {/* Glassmorphism close icon */}
            <button 
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg
                        backdrop-blur-md border border-cyan-500/30
                        bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                        shadow-[0_0_15px_rgba(0,255,255,0.3)]
                        flex items-center justify-center
                        hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
                        transition-all duration-300">
              <X size={16} className="text-cyan-400" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
            </button>
          </div>
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {(results.djs.length > 0 || results.partygoers.length > 0 || results.clubs.length > 0 || results.entities.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-xl overflow-hidden divide-y divide-gray-800"
            >
              {/* DJs */}
              {results.djs.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    {/* Glassmorphism music icon */}
                    <div className="w-6 h-6 rounded-lg mr-2
                                  backdrop-blur-md border border-purple-500/30
                                  bg-gradient-to-br from-purple-500/10 to-indigo-500/10
                                  shadow-[0_0_10px_rgba(147,51,234,0.3)]
                                  flex items-center justify-center">
                      <Disc size={12} className="text-purple-400" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-50"></div>
                    </div>
                    Pilotos
                  </h3>
                  <div className="space-y-2">
                    {results.djs.map(dj => (
                      <Link
                        key={dj.id}
                        to={`/profile/${dj.id}`}
                        onClick={onClose}
                        className="flex items-center p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <img 
                          src={dj.profileImage} 
                          alt={dj.artistName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">{dj.artistName}</div>
                          <div className="text-sm text-gray-400">
                            Level {dj.level} • {dj.planetId}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Partygoers */}
              {results.partygoers.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    {/* Glassmorphism user icon */}
                    <div className="w-6 h-6 rounded-lg mr-2
                                  backdrop-blur-md border border-blue-500/30
                                  bg-gradient-to-br from-blue-500/10 to-cyan-500/10
                                  shadow-[0_0_10px_rgba(59,130,246,0.3)]
                                  flex items-center justify-center">
                      <User size={12} className="text-blue-400" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-50"></div>
                    </div>
                    Party Explorers
                  </h3>
                  <div className="space-y-2">
                    {results.partygoers.map(user => (
                      <Link
                        key={user.id}
                        to={`/profile/${user.id}`}
                        onClick={onClose}
                        className="flex items-center p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <img 
                          src={user.profileImage} 
                          alt={user.username}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">@{user.username}</div>
                          <div className="text-sm text-gray-400">Level {user.level}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Clubs */}
              {results.clubs.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    {/* Glassmorphism building icon */}
                    <div className="w-6 h-6 rounded-lg mr-2
                                  backdrop-blur-md border border-orange-500/30
                                  bg-gradient-to-br from-orange-500/10 to-red-500/10
                                  shadow-[0_0_10px_rgba(249,115,22,0.3)]
                                  flex items-center justify-center">
                      <Building2 size={12} className="text-orange-400" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-50"></div>
                    </div>
                    Hangares
                  </h3>
                  <div className="space-y-2">
                    {results.clubs.map(club => (
                      <Link
                        key={club.id}
                        to={`/club/${club.id}`}
                        onClick={onClose}
                        className="flex items-center p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <img 
                          src={club.profileImage} 
                          alt={club.clubName}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium">{club.clubName}</div>
                          <div className="text-sm text-gray-400">
                            {club.location.city}, {club.location.country}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Entities */}
              {results.entities.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                    {/* Glassmorphism building icon */}
                    <div className="w-6 h-6 rounded-lg mr-2
                                  backdrop-blur-md border border-indigo-500/30
                                  bg-gradient-to-br from-indigo-500/10 to-purple-500/10
                                  shadow-[0_0_10px_rgba(99,102,241,0.3)]
                                  flex items-center justify-center">
                      <Building2 size={12} className="text-indigo-400" />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50"></div>
                    </div>
                    Entities
                  </h3>
                  <div className="space-y-2">
                    {results.entities.map(entity => (
                      <Link
                        key={entity.id}
                        to={`/entities/${entity.id}`}
                        onClick={onClose}
                        className="flex items-center p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <img 
                          src={entity.logo} 
                          alt={entity.name}
                          className="w-10 h-10 rounded-lg mr-3 object-cover"
                        />
                        <div>
                          <div className="font-medium">{entity.name}</div>
                          <div className="text-sm text-gray-400 flex items-center">
                            {getEntityIcon(entity.entityType)}
                            <span className="ml-1">
                              {entity.entityType === EntityType.MENTOR_LABEL ? 'Mentor Label' :
                               entity.entityType === EntityType.ACADEMY ? 'Academy' :
                               entity.entityType === EntityType.FREQUENCY_STATION ? 'Frequency Station' :
                               'Music Depot'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default GlobalSearch;