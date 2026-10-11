import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  AppSettings,
  SimulationResult,
  RealityLog,
  MemoryItem,
  ChatMessage,
  DecisionComparison,
} from '../types';

interface AppContextType {
  userProfile: UserProfile;
  settings: AppSettings;
  activeSimulation: SimulationResult | null;
  savedSimulations: SimulationResult[];
  realityLogs: RealityLog[];
  memoryItems: MemoryItem[];
  futureSelfHistory: ChatMessage[];
  serverStatus: { hasApiKey: boolean; model: string; online: boolean };
  isLoadingSimulation: boolean;
  simulationError: string | null;

  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setActiveSimulation: (sim: SimulationResult | null) => void;
  saveSimulation: (sim: SimulationResult) => void;
  deleteSavedSimulation: (query: string) => void;
  runSimulation: (prompt: string, horizon?: string, customAssumptions?: any) => Promise<SimulationResult | null>;
  compareDecisions: (optionA: string, optionB: string, context?: string) => Promise<DecisionComparison | null>;
  sendFutureSelfMessage: (message: string, horizon: string) => Promise<string>;
  clearFutureSelfChat: () => void;
  addRealityLog: (log: Omit<RealityLog, 'id'>) => void;
  deleteRealityLog: (id: string) => void;
  addMemoryItem: (item: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  updateMemoryItem: (id: string, updates: Partial<MemoryItem>) => void;
  deleteMemoryItem: (id: string) => void;
  exportAllData: () => string;
  importAllData: (jsonStr: string) => boolean;
  resetAllData: () => void;
  loadSampleData: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Explorer',
  primaryFocus: 'Programming & AI Architecture',
  dailyHours: 2,
  peakWindow: 'Morning (07:00 - 09:30)',
  mainFriction: 'Context switching & social media distraction',
  consentGiven: true,
  isOnboarded: false,
};

const defaultSettings: AppSettings = {
  speechEnabled: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  preferLiveAi: true,
  reduceMotion: false,
};

const initialSampleGoals: MemoryItem[] = [
  {
    id: 'mem-1',
    category: 'long-term-goal',
    title: 'Master Autonomous AI Agents Architecture',
    description: 'Build complete full-stack intelligent agent systems with real production tool calling and low latency.',
    targetHorizon: '1 year',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    progressPercent: 45,
  },
  {
    id: 'mem-2',
    category: 'current-project',
    title: 'Daily 60-Minute Deep Work Protocol',
    description: 'Maintain an untouchable 60-minute coding sprint every single morning before checking feeds.',
    targetHorizon: '90 days',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    progressPercent: 65,
  },
  {
    id: 'mem-3',
    category: 'commitment',
    title: 'Zero Social Media Scrolling Before Noon',
    description: 'Keep phone in another room until prime cognitive task is checked off.',
    targetHorizon: '30 days',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    progressPercent: 80,
  },
  {
    id: 'mem-4',
    category: 'lesson',
    title: 'Inertia breaks from the first 5 minutes',
    description: 'Resistance is highest at minute zero. Once the IDE is open and tests are running, flow naturally takes over.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    progressPercent: 100,
  },
];

const initialSampleLogs: RealityLog[] = [
  {
    id: 'log-1',
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    title: 'Morning Coding Sprint — Vector Embeddings',
    category: 'Programming & AI Architecture',
    plannedHours: 2,
    actualHours: 2,
    completed: true,
    notes: 'Completed indexing pipeline. Flow state reached in 10 minutes.',
  },
  {
    id: 'log-2',
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    title: 'Agent Tool Calling Integration',
    category: 'Programming & AI Architecture',
    plannedHours: 2,
    actualHours: 1.5,
    completed: true,
    notes: 'Slightly shorter due to college meeting, but shipped basic prototype.',
  },
  {
    id: 'log-3',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    title: 'University Midterm Prep vs Project',
    category: 'Academic & Exams',
    plannedHours: 3,
    actualHours: 2,
    completed: false,
    obstacle: 'Unexpected family errand and mental fatigue.',
    lessonsLearned: 'Do not schedule 3-hour study blocks immediately after afternoon lectures.',
  },
  {
    id: 'log-4',
    date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    title: 'Daily Review & System Refactor',
    category: 'Programming & AI Architecture',
    plannedHours: 1.5,
    actualHours: 1.5,
    completed: true,
    notes: 'Cleaned up state management and reduced bundle size.',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('eswar_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('eswar_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [savedSimulations, setSavedSimulations] = useState<SimulationResult[]>(() => {
    try {
      const saved = localStorage.getItem('eswar_simulations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(null);

  const [realityLogs, setRealityLogs] = useState<RealityLog[]>(() => {
    try {
      const saved = localStorage.getItem('eswar_reality_logs');
      return saved ? JSON.parse(saved) : initialSampleLogs;
    } catch {
      return initialSampleLogs;
    }
  });

  const [memoryItems, setMemoryItems] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('eswar_memory_items');
      return saved ? JSON.parse(saved) : initialSampleGoals;
    } catch {
      return initialSampleGoals;
    }
  });

  const [futureSelfHistory, setFutureSelfHistory] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('eswar_chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [serverStatus, setServerStatus] = useState({
    hasApiKey: false,
    model: 'gemini-3.8-flash',
    online: true,
  });

  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Sync to localStorage when user has given consent
  useEffect(() => {
    if (userProfile.consentGiven) {
      try {
        localStorage.setItem('eswar_profile', JSON.stringify(userProfile));
        localStorage.setItem('eswar_settings', JSON.stringify(settings));
        localStorage.setItem('eswar_simulations', JSON.stringify(savedSimulations));
        localStorage.setItem('eswar_reality_logs', JSON.stringify(realityLogs));
        localStorage.setItem('eswar_memory_items', JSON.stringify(memoryItems));
        localStorage.setItem('eswar_chat_history', JSON.stringify(futureSelfHistory));
      } catch (e) {
        console.warn('Storage sync failed:', e);
      }
    }
  }, [userProfile, settings, savedSimulations, realityLogs, memoryItems, futureSelfHistory]);

  // Check backend server status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({
          hasApiKey: Boolean(data.hasApiKey),
          model: data.model || 'gemini-3.8-flash',
          online: true,
        });
      })
      .catch(() => {
        setServerStatus({
          hasApiKey: false,
          model: 'gemini-3.8-flash (Offline Mode)',
          online: false,
        });
      });
  }, []);

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profileUpdate }));
  };

  const updateSettings = (settingsUpdate: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...settingsUpdate }));
  };

  const saveSimulation = (sim: SimulationResult) => {
    setSavedSimulations((prev) => {
      const filtered = prev.filter((s) => s.query !== sim.query);
      return [sim, ...filtered];
    });
  };

  const deleteSavedSimulation = (query: string) => {
    setSavedSimulations((prev) => prev.filter((s) => s.query !== query));
  };

  const runSimulation = async (
    prompt: string,
    horizon: string = '90 days',
    customAssumptions: any = {}
  ): Promise<SimulationResult | null> => {
    setIsLoadingSimulation(true);
    setSimulationError(null);

    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          horizon,
          userProfile,
          customAssumptions,
        }),
      });

      if (!res.ok) {
        throw new Error(`Simulation failed: status ${res.status}`);
      }

      const data: SimulationResult = await res.json();
      data.createdAt = new Date().toISOString();
      setActiveSimulation(data);
      saveSimulation(data);
      setIsLoadingSimulation(false);
      return data;
    } catch (err: any) {
      console.error('Run simulation error:', err);
      setSimulationError(err?.message || 'Failed to generate simulation. Using fallback engine.');
      setIsLoadingSimulation(false);
      return null;
    }
  };

  const compareDecisions = async (
    optionA: string,
    optionB: string,
    context: string = ''
  ): Promise<DecisionComparison | null> => {
    try {
      const res = await fetch('/api/compare-decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionA, optionB, context, userProfile }),
      });
      if (!res.ok) throw new Error('Failed to compare decisions');
      return await res.json();
    } catch (err) {
      console.error('Compare decisions error:', err);
      return null;
    }
  };

  const sendFutureSelfMessage = async (message: string, horizon: string): Promise<string> => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      horizon,
    };

    setFutureSelfHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/future-self', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          horizon,
          history: futureSelfHistory,
          userProfile: {
            ...userProfile,
            goals: memoryItems.filter((m) => m.status === 'active'),
            recentWins: realityLogs.filter((r) => r.completed),
          },
        }),
      });

      const data = await res.json();
      const reply = data.content || "Keep going. One focused step today outweighs a hundred worries about tomorrow.";

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        horizon,
      };

      setFutureSelfHistory((prev) => [...prev, assistantMsg]);
      return reply;
    } catch (err) {
      const fallbackReply = `From ${horizon} ahead, I can tell you that the exact doubt you are holding right now was normal. Stop waiting for the fear to vanish; take action alongside it.`;
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toISOString(),
        horizon,
      };
      setFutureSelfHistory((prev) => [...prev, assistantMsg]);
      return fallbackReply;
    }
  };

  const clearFutureSelfChat = () => {
    setFutureSelfHistory([]);
  };

  const addRealityLog = (log: Omit<RealityLog, 'id'>) => {
    const newLog: RealityLog = {
      id: `log-${Date.now()}`,
      ...log,
    };
    setRealityLogs((prev) => [newLog, ...prev]);
  };

  const deleteRealityLog = (id: string) => {
    setRealityLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const addMemoryItem = (item: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const newItem: MemoryItem = {
      id: `mem-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...item,
    };
    setMemoryItems((prev) => [newItem, ...prev]);
  };

  const updateMemoryItem = (id: string, updates: Partial<MemoryItem>) => {
    setMemoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteMemoryItem = (id: string) => {
    setMemoryItems((prev) => prev.filter((m) => m.id !== id));
  };

  const exportAllData = (): string => {
    const exportBundle = {
      app: 'E.S.W.A.R.',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      userProfile,
      settings,
      savedSimulations,
      realityLogs,
      memoryItems,
      futureSelfHistory,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importAllData = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.userProfile) setUserProfile(data.userProfile);
      if (data.settings) setSettings(data.settings);
      if (Array.isArray(data.savedSimulations)) setSavedSimulations(data.savedSimulations);
      if (Array.isArray(data.realityLogs)) setRealityLogs(data.realityLogs);
      if (Array.isArray(data.memoryItems)) setMemoryItems(data.memoryItems);
      if (Array.isArray(data.futureSelfHistory)) setFutureSelfHistory(data.futureSelfHistory);
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  };

  const resetAllData = () => {
    localStorage.clear();
    setUserProfile(defaultProfile);
    setSettings(defaultSettings);
    setSavedSimulations([]);
    setActiveSimulation(null);
    setRealityLogs([]);
    setMemoryItems([]);
    setFutureSelfHistory([]);
  };

  const loadSampleData = () => {
    setUserProfile({
      name: 'Alex Chen',
      primaryFocus: 'Programming & AI Architecture',
      dailyHours: 2,
      peakWindow: 'Morning (07:00 - 09:30)',
      mainFriction: 'Social media context switching and phone checking',
      consentGiven: true,
      isOnboarded: true,
    });
    setRealityLogs(initialSampleLogs);
    setMemoryItems(initialSampleGoals);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        settings,
        activeSimulation,
        savedSimulations,
        realityLogs,
        memoryItems,
        futureSelfHistory,
        serverStatus,
        isLoadingSimulation,
        simulationError,
        updateProfile,
        updateSettings,
        setActiveSimulation,
        saveSimulation,
        deleteSavedSimulation,
        runSimulation,
        compareDecisions,
        sendFutureSelfMessage,
        clearFutureSelfChat,
        addRealityLog,
        deleteRealityLog,
        addMemoryItem,
        updateMemoryItem,
        deleteMemoryItem,
        exportAllData,
        importAllData,
        resetAllData,
        loadSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
