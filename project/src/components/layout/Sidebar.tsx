import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, UserPlus } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  active: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  navItems: NavItem[];
  alwaysVisible?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, navItems, alwaysVisible = false }) => {
  const sidebarVariants = {
    closed: { x: '-100%', opacity: 0 },
    open: { x: 0, opacity: 1 }
  };
  
  const location = useLocation();
  const [isGalaxyPage, setIsGalaxyPage] = useState(false);
  
  // Check if we're on the Galaxy page
  useEffect(() => {
    setIsGalaxyPage(location.pathname === '/galaxy');
  }, [location.pathname]);
  
  // Add Entities link to nav items if not already present
  const allNavItems = [...navItems];
  if (!navItems.some(item => item.path === '/entities')) {
    allNavItems.push({
      name: 'Entities',
      path: '/entities',
      icon: <Building2 size={20} className="text-cyan-400" />,
      active: location.pathname === '/entities'
    });
  }
  
  // Add Referrals link
  if (!navItems.some(item => item.path === '/profile/referrals')) {
    allNavItems.push({
      name: 'Invitar',
      path: '/profile/referrals',
      icon: <UserPlus size={20} className="text-green-400" />,
      active: location.pathname === '/profile/referrals'
    });
  }
  
  return (
    <>
      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            
            <motion.div
              className="fixed top-0 left-0 bottom-0 w-72 glassmorphism z-50 py-20 px-4 md:hidden border-r border-cyan-500/30"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="hologram-grid absolute inset-0 opacity-20"></div>
              <div className="scanner-effect"></div>
              
              <button 
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-cyan-500/20 neon-border"
                onClick={toggleSidebar}
                aria-label="Close menu"
              >
                <X size={20} className="text-cyan-400" />
              </button>
              
              <div className="space-y-6 relative z-10">
                <div className="text-center mb-8">
                  <div className="text-lg font-display neon-text">NAVIGATION</div>
                  <div className="text-xs text-cyan-400/70 font-mono">CONTROL PANEL</div>
                </div>
                
                {allNavItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all relative overflow-hidden ${
                        item.active 
                          ? 'glassmorphism glassmorphism-hover text-cyan-400 neon-border' 
                          : 'hover:bg-cyan-500/10 text-cyan-400/70 hover:text-cyan-400'
                      }`}
                      onClick={toggleSidebar}
                    >
                      {item.active && <div className="absolute inset-0 holographic-bg"></div>}
                      
                      {/* Glassmorphism icon container */}
                      <div className={`
                        relative z-10 w-10 h-10 flex items-center justify-center rounded-xl mr-3
                        backdrop-blur-md border border-cyan-500/30
                        bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                        shadow-[0_0_15px_rgba(0,255,255,0.3)]
                        ${item.active ? 'shadow-[0_0_20px_rgba(0,255,255,0.5)]' : ''}
                      `}>
                        {item.icon}
                        
                        {/* Inner glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                        
                        {/* Animated scanner line */}
                        {item.active && (
                          <div className="absolute inset-0 overflow-hidden rounded-xl">
                            <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scanner-line_2s_linear_infinite]"></div>
                          </div>
                        )}
                      </div>
                      
                      <span className="relative z-10 font-medium">{item.name}</span>
                      
                      {item.active && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 ml-auto rounded-full bg-cyan-500 energy-pulse relative z-10"
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar (Fixed) - Always visible */}
      <div 
        className="hidden md:block fixed left-0 top-16 bottom-0 w-20 transition-all duration-300 z-30"
      >
        <motion.div 
          className="glassmorphism border-r border-cyan-500/30 flex flex-col items-center py-6 w-20 h-full"
          initial={false}
          animate={{ 
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="hologram-grid absolute inset-0 opacity-20"></div>
          
          <div className="flex flex-col items-center space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] py-2 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent">
            {allNavItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group mb-0 w-full flex justify-center"
              >
                <Link
                  to={item.path}
                  className={`p-3 rounded-lg relative group transition-all duration-300 block ${
                    item.active ? 'text-cyan-400' : 'text-cyan-400/60 hover:text-cyan-400'
                  }`}
                >
                  {/* Glassmorphism icon container */}
                  <div className={`
                    relative z-10 w-10 h-10 flex items-center justify-center rounded-xl
                    backdrop-blur-md border border-cyan-500/30
                    bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                    shadow-[0_0_15px_rgba(0,255,255,0.3)]
                    transition-all duration-300
                    ${item.active ? 'energy-pulse' : ''}
                    group-hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]
                    group-hover:border-cyan-500/50
                  `}>
                    {item.icon}
                    
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                    
                    {/* Animated scanner line */}
                    {item.active && (
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scanner-line_2s_linear_infinite]"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-3 px-3 py-2 glassmorphism rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-cyan-500/30">
                    <div className="hologram-grid absolute inset-0 opacity-20"></div>
                    <span className="relative z-10 text-cyan-400">{item.name}</span>
                  </div>
                  
                  {item.active && (
                    <motion.div
                      layoutId="desktopActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-cyan-500 energy-pulse"
                    />
                  )}
                  
                  {item.active && (
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-lg"></div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Status indicator */}
          <div className="mt-auto flex justify-center">
            <div className="w-8 h-8 rounded-full glassmorphism border border-green-400/50 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Sidebar;