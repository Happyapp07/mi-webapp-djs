import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Star, AlertTriangle, Check, Package, Gift } from 'lucide-react';
import { useStoreStore } from '../../stores/storeStore';
import { useAuthStore } from '../../stores/authStore';
import { getItemById } from '../../types/store';

interface StoreCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const StoreCart: React.FC<StoreCartProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { cart, removeFromCart, clearCart, getCartTotal, purchaseItems } = useStoreStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const cartTotal = getCartTotal();
  const canAfford = user && user.beatcoins >= cartTotal;
  
  const handlePurchase = async () => {
    if (!canAfford) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await purchaseItems();
      
      setSuccess(true);
      
      // Close after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar la compra');
    } finally {
      setIsLoading(false);
    }
  };
  
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
            className="glass-card rounded-xl max-w-md w-full relative overflow-hidden"
          >
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="relative z-10 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                  <ShoppingBag size={20} className="text-indigo-400 relative z-10" />
                  <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                </div>
                <h2 className="text-xl font-bold">Carrito de Compra</h2>
              </div>
              
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center"
                >
                  <Check size={20} className="text-green-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-400">¡Compra realizada con éxito!</h3>
                    <p className="text-sm text-gray-300">Tus productos han sido añadidos a tu inventario.</p>
                  </div>
                </motion.div>
              )}
              
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start"
                >
                  <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-red-400">{error}</span>
                </motion.div>
              )}
              
              {/* Cart Items */}
              {cart.length > 0 ? (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 mb-6">
                  {cart.map((cartItem) => {
                    const item = getItemById(cartItem.itemId);
                    if (!item) return null;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center text-sm text-gray-400">
                              <Star size={14} className="text-yellow-400 mr-1" />
                              <span>{item.price} BC</span>
                              {cartItem.quantity > 1 && (
                                <span className="ml-1">x{cartItem.quantity}</span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 mb-6">
                  <ShoppingBag size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-400">
                    Añade productos a tu carrito para continuar
                  </p>
                </div>
              )}
              
              {/* Cart Summary */}
              {cart.length > 0 && (
                <>
                  <div className="flex justify-between items-center mb-6 p-4 bg-gray-800/50 rounded-lg">
                    <div className="font-medium">Total</div>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 mr-1" />
                      <span className="font-bold text-yellow-400">{cartTotal}</span>
                      <span className="text-yellow-400 ml-1">BC</span>
                    </div>
                  </div>
                  
                  {/* Not enough Beatcoins warning */}
                  {!canAfford && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center">
                      <AlertTriangle size={20} className="text-red-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-red-400">Beatcoins insuficientes</h3>
                        <p className="text-sm text-gray-300">
                          Necesitas {cartTotal} BC para completar esta compra. Actualmente tienes {user?.beatcoins || 0} BC.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 glassmorphism-button px-4 py-2"
                      disabled={isLoading}
                    >
                      Vaciar
                    </button>
                    <button
                      onClick={handlePurchase}
                      disabled={!canAfford || isLoading || cart.length === 0}
                      className={`flex-1 glassmorphism-primary-button px-4 py-2 flex items-center justify-center ${
                        !canAfford || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : success ? (
                        <>
                          <Check size={18} className="mr-2" />
                          Comprado
                        </>
                      ) : (
                        <>
                          <Gift size={18} className="mr-2" />
                          Comprar
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StoreCart;