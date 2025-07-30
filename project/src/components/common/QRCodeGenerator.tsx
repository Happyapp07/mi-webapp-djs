import React from 'react';
import QRCode from 'react-qr-code';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  level = 'M',
  includeMargin = false,
  className = ''
}) => {
  // Generate a URL with the referral code
  const referralUrl = `${window.location.origin}/register?ref=${value}`;
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-lg ${className}`}>
      <QRCode
        value={referralUrl}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        includeMargin={includeMargin}
      />
    </div>
  );
};

export default QRCodeGenerator;