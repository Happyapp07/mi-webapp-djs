import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Headphones, Building2, ChevronRight, Star, Zap, Crown, Clock, Calendar, Camera, ShoppingBag, Radio, GraduationCap, Music, Disc } from 'lucide-react';
import { UserType } from '../types';
import AuthModal from '../components/auth/AuthModal';
import EntityApplicationForm from '../components/entity/EntityApplicationForm';
import { buildRedirectionState, RedirectionState } from '../utils/redirectionUtils';
import { useEntityStore } from '../stores/entityStore';
import ReferralCodeInput from '../components/referral/ReferralCodeInput';
import { useReferralStore } from '../stores/referralStore';

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitEntityApplication } = useEntityStore();
  const { applyReferralCode } = useReferralStore();
  const [isRegistering, setIsRegistering] = useState(true);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [showEntityForm, setShowEntityForm] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      setShowReferralInput(true);
    }

    const state = location.state as {
      redirectToProfile?: boolean;
      planId?: string;
      userType?: UserType;
    };
    if (state?.redirectToProfile) {
      setRedirectToProfile(true);
    }
    if (state?.planId) {
      setUserType(state.userType || null);
      setSelectedPlanId(state.planId);
      setShowAuthModal(true);
    }
  }, [location]);

  // Automatically open registration modal based on redirection state
  useEffect(() => {
    const state = location.state as RedirectionState | undefined;
    if (state?.userType && state?.planId) {
      setUserType(state.userType);
      setAuthMode('register');
      setShowAuthModal(true);
      setIsRegistering(true);
      setStep(2); // Skip role selection
    }
  }, [location.state]);

  const handleToggleForm = () => {
    setIsRegistering(!isRegistering);
    setStep(1);
    setUserType(null); 
  };

  const handleTypeSelect = (type: UserType) => {
    setUserType(type);
    // Navigate to subscription selection page with the selected user type
    const redirectState = buildRedirectionState(type, undefined, {
      competitionEnabled: type === UserType.DJ ? true : undefined,
      redirectToProfile: true // Ensure we redirect to profile after subscription
    });
    
    navigate('/subscription-selection', {
      state: redirectState
    });
  };

  const handleEntityApplication = async (formData: any) => {
    await submitEntityApplication(formData);
    // Show success message or redirect
    alert('Solicitud enviada con éxito. Te contactaremos pronto.');
    setShowEntityForm(false);
  };

  const handleReferralSuccess = () => {
    // This will be called when a referral code is successfully applied
    console.log('Referral code applied successfully');
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div 
        className="max-w-md w-full glass-card p-8 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center text-2xl font-display tracking-wider mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-blue-500">
          {isRegistering ? 'Crea tu Cuenta' : 'Bienvenido de Nuevo'}
        </h2>

        {/* Referral Code Input */}
        {showReferralInput && referralCode && (
          <div className="mb-6">
            <ReferralCodeInput onSuccess={handleReferralSuccess} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {isRegistering && step === 1 && (
            <motion.div 
              key="type-selection"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <p className="text-center text-gray-300 mb-6">
                Selecciona como intervenir:
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleTypeSelect(UserType.PARTYGOER)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-transparent hover:border-indigo-500 transition-all bg-gray-800"
                >
                  <User size={32} className="mb-2 text-blue-400" />
                  <span className="text-sm">Aliado</span>
                </button>

                <button
                  onClick={() => handleTypeSelect(UserType.DJ)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-transparent hover:border-indigo-500 transition-all bg-gray-800"
                >
                  <Headphones size={32} className="mb-2 text-purple-400" />
                  <span className="text-sm">Piloto</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleTypeSelect(UserType.CLUB)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-transparent hover:border-indigo-500 transition-all bg-gray-800"
                >
                  <Building2 size={32} className="mb-2 text-orange-400" />
                  <span className="text-sm">Hangar</span>
                </button>

                <button
                  onClick={() => handleTypeSelect(UserType.REPORTER)}
                  className="flex flex-col items-center p-4 rounded-lg border-2 border-transparent hover:border-indigo-500 transition-all bg-gray-800"
                >
                  <Camera size={32} className="mb-2 text-green-400" />
                  <span className="text-sm">Reportero</span>
                </button>
              </div>
              
              {/* Entity Collaborator Section */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-center text-gray-300 mb-4">
                  ¿Eres un Sello, Academia, Radio o Tienda especializada?
                </p>
                <p className="text-center text-sm text-gray-400 mb-4">
                  Únete a la expedición, tu energía es vital para la misión.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-1">
                      <Disc size={20} className="text-purple-400" />
                    </div>
                    <span className="text-xs text-gray-400">Mentor Label</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-1">
                      <GraduationCap size={20} className="text-blue-400" />
                    </div>
                    <span className="text-xs text-gray-400">Academy</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-1">
                      <Radio size={20} className="text-green-400" />
                    </div>
                    <span className="text-xs text-gray-400">Frequency Station</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-1">
                      <ShoppingBag size={20} className="text-orange-400" />
                    </div>
                    <span className="text-xs text-gray-400">Music Depot</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEntityForm(true)}
                  className="w-full glassmorphism-button px-4 py-3 flex items-center justify-center"
                >
                  Solicita tu entrada como entidad colaboradora
                </button>
              </div>
            </motion.div>
          )}

          {!isRegistering && (
            <motion.div 
              key="login-form"
              variants={formVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true); 
                }}
                className="w-full glassmorphism-primary-button px-4 py-3 flex items-center justify-center"
              >
                <User size={18} className="mr-2" />
                Iniciar Sesión con Email
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button
            onClick={handleToggleForm}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            {isRegistering
              ? '¿Ya tienes cuenta? Inicia Sesión'
              : '¿Necesitas una cuenta? Regístrate'}
          </button>
        </div>

        {/* Show referral input if not already shown */}
        {isRegistering && !showReferralInput && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowReferralInput(true)}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              ¿Tienes un código de invitación?
            </button>
          </div>
        )}

        {isRegistering && showReferralInput && !referralCode && (
          <div className="mt-6">
            <ReferralCodeInput onSuccess={handleReferralSuccess} />
          </div>
        )}
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        userType={userType}
        redirectToProfile={redirectToProfile}
        planId={selectedPlanId || undefined}
      />
      
      {/* Entity Application Form */}
      {showEntityForm && (
        <EntityApplicationForm
          onSubmit={handleEntityApplication}
          onCancel={() => setShowEntityForm(false)}
        />
      )}
    </div>
  );
};

export default RegisterPage;
