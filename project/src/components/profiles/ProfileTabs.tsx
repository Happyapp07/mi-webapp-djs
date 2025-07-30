import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Music, 
  Camera, 
  BarChart3, 
  Calendar, 
  Award, 
  Settings,
  Users,
  MapPin,
  Image,
  Zap,
  Trophy,
  Target
} from 'lucide-react';
import { Profile, UserRole } from '../../types/profiles';

interface ProfileTabsProps {
  profile: Profile;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ profile, activeTab, onTabChange }) => {
  const getDJTabs = () => [
    { id: 'biography', label: 'Biography', icon: <User size={16} /> },
    { id: 'equipment', label: 'Equipment & Software', icon: <Settings size={16} /> },
    { id: 'sessions', label: 'Sessions', icon: <Music size={16} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 size={16} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
    { id: 'reporter', label: 'Reporter', icon: <Camera size={16} /> },
    { id: 'missions', label: 'Missions', icon: <Target size={16} /> },
    { id: 'membership', label: 'Membership', icon: <Award size={16} /> }
  ];

  const getAllyTabs = () => [
    { id: 'profile', label: 'Social Profile', icon: <User size={16} /> },
    { id: 'activity', label: 'Recent Activity', icon: <Zap size={16} /> },
    { id: 'matches', label: 'Musical & Social Matches', icon: <Users size={16} /> },
    { id: 'photos', label: 'Tagged Photos', icon: <Image size={16} /> },
    { id: 'clubs', label: 'Followed Clubs', icon: <MapPin size={16} /> },
    { id: 'beatcoins', label: 'Beatcoins', icon: <Award size={16} /> },
    { id: 'missions', label: 'Missions', icon: <Target size={16} /> },
    { id: 'membership', label: 'Membership', icon: <Award size={16} /> }
  ];

  const getClubTabs = () => [
    { id: 'info', label: 'General Info', icon: <User size={16} /> },
    { id: 'crew', label: 'Assigned Crew', icon: <Users size={16} /> },
    { id: 'events', label: 'Past & Upcoming Events', icon: <Calendar size={16} /> },
    { id: 'stats', label: 'Attendance Stats', icon: <BarChart3 size={16} /> },
    { id: 'ranking', label: 'Club Ranking', icon: <Trophy size={16} /> },
    { id: 'gallery', label: 'Media Gallery', icon: <Image size={16} /> },
    { id: 'campaigns', label: 'Active Campaigns', icon: <Zap size={16} /> }
  ];

  const getReporterTabs = () => [
    { id: 'biography', label: 'Biography', icon: <User size={16} /> },
    { id: 'dj', label: 'Assigned DJ', icon: <Music size={16} /> },
    { id: 'recordings', label: 'Recordings', icon: <Camera size={16} /> },
    { id: 'guidelines', label: 'Guidelines & Verification', icon: <Award size={16} /> },
    { id: 'missions', label: 'Active Missions', icon: <Target size={16} /> }
  ];

  const getFestivalTabs = () => [
    { id: 'details', label: 'General Details', icon: <User size={16} /> },
    { id: 'djs', label: 'Selected DJs', icon: <Music size={16} /> },
    { id: 'stats', label: 'Statistics', icon: <BarChart3 size={16} /> },
    { id: 'ranking', label: 'Ranking & Results', icon: <Trophy size={16} /> }
  ];

  const getTabs = () => {
    switch (profile.role) {
      case UserRole.DJ:
        return getDJTabs();
      case UserRole.RAVER:
        return getAllyTabs();
      case UserRole.CLUB:
        return getClubTabs();
      case UserRole.REPORTER:
        return getReporterTabs();
      case UserRole.FESTIVAL:
        return getFestivalTabs();
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-cyan-500/30">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      
      <div className="relative z-10">
        {/* Desktop Tabs */}
        <div className="hidden md:flex border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
              
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden p-4 border-b border-gray-800">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;