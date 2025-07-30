import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Music, 
  Building2, 
  Camera, 
  Trophy,
  Star,
  Shield,
  Crown,
  Zap,
  MapPin,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Radio,
  GraduationCap,
  ShoppingBag
} from 'lucide-react';
import { Profile, UserRole, DJLevel, RaverLevel, ClubMembership } from '../../types/profiles';
import FieldCompletionIndicator from '../common/FieldCompletionIndicator';
import { isProfileFieldComplete } from '../../utils/profileCompletion';
import EntityRecommendations from '../entity/EntityRecommendations';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isOwnProfile, onEdit }) => {
  const getRoleIcon = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return <Music className="w-5 h-5 text-indigo-400" />;
      case UserRole.RAVER:
        return <User className="w-5 h-5 text-blue-400" />;
      case UserRole.CLUB:
        return <Building2 className="w-5 h-5 text-orange-400" />;
      case UserRole.REPORTER:
        return <Camera className="w-5 h-5 text-green-400" />;
      case UserRole.FESTIVAL:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getRoleColor = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return 'text-purple-400 bg-purple-500/20 border border-purple-500/30';
      case UserRole.RAVER:
        return 'text-blue-400 bg-blue-500/20 border border-blue-500/30';
      case UserRole.CLUB:
        return 'text-orange-400 bg-orange-500/20 border border-orange-500/30';
      case UserRole.REPORTER:
        return 'text-green-400 bg-green-500/20 border border-green-500/30';
      case UserRole.FESTIVAL:
        return 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30';
    }
  };

  const getLevelBadge = () => {
    if (profile.role === UserRole.DJ) {
      const djProfile = profile as any;
      const levelColors = {
        [DJLevel.PIONEER]: 'text-gray-400 bg-gray-500/20 border border-gray-500/30',
        [DJLevel.TECHNIC]: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
        [DJLevel.MASTER]: 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
      };
      return (
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[djProfile.level]}`}>
          {djProfile.level}
        </div>
      );
    }
    
    if (profile.role === UserRole.RAVER) {
      const allyProfile = profile as any;
      const levelColors = {
        [RaverLevel.ROOKIE]: 'text-gray-400 bg-gray-500/20 border border-gray-500/30',
        [RaverLevel.HUNTER]: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
        [RaverLevel.COMMANDER]: 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
      };
      return (
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[allyProfile.level]}`}>
          {allyProfile.level}
        </div>
      );
    }

    if (profile.role === UserRole.CLUB) {
      const clubProfile = profile as any;
      const membershipColors = {
        [ClubMembership.RECRUIT]: 'text-gray-400 bg-gray-500/20 border border-gray-500/30',
        [ClubMembership.EMBASSY]: 'text-blue-400 bg-blue-500/20 border border-blue-500/30',
        [ClubMembership.COMMAND_BASE]: 'text-yellow-400 bg-yellow-500/20 border border-yellow-500/30'
      };
      return (
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${membershipColors[clubProfile.membership]}`}>
          {clubProfile.membership}
        </div>
      );
    }

    return null;
  };

  const getDisplayName = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return (profile as any).djName;
      case UserRole.RAVER:
        return (profile as any).alias;
      case UserRole.CLUB:
        return (profile as any).clubName;
      case UserRole.FESTIVAL:
        return (profile as any).festivalName;
      default:
        return profile.username;
    }
  };

  const getRoleLabel = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return "DJ";
      case UserRole.RAVER:
        return "ALLY";
      case UserRole.CLUB:
        return "CLUB";
      case UserRole.REPORTER:
        return "REPORTER";
      case UserRole.FESTIVAL:
        return "FESTIVAL";
      default:
        return profile.role.toUpperCase();
    }
  };

  // Check if display name is complete
  const isNameComplete = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return isProfileFieldComplete(profile, 'djName');
      case UserRole.RAVER:
        return isProfileFieldComplete(profile, 'alias');
      case UserRole.CLUB:
        return isProfileFieldComplete(profile, 'clubName');
      case UserRole.FESTIVAL:
        return isProfileFieldComplete(profile, 'festivalName');
      default:
        return true;
    }
  };

  // Get music styles for entity recommendations
  const getMusicStyles = (): string[] => {
    switch (profile.role) {
      case UserRole.DJ:
        return [(profile as any).musicStyle];
      case UserRole.RAVER:
        return (profile as any).preferences?.musicStyles || [];
      case UserRole.CLUB:
        return [(profile as any).dominantStyle];
      default:
        return [];
    }
  };

  // Get location for entity recommendations
  const getLocation = () => {
    if (profile.role === UserRole.CLUB || profile.role === UserRole.FESTIVAL) {
      return (profile as any).location;
    }
    return undefined;
  };

  return (
    <div className="relative">
      {/* Cover Background */}
      <div className="h-48 w-full rounded-xl overflow-hidden mb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
          <div className="absolute inset-0 hologram-grid opacity-30"></div>
          <div className="absolute inset-0 scanner-effect"></div>
        </div>
      </div>

      {/* Profile Card */}
      <motion.div 
        className="glass-card p-6 rounded-xl relative -mt-16 border border-cyan-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar with completion ring */}
            <div className="relative">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-cyan-500/50">
                <img 
                  src={profile.avatar}
                  alt={getDisplayName()}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-cyan-400/20"></div>
              </div>
              
              {/* Completion Ring */}
              <div className="absolute -inset-2">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-gray-700"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ 
                      strokeDashoffset: 2 * Math.PI * 45 * (1 - profile.completionPercentage / 100) 
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className={`${
                      profile.completionPercentage >= 100 ? 'text-green-500' :
                      profile.completionPercentage >= 75 ? 'text-yellow-500' :
                      profile.completionPercentage >= 50 ? 'text-orange-500' :
                      'text-red-500'
                    } transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-mono ${
                    profile.completionPercentage >= 100 ? 'text-green-400' :
                    profile.completionPercentage >= 75 ? 'text-yellow-400' :
                    profile.completionPercentage >= 50 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {profile.completionPercentage}%
                  </span>
                </div>
              </div>

              {/* Verification Badge */}
              {profile.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <Shield size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-display font-bold neon-text mb-2 flex items-center">
                    {getDisplayName()}
                    <span className="ml-2 text-sm px-2 py-0.5 rounded-full bg-gray-800/70 text-gray-300">
                      {getRoleLabel()}
                    </span>
                    {isOwnProfile && !isNameComplete() && (
                      <span className="ml-2">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Name" 
                          importance="high"
                        />
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor()}`}>
                      {getRoleIcon()}
                      <span className="ml-2">{profile.role}</span>
                    </div>
                    {getLevelBadge()}
                  </div>
                  <p className="text-gray-400 text-sm">@{profile.username}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-center glassmorphism-card px-3 py-2 rounded-lg">
                    <div className="text-xl font-bold text-cyan-400">{profile.beatcoins}</div>
                    <div className="text-xs text-gray-400">Beatcoins</div>
                  </div>
                  <div className="text-center glassmorphism-card px-3 py-2 rounded-lg">
                    <div className="text-xl font-bold text-purple-400">{profile.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                  {profile.role === UserRole.DJ && (
                    <div className="text-center glassmorphism-card px-3 py-2 rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">
                        {(profile as any).rankingPosition || '--'}
                      </div>
                      <div className="text-xs text-gray-400">Rank</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Role-specific info */}
              {profile.role === UserRole.DJ && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Music size={14} className="mr-1" />
                    {(profile as any).musicStyle}
                    {isOwnProfile && !isProfileFieldComplete(profile, 'musicStyle') && (
                      <span className="ml-1">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Music Style" 
                          importance="high"
                        />
                      </span>
                    )}
                  </div>
                  {(profile as any).planetId && (
                    <div className="flex items-center">
                      <Star size={14} className="mr-1" />
                      Planet {(profile as any).planetId}
                    </div>
                  )}
                </div>
              )}

              {profile.role === UserRole.CLUB && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {(profile as any).location?.city}, {(profile as any).location?.country}
                    {isOwnProfile && !isProfileFieldComplete(profile, 'location') && (
                      <span className="ml-1">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Location" 
                          importance="high"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {(profile as any).capacity || '?'} capacity
                    {isOwnProfile && !isProfileFieldComplete(profile, 'capacity') && (
                      <span className="ml-1">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Capacity" 
                          importance="high"
                        />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {profile.role === UserRole.FESTIVAL && (
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {(profile as any).dates?.start ? new Date((profile as any).dates.start).toLocaleDateString() : '?'}
                    {isOwnProfile && !isProfileFieldComplete(profile, 'dates') && (
                      <span className="ml-1">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Dates" 
                          importance="high"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {(profile as any).location?.city || '?'}
                    {isOwnProfile && !isProfileFieldComplete(profile, 'location') && (
                      <span className="ml-1">
                        <FieldCompletionIndicator 
                          isComplete={false} 
                          fieldName="Location" 
                          importance="high"
                        />
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                {isOwnProfile ? (
                  <button onClick={onEdit} className="glassmorphism-primary-button px-6 py-2.5">
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button className="glassmorphism-primary-button px-6 py-2.5">
                      Connect
                    </button>
                    <button className="glassmorphism-button px-6 py-2.5">
                      Message
                    </button>
                  </>
                )}
                
                {profile.role === UserRole.DJ && (profile as any).socialLinks?.soundcloud && (
                  <a 
                    href={(profile as any).socialLinks.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glassmorphism-button px-6 py-2.5 flex items-center"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    SoundCloud
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Membership Status */}
          {profile.membership.isActive && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown size={20} className="text-yellow-500 mr-2" />
                  <span className="font-medium">{profile.membership.tier} Member</span>
                </div>
                {profile.membership.expiresAt && (
                  <span className="text-sm text-gray-400">
                    Expires {new Date(profile.membership.expiresAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Incomplete Profile Warning (only for own profile) */}
          {isOwnProfile && profile.completionPercentage < 100 && (
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 flex items-start">
              <AlertTriangle size={18} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-500 font-medium">Your profile is incomplete</p>
                <p className="text-gray-300">Complete your profile to unlock rewards and enhance your visibility.</p>
                {onEdit && (
                  <button 
                    onClick={onEdit}
                    className="text-indigo-400 hover:text-indigo-300 mt-1"
                  >
                    Complete now →
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Entity Recommendations */}
          <div className="mt-6">
            <EntityRecommendations 
              userType={profile.role.toLowerCase()}
              musicStyles={getMusicStyles()}
              location={getLocation()}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileHeader;