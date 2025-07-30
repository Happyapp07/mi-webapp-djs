import { ReporterProfile, UserRole } from '../types/profiles';

/**
 * Sample reporter profiles for the application
 * These profiles represent different types of reporters with various specializations,
 * equipment setups, and content portfolios
 */
export const REPORTER_PROFILES: ReporterProfile[] = [];

/**
 * Get all reporter profiles
 * @returns Array of reporter profiles
 */
export const getAllReporters = (): ReporterProfile[] => {
  return REPORTER_PROFILES;
};

/**
 * Get a reporter profile by ID
 * @param id Reporter ID
 * @returns Reporter profile or undefined if not found
 */
export const getReporterById = (id: string): ReporterProfile | undefined => {
  return REPORTER_PROFILES.find(reporter => reporter.id === id);
};

/**
 * Get reporters by assigned DJ
 * @param djId DJ ID
 * @returns Array of reporter profiles assigned to the DJ
 */
export const getReportersByDJ = (djId: string): ReporterProfile[] => {
  return REPORTER_PROFILES.filter(reporter => reporter.assignedDJ === djId);
};

/**
 * Get reporters by contracted club
 * @param clubId Club ID
 * @returns Array of reporter profiles contracted with the club
 */
export const getReportersByClub = (clubId: string): ReporterProfile[] => {
  return REPORTER_PROFILES.filter(reporter => 
    reporter.contractedClubs.includes(clubId)
  );
};

/**
 * Get verified reporters
 * @returns Array of verified reporter profiles
 */
export const getVerifiedReporters = (): ReporterProfile[] => {
  return REPORTER_PROFILES.filter(reporter => reporter.isVerified);
};

/**
 * Get reporters by membership tier
 * @param tier Membership tier
 * @returns Array of reporter profiles with the specified membership tier
 */
export const getReportersByTier = (tier: string): ReporterProfile[] => {
  return REPORTER_PROFILES.filter(reporter => reporter.membership.tier === tier);
};