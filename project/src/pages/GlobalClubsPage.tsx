import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Filter, MapPin, Building2, Music, Star, ArrowLeft } from 'lucide-react';
import GlobalClubsMap from '../components/clubs/GlobalClubsMap';
import ClubsStats from '../components/clubs/ClubsStats';
import { GLOBAL_CLUBS, GlobalClub, getClubsByCountry, searchClubs } from '../data/globalClubs';

const GlobalClubsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMusicStyle, setSelectedMusicStyle] = useState('');
  const [filteredClubs, setFilteredClubs] = useState<GlobalClub[]>(GLOBAL_CLUBS);
  const [selectedClub, setSelectedClub] = useState<GlobalClub | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'stats'>('map');
  const [showMap, setShowMap] = useState(true);

  // Get unique values for filters
  const countries = [...new Set(GLOBAL_CLUBS.map(club => club.country))].sort();
  const cities = [...new Set(GLOBAL_CLUBS.map(club => club.city))].sort();
  const musicStyles = [...new Set(GLOBAL_CLUBS.flatMap(club => club.musicStyles))].sort();

  // Filter clubs based on current filters
  useEffect(() => {
    let clubs = GLOBAL_CLUBS;

    if (searchTerm) {
      clubs = searchClubs(searchTerm);
    }

    if (selectedCountry) {
      clubs = clubs.filter(club => club.country === selectedCountry);
    }

    if (selectedCity) {
      clubs = clubs.filter(club => club.city === selectedCity);
    }

    if (selectedMusicStyle) {
      clubs = clubs.filter(club => club.musicStyles.includes(selectedMusicStyle));
    }

    setFilteredClubs(clubs);
  }, [searchTerm, selectedCountry, selectedCity, selectedMusicStyle]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedMusicStyle('');
  };

  const handleClubSelect = (club: GlobalClub) => {
    setSelectedClub(club);
    setShowMap(false);
  };

  const handleBackToMap = () => {
    setSelectedClub(null);
    setShowMap(true);
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

  const getPriceRangeText = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'Budget-friendly';
      case '$$': return 'Moderate';
      case '$$$': return 'Expensive';
      case '$$$$': return 'Very Expensive';
      default: return 'Price varies';
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display flex items-center">
          <Globe size={32} className="mr-3 text-indigo-500" />
          Global Clubs Network
        </h1>
        <p className="text-gray-400 mt-2">
          Discover the world's best electronic music venues - your cosmic training grounds
        </p>
      </motion.div>

      {showMap ? (
        <>
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'map'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'list'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clubs, cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Country Filter */}
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity(''); // Reset city when country changes
                }}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
                disabled={!selectedCountry}
              >
                <option value="">All Cities</option>
                {cities
                  .filter(city => !selectedCountry || GLOBAL_CLUBS.some(club => club.city === city && club.country === selectedCountry))
                  .map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
              </select>

              {/* Music Style Filter */}
              <select
                value={selectedMusicStyle}
                onChange={(e) => setSelectedMusicStyle(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">All Music Styles</option>
                {musicStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-400">
              Showing {filteredClubs.length} of {GLOBAL_CLUBS.length} clubs
            </div>
          </motion.div>

          {/* Content */}
          {activeTab === 'map' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-[600px] rounded-xl overflow-hidden"
            >
              <GlobalClubsMap
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                searchQuery={searchTerm}
                onClubSelect={handleClubSelect}
              />
            </motion.div>
          )}

          {activeTab === 'list' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredClubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleClubSelect(club)}
                >
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  
                  <div className="flex items-center text-gray-400 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{club.city}, {club.country}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getRatingStars(club.rating)}
                      <span className="ml-1 text-sm">{club.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Building2 size={14} className="mr-1" />
                      {club.capacity.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {club.musicStyles.slice(0, 2).map(style => (
                      <span
                        key={style}
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                    {club.musicStyles.length > 2 && (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                        +{club.musicStyles.length - 2}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {club.description}
                  </p>
                </motion.div>
              ))}

              {filteredClubs.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium mb-2">No clubs found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search filters
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <ClubsStats />
            </motion.div>
          )}
        </>
      ) : (
        /* Club Profile View */
        selectedClub && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={handleBackToMap}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Map
            </button>

            {/* Club Cover Image */}
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={selectedClub.image}
                alt={selectedClub.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-3xl font-bold text-white">{selectedClub.name}</h1>
                
                <div className="flex items-center mt-2 text-white/80">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{selectedClub.address}</span>
                </div>
              </div>
            </div>

            {/* Club Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Info */}
              <div className="md:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="text-xl font-medium mb-4">About</h2>
                  <p className="text-gray-300 mb-6">{selectedClub.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Building2 size={16} className="mr-2 text-cyan-400" />
                        Capacity
                      </h3>
                      <p className="text-lg">{selectedClub.capacity.toLocaleString()}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <Star size={16} className="mr-2 text-yellow-400" />
                        Rating
                      </h3>
                      <div className="flex items-center">
                        {getRatingStars(selectedClub.rating)}
                        <span className="ml-2">{selectedClub.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Music Styles */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="text-xl font-medium mb-4 flex items-center">
                    <Music size={20} className="mr-2 text-purple-400" />
                    Music Styles
                  </h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedClub.musicStyles.map(style => (
                      <span
                        key={style}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Features */}
                {selectedClub.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-xl"
                  >
                    <h2 className="text-xl font-medium mb-4">Features</h2>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedClub.features.map(feature => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Opening Hours */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h2 className="text-xl font-medium mb-4">Opening Hours</h2>
                  
                  <div className="space-y-2">
                    {Object.entries(selectedClub.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium">{day}</span>
                        <span className="text-gray-400">{hours}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Range */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h3 className="text-lg font-medium mb-3">Price Range</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{selectedClub.priceRange}</div>
                    <div className="text-sm text-gray-400">{getPriceRangeText(selectedClub.priceRange)}</div>
                  </div>
                </motion.div>

                {/* Contact & Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h3 className="text-lg font-medium mb-4">Contact & Links</h3>
                  
                  <div className="space-y-4">
                    {selectedClub.website && (
                      <a
                        href={selectedClub.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary w-full"
                      >
                        Visit Website
                      </a>
                    )}
                    
                    {selectedClub.instagram && (
                      <a
                        href={`https://instagram.com/${selectedClub.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary w-full"
                      >
                        Instagram
                      </a>
                    )}
                    
                    {selectedClub.facebook && (
                      <a
                        href={selectedClub.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary w-full"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <MapPin size={18} className="mr-2 text-orange-400" />
                    Location
                  </h3>
                  
                  <p className="text-gray-300 mb-3">{selectedClub.address}</p>
                  
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedClub.coordinates.lat},${selectedClub.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-full"
                  >
                    View on Google Maps
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
};

export default GlobalClubsPage;