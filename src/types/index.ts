export type Horizon = '30 days' | '90 days' | '1 year' | '3 years';

export interface Milestone {
  time: string;
  milestone: string;
  description: string;
  indicator?: string;
}

export interface Scenario {
  id: string;
  pathType: 'current' | 'intentional' | 'alternative';
  title: string;
  badge: string;
  summary: string;
  confidenceLevel: string;
  timeline: Milestone[];
  requiredEffort: string;
  requiredResources: string[];
  potentialBenefits: string[];
  risksAndUncertainties: string[];
  assumptions: string[];
  immediateAction: string;
  scores: {
    effort: number; // 1-5
    upside: number; // 1-5
    friction: number; // 1-5
  };
}

export interface SimulationResult {
  query: string;
  horizon: string;
  scenarios: Scenario[];
  comparativeInsight: string;
  epistemicDisclaimer: string;
  source?: string;
  isLiveAi?: boolean;
  demoNotice?: string;
  createdAt: string;
}

export interface DecisionComparison {
  summary: string;
  optionA: {
    name: string;
    strengths: string[];
    drawbacks: string[];
    timeToValue: string;
    optionality: string;
    frictionScore: number;
    growthScore: number;
  };
  optionB: {
    name: string;
    strengths: string[];
    drawbacks: string[];
    timeToValue: string;
    optionality: string;
    frictionScore: number;
    growthScore: number;
  };
  verdict: string;
  experimentQuestion: string;
  isLiveAi?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  horizon?: string;
}

export interface RealityLog {
  id: string;
  date: string;
  title: string;
  category: string;
  plannedHours: number;
  actualHours: number;
  completed: boolean;
  notes?: string;
  obstacle?: string;
  lessonsLearned?: string;
}

export interface MemoryItem {
  id: string;
  category: 'long-term-goal' | 'current-project' | 'commitment' | 'lesson' | 'routine';
  title: string;
  description: string;
  targetHorizon?: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  progressPercent?: number;
}

export interface UserProfile {
  name: string;
  primaryFocus: string;
  dailyHours: number;
  peakWindow: string;
  mainFriction: string;
  consentGiven: boolean;
  isOnboarded: boolean;
}

export interface AppSettings {
  speechEnabled: boolean;
  speechRate: number;
  speechPitch: number;
  preferLiveAi: boolean;
  reduceMotion: boolean;
}
