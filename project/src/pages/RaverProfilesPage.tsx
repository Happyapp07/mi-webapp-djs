import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Music, Heart, Star, MapPin, Calendar, Search, ExternalLink, Crown, Check, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RaverProfile, UserRole, RaverLevel } from '../types/profiles';
import ProfileHeader from '../components/profiles/ProfileHeader';
import ProfileTabs from '../components/profiles/ProfileTabs';
import RaverProfileTab from '../components/profiles/tabs/RaverProfile';
import DigitalIDCard from '../components/profiles/DigitalIDCard';

const AlliesProfilesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedAlly, setSelectedAlly] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allies, setAllies] = useState<RaverProfile[]>([]);

  // Generate mock ally profiles
  useEffect(() => {
    const mockAllies: RaverProfile[] = [
      {
        id: 'raver_1',
        username: 'cosmic_explorer',
        email: 'cosmic@example.com',
        role: UserRole.RAVER,
        alias: 'Cosmic Explorer',
        level: RaverLevel.HUNTER,
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=cosmic',
        completionPercentage: 95,
        beatcoins: 3250,
        level: 18,
        createdAt: new Date('2023-08-15'),
        lastActive: new Date(),
        isVerified: true,
        missions: [],
        membership: {
          tier: 'Hunter',
          isActive: true,
          expiresAt: new Date('2025-12-31')
        },
        preferences: {
          musicStyles: ['Techno', 'House', 'Progressive'],
          favoriteDrinks: [
            { id: 'redbull', name: 'Red Bull', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png', category: 'energy', website: 'https://www.redbull.com/' },
            { id: 'heineken', name: 'Heineken', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Heineken-Logo.png', category: 'beer', website: 'https://www.heineken.com/' }
          ],
          behaviors: {
            attendance: 'frequent',
            geoVoting: true,
            consumption: 'moderate'
          }
        },
        socialLinks: {
          instagram: 'https://instagram.com/cosmic_explorer',
          tiktok: 'https://tiktok.com/@cosmic_explorer',
          spotify: 'https://open.spotify.com/user/cosmic_explorer'
        },
        activity: {
          recentCheckins: [
            { id: 'checkin_1', clubId: 'berghain-berlin', date: new Date('2024-04-15'), beatcoinsEarned: 50 },
            { id: 'checkin_2', clubId: 'fabric-london', date: new Date('2024-04-08'), beatcoinsEarned: 45 },
            { id: 'checkin_3', clubId: 'hi-ibiza', date: new Date('2024-03-25'), beatcoinsEarned: 60 }
          ],
          matches: [
            { id: 'match_1', userId: 'dj_1', compatibility: 92, status: 'matched', matchedAt: new Date('2024-04-10') },
            { id: 'match_2', userId: 'raver_2', compatibility: 88, status: 'matched', matchedAt: new Date('2024-04-05') }
          ],
          taggedPhotos: [
            { id: 'photo_1', url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', caption: 'Amazing night at Berghain!', uploadedAt: new Date('2024-04-15'), tags: ['berghain', 'techno'] },
            { id: 'photo_2', url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg', caption: 'Fabric London vibes', uploadedAt: new Date('2024-04-08'), tags: ['fabric', 'house'] }
          ],
          followedClubs: ['berghain-berlin', 'fabric-london', 'hi-ibiza']
        }
      },
      {
        id: 'raver_2',
        username: 'rhythm_hunter',
        email: 'rhythm@example.com',
        role: UserRole.RAVER,
        alias: 'Rhythm Hunter',
        level: RaverLevel.COMMANDER,
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=rhythm',
        completionPercentage: 100,
        beatcoins: 5120,
        level: 25,
        createdAt: new Date('2023-05-10'),
        lastActive: new Date(),
        isVerified: true,
        missions: [],
        membership: {
          tier: 'Commander',
          isActive: true,
          expiresAt: new Date('2025-12-31')
        },
        preferences: {
          musicStyles: ['Drum & Bass', 'Techno', 'Minimal'],
          favoriteDrinks: [
            { id: 'jagermeister', name: 'Jägermeister', logo: 'https://logos-world.net/wp-content/uploads/2020/12/Jagermeister-Logo.png', category: 'spirits', website: 'https://www.jagermeister.com/' },
            { id: 'absolut', name: 'Absolut', logo: 'https://logos-world.net/wp-content/uploads/2020/11/Absolut-Logo.png', category: 'spirits', website: 'https://www.absolut.com/' }
          ],
          behaviors: {
            attendance: 'frequent',
            geoVoting: true,
            consumption: 'heavy'
          }
        },
        socialLinks: {
          instagram: 'https://instagram.com/rhythm_hunter',
          tiktok: 'https://tiktok.com/@rhythm_hunter',
          spotify: 'https://open.spotify.com/user/rhythm_hunter'
        },
        activity: {
          recentCheckins: [
            { id: 'checkin_1', clubId: 'watergate-berlin', date: new Date('2024-04-18'), beatcoinsEarned: 55 },
            { id: 'checkin_2', clubId: 'berghain-berlin', date: new Date('2024-04-11'), beatcoinsEarned: 50 },
            { id: 'checkin_3', clubId: 'rex-club-paris', date: new Date('2024-04-04'), beatcoinsEarned: 45 }
          ],
          matches: [
            { id: 'match_1', userId: 'dj_2', compatibility: 95, status: 'matched', matchedAt: new Date('2024-04-15') },
            { id: 'match_2', userId: 'raver_1', compatibility: 88, status: 'matched', matchedAt: new Date('2024-04-05') },
            { id: 'match_3', userId: 'raver_3', compatibility: 82, status: 'pending', matchedAt: new Date('2024-04-18') }
          ],
          taggedPhotos: [
            { id: 'photo_1', url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', caption: 'Techno night at Watergate', uploadedAt: new Date('2024-04-18'), tags: ['watergate', 'techno'] },
            { id: 'photo_2', url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg', caption: 'Berghain madness', uploadedAt: new Date('2024-04-11'), tags: ['berghain', 'techno'] },
            { id: 'photo_3', url: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg', caption: 'Paris vibes at Rex Club', uploadedAt: new Date('2024-04-04'), tags: ['rex-club', 'techno'] }
          ],
          followedClubs: ['watergate-berlin', 'berghain-berlin', 'rex-club-paris', 'fabric-london', 'hi-ibiza']
        }
      },
      {
        id: 'raver_3',
        username: 'melody_seeker',
        email: 'melody@example.com',
        role: UserRole.RAVER,
        alias: 'Melody Seeker',
        level: RaverLevel.ROOKIE,
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=melody',
        completionPercentage: 75,
        beatcoins: 850,
        level: 8,
        createdAt: new Date('2024-01-20'),
        lastActive: new Date(),
        isVerified: true,
        missions: [],
        membership: {
          tier: 'Explorer',
          isActive: true,
          expiresAt: undefined
        },
        preferences: {
          musicStyles: ['House', 'Deep House', 'Progressive House'],
          favoriteDrinks: [
            { id: 'heineken', name: 'Heineken', logo: 'https://logos-world.net/wp-content/uploads/2020/09/Heineken-Logo.png', category: 'beer', website: 'https://www.heineken.com/' }
          ],
          behaviors: {
            attendance: 'occasional',
            geoVoting: false,
            consumption: 'light'
          }
        },
        socialLinks: {
          instagram: 'https://instagram.com/melody_seeker',
          spotify: 'https://open.spotify.com/user/melody_seeker'
        },
        activity: {
          recentCheckins: [
            { id: 'checkin_1', clubId: 'pacha-ibiza', date: new Date('2024-04-12'), beatcoinsEarned: 40 },
            { id: 'checkin_2', clubId: 'hi-ibiza', date: new Date('2024-03-29'), beatcoinsEarned: 35 }
          ],
          matches: [
            { id: 'match_1', userId: 'dj_3', compatibility: 85, status: 'matched', matchedAt: new Date('2024-04-14') }
          ],
          taggedPhotos: [
            { id: 'photo_1', url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', caption: 'First time at Pacha!', uploadedAt: new Date('2024-04-12'), tags: ['pacha', 'house'] }
          ],
          followedClubs: ['pacha-ibiza', 'hi-ibiza']
        }
      },
      {
        id: 'raver_4',
        username: 'bass_voyager',
        email: 'bass@example.com',
        role: UserRole.RAVER,
        alias: 'Bass Voyager',
        level: RaverLevel.HUNTER,
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=bass',
        completionPercentage: 90,
        beatcoins: 2780,
        level: 16,
        createdAt: new Date('2023-09-05'),
        lastActive: new Date(),
        isVerified: true,
        missions: [],
        membership: {
          tier: 'Hunter',
          isActive: true,
          expiresAt: new Date('2025-09-05')
        },
        preferences: {
          musicStyles: ['Drum & Bass', 'Dubstep', 'Breakbeat'],
          favoriteDrinks: [
            { id: 'redbull', name: 'Red Bull', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png', category: 'energy', website: 'https://www.redbull.com/' },
            { id: 'jagermeister', name: 'Jägermeister', logo: 'https://logos-world.net/wp-content/uploads/2020/12/Jagermeister-Logo.png', category: 'spirits', website: 'https://www.jagermeister.com/' }
          ],
          behaviors: {
            attendance: 'frequent',
            geoVoting: true,
            consumption: 'moderate'
          }
        },
        socialLinks: {
          instagram: 'https://instagram.com/bass_voyager',
          tiktok: 'https://tiktok.com/@bass_voyager',
          spotify: 'https://open.spotify.com/user/bass_voyager'
        },
        activity: {
          recentCheckins: [
            { id: 'checkin_1', clubId: 'fabric-london', date: new Date('2024-04-19'), beatcoinsEarned: 50 },
            { id: 'checkin_2', clubId: 'ministry-of-sound', date: new Date('2024-04-12'), beatcoinsEarned: 45 },
            { id: 'checkin_3', clubId: 'printworks-london', date: new Date('2024-04-05'), beatcoinsEarned: 55 }
          ],
          matches: [
            { id: 'match_1', userId: 'dj_4', compatibility: 90, status: 'matched', matchedAt: new Date('2024-04-17') },
            { id: 'match_2', userId: 'raver_2', compatibility: 85, status: 'matched', matchedAt: new Date('2024-04-10') }
          ],
          taggedPhotos: [
            { id: 'photo_1', url: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg', caption: 'Bass drops at Fabric', uploadedAt: new Date('2024-04-19'), tags: ['fabric', 'dnb'] },
            { id: 'photo_2', url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg', caption: 'Ministry madness', uploadedAt: new Date('2024-04-12'), tags: ['ministry', 'dubstep'] }
          ],
          followedClubs: ['fabric-london', 'ministry-of-sound', 'printworks-london']
        }
      }
    ];
    
    // For real user testing, start with empty allies list
    setAllies([]);
  }, []);

  const filteredAllies = allies.filter(ally => 
    ally.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ally.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ally.preferences.musicStyles.some(style => style.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedAllyProfile = selectedAlly 
    ? allies.find(ally => ally.id === selectedAlly) 
    : null;

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display flex items-center">
          <User size={32} className="mr-3 text-blue-500" />
          Allies Profiles
        </h1>
        <p className="text-gray-400 mt-2">
          Explore the cosmic allies in our universe
        </p>
      </motion.div>

      {selectedAllyProfile ? (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedAlly(null)}
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to all allies
          </button>

          <ProfileHeader 
            profile={selectedAllyProfile} 
            isOwnProfile={false} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ProfileTabs 
                profile={selectedAllyProfile}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className="mt-6">
                {activeTab === 'profile' && (
                  <RaverProfileTab 
                    profile={selectedAllyProfile}
                    isOwnProfile={false}
                  />
                )}
                {activeTab === 'activity' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    
                    <div className="space-y-4">
                      {selectedAllyProfile.activity.recentCheckins.map((checkin, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin size={16} className="text-indigo-400 mr-2" />
                              <span>Checked in at {checkin.clubId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {new Date(checkin.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-green-400">
                            +{checkin.beatcoinsEarned} Beatcoins earned
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'matches' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Musical & Social Matches</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedAllyProfile.activity.matches.map((match, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Heart size={16} className="text-pink-400 mr-2" />
                              <span>Match with {match.userId.split('_')[0] === 'dj' ? 'DJ' : ''} {match.userId.split('_')[1]}</span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              match.status === 'matched' ? 'bg-green-500/20 text-green-400' : 
                              match.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              {new Date(match.matchedAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm">
                              <span className="text-indigo-400">{match.compatibility}%</span> compatibility
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'photos' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Tagged Photos</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedAllyProfile.activity.taggedPhotos.map((photo, index) => (
                        <div key={index} className="bg-gray-800/50 rounded-lg overflow-hidden">
                          <img 
                            src={photo.url} 
                            alt={photo.caption || 'Party photo'} 
                            className="w-full aspect-square object-cover"
                          />
                          <div className="p-3">
                            <p className="text-sm mb-1">{photo.caption}</p>
                            <div className="flex flex-wrap gap-1">
                              {photo.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              {new Date(photo.uploadedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'clubs' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Followed Clubs</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedAllyProfile.activity.followedClubs.map((clubId, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center">
                            <Building2 size={16} className="text-orange-400 mr-2" />
                            <span>{clubId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'beatcoins' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Beatcoins</h3>
                    
                    <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star size={24} className="text-yellow-500 mr-3" />
                          <div>
                            <div className="text-2xl font-bold">{selectedAllyProfile.beatcoins}</div>
                            <div className="text-sm text-gray-400">Total Beatcoins</div>
                          </div>
                        </div>
                        <button className="btn btn-secondary">
                          View History
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium mb-3">Recent Earnings</h4>
                    <div className="space-y-3">
                      {selectedAllyProfile.activity.recentCheckins.map((checkin, index) => (
                        <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin size={16} className="text-indigo-400 mr-2" />
                              <span>Club Check-in: {checkin.clubId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </div>
                            <div className="text-green-400">+{checkin.beatcoinsEarned}</div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(checkin.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'membership' && (
                  <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-medium mb-4">Membership</h3>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg mb-4">
                          <div className="flex items-center">
                            <Star size={24} className="text-indigo-400 mr-3" />
                            <div>
                              <div className="text-xl font-bold">{selectedAllyProfile.membership.tier}</div>
                              <div className="text-sm text-gray-400">
                                {selectedAllyProfile.membership.isActive ? 'Active Membership' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                          {selectedAllyProfile.membership.expiresAt && (
                            <div className="mt-2 text-sm text-gray-400">
                              Expires: {new Date(selectedAllyProfile.membership.expiresAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <h4 className="text-md font-medium mb-2">Membership Benefits</h4>
                        <ul className="space-y-2">
                          {selectedAllyProfile.membership.tier === 'Explorer' && (
                            <>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Geo voting in clubs
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Access to public rankings
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Basic digital card
                              </li>
                            </>
                          )}
                          {selectedAllyProfile.membership.tier === 'Supporter' && (
                            <>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Vote and be voted
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Social rankings
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Upload party photos
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Match and chat with other users
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Supporter card with QR
                              </li>
                            </>
                          )}
                          {selectedAllyProfile.membership.tier === 'Hunter' && (
                            <>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                All Supporter benefits
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                VIP access and skip lines
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Invite a friend
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Exclusive events
                              </li>
                              <li className="flex items-center text-sm">
                                <Check size={16} className="text-green-500 mr-2" />
                                Premium Hunter card
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div className="md:w-64">
                        <DigitalIDCard profile={selectedAllyProfile} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Ally Stats</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Level</div>
                    <div className="text-xl font-bold">{selectedAllyProfile.level}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Beatcoins</div>
                    <div className="text-xl font-bold">{selectedAllyProfile.beatcoins}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Club Check-ins</div>
                    <div className="text-xl font-bold">{selectedAllyProfile.activity.recentCheckins.length}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-1">Matches</div>
                    <div className="text-xl font-bold">{selectedAllyProfile.activity.matches.length}</div>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Music Preferences</h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedAllyProfile.preferences.musicStyles.map((style, index) => (
                    <div key={index} className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400">
                      {style}
                    </div>
                  ))}
                </div>
                
                <h4 className="text-md font-medium mb-2">Favorite Drinks</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedAllyProfile.preferences.favoriteDrinks.map((drink, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg flex flex-col items-center">
                      <img src={drink.logo} alt={drink.name} className="h-8 object-contain mb-2" />
                      <div className="text-sm text-center">{drink.name}</div>
                      {drink.website && (
                        <a 
                          href={drink.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center mt-1"
                        >
                          Official Site
                          <ExternalLink size={10} className="ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl mb-8"
          >
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search allies by name, username or music style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </motion.div>

          {/* Allies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAllies.map((ally, index) => (
              <motion.div
                key={ally.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors"
                onClick={() => setSelectedAlly(ally.id)}
              >
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <img 
                      src={ally.avatar} 
                      alt={ally.alias}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      ally.level === RaverLevel.COMMANDER ? 'bg-yellow-500' :
                      ally.level === RaverLevel.HUNTER ? 'bg-indigo-500' :
                      'bg-gray-500'
                    }`}>
                      {ally.level === RaverLevel.COMMANDER ? (
                        <Crown size={12} className="text-black" />
                      ) : ally.level === RaverLevel.HUNTER ? (
                        <Star size={12} className="text-black" />
                      ) : (
                        <User size={12} className="text-black" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{ally.alias}</h3>
                    <div className="text-sm text-gray-400">@{ally.username}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">Music Styles</div>
                  <div className="flex flex-wrap gap-1">
                    {ally.preferences.musicStyles.map((style, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {style}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{ally.level}</div>
                    <div className="text-xs text-gray-400">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{ally.beatcoins}</div>
                    <div className="text-xs text-gray-400">Beatcoins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{ally.activity.matches.length}</div>
                    <div className="text-xs text-gray-400">Matches</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    ally.membership.tier === 'Hunter' ? 'bg-indigo-500/20 text-indigo-400' :
                    ally.membership.tier === 'Supporter' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {ally.membership.tier}
                  </div>
                  <div className="text-xs text-gray-400">
                    <Calendar size={12} className="inline mr-1" />
                    Joined {new Date(ally.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlliesProfilesPage;