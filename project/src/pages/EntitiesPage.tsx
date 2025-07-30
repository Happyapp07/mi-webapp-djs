import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Disc, GraduationCap, Radio, ShoppingBag, Plus } from 'lucide-react';
import { useEntityStore } from '../stores/entityStore';
import { EntityType, EntityProfile } from '../types/entity';
import EntityCard from '../components/entity/EntityCard';
import EntityFilter from '../components/entity/EntityFilter';
import EntityDetailModal from '../components/entity/EntityDetailModal';
import EntityApplicationForm from '../components/entity/EntityApplicationForm';

const EntitiesPage: React.FC = () => {
  const { entities, isLoading, error, fetchEntities, submitEntityApplication } = useEntityStore();
  
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);
  const [selectedMusicStyle, setSelectedMusicStyle] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedEntity, setSelectedEntity] = useState<EntityProfile | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);
  
  // Filter entities based on selected filters
  const filteredEntities = entities.filter(entity => {
    // Filter by type
    if (selectedType && entity.entityType !== selectedType) {
      return false;
    }
    
    // Filter by music style
    if (selectedMusicStyle && !entity.musicStyles.includes(selectedMusicStyle)) {
      return false;
    }
    
    // Filter by location
    if (selectedLocation) {
      const [city, country] = selectedLocation.split(', ');
      if (entity.location.city !== city || entity.location.country !== country) {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        entity.name.toLowerCase().includes(term) ||
        entity.description.toLowerCase().includes(term) ||
        entity.musicStyles.some(style => style.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  const handleEntityClick = (entity: EntityProfile) => {
    setSelectedEntity(entity);
  };
  
  const handleApplicationSubmit = async (formData: any) => {
    await submitEntityApplication(formData);
    setShowApplicationForm(false);
  };
  
  const getEntityTypeCount = (type: EntityType) => {
    return entities.filter(entity => entity.entityType === type).length;
  };
  
  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display flex items-center">
          <Building2 size={32} className="mr-3 text-indigo-500" />
          Entidades Colaboradoras
        </h1>
        <p className="text-gray-400 mt-2">
          Explora sellos, academias, radios y tiendas especializadas en música electrónica
        </p>
      </motion.div>
      
      {/* Entity Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${
            selectedType === EntityType.MENTOR_LABEL ? 'border-purple-500/50' : 'border-gray-700/50 hover:border-purple-500/30'
          }`}
          onClick={() => setSelectedType(selectedType === EntityType.MENTOR_LABEL ? null : EntityType.MENTOR_LABEL)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
              <Disc size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold">Mentor Labels</h3>
              <p className="text-sm text-gray-400">{getEntityTypeCount(EntityType.MENTOR_LABEL)} sellos</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${
            selectedType === EntityType.ACADEMY ? 'border-blue-500/50' : 'border-gray-700/50 hover:border-blue-500/30'
          }`}
          onClick={() => setSelectedType(selectedType === EntityType.ACADEMY ? null : EntityType.ACADEMY)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
              <GraduationCap size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold">Academies</h3>
              <p className="text-sm text-gray-400">{getEntityTypeCount(EntityType.ACADEMY)} academias</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${
            selectedType === EntityType.FREQUENCY_STATION ? 'border-green-500/50' : 'border-gray-700/50 hover:border-green-500/30'
          }`}
          onClick={() => setSelectedType(selectedType === EntityType.FREQUENCY_STATION ? null : EntityType.FREQUENCY_STATION)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <Radio size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-bold">Frequency Stations</h3>
              <p className="text-sm text-gray-400">{getEntityTypeCount(EntityType.FREQUENCY_STATION)} radios</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`glass-card p-4 rounded-xl cursor-pointer transition-all ${
            selectedType === EntityType.MUSIC_DEPOT ? 'border-orange-500/50' : 'border-gray-700/50 hover:border-orange-500/30'
          }`}
          onClick={() => setSelectedType(selectedType === EntityType.MUSIC_DEPOT ? null : EntityType.MUSIC_DEPOT)}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
              <ShoppingBag size={24} className="text-orange-400" />
            </div>
            <div>
              <h3 className="font-bold">Music Depots</h3>
              <p className="text-sm text-gray-400">{getEntityTypeCount(EntityType.MUSIC_DEPOT)} tiendas</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Filters */}
      <EntityFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedMusicStyle={selectedMusicStyle}
        onMusicStyleChange={setSelectedMusicStyle}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      {/* Apply Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowApplicationForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Solicitar entrada como entidad
        </button>
      </div>
      
      {/* Entities List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="glass-card p-6 rounded-xl text-center text-red-400">
          {error}
        </div>
      ) : filteredEntities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEntities.map(entity => (
            <EntityCard
              key={entity.id}
              entity={entity}
              onClick={() => handleEntityClick(entity)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-8 rounded-xl text-center">
          <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-medium mb-2">No se encontraron entidades</h3>
          <p className="text-gray-400">
            No hay entidades que coincidan con los filtros seleccionados.
          </p>
        </div>
      )}
      
      {/* Entity Detail Modal */}
      {selectedEntity && (
        <EntityDetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
      
      {/* Entity Application Form */}
      {showApplicationForm && (
        <EntityApplicationForm
          onSubmit={handleApplicationSubmit}
          onCancel={() => setShowApplicationForm(false)}
        />
      )}
    </div>
  );
};

export default EntitiesPage;