import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Disc, GraduationCap, Radio, ShoppingBag, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EntityProfile, EntityType } from '../../types/entity';

interface EntityCardProps {
  entity: EntityProfile;
  onClick?: () => void;
}

const EntityCard: React.FC<EntityCardProps> = ({ entity, onClick }) => {
  const getEntityIcon = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return <Disc size={20} className="text-purple-400" />;
      case EntityType.ACADEMY:
        return <GraduationCap size={20} className="text-blue-400" />;
      case EntityType.FREQUENCY_STATION:
        return <Radio size={20} className="text-green-400" />;
      case EntityType.MUSIC_DEPOT:
        return <ShoppingBag size={20} className="text-orange-400" />;
      default:
        return <Building2 size={20} className="text-indigo-400" />;
    }
  };

  const getEntityTypeLabel = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return 'Mentor Label';
      case EntityType.ACADEMY:
        return 'Academy';
      case EntityType.FREQUENCY_STATION:
        return 'Frequency Station';
      case EntityType.MUSIC_DEPOT:
        return 'Music Depot';
      default:
        return 'Entity';
    }
  };

  const getEntityColor = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return 'border-purple-500/30 hover:border-purple-500/50';
      case EntityType.ACADEMY:
        return 'border-blue-500/30 hover:border-blue-500/50';
      case EntityType.FREQUENCY_STATION:
        return 'border-green-500/30 hover:border-green-500/50';
      case EntityType.MUSIC_DEPOT:
        return 'border-orange-500/30 hover:border-orange-500/50';
      default:
        return 'border-indigo-500/30 hover:border-indigo-500/50';
    }
  };

  const getEntityActionButton = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return {
          text: 'Solicitar valoración',
          enabled: (entity as any).talentSubmissionOpen
        };
      case EntityType.ACADEMY:
        return {
          text: 'Quiero formarme aquí',
          enabled: true
        };
      case EntityType.FREQUENCY_STATION:
        return {
          text: 'Sintoniza la frecuencia',
          enabled: true
        };
      case EntityType.MUSIC_DEPOT:
        return {
          text: 'Ver ofertas para la tripulación',
          enabled: (entity as any).specialOffers?.length > 0
        };
      default:
        return {
          text: 'Ver más',
          enabled: true
        };
    }
  };

  const actionButton = getEntityActionButton();

  return (
    <motion.div
      className={`glass-card p-6 rounded-xl border ${getEntityColor()} cursor-pointer transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
          <img 
            src={entity.logo} 
            alt={entity.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold">{entity.name}</h3>
            <div className="px-2 py-1 rounded-full text-xs bg-gray-800/50 flex items-center">
              {getEntityIcon()}
              <span className="ml-1">{getEntityTypeLabel()}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <MapPin size={14} className="mr-1" />
            <span>
              {entity.location.city}, {entity.location.country}
              {entity.location.isOnline && ' (Online)'}
            </span>
          </div>
          
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">{entity.description}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {entity.musicStyles.slice(0, 3).map((style, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 bg-gray-800/50 rounded-full text-xs"
              >
                {style.replace('-', ' ')}
              </span>
            ))}
            {entity.musicStyles.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-800/50 rounded-full text-xs">
                +{entity.musicStyles.length - 3}
              </span>
            )}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <a 
              href={entity.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              Sitio web oficial
              <ExternalLink size={12} className="ml-1" />
            </a>
            
            <button 
              className={`px-3 py-1 rounded-lg text-xs ${
                actionButton.enabled 
                  ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' 
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!actionButton.enabled}
            >
              {actionButton.text}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EntityCard;