import { create } from 'zustand';
import { EntityProfile, EntityType, MentorLabelProfile, AcademyProfile, FrequencyStationProfile, MusicDepotProfile } from '../types/entity';

interface EntityState {
  entities: EntityProfile[];
  isLoading: boolean;
  error: string | null;
  fetchEntities: (type?: EntityType) => Promise<void>;
  getEntityById: (id: string) => EntityProfile | undefined;
  getEntitiesByType: (type: EntityType) => EntityProfile[];
  getEntitiesByMusicStyle: (style: string) => EntityProfile[];
  getEntitiesByLocation: (city: string, country: string) => EntityProfile[];
  submitEntityApplication: (entity: Partial<EntityProfile>) => Promise<void>;
}

export const useEntityStore = create<EntityState>((set, get) => ({
  entities: [],
  isLoading: false,
  error: null,

  fetchEntities: async (type?: EntityType) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For real user testing, start with empty entities
      const filteredEntities: EntityProfile[] = [];
      
      set({ 
        entities: filteredEntities,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch entities',
        isLoading: false 
      });
    }
  },

  getEntityById: (id: string) => {
    return get().entities.find(entity => entity.id === id);
  },

  getEntitiesByType: (type: EntityType) => {
    return get().entities.filter(entity => entity.entityType === type);
  },

  getEntitiesByMusicStyle: (style: string) => {
    return get().entities.filter(entity => 
      entity.musicStyles.some(s => s.toLowerCase().includes(style.toLowerCase()))
    );
  },

  getEntitiesByLocation: (city: string, country: string) => {
    return get().entities.filter(entity => 
      entity.location.city.toLowerCase() === city.toLowerCase() &&
      entity.location.country.toLowerCase() === country.toLowerCase()
    );
  },

  submitEntityApplication: async (entityData: Partial<EntityProfile>) => {
    try {
      set({ isLoading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send the application to a backend
      console.log('Entity application submitted:', entityData);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to submit application',
        isLoading: false 
      });
    }
  }
}));