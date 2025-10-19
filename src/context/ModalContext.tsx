import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  showAddInspirationModal: boolean;
  setShowAddInspirationModal: (show: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [showAddInspirationModal, setShowAddInspirationModal] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        showAddInspirationModal,
        setShowAddInspirationModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}