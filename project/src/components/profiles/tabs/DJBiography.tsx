import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Music, Star, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { DJProfile } from '../../../types/profiles';
import { getMusicPlatformAffiliateLink } from '../../../utils/affiliateLinks';
import FieldCompletionIndicator from '../../common/FieldCompletionIndicator';
import { isProfileFieldComplete } from '../../../utils/profileCompletion';

interface DJBiographyProps {
  profile: DJProfile;
  isOwnProfile?: boolean;
  onUpdate?: (data: Partial<DJProfile>) => void;
}

const DJBiography: React.FC<DJBiographyProps> = ({ profile, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    biography: profile.biography || '',
    musicStyle: profile.musicStyle || '',
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
      biography: profile.biography || '',
      musicStyle: profile.musicStyle || '',
      socialLinks: profile.socialLinks || {}
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display neon-text">DJ Biography</h2>
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

      {/* DJ Name & Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
              DJ Name
              {isOwnProfile && !isProfileFieldComplete(profile, 'djName') && (
                <span className="ml-2">
                  <FieldCompletionIndicator 
                    isComplete={false} 
                    fieldName="DJ Name" 
                    importance="high"
                  />
                </span>
              )}
            </label>
            <div className="text-xl font-bold text-cyan-400">{profile.djName}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center">
              Music Style
              {isOwnProfile && !isProfileFieldComplete(profile, 'musicStyle') && (
                <span className="ml-2">
                  <FieldCompletionIndicator 
                    isComplete={false} 
                    fieldName="Music Style" 
                    importance="high"
                  />
                </span>
              )}
            </label>
            {isEditing ? (
              <select
                value={editData.musicStyle}
                onChange={(e) => setEditData({ ...editData, musicStyle: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
              >
                <option value="">Select Style</option>
                <option value="House">House</option>
                <option value="Techno">Techno</option>
                <option value="Trance">Trance</option>
                <option value="Progressive">Progressive</option>
                <option value="Deep House">Deep House</option>
                <option value="Tech House">Tech House</option>
                <option value="Minimal">Minimal</option>
                <option value="Drum & Bass">Drum & Bass</option>
              </select>
            ) : (
              <div className="flex items-center">
                <Music size={16} className="mr-2 text-purple-400" />
                <span className="text-lg">{profile.musicStyle || 'Not specified'}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Biography */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Star size={20} className="mr-2 text-yellow-400" />
          About
          {isOwnProfile && !isProfileFieldComplete(profile, 'biography') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Biography" 
                importance="medium"
              />
            </span>
          )}
        </h3>
        
        {isEditing ? (
          <textarea
            value={editData.biography}
            onChange={(e) => setEditData({ ...editData, biography: e.target.value })}
            placeholder="Tell your story as a DJ..."
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 resize-none"
          />
        ) : (
          <>
            {profile.biography ? (
              <p className="text-gray-300 leading-relaxed">
                {profile.biography}
              </p>
            ) : (
              <div className="p-4 bg-gray-800/50 rounded-lg flex items-center">
                <AlertTriangle size={18} className="text-yellow-500 mr-2" />
                <p className="text-gray-400">
                  No biography available yet. {isOwnProfile && 'Add your story to help fans connect with you.'}
                </p>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Planet & Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <MapPin size={20} className="mr-2 text-indigo-400" />
          Cosmic Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Assigned Planet
            </label>
            <div className="text-lg text-indigo-400">{profile.planetId}</div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Ranking
            </label>
            <div className="text-lg text-yellow-400">
              #{profile.rankingPosition || 'Unranked'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          Music Platforms
          {isOwnProfile && !isProfileFieldComplete(profile, 'socialLinks') && (
            <span className="ml-2">
              <FieldCompletionIndicator 
                isComplete={false} 
                fieldName="Music Platforms" 
                importance="high"
              />
            </span>
          )}
        </h3>
        
        <div className="space-y-4">
          {['soundcloud', 'beatport', 'mixcloud'].map((platform) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-400 mb-2 capitalize flex items-center">
                {platform}
                {isOwnProfile && 
                 !isProfileFieldComplete(profile, `socialLinks.${platform}`) && 
                 platform === 'soundcloud' && (
                  <span className="ml-2">
                    <FieldCompletionIndicator 
                      isComplete={false} 
                      fieldName={platform} 
                      importance={platform === 'soundcloud' ? 'high' : 'medium'}
                    />
                  </span>
                )}
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
                      href={getMusicPlatformAffiliateLink(
                        profile.socialLinks[platform as keyof typeof profile.socialLinks] || '',
                        platform,
                        profile.id
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 flex items-center"
                    >
                      {profile.socialLinks[platform as keyof typeof profile.socialLinks]}
                      <ExternalLink size={14} className="ml-2" />
                    </a>
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <span>Not connected</span>
                      {isOwnProfile && platform === 'soundcloud' && (
                        <span className="ml-2 text-yellow-500 text-xs flex items-center">
                          <AlertTriangle size={12} className="mr-1" />
                          Required for visibility
                        </span>
                      )}
                    </div>
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

export default DJBiography;