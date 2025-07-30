import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Filter, Search, Tag, Gift, Star, Clock, AlertTriangle, Package, Rocket, Zap } from 'lucide-react';
import { useStoreStore } from '../stores/storeStore';
import { useAuthStore } from '../stores/authStore';
import { StoreCategory, StoreItemType } from '../types/store';
import StoreItemCard from '../components/store/StoreItemCard';
import StoreItemDetail from '../components/store/StoreItemDetail';
import StoreDropBanner from '../components/store/StoreDropBanner';
import StoreFilters from '../components/store/StoreFilters';
import StoreCart from '../components/store/StoreCart';
import StoreOrderHistory from '../components/store/StoreOrderHistory';

const StorePage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    fetchItems, 
    fetchUserOrders, 
    fetchActiveDrops,
    filteredItems, 
    activeDrops,
    selectedItem,
    cart,
    isLoading,
    error,
    updateFilters,
    getCartItemCount,
    getCartTotal
  } = useStoreStore();
  
  const [activeTab, setActiveTab] = useState<'store' | 'orders'>('store');
  const [showCart, setShowCart] = useState(false);
  const [showItemDetail, setShowItemDetail] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchItems();
      fetchUserOrders(user.id);
      fetchActiveDrops();
    }
  }, [user, fetchItems, fetchUserOrders, fetchActiveDrops]);
  
  const handleItemClick = (itemId: string) => {
    // Set selected item
    const item = filteredItems.find(item => item.id === itemId);
    if (item) {
      useStoreStore.setState({ selectedItem: item });
      setShowItemDetail(true);
    }
  };
  
  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setTimeout(() => {
      useStoreStore.setState({ selectedItem: null });
    }, 300);
  };
  
  const cartItemCount = getCartItemCount();
  const cartTotal = getCartTotal();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
            <ShoppingBag size={24} className="text-indigo-400 relative z-10" />
            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
          </div>
          <div>
            <h1 className="text-3xl font-display neon-text">Tienda Galáctica</h1>
            <p className="text-gray-400 mt-2">
              Canjea tus Beatcoins por recompensas exclusivas
            </p>
          </div>
        </div>
        
        {/* User Beatcoins */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-lg border border-yellow-500/30 flex items-center">
              <Star size={18} className="text-yellow-400 mr-2" />
              <span className="font-bold text-xl text-yellow-400">{user?.beatcoins || 0}</span>
              <span className="ml-2 text-gray-300">Beatcoins disponibles</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative glassmorphism-button px-4 py-2 flex items-center"
            >
              <ShoppingBag size={18} className="mr-2" />
              <span>Carrito</span>
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-xs text-white">
                  {cartItemCount}
                </div>
              )}
            </button>
            
            {/* Tabs */}
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-4 py-2 ${
                  activeTab === 'store' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Tienda
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 ${
                  activeTab === 'orders' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Mis Pedidos
              </button>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
        >
          <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}
      
      {activeTab === 'store' ? (
        <>
          {/* Active Drops */}
          {activeDrops.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-display mb-4 flex items-center">
                <Rocket size={24} className="mr-2 text-indigo-400" />
                Drops Estelares
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeDrops.map(drop => (
                  <StoreDropBanner key={drop.id} drop={drop} />
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters */}
            <div className="lg:col-span-1">
              <StoreFilters />
            </div>
            
            {/* Items Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <StoreItemCard 
                      key={item.id} 
                      item={item} 
                      onClick={() => handleItemClick(item.id)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
                  <p className="text-gray-400">
                    Prueba a ajustar los filtros o busca algo diferente
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <StoreOrderHistory />
      )}
      
      {/* Item Detail Modal */}
      {selectedItem && (
        <StoreItemDetail 
          isOpen={showItemDetail} 
          onClose={handleCloseItemDetail} 
        />
      )}
      
      {/* Cart Modal */}
      <StoreCart 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
      />
    </div>
  );
};

export default StorePage;