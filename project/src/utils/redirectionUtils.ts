import { UserType } from '../types';

export interface RedirectionState {
  userType?: UserType;
  planId?: string;
  interval?: 'month' | 'year';
  competitionEnabled?: boolean;
  planetId?: string;
  showCompletionPrompt?: boolean;
  newSubscription?: boolean;
  redirectToProfile?: boolean;
  userId?: string;
}

/**
 * Determines the correct redirection path based on user type and subscription details
 */
export const getRedirectionPath = (state: RedirectionState): string => {
  const { userType, competitionEnabled, planetId, redirectToProfile } = state;
  
  // Always redirect to profile for onboarding flow
  // Only redirect to galaxy if explicitly requested
  if (redirectToProfile === false) {
    return '/galaxy';
  }
  
  // If user type is not defined, redirect to complete profile
  if (!userType) {
    return '/complete-profile';
  }
  
  // Handle DJ specific redirections
  if (userType === UserType.DJ) {
    // If DJ has chosen to compete but no planet is selected, they need to complete their profile
    if (competitionEnabled === true && !planetId) {
      return '/complete-profile';
    }
    
    // If DJ has chosen not to compete, redirect to showcase mode
    if (competitionEnabled === false) {
      return `/profile/current?mode=showcase`;
    }
    
    // Regular DJ profile with competition enabled
    return `/profile/current`;
  }
  
  // Handle other user types
  switch (userType) {
    case UserType.PARTYGOER:
      return `/profile/current`;
    case UserType.CLUB:
      return `/profile/current`;
    case UserType.REPORTER:
      return `/profile/current`;
    default:
      // Fallback to galaxy view if user type is not recognized
      return '/galaxy';
  }
};

/**
 * Builds the state object to be passed during redirection
 */
export const buildRedirectionState = (
  userType?: UserType,
  planId?: string,
  options?: {
    interval?: 'month' | 'year';
    competitionEnabled?: boolean;
    planetId?: string;
    userId?: string;
    redirectToProfile?: boolean;
  }
): RedirectionState => {
  return {
    userType,
    planId,
    interval: options?.interval || 'month',
    competitionEnabled: options?.competitionEnabled,
    planetId: options?.planetId,
    showCompletionPrompt: true,
    newSubscription: true,
    redirectToProfile: options?.redirectToProfile !== false, // Default to true unless explicitly set to false
    userId: options?.userId
  };
};