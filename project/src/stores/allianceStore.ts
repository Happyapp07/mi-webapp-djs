import { create } from 'zustand';
import { 
  Alliance, 
  AllianceStatus, 
  Crew, 
  CrewMember, 
  CrewRole, 
  PhysicalMission, 
  PHYSICAL_MISSIONS,
  CREW_BADGES
} from '../types/alliance';
import { useAuthStore } from './authStore';
import { nanoid } from 'nanoid';

interface AllianceState {
  alliances: Alliance[];
  crews: Crew[];
  activeMissions: PhysicalMission[];
  completedMissions: string[];
  isLoading: boolean;
  error: string | null;
  
  // Alliance methods
  createAlliance: (userId1: string, userId2: string) => Promise<Alliance>;
  getAlliancesByUserId: (userId: string) => Alliance[];
  checkAlliance: (userId1: string, userId2: string) => Alliance | null;
  updateAllianceMeetup: (allianceId: string, clubId?: string, eventId?: string) => Promise<void>;
  
  // Crew methods
  createCrew: (name: string, description?: string, image?: string) => Promise<Crew>;
  getCrewsByUserId: (userId: string) => Crew[];
  getCrewById: (crewId: string) => Crew | null;
  addMemberToCrew: (crewId: string, userId: string, role?: CrewRole) => Promise<void>;
  removeMemberFromCrew: (crewId: string, userId: string) => Promise<void>;
  updateCrewMemberRole: (crewId: string, userId: string, role: CrewRole) => Promise<void>;
  
  // Mission methods
  getActiveMissions: () => Promise<PhysicalMission[]>;
  getMissionById: (missionId: string) => PhysicalMission | null;
  startMission: (missionId: string, crewId: string) => Promise<void>;
  completeMissionRequirement: (missionId: string, crewId: string, requirementType: string, count?: number) => Promise<void>;
  checkMissionCompletion: (missionId: string, crewId: string) => Promise<boolean>;
  
  // Badge methods
  getCrewBadges: (crewId: string) => string[];
  checkBadgeEligibility: (crewId: string) => Promise<void>;
}

export const useAllianceStore = create<AllianceState>((set, get) => ({
  alliances: [],
  crews: [],
  activeMissions: PHYSICAL_MISSIONS,
  completedMissions: [],
  isLoading: false,
  error: null,
  
  // Alliance methods
  createAlliance: async (userId1: string, userId2: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Check if alliance already exists
      const existingAlliance = get().checkAlliance(userId1, userId2);
      if (existingAlliance) {
        return existingAlliance;
      }
      
      // Create new alliance
      const newAlliance: Alliance = {
        id: `alliance_${nanoid()}`,
        userId1,
        userId2,
        createdAt: new Date(),
        status: AllianceStatus.ACTIVE,
        meetupCount: 1,
        sharedEvents: [],
        sharedClubs: []
      };
      
      set(state => ({
        alliances: [...state.alliances, newAlliance],
        isLoading: false
      }));
      
      return newAlliance;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create alliance',
        isLoading: false 
      });
      throw error;
    }
  },
  
  getAlliancesByUserId: (userId: string) => {
    return get().alliances.filter(alliance => 
      alliance.userId1 === userId || alliance.userId2 === userId
    );
  },
  
  checkAlliance: (userId1: string, userId2: string) => {
    return get().alliances.find(alliance => 
      (alliance.userId1 === userId1 && alliance.userId2 === userId2) ||
      (alliance.userId1 === userId2 && alliance.userId2 === userId1)
    ) || null;
  },
  
  updateAllianceMeetup: async (allianceId: string, clubId?: string, eventId?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find alliance
      const alliance = get().alliances.find(a => a.id === allianceId);
      if (!alliance) {
        throw new Error('Alliance not found');
      }
      
      // Update alliance
      const updatedAlliance: Alliance = {
        ...alliance,
        lastMeetupAt: new Date(),
        meetupCount: alliance.meetupCount + 1,
        sharedClubs: clubId ? [...alliance.sharedClubs, clubId] : alliance.sharedClubs,
        sharedEvents: eventId ? [...alliance.sharedEvents, eventId] : alliance.sharedEvents
      };
      
      set(state => ({
        alliances: state.alliances.map(a => a.id === allianceId ? updatedAlliance : a),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update alliance meetup',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Crew methods
  createCrew: async (name: string, description?: string, image?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { user } = useAuthStore.getState();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Create new crew
      const newCrew: Crew = {
        id: `crew_${nanoid()}`,
        name,
        description,
        createdAt: new Date(),
        founderUserId: user.id,
        members: [
          {
            userId: user.id,
            username: user.username,
            userType: user.userType,
            joinedAt: new Date(),
            role: CrewRole.FOUNDER,
            contributionScore: 0,
            avatar: user.profileImage
          }
        ],
        rank: 0,
        score: 0,
        completedMissions: [],
        badges: [],
        image
      };
      
      set(state => ({
        crews: [...state.crews, newCrew],
        isLoading: false
      }));
      
      return newCrew;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create crew',
        isLoading: false 
      });
      throw error;
    }
  },
  
  getCrewsByUserId: (userId: string) => {
    return get().crews.filter(crew => 
      crew.members.some(member => member.userId === userId)
    );
  },
  
  getCrewById: (crewId: string) => {
    return get().crews.find(crew => crew.id === crewId) || null;
  },
  
  addMemberToCrew: async (crewId: string, userId: string, role: CrewRole = CrewRole.MEMBER) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find crew
      const crew = get().crews.find(c => c.id === crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check if user is already a member
      if (crew.members.some(member => member.userId === userId)) {
        throw new Error('User is already a member of this crew');
      }
      
      // Check if crew is full (max 10 members)
      if (crew.members.length >= 10) {
        throw new Error('Crew is full (maximum 10 members)');
      }
      
      // Get user data from auth store
      const { user: currentUser } = useAuthStore.getState();
      const userData = {
        id: userId,
        username: currentUser?.username || `user_${userId.substring(0, 8)}`,
        userType: currentUser?.userType || 'partygoer',
        profileImage: `https://api.dicebear.com/7.x/personas/svg?seed=${userId}`
      };
      
      // Add member to crew
      const updatedCrew: Crew = {
        ...crew,
        members: [
          ...crew.members,
          {
            userId,
            username: userData.username,
            userType: userData.userType,
            joinedAt: new Date(),
            role,
            contributionScore: 0,
            avatar: userData.profileImage
          }
        ]
      };
      
      set(state => ({
        crews: state.crews.map(c => c.id === crewId ? updatedCrew : c),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add member to crew',
        isLoading: false 
      });
      throw error;
    }
  },
  
  removeMemberFromCrew: async (crewId: string, userId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find crew
      const crew = get().crews.find(c => c.id === crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check if user is a member
      if (!crew.members.some(member => member.userId === userId)) {
        throw new Error('User is not a member of this crew');
      }
      
      // Check if user is the founder
      if (crew.founderUserId === userId) {
        throw new Error('Founder cannot leave the crew');
      }
      
      // Remove member from crew
      const updatedCrew: Crew = {
        ...crew,
        members: crew.members.filter(member => member.userId !== userId)
      };
      
      set(state => ({
        crews: state.crews.map(c => c.id === crewId ? updatedCrew : c),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to remove member from crew',
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateCrewMemberRole: async (crewId: string, userId: string, role: CrewRole) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find crew
      const crew = get().crews.find(c => c.id === crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check if user is a member
      if (!crew.members.some(member => member.userId === userId)) {
        throw new Error('User is not a member of this crew');
      }
      
      // Check if trying to change founder role
      if (crew.founderUserId === userId && role !== CrewRole.FOUNDER) {
        throw new Error('Founder role cannot be changed');
      }
      
      // Update member role
      const updatedCrew: Crew = {
        ...crew,
        members: crew.members.map(member => 
          member.userId === userId ? { ...member, role } : member
        )
      };
      
      set(state => ({
        crews: state.crews.map(c => c.id === crewId ? updatedCrew : c),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update member role',
        isLoading: false 
      });
      throw error;
    }
  },
  
  // Mission methods
  getActiveMissions: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real app, this would fetch missions from an API
      // For demo, we'll use the predefined missions
      const activeMissions = PHYSICAL_MISSIONS.filter(mission => mission.isActive);
      
      set({ 
        activeMissions,
        isLoading: false 
      });
      
      return activeMissions;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch active missions',
        isLoading: false 
      });
      throw error;
    }
  },
  
  getMissionById: (missionId: string) => {
    return get().activeMissions.find(mission => mission.id === missionId) || null;
  },
  
  startMission: async (missionId: string, crewId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find mission
      const mission = get().getMissionById(missionId);
      if (!mission) {
        throw new Error('Mission not found');
      }
      
      // Find crew
      const crew = get().getCrewById(crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check if crew has enough members
      if (crew.members.length < mission.minMembers) {
        throw new Error(`This mission requires at least ${mission.minMembers} crew members`);
      }
      
      // Check if mission is already completed
      if (crew.completedMissions.includes(missionId)) {
        throw new Error('Mission already completed by this crew');
      }
      
      // In a real app, this would create a mission instance for the crew
      // For demo, we'll just log it
      console.log(`Crew ${crewId} started mission ${missionId}`);
      
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to start mission',
        isLoading: false 
      });
      throw error;
    }
  },
  
  completeMissionRequirement: async (missionId: string, crewId: string, requirementType: string, count: number = 1) => {
    try {
      set({ isLoading: true, error: null });
      
      // Find mission
      const mission = get().getMissionById(missionId);
      if (!mission) {
        throw new Error('Mission not found');
      }
      
      // Find crew
      const crew = get().getCrewById(crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check if mission is already completed
      if (crew.completedMissions.includes(missionId)) {
        throw new Error('Mission already completed by this crew');
      }
      
      // In a real app, this would update the mission progress
      // For demo, we'll just log it
      console.log(`Crew ${crewId} completed requirement ${requirementType} for mission ${missionId}`);
      
      // Check if mission is now complete
      const isComplete = await get().checkMissionCompletion(missionId, crewId);
      
      if (isComplete) {
        // Update crew
        const updatedCrew: Crew = {
          ...crew,
          completedMissions: [...crew.completedMissions, missionId],
          score: crew.score + (mission.reward.crewPoints || 0)
        };
        
        // Update crew members' beatcoins
        // In a real app, this would update each member's beatcoins
        // For demo, we'll just log it
        console.log(`Each member of crew ${crewId} earned ${mission.reward.beatcoins} beatcoins`);
        
        // Check for badge
        if (mission.reward.badge) {
          updatedCrew.badges = [...(updatedCrew.badges || []), mission.reward.badge];
        }
        
        set(state => ({
          crews: state.crews.map(c => c.id === crewId ? updatedCrew : c),
          completedMissions: [...state.completedMissions, missionId],
          isLoading: false
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to complete mission requirement',
        isLoading: false 
      });
      throw error;
    }
  },
  
  checkMissionCompletion: async (missionId: string, crewId: string) => {
    try {
      // Find mission
      const mission = get().getMissionById(missionId);
      if (!mission) {
        throw new Error('Mission not found');
      }
      
      // Find crew
      const crew = get().getCrewById(crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // In a real app, this would check if all requirements are met
      // For demo, we'll just return true
      return true;
    } catch (error) {
      console.error('Error checking mission completion:', error);
      return false;
    }
  },
  
  // Badge methods
  getCrewBadges: (crewId: string) => {
    const crew = get().getCrewById(crewId);
    if (!crew) return [];
    
    return crew.badges || [];
  },
  
  checkBadgeEligibility: async (crewId: string) => {
    try {
      // Find crew
      const crew = get().getCrewById(crewId);
      if (!crew) {
        throw new Error('Crew not found');
      }
      
      // Check each badge
      CREW_BADGES.forEach(badge => {
        // Check if crew already has the badge
        if (crew.badges.includes(badge.id)) return;
        
        // Check eligibility based on badge type
        let isEligible = false;
        
        switch (badge.id) {
          case 'stellar_allies':
            isEligible = crew.completedMissions.length >= badge.requirement;
            break;
          case 'loyal_crew':
            // In a real app, this would check the number of different clubs visited
            // For demo, we'll just check if the crew has completed enough missions
            isEligible = crew.completedMissions.length >= badge.requirement;
            break;
          case 'cosmic_bond':
            // In a real app, this would check the number of meetups
            // For demo, we'll just check if the crew has enough members
            isEligible = crew.members.length >= badge.requirement / 2;
            break;
          case 'party_legends':
            // In a real app, this would check the number of CrowdParties attended
            // For demo, we'll just check if the crew has completed enough missions
            isEligible = crew.completedMissions.length >= badge.requirement;
            break;
          case 'galactic_explorers':
            // In a real app, this would check the number of different cities visited
            // For demo, we'll just check if the crew has completed enough missions
            isEligible = crew.completedMissions.length >= badge.requirement;
            break;
        }
        
        // Award badge if eligible
        if (isEligible) {
          set(state => ({
            crews: state.crews.map(c => 
              c.id === crewId 
                ? { ...c, badges: [...c.badges, badge.id] }
                : c
            )
          }));
        }
      });
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
    }
  }
}));