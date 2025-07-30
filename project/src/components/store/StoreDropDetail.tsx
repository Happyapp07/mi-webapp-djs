import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Clock, Star, Package, Gift, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useStoreStore } from '../../stores/storeStore';
import StoreItemCard from './StoreItemCard';
import StoreItemDetail from './StoreItemDetail';

const StoreDropDetail: React.FC = () => {
  const { dropId } = useParams<{ dropId: string }>();
  const { fetchDropById, selectedDrop, isLoading, error } = useStoreStore();
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  useEffect(() => {
    if (dropId) {
      fetchDropById(dropId);
    }
  }, [dropId, fetchDropById]);
  
  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!selectedDrop) return '';
    
    const now = new Date();
    const timeRemaining = selectedDrop.endDate.getTime() - now.getTime();
    
    if (timeRemaining <= 0) return 'Finalizado';
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h restantes`;
  };
  
  // Calculate progress
  const getProgress = () => {
    if (!selectedDrop) return 0;
    
    const now = new Date();
    const totalDuration = selectedDrop.endDate.getTime() - selectedDrop.startDate.getTime();
    const elapsed = now.getTime() - selectedDrop.startDate.getTime();
    
    return Math.min(Math.max(elapsed / totalDuration, 0), 1) * 100;
  };
  
  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowItemDetail(true);
  };
  
  const handleCloseItemDetail = () => {
    setShowItemDetail(false);
    setSelectedItemId(null);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (error || !selectedDrop) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Link
          to="/store"
          className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver a la Tienda
        </Link>
        
        <div className="glass-card p-6 rounded-xl text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-medium mb-2">Drop no encontrado</h3>
          <p className="text-gray-400">{error || 'El drop que buscas no existe o ha expirado.'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        to="/store"
        className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver a la Tienda
      </Link>
      
      {/* Drop Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl overflow-hidden mb-8 relative"
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="relative z-10">
          {/* Drop Banner */}
          <div className="aspect-video relative">
            <img 
              src={selectedDrop.image} 
              alt={selectedDrop.name}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            
            {/* Drop Badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center">
              <Rocket size={16} className="mr-2" />
              DROP ESTELAR
            </div>
            
            {/* Time Remaining */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center">
              <Clock size={16} className="mr-2" />
              <span>{getTimeRemaining()}</span>
            </div>
            
            {/* Drop Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl font-bold text-white mb-2">{selectedDrop.name}</h1>
              <p className="text-gray-300 max-w-2xl">{selectedDrop.description}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-800">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${getProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* Drop Stats */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center mb-2">
                <Package size={20} className="text-indigo-400 mr-2" />
                <h3 className="font-medium">Productos Exclusivos</h3>
              </div>
              <div className="text-2xl font-bold">{selectedDrop.items.length}</div>
              <div className="text-sm text-gray-400">Artículos únicos y limitados</div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock size={20} className="text-yellow-400 mr-2" />
                <h3 className="font-medium">Disponibilidad</h3>
              </div>
              <div className="text-2xl font-bold">{getTimeRemaining()}</div>
              <div className="text-sm text-gray-400">
                {new Date(selectedDrop.startDate).toLocaleDateString()} - {new Date(selectedDrop.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center mb-2">
                <Star size={20} className="text-purple-400 mr-2" />
                <h3 className="font-medium">Precios</h3>
              </div>
              <div className="text-2xl font-bold">
                {Math.min(...selectedDrop.items.map(item => item.price))} - {Math.max(...selectedDrop.items.map(item => item.price))} BC
              </div>
              <div className="text-sm text-gray-400">Rango de precios en Beatcoins</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Drop Items */}
      <h2 className="text-2xl font-display mb-6 flex items-center">
        <Gift size={24} className="mr-2 text-indigo-400" />
        Productos Exclusivos
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedDrop.items.map(item => (
          <StoreItemCard 
            key={item.id} 
            item={item} 
            onClick={() => handleItemClick(item.id)} 
          />
        ))}
      </div>
      
      {/* Item Detail Modal */}
      {selectedItemId && (
        <StoreItemDetail 
          isOpen={showItemDetail} 
          onClose={handleCloseItemDetail} 
        />
      )}
    </div>
  );
};

export default StoreDropDetail;