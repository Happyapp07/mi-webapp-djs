import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { useEntityStore } from '../../stores/entityStore';
import { EntityProfile, EntityType } from '../../types/entity';
import { useNavigate } from 'react-router-dom';

interface EntityRecommendationsProps {
  userType?: string;
  musicStyles?: string[];
  location?: {
    city: string;
    country: string;
  };
}

const EntityRecommendations: React.FC<EntityRecommendationsProps> = ({
  userType,
  musicStyles = [],
  location
}) => {
  const { entities, fetchEntities } = useEntityStore();
  const [recommendations, setRecommendations] = useState<EntityProfile[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);
  
  useEffect(() => {
    // Generate recommendations based on user profile
    if (entities.length === 0) return;
    
    let filtered = [...entities];
    
    // Filter by music style if available
    if (musicStyles.length > 0) {
      filtered = filtered.filter(entity => 
        entity.musicStyles.some(style => musicStyles.includes(style))
      );
    }
    
    // Filter by location if available
    if (location) {
      filtered = filtered.filter(entity => 
        entity.location.city === location.city || 
        entity.location.country === location.country ||
        entity.location.isOnline
      );
    }
    
    // Prioritize by user type
    if (userType === 'dj') {
      // DJs might be more interested in labels and academies
      const labels = filtered.filter(e => e.entityType === EntityType.MENTOR_LABEL);
      const academies = filtered.filter(e => e.entityType === EntityType.ACADEMY);
      const others = filtered.filter(e => 
        e.entityType !== EntityType.MENTOR_LABEL && 
        e.entityType !== EntityType.ACADEMY
      );
      
      filtered = [...labels, ...academies, ...others];
    } else if (userType === 'partygoer') {
      // Partygoers might be more interested in radio stations
      const stations = filtered.filter(e => e.entityType === EntityType.FREQUENCY_STATION);
      const others = filtered.filter(e => e.entityType !== EntityType.FREQUENCY_STATION);
      
      filtered = [...stations, ...others];
    } else if (userType === 'club') {
      // Clubs might be more interested in equipment stores
      const depots = filtered.filter(e => e.entityType === EntityType.MUSIC_DEPOT);
      const others = filtered.filter(e => e.entityType !== EntityType.MUSIC_DEPOT);
      
      filtered = [...depots, ...others];
    }
    
    // Limit to 3 recommendations
    setRecommendations(filtered.slice(0, 3));
  }, [entities, userType, musicStyles, location]);
  
  if (recommendations.length === 0) return null;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <Building2 size={20} className="mr-2 text-indigo-400" />
          Entidades Recomendadas
        </h3>
        <button
          onClick={() => navigate('/entities')}
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
        >
          Ver todas
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((entity, index) => (
          <motion.div
            key={entity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-4 rounded-lg cursor-pointer hover:border-indigo-500/30 transition-all"
            onClick={() => navigate(`/entities/${entity.id}`)}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                <img 
                  src={entity.logo} 
                  alt={entity.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{entity.name}</h4>
                <div className="text-xs text-gray-400">
                  {entity.entityType === EntityType.MENTOR_LABEL ? 'Mentor Label' :
                   entity.entityType === EntityType.ACADEMY ? 'Academy' :
                   entity.entityType === EntityType.FREQUENCY_STATION ? 'Frequency Station' :
                   'Music Depot'}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{entity.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EntityRecommendations;