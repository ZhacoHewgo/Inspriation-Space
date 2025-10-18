import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Inspiration {
  id: string;
  title: string;
  content: string;
  category: 'learning' | 'research' | 'creation' | 'life';
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface InspirationContextType {
  inspirations: Inspiration[];
  addInspiration: (inspiration: Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInspiration: (id: string, updates: Partial<Inspiration>) => void;
  deleteInspiration: (id: string) => void;
  getInspirationsByCategory: (category: string) => Inspiration[];
}

const InspirationContext = createContext<InspirationContextType | undefined>(undefined);

// Mock initial data
const initialInspirations: Inspiration[] = [
  {
    id: '1',
    title: '移动应用设计思路',
    content: '为大学生设计一款时间管理应用的初步构思，界面设计要简洁，突出核心功能。考虑使用卡片式布局，方便用户快速查看和管理任务。',
    category: 'creation',
    color: '#ffffff',
    createdAt: new Date('2024-10-17T10:45:00'),
    updatedAt: new Date('2024-10-17T10:45:00'),
  },
  {
    id: '2',
    title: '摄影系列创意',
    content: '一组以"城市寂静"为主题的摄影系列，捕捉大都市中宁静的瞬间。重点关注清晨的街道、深夜的咖啡店、雨后的公园等场景。',
    category: 'creation',
    color: '#ffffff',
    createdAt: new Date('2024-10-17T09:30:00'),
    updatedAt: new Date('2024-10-17T09:30:00'),
  },
  {
    id: '3',
    title: '学习方法总结',
    content: '今天学习了费曼学习法，通过向别人解释概念来检验自己的理解程度。这个方法很有效，可以快速发现知识盲点。',
    category: 'learning',
    color: '#ffffff',
    createdAt: new Date('2024-10-16T14:20:00'),
    updatedAt: new Date('2024-10-16T14:20:00'),
  },
  {
    id: '4',
    title: '研究课题想法',
    content: '关于人工智能在教育领域的应用研究，特别是个性化学习路径的推荐算法。可以结合学习者的认知特点和学习历史数据。',
    category: 'research',
    color: '#ffffff',
    createdAt: new Date('2024-10-15T16:15:00'),
    updatedAt: new Date('2024-10-15T16:15:00'),
  },
];

export function InspirationProvider({ children }: { children: ReactNode }) {
  const [inspirations, setInspirations] = useState<Inspiration[]>(initialInspirations);

  const addInspiration = (inspirationData: Omit<Inspiration, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInspiration: Inspiration = {
      ...inspirationData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setInspirations(prev => [newInspiration, ...prev]);
  };

  const updateInspiration = (id: string, updates: Partial<Inspiration>) => {
    setInspirations(prev =>
      prev.map(inspiration =>
        inspiration.id === id
          ? { ...inspiration, ...updates, updatedAt: new Date() }
          : inspiration
      )
    );
  };

  const deleteInspiration = (id: string) => {
    setInspirations(prev => prev.filter(inspiration => inspiration.id !== id));
  };

  const getInspirationsByCategory = (category: string) => {
    return inspirations.filter(inspiration => inspiration.category === category);
  };

  return (
    <InspirationContext.Provider
      value={{
        inspirations,
        addInspiration,
        updateInspiration,
        deleteInspiration,
        getInspirationsByCategory,
      }}
    >
      {children}
    </InspirationContext.Provider>
  );
}

export function useInspiration() {
  const context = useContext(InspirationContext);
  if (context === undefined) {
    throw new Error('useInspiration must be used within an InspirationProvider');
  }
  return context;
}