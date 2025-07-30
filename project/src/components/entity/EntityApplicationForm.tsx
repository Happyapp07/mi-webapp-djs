import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Disc, GraduationCap, Radio, ShoppingBag, X, Save, MapPin, Globe, Link as LinkIcon, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import { EntityType } from '../../types/entity';

interface EntityApplicationFormProps {
  onSubmit: (formData: any) => Promise<void>;
  onCancel: () => void;
}

const EntityApplicationForm: React.FC<EntityApplicationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    website: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      twitter: '',
      youtube: '',
      linkedin: ''
    },
    location: {
      address: '',
      city: '',
      country: '',
      isOnline: false
    },
    entityType: '' as EntityType | '',
    musicStyles: [] as string[],
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('El nombre de la entidad es obligatorio');
      return;
    }
    
    if (!formData.website.trim()) {
      setError('La página web es obligatoria');
      return;
    }
    
    if (!formData.entityType) {
      setError('Debes seleccionar un tipo de entidad');
      return;
    }
    
    if (!formData.location.city.trim() || !formData.location.country.trim()) {
      setError('La ciudad y el país son obligatorios');
      return;
    }
    
    if (formData.musicStyles.length === 0) {
      setError('Debes seleccionar al menos un estilo musical');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Send email notification
      const emailData = {
        to: 'francisco.aviles.noventa@gmail.com',
        subject: `Nueva solicitud de entidad: ${formData.name}`,
        body: `
          Nombre: ${formData.name}
          Tipo: ${formData.entityType}
          Web: ${formData.website}
          Ubicación: ${formData.location.city}, ${formData.location.country}
          Estilos: ${formData.musicStyles.join(', ')}
          Descripción: ${formData.description}
          Contacto: ${formData.socialLinks.email || 'No proporcionado'}
        `
      };
      
      // In a real app, this would be an API call to send the email
      console.log('Sending email notification:', emailData);
      
      // Add creation date
      const submissionData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false
      };
      
      await onSubmit(submissionData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMusicStyleToggle = (style: string) => {
    setFormData(prev => {
      const currentStyles = [...prev.musicStyles];
      
      if (currentStyles.includes(style)) {
        return {
          ...prev,
          musicStyles: currentStyles.filter(s => s !== style)
        };
      } else {
        return {
          ...prev,
          musicStyles: [...currentStyles, style]
        };
      }
    });
  };
  
  const musicStyleOptions = [
    'house', 'techno', 'trance', 'progressive-house', 'deep-house', 
    'tech-house', 'minimal-techno', 'drum-and-bass', 'dubstep', 
    'ambient', 'electronica', 'downtempo', 'breakbeat'
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-6 rounded-xl max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-display mb-6">Solicitud de Entidad Colaboradora</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nombre de la Entidad *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nombre de tu sello, academia, radio o tienda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Página Web *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://www.tuentidad.com"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Entity Type */}
          <div>
            <h3 className="text-lg font-medium mb-4">Tipo de Entidad *</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, entityType: EntityType.MENTOR_LABEL })}
                className={`p-4 rounded-lg flex flex-col items-center text-center transition-all ${
                  formData.entityType === EntityType.MENTOR_LABEL
                    ? 'bg-purple-500/20 border-2 border-purple-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <Disc size={32} className={`mb-2 ${formData.entityType === EntityType.MENTOR_LABEL ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className="font-medium">Mentor Label</span>
                <span className="text-xs text-gray-400 mt-1">Sello discográfico</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, entityType: EntityType.ACADEMY })}
                className={`p-4 rounded-lg flex flex-col items-center text-center transition-all ${
                  formData.entityType === EntityType.ACADEMY
                    ? 'bg-blue-500/20 border-2 border-blue-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-500/50'
                }`}
              >
                <GraduationCap size={32} className={`mb-2 ${formData.entityType === EntityType.ACADEMY ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="font-medium">Academy</span>
                <span className="text-xs text-gray-400 mt-1">Academia de formación</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, entityType: EntityType.FREQUENCY_STATION })}
                className={`p-4 rounded-lg flex flex-col items-center text-center transition-all ${
                  formData.entityType === EntityType.FREQUENCY_STATION
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50'
                }`}
              >
                <Radio size={32} className={`mb-2 ${formData.entityType === EntityType.FREQUENCY_STATION ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="font-medium">Frequency Station</span>
                <span className="text-xs text-gray-400 mt-1">Radio o medio musical</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, entityType: EntityType.MUSIC_DEPOT })}
                className={`p-4 rounded-lg flex flex-col items-center text-center transition-all ${
                  formData.entityType === EntityType.MUSIC_DEPOT
                    ? 'bg-orange-500/20 border-2 border-orange-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-orange-500/50'
                }`}
              >
                <ShoppingBag size={32} className={`mb-2 ${formData.entityType === EntityType.MUSIC_DEPOT ? 'text-orange-400' : 'text-gray-400'}`} />
                <span className="font-medium">Music Depot</span>
                <span className="text-xs text-gray-400 mt-1">Tienda especializada</span>
              </button>
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h3 className="text-lg font-medium mb-4">Ubicación *</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Ciudad *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, city: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Barcelona"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  País *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.location.country}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, country: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="España"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Dirección (opcional)
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, address: e.target.value } 
                  })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Calle Ejemplo, 123"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isOnline"
                  checked={formData.location.isOnline}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    location: { ...formData.location, isOnline: e.target.checked } 
                  })}
                  className="w-4 h-4 text-indigo-600 bg-gray-800 border-gray-700 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isOnline" className="ml-2 text-sm text-gray-300">
                  Esta entidad también opera online
                </label>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Redes Sociales (opcional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Instagram
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Instagram size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://instagram.com/tuentidad"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Facebook
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Facebook size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://facebook.com/tuentidad"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Twitter / X
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://twitter.com/tuentidad"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  YouTube
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Youtube size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value } 
                    })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://youtube.com/c/tuentidad"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Music Styles */}
          <div>
            <h3 className="text-lg font-medium mb-4">Estilos Musicales *</h3>
            <p className="text-sm text-gray-400 mb-3">Selecciona los estilos musicales que representan a tu entidad</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {musicStyleOptions.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => handleMusicStyleToggle(style)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    formData.musicStyles.includes(style)
                      ? 'bg-indigo-500/20 border-2 border-indigo-500'
                      : 'bg-gray-800/50 border-2 border-gray-700 hover:border-indigo-500/50'
                  }`}
                >
                  {style.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-4">Descripción *</h3>
            
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
              placeholder="Describe tu entidad, su misión y qué ofrece a la comunidad..."
            />
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Enviar Solicitud
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EntityApplicationForm;