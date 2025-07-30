import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  type: 'horizontal' | 'vertical' | 'square';
  brand: {
    name: string;
    logo: string;
    url: string;
    description?: string;
  };
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type, brand, className = '' }) => {
  const dimensions = {
    horizontal: 'h-24 md:h-32',
    vertical: 'h-96',
    square: 'h-64'
  };

  return (
    <motion.a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative overflow-hidden rounded-xl ${dimensions[type]} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50">
        <img 
          src={brand.logo} 
          alt={brand.name}
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <img 
            src={brand.logo} 
            alt={brand.name}
            className="h-12 object-contain"
          />
          <div className="flex items-center text-xs text-gray-400">
            <span>Sponsored</span>
            <ExternalLink size={12} className="ml-1" />
          </div>
        </div>

        {brand.description && (
          <p className="text-sm text-gray-300 mt-2 line-clamp-2">
            {brand.description}
          </p>
        )}
      </div>
    </motion.a>
  );
};

export default AdBanner;