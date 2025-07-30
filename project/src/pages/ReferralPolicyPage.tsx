import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, ArrowLeft, Gift, Clock, AlertTriangle, Award, Rocket, Radio, Satellite, Compass, Users, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { REFERRAL_ACTION_REWARDS, ReferralActionType, WEEKLY_REFERRAL_LIMIT, REFERRAL_EXPIRATION_DAYS, REFERRAL_BADGES } from '../types/referral';

const ReferralPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/profile/referrals" className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6">
        <ArrowLeft size={16} className="mr-2" />
        Volver al Programa de Referidos
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl max-w-4xl mx-auto relative overflow-hidden"
      >
        <div className="hologram-grid absolute inset-0 opacity-20"></div>
        <div className="scanner-effect"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <Rocket size={24} className="text-indigo-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Política del Programa de Referidos</h1>
              <p className="text-gray-400">Última actualización: 1 de junio de 2025</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-medium mb-3">1. Descripción del Programa</h2>
              <p>
                El Programa de Referidos de CosmicBeats ("Recluta tu Tripulación") permite a los usuarios invitar a amigos y conocidos a unirse a la plataforma, 
                recibiendo recompensas tanto el referidor como el referido cuando se cumplen ciertas condiciones.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">2. Elegibilidad</h2>
              <p className="mb-2">
                Para participar como referidor en el programa, debes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Ser un usuario registrado de CosmicBeats con una cuenta activa.</li>
                <li>Haber completado al menos el 60% de tu perfil.</li>
                <li>No estar suspendido o bajo investigación por violación de los términos de servicio.</li>
                <li>Tener al menos 18 años de edad.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">3. Proceso de Referido</h2>
              <p className="mb-2">
                Cada usuario elegible recibe un código de referido único y enlaces para compartir. Para que un referido sea considerado válido:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>El referido debe registrarse usando el código o enlace de referido.</li>
                <li>El referido debe completar al menos el 60% de su perfil.</li>
                <li>El referido debe realizar al menos una interacción en la plataforma (subir sesión, votar, comentar, escanear QR o asistir a un evento).</li>
                <li>El referido debe ser una persona real y única (no se permiten cuentas duplicadas o fraudulentas).</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">4. Recompensas</h2>
              <p className="mb-2">
                Las recompensas varían según el tipo de usuario:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Pilotos (DJs):</strong> 50 Beatcoins + 1 punto de ranking por cada referido válido.</li>
                <li><strong>Aliados (Fiesteros):</strong> 30 Beatcoins por cada referido válido.</li>
                <li><strong>Reporteros:</strong> 40 Beatcoins por cada referido válido.</li>
                <li><strong>Hangares (Clubs):</strong> 100 Beatcoins por cada referido válido.</li>
              </ul>
              <p className="mt-2">
                Además, existen bonificaciones por hitos alcanzados, como se detalla en la sección de recompensas del programa.
              </p>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/30">
                <h3 className="font-medium mb-2 flex items-center">
                  <Gift size={18} className="mr-2 text-indigo-400" />
                  Sistema de Recompensa Dual
                </h3>
                <p className="text-sm mb-3">
                  Tanto el referidor como el referido recibirán recompensas cuando el referido complete las siguientes acciones en los primeros {REFERRAL_EXPIRATION_DAYS} días:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="font-medium mb-1">Completar perfil al 80%</div>
                    <div className="text-sm text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.PROFILE_COMPLETION]} Beatcoins cada uno</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="font-medium mb-1">Escanear QR en local</div>
                    <div className="text-sm text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.SCAN_QR]} Beatcoins cada uno</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="font-medium mb-1">Realizar voto o geovoto</div>
                    <div className="text-sm text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.VOTE]} Beatcoins cada uno</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="font-medium mb-1">Hacer match</div>
                    <div className="text-sm text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.MATCH]} Beatcoins cada uno</div>
                  </div>
                  <div className="p-3 bg-gray-800/50 rounded-lg md:col-span-2">
                    <div className="font-medium mb-1">Subir sesión (solo para DJs)</div>
                    <div className="text-sm text-green-400">+{REFERRAL_ACTION_REWARDS[ReferralActionType.UPLOAD_SESSION]} Beatcoins cada uno</div>
                  </div>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">5. Restricciones</h2>
              <p className="mb-2">
                El programa está sujeto a las siguientes restricciones:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>No puedes referirte a ti mismo usando múltiples cuentas.</li>
                <li>No se permite la publicidad engañosa o spam para obtener referidos.</li>
                <li>No se permite la compra o venta de códigos de referido.</li>
                <li>CosmicBeats se reserva el derecho de invalidar referidos que considere fraudulentos.</li>
                <li>Existe un límite de {WEEKLY_REFERRAL_LIMIT} referidos válidos por usuario a la semana.</li>
                <li>Las acciones de recompensa dual deben completarse en los primeros {REFERRAL_EXPIRATION_DAYS} días tras el registro.</li>
              </ul>
              
              <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30 flex items-start">
                <AlertTriangle size={18} className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Límite Semanal</h4>
                  <p className="text-sm">
                    Para evitar abusos del sistema, cada usuario puede invitar a un máximo de {WEEKLY_REFERRAL_LIMIT} personas por semana.
                    Este límite se restablece cada lunes a las 00:00 horas.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">6. Insignias y Rangos Cósmicos</h2>
              <p className="mb-3">
                Al alcanzar ciertos hitos de referidos, desbloquearás insignias exclusivas que se mostrarán en tu perfil:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {REFERRAL_BADGES.map(badge => (
                  <div key={badge.id} className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/30">
                    <div className="flex items-center mb-2">
                      {badge.icon === 'radio' && <Radio size={18} className="text-cyan-400 mr-2" />}
                      {badge.icon === 'satellite' && <Satellite size={18} className="text-indigo-400 mr-2" />}
                      {badge.icon === 'compass' && <Compass size={18} className="text-purple-400 mr-2" />}
                      {badge.icon === 'users' && <Users size={18} className="text-green-400 mr-2" />}
                      {badge.icon === 'crown' && <Crown size={18} className="text-yellow-400 mr-2" />}
                      <h4 className="font-medium">{badge.name}</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                    <div className="flex justify-between text-xs">
                      <span>{badge.requirement} referidos</span>
                      <span className="text-yellow-400">+{badge.reward} Beatcoins</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <h4 className="font-medium mb-2 flex items-center">
                  <Trophy size={18} className="mr-2 text-indigo-400" />
                  Ranking de Reclutadores
                </h4>
                <p className="text-sm mb-3">
                  Compite en el ranking semanal y mensual de reclutadores para ganar recompensas exclusivas:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Trophy size={16} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>1er Puesto: Membresía superior durante 1 mes + 500 Beatcoins</span>
                  </li>
                  <li className="flex items-start">
                    <Award size={16} className="text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span>2do Puesto: 300 Beatcoins + insignia exclusiva</span>
                  </li>
                  <li className="flex items-start">
                    <Award size={16} className="text-amber-700 mr-2 flex-shrink-0 mt-0.5" />
                    <span>3er Puesto: 150 Beatcoins + insignia exclusiva</span>
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">7. Entrega de Recompensas</h2>
              <p>
                Las recompensas de Beatcoins se acreditarán automáticamente cuando el referido cumpla todas las condiciones.
                Las recompensas por hitos se entregarán en un plazo máximo de 7 días tras alcanzar el hito correspondiente.
                Las membresías gratuitas comenzarán al finalizar el periodo de facturación actual, si el usuario ya tiene una membresía activa.
              </p>
              
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg flex items-start">
                <Clock size={18} className="text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Período de Validez</h4>
                  <p className="text-sm">
                    Las acciones para la recompensa dual deben completarse en los primeros {REFERRAL_EXPIRATION_DAYS} días tras el registro.
                    Pasado este tiempo, las acciones no completadas ya no generarán recompensas.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">8. Modificaciones al Programa</h2>
              <p>
                CosmicBeats se reserva el derecho de modificar, suspender o terminar el Programa de Referidos en cualquier momento.
                Los cambios se notificarán a través de la plataforma con al menos 30 días de antelación, excepto en casos de fuerza mayor.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-medium mb-3">9. Contacto</h2>
              <p>
                Para cualquier consulta relacionada con el Programa de Referidos, puedes contactarnos a través de 
                <a href="mailto:referrals@cosmicbeats.com" className="text-indigo-400 hover:text-indigo-300 ml-1">referrals@cosmicbeats.com</a>.
              </p>
            </section>
          </div>
          
          <div className="mt-8 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30 flex items-start">
            <Shield size={20} className="text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                Al participar en el Programa de Referidos, aceptas cumplir con esta política y con los 
                <Link to="/terms.html" className="text-indigo-400 hover:text-indigo-300 mx-1">Términos de Uso</Link>
                y la
                <Link to="/privacy.html" className="text-indigo-400 hover:text-indigo-300 mx-1">Política de Privacidad</Link>
                de CosmicBeats.
              </p>
              <p>
                CosmicBeats se reserva el derecho de descalificar a cualquier usuario que viole estas políticas o que realice prácticas fraudulentas.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReferralPolicyPage;