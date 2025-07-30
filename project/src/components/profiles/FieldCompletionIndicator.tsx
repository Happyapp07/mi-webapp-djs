import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FieldCompletionIndicatorProps {
  isComplete: boolean;
  fieldName: string;
  importance?: 'high' | 'medium' | 'low';
  showLabel?: boolean;
}

const FieldCompletionIndicator: React.FC<FieldCompletionIndicatorProps> = ({
  isComplete,
  fieldName,
  importance = 'medium',
  showLabel = false
}) => {
  if (isComplete) return null;
  
  const getImportanceColor = () => {
    switch (importance) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  return (
    <motion.div 
      className="inline-flex items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      <div 
        className={`${getImportanceColor()} flex items-center px-2 py-0.5 rounded-full border border-current/30`} 
        title={`${fieldName} is required`}
      >
        <AlertTriangle size={12} className="mr-1" />
        {showLabel && (
          <span className="text-xs">Required</span>
        )}
      </div>
    </motion.div>
  );
};

export default FieldCompletionIndicator;