export interface Inspiration {
  id: string;
  title: string;
  content: string;
  category: 'learning' | 'research' | 'creation' | 'life';
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'update' | 'reminder' | 'report' | 'achievement';
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AddInspiration: undefined;
  Settings: undefined;
};