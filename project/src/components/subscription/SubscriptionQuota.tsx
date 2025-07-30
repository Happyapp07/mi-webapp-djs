import React from 'react';
import { motion } from 'framer-motion';

interface SubscriptionQuotaProps {
  feature: string;
  used: number;
  total: number;
  unit?: string;
}

const SubscriptionQuota: React.FC<SubscriptionQuotaProps> = ({
  feature,
  used,
  total,
  unit = ''
}) => {
  const percentage = (used / total) * 100;

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">{feature}</h3>
        <span className="text-sm text-gray-400">
          {used} / {total} {unit}
        </span>
      </div>

      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {percentage >= 80 && (
        <p className="text-xs text-yellow-500 mt-2">
          {percentage >= 100 ? 'Cuota excedida' : 'Cuota casi alcanzada'}
        </p>
      )}
    </div>
  );
};

export default SubscriptionQuota;