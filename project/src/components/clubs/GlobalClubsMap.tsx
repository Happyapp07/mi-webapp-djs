import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon, divIcon } from 'leaflet';
import { Building2, Star, Users, Music, MapPin, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { GLOBAL_CLUBS, GlobalClub, getClubsByCountry, getClubsByCity, searchClubs, getGlobalStats } from '../../data/globalClubs';
import 'leaflet/dist/leaflet.css';

interface GlobalClubsMapProps {
  selectedCountry?: string;
  selectedCity?: string;
  searchQuery?: string;
  onClubSelect?: (club: GlobalClub) => void;
}

const GlobalClubsMap: React.FC<GlobalClubsMapProps> = ({
  selectedCountry,
  selectedCity,
  searchQuery,
  onClubSelect
}) => {
  const [filteredClubs, setFilteredClubs] = useState<GlobalClub[]>(GLOBAL_CLUBS);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedClub, setSelectedClub] = useState<GlobalClub | null>(null);

  // Custom cluster icon
  const createClusterCustomIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    let size = 'small';
    
    if (count >= 10) size = 'large';
    else if (count >= 5) size = 'medium';
    
    return divIcon({
      html: `<div class="cluster-icon cluster-${size}">
        <span>${count}</span>
      </div>`,
      className: 'custom-marker-cluster',
      iconSize: [40, 40]
    });
  };

  // Custom club marker icon
  const clubIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        <circle cx="12" cy="8" r="2" fill="#ff00ff"/>
      </svg>
    `),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  // Filter clubs based on props
  useEffect(() => {
    let clubs = GLOBAL_CLUBS;

    if (searchQuery) {
      clubs = searchClubs(searchQuery);
    } else if (selectedCity) {
      clubs = getClubsByCity(selectedCity);
    } else if (selectedCountry) {
      clubs = getClubsByCountry(selectedCountry);
    }

    setFilteredClubs(clubs);

    // Update map center and zoom
    if (clubs.length > 0) {
      if (clubs.length === 1) {
        setMapCenter([clubs[0].coordinates.lat, clubs[0].coordinates.lng]);
        setMapZoom(15);
      } else {
        // Calculate center of all clubs
        const avgLat = clubs.reduce((sum, club) => sum + club.coordinates.lat, 0) / clubs.length;
        const avgLng = clubs.reduce((sum, club) => sum + club.coordinates.lng, 0) / clubs.length;
        setMapCenter([avgLat, avgLng]);
        setMapZoom(selectedCity ? 12 : selectedCountry ? 6 : 2);
      }
    } else {
      setMapCenter([20, 0]);
      setMapZoom(2);
    }
  }, [selectedCountry, selectedCity, searchQuery]);

  const handleClubClick = (club: GlobalClub) => {
    setSelectedClub(club);
    if (onClubSelect) {
      onClubSelect(club);
    }
  };

  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'Budget-friendly';
      case '$$': return 'Moderate';
      case '$$$': return 'Expensive';
      case '$$$$': return 'Very Expensive';
      default: return 'Price varies';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full rounded-xl overflow-hidden"
        worldCopyJump={true}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
        >
          {filteredClubs.map(club => (
            <Marker
              key={club.id}
              position={[club.coordinates.lat, club.coordinates.lng]}
              icon={clubIcon}
              eventHandlers={{
                click: () => handleClubClick(club)
              }}
            >
              <Popup className="club-popup" maxWidth={350}>
                <div className="w-80 p-2">
                  {/* Club Image */}
                  <div className="aspect-video rounded-lg overflow-hidden mb-3">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Club Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{club.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" />
                        {club.city}, {club.country}
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {getRatingStars(club.rating)}
                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {club.rating}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={14} className="mr-1" />
                          {club.capacity.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Music Styles */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Music size={14} className="mr-1 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Music Styles</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {club.musicStyles.slice(0, 3).map(style => (
                          <span
                            key={style}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {style}
                          </span>
                        ))}
                        {club.musicStyles.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{club.musicStyles.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign size={14} className="mr-1 text-green-600" />
                        <span className="text-sm text-gray-700">
                          {club.priceRange} - {getPriceRangeText(club.priceRange)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {club.description}
                    </p>

                    {/* Features */}
                    {club.features.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Features</div>
                        <div className="flex flex-wrap gap-1">
                          {club.features.slice(0, 3).map(feature => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex space-x-2 pt-2 border-t border-gray-200">
                      {club.website && (
                        <a
                          href={club.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-indigo-500 text-white text-xs rounded-lg hover:bg-indigo-600 transition-colors"
                        >
                          <ExternalLink size={12} className="mr-1" />
                          Official Website
                        </a>
                      )}
                      {club.instagram && (
                        <a
                          href={`https://instagram.com/${club.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-pink-500 text-white text-xs rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {/* Custom CSS for cluster icons */}
      <style jsx global>{`
        .custom-marker-cluster {
          background: transparent !important;
          border: none !important;
        }
        
        .cluster-icon {
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .cluster-small {
          width: 30px;
          height: 30px;
        }
        
        .cluster-medium {
          width: 35px;
          height: 35px;
        }
        
        .cluster-large {
          width: 40px;
          height: 40px;
        }
        
        .club-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .club-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
        
        .club-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default GlobalClubsMap;