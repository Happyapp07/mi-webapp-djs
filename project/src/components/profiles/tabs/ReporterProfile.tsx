import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, Music, AlertTriangle, Edit3, Save, X, Video, Calendar, ExternalLink, Eye, Plus } from 'lucide-react';
import { ReporterProfile as ReporterProfileType } from '../../../types/profiles';
import { format } from 'date-fns';

interface ReporterProfileProps {
  profile: ReporterProfileType;
  isOwnProfile?: boolean;
  onUpdate?: (data: Partial<ReporterProfileType>) => void;
}

const ReporterProfile: React.FC<ReporterProfileProps> = ({ profile, isOwnProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    assignedDJ: profile.assignedDJ
  });

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      assignedDJ: profile.assignedDJ
    });
    setIsEditing(false);
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const embedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display neon-text">Reporter Profile</h2>
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

      {/* Verification Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-6 rounded-xl ${profile.isVerified ? 'border-green-500/30' : 'border-yellow-500/30'}`}
      >
        <div className="flex items-start">
          {profile.isVerified ? (
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
              <Camera size={24} className="text-green-500" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mr-4">
              <AlertTriangle size={24} className="text-yellow-500" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-bold mb-1">
              {profile.isVerified ? 'Verified Reporter' : 'Pending Verification'}
            </h3>
            <p className="text-gray-400">
              {profile.isVerified 
                ? 'You are a verified reporter and can upload content for your assigned DJ.'
                : 'Your verification is pending. Please follow the guidelines and wait for admin approval.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Assigned DJ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Music size={20} className="mr-2 text-purple-400" />
          Assigned DJ
        </h3>
        
        {isEditing ? (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              DJ ID
            </label>
            <input
              type="text"
              value={editData.assignedDJ}
              onChange={(e) => setEditData({
                ...editData,
                assignedDJ: e.target.value
              })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
              placeholder="Enter DJ ID"
            />
            <p className="text-sm text-gray-400 mt-2">
              Note: You can only report for one DJ at a time. Changes require admin approval.
            </p>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.assignedDJ}`}
                alt="DJ Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-lg font-bold">DJ {profile.assignedDJ}</div>
              <a 
                href={`/profile/${profile.assignedDJ}`}
                className="text-indigo-400 hover:text-indigo-300 text-sm"
              >
                View DJ Profile
              </a>
            </div>
          </div>
        )}
      </motion.div>

      {/* Recordings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Video size={20} className="mr-2 text-green-400" />
          Recordings
        </h3>
        
        {profile.recordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.recordings.map((recording) => (
              <div key={recording.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl(recording.videoUrl)}
                    title={recording.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                
                <div className="p-4">
                  <h4 className="font-bold mb-1">{recording.title}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {format(new Date(recording.uploadDate), 'MMM d, yyyy')}
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-1" />
                      {recording.views} views
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className={`px-2 py-1 rounded text-xs ${recording.approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {recording.approved ? 'Approved' : 'Pending Approval'}
                    </div>
                    
                    <a
                      href={recording.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                    >
                      YouTube
                      <ExternalLink size={12} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Video size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">No Recordings Yet</h3>
            <p className="text-gray-400">
              You haven't uploaded any recordings for your assigned DJ.
            </p>
            {isOwnProfile && (
              <button className="btn btn-primary mt-4">
                <Plus size={16} className="mr-2" />
                Upload Recording
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6 rounded-xl"
      >
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <AlertTriangle size={20} className="mr-2 text-yellow-400" />
          Guidelines & Rules
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2">Content Guidelines</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {profile.guidelines.contentRules.map((rule, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-medium mb-2">Violations</h4>
            <div className="flex items-center">
              <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    profile.guidelines.violations === 0 ? 'bg-green-500' :
                    profile.guidelines.violations === 1 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(profile.guidelines.violations / 3 * 100, 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm">{profile.guidelines.violations}/3</span>
            </div>
            
            {profile.guidelines.lastWarning && (
              <p className="text-sm text-red-400 mt-2">
                Last warning: {format(new Date(profile.guidelines.lastWarning), 'MMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReporterProfile;