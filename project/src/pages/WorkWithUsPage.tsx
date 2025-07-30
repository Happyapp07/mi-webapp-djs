import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Users, Music, Palette, Code, Send, Check, AlertTriangle, Upload, X } from 'lucide-react';

const WorkWithUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    country: '',
    role: '',
    experience: '',
    motivation: '',
    socialLinks: '',
    portfolio: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roles = [
    { value: 'promoter', label: '📣 Promotor de eventos' },
    { value: 'tester', label: '🧪 Tester / QA' },
    { value: 'content_creator', label: '📝 Creador de contenido' },
    { value: 'gogo', label: '💃 Gogo / Performer' },
    { value: 'photographer', label: '📸 Fotógrafo / Videomaker' },
    { value: 'scout', label: '🔍 Scout de talento' },
    { value: 'dj', label: '🎧 DJ / Productor' },
    { value: 'designer', label: '🎨 Diseñador gráfico' },
    { value: 'developer', label: '💻 Desarrollador' },
    { value: 'marketing', label: '📱 Marketing / Social Media' },
    { value: 'community', label: '👥 Community Manager' },
    { value: 'business', label: '💼 Business Development' },
    { value: 'other', label: '🌟 Otro (especifica en experiencia)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.city.trim() || 
        !formData.country.trim() || !formData.role || !formData.experience.trim() || 
        !formData.motivation.trim()) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, introduce un email válido');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Store in localStorage for now (in production, this would go to a database or API)
      const applications = JSON.parse(localStorage.getItem('talent_applications') || '[]');
      const newApplication = {
        id: Date.now(),
        ...formData,
        portfolio: formData.portfolio ? {
          name: formData.portfolio.name,
          size: formData.portfolio.size,
          type: formData.portfolio.type
        } : null,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      applications.push(newApplication);
      localStorage.setItem('talent_applications', JSON.stringify(applications));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          city: '',
          country: '',
          role: '',
          experience: '',
          motivation: '',
          socialLinks: '',
          portfolio: null
        });
      }, 5000);

    } catch (error) {
      setError('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Validate file size (max 10MB)
    if (file && file.size > 10 * 1024 * 1024) {
      setError('El archivo no puede superar los 10MB');
      return;
    }
    
    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/quicktime'
    ];
    
    if (file && !allowedTypes.includes(file.type)) {
      setError('Formato de archivo no válido. Usa PDF, DOC, DOCX, JPG, PNG, GIF, MP4 o MOV');
      return;
    }
    
    setFormData(prev => ({ ...prev, portfolio: file }));
    if (error) setError(null);
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, portfolio: null }));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400">
            Trabaja con nosotros
          </h1>
          <div className="max-w-3xl mx-auto space-y-6 text-lg text-gray-300 leading-relaxed">
            <p className="text-xl">
              ¿Quieres formar parte del equipo que está revolucionando la música y las fiestas en todo el mundo?
            </p>
            <p>
              Buscamos colaboradores, testers, promotores, fotógrafos, scouts, creadores de contenido y mucho más. 
              En <span className="font-bold text-cyan-400">CosmicBeats</span> valoramos el talento, la creatividad y las ganas de innovar.
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"></div>
              <Music size={32} className="text-purple-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-bold mb-1">🎧 DJs y productores</h3>
            <p className="text-sm text-gray-400">Artistas con talento y visión</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"></div>
              <Users size={32} className="text-orange-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-bold mb-1">📣 Promotores</h3>
            <p className="text-sm text-gray-400">Expertos en crear experiencias</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10"></div>
              <Palette size={32} className="text-pink-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-bold mb-1">🎨 Creativos</h3>
            <p className="text-sm text-gray-400">Diseñadores y artistas visuales</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
              <Code size={32} className="text-cyan-400 relative z-10" />
              <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
            </div>
            <h3 className="font-bold mb-1">💻 Desarrolladores</h3>
            <p className="text-sm text-gray-400">Programadores y técnicos</p>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="glass-card p-8 rounded-xl relative overflow-hidden">
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            <div className="scanner-effect"></div>
            
            <div className="relative z-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h3>
                  <p className="text-gray-300 mb-4">
                    Gracias por tu interés. Revisaremos tu propuesta y te contactaremos pronto.
                  </p>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="glassmorphism-button px-6 py-2"
                  >
                    Volver al inicio
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                      <Rocket size={24} className="text-indigo-400 relative z-10" />
                      <div className="absolute inset-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 animate-[scanner-line_2s_linear_infinite]"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Solicitud de colaboración</h2>
                      <p className="text-gray-400">Cuéntanos sobre ti y cómo quieres contribuir</p>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start"
                    >
                      <AlertTriangle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-red-400">{error}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email de contacto *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          placeholder="tu.email@ejemplo.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          placeholder="Barcelona"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          País *
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                          placeholder="España"
                          required
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rol deseado *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        required
                      >
                        <option value="">Selecciona un rol</option>
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Experience */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Breve presentación o experiencia previa *
                      </label>
                      <textarea
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors h-24 resize-none"
                        placeholder="Cuéntanos sobre tu experiencia, habilidades y proyectos anteriores..."
                        required
                      />
                    </div>

                    {/* Motivation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ¿Por qué quieres unirte al proyecto? *
                      </label>
                      <textarea
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors h-24 resize-none"
                        placeholder="¿Qué te motiva? ¿Cómo crees que puedes contribuir? ¡Cuéntanos tu visión!"
                        required
                      />
                    </div>

                    {/* Social Links */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enlace a redes sociales (opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.socialLinks}
                        onChange={(e) => handleInputChange('socialLinks', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        placeholder="https://instagram.com/tu_usuario"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Adjuntar portfolio o CV (opcional)
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          id="portfolio-upload"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov"
                        />
                        <label
                          htmlFor="portfolio-upload"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors flex items-center justify-center"
                        >
                          <Upload size={20} className="mr-2 text-indigo-400" />
                          <span className="text-gray-300">
                            {formData.portfolio ? formData.portfolio.name : 'Seleccionar archivo'}
                          </span>
                        </label>
                        
                        {formData.portfolio && (
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Formatos permitidos: PDF, DOC, DOCX, JPG, PNG, GIF, MP4, MOV (máx. 10MB)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => window.location.href = '/'}
                        className="flex-1 glassmorphism-button px-6 py-3 text-center"
                        disabled={isSubmitting}
                      >
                        Cancelar y volver al inicio
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 glassmorphism-primary-button px-6 py-3 flex items-center justify-center text-lg font-medium"
                      >
                        {isSubmitting ? (
                          <motion.div
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          <Send size={20} className="mr-3" />
                        )}
                        {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-400">
                    <p>
                      Al enviar esta solicitud, aceptas que podamos contactarte para discutir oportunidades de colaboración.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="glass-card p-6 rounded-xl max-w-2xl mx-auto relative overflow-hidden">
            <div className="hologram-grid absolute inset-0 opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">¿Por qué trabajar con nosotros?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium mb-1">🚀 Proyecto innovador</div>
                  <div className="text-gray-400">Estamos creando el futuro de la música electrónica</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium mb-1">🌍 Impacto global</div>
                  <div className="text-gray-400">Conectamos la escena musical mundial</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium mb-1">🎯 Equipo joven</div>
                  <div className="text-gray-400">Ambiente dinámico y creativo</div>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="font-medium mb-1">💡 Libertad creativa</div>
                  <div className="text-gray-400">Tus ideas pueden cambiar la plataforma</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkWithUsPage;