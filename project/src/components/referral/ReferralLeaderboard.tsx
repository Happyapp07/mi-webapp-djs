import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown, User, Calendar, Gift, Rocket, Star } from 'lucide-react';
import { useReferralStore } from '../../stores/referralStore';

interface ReferralLeaderboardProps {
  period?: 'weekly' | 'monthly';
}

const ReferralLeaderboard: React.FC<ReferralLeaderboardProps> = ({ period = 'weekly' }) => {
  const { getTopReferrers, isLoading } = useReferralStore();
  const [topReferrers, setTopReferrers] = useState<{ userId: string; count: number }[]>([]);
  const [activePeriod, setActivePeriod] = useState<'weekly' | 'monthly'>(period);
  
  useEffect(() => {
    const loadTopReferrers = async () => {
      try {
        const data = await getTopReferrers(activePeriod);
        setTopReferrers(data);
      } catch (error) {
        console.error('Failed to load top referrers:', error);
      }
    };
    
    loadTopReferrers();
  }, [getTopReferrers, activePeriod]);
  
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return (
          <div className="relative">
            <Trophy size={24} className="text-yellow-500" />
            <motion.div
              className="absolute inset-0 text-yellow-500"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy size={24} />
            </motion.div>
          </div>
        );
      case 1:
        return <Medal size={24} className="text-gray-400" />;
      case 2:
        return <Award size={24} className="text-amber-700" />;
      default:
        return <Star size={24} className="text-indigo-400" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl flex justify-center items-center h-48 relative overflow-hidden">
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        <div className="relative z-10">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center">
            <Trophy size={24} className="mr-2 text-yellow-500" />
            Top Reclutadores
          </h2>
          
          <div className="flex rounded-lg overflow-hidden">
            <button
              className={`px-4 py-1 text-sm ${
                activePeriod === 'weekly' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActivePeriod('weekly')}
            >
              Semanal
            </button>
            <button
              className={`px-4 py-1 text-sm ${
                activePeriod === 'monthly' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
              onClick={() => setActivePeriod('monthly')}
            >
              Mensual
            </button>
          </div>
        </div>
        
        {/* Period Info */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>
              {activePeriod === 'weekly' ? 'Esta semana' : 'Este mes'}
            </span>
          </div>
          <div className="flex items-center">
            <Gift size={14} className="mr-1" />
            <span>Recompensas al finalizar</span>
          </div>
        </div>
        
        {topReferrers.length > 0 ? (
          <div className="space-y-4">
            {topReferrers.map((referrer, index) => (
              <motion.div
                key={referrer.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center p-3 bg-gray-800/50 rounded-lg relative overflow-hidden"
              >
                {/* Background effect for top 3 */}
                {index < 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent animate-[gradient_3s_ease_infinite]"></div>
                )}
                
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                      <div className="relative z-10">
                        {getPositionIcon(index)}
                      </div>
                      {index < 3 && (
                        <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={`https://api.dicebear.com/7.x/personas/svg?seed=${referrer.userId}`}
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="font-medium">Usuario {referrer.userId.split('_')[1]}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Rocket size={16} className="text-indigo-400 mr-1" />
                    <span className="font-bold">{referrer.count}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-medium mb-2">Sin datos aún</h3>
            <p className="text-gray-400">
              Sé el primero en aparecer en el ranking invitando a tus amigos
            </p>
          </div>
        )}
        
        <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
          <h3 className="font-medium mb-2">Recompensas para los Ganadores</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start">
              <Trophy size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>1er Puesto: Membresía superior durante 1 mes + 500 Beatcoins</span>
            </li>
            <li className="flex items-start">
              <Medal size={16} className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>2do Puesto: 300 Beatcoins + insignia exclusiva</span>
            </li>
            <li className="flex items-start">
              <Award size={16} className="text-amber-700 mr-2 flex-shrink-0 mt-0.5" />
              <span>3er Puesto: 150 Beatcoins + insignia exclusiva</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReferralLeaderboard;