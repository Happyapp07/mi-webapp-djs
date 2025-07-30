import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { SubscriptionTier } from '../../types/subscription';

interface SubscriptionFeaturesProps {
  tier: SubscriptionTier;
  features: string[];
  isCurrentTier?: boolean;
}

const SubscriptionFeatures: React.FC<SubscriptionFeaturesProps> = ({
  tier,
  features,
  isCurrentTier = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {features.map((feature, index) => (
        <motion.div
          key={feature}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center p-3 rounded-lg ${
            isCurrentTier ? 'bg-indigo-500/10' : 'bg-gray-800/50'
          }`}
        >
          <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
          <span className="text-sm">{feature}</span>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SubscriptionFeatures;