import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Music, Video, Star, MapPin, Calendar, Search, ExternalLink, Shield, Check, Building2, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReporterProfile as ReporterProfileType, UserRole } from '../types/profiles';
import ProfileHeader from '../components/profiles/ProfileHeader';
import ProfileTabs from '../components/profiles/ProfileTabs';
import ReporterProfile from '../components/profiles/tabs/ReporterProfile';
import { REPORTER_PROFILES, getAllReporters } from '../data/reporters';
import { format } from 'date-fns';

const ReporterProfilesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('biography');
  const [selectedReporter, setSelectedReporter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState<boolean | null>(null);
  const [reporters, setReporters] = useState<ReporterProfileType[]>([]);

  useEffect(() => {
    // For real user testing, start with empty reporters list
    setReporters([]);
  }, []);

  const filteredReporters = reporters.filter(reporter => {
    const matchesSearch = 
      reporter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporter.assignedDJ.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVerification = 
      filterVerified === null || 
      reporter.isVerified === filterVerified;
    
    return matchesSearch && matchesVerification;
  });

  const selectedReporterProfile = selectedReporter 
    ? reporters.find(reporter => reporter.id === selectedReporter) 
    : null;

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display flex items-center">
          <Camera size={32} className="mr-3 text-green-500" />
          Reporter Profiles
        </h1>
        <p className="text-gray-400 mt-2">
          Explore the official reporters documenting the cosmic music scene
        </p>
      </motion.div>

      {selectedReporterProfile ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedReporter(null)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to all reporters
          </button>

          <ProfileHeader 
            profile={selectedReporterProfile} 
            isOwnProfile={false} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ProfileTabs 
                profile={selectedReporterProfile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className="mt-6">
                {activeTab === 'biography' && (
                  <ReporterProfile 
                    profile={selectedReporterProfile}
                    isOwnProfile={false}
                  />
                )}
                {activeTab === 'dj' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Assigned DJ</h3>
                    
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img 
                          src={`https://api.dicebear.com/7.x/bottts/svg?seed=${selectedReporterProfile.assignedDJ}`}
                          alt="DJ Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{selectedReporterProfile.assignedDJ.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <Link 
                          to={`/profile/${selectedReporterProfile.assignedDJ}`}
                          className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
                        >
                          View DJ Profile
                          <ExternalLink size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'recordings' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Video size={20} className="mr-2 text-green-400" />
                      Recordings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedReporterProfile.recordings.map((recording) => (
                        <div key={recording.id} className="bg-gray-800/50 rounded-lg overflow-hidden">
                          <div className="aspect-video">
                            <iframe
                              src={recording.videoUrl.replace('watch?v=', 'embed/')}
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

                      {selectedReporterProfile.recordings.length === 0 && (
                        <div className="col-span-2 text-center py-12">
                          <Video size={48} className="mx-auto mb-4 text-gray-600" />
                          <h3 className="text-xl font-medium mb-2">No Recordings Yet</h3>
                          <p className="text-gray-400">
                            This reporter hasn't uploaded any recordings yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'guidelines' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Shield size={20} className="mr-2 text-yellow-400" />
                      Guidelines & Rules
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-800/50 rounded-lg">
                        <h4 className="font-medium mb-2">Content Guidelines</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {selectedReporterProfile.guidelines.contentRules.map((rule, index) => (
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
                                selectedReporterProfile.guidelines.violations === 0 ? 'bg-green-500' :
                                selectedReporterProfile.guidelines.violations === 1 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(selectedReporterProfile.guidelines.violations / 3 * 100, 100)}%` }}
                            />
                          </div>
                          <span className="ml-3 text-sm">{selectedReporterProfile.guidelines.violations}/3</span>
                        </div>
                        
                        {selectedReporterProfile.guidelines.lastWarning && (
                          <p className="text-sm text-red-400 mt-2">
                            Last warning: {format(new Date(selectedReporterProfile.guidelines.lastWarning), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'missions' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Active Missions</h3>
                    <p className="text-gray-400">Missions content coming soon...</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Reporter Stats</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Level</div>
                    <div className="text-xl font-bold">{selectedReporterProfile.level}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Beatcoins</div>
                    <div className="text-xl font-bold">{selectedReporterProfile.beatcoins}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Recordings</div>
                    <div className="text-xl font-bold">{selectedReporterProfile.recordings.length}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Verification Status</div>
                    <div className="flex items-center">
                      {selectedReporterProfile.isVerified ? (
                        <div className="flex items-center text-green-400">
                          <Shield size={16} className="mr-1" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-400">
                          <Shield size={16} className="mr-1" />
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Contracted Clubs</h3>
                
                <div className="space-y-3">
                  {selectedReporterProfile.contractedClubs.map((clubId, index) => (
                    <Link
                      key={index}
                      to={`/club/${clubId}`}
                      className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <Building2 size={16} className="text-orange-400 mr-2" />
                      <span>{clubId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                    </Link>
                  ))}

                  {selectedReporterProfile.contractedClubs.length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      No contracted clubs yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reporters by name or assigned DJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select 
                  value={filterVerified === null ? '' : filterVerified ? 'verified' : 'pending'}
                  onChange={(e) => {
                    if (e.target.value === '') setFilterVerified(null);
                    else setFilterVerified(e.target.value === 'verified');
                  }}
                  className="bg-gray-800 border-none rounded-lg text-sm px-3 py-2"
                >
                  <option value="">All Reporters</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Reporters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReporters.map((reporter, index) => (
              <motion.div
                key={reporter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl cursor-pointer hover:border-green-500/50 transition-colors"
                onClick={() => setSelectedReporter(reporter.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img 
                      src={reporter.avatar} 
                      alt={reporter.username}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    {reporter.isVerified && (
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border border-black">
                        <Shield size={12} className="text-black" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">@{reporter.username}</h3>
                    <div className="text-sm text-gray-400">Level {reporter.level}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">Assigned DJ</div>
                  <Link 
                    to={`/profile/${reporter.assignedDJ}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Music size={14} className="mr-1" />
                    {reporter.assignedDJ.split('_').join(' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <ExternalLink size={12} className="ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{reporter.recordings.length}</div>
                    <div className="text-xs text-gray-400">Recordings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{reporter.contractedClubs.length}</div>
                    <div className="text-xs text-gray-400">Clubs</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    reporter.isVerified 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {reporter.isVerified ? 'Verified' : 'Pending'}
                  </div>
                  <div className="text-xs text-gray-400">
                    <Calendar size={12} className="inline mr-1" />
                    Joined {new Date(reporter.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredReporters.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Camera size={48} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-medium mb-2">No Reporters Found</h3>
                <p className="text-gray-400">
                  Try adjusting your search filters
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReporterProfilesPage;