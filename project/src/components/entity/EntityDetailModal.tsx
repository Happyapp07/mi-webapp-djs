import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, MapPin, Calendar, Disc, GraduationCap, Radio, ShoppingBag, Instagram, Facebook, Twitter, Youtube, Linkedin, Globe, Star, Users, Tag, Clock } from 'lucide-react';
import { EntityProfile, EntityType, MentorLabelProfile, AcademyProfile, FrequencyStationProfile, MusicDepotProfile } from '../../types/entity';
import { format } from 'date-fns';

interface EntityDetailModalProps {
  entity: EntityProfile;
  onClose: () => void;
}

const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ entity, onClose }) => {
  const getEntityIcon = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return <Disc size={24} className="text-purple-400" />;
      case EntityType.ACADEMY:
        return <GraduationCap size={24} className="text-blue-400" />;
      case EntityType.FREQUENCY_STATION:
        return <Radio size={24} className="text-green-400" />;
      case EntityType.MUSIC_DEPOT:
        return <ShoppingBag size={24} className="text-orange-400" />;
      default:
        return null;
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
        return 'border-purple-500/30';
      case EntityType.ACADEMY:
        return 'border-blue-500/30';
      case EntityType.FREQUENCY_STATION:
        return 'border-green-500/30';
      case EntityType.MUSIC_DEPOT:
        return 'border-orange-500/30';
      default:
        return 'border-indigo-500/30';
    }
  };

  const renderMentorLabelContent = (entity: MentorLabelProfile) => (
    <>
      {/* Artists */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Users size={20} className="mr-2 text-purple-400" />
          Artistas Asociados
        </h3>
        
        {entity.artists.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entity.artists.map((artistId, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${artistId}`}
                    alt={`Artist ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{artistId.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  <div className="text-xs text-gray-400">DJ</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay artistas asociados actualmente.</p>
        )}
      </div>
      
      {/* Releases */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Disc size={20} className="mr-2 text-purple-400" />
          Lanzamientos Recientes
        </h3>
        
        {entity.releases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entity.releases.map(release => (
              <div key={release.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="aspect-square">
                  <img 
                    src={release.coverImage} 
                    alt={release.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">{release.title}</h4>
                  <div className="text-sm text-gray-400">{release.artist}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(release.releaseDate), 'dd MMM yyyy')}
                  </div>
                  <a 
                    href={release.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center mt-2"
                  >
                    Escuchar
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay lanzamientos recientes.</p>
        )}
      </div>
      
      {/* Talent Submission */}
      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <h3 className="font-medium mb-2">Envío de Demos</h3>
        {entity.talentSubmissionOpen ? (
          <>
            <p className="text-sm text-gray-300 mb-3">
              Actualmente estamos aceptando demos de nuevos talentos. Si crees que tu música encaja con nuestro sello, nos encantaría escucharla.
            </p>
            <button className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30 transition-colors">
              Solicitar valoración como talento
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Actualmente no estamos aceptando nuevos demos. Por favor, revisa más adelante.
          </p>
        )}
      </div>
    </>
  );

  const renderAcademyContent = (entity: AcademyProfile) => (
    <>
      {/* Courses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <GraduationCap size={20} className="mr-2 text-blue-400" />
          Cursos Disponibles
        </h3>
        
        {entity.courses.length > 0 ? (
          <div className="space-y-4">
            {entity.courses.map(course => (
              <div key={course.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <div className="text-sm text-gray-400 mt-1">{course.description}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-400">
                    <Clock size={14} className="inline mr-1" />
                    {course.duration}
                  </div>
                  <a 
                    href={course.infoLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    Más información
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay cursos disponibles actualmente.</p>
        )}
      </div>
      
      {/* Graduates */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Users size={20} className="mr-2 text-blue-400" />
          Graduados Destacados
        </h3>
        
        {entity.graduates.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entity.graduates.map((djId, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${djId}`}
                    alt={`Graduate ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{djId.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  <div className="text-xs text-gray-400">DJ</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay graduados destacados actualmente.</p>
        )}
      </div>
      
      {/* Certifications */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Star size={20} className="mr-2 text-blue-400" />
          Certificaciones
        </h3>
        
        {entity.certifications.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {entity.certifications.map((cert, index) => (
              <div key={index} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                {cert}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay certificaciones disponibles.</p>
        )}
      </div>
      
      {/* Scholarship */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h3 className="font-medium mb-2">Programa de Becas</h3>
        {entity.scholarshipAvailable ? (
          <>
            <p className="text-sm text-gray-300 mb-3">
              Ofrecemos becas para estudiantes talentosos. Las becas pueden incluir acceso a cursos premium y membresías superiores en la plataforma.
            </p>
            <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors">
              Quiero formarme aquí
            </button>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Actualmente no hay becas disponibles. Por favor, revisa más adelante.
          </p>
        )}
      </div>
    </>
  );

  const renderFrequencyStationContent = (entity: FrequencyStationProfile) => (
    <>
      {/* Broadcast Info */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Radio size={20} className="mr-2 text-green-400" />
          Información de Emisión
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2">Tipo de Emisión</h4>
            <div className="text-gray-300">
              {entity.broadcastType === 'online' ? 'Online' : 
               entity.broadcastType === 'fm' ? 'FM Radio' : 
               'Online y FM Radio'}
            </div>
            {entity.frequency && (
              <div className="text-sm text-gray-400 mt-1">
                Frecuencia: {entity.frequency}
              </div>
            )}
          </div>
          
          {entity.streamUrl && (
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-medium mb-2">Stream Online</h4>
              <a 
                href={entity.streamUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                Escuchar en directo
                <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {/* Shows */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-green-400" />
          Programas
        </h3>
        
        {entity.shows.length > 0 ? (
          <div className="space-y-4">
            {entity.shows.map(show => (
              <div key={show.id} className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium">{show.title}</h4>
                <div className="text-sm text-gray-400 mt-1">{show.description}</div>
                
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-300 mb-1">Horario:</h5>
                  <div className="flex flex-wrap gap-2">
                    {show.schedule.map((schedule, idx) => (
                      <div key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {schedule.day} {schedule.startTime}-{schedule.endTime}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 text-sm">
                  <span className="text-gray-400">Host: </span>
                  <span>{show.hostName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay programas disponibles actualmente.</p>
        )}
      </div>
      
      {/* Featured DJs */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Users size={20} className="mr-2 text-green-400" />
          DJs Destacados
        </h3>
        
        {entity.featuredDJs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entity.featuredDJs.map((djId, index) => (
              <div key={index} className="p-3 bg-gray-800/50 rounded-lg flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${djId}`}
                    alt={`DJ ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{djId.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  <div className="text-xs text-gray-400">DJ</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay DJs destacados actualmente.</p>
        )}
      </div>
      
      {/* Custom Rankings */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Star size={20} className="mr-2 text-green-400" />
          Rankings Personalizados
        </h3>
        
        {entity.customRankings.length > 0 ? (
          <div className="space-y-4">
            {entity.customRankings.map(ranking => (
              <div key={ranking.id} className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium">{ranking.title}</h4>
                <div className="text-sm text-gray-400 mt-1">{ranking.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(ranking.createdAt), 'MMMM yyyy')}
                </div>
                <button className="mt-3 px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-colors">
                  Ver ranking completo
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay rankings personalizados actualmente.</p>
        )}
      </div>
      
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
        <h3 className="font-medium mb-2">Sintoniza la frecuencia</h3>
        <p className="text-sm text-gray-300 mb-3">
          Mantente conectado con la mejor música y contenido exclusivo.
        </p>
        <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
          Sintonizar ahora
        </button>
      </div>
    </>
  );

  const renderMusicDepotContent = (entity: MusicDepotProfile) => (
    <>
      {/* Brands */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Tag size={20} className="mr-2 text-orange-400" />
          Marcas Disponibles
        </h3>
        
        {entity.brands.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {entity.brands.map(brand => (
              <div key={brand.id} className="p-4 bg-gray-800/50 rounded-lg flex flex-col items-center text-center">
                <div className="h-12 flex items-center justify-center mb-2">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="font-medium text-sm">{brand.name}</div>
                <div className="text-xs text-gray-400 capitalize">{brand.category}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay marcas disponibles actualmente.</p>
        )}
      </div>
      
      {/* Promotional Events */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-orange-400" />
          Eventos Promocionales
        </h3>
        
        {entity.promotionalEvents.length > 0 ? (
          <div className="space-y-4">
            {entity.promotionalEvents.map(event => (
              <div key={event.id} className="p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium">{event.title}</h4>
                <div className="text-sm text-gray-400 mt-1">{event.description}</div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm">
                    <Calendar size={14} className="inline mr-1 text-gray-400" />
                    <span>{format(new Date(event.date), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="text-sm">
                    <MapPin size={14} className="inline mr-1 text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <a 
                  href={event.infoLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center mt-2"
                >
                  Más información
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay eventos promocionales actualmente.</p>
        )}
      </div>
      
      {/* Special Offers */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Tag size={20} className="mr-2 text-orange-400" />
          Ofertas Especiales
        </h3>
        
        {entity.specialOffers.length > 0 ? (
          <div className="space-y-4">
            {entity.specialOffers.map(offer => (
              <div key={offer.id} className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <h4 className="font-medium">{offer.title}</h4>
                <div className="text-sm text-gray-300 mt-1">{offer.description}</div>
                <div className="flex justify-between items-center mt-3">
                  <div className="text-sm text-gray-400">
                    Válido hasta: {format(new Date(offer.validUntil), 'dd MMM yyyy')}
                  </div>
                  {offer.discountCode && (
                    <div className="px-2 py-1 bg-gray-800 rounded text-sm">
                      Código: <span className="font-mono font-medium text-orange-400">{offer.discountCode}</span>
                    </div>
                  )}
                </div>
                <a 
                  href={offer.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-3 px-3 py-1 bg-orange-500/20 text-orange-400 rounded text-sm hover:bg-orange-500/30 transition-colors inline-flex items-center"
                >
                  Ver oferta
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay ofertas especiales actualmente.</p>
        )}
      </div>
      
      <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
        <h3 className="font-medium mb-2">Ofertas para la Tripulación</h3>
        <p className="text-sm text-gray-300 mb-3">
          Descuentos exclusivos para miembros de Cosmic Beats en equipamiento, software y más.
        </p>
        <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm hover:bg-orange-500/30 transition-colors">
          Ver ofertas para la tripulación
        </button>
      </div>
    </>
  );

  const renderEntityContent = () => {
    switch (entity.entityType) {
      case EntityType.MENTOR_LABEL:
        return renderMentorLabelContent(entity as MentorLabelProfile);
      case EntityType.ACADEMY:
        return renderAcademyContent(entity as AcademyProfile);
      case EntityType.FREQUENCY_STATION:
        return renderFrequencyStationContent(entity as FrequencyStationProfile);
      case EntityType.MUSIC_DEPOT:
        return renderMusicDepotContent(entity as MusicDepotProfile);
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`glass-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${getEntityColor()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 glassmorphism border-b border-gray-700 p-4 flex justify-between items-center">
          <div className="flex items-center">
            {getEntityIcon()}
            <h2 className="text-xl font-bold ml-2">{entity.name}</h2>
            <div className="ml-3 px-2 py-1 rounded-full text-xs bg-gray-800/70">
              {getEntityTypeLabel()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-800">
                <img 
                  src={entity.logo} 
                  alt={entity.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="md:w-2/3">
              <p className="text-gray-300 mb-4">{entity.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {entity.musicStyles.map((style, index) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-800/50 rounded-full text-sm"
                  >
                    {style.replace('-', ' ')}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-400 mr-2" />
                  <span>
                    {entity.location.city}, {entity.location.country}
                    {entity.location.isOnline && ' (Online)'}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Globe size={16} className="text-gray-400 mr-2" />
                  <a 
                    href={entity.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center"
                  >
                    Sitio web oficial
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-4">
                {entity.socialLinks.instagram && (
                  <a 
                    href={entity.socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                )}
                {entity.socialLinks.facebook && (
                  <a 
                    href={entity.socialLinks.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Facebook size={16} />
                  </a>
                )}
                {entity.socialLinks.twitter && (
                  <a 
                    href={entity.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                  </a>
                )}
                {entity.socialLinks.youtube && (
                  <a 
                    href={entity.socialLinks.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Youtube size={16} />
                  </a>
                )}
                {entity.socialLinks.linkedin && (
                  <a 
                    href={entity.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Entity-specific content */}
          {renderEntityContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EntityDetailModal;