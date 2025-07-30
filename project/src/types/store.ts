import { UserType } from './index';

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  type: StoreItemType;
  image: string;
  userType: UserType | 'all';
  stock?: number;
  expiresAt?: Date;
  isLimited?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isDropItem?: boolean;
  dropName?: string;
  entityId?: string; // ID of the club, brand, or entity offering the item
  entityName?: string; // Name of the club, brand, or entity offering the item
  entityLogo?: string; // Logo of the club, brand, or entity offering the item
  redemptionInstructions?: string;
  termsAndConditions?: string;
}

export enum StoreCategory {
  PHYSICAL = 'physical',
  EXPERIENCE = 'experience',
  DIGITAL = 'digital',
  COMPETITION = 'competition',
  SPECIAL = 'special'
}

export enum StoreItemType {
  // Physical items
  MERCHANDISE = 'merchandise',
  CLOTHING = 'clothing',
  ACCESSORY = 'accessory',
  GEAR = 'gear',
  
  // Experiences
  ENTRY = 'entry',
  VIP = 'vip',
  MEET_GREET = 'meet_greet',
  DINNER = 'dinner',
  
  // Digital items
  AVATAR_FRAME = 'avatar_frame',
  NAME_EFFECT = 'name_effect',
  PROFILE_BADGE = 'profile_badge',
  PREMIUM_FEATURE = 'premium_feature',
  
  // Competition advantages
  EARLY_ACCESS = 'early_access',
  REVIEW = 'review',
  VISIBILITY_BOOST = 'visibility_boost',
  
  // Special items
  DROP = 'drop',
  MYSTERY_BOX = 'mystery_box',
  EXCLUSIVE = 'exclusive'
}

export interface StoreOrder {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  redemptionCode?: string;
  redemptionDate?: Date;
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  REDEEMED = 'redeemed',
  CANCELLED = 'cancelled'
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface StoreDrop {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  image: string;
  items: StoreItem[];
  isActive: boolean;
}

// Mock data for store items
export const STORE_ITEMS: StoreItem[] = [
  // Physical Items - Merchandise
  {
    id: 'item_tshirt_squad',
    name: 'Camiseta Exclusiva de Escuadra',
    description: 'Camiseta con diseño exclusivo de tu escuadra o planeta. Material de alta calidad con detalles holográficos.',
    price: 150,
    category: StoreCategory.PHYSICAL,
    type: StoreItemType.CLOTHING,
    image: 'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg',
    userType: 'all',
    stock: 50
  },
  {
    id: 'item_nfc_bracelet',
    name: 'Pulsera NFC para Validación',
    description: 'Pulsera con tecnología NFC para validación en clubes sin necesidad de escanear QR. Diseño exclusivo con LED integrado.',
    price: 80,
    category: StoreCategory.PHYSICAL,
    type: StoreItemType.ACCESSORY,
    image: 'https://images.pexels.com/photos/6311650/pexels-photo-6311650.jpeg',
    userType: 'all',
    stock: 100
  },
  {
    id: 'item_redbull_pack',
    name: 'Pack Red Bull Edición Limitada',
    description: 'Pack de 4 latas de Red Bull con diseño exclusivo de CosmicBeats. Incluye stickers coleccionables.',
    price: 60,
    category: StoreCategory.PHYSICAL,
    type: StoreItemType.MERCHANDISE,
    image: 'https://images.pexels.com/photos/1292294/pexels-photo-1292294.jpeg',
    userType: 'all',
    stock: 200,
    entityId: 'brand_redbull',
    entityName: 'Red Bull',
    entityLogo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png'
  },
  
  // Experiences in Clubs
  {
    id: 'item_vip_entry',
    name: 'Entrada VIP Sin Cola',
    description: 'Acceso VIP sin esperar cola en el club de tu elección. Válido para una persona.',
    price: 40,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.ENTRY,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    userType: 'all',
    redemptionInstructions: 'Presenta el código QR en la entrada del club para acceder directamente sin esperar cola.'
  },
  {
    id: 'item_vip_drink',
    name: 'Zona VIP + 1 Consumición',
    description: 'Acceso a la zona VIP del club y una consumición gratuita. Válido para una persona.',
    price: 90,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.VIP,
    image: 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
    userType: 'all',
    redemptionInstructions: 'Presenta el código QR en la entrada del club para acceder a la zona VIP y recibir tu consumición gratuita.'
  },
  {
    id: 'item_dj_photo',
    name: 'Foto Exclusiva con el DJ',
    description: 'Foto exclusiva con el DJ de la noche en el club de tu elección. Incluye copia digital y física.',
    price: 70,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.MEET_GREET,
    image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg',
    userType: 'all',
    redemptionInstructions: 'Presenta el código QR al personal del club para coordinar tu foto con el DJ durante el evento.'
  },
  {
    id: 'item_club_dinner',
    name: 'Cena Pre-Evento con Staff',
    description: 'Cena exclusiva con el staff del club antes del evento. Incluye menú especial y bebidas.',
    price: 150,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.DINNER,
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg',
    userType: 'all',
    redemptionInstructions: 'Contacta con el club con al menos 48 horas de antelación para reservar tu cena, presentando el código de redención.'
  },
  
  // Digital Rewards
  {
    id: 'item_visibility_boost',
    name: 'Boost de Visibilidad en Rankings',
    description: 'Aumenta tu visibilidad en los rankings durante 48 horas. Tu perfil aparecerá destacado.',
    price: 100,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.VISIBILITY_BOOST,
    image: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg',
    userType: UserType.DJ,
    redemptionInstructions: 'El boost se aplicará automáticamente a tu perfil durante 48 horas desde el momento de la compra.'
  },
  {
    id: 'item_avatar_frame',
    name: 'Marco Animado Exclusivo',
    description: 'Marco animado exclusivo para tu avatar con efectos holográficos y partículas cósmicas.',
    price: 60,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.AVATAR_FRAME,
    image: 'https://images.pexels.com/photos/3227986/pexels-photo-3227986.jpeg',
    userType: 'all',
    redemptionInstructions: 'El marco se aplicará automáticamente a tu avatar tras la compra. Puedes activarlo o desactivarlo desde la configuración de tu perfil.'
  },
  {
    id: 'item_name_effect',
    name: 'Nombre Animado Galáctico',
    description: 'Efecto especial para tu nombre de usuario con animación de estrellas y nebulosas.',
    price: 80,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.NAME_EFFECT,
    image: 'https://images.pexels.com/photos/1341279/pexels-photo-1341279.jpeg',
    userType: 'all',
    redemptionInstructions: 'El efecto se aplicará automáticamente a tu nombre de usuario tras la compra. Puedes activarlo o desactivarlo desde la configuración de tu perfil.'
  },
  {
    id: 'item_premium_temp',
    name: 'Pase Temporal a Funciones Premium',
    description: 'Acceso temporal a las funciones premium del rol superior durante 7 días.',
    price: 120,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.PREMIUM_FEATURE,
    image: 'https://images.pexels.com/photos/3761508/pexels-photo-3761508.jpeg',
    userType: 'all',
    redemptionInstructions: 'Las funciones premium se activarán automáticamente en tu cuenta durante 7 días desde el momento de la compra.'
  },
  
  // Competition Advantages
  {
    id: 'item_early_upload',
    name: 'Acceso Anticipado a Subir Sesión',
    description: 'Sube tu sesión a la competición antes que los demás participantes, obteniendo ventaja en visibilidad.',
    price: 100,
    category: StoreCategory.COMPETITION,
    type: StoreItemType.EARLY_ACCESS,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    userType: UserType.DJ,
    redemptionInstructions: 'El acceso anticipado se activará automáticamente en tu próxima competición, permitiéndote subir tu sesión 24 horas antes que el resto de participantes.'
  },
  {
    id: 'item_early_review',
    name: 'Revisión Oficial Anticipada',
    description: 'Obtén una revisión anticipada de tu sesión por parte del equipo oficial antes de la competición.',
    price: 80,
    category: StoreCategory.COMPETITION,
    type: StoreItemType.REVIEW,
    image: 'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg',
    userType: UserType.DJ,
    redemptionInstructions: 'Recibirás un email con instrucciones para enviar tu sesión para revisión anticipada. El equipo te proporcionará feedback antes de la competición.'
  },
  
  // Special Drops
  {
    id: 'item_orion_code',
    name: 'Código Orión',
    description: 'Camiseta firmada por un DJ top. Edición ultra limitada con certificado de autenticidad.',
    price: 300,
    category: StoreCategory.SPECIAL,
    type: StoreItemType.DROP,
    image: 'https://images.pexels.com/photos/1309240/pexels-photo-1309240.jpeg',
    userType: 'all',
    isLimited: true,
    stock: 5,
    isDropItem: true,
    dropName: 'Colección Orión',
    redemptionInstructions: 'Recibirás un email con instrucciones para reclamar tu camiseta firmada. Se requiere verificación de identidad.'
  },
  {
    id: 'item_relic_box',
    name: 'Relic Box',
    description: 'Pack sorpresa con productos exclusivos de sponsors. Cada caja es única y contiene entre 3 y 5 productos.',
    price: 200,
    category: StoreCategory.SPECIAL,
    type: StoreItemType.MYSTERY_BOX,
    image: 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg',
    userType: 'all',
    isLimited: true,
    stock: 20,
    isDropItem: true,
    dropName: 'Tesoros Galácticos',
    redemptionInstructions: 'Recibirás un email con instrucciones para reclamar tu Relic Box. Se requiere dirección de envío.'
  },
  {
    id: 'item_quantum_jump',
    name: 'Quantum Jump',
    description: 'Pase directo a escuadra superior. Válido 1x por temporada con condiciones.',
    price: 500,
    category: StoreCategory.SPECIAL,
    type: StoreItemType.EXCLUSIVE,
    image: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg',
    userType: UserType.DJ,
    isLimited: true,
    stock: 3,
    isDropItem: true,
    dropName: 'Saltos Cuánticos',
    termsAndConditions: 'Solo válido para DJs con al menos 3 meses en la plataforma. El salto de escuadra está sujeto a aprobación y solo puede utilizarse una vez por temporada. No válido para saltar a escuadras de nivel Master.',
    redemptionInstructions: 'Contacta con el equipo de soporte para activar tu Quantum Jump. Se verificará tu elegibilidad antes de aplicar el salto de escuadra.'
  },
  
  // DJ-specific items
  {
    id: 'item_dj_accessory',
    name: 'Accesorios de Cabina Exclusivos',
    description: 'Set de accesorios exclusivos para tu cabina: alfombrilla, cubierta para auriculares y soporte para dispositivos.',
    price: 120,
    category: StoreCategory.PHYSICAL,
    type: StoreItemType.GEAR,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
    userType: UserType.DJ,
    stock: 30
  },
  {
    id: 'item_dj_festival',
    name: 'Pase a Festival Premium',
    description: 'Acceso completo a un festival de música electrónica con pase backstage.',
    price: 350,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.VIP,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    userType: UserType.DJ,
    redemptionInstructions: 'Recibirás un email con tu pase digital y las instrucciones para acceder al festival y la zona backstage.'
  },
  
  // Partygoer-specific items
  {
    id: 'item_partygoer_vip',
    name: 'Acceso VIP Mensual',
    description: 'Acceso VIP a todos los clubs asociados durante un mes completo.',
    price: 200,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.VIP,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    userType: UserType.PARTYGOER,
    redemptionInstructions: 'Tu perfil será actualizado con estatus VIP durante un mes desde la fecha de compra. Muestra tu perfil en la entrada de los clubs para acceder a la zona VIP.'
  },
  {
    id: 'item_partygoer_drinks',
    name: 'Descuento en Bebidas',
    description: '50% de descuento en bebidas en clubs asociados durante un fin de semana.',
    price: 60,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.VIP,
    image: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg',
    userType: UserType.PARTYGOER,
    redemptionInstructions: 'Recibirás un código QR que podrás mostrar en la barra de los clubs asociados para obtener tu descuento. Válido durante un fin de semana a elegir.'
  },
  
  // Club-specific items
  {
    id: 'item_club_analytics',
    name: 'Estadísticas Extra de Big Data',
    description: 'Acceso a estadísticas avanzadas de comportamiento de usuarios durante 30 días.',
    price: 150,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.PREMIUM_FEATURE,
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    userType: UserType.CLUB,
    redemptionInstructions: 'Las estadísticas avanzadas se activarán automáticamente en tu panel de control durante 30 días desde la fecha de compra.'
  },
  {
    id: 'item_club_crowdparty',
    name: 'Mejoras en Crowdparty',
    description: 'Funcionalidades premium para Crowdparty: encuestas personalizadas, temas visuales exclusivos y análisis en tiempo real.',
    price: 120,
    category: StoreCategory.DIGITAL,
    type: StoreItemType.PREMIUM_FEATURE,
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
    userType: UserType.CLUB,
    redemptionInstructions: 'Las mejoras se activarán automáticamente en tu sistema Crowdparty durante 30 días desde la fecha de compra.'
  },
  
  // Reporter-specific items
  {
    id: 'item_reporter_festival',
    name: 'Acceso Anticipado a Festival',
    description: 'Acceso anticipado a un festival para cubrir el evento con pase de prensa.',
    price: 180,
    category: StoreCategory.EXPERIENCE,
    type: StoreItemType.EARLY_ACCESS,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    userType: UserType.REPORTER,
    redemptionInstructions: 'Recibirás un email con tu pase de prensa digital y las instrucciones para acceder al festival antes que el público general.'
  },
  {
    id: 'item_reporter_camera',
    name: 'Cámara Patrocinada',
    description: 'Préstamo de cámara profesional patrocinada para un evento específico.',
    price: 150,
    category: StoreCategory.PHYSICAL,
    type: StoreItemType.GEAR,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
    userType: UserType.REPORTER,
    redemptionInstructions: 'Contacta con el equipo de soporte para coordinar el préstamo de la cámara para el evento que desees cubrir.'
  }
];

// Mock data for store drops
export const STORE_DROPS: StoreDrop[] = [
  {
    id: 'drop_orion',
    name: 'Colección Orión',
    description: 'Productos exclusivos firmados por DJs top. Edición ultra limitada con certificados de autenticidad.',
    startDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    endDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    image: 'https://images.pexels.com/photos/1309240/pexels-photo-1309240.jpeg',
    items: STORE_ITEMS.filter(item => item.dropName === 'Colección Orión'),
    isActive: true
  },
  {
    id: 'drop_relics',
    name: 'Tesoros Galácticos',
    description: 'Cajas misteriosas con productos exclusivos de sponsors. Cada caja es única y contiene entre 3 y 5 productos.',
    startDate: new Date(Date.now() - 86400000 * 1), // 1 day ago
    endDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    image: 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg',
    items: STORE_ITEMS.filter(item => item.dropName === 'Tesoros Galácticos'),
    isActive: true
  },
  {
    id: 'drop_quantum',
    name: 'Saltos Cuánticos',
    description: 'Ventajas exclusivas para la competición. Disponibilidad extremadamente limitada.',
    startDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    endDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
    image: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg',
    items: STORE_ITEMS.filter(item => item.dropName === 'Saltos Cuánticos'),
    isActive: false
  }
];

// Get items by user type
export const getItemsByUserType = (userType: UserType | 'all'): StoreItem[] => {
  return STORE_ITEMS.filter(item => 
    item.userType === userType || item.userType === 'all'
  );
};

// Get items by category
export const getItemsByCategory = (category: StoreCategory): StoreItem[] => {
  return STORE_ITEMS.filter(item => item.category === category);
};

// Get items by type
export const getItemsByType = (type: StoreItemType): StoreItem[] => {
  return STORE_ITEMS.filter(item => item.type === type);
};

// Get active drops
export const getActiveDrops = (): StoreDrop[] => {
  const now = new Date();
  return STORE_DROPS.filter(drop => 
    drop.startDate <= now && drop.endDate >= now
  );
};

// Get drop by ID
export const getDropById = (id: string): StoreDrop | undefined => {
  return STORE_DROPS.find(drop => drop.id === id);
};

// Get item by ID
export const getItemById = (id: string): StoreItem | undefined => {
  return STORE_ITEMS.find(item => item.id === id);
};

// Search items
export const searchItems = (query: string): StoreItem[] => {
  const searchTerm = query.toLowerCase();
  return STORE_ITEMS.filter(item => 
    item.name.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm) ||
    item.type.toLowerCase().includes(searchTerm)
  );
};