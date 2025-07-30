import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QRCode from 'react-qr-code';
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
  Clock,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Profile, UserRole, DJLevel, RaverLevel, ClubMembership } from '../../types/profiles';

interface DigitalIDCardProps {
  profile: Profile;
}

const DigitalIDCard: React.FC<DigitalIDCardProps> = ({ profile }) => {
  const [qrValue, setQrValue] = useState('');
  const [timestamp, setTimestamp] = useState(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  
  // Generate dynamic QR code that changes every 30 seconds
  useEffect(() => {
    const updateQR = () => {
      const now = Date.now();
      const uniqueValue = `${profile.id}_${now}`;
      setQrValue(uniqueValue);
      setTimestamp(now);
    };
    
    updateQR();
    const interval = setInterval(updateQR, 30000);
    return () => clearInterval(interval);
  }, [profile.id]);

  // QR refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - timestamp) / 1000;
      const remaining = 30 - Math.floor(elapsed);
      setSecondsRemaining(Math.max(0, remaining));
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

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

  const getLevelBadge = () => {
    if (profile.role === UserRole.DJ) {
      const djProfile = profile as any;
      switch (djProfile.level) {
        case DJLevel.MASTER:
          return (
            <div className="relative">
              <Crown className="w-8 h-8 text-yellow-500" />
              <motion.div
                className="absolute inset-0 text-yellow-500"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-8 h-8" />
              </motion.div>
            </div>
          );
        case DJLevel.TECHNIC:
          return (
            <div className="relative">
              <Star className="w-8 h-8 text-indigo-500" />
              <motion.div
                className="absolute inset-0 text-indigo-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-8 h-8" />
              </motion.div>
            </div>
          );
        default:
          return <Shield className="w-8 h-8 text-gray-500" />;
      }
    }
    
    if (profile.role === UserRole.RAVER) {
      const raverProfile = profile as any;
      switch (raverProfile.level) {
        case RaverLevel.COMMANDER:
          return <Crown className="w-8 h-8 text-yellow-500" />;
        case RaverLevel.HUNTER:
          return <Star className="w-8 h-8 text-indigo-500" />;
        default:
          return <Shield className="w-8 h-8 text-gray-500" />;
      }
    }
    
    if (profile.role === UserRole.CLUB) {
      const clubProfile = profile as any;
      switch (clubProfile.membership) {
        case ClubMembership.COMMAND_BASE:
          return <Crown className="w-8 h-8 text-yellow-500" />;
        case ClubMembership.EMBASSY:
          return <Star className="w-8 h-8 text-indigo-500" />;
        default:
          return <Building2 className="w-8 h-8 text-gray-500" />;
      }
    }
    
    return null;
  };

  const getBackgroundGradient = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return 'from-purple-500/20 via-indigo-500/20 to-purple-500/20';
      case UserRole.RAVER:
        return 'from-blue-500/20 via-cyan-500/20 to-blue-500/20';
      case UserRole.CLUB:
        return 'from-orange-500/20 via-yellow-500/20 to-orange-500/20';
      case UserRole.REPORTER:
        return 'from-green-500/20 via-emerald-500/20 to-green-500/20';
      case UserRole.FESTIVAL:
        return 'from-yellow-500/20 via-amber-500/20 to-yellow-500/20';
      default:
        return 'from-gray-900 to-gray-800';
    }
  };

  const getCardTitle = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return (profile as any).djName;
      case UserRole.RAVER:
        return (profile as any).alias;
      case UserRole.CLUB:
        return (profile as any).clubName;
      case UserRole.REPORTER:
        return profile.username;
      case UserRole.FESTIVAL:
        return (profile as any).festivalName;
      default:
        return profile.username;
    }
  };

  return (
    <motion.div 
      className={`relative w-full max-w-sm mx-auto overflow-hidden rounded-xl bg-gradient-to-br ${getBackgroundGradient()} shadow-[0_0_30px_rgba(31,174,255,0.3)] backdrop-blur-sm border border-cyan-500/30`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-[gradient_15s_linear_infinite]" />
      </div>

      {/* Holographic grid effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
      
      {/* Card content */}
      <div className="relative p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-display tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              CosmicBeats
            </h3>
            <div className="flex items-center mt-1">
              {getRoleIcon()}
              <p className="ml-1 text-xs text-indigo-400">Digital Identity</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div 
              className="px-3 py-1 rounded-full bg-black/30 text-xs font-medium border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              Level {profile.level}
            </motion.div>
            <motion.div 
              className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center border border-white/10"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {getLevelBadge()}
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <motion.div 
            className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white/20 mr-4"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={profile.avatar}
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {getCardTitle()}
            </h2>
            <div className="flex items-center space-x-2">
              <motion.div 
                className="px-3 py-1 rounded-full bg-black/30 text-sm border border-white/10 flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <Star size={14} className="mr-1.5 text-yellow-500" />
                {profile.role.toUpperCase()}
              </motion.div>
              {profile.membership.isActive && (
                <motion.div 
                  className="px-3 py-1 rounded-full bg-black/30 text-sm border border-white/10 flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Zap size={14} className="mr-1.5 text-indigo-400" />
                  {profile.membership.tier}
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <motion.div 
            className="p-4 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            whileHover={{ scale: 1.02 }}
          >
            <QRCode 
              value={qrValue}
              size={150}
              level="M"
            />
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <motion.div 
            className="px-3 py-1 rounded-full bg-black/30 border border-white/10 flex items-center"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Clock size={14} className="mr-1.5 text-indigo-400" />
            {secondsRemaining}s
          </motion.div>
          <motion.div 
            className="px-3 py-1 rounded-full bg-black/30 border border-white/10 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar size={14} className="mr-1.5 text-indigo-400" />
            {format(new Date(), 'yyyy-MM-dd')}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl" />
      </div>
    </motion.div>
  );
};

export default DigitalIDCard;