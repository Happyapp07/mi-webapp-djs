export interface GlobalClub {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  country: string;
  countryCode: string;
  musicStyles: string[];
  capacity: number;
  rating: number;
  description: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  image: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  openingHours: {
    [key: string]: string;
  };
  features: string[];
}

export const GLOBAL_CLUBS: GlobalClub[] = [
  // ESPAÑA
  {
    id: 'berghain-berlin',
    name: 'Berghain',
    address: 'Am Wriezener Bahnhof, 10243 Berlin',
    coordinates: { lat: 52.5111, lng: 13.4433 },
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    musicStyles: ['Techno', 'Minimal', 'Industrial'],
    capacity: 1500,
    rating: 4.8,
    description: 'Legendary techno temple in a former power plant. Known for its strict door policy and marathon sets.',
    website: 'https://www.berghain.berlin',
    instagram: '@berghain',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Friday': '23:00 - 06:00+2',
      'Saturday': '23:00 - 12:00+2',
      'Sunday': '12:00 - 06:00+1'
    },
    features: ['Panorama Bar', 'Garden', 'Darkroom', 'No Photos']
  },
  {
    id: 'fabric-london',
    name: 'Fabric',
    address: '77A Charterhouse St, London EC1M 3HN',
    coordinates: { lat: 52.5203, lng: -0.1019 },
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    musicStyles: ['Drum & Bass', 'Dubstep', 'Techno', 'House'],
    capacity: 1600,
    rating: 4.7,
    description: 'Iconic underground club with world-class sound system in converted Victorian cold stores.',
    website: 'https://www.fabriclondon.com',
    instagram: '@fabriclondon',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 08:00',
      'Sunday': '23:00 - 06:00'
    },
    features: ['Room One', 'Room Two', 'Room Three', 'Bodysonic Dancefloor']
  },
  {
    id: 'hi-ibiza',
    name: 'Hï Ibiza',
    address: 'Platja d\'en Bossa, 07817 Ibiza',
    coordinates: { lat: 38.9177, lng: 1.4082 },
    city: 'Ibiza',
    country: 'Spain',
    countryCode: 'ES',
    musicStyles: ['House', 'Techno', 'Progressive', 'Trance'],
    capacity: 3000,
    rating: 4.9,
    description: 'State-of-the-art superclub with cutting-edge production and world-renowned DJs.',
    website: 'https://www.hiibiza.com',
    instagram: '@hiibiza',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$$',
    openingHours: {
      'Monday': '23:00 - 06:00',
      'Tuesday': '23:00 - 06:00',
      'Wednesday': '23:00 - 06:00',
      'Thursday': '23:00 - 06:00',
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00',
      'Sunday': '23:00 - 06:00'
    },
    features: ['Main Room', 'Wild Corner', 'VIP Areas', 'Outdoor Terrace']
  },
  {
    id: 'pacha-ibiza',
    name: 'Pacha Ibiza',
    address: 'Av. 8 d\'Agost, 07800 Ibiza',
    coordinates: { lat: 38.9187, lng: 1.4433 },
    city: 'Ibiza',
    country: 'Spain',
    countryCode: 'ES',
    musicStyles: ['House', 'Deep House', 'Tech House'],
    capacity: 3000,
    rating: 4.8,
    description: 'Iconic Ibiza institution since 1973, known for its cherry logo and legendary parties.',
    website: 'https://www.pacha.com',
    instagram: '@pachaofficial',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$$',
    openingHours: {
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00',
      'Sunday': '23:00 - 06:00'
    },
    features: ['Main Room', 'Funky Room', 'VIP Cabaret', 'Terrace']
  },
  {
    id: 'razzmatazz-barcelona',
    name: 'Razzmatazz',
    address: 'Carrer de Pamplona, 88, 08018 Barcelona',
    coordinates: { lat: 41.4036, lng: 2.1964 },
    city: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    musicStyles: ['Indie', 'Electronic', 'Rock', 'Techno'],
    capacity: 2200,
    rating: 4.6,
    description: 'Multi-room venue hosting concerts and club nights with diverse musical programming.',
    website: 'https://www.salarazzmatazz.com',
    instagram: '@razzmatazz_club',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Thursday': '23:00 - 05:00',
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00'
    },
    features: ['The Loft', 'The Lolita', 'Pop Bar', 'Rex Room', 'Razz Club']
  },
  {
    id: 'kapital-madrid',
    name: 'Teatro Kapital',
    address: 'Calle de Atocha, 125, 28012 Madrid',
    coordinates: { lat: 40.4089, lng: -3.6943 },
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    musicStyles: ['Commercial', 'Latin', 'Hip Hop', 'Electronic'],
    capacity: 2000,
    rating: 4.3,
    description: 'Seven-floor megaclub in a former theater, each floor with different music and atmosphere.',
    website: 'https://www.grupo-kapital.com',
    instagram: '@teatrokapital',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Thursday': '23:30 - 05:30',
      'Friday': '23:30 - 06:00',
      'Saturday': '23:30 - 06:00'
    },
    features: ['7 Floors', 'Rooftop Terrace', 'VIP Areas', 'Karaoke']
  },

  // FRANCIA
  {
    id: 'rex-club-paris',
    name: 'Rex Club',
    address: '5 Boulevard Poissonnière, 75002 Paris',
    coordinates: { lat: 48.8708, lng: 2.3470 },
    city: 'Paris',
    country: 'France',
    countryCode: 'FR',
    musicStyles: ['Techno', 'House', 'Electro'],
    capacity: 800,
    rating: 4.7,
    description: 'Legendary Parisian techno club with exceptional sound system and intimate atmosphere.',
    website: 'https://www.rexclub.com',
    instagram: '@rexclub',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Wednesday': '23:30 - 06:00',
      'Thursday': '23:30 - 06:00',
      'Friday': '23:30 - 06:00',
      'Saturday': '23:30 - 06:00'
    },
    features: ['Funktion-One Sound', 'Underground Location', 'Resident DJs']
  },

  // ALEMANIA
  {
    id: 'watergate-berlin',
    name: 'Watergate',
    address: 'Falckensteinstraße 49, 10997 Berlin',
    coordinates: { lat: 52.5008, lng: 13.4469 },
    city: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    musicStyles: ['Minimal Techno', 'Deep House', 'Progressive'],
    capacity: 1000,
    rating: 4.6,
    description: 'Riverside club with panoramic windows overlooking the Spree river.',
    website: 'https://www.water-gate.de',
    instagram: '@watergate_berlin',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Friday': '23:00 - 10:00',
      'Saturday': '23:00 - 12:00'
    },
    features: ['River View', 'LED Ceiling', 'Terrace', 'Panoramic Windows']
  },

  // ITALIA
  {
    id: 'cocorico-riccione',
    name: 'Cocoricò',
    address: 'Viale Chieti, 44, 47838 Riccione',
    coordinates: { lat: 44.0058, lng: 12.6553 },
    city: 'Riccione',
    country: 'Italy',
    countryCode: 'IT',
    musicStyles: ['House', 'Techno', 'Progressive'],
    capacity: 4000,
    rating: 4.5,
    description: 'Iconic Italian superclub with pyramid architecture and world-class production.',
    website: 'https://www.cocorico.it',
    instagram: '@cocorico_official',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Saturday': '23:00 - 06:00',
      'Sunday': '16:00 - 24:00'
    },
    features: ['Pyramid Room', 'Outdoor Areas', 'Pool Parties', 'VIP Suites']
  },

  // ESTADOS UNIDOS
  {
    id: 'space-miami',
    name: 'Space Miami',
    address: '34 NE 11th St, Miami, FL 33132',
    coordinates: { lat: 25.7847, lng: -80.1998 },
    city: 'Miami',
    country: 'United States',
    countryCode: 'US',
    musicStyles: ['House', 'Techno', 'Progressive', 'Trance'],
    capacity: 2000,
    rating: 4.6,
    description: 'Downtown Miami institution known for marathon parties and world-class DJs.',
    website: 'https://www.clubspace.com',
    instagram: '@spacemiami',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Friday': '23:00 - 10:00',
      'Saturday': '23:00 - 12:00',
      'Sunday': '22:00 - 10:00'
    },
    features: ['Rooftop Terrace', 'Multiple Rooms', 'VIP Areas', 'After Hours']
  },
  {
    id: 'output-brooklyn',
    name: 'Output',
    address: '74 Wythe Ave, Brooklyn, NY 11249',
    coordinates: { lat: 25.7847, lng: -80.1998 },
    city: 'New York',
    country: 'United States',
    countryCode: 'US',
    musicStyles: ['Techno', 'House', 'Deep House'],
    capacity: 1800,
    rating: 4.6,
    description: 'Brooklyn warehouse club with no-photos policy and serious sound system.',
    website: 'https://outputclub.com',
    instagram: '@outputclub',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00'
    },
    features: ['No Photos Policy', 'Funktion-One Sound', 'Industrial Design']
  },

  // BRASIL
  {
    id: 'green-valley-florianopolis',
    name: 'Green Valley',
    address: 'Rod. SC-406, 6555, Florianópolis',
    coordinates: { lat: -27.5954, lng: -48.5480 },
    city: 'Florianópolis',
    country: 'Brazil',
    countryCode: 'BR',
    musicStyles: ['Progressive House', 'Trance', 'Techno'],
    capacity: 4000,
    rating: 4.9,
    description: 'Award-winning Brazilian superclub with stunning production and international DJs.',
    website: 'https://www.greenvalley.com.br',
    instagram: '@greenvalleyoficial',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00'
    },
    features: ['LED Production', 'Multiple Stages', 'VIP Areas', 'Outdoor Spaces']
  },

  // JAPÓN
  {
    id: 'womb-tokyo',
    name: 'Womb',
    address: '2-16 Maruyamacho, Shibuya, Tokyo',
    coordinates: { lat: 35.6580, lng: 139.6994 },
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    musicStyles: ['Techno', 'House', 'Minimal'],
    capacity: 1000,
    rating: 4.7,
    description: 'Tokyo\'s premier techno venue with mirror ball and exceptional sound system.',
    website: 'https://www.womb.co.jp',
    instagram: '@womb_tokyo',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '23:00 - 05:00',
      'Saturday': '23:00 - 05:00'
    },
    features: ['Mirror Ball', 'Funktion-One Sound', 'Intimate Setting']
  },

  // SINGAPUR
  {
    id: 'zouk-singapore',
    name: 'Zouk Singapore',
    address: '3C River Valley Road, Singapore 179024',
    coordinates: { lat: 1.2922, lng: 103.8589 },
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    musicStyles: ['Progressive House', 'Trance', 'Deep House'],
    capacity: 2500,
    rating: 4.8,
    description: 'Asia\'s top nightclub with multiple award wins and world-class programming.',
    website: 'https://www.zoukclub.com',
    instagram: '@zoukclub',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Wednesday': '22:00 - 03:00',
      'Friday': '22:00 - 04:00',
      'Saturday': '22:00 - 04:00'
    },
    features: ['Main Room', 'Phuture', 'Red Tail Bar', 'VIP Suites']
  },

  // HOLANDA
  {
    id: 'shelter-amsterdam',
    name: 'Shelter',
    address: 'Overhoeksplein 3, 1031 KS Amsterdam',
    coordinates: { lat: 52.3890, lng: 4.9058 },
    city: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    musicStyles: ['Techno', 'House', 'Minimal'],
    capacity: 700,
    rating: 4.5,
    description: 'Underground club in former shipping container with raw industrial atmosphere.',
    website: 'https://www.shelteramsterdam.nl',
    instagram: '@shelter_amsterdam',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '23:00 - 06:00',
      'Saturday': '23:00 - 06:00'
    },
    features: ['Underground Location', 'Industrial Design', 'Intimate Setting']
  },

  // MÉXICO
  {
    id: 'yuyu-mexico-city',
    name: 'Yuyu',
    address: 'Colima 268, Roma Norte, Mexico City',
    coordinates: { lat: 19.4147, lng: -99.1635 },
    city: 'Mexico City',
    country: 'Mexico',
    countryCode: 'MX',
    musicStyles: ['House', 'Techno', 'Minimal'],
    capacity: 400,
    rating: 4.4,
    description: 'Intimate underground club in Roma Norte with carefully curated electronic music.',
    website: 'https://www.yuyu.mx',
    instagram: '@yuyu_mx',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Thursday': '22:00 - 03:00',
      'Friday': '22:00 - 04:00',
      'Saturday': '22:00 - 04:00'
    },
    features: ['Underground Vibe', 'Curated Music', 'Intimate Dancefloor']
  },

  // COLOMBIA
  {
    id: 'baum-bogota',
    name: 'Baum',
    address: 'Carrera 13 #93B-45, Bogotá',
    coordinates: { lat: 4.6751, lng: -74.0584 },
    city: 'Bogotá',
    country: 'Colombia',
    countryCode: 'CO',
    musicStyles: ['Techno', 'Minimal', 'House'],
    capacity: 800,
    rating: 4.6,
    description: 'Bogotá\'s premier electronic music venue with international and local talent.',
    website: 'https://www.baum.com.co',
    instagram: '@baum_bogota',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '22:00 - 04:00',
      'Saturday': '22:00 - 04:00'
    },
    features: ['Quality Sound System', 'Local & International DJs', 'Modern Design']
  },

  // ARGENTINA
  {
    id: 'crobar-buenos-aires',
    name: 'Crobar',
    address: 'Paseo de la Infanta, Puerto Madero, Buenos Aires',
    coordinates: { lat: -34.6118, lng: -58.3960 },
    city: 'Buenos Aires',
    country: 'Argentina',
    countryCode: 'AR',
    musicStyles: ['House', 'Progressive', 'Trance'],
    capacity: 2500,
    rating: 4.5,
    description: 'Iconic Buenos Aires superclub in Puerto Madero with world-class production.',
    website: 'https://www.crobar.com.ar',
    instagram: '@crobar_bsas',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '24:00 - 06:00',
      'Saturday': '24:00 - 06:00'
    },
    features: ['Waterfront Location', 'Multiple Rooms', 'VIP Areas', 'Outdoor Terrace']
  },

  // AUSTRALIA
  {
    id: 'fabric-sydney',
    name: 'Chinese Laundry',
    address: '111 Sussex St, Sydney NSW 2000',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    city: 'Sydney',
    country: 'Australia',
    countryCode: 'AU',
    musicStyles: ['House', 'Techno', 'Progressive'],
    capacity: 1200,
    rating: 4.4,
    description: 'Sydney\'s underground electronic music institution in the CBD.',
    website: 'https://www.chineselaundry.com.au',
    instagram: '@chineselaundry',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$',
    openingHours: {
      'Friday': '22:00 - 05:00',
      'Saturday': '22:00 - 05:00'
    },
    features: ['Underground Location', 'Quality Sound', 'Intimate Atmosphere']
  },

  // TAILANDIA
  {
    id: 'glow-bangkok',
    name: 'Glow',
    address: '96/4-5 Wireless Rd, Bangkok 10330',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    city: 'Bangkok',
    country: 'Thailand',
    countryCode: 'TH',
    musicStyles: ['Progressive House', 'Trance', 'Deep House'],
    capacity: 1500,
    rating: 4.3,
    description: 'Bangkok\'s premier rooftop club with stunning city views and international DJs.',
    website: 'https://www.glowbangkok.com',
    instagram: '@glow_bangkok',
    image: 'https://images.pexels.com/photos/2114365/pexels-photo-2114365.jpeg',
    priceRange: '$$$',
    openingHours: {
      'Wednesday': '21:00 - 02:00',
      'Thursday': '21:00 - 02:00',
      'Friday': '21:00 - 02:00',
      'Saturday': '21:00 - 02:00'
    },
    features: ['Rooftop Location', 'City Views', 'VIP Areas', 'Pool']
  }
];

// Función para obtener clubes por país
export const getClubsByCountry = (countryCode: string): GlobalClub[] => {
  return GLOBAL_CLUBS.filter(club => club.countryCode === countryCode);
};

// Función para obtener clubes por ciudad
export const getClubsByCity = (city: string): GlobalClub[] => {
  return GLOBAL_CLUBS.filter(club => club.city.toLowerCase() === city.toLowerCase());
};

// Función para obtener clubes por estilo musical
export const getClubsByMusicStyle = (style: string): GlobalClub[] => {
  return GLOBAL_CLUBS.filter(club => 
    club.musicStyles.some(s => s.toLowerCase().includes(style.toLowerCase()))
  );
};

// Función para buscar clubes
export const searchClubs = (query: string): GlobalClub[] => {
  const searchTerm = query.toLowerCase();
  return GLOBAL_CLUBS.filter(club => 
    club.name.toLowerCase().includes(searchTerm) ||
    club.city.toLowerCase().includes(searchTerm) ||
    club.country.toLowerCase().includes(searchTerm) ||
    club.musicStyles.some(style => style.toLowerCase().includes(searchTerm))
  );
};

// Estadísticas globales
export const getGlobalStats = () => {
  const countries = [...new Set(GLOBAL_CLUBS.map(club => club.country))];
  const cities = [...new Set(GLOBAL_CLUBS.map(club => club.city))];
  const totalCapacity = GLOBAL_CLUBS.reduce((sum, club) => sum + club.capacity, 0);
  const avgRating = GLOBAL_CLUBS.reduce((sum, club) => sum + club.rating, 0) / GLOBAL_CLUBS.length;

  return {
    totalClubs: GLOBAL_CLUBS.length,
    countries: countries.length,
    cities: cities.length,
    totalCapacity,
    averageRating: Math.round(avgRating * 10) / 10
  };
};