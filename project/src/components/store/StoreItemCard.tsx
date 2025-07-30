import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Clock, AlertTriangle, Tag, Gift, Zap, Award } from 'lucide-react';
import { StoreItem, StoreCategory, StoreItemType } from '../../types/store';
import { useStoreStore } from '../../stores/storeStore';

interface StoreItemCardProps {
  item: StoreItem;
  onClick: () => void;
}

const StoreItemCard: React.FC<StoreItemCardProps> = ({ item, onClick }) => {
  const { addToCart } = useStoreStore();
  
  const getCategoryIcon = () => {
    switch (item.category) {
      case StoreCategory.PHYSICAL:
        return <ShoppingBag size={16} className="text-blue-400" />;
      case StoreCategory.EXPERIENCE:
        return <Star size={16} className="text-purple-400" />;
      case StoreCategory.DIGITAL:
        return <Zap size={16} className="text-cyan-400" />;
      case StoreCategory.COMPETITION:
        return <Award size={16} className="text-yellow-400" />;
      case StoreCategory.SPECIAL:
        return <Gift size={16} className="text-pink-400" />;
      default:
        return <Tag size={16} className="text-indigo-400" />;
    }
  };
  
  const getCategoryName = () => {
    switch (item.category) {
      case StoreCategory.PHYSICAL:
        return 'Físico';
      case StoreCategory.EXPERIENCE:
        return 'Experiencia';
      case StoreCategory.DIGITAL:
        return 'Digital';
      case StoreCategory.COMPETITION:
        return 'Competición';
      case StoreCategory.SPECIAL:
        return 'Especial';
      default:
        return item.category;
    }
  };
  
  const getTypeName = () => {
    switch (item.type) {
      case StoreItemType.MERCHANDISE:
        return 'Merchandising';
      case StoreItemType.CLOTHING:
        return 'Ropa';
      case StoreItemType.ACCESSORY:
        return 'Accesorio';
      case StoreItemType.GEAR:
        return 'Equipamiento';
      case StoreItemType.ENTRY:
        return 'Entrada';
      case StoreItemType.VIP:
        return 'VIP';
      case StoreItemType.MEET_GREET:
        return 'Meet & Greet';
      case StoreItemType.DINNER:
        return 'Cena';
      case StoreItemType.AVATAR_FRAME:
        return 'Marco de Avatar';
      case StoreItemType.NAME_EFFECT:
        return 'Efecto de Nombre';
      case StoreItemType.PROFILE_BADGE:
        return 'Insignia de Perfil';
      case StoreItemType.PREMIUM_FEATURE:
        return 'Función Premium';
      case StoreItemType.EARLY_ACCESS:
        return 'Acceso Anticipado';
      case StoreItemType.REVIEW:
        return 'Revisión';
      case StoreItemType.VISIBILITY_BOOST:
        return 'Boost de Visibilidad';
      case StoreItemType.DROP:
        return 'Drop Exclusivo';
      case StoreItemType.MYSTERY_BOX:
        return 'Caja Misteriosa';
      case StoreItemType.EXCLUSIVE:
        return 'Exclusivo';
      default:
        return item.type;
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item.id, 1);
  };
  
  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden cursor-pointer relative"
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      {/* Item Image */}
      <div className="aspect-square relative">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for limited items */}
        {item.isLimited && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500/70 to-orange-500/70 py-1 px-3 flex items-center justify-center">
            <Clock size={14} className="text-white mr-1" />
            <span className="text-xs text-white font-medium">
              {item.stock ? `¡Solo quedan ${item.stock}!` : 'Edición Limitada'}
            </span>
          </div>
        )}
        
        {/* New badge */}
        {item.isNew && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NUEVO
          </div>
        )}
        
        {/* Featured badge */}
        {item.isFeatured && (
          <div className="absolute bottom-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            DESTACADO
          </div>
        )}
        
        {/* Drop badge */}
        {item.isDropItem && (
          <div className="absolute bottom-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            DROP
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
          {getCategoryIcon()}
          <span className="ml-1">{getCategoryName()}</span>
        </div>
      </div>
      
      {/* Item Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Tag size={14} className="mr-1" />
          <span>{getTypeName()}</span>
        </div>
        
        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Star size={16} className="text-yellow-400 mr-1" />
            <span className="font-bold text-yellow-400">{item.price}</span>
            <span className="text-yellow-400 ml-1">BC</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors flex items-center"
          >
            <ShoppingBag size={14} className="mr-1" />
            Añadir
          </button>
        </div>
        
        {/* Out of stock warning */}
        {item.stock === 0 && (
          <div className="mt-2 flex items-center text-red-400 text-sm">
            <AlertTriangle size={14} className="mr-1" />
            <span>Agotado</span>
          </div>
        )}
        
        {/* Entity info */}
        {item.entityName && (
          <div className="mt-2 flex items-center text-sm">
            {item.entityLogo ? (
              <img 
                src={item.entityLogo} 
                alt={item.entityName}
                className="w-4 h-4 object-contain mr-1"
              />
            ) : (
              <Tag size={14} className="mr-1 text-gray-400" />
            )}
            <span className="text-gray-400">Por {item.entityName}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StoreItemCard;