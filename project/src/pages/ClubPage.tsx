import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, QrCode, Gift, ExternalLink, Store, Ticket } from 'lucide-react';

const ClubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('events');
  
  // For real user testing, show a message that club data will be loaded from real profiles
  const mockClub = null;
  
  return (
    <div className="container mx-auto">
      <Link
        to="/galaxy"
        className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Galaxy Map
      </Link>
      
      <div className="glass-card p-8 rounded-xl text-center">
        <Building2 size={48} className="mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-medium mb-2">Club Profile Not Found</h3>
        <p className="text-gray-400">
          This club profile will be available once real clubs register on the platform.
        </p>
      </div>
    </div>
  );
};

export default ClubPage;