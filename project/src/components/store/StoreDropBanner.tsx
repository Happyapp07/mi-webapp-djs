import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Rocket, Star, Package, Gift } from 'lucide-react';
import { StoreDrop } from '../../types/store';
import { Link } from 'react-router-dom';

interface StoreDropBannerProps {
  drop: StoreDrop;
}

const StoreDropBanner: React.FC<StoreDropBannerProps> = ({ drop }) => {
  // Calculate time remaining
  const now = new Date();
  const timeRemaining = drop.endDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  
  // Calculate progress
  const totalDuration = drop.endDate.getTime() - drop.startDate.getTime();
  const elapsed = now.getTime() - drop.startDate.getTime();
  const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1) * 100;
  
  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden relative"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        {/* Image */}
        <div className="aspect-video relative">
          <img 
            src={drop.image} 
            alt={drop.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Drop Badge */}
          <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
            <Rocket size={12} className="mr-1" />
            DROP ESTELAR
          </div>
          
          {/* Time Remaining */}
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center">
            <Clock size={12} className="mr-1" />
            {daysRemaining > 0 ? `${daysRemaining} días restantes` : 'Último día'}
          </div>
          
          {/* Drop Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white mb-1">{drop.name}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{drop.description}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Items Preview */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-400">
              <Package size={14} className="inline mr-1" />
              {drop.items.length} productos exclusivos
            </div>
            <div className="text-sm text-yellow-400 flex items-center">
              <Star size={14} className="mr-1" />
              Desde {Math.min(...drop.items.map(item => item.price))} BC
            </div>
          </div>
          
          <Link
            to={`/store/drops/${drop.id}`}
            className="w-full glassmorphism-primary-button px-4 py-2 flex items-center justify-center"
          >
            <Gift size={16} className="mr-2" />
            Ver Drop
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreDropBanner;