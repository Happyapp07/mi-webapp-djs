import { UserRole, Profile, DJProfile, RaverProfile, ClubProfile, ReporterProfile, FestivalProfile } from '../types/profiles';

// Define required fields for each role
const requiredFields = {
  [UserRole.DJ]: [
    { field: 'djName', label: 'DJ Name', importance: 'high' },
    { field: 'musicStyle', label: 'Music Style', importance: 'high' },
    { field: 'equipment.hardware', label: 'Hardware Equipment', importance: 'medium' },
    { field: 'equipment.software', label: 'Software', importance: 'medium' },
    { field: 'socialLinks.soundcloud', label: 'SoundCloud', importance: 'high' },
    { field: 'biography', label: 'Biography', importance: 'medium' },
    { field: 'sessions', label: 'Sessions', importance: 'low' }
  ],
  [UserRole.RAVER]: [
    { field: 'alias', label: 'Alias', importance: 'high' },
    { field: 'preferences.musicStyles', label: 'Music Styles', importance: 'high' },
    { field: 'preferences.favoriteDrinks', label: 'Favorite Drinks', importance: 'medium' },
    { field: 'preferences.behaviors', label: 'Party Behaviors', importance: 'medium' },
    { field: 'socialLinks', label: 'Social Links', importance: 'low' }
  ],
  [UserRole.CLUB]: [
    { field: 'clubName', label: 'Club Name', importance: 'high' },
    { field: 'location', label: 'Location', importance: 'high' },
    { field: 'capacity', label: 'Capacity', importance: 'high' },
    { field: 'dominantStyle', label: 'Music Style', importance: 'medium' },
    { field: 'staff', label: 'Staff', importance: 'medium' },
    { field: 'qrCode', label: 'QR Code', importance: 'low' }
  ],
  [UserRole.REPORTER]: [
    { field: 'assignedDJ', label: 'Assigned DJ', importance: 'high' },
    { field: 'recordings', label: 'Recordings', importance: 'medium' },
    { field: 'contractedClubs', label: 'Contracted Clubs', importance: 'medium' }
  ],
  [UserRole.FESTIVAL]: [
    { field: 'festivalName', label: 'Festival Name', importance: 'high' },
    { field: 'location', label: 'Location', importance: 'high' },
    { field: 'dates', label: 'Dates', importance: 'high' },
    { field: 'categories', label: 'Categories', importance: 'medium' },
    { field: 'participants', label: 'Participants', importance: 'medium' }
  ]
};

/**
 * Check if a field is complete based on its value
 * @param value The field value
 * @returns Boolean indicating if the field is complete
 */
const isFieldComplete = (value: any): boolean => {
  if (value === undefined || value === null) return false;
  
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  
  if (typeof value === 'object') {
    // Check if it's a date
    if (value instanceof Date) return true;
    
    // For objects, check if any property is complete
    return Object.values(value).some(v => isFieldComplete(v));
  }
  
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  
  return true;
};

/**
 * Get a nested property from an object using a path string
 * @param obj The object to get the property from
 * @param path The path to the property (e.g. 'user.profile.name')
 * @returns The property value or undefined if not found
 */
const getNestedProperty = (obj: any, path: string): any => {
  return path.split('.').reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
};

/**
 * Calculate the completion percentage of a profile
 * @param profile The user profile
 * @returns The completion percentage (0-100)
 */
export const calculateCompletionPercentage = (profile: Profile): number => {
  const fields = requiredFields[profile.role];
  if (!fields) return 0;
  
  const completedFields = fields.filter(field => 
    isFieldComplete(getNestedProperty(profile, field.field))
  );
  
  return Math.round((completedFields.length / fields.length) * 100);
};

/**
 * Get incomplete fields for a profile
 * @param profile The user profile
 * @returns Array of incomplete field objects with field name and importance
 */
export const getIncompleteFields = (profile: Profile): { field: string; label: string; importance: string }[] => {
  const fields = requiredFields[profile.role];
  if (!fields) return [];
  
  return fields.filter(field => 
    !isFieldComplete(getNestedProperty(profile, field.field))
  );
};

/**
 * Check if a specific field is complete
 * @param profile The user profile
 * @param fieldPath The path to the field
 * @returns Boolean indicating if the field is complete
 */
export const isProfileFieldComplete = (profile: any, fieldPath: string): boolean => {
  const value = getNestedProperty(profile, fieldPath);
  return isFieldComplete(value);
};

/**
 * Get the reward for a completion percentage
 * @param percentage The completion percentage
 * @returns Object with beatcoins and badge earned
 */
export const getCompletionReward = (percentage: number): { beatcoins: number; badge: boolean } => {
  if (percentage >= 100) return { beatcoins: 150, badge: true };
  if (percentage >= 75) return { beatcoins: 100, badge: false };
  if (percentage >= 50) return { beatcoins: 50, badge: false };
  return { beatcoins: 0, badge: false };
};

/**
 * Get the field label and importance for a field path
 * @param role The user role
 * @param fieldPath The path to the field
 * @returns Object with label and importance, or undefined if not found
 */
export const getFieldInfo = (role: UserRole, fieldPath: string): { label: string; importance: string } | undefined => {
  const fields = requiredFields[role];
  if (!fields) return undefined;
  
  return fields.find(field => field.field === fieldPath);
};