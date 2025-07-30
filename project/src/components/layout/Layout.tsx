import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlayIcon as GalaxyIcon, Headphones, Map, QrCode, Radio, Trophy, User, Zap, Users, Camera, ShoppingBag, Award } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useGalaxyStore } from '../../stores/galaxyStore';

const Layout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchGalaxies } = useGalaxyStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGalaxyPage, setIsGalaxyPage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      fetchGalaxies();
    }
  }, [isAuthenticated, navigate, fetchGalaxies]);

  useEffect(() => {
    // Check if we're on the Galaxy page
    setIsGalaxyPage(location.pathname === '/galaxy');
    
    // Close sidebar when route changes (mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Define nav items with glassmorphism styled icons
  const navItems = [
    { 
      name: 'Galaxy Map', 
      path: '/galaxy', 
      icon: <GalaxyIcon size={20} className="text-cyan-400" />,
      active: location.pathname === '/galaxy' 
    },
    { 
      name: 'DJ Rankings', 
      path: '/rankings', 
      icon: <Trophy size={20} className="text-cyan-400" />,
      active: location.pathname.includes('/rankings') 
    },
    { 
      name: 'Clubs Map', 
      path: '/clubs', 
      icon: <Map size={20} className="text-cyan-400" />,
      active: location.pathname.includes('/clubs') 
    },
    { 
      name: 'Allies', 
      path: '/allies', 
      icon: <Users size={20} className="text-cyan-400" />,
      active: location.pathname === '/allies' 
    },
    { 
      name: 'Reporters', 
      path: '/reporters', 
      icon: <Camera size={20} className="text-cyan-400" />,
      active: location.pathname === '/reporters' 
    },
    { 
      name: 'Scan QR', 
      path: '/scan', 
      icon: <QrCode size={20} className="text-cyan-400" />, 
      active: location.pathname === '/scan' 
    },
    { 
      name: 'CrowdParty', 
      path: '/crowdparty', 
      icon: <Radio size={20} className="text-cyan-400" />,
      active: location.pathname === '/crowdparty' 
    },
    { 
      name: 'Missions', 
      path: '/missions', 
      icon: <Zap size={20} className="text-cyan-400" />,
      active: location.pathname === '/missions' 
    },
    { 
      name: 'Store', 
      path: '/store', 
      icon: <ShoppingBag size={20} className="text-cyan-400" />,
      active: location.pathname.includes('/store') 
    },
    { 
      name: 'Achievements', 
      path: '/achievements', 
      icon: <Award size={20} className="text-cyan-400" />,
      active: location.pathname === '/achievements' 
    },
    { 
      name: 'My Profile', 
      path: user ? `/profile/${user.id}` : '/profile', 
      icon: <User size={20} className="text-cyan-400" />,
      active: location.pathname.includes('/profile') 
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-space-900 text-white">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
          navItems={navItems}
          alwaysVisible={true}
        />
        
        <motion.main 
          className="flex-1 px-4 pb-8 pt-20 md:pt-24 md:pl-20 overflow-x-hidden transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;