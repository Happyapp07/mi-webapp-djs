import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Music, Edit3, Save, X, Instagram, ExternalLink } from 'lucide-react';
import { RaverProfile as RaverProfileType, DrinkBrand } from '../../../types/profiles';
import { getBrandAffiliateLink } from '../../../utils/affiliateLinks';
import { getSocialAffiliateLink } from '../../../utils/affiliateLinks';
import FieldCompletionIndicator from '../../common/FieldCompletionIndicator';
import { isProfileFieldComplete } from '../../../utils/profileCompletion';

interface RaverProfileProps {
  profile: RaverProfileType;
  isOwnProfile?: boolean;
  onUpdate?: (data: Partial<RaverProfileType>) => void;
}

// Mock drink brands data
const DRINK_BRANDS: DrinkBrand[] = [
  { id: 'redbull', name: 'Red Bull', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png', category: 'energy', website: 'https://www.redbull.com/' },
  { id: 'jagermeister', name: 'Jägermeister', logo: 'https://logos-world.net/wp-content/uploads/2020/12/Jagermeister-Logo.png', category: 'spirits', website: 'https://www.jagermeister.com/' },
  { id: 'heineken', name: 'Heineken', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Heineken-Logo.png', category: 'beer', website: 'https://www.heineken.com/' },
  { id: 'absolut', name: 'Absolut', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Absolut-Logo.png', category: 'spirits', website: 'https://www.absolut.com/' }
];

const AllyProfile: React.FC<RaverProfileProps> = ({ profile, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    preferences: profile.preferences || {
      musicStyles: [],
      favoriteDrinks: [],
      behaviors: {
        attendance: 'occasional',
        geoVoting: false,
        consumption: 'moderate'
      }
    },
    socialLinks: profile.socialLinks || {}
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      preferences: profile.preferences || {
        musicStyles: [],
        favoriteDrinks: [],
        behaviors: {
          attendance: 'occasional',
          geoVoting: false,
          consumption: 'moderate'
        }
      },
      socialLinks: profile.socialLinks || {}
    });
    setIsEditing(false);
  };

  const toggleMusicStyle = (style: string) => {
    const currentStyles = editData.preferences.musicStyles || [];
    if (currentStyles.includes(style)) {
      setEditData({
        ...editData,
        preferences: {
          ...editData.preferences,
          musicStyles: currentStyles.filter(s => s !== style)
        }
      });
    } else {
      setEditData({
        ...editData,
        preferences: {
          ...editData.preferences,
          musicStyles: [...currentStyles, style]
        }
      });
    }
  };

  const toggleDrink = (drinkId: string) => {
    const currentDrinks = editData.preferences.favoriteDrinks || [];
    const drinkExists = currentDrinks.some(d => d.id === drinkId);
    
    if (drinkExists) {
      setEditData({
        ...editData,
        preferences: {
          ...editData.preferences,
          favoriteDrinks: currentDrinks.filter(d => d.id !== drinkId)
        }
      });
    } else {
      const drink = DRINK_BRANDS.find(d => d.id === drinkId);
      if (drink) {
        setEditData({
          ...editData,
          preferences: {
            ...editData.preferences,
            favoriteDrinks: [...currentDrinks, drink]
          }
        });
      }
    }
  };

  const userRole = 'ally';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display neon-text">Ally Profile</h2>
        {isOwnProfile && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save size={16} className="mr-2" />
                  Save
                </button>
                <button onClick={handleCancel} className="btn btn-secondary">
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                <Edit3 size={16} className="mr-2" />
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <User size={20} className="mr-2 text-blue-400" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
              Alias
              {isOwnProfile && !isProfileFieldComplete(profile, 'alias') && (
                <span className="ml-2">
                  <FieldCompletionIndicator 
                    isComplete={false} 
                    fieldName="Alias" 
                    importance="high"
                  />
                </span>
              )}
            </label>
            <div className="text-xl font-bold text-blue-400">{profile.alias || 'Not set'}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Level
            </label>
            <div className="text-xl font-bold text-yellow-400">{profile.level}</div>
          </div>
        </div>
      </motion.div>

      {/* Music Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Music size={20} className="mr-2 text-purple-400" />
          Music Preferences
          {isOwnProfile && !isProfileFieldComplete(profile, 'preferences.musicStyles') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Music Styles" 
                importance="high"
              />
            </span>
          )}
        </h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['House', 'Techno', 'Trance', 'Drum & Bass', 'Progressive', 'Deep House', 'Tech House', 'Minimal'].map(style => (
              <button
                key={style}
                onClick={() => toggleMusicStyle(style)}
                className={`p-3 rounded-lg text-center transition-all ${
                  editData.preferences.musicStyles.includes(style)
                    ? 'bg-purple-500/20 border-2 border-purple-500'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-purple-500/50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.preferences.musicStyles.map(style => (
              <div key={style} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400">
                {style}
              </div>
            ))}
            {profile.preferences.musicStyles.length === 0 && (
              <p className="text-gray-400">No music preferences set</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Favorite Drinks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Favorite Drinks
          {isOwnProfile && !isProfileFieldComplete(profile, 'preferences.favoriteDrinks') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Favorite Drinks" 
                importance="medium"
              />
            </span>
          )}
        </h3>
        
        {isEditing ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DRINK_BRANDS.map(drink => {
              const isSelected = editData.preferences.favoriteDrinks.some(d => d.id === drink.id);
              return (
                <button
                  key={drink.id}
                  onClick={() => toggleDrink(drink.id)}
                  className={`p-4 rounded-lg flex flex-col items-center transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500'
                      : 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-500/50'
                  }`}
                >
                  <img src={drink.logo} alt={drink.name} className="h-12 object-contain mb-2" />
                  <span className="text-sm">{drink.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.preferences.favoriteDrinks.map(drink => (
              <div key={drink.id} className="p-4 bg-gray-800/50 rounded-lg flex flex-col items-center">
                <img src={drink.logo} alt={drink.name} className="h-12 object-contain mb-2" />
                <div className="text-center">
                  <span className="text-sm">{drink.name}</span>
                  {drink.website && (
                    <a 
                      href={getBrandAffiliateLink({
                        id: drink.id,
                        name: drink.name,
                        logo: drink.logo,
                        type: 'drink',
                        website: drink.website,
                        aliases: [drink.name.toLowerCase()]
                      }, userRole)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                    >
                      Official Site
                      <ExternalLink size={10} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            {profile.preferences.favoriteDrinks.length === 0 && (
              <p className="text-gray-400 col-span-full">No favorite drinks set</p>
            )}
          </div>
        )}
      </motion.div>

      {/* Behavior Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Party Behavior
          {isOwnProfile && !isProfileFieldComplete(profile, 'preferences.behaviors') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Party Behavior" 
                importance="medium"
              />
            </span>
          )}
        </h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Attendance Frequency
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['rare', 'occasional', 'frequent'].map(option => (
                  <button
                    key={option}
                    onClick={() => setEditData({
                      ...editData,
                      preferences: {
                        ...editData.preferences,
                        behaviors: {
                          ...editData.preferences.behaviors,
                          attendance: option as any
                        }
                      }
                    })}
                    className={`p-3 rounded-lg text-center capitalize transition-all ${
                      editData.preferences.behaviors.attendance === option
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Geo Voting
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      behaviors: {
                        ...editData.preferences.behaviors,
                        geoVoting: true
                      }
                    }
                  })}
                  className={`p-3 rounded-lg text-center transition-all ${
                    editData.preferences.behaviors.geoVoting
                      ? 'bg-green-500/20 border-2 border-green-500'
                      : 'bg-gray-800/50 border-2 border-gray-700 hover:border-green-500/50'
                  }`}
                >
                  Enabled
                </button>
                <button
                  onClick={() => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      behaviors: {
                        ...editData.preferences.behaviors,
                        geoVoting: false
                      }
                    }
                  })}
                  className={`p-3 rounded-lg text-center transition-all ${
                    !editData.preferences.behaviors.geoVoting
                      ? 'bg-red-500/20 border-2 border-red-500'
                      : 'bg-gray-800/50 border-2 border-gray-700 hover:border-red-500/50'
                  }`}
                >
                  Disabled
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Consumption Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'moderate', 'heavy'].map(option => (
                  <button
                    key={option}
                    onClick={() => setEditData({
                      ...editData,
                      preferences: {
                        ...editData.preferences,
                        behaviors: {
                          ...editData.preferences.behaviors,
                          consumption: option as any
                        }
                      }
                    })}
                    className={`p-3 rounded-lg text-center capitalize transition-all ${
                      editData.preferences.behaviors.consumption === option
                        ? 'bg-blue-500/20 border-2 border-blue-500'
                        : 'bg-gray-800/50 border-2 border-gray-700 hover:border-blue-500/50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Attendance</div>
              <div className="text-lg capitalize">{profile.preferences.behaviors.attendance}</div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Geo Voting</div>
              <div className="text-lg">{profile.preferences.behaviors.geoVoting ? 'Enabled' : 'Disabled'}</div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm font-medium text-gray-400 mb-2">Consumption</div>
              <div className="text-lg capitalize">{profile.preferences.behaviors.consumption}</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Social Links
          {isOwnProfile && !isProfileFieldComplete(profile, 'socialLinks') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Social Links" 
                importance="low"
              />
            </span>
          )}
        </h3>
        
        <div className="space-y-4">
          {['instagram', 'tiktok', 'spotify'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-400 mb-2 capitalize">
                {platform}
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={editData.socialLinks[platform as keyof typeof editData.socialLinks] || ''}
                  onChange={(e) => setEditData({
                    ...editData,
                    socialLinks: {
                      ...editData.socialLinks,
                      [platform]: e.target.value
                    }
                  })}
                  placeholder={`https://${platform}.com/your-profile`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
                />
              ) : (
                <div>
                  {profile.socialLinks?.[platform as keyof typeof profile.socialLinks] ? (
                    <a
                      href={getSocialAffiliateLink(
                        profile.socialLinks[platform as keyof typeof profile.socialLinks] || '',
                        platform,
                        userRole
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      {platform === 'instagram' && <Instagram size={16} className="mr-2" />}
                      {profile.socialLinks[platform as keyof typeof profile.socialLinks]}
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  ) : (
                    <span className="text-gray-500">Not connected</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AllyProfile;