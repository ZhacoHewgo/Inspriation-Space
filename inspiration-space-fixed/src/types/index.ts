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
  InspirationDetail: {
    inspiration: {
      id: string;
      title: string;
      content: string;
      category: string;
      time: string;
      date: string;
    };
  };
  DataStatistics: undefined;
};

export type MainTabParamList = {
  Record: undefined;
  Home: undefined;
  Settings: undefined;
};