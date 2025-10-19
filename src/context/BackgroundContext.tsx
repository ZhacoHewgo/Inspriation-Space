import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BackgroundContextType {
  categoryBackgrounds: Record<string, string>;
  updateCategoryBackground: (category: string, backgroundUrl: string) => void;
}

const defaultBackgrounds = {
  learning: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
  research: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  creation: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
  life: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
};

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [categoryBackgrounds, setCategoryBackgrounds] = useState<Record<string, string>>(defaultBackgrounds);

  const updateCategoryBackground = (category: string, backgroundUrl: string) => {
    setCategoryBackgrounds(prev => ({
      ...prev,
      [category]: backgroundUrl,
    }));
  };

  return (
    <BackgroundContext.Provider
      value={{
        categoryBackgrounds,
        updateCategoryBackground,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}