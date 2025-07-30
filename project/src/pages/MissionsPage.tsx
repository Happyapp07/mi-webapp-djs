import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle, Clock, Ticket, Users, Map, Award, Gift } from 'lucide-react';
import { Mission, MissionRequirement } from '../types';
import { useAuthStore } from '../stores/authStore';

const MissionsPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  
  // Generate mock missions
  useEffect(() => {
    // Basic missions for real users
    const basicMissions: Mission[] = [
      {
        id: 'mission1',
        name: 'Complete Your Profile',
        description: 'Fill out your profile information to get started',
        requirements: [
          { type: 'profile', count: 1, currentCount: 0 }
        ],
        reward: 50,
        status: 'active'
      },
      {
        id: 'mission2',
        name: 'First Steps',
        description: 'Explore the platform and discover its features',
        requirements: [
          { type: 'explore', count: 1, currentCount: 0 }
        ],
        reward: 25,
        status: 'active'
      }
    ];
    
    const completedMissions: Mission[] = [];
    
    setActiveMissions(basicMissions);
    setCompletedMissions(completedMissions);
  }, []);
  
  // Calculate progress for a mission
  const getProgress = (requirements: MissionRequirement[]): number => {
    if (requirements.length === 0) return 0;
    
    const totalRequired = requirements.reduce((sum, req) => sum + req.count, 0);
    const totalCompleted = requirements.reduce((sum, req) => sum + req.currentCount, 0);
    
    return Math.round((totalCompleted / totalRequired) * 100);
  };
  
  // Complete a mission (mock functionality)
  const completeMission = (mission: Mission) => {
    // Update requirements to show progress
    const updatedMission = {
      ...mission,
      requirements: mission.requirements.map(req => ({
        ...req,
        currentCount: Math.min(req.currentCount + 1, req.count)
      }))
    };
    
    // Check if all requirements are met
    const allComplete = updatedMission.requirements.every(req => req.currentCount >= req.count);
    
    if (allComplete) {
      // Move to completed
      setActiveMissions(activeMissions.filter(m => m.id !== mission.id));
      setCompletedMissions([
        ...completedMissions,
        { ...updatedMission, status: 'completed' as const }
      ]);
      
      // Add reward to user
      if (user) {
        updateProfile({
          beatcoins: user.beatcoins + mission.reward
        });
      }
    } else {
      // Just update progress
      setActiveMissions(activeMissions.map(m => 
        m.id === mission.id ? updatedMission : m
      ));
    }
  };
  
  // Get icon for mission type
  const getMissionIcon = (mission: Mission) => {
    const requirement = mission.requirements[0]?.type;
    
    switch (requirement) {
      case 'checkin':
        return <Map size={20} />;
      case 'vote':
        return <Users size={20} />;
      case 'event':
        return <Ticket size={20} />;
      case 'profile':
        return <Award size={20} />;
      default:
        return <Zap size={20} />;
    }
  };
  
  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display flex items-center">
          <Zap size={24} className="mr-2 text-indigo-500" />
          Missions
        </h1>
        <p className="text-gray-400 mt-1">
          Complete missions to earn BeatCoins and unlock achievements
        </p>
      </div>
      
      {/* Active Missions */}
      <div className="mb-8">
        <h2 className="text-xl font-display mb-4">Active Missions</h2>
        
        <div className="space-y-4">
          {activeMissions.map((mission, index) => {
            const progress = getProgress(mission.requirements);
            
            return (
              <motion.div 
                key={mission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg flex items-center">
                      <span className="w-8 h-8 rounded-full bg-indigo-900/30 flex items-center justify-center mr-2 text-indigo-400">
                        {getMissionIcon(mission)}
                      </span>
                      {mission.name}
                    </h3>
                    <div className="flex items-center text-sm bg-indigo-900/30 px-2 py-1 rounded-full">
                      <Gift size={14} className="mr-1" />
                      {mission.reward} BC
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 ml-10">{mission.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-400">Progress</div>
                        <div className="text-xs text-gray-400">{progress}%</div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-800">
                        <motion.div 
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Requirements List */}
                  <div className="space-y-2 mb-4">
                    {mission.requirements.map((req, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${req.currentCount >= req.count ? 'bg-green-500' : 'bg-gray-700'}`}>
                          {req.currentCount >= req.count ? (
                            <CheckCircle size={12} />
                          ) : null}
                        </div>
                        <span className={req.currentCount >= req.count ? 'line-through text-gray-500' : ''}>
                          {req.type === 'checkin' && 'Check in to '}
                          {req.type === 'vote' && 'Vote for '}
                          {req.type === 'event' && 'Attend '}
                          {req.type === 'profile' && 'Complete '}
                          {req.currentCount}/{req.count}
                          {req.type === 'checkin' && ' different clubs'}
                          {req.type === 'vote' && ' different DJs'}
                          {req.type === 'event' && ' events'}
                          {req.type === 'profile' && ' profile setup'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => completeMission(mission)}
                    className="btn btn-primary w-full"
                  >
                    Progress Mission (Demo)
                  </button>
                </div>
              </motion.div>
            );
          })}
          
          {activeMissions.length === 0 && (
            <div className="glass-card p-8 rounded-lg text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <Zap size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold mb-1">No Active Missions</h3>
              <p className="text-gray-400">Check back later for new missions</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Completed Missions */}
      <div>
        <h2 className="text-xl font-display mb-4">Completed Missions</h2>
        
        <div className="space-y-4">
          {completedMissions.map((mission, index) => (
            <motion.div 
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card rounded-lg overflow-hidden border-l-4 border-green-500"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg flex items-center">
                    <span className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center mr-2 text-green-400">
                      <CheckCircle size={20} />
                    </span>
                    {mission.name}
                  </h3>
                  <div className="flex items-center text-sm bg-green-900/30 px-2 py-1 rounded-full text-green-400">
                    <Gift size={14} className="mr-1" />
                    {mission.reward} BC Earned
                  </div>
                </div>
                
                <p className="text-gray-300 ml-10">{mission.description}</p>
              </div>
            </motion.div>
          ))}
          
          {completedMissions.length === 0 && (
            <div className="glass-card p-8 rounded-lg text-center">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold mb-1">No Completed Missions</h3>
              <p className="text-gray-400">Complete active missions to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionsPage;