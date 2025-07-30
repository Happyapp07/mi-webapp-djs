import React from 'react';
import { useNavigate } from 'react-router-dom';
import LaunchCountdown from '../components/countdown/LaunchCountdown';

const LaunchCountdownPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToRegister = () => {
    navigate('/register');
  };

  const handleNavigateToWelcome = () => {
    navigate('/welcome');
  };

  // Set launch date to 30 days from now
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  return (
    <LaunchCountdown
      launchDate={launchDate}
      navigateToRegister={handleNavigateToRegister}
      navigateToWelcome={handleNavigateToWelcome}
    />
  );
};

export default LaunchCountdownPage;