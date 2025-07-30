import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Cookie, ExternalLink, Briefcase } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} CosmicBeats. Todos los derechos reservados.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="/work-with-us"
              className="flex items-center text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Briefcase size={14} className="mr-1" />
              Trabaja con nosotros
            </motion.a>
            
            <motion.a
              href="/terms.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <FileText size={14} className="mr-1" />
              Términos de Uso
              <ExternalLink size={12} className="ml-1" />
            </motion.a>
            
            <motion.a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Shield size={14} className="mr-1" />
              Política de Privacidad
              <ExternalLink size={12} className="ml-1" />
            </motion.a>
            
            <motion.a
              href="/cookies.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Cookie size={14} className="mr-1" />
              Política de Cookies
              <ExternalLink size={12} className="ml-1" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;