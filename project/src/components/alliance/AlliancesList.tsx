import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Music, Radio, ChevronRight, AlertTriangle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useAllianceStore } from '../../stores/allianceStore';
import { Alliance } from '../../types/alliance';

interface AlliancesListProps {
  maxDisplay?: number;
  showViewAll?: boolean;
}

const AlliancesList: React.FC<AlliancesListProps> = ({
  maxDisplay,
  showViewAll = true
}) => {
  const { user } = useAuthStore();
  const { getAlliancesByUserId, isLoading } = useAllianceStore();
  const [alliances, setAlliances] = useState<Alliance[]>([]);
  
  useEffect(() => {
    if (user) {
      const userAlliances = getAlliancesByUserId(user.id);
      
      // Sort by most recent meetup
      const sortedAlliances = [...userAlliances].sort((a, b) => {
        if (!a.lastMeetupAt) return 1;
        if (!b.lastMeetupAt) return -1;
        return new Date(b.lastMeetupAt).getTime() - new Date(a.lastMeetupAt).getTime();
      });
      
      // Limit to maxDisplay if provided
      const limitedAlliances = maxDisplay ? sortedAlliances.slice(0, maxDisplay) : sortedAlliances;
      
      setAlliances(limitedAlliances);
    }
  }, [user, getAlliancesByUserId, maxDisplay]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="animate-spin w-6 h-6 border-3 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (alliances.length === 0) {
    return (
      <div className="glass-card p-6 rounded-xl relative overflow-hidden">
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <Shield size={20} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-medium">Mis Alianzas Cósmicas</h3>
          </div>
          
          <div className="text-center py-8">
            <AlertTriangle size={32} className="mx-auto mb-3 text-yellow-500" />
            <h3 className="text-lg font-medium mb-2">No tienes alianzas cósmicas</h3>
            <p className="text-gray-400 mb-4">
              Escanea el código QR de otros tripulantes para formar alianzas y combatir juntos el Silencio Cósmico
            </p>
            
            <Link to="/alliance/scan" className="glassmorphism-primary-button px-6 py-2.5 inline-flex items-center">
              <Users size={16} className="mr-2" />
              Formar Alianza Cósmica
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <Shield size={20} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-medium">Mis Alianzas Cósmicas</h3>
          </div>
          
          {showViewAll && alliances.length > 0 && (
            <Link 
              to="/alliance/list" 
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Ver todas
              <ChevronRight size={16} className="ml-1" />
            </Link>
          )}
        </div>
        
        <div className="space-y-4">
          {alliances.map((alliance) => {
            const allyId = alliance.userId1 === user?.id ? alliance.userId2 : alliance.userId1;
            
            return (
              <motion.div
                key={alliance.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${allyId}`} 
                      alt="Ally avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">Aliado {allyId.substring(0, 8)}</div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Radio size={14} className="mr-1 text-indigo-400" />
                      <span>{alliance.meetupCount} misiones conjuntas</span>
                    </div>
                  </div>
                  
                  {alliance.lastMeetupAt && (
                    <div className="text-right text-sm text-gray-400">
                      <Calendar size={14} className="inline mr-1" />
                      <span>
                        {new Date(alliance.lastMeetupAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Shared experiences */}
                {(alliance.sharedClubs.length > 0 || alliance.sharedEvents.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {alliance.sharedClubs.slice(0, 3).map((outpostId, index) => (
                        <div key={index} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs flex items-center">
                          <MapPin size={10} className="mr-1" />
                          <span>Outpost {outpostId.substring(0, 5)}</span>
                        </div>
                      ))}
                      
                      {alliance.sharedEvents.slice(0, 2).map((missionId, index) => (
                        <div key={index} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs flex items-center">
                          <Music size={10} className="mr-1" />
                          <span>Misión {missionId.substring(0, 5)}</span>
                        </div>
                      ))}
                      
                      {(alliance.sharedClubs.length + alliance.sharedEvents.length) > 5 && (
                        <div className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded-full text-xs">
                          +{(alliance.sharedClubs.length + alliance.sharedEvents.length) - 5} más
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlliancesList;