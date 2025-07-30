import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Crown, Rocket } from 'lucide-react';

const GalacticInfluencerBadge: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30 relative overflow-hidden"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-[gradient_15s_linear_infinite]"></div>
        
        {/* Animated stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center">
        <div className="mb-6 md:mb-0 md:mr-6">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-500/30 to-purple-500/30 flex items-center justify-center relative"
            animate={{ 
              boxShadow: ['0 0 20px rgba(255, 215, 0, 0.5)', '0 0 40px rgba(255, 215, 0, 0.8)', '0 0 20px rgba(255, 215, 0, 0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/50"></div>
            
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-yellow-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-purple-500/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            ></motion.div>
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Star size={64} className="text-yellow-400" fill="currentColor" />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 mb-2">
              Galactic Influencer
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mb-4"
          >
            Has alcanzado el prestigioso rango de Influencer Galáctico al conseguir 3 logros en nivel Platino. Tu influencia se extiende por todo el cosmos.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 justify-center md:justify-start"
          >
            <div className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm flex items-center">
              <Award size={14} className="mr-1" />
              Badge Animado Premium
            </div>
            <div className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm flex items-center">
              <Crown size={14} className="mr-1" />
              Visibilidad Global
            </div>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center">
              <Rocket size={14} className="mr-1" />
              Acceso Prioritario a Eventos
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GalacticInfluencerBadge;