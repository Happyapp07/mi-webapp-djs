import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, Shield, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };
  
  if (!user) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 w-48 glassmorphism rounded-lg shadow-lg py-1 z-50 border border-cyan-500/30"
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          <div className="scanner-effect"></div>
          
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img 
                  src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">{user.username}</div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </div>
            </div>
          </div>
          
          <Link
            to={`/profile/${user.id}`}
            className="block px-4 py-2 text-sm hover:bg-cyan-500/20 text-cyan-400 relative z-10 flex items-center"
            onClick={onClose}
          >
            <User size={16} className="mr-2" />
            Mi Perfil
          </Link>
          
          <Link
            to="/profile/referrals"
            className="block px-4 py-2 text-sm hover:bg-cyan-500/20 text-cyan-400 relative z-10 flex items-center"
            onClick={onClose}
          >
            <UserPlus size={16} className="mr-2" />
            Invitar Amigos
          </Link>
          
          <Link
            to="/account-settings"
            className="block px-4 py-2 text-sm hover:bg-cyan-500/20 text-cyan-400 relative z-10 flex items-center"
            onClick={onClose}
          >
            <Settings size={16} className="mr-2" />
            Configuración
          </Link>
          
          <Link
            to="/connected-accounts"
            className="block px-4 py-2 text-sm hover:bg-cyan-500/20 text-cyan-400 relative z-10 flex items-center"
            onClick={onClose}
          >
            <Shield size={16} className="mr-2" />
            Cuentas Conectadas
          </Link>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 flex items-center relative z-10"
          >
            <LogOut size={16} className="mr-2" />
            Cerrar Sesión
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;