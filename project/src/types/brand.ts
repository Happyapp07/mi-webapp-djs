import { UserType } from './index';

export interface Brand {
  id: string;
  name: string;
  type: BrandType;
  logo: string;
  aliases: string[];
  category?: string;
  website?: string;
}

export enum BrandType {
  DRINK = 'drink',
  DJ_EQUIPMENT = 'dj_equipment',
  DJ_SOFTWARE = 'dj_software',
  VENUE = 'venue'
}

// Drink brands with common misspellings and variations
export const DRINK_BRANDS: Brand[] = [
  {
    id: 'redbull',
    name: 'Red Bull',
    type: BrandType.DRINK,
    logo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png',
    aliases: ['redbull', 'red-bull', 'red bull energy', 'redbul'],
    category: 'energy_drink',
    website: 'https://www.redbull.com/'
  },
  {
    id: 'heineken',
    name: 'Heineken',
    type: BrandType.DRINK,
    logo: 'https://logos-world.net/wp-content/uploads/2020/09/Heineken-Logo.png',
    aliases: ['heineken', 'heineken beer', 'heineken lager', 'heineken premium'],
    category: 'beer',
    website: 'https://www.heineken.com/'
  },
  {
    id: 'absolut',
    name: 'Absolut',
    type: BrandType.DRINK,
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Absolut-Logo.png',
    aliases: ['absolut', 'absolut vodka', 'absolute', 'absolute vodka'],
    category: 'vodka',
    website: 'https://www.absolut.com/'
  },
  {
    id: 'bacardi',
    name: 'Bacardi',
    type: BrandType.DRINK,
    logo: 'https://logos-world.net/wp-content/uploads/2020/11/Bacardi-Logo.png',
    aliases: ['bacardi', 'bacardi rum', 'bacardy', 'bakardi'],
    category: 'rum',
    website: 'https://www.bacardi.com/'
  },
  {
    id: 'jack_daniels',
    name: 'Jack Daniel\'s',
    type: BrandType.DRINK,
    logo: 'https://logos-world.net/wp-content/uploads/2020/12/Jack-Daniels-Logo.png',
    aliases: ['jack daniels', 'jack daniel\'s', 'jd', 'jack'],
    category: 'whiskey',
    website: 'https://www.jackdaniels.com/'
  }
];

// DJ Equipment brands
export const DJ_EQUIPMENT_BRANDS: Brand[] = [
  {
    id: 'pioneer_dj',
    name: 'Pioneer DJ',
    type: BrandType.DJ_EQUIPMENT,
    logo: 'https://logos-world.net/wp-content/uploads/2023/03/Pioneer-DJ-Logo.png',
    aliases: ['pioneer', 'pioneer dj', 'pioneer pro dj', 'pioneer professional'],
    category: 'mixer',
    website: 'https://www.pioneerdj.com/'
  },
  {
    id: 'native_instruments',
    name: 'Native Instruments',
    type: BrandType.DJ_EQUIPMENT,
    logo: 'https://logos-world.net/wp-content/uploads/2023/02/Native-Instruments-Logo.png',
    aliases: ['ni', 'native instruments', 'traktor', 'native'],
    category: 'controller',
    website: 'https://www.native-instruments.com/'
  },
  {
    id: 'denon',
    name: 'Denon DJ',
    type: BrandType.DJ_EQUIPMENT,
    logo: 'https://logos-world.net/wp-content/uploads/2023/02/Denon-DJ-Logo.png',
    aliases: ['denon', 'denon dj', 'denondj'],
    category: 'mixer',
    website: 'https://www.denondj.com/'
  }
];

// DJ Software brands
export const DJ_SOFTWARE_BRANDS: Brand[] = [
  {
    id: 'serato',
    name: 'Serato',
    type: BrandType.DJ_SOFTWARE,
    logo: 'https://logos-world.net/wp-content/uploads/2023/02/Serato-Logo.png',
    aliases: ['serato', 'serato dj', 'serato pro', 'scratch live'],
    category: 'software',
    website: 'https://serato.com/'
  },
  {
    id: 'rekordbox',
    name: 'Rekordbox',
    type: BrandType.DJ_SOFTWARE,
    logo: 'https://logos-world.net/wp-content/uploads/2023/03/Rekordbox-Logo.png',
    aliases: ['rekordbox', 'recordbox', 'pioneer software', 'rekord box'],
    category: 'software',
    website: 'https://rekordbox.com/'
  },
  {
    id: 'traktor',
    name: 'Traktor',
    type: BrandType.DJ_SOFTWARE,
    logo: 'https://logos-world.net/wp-content/uploads/2023/02/Traktor-Logo.png',
    aliases: ['traktor', 'traktor pro', 'tractor', 'ni traktor'],
    category: 'software',
    website: 'https://www.native-instruments.com/en/products/traktor/'
  }
];

export const getBrandsByType = (type: BrandType): Brand[] => {
  switch (type) {
    case BrandType.DRINK:
      return DRINK_BRANDS;
    case BrandType.DJ_EQUIPMENT:
      return DJ_EQUIPMENT_BRANDS;
    case BrandType.DJ_SOFTWARE:
      return DJ_SOFTWARE_BRANDS;
    default:
      return [];
  }
};

export const getBrandById = (id: string): Brand | undefined => {
  return [...DRINK_BRANDS, ...DJ_EQUIPMENT_BRANDS, ...DJ_SOFTWARE_BRANDS]
    .find(brand => brand.id === id);
};

// Function to find the closest matching brand based on user input
export const findBrandMatch = (input: string, type?: BrandType): Brand | undefined => {
  const normalizedInput = input.toLowerCase().trim();
  
  // Get all brands or filter by type
  const brands = type ? getBrandsByType(type) : [...DRINK_BRANDS, ...DJ_EQUIPMENT_BRANDS, ...DJ_SOFTWARE_BRANDS];
  
  // First try exact matches with aliases
  const exactMatch = brands.find(brand => 
    brand.aliases.includes(normalizedInput) || 
    brand.name.toLowerCase() === normalizedInput
  );
  
  if (exactMatch) return exactMatch;
  
  // Then try partial matches
  const partialMatch = brands.find(brand => 
    brand.aliases.some(alias => alias.includes(normalizedInput)) ||
    brand.name.toLowerCase().includes(normalizedInput)
  );
  
  return partialMatch;
};

// Function to get brand suggestions based on partial input
export const getBrandSuggestions = (input: string, type?: BrandType): Brand[] => {
  if (!input.trim()) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const brands = type ? getBrandsByType(type) : [...DRINK_BRANDS, ...DJ_EQUIPMENT_BRANDS, ...DJ_SOFTWARE_BRANDS];
  
  return brands.filter(brand => 
    brand.aliases.some(alias => alias.includes(normalizedInput)) ||
    brand.name.toLowerCase().includes(normalizedInput)
  );
};