import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, Check, X, AlertTriangle, Download, ExternalLink, QrCode, ShoppingBag, Star } from 'lucide-react';
import { useStoreStore } from '../../stores/storeStore';
import { useAuthStore } from '../../stores/authStore';
import { OrderStatus, getItemById } from '../../types/store';

const StoreOrderHistory: React.FC = () => {
  const { user } = useAuthStore();
  const { userOrders, fetchUserOrders, cancelOrder, redeemItem, isLoading, error } = useStoreStore();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [redemptionCode, setRedemptionCode] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id);
    }
  }, [user, fetchUserOrders]);
  
  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };
  
  const handleRedeemItem = async (orderId: string) => {
    try {
      const code = await redeemItem(orderId);
      setRedemptionCode(code);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error redeeming item:', error);
    }
  };
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return (
          <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs flex items-center">
            <Clock size={12} className="mr-1" />
            Pendiente
          </div>
        );
      case OrderStatus.PROCESSING:
        return (
          <div className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs flex items-center">
            <Package size={12} className="mr-1" />
            Procesando
          </div>
        );
      case OrderStatus.SHIPPED:
        return (
          <div className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs flex items-center">
            <Package size={12} className="mr-1" />
            Enviado
          </div>
        );
      case OrderStatus.DELIVERED:
        return (
          <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center">
            <Check size={12} className="mr-1" />
            Entregado
          </div>
        );
      case OrderStatus.REDEEMED:
        return (
          <div className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs flex items-center">
            <Check size={12} className="mr-1" />
            Canjeado
          </div>
        );
      case OrderStatus.CANCELLED:
        return (
          <div className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center">
            <X size={12} className="mr-1" />
            Cancelado
          </div>
        );
      default:
        return (
          <div className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
            {status}
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card p-6 rounded-xl text-center">
        <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-medium mb-2">Error al cargar pedidos</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }
  
  if (userOrders.length === 0) {
    return (
      <div className="glass-card p-8 rounded-xl text-center">
        <Package size={48} className="mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-medium mb-2">No tienes pedidos</h3>
        <p className="text-gray-400">
          Explora la tienda y canjea tus Beatcoins por recompensas exclusivas
        </p>
        <button
          onClick={() => window.location.href = '/store'}
          className="mt-4 glassmorphism-primary-button px-6 py-2.5 inline-flex items-center"
        >
          <ShoppingBag size={18} className="mr-2" />
          Ir a la Tienda
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-display mb-4 flex items-center">
        <Package size={24} className="mr-2 text-indigo-400" />
        Mis Pedidos
      </h2>
      
      {userOrders.map((order) => {
        const item = getItemById(order.itemId);
        if (!item) return null;
        
        const isSelected = selectedOrder === order.id;
        
        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-xl relative overflow-hidden"
          >
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Item Image */}
                <div className="w-full md:w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Order Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <div className="text-sm text-gray-400">
                        Pedido el {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <Star size={16} className="text-yellow-400 mr-1" />
                    <span className="font-bold text-yellow-400">{order.totalPrice}</span>
                    <span className="text-yellow-400 ml-1">BC</span>
                    
                    {order.quantity > 1 && (
                      <span className="ml-2 text-sm text-gray-400">
                        x{order.quantity}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Order Actions */}
                <div className="flex flex-col md:flex-row gap-2">
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                  
                  {order.status === OrderStatus.PENDING && (
                    <button
                      onClick={() => handleRedeemItem(order.id)}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded hover:bg-indigo-500/30 transition-colors text-sm"
                    >
                      Canjear
                    </button>
                  )}
                  
                  {order.status === OrderStatus.REDEEMED && order.redemptionCode && (
                    <button
                      onClick={() => {
                        setRedemptionCode(order.redemptionCode);
                        setSelectedOrder(order.id);
                      }}
                      className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors text-sm flex items-center"
                    >
                      <QrCode size={14} className="mr-1" />
                      Ver Código
                    </button>
                  )}
                </div>
              </div>
              
              {/* Redemption Code */}
              {isSelected && redemptionCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/30"
                >
                  <h4 className="font-medium mb-2 flex items-center">
                    <QrCode size={16} className="mr-2 text-green-400" />
                    Código de Canje
                  </h4>
                  
                  <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg mb-3">
                    <div className="font-mono text-lg text-green-400">{redemptionCode}</div>
                    <button
                      onClick={() => navigator.clipboard.writeText(redemptionCode)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <Download size={16} className="text-gray-400" />
                    </button>
                  </div>
                  
                  {item.redemptionInstructions && (
                    <div className="text-sm text-gray-300">
                      <strong>Instrucciones:</strong> {item.redemptionInstructions}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StoreOrderHistory;