import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, Headphones, BarChart, Search, LogOut, Zap, Globe, User, Building2, UserPlus, Rocket, Briefcase } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import GlobalSearch from '../common/GlobalSearch';
import UserMenu from '../auth/UserMenu';
import AuthModal from '../auth/AuthModal';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGalaxyPage, setIsGalaxyPage] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsGalaxyPage(location.pathname === '/galaxy');
    
    // Check if we should show the countdown button
    // This could be based on a date range, a feature flag, etc.
    const shouldShowCountdown = true; // For demo purposes, always show
    setShowCountdown(shouldShowCountdown);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    logout();
    setShowUserMenu(false);
  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glassmorphism border-b border-cyan-500/30">
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="mr-4 p-2 rounded-full hover:bg-cyan-500/20 transition-colors neon-border"
                aria-label="Toggle navigation menu"
              >
                {/* Glassmorphism menu icon */}
                <div className="w-10 h-10 rounded-xl relative overflow-hidden
                              backdrop-blur-md border border-cyan-500/30
                              bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                              shadow-[0_0_15px_rgba(0,255,255,0.3)]
                              flex items-center justify-center">
                  <Menu size={20} className="text-cyan-400 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                </div>
              </button>
              
              <div className="flex items-center">
                <div className="relative">
                  {/* Glassmorphism headphones icon */}
                  <div className="w-10 h-10 rounded-xl relative overflow-hidden mr-2
                                backdrop-blur-md border border-cyan-500/30
                                bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                                shadow-[0_0_15px_rgba(0,255,255,0.3)]
                                flex items-center justify-center">
                    <Headphones className="text-cyan-400 relative z-10" size={20} />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                    <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                  </div>
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl"></div>
                </div>
                <h1 className="text-xl font-display tracking-wider neon-text">
                  CosmicBeats
                </h1>
                <div className="ml-2 px-2 py-1 rounded-full glassmorphism border border-cyan-500/30">
                  <span className="text-xs font-mono text-cyan-400">v2.1.0</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Global Stats */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center px-3 py-1 rounded-full glassmorphism border border-cyan-500/30">
                  <Globe size={14} className="text-cyan-400 mr-1" />
                  <span className="text-xs font-mono text-cyan-400">ONLINE</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2 animate-pulse"></div>
                </div>
                
                <div className="flex items-center px-3 py-1 rounded-full glassmorphism border border-purple-500/30">
                  <Zap size={14} className="text-purple-400 mr-1" />
                  <span className="text-xs font-mono text-purple-400">SYNC</span>
                </div>
                
                <Link 
                  to="/entities"
                  className="flex items-center px-3 py-1 rounded-full glassmorphism border border-orange-500/30 hover:border-orange-500/50 transition-colors"
                >
                  <Building2 size={14} className="text-orange-400 mr-1" />
                  <span className="text-xs font-mono text-orange-400">ENTITIES</span>
                </Link>
              </div>

              {/* Referral Button */}
              {isAuthenticated && (
                <Link
                  to="/profile/referrals"
                  className="flex items-center px-3 py-1 rounded-full glassmorphism border border-green-500/30 hover:border-green-500/50 transition-colors"
                >
                  <UserPlus size={14} className="text-green-400 mr-1" />
                  <span className="text-xs font-mono text-green-400">INVITAR</span>
                </Link>
              )}
              
              {/* Work With Us Button */}
              <Link
                to="/work-with-us"
                className="flex items-center px-3 py-1 rounded-full glassmorphism border border-purple-500/30 hover:border-purple-500/50 transition-colors"
              >
                <Briefcase size={14} className="text-purple-400 mr-1" />
                <span className="text-xs font-mono text-purple-400">ÚNETE</span>
              </Link>

              {/* Glassmorphism search icon */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-full hover:bg-cyan-500/20 transition-colors neon-border"
                aria-label="Search"
              >
                <div className="w-10 h-10 rounded-xl relative overflow-hidden
                              backdrop-blur-md border border-cyan-500/30
                              bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                              shadow-[0_0_15px_rgba(0,255,255,0.3)]
                              flex items-center justify-center">
                  <Search size={20} className="text-cyan-400 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                </div>
              </button>

              {isAuthenticated && user ? (
                <>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="flex items-center glassmorphism rounded-full py-1 px-3 border border-yellow-500/30">
                      <BarChart size={16} className="text-yellow-400 mr-1" />
                      <span className="text-sm font-mono text-yellow-400">{user.beatcoins}</span>
                      <span className="text-xs text-yellow-400/70 ml-1">BC</span>
                    </div>
                    <div className="glassmorphism rounded-full py-1 px-3 border border-cyan-500/30">
                      <span className="text-sm font-mono text-cyan-400">LVL {user.level}</span>
                    </div>
                  </div>
                  
                  {/* Glassmorphism bell icon */}
                  <button 
                    className="relative p-2 rounded-full hover:bg-cyan-500/20 transition-colors neon-border"
                    aria-label="Notifications"
                  >
                    <div className="w-10 h-10 rounded-xl relative overflow-hidden
                                  backdrop-blur-md border border-cyan-500/30
                                  bg-gradient-to-br from-cyan-500/10 to-purple-500/10
                                  shadow-[0_0_15px_rgba(0,255,255,0.3)]
                                  flex items-center justify-center">
                      <Bell size={20} className="text-cyan-400 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-50"></div>
                    </div>
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center"
                      aria-label="User menu"
                      aria-expanded={showUserMenu}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-500 relative">
                        <img 
                          src={user.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.id}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-cyan-400/20 rounded-full"></div>
                      </div>
                      <div className="ml-2 hidden md:block">
                        <div className="text-sm font-medium text-cyan-400">{user.username}</div>
                        <div className="text-xs text-cyan-400/70">PILOT</div>
                      </div>
                    </button>

                    <UserMenu 
                      isOpen={showUserMenu} 
                      onClose={() => setShowUserMenu(false)} 
                    />
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="glassmorphism-primary-button px-4 py-2 flex items-center"
                >
                  <User size={16} className="mr-2" />
                  Iniciar Sesión
                </button>
              )}
              
              {/* Welcome button - to access the old welcome screen */}
              <button
                onClick={() => navigate('/welcome')}
                className="ml-4 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/30 transition-all flex items-center"
              >
                <Rocket size={14} className="mr-1" />
                <span className="text-xs font-mono">WELCOME</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <GlobalSearch onClose={() => setShowSearch(false)} />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Navbar;