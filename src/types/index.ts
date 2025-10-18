export interface Inspiration {
  id: string;
  content: string;
  category: 'learning' | 'research' | 'creation' | 'life';
  color?: string;
  createdAt: Date;
  updatedAt: Date;
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
  Record: undefined;
  Home: undefined;
  Settings: undefined;
};