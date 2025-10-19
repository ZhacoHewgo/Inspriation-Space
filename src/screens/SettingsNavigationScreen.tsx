import React from 'react';
import SettingsScreen from './SettingsScreen';

interface SettingsNavigationScreenProps {
  onBack?: () => void;
}

export default function SettingsNavigationScreen({ onBack }: SettingsNavigationScreenProps) {
  return <SettingsScreen onBack={onBack} />;
}