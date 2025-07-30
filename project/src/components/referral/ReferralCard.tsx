import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Share2, Copy, Check, Award, Users, TrendingUp, ExternalLink, FileText, Clock, AlertTriangle, Radio, Compass, Crown, Satellite } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReferralStore } from '../../stores/referralStore';
import { useAuthStore } from '../../stores/authStore';
import { ReferralStats, REFERRAL_BADGES, ReferralActionType, WEEKLY_REFERRAL_LIMIT, REFERRAL_ACTION_REWARDS } from '../../types/referral';
import QRCodeGenerator from '../common/QRCodeGenerator';

const ReferralCard: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    getUserReferralCode, 
    getReferralStats, 
    getSharingLink,
    isLoading,
    getReferralBadges
  } = useReferralStore();
  
  const [referralCode, setReferralCode] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'share' | 'details'>('stats');
  const [badges, setBadges] = useState<string[]>([]);
  
  useEffect(() => {
    const loadReferralData = async () => {
      if (user) {
        try {
          const code = await getUserReferralCode();
          setReferralCode(code);
          
          const userStats = await getReferralStats(user.id);
          setStats(userStats);
          
          const userBadges = await getReferralBadges(user.id);
          setBadges(userBadges);
        } catch (error) {
          console.error('Failed to load referral data:', error);
        }
      }
    };
    
    loadReferralData();
  }, [user, getUserReferralCode, getReferralStats, getReferralBadges]);
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(getSharingLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getBadgeProgress = (badgeId: string) => {
    if (!stats) return 0;
    
    const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
    if (!badge) return 0;
    
    return Math.min(stats.validReferrals / badge.requirement, 1) * 100;
  };
  
  const getNextMilestoneProgress = () => {
    if (!stats || !stats.nextMilestone) return 0;
    
    return Math.min(stats.validReferrals / stats.nextMilestone.count, 1) * 100;
  };

  const getBadgeIcon = (badgeId: string) => {
    const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
    if (!badge) return <Award size={20} />;
    
    switch (badge.icon) {
      case 'radio':
        return <Radio size={20} className="text-cyan-400" />;
      case 'satellite':
        return <Satellite size={20} className="text-indigo-400" />;
      case 'compass':
        return <Compass size={20} className="text-purple-400" />;
      case 'users':
        return <Users size={20} className="text-green-400" />;
      case 'crown':
        return <Crown size={20} className="text-yellow-400" />;
      default:
        return <Award size={20} className="text-indigo-400" />;
    }
  };
  
  const getActionLabel = (actionType: ReferralActionType) => {
    switch (actionType) {
      case ReferralActionType.PROFILE_COMPLETION:
        return 'Completar perfil al 80%';
      case ReferralActionType.SCAN_QR:
        return 'Escanear QR en local';
      case ReferralActionType.VOTE:
        return 'Realizar voto o geovoto';
      case ReferralActionType.MATCH:
        return 'Hacer match';
      case ReferralActionType.UPLOAD_SESSION:
        return 'Subir sesión (DJ)';
      default:
        return 'Acción desconocida';
    }
  };
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl flex justify-center items-center h-48">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6 rounded-xl relative overflow-hidden">
      <div className="hologram-grid absolute inset-0 opacity-20"></div>
      <div className="scanner-effect"></div>
      
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
            <UserPlus size={24} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Recluta tu Tripulación</h2>
            <p className="text-gray-400 text-sm">Invita a tus amigos y gana recompensas</p>
          </div>
        </div>
        
        {/* Badges */}
        {badges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Award size={20} className="mr-2 text-yellow-400" />
              Insignias Desbloqueadas
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges.map(badgeId => {
                const badge = REFERRAL_BADGES.find(b => b.id === badgeId);
                if (!badge) return null;
                
                return (
                  <motion.div
                    key={badgeId}
                    className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30 flex flex-col items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center mb-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                      <div className="relative z-10">
                        {getBadgeIcon(badgeId)}
                      </div>
                      <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                    </div>
                    <div className="text-sm font-medium text-center">{badge.name}</div>
                    <div className="text-xs text-gray-400 text-center mt-1">+{badge.reward} BC</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'stats' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Estadísticas
          </button>
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'details' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Detalles
          </button>
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'share' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab('share')}
          >
            Compartir
          </button>
        </div>
        
        {activeTab === 'stats' ? (
          <div className="space-y-6">
            {/* Referral Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-indigo-400">{stats?.totalReferrals || 0}</div>
                <div className="text-xs text-gray-400">Total Invitados</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-400">{stats?.validReferrals || 0}</div>
                <div className="text-xs text-gray-400">Invitados Válidos</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats?.totalBeatcoinsEarned || 0}</div>
                <div className="text-xs text-gray-400">Beatcoins Ganados</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-400">{stats?.weeklyReferrals || 0}/{WEEKLY_REFERRAL_LIMIT}</div>
                <div className="text-xs text-gray-400">Límite Semanal</div>
              </div>
            </div>
            
            {/* Weekly Limit Warning */}
            {stats && stats.weeklyReferrals >= WEEKLY_REFERRAL_LIMIT && (
              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30 flex items-start">
                <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-500 font-medium">Has alcanzado el límite semanal</p>
                  <p className="text-gray-300">Puedes invitar a un máximo de {WEEKLY_REFERRAL_LIMIT} personas por semana para evitar abusos del sistema.</p>
                </div>
              </div>
            )}
            
            {/* Next Milestone */}
            {stats?.nextMilestone && (
              <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <h3 className="font-medium mb-2 flex items-center">
                  <Award size={18} className="mr-2 text-indigo-400" />
                  Próximo Hito: {stats.nextMilestone.count} Invitados
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  {stats.nextMilestone.reward.description}
                </p>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${getNextMilestoneProgress()}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{stats.validReferrals} / {stats.nextMilestone.count}</span>
                  <span>{Math.round(getNextMilestoneProgress())}%</span>
                </div>
              </div>
            )}
            
            {/* Badges */}
            <div>
              <h3 className="font-medium mb-3">Insignias de Reclutamiento</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {REFERRAL_BADGES.map(badge => {
                  const hasBadge = badges.includes(badge.id);
                  const progress = getBadgeProgress(badge.id);
                  
                  return (
                    <div key={badge.id} className="p-3 bg-gray-800/50 rounded-lg text-center relative overflow-hidden">
                      {/* Background glow for earned badges */}
                      {hasBadge && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
                      )}
                      
                      <div className="relative z-10">
                        <div className="relative w-12 h-12 mx-auto mb-2">
                          <div className="absolute inset-0 rounded-full bg-gray-700"></div>
                          <svg className="absolute inset-0" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={hasBadge ? "#6366F1" : "#4F46E5"}
                              strokeWidth="2"
                              strokeDasharray={`${progress}, 100`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            {hasBadge ? (
                              <div className="relative">
                                {getBadgeIcon(badge.id)}
                                <div className="absolute inset-0 animate-pulse opacity-50">
                                  {getBadgeIcon(badge.id)}
                                </div>
                              </div>
                            ) : (
                              <div className="opacity-50">
                                {getBadgeIcon(badge.id)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{badge.name}</div>
                        <div className="text-xs text-gray-400">{stats?.validReferrals || 0}/{badge.requirement} invitados</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Completed Milestones */}
            {stats?.milestones.filter(m => m.isCompleted).length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Hitos Completados</h3>
                <div className="space-y-2">
                  {stats.milestones
                    .filter(m => m.isCompleted)
                    .map((milestone, index) => (
                      <div key={index} className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 flex items-center">
                        <Check size={18} className="text-green-500 mr-3" />
                        <div>
                          <div className="font-medium">{milestone.count} Invitados</div>
                          <div className="text-sm text-gray-300">{milestone.reward.description}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tu Código de Invitación
              </label>
              <div className="flex">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 font-mono">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            {/* Referral Details */}
            <div>
              <h3 className="font-medium mb-3">Detalles de Invitados</h3>
              
              {stats?.referralDetails && stats.referralDetails.length > 0 ? (
                <div className="space-y-4">
                  {stats.referralDetails.map((detail) => (
                    <div key={detail.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <img 
                            src={detail.referredAvatar} 
                            alt={detail.referredUsername}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium">@{detail.referredUsername}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(detail.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          detail.status === 'valid' ? 'bg-green-500/20 text-green-400' :
                          detail.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {detail.status === 'valid' ? 'Válido' :
                           detail.status === 'pending' ? 'Pendiente' :
                           'Inválido'}
                        </div>
                      </div>
                      
                      {/* Time Remaining */}
                      {detail.status === 'pending' && detail.timeRemaining > 0 && (
                        <div className="flex items-center text-xs mb-3">
                          <Clock size={12} className="mr-1 text-yellow-400" />
                          <span className="text-yellow-400">
                            {detail.timeRemaining} días para completar acciones
                          </span>
                        </div>
                      )}
                      
                      {/* Actions */}
                      {detail.actions && detail.actions.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <div className="text-xs text-gray-400 mb-1">Acciones completadas:</div>
                          {detail.actions.map((action, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                                  action.completed ? 'bg-green-500' : 'bg-gray-700'
                                }`}>
                                  {action.completed && <Check size={10} className="text-black" />}
                                </div>
                                <span>{getActionLabel(action.type)}</span>
                              </div>
                              {action.completed && action.beatcoinsRewarded && (
                                <span className="text-green-400">+{action.beatcoinsRewarded} BC</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Total Earned */}
                      {detail.beatcoinsEarned > 0 && (
                        <div className="mt-3 text-right">
                          <span className="text-sm text-gray-400">Total ganado: </span>
                          <span className="text-green-400 font-medium">{detail.beatcoinsEarned} BC</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-800/30 rounded-lg">
                  <Users size={32} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-gray-400">Aún no has invitado a nadie</p>
                  <p className="text-sm text-gray-500 mt-1">Comparte tu código para empezar a ganar recompensas</p>
                </div>
              )}
            </div>
            
            {/* Dual Reward System */}
            <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
              <h3 className="font-medium mb-3 flex items-center">
                <Award size={18} className="mr-2 text-indigo-400" />
                Sistema de Recompensa Dual
              </h3>
              <p className="text-sm text-gray-300 mb-3">
                Tanto tú como tus invitados recibiréis recompensas cuando completen estas acciones:
              </p>
              <div className="space-y-2 text-sm">
                {Object.values(ReferralActionType).map((actionType) => (
                  <div key={actionType} className="flex items-center justify-between">
                    <span>{getActionLabel(actionType)}</span>
                    <span className="text-green-400">+{REFERRAL_ACTION_REWARDS[actionType]} BC cada uno</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <Clock size={12} className="inline mr-1" />
                Las acciones deben completarse en los primeros 7 días tras el registro
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Referral Code */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Tu Código de Invitación
              </label>
              <div className="flex">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 font-mono">
                  {referralCode}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-400 mb-2 self-start">
                Código QR para Compartir
              </label>
              <QRCodeGenerator value={referralCode} size={200} className="mb-2" />
              <p className="text-xs text-gray-400">Escanea para registrarte con mi código</p>
            </div>
            
            {/* Referral Link */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Enlace de Invitación
              </label>
              <div className="flex">
                <div className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 truncate">
                  {getSharingLink()}
                </div>
                <button
                  onClick={handleCopyLink}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg transition-colors"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
            
            {/* Share on Social Media */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Compartir en Redes Sociales
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { name: 'Instagram', url: getSharingLink('instagram'), color: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' },
                  { name: 'TikTok', url: getSharingLink('tiktok'), color: 'bg-gradient-to-r from-black to-gray-800 hover:from-black hover:to-gray-900' },
                  { name: 'WhatsApp', url: getSharingLink('whatsapp'), color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' },
                  { name: 'Twitter', url: getSharingLink('twitter'), color: 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600' },
                  { name: 'Telegram', url: getSharingLink('telegram'), color: 'bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500' }
                ].map(platform => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${platform.color} text-white px-4 py-2 rounded-lg text-center flex items-center justify-center shadow-lg hover:shadow-xl transition-all`}
                  >
                    <span className="mr-1">{platform.name}</span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-medium mb-2">Cómo Funciona</h3>
              <ol className="space-y-2 text-sm text-gray-300 list-decimal pl-5">
                <li>Comparte tu código o enlace con amigos</li>
                <li>Ellos deben registrarse usando tu código</li>
                <li>Deben completar al menos el 60% de su perfil</li>
                <li>Deben realizar al menos una interacción en la plataforma</li>
                <li>¡Ambos recibiréis recompensas cuando se valide la invitación!</li>
              </ol>
              <div className="mt-4 text-center">
                <Link to="/referral-policy" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center justify-center">
                  <FileText size={14} className="mr-1" />
                  Ver política completa del programa de referidos
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard;