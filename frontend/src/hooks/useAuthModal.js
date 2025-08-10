import { useState } from 'react';

export const useAuthModal = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return {
    isAuthModalOpen,
    authModalMode,
    openLoginModal,
    openSignupModal,
    closeAuthModal
  };
}; 