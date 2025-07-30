import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Clock, AlertTriangle, Tag, Gift, Zap, Award, Info, Check, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { StoreItem, StoreCategory, StoreItemType } from '../../types/store';
import { useStoreStore } from '../../stores/storeStore';
import { useAuthStore } from '../../stores/authStore';

interface StoreItemDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreItemDetail: React.FC<StoreItemDetailProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { selectedItem, addToCart, getItemStock } = useStoreStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  if (!selectedItem) return null;
  
  const stock = getItemStock(selectedItem.id);
  const isOutOfStock = stock === 0;
  const maxQuantity = Math.min(stock, 5); // Limit to 5 or available stock
  
  const getCategoryName = () => {
    switch (selectedItem.category) {
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
        return selectedItem.category;
    }
  };
  
  const getTypeName = () => {
    switch (selectedItem.type) {
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
        return selectedItem.type;
    }
  };
  
  const getCategoryIcon = () => {
    switch (selectedItem.category) {
      case StoreCategory.PHYSICAL:
        return <ShoppingBag size={20} className="text-blue-400" />;
      case StoreCategory.EXPERIENCE:
        return <Star size={20} className="text-purple-400" />;
      case StoreCategory.DIGITAL:
        return <Zap size={20} className="text-cyan-400" />;
      case StoreCategory.COMPETITION:
        return <Award size={20} className="text-yellow-400" />;
      case StoreCategory.SPECIAL:
        return <Gift size={20} className="text-pink-400" />;
      default:
        return <Tag size={20} className="text-indigo-400" />;
    }
  };
  
  const handleAddToCart = () => {
    addToCart(selectedItem.id, quantity);
    setAdded(true);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };
  
  const canAfford = user && user.beatcoins >= selectedItem.price * quantity;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card rounded-xl max-w-4xl w-full relative overflow-hidden"
          >
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Item Image */}
              <div className="aspect-square rounded-lg overflow-hidden relative">
                <img 
                  src={selectedItem.image} 
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay for limited items */}
                {selectedItem.isLimited && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500/70 to-orange-500/70 py-1 px-3 flex items-center justify-center">
                    <Clock size={14} className="text-white mr-1" />
                    <span className="text-xs text-white font-medium">
                      {selectedItem.stock ? `¡Solo quedan ${selectedItem.stock}!` : 'Edición Limitada'}
                    </span>
                  </div>
                )}
                
                {/* Category badge */}
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                  {getCategoryIcon()}
                  <span className="ml-1">{getCategoryName()}</span>
                </div>
                
                {/* Type badge */}
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {getTypeName()}
                </div>
                
                {/* Drop badge */}
                {selectedItem.isDropItem && (
                  <div className="absolute bottom-2 right-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    DROP
                  </div>
                )}
              </div>
              
              {/* Item Info */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                
                {/* Entity info */}
                {selectedItem.entityName && (
                  <div className="flex items-center text-sm mb-4">
                    {selectedItem.entityLogo ? (
                      <img 
                        src={selectedItem.entityLogo} 
                        alt={selectedItem.entityName}
                        className="w-5 h-5 object-contain mr-2"
                      />
                    ) : (
                      <Tag size={16} className="mr-2 text-gray-400" />
                    )}
                    <span className="text-gray-400">Por {selectedItem.entityName}</span>
                  </div>
                )}
                
                <p className="text-gray-300 mb-6">{selectedItem.description}</p>
                
                {/* Price */}
                <div className="flex items-center mb-6">
                  <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30 flex items-center">
                    <Star size={18} className="text-yellow-400 mr-2" />
                    <span className="font-bold text-xl text-yellow-400">{selectedItem.price}</span>
                    <span className="ml-2 text-gray-300">Beatcoins</span>
                  </div>
                  
                  {!canAfford && (
                    <div className="ml-3 flex items-center text-red-400 text-sm">
                      <AlertTriangle size={14} className="mr-1" />
                      <span>No tienes suficientes Beatcoins</span>
                    </div>
                  )}
                </div>
                
                {/* Additional Info */}
                <div className="space-y-3 mb-6">
                  {/* Stock */}
                  {selectedItem.stock !== undefined && (
                    <div className="flex items-center text-sm">
                      <Package size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {isOutOfStock 
                          ? 'Agotado' 
                          : `${selectedItem.stock} unidades disponibles`}
                      </span>
                    </div>
                  )}
                  
                  {/* Expiration */}
                  {selectedItem.expiresAt && (
                    <div className="flex items-center text-sm">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        Expira el {selectedItem.expiresAt.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {/* Entity Location */}
                  {selectedItem.category === StoreCategory.EXPERIENCE && (
                    <div className="flex items-center text-sm">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        Válido en clubs asociados
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Redemption Instructions */}
                {selectedItem.redemptionInstructions && (
                  <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 mb-6">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Info size={16} className="mr-2 text-indigo-400" />
                      Instrucciones de Canje
                    </h3>
                    <p className="text-sm text-gray-300">{selectedItem.redemptionInstructions}</p>
                  </div>
                )}
                
                {/* Terms and Conditions */}
                {selectedItem.termsAndConditions && (
                  <div className="p-4 bg-gray-800/50 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Términos y Condiciones</h3>
                    <p className="text-sm text-gray-400">{selectedItem.termsAndConditions}</p>
                  </div>
                )}
                
                {/* Add to Cart */}
                <div className="mt-auto flex items-center">
                  {!isOutOfStock && (
                    <>
                      <div className="flex items-center mr-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-l-lg"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <div className="w-10 h-8 flex items-center justify-center bg-gray-800">
                          {quantity}
                        </div>
                        <button
                          onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-r-lg"
                          disabled={quantity >= maxQuantity}
                        >
                          +
                        </button>
                      </div>
                      
                      <button
                        onClick={handleAddToCart}
                        disabled={!canAfford || isOutOfStock}
                        className={`flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center ${
                          !canAfford || isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {added ? (
                          <>
                            <Check size={18} className="mr-2" />
                            Añadido al Carrito
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} className="mr-2" />
                            Añadir al Carrito
                          </>
                        )}
                      </button>
                    </>
                  )}
                  
                  {isOutOfStock && (
                    <button
                      disabled
                      className="flex-1 bg-gray-800 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                    >
                      <AlertTriangle size={18} className="mr-2 inline" />
                      Agotado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreItemDetail;