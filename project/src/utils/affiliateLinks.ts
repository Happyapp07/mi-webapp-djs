import { Brand } from '../types/brand';

// UTM parameters for tracking
export interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
}

// Default UTM parameters for the platform
const DEFAULT_UTM: UTMParams = {
  source: 'cosmicbeats',
  medium: 'referral',
  campaign: 'brand_mention'
};

/**
 * Generate an affiliate link with UTM parameters
 * @param url The base URL to add parameters to
 * @param params UTM parameters to add
 * @returns The URL with UTM parameters
 */
export const generateAffiliateLink = (url: string, params: Partial<UTMParams> = {}): string => {
  if (!url) return '';
  
  // Combine default and custom UTM parameters
  const utmParams: UTMParams = {
    ...DEFAULT_UTM,
    ...params
  };
  
  // Create URL object to handle parameters properly
  try {
    const urlObj = new URL(url);
    
    // Add UTM parameters
    urlObj.searchParams.append('utm_source', utmParams.source);
    urlObj.searchParams.append('utm_medium', utmParams.medium);
    urlObj.searchParams.append('utm_campaign', utmParams.campaign);
    
    if (utmParams.content) {
      urlObj.searchParams.append('utm_content', utmParams.content);
    }
    
    return urlObj.toString();
  } catch (error) {
    // If URL is invalid, try to fix it by adding https://
    if (!url.startsWith('http')) {
      return generateAffiliateLink(`https://${url}`, params);
    }
    
    // If still invalid, return original URL
    console.error('Invalid URL:', url);
    return url;
  }
};

/**
 * Generate an affiliate link for a specific brand
 * @param brand The brand object
 * @param userRole The role of the user (for tracking)
 * @returns The affiliate link
 */
export const getBrandAffiliateLink = (brand: Brand, userRole: string): string => {
  if (!brand.website) return '';
  
  return generateAffiliateLink(brand.website, {
    campaign: 'brand_mention',
    content: `${userRole}_${brand.type}`
  });
};

/**
 * Generate an affiliate link for a social platform
 * @param url The social platform URL
 * @param platform The platform name (instagram, tiktok, etc.)
 * @param userRole The role of the user (for tracking)
 * @returns The affiliate link
 */
export const getSocialAffiliateLink = (url: string, platform: string, userRole: string): string => {
  if (!url) return '';
  
  return generateAffiliateLink(url, {
    campaign: 'social_link',
    content: `${userRole}_${platform}`
  });
};

/**
 * Generate an affiliate link for a club website
 * @param url The club website URL
 * @param clubId The club ID
 * @returns The affiliate link
 */
export const getClubAffiliateLink = (url: string, clubId: string): string => {
  if (!url) return '';
  
  return generateAffiliateLink(url, {
    campaign: 'club_visit',
    content: clubId
  });
};

/**
 * Generate an affiliate link for a music platform
 * @param url The music platform URL
 * @param platform The platform name (soundcloud, beatport, etc.)
 * @param artistId The artist ID
 * @returns The affiliate link
 */
export const getMusicPlatformAffiliateLink = (url: string, platform: string, artistId: string): string => {
  if (!url) return '';
  
  return generateAffiliateLink(url, {
    campaign: 'music_platform',
    content: `${platform}_${artistId}`
  });
};

// Map of brand types to their official websites
export const BRAND_WEBSITES = {
  // DJ Equipment
  'pioneer_dj': 'https://www.pioneerdj.com/',
  'native_instruments': 'https://www.native-instruments.com/',
  'denon': 'https://www.denondj.com/',
  'technics': 'https://www.technics.com/',
  'numark': 'https://www.numark.com/',
  'allen_heath': 'https://www.allen-heath.com/',
  
  // DJ Software
  'serato': 'https://serato.com/',
  'rekordbox': 'https://rekordbox.com/',
  'traktor': 'https://www.native-instruments.com/en/products/traktor/',
  'ableton': 'https://www.ableton.com/',
  'virtual_dj': 'https://www.virtualdj.com/',
  
  // Music Platforms
  'beatport': 'https://www.beatport.com/',
  'soundcloud': 'https://soundcloud.com/',
  'mixcloud': 'https://www.mixcloud.com/',
  'spotify': 'https://www.spotify.com/',
  'resident_advisor': 'https://ra.co/',
  
  // Drinks
  'redbull': 'https://www.redbull.com/',
  'jagermeister': 'https://www.jagermeister.com/',
  'heineken': 'https://www.heineken.com/',
  'absolut': 'https://www.absolut.com/',
  'bacardi': 'https://www.bacardi.com/',
  'jack_daniels': 'https://www.jackdaniels.com/',
  'desperados': 'https://www.desperados.com/',
  
  // Sound Systems
  'function_one': 'https://www.funktion-one.com/',
  'void_acoustics': 'https://voidacoustics.com/',
  'l_acoustics': 'https://www.l-acoustics.com/',
  
  // Ticketing
  'eventbrite': 'https://www.eventbrite.com/',
  'dice': 'https://dice.fm/',
  'fever': 'https://feverup.com/',
  'ticketmaster': 'https://www.ticketmaster.com/',
  'festicket': 'https://www.festicket.com/',
  
  // Fashion
  'asos': 'https://www.asos.com/',
  'zara': 'https://www.zara.com/',
  
  // Rankings
  'top100djs': 'https://djmag.com/top100djs',
  'viberate': 'https://www.viberate.com/'
};