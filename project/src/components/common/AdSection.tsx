import React from 'react';
import { motion } from 'framer-motion';
import AdBanner from './AdBanner';

interface AdSectionProps {
  position: 'top' | 'sidebar' | 'footer';
  className?: string;
}

const AdSection: React.FC<AdSectionProps> = ({ position, className = '' }) => {
  // Mock brand data - in a real app this would come from an ad service
  const brands = [
    {
      name: 'Pioneer DJ',
      logo: 'https://logos-world.net/wp-content/uploads/2023/03/Pioneer-DJ-Logo.png',
      url: 'https://www.pioneerdj.com',
      description: 'Professional DJ equipment for every level'
    },
    {
      name: 'Native Instruments',
      logo: 'https://logos-world.net/wp-content/uploads/2023/02/Native-Instruments-Logo.png',
      url: 'https://www.native-instruments.com',
      description: 'Create the future of music'
    },
    {
      name: 'Red Bull',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Red-Bull-Logo.png',
      url: 'https://www.redbull.com',
      description: 'Energize your night'
    }
  ];

  const getAdType = () => {
    switch (position) {
      case 'top':
        return 'horizontal';
      case 'sidebar':
        return 'vertical';
      case 'footer':
        return 'square';
      default:
        return 'horizontal';
    }
  };

  // Randomly select a brand
  const selectedBrand = brands[Math.floor(Math.random() * brands.length)];

  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <AdBanner 
        type={getAdType()}
        brand={selectedBrand}
      />
    </motion.div>
  );
};

export default AdSection;