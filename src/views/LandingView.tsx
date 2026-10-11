import React, { useState } from 'react';
import { Wordmark } from '../components/Wordmark';
import {
  Sparkles,
  ArrowRight,
  GitBranch,
  ShieldAlert,
  Sliders,
  MessageSquare,
  Activity,
  Layers,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface LandingViewProps {
  onStart: () => void;
  onExploreDemo: () => void;
  onNavigate: (view: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStart,
  onExploreDemo,
  onNavigate,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'a' | 'b' | 'c'>('b');
  const [activeTab, setActiveTab] = useState<'architecture' | 'scenarios' | 'philosophy'>('scenarios');

  const branches = {
    a: {
      title: 'Path A: Current Path (Default Momentum)',
      badge: 'Status Quo',
      accent: 'border-slate-600/40 text-slate-300',
      gradient: 'from-slate-800 to-slate-900',
      day30: 'Intermittent 1-2 sessions weekly. Friction compounds when busy.',
      day90: '~20 scattered hours. Awareness increased, but no finished deployable project.',
      effort: 'Reactive 2h/wk',
      tradeoff: 'Low discomfort now, chronic delayed progress later.',
    },
    b: {
      title: 'Path B: Intentional Path (Protected 60-Min Focus)',
      badge: 'Intentional Focus',
      accent: 'border-violet-500/50 text-violet-300',
      gradient: 'from-violet-950/60 to-purple-900/40',
      day30: 'Resistance fades. Habit automatic before morning coffee.',
      day90: 'Over 85 focused hours logged. Completed working project & tangible proof of skill.',
      effort: 'Strict 7h/wk (daily)',
      tradeoff: 'Demands rigid morning boundaries; highest compounded skill upside.',
    },
    c: {
      title: 'Path C: Alternative Path (Sprint Clusters + Micro-Reviews)',
      badge: 'Asymmetric Pivot',
      accent: 'border-cyan-500/50 text-cyan-300',
      gradient: 'from-cyan-950/50 to-blue-900/30',
      day30: 'Two weekend 3-hour deep blocks without weekday guilt.',
      day90: '~65 deep hours. Modular prototype shipped with sustainable long-term energy.',
      effort: 'Clustered 6h/weekend',
      tradeoff: 'Protects unpredictable weekdays; requires strict weekend block defense.',
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[450px] h-[250px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        {/* Brand Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/50 border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-widest mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>E.S.W.A.R. Behavioral Intelligence Engine</span>
        </div>

        {/* Headlines */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
          Your Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-white">Isn't One Path.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Explore the decisions, habits, and possibilities that could shape what comes next. Don’t just plan your future. Explore your possibilities.
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-base shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Explore My Future</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-slate-200 font-medium text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>See How ESWAR Works</span>
          </button>
        </div>

        {/* Disclaimer subtext */}
        <p className="mt-4 text-xs font-mono text-slate-400">
          No deterministic prophesies • Scenario simulation grounded in behavioral heuristics
        </p>

        {/* Interactive Branching Timelines Visual Component */}
        <div className="mt-16 max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl glass-panel-glow text-left relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Interactive Branching Visualizer
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                Hypothetical Scenario: “Practising Programming 1 Hour Daily for 90 Days”
              </h2>
            </div>
            {/* Branch Selector Tabs */}
            <div className="flex rounded-lg bg-black/40 p-1 border border-white/[0.06] text-xs">
              <button
                onClick={() => setSelectedBranch('a')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBranch === 'a' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Path A (Default)
              </button>
              <button
                onClick={() => setSelectedBranch('b')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBranch === 'b' ? 'bg-violet-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Path B (Intentional)
              </button>
              <button
                onClick={() => setSelectedBranch('c')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedBranch === 'c' ? 'bg-cyan-700 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Path C (Alternative)
              </button>
            </div>
          </div>

          {/* Graphical Branching Canvas Representation */}
          <div className="py-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Node 1: Origin Point */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] relative">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-cyan-400 font-semibold">T-0: Today</span>
                  <span>Point of Choice</span>
                </div>
                <div className="font-semibold text-white text-sm">Decision Inception</div>
                <p className="text-xs text-slate-400 mt-1">
                  1 hour daily opportunity. Habit architecture has not yet solidified.
                </p>
                <div className="mt-3 text-[11px] font-mono text-violet-300 bg-violet-950/40 p-1.5 rounded border border-violet-800/30">
                  ⚡ 3 possible branching pathways diverge here
                </div>
              </div>

              {/* Node 2: Day 30 Checkpoint */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] relative">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-violet-400 font-semibold">Day 30</span>
                  <span>Friction Threshold</span>
                </div>
                <div className="font-semibold text-white text-sm">
                  {selectedBranch === 'a' && 'Sub-threshold Drift'}
                  {selectedBranch === 'b' && 'Friction Breakthrough'}
                  {selectedBranch === 'c' && 'Weekend Rhythm Locked'}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {branches[selectedBranch].day30}
                </p>
                <div className="mt-3 text-[11px] font-mono text-slate-400 bg-white/[0.03] p-1.5 rounded">
                  Effort: {branches[selectedBranch].effort}
                </div>
              </div>

              {/* Node 3: Day 90 Destination */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] relative">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="text-emerald-400 font-semibold">Day 90</span>
                  <span>Compounded State</span>
                </div>
                <div className="font-semibold text-white text-sm">
                  {selectedBranch === 'a' && 'Fragmented Outcome'}
                  {selectedBranch === 'b' && 'Tangible Skill Artifact'}
                  {selectedBranch === 'c' && 'Modular Working Prototype'}
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {branches[selectedBranch].day90}
                </p>
                <div className="mt-3 text-[11px] font-mono text-cyan-300 bg-cyan-950/30 p-1.5 rounded border border-cyan-800/20">
                  Trade-off: {branches[selectedBranch].tradeoff}
                </div>
              </div>
            </div>
          </div>

          {/* Quick interactive action within the preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-slate-900/60 border border-violet-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white">{branches[selectedBranch].title}</span>
              <p className="text-slate-400 mt-0.5">Want to test this scenario with your personal calendar and energy constraints?</p>
            </div>
            <button
              onClick={() => onNavigate('simulator')}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer shrink-0"
            >
              Simulate in Studio →
            </button>
          </div>
        </div>
      </section>

      {/* Brand Identity Breakdown: E - S - W - A - R */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            The E.S.W.A.R. Methodology
          </div>
          <h2 className="text-3xl font-bold font-display text-white">
            Five Dimensions of Human Possibility
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Each letter represents a deliberate cognitive phase in your future mapping architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              letter: 'E',
              word: 'Explore',
              desc: 'Frame unconstrained questions about choices, career pivots, and habits without anxiety.',
              color: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
            },
            {
              letter: 'S',
              word: 'Simulate',
              desc: 'Run multi-path projections with milestones, resource requirements, and risk factors.',
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
            },
            {
              letter: 'W',
              word: 'What-if',
              desc: 'Tweak assumptions in real-time: What if weekly hours drop by half? What if disruptions spike?',
              color: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
            },
            {
              letter: 'A',
              word: 'Act',
              desc: 'Condense wide scenarios into today’s single highest leverage action you can finish today.',
              color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
            },
            {
              letter: 'R',
              word: 'Reflect',
              desc: 'Review reality feedback without guilt. Log actual vs planned hours to calibrate future paths.',
              color: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
            },
          ].map((item) => (
            <div
              key={item.letter}
              className={`p-5 rounded-xl border backdrop-blur-md transition-all hover:-translate-y-1 ${item.color}`}
            >
              <div className="font-mono text-3xl font-extrabold mb-1">{item.letter}</div>
              <div className="text-base font-bold text-white mb-2">{item.word}</div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Pillars */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Talk to Your Future Self</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have reflective, voice-enabled conversations with an AI projection of yourself 30 days, 90 days, or 1 year in the future. Grounded in your actual goals and accomplishments.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Reality Tracker & Recalibration</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track planned versus accomplished hours with elegant charts. When life throws disruptions, ESWAR adjusts future scenarios constructively without shame.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">User-Sovereign Memory Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Store long-term goals, current projects, commitments, and lessons. Export or wipe your data anytime. Complete transparency and local consent controls.
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl glass-panel-glow relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <Wordmark size="md" className="mx-auto" />
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              Begin Mapping What Comes Next
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Set up your profile in 60 seconds, input your real constraints, and run your first multi-path simulation.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={onStart}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                Launch E.S.W.A.R. Simulator
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
