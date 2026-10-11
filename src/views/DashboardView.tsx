import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Mic,
  MicOff,
  ArrowRight,
  GitBranch,
  Split,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Zap,
  Target,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  Play,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string, extra?: any) => void;
  onExploreQuery: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onExploreQuery,
}) => {
  const {
    userProfile,
    memoryItems,
    realityLogs,
    savedSimulations,
    updateMemoryItem,
    setActiveSimulation,
    loadSampleData,
  } = useApp();

  const [queryInput, setQueryInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [dailyActionDone, setDailyActionDone] = useState(false);

  // Suggested exploration questions from prompt
  const starterQuestions = [
    'What could happen if I practise programming for one hour every day for 90 days?',
    'How can I balance college exams with building my AI assistant?',
    'What might change if I reduce my social media use?',
    'Which of my current goals deserves attention first?',
  ];

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your future query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQueryInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleExploreSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryInput.trim()) return;
    onExploreQuery(queryInput.trim());
  };

  const activeGoals = memoryItems.filter((m) => m.category === 'long-term-goal' || m.category === 'current-project');
  const commitments = memoryItems.filter((m) => m.category === 'commitment' && m.status === 'active');
  const missedLogs = realityLogs.filter((r) => !r.completed);

  // Daily action calculation
  const primaryGoal = activeGoals[0]?.title || userProfile.primaryFocus || 'Core Ambition';

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Welcome & Time Horizon Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Personal Intelligence Operating System</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white mt-1">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-cyan-200 to-white">{userProfile.name}</span>.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Focus: <strong className="text-slate-300 font-medium">{userProfile.primaryFocus}</strong> • Capacity: <span className="font-mono text-cyan-300">{userProfile.dailyHours}h protected/day</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('future-self')}
            className="px-3.5 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/30 text-violet-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Consult Future Self</span>
          </button>
          <button
            onClick={() => onNavigate('tracker')}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-slate-200 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Log Reality</span>
          </button>
        </div>
      </div>

      {/* 2. Central Simulation Input with Voice Microphone */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel-glow relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <label className="block text-center text-sm font-semibold tracking-wide text-white uppercase font-mono">
            What future do you want to explore?
          </label>

          <form onSubmit={handleExploreSubmit} className="relative flex items-center">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. What could happen if I practise programming for 1 hour every day for 90 days?"
              className="w-full pl-5 pr-28 py-4 rounded-2xl bg-black/70 border border-violet-500/30 focus:border-cyan-400 focus:outline-none text-white text-sm sm:text-base placeholder:text-slate-500 shadow-2xl transition-all"
            />

            <div className="absolute right-2 flex items-center gap-1.5">
              {/* Mic Control */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? 'Listening... click to stop' : 'Click to speak question'}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                    : 'bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.1]'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!queryInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Simulate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Quick starter chips */}
          <div className="pt-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 text-center">
              Or explore one of these realistic scenarios:
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {starterQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQueryInput(q);
                    onExploreQuery(q);
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-violet-950/50 border border-white/[0.07] hover:border-violet-500/40 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Prominent Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Action 1: Explore a Future */}
        <div
          onClick={() => onNavigate('simulator')}
          className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 hover:bg-[#121424] transition-all cursor-pointer group space-y-3 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-950/70 border border-violet-500/40 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform">
            <GitBranch className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
              Explore a Future
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Model 3 parallel futures: Current Path, Intentional Path, and Alternative Path with interactive milestones and trade-offs.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
            <span>Launch Simulation Studio →</span>
          </div>
        </div>

        {/* Action 2: Compare Decisions */}
        <div
          onClick={() => onNavigate('compare')}
          className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-cyan-500/40 hover:bg-[#101726] transition-all cursor-pointer group space-y-3 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
            <Split className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
              Compare Decisions
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Stress-test Option A versus Option B. Uncover hidden opportunity costs, reversibility, and short-term friction.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
            <span>Analyze Trade-offs →</span>
          </div>
        </div>

        {/* Action 3: Review My Progress */}
        <div
          onClick={() => onNavigate('tracker')}
          className="p-6 rounded-2xl glass-panel border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#0e1c1c] transition-all cursor-pointer group space-y-3 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-200 transition-colors">
              Review My Progress
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Compare planned hours with actual accomplishments. Non-judgmental timeline recalibration when life intervenes.
            </p>
          </div>
          <div className="flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
            <span>Open Reality Tracker →</span>
          </div>
        </div>
      </div>

      {/* 4. Daily Recommended Action Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-slate-900/60 border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-violet-300 shrink-0 mt-0.5">
            <Zap className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                Today’s Recommended Leverage Point
              </span>
              <span className="text-xs text-slate-400">45-minute block</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-1">
              Complete one clean, uninterrupted coding sprint on “{primaryGoal}” before midday.
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Rationale: Research indicates starting your hardest cognitive task within your peak window ({userProfile.peakWindow}) prevents 70% of evening avoidance loops.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setDailyActionDone(!dailyActionDone)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              dailyActionDone
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{dailyActionDone ? 'Completed Today' : 'Mark Action Done'}</span>
          </button>
        </div>
      </div>

      {/* 5. Visual Timeline of Current Goals & Commitments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Timeline of Goals (2 cols on large screen) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" />
              <h3 className="text-base font-bold text-white">Visual Timeline of Active Goals</h3>
            </div>
            <button
              onClick={() => onNavigate('memory')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Manage in Vault</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {activeGoals.length === 0 ? (
            /* Realistic empty state */
            <div className="py-8 text-center border border-dashed border-white/[0.1] rounded-xl p-6 space-y-3">
              <Compass className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">No active goals registered in your personal memory yet.</p>
              <button
                onClick={loadSampleData}
                className="px-4 py-2 rounded-lg bg-violet-600/30 text-violet-200 text-xs hover:bg-violet-600/50 cursor-pointer"
              >
                Load Starter Goals
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-4 rounded-xl bg-black/40 border border-white/[0.06] hover:border-violet-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{goal.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/60 border border-violet-800/40 text-violet-300">
                          {goal.targetHorizon || '90 days'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">{goal.description}</p>
                    </div>
                    <span className="font-mono text-xs text-cyan-300 font-bold shrink-0">
                      {goal.progressPercent || 0}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${goal.progressPercent || 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Scenarios & Unfinished Commitments */}
        <div className="p-6 rounded-2xl glass-panel space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              <span>Recent Scenarios</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {savedSimulations.length} modeled
            </span>
          </div>

          {savedSimulations.length === 0 ? (
            /* Realistic empty state */
            <div className="py-6 text-center border border-dashed border-white/[0.08] rounded-xl p-4 space-y-2">
              <Sparkles className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No simulations generated yet.</p>
              <button
                onClick={() => onExploreQuery(starterQuestions[0])}
                className="text-xs text-cyan-400 hover:underline"
              >
                Run sample simulation
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedSimulations.slice(0, 3).map((sim, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveSimulation(sim);
                    onNavigate('simulator');
                  }}
                  className="p-3 rounded-xl bg-black/40 border border-white/[0.06] hover:border-cyan-500/40 cursor-pointer transition-all"
                >
                  <p className="text-xs font-medium text-slate-200 line-clamp-2">
                    {sim.query}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-2">
                    <span>Horizon: {sim.horizon}</span>
                    <span className="text-cyan-400 hover:underline flex items-center gap-0.5">
                      Review paths →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Unfinished commitments section (handled non-judgmentally) */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Active Commitments
              </span>
              <span className="text-[10px] text-violet-400">Low-friction</span>
            </div>

            {commitments.length === 0 ? (
              <p className="text-xs text-slate-400">All commitments currently up to date.</p>
            ) : (
              <div className="space-y-1.5">
                {commitments.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs"
                  >
                    <span className="text-slate-300 truncate max-w-[200px]">{comm.title}</span>
                    <button
                      onClick={() => updateMemoryItem(comm.id, { status: 'completed' })}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 shrink-0 cursor-pointer"
                    >
                      Check Off
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
