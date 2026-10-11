import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DecisionComparison } from '../types';
import {
  Split,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldAlert,
  HelpCircle,
  Scale,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const { compareDecisions, userProfile, serverStatus } = useApp();

  const [optionA, setOptionA] = useState('Study 3 hours nightly for college exams & pause side-projects');
  const [optionB, setOptionB] = useState('Protect 90 minutes for building AI assistant + 90 minutes focused exam prep');
  const [context, setContext] = useState('Midterms are in 4 weeks, but delaying the AI assistant dampens personal momentum.');
  const [isComparing, setIsComparing] = useState(false);
  const [comparison, setComparison] = useState<DecisionComparison | null>(null);

  const presets = [
    {
      label: 'Exams vs Project',
      a: 'Focus 100% on exams for the next 3 weeks',
      b: 'Balance 70% exam prep + 30% morning coding block',
      c: 'Exams require passing grades, but total coding pauses trigger restarting friction.',
    },
    {
      label: 'Full-Time Job vs Bootstrapping',
      a: 'Accept safe enterprise role with fixed hours',
      b: 'Spend 6 months building niche AI SaaS',
      c: 'Runway is 8 months. High risk tolerance but need baseline discipline.',
    },
    {
      label: 'Learning Broadly vs 1 Deep Project',
      a: 'Take 3 online courses simultaneously covering all AI tools',
      b: 'Build and ship 1 end-to-end production application',
      c: 'Tutorial hell vs applied messy real-world engineering.',
    },
  ];

  const handleRunComparison = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!optionA.trim() || !optionB.trim()) return;
    setIsComparing(true);
    const result = await compareDecisions(optionA.trim(), optionB.trim(), context.trim());
    setComparison(result);
    setIsComparing(false);
  };

  const loadPreset = (p: typeof presets[0]) => {
    setOptionA(p.a);
    setOptionB(p.b);
    setContext(p.c);
    setComparison(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <Split className="w-4 h-4 text-cyan-400" />
          <span>Decision Analysis Matrix</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-white mt-1">
          Compare Decisions Side-by-Side
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
          Expose hidden trade-offs, opportunity costs, and friction gradients before you commit your time and reputation.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono text-slate-400">Presets:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => loadPreset(p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Formulation */}
      <form onSubmit={handleRunComparison} className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-violet-400 font-semibold">
                Decision Path A
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Status-Quo or Safe Path</span>
            </div>
            <textarea
              rows={3}
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="e.g. Focus 100% on exam prep and pause side projects"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-violet-500/30 focus:border-violet-400 focus:outline-none text-white text-xs sm:text-sm"
            />
          </div>

          {/* Option B */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Decision Path B
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Alternative or Leap Path</span>
            </div>
            <textarea
              rows={3}
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="e.g. Protect 90 minutes for building AI assistant + 90 min focused exam prep"
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-cyan-500/30 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Personal Context & Constraints:
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Midterm exams in 4 weeks; stress level currently high; energy drops by 8pm"
            className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/[0.08] focus:border-cyan-500 focus:outline-none text-white text-xs"
          />
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] font-mono text-slate-400">
            Powered by {serverStatus.hasApiKey ? 'Gemini 3.8 Flash' : 'Decision Heuristics'}
          </span>
          <button
            type="submit"
            disabled={isComparing || !optionA.trim() || !optionB.trim()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-violet-600/20"
          >
            {isComparing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Evaluating Trade-offs...</span>
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 text-cyan-300" />
                <span>Analyze Both Decisions</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comparison Results Card */}
      {comparison && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-cyan-950/40 border border-white/[0.1] space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
              Strategic Decision Synthesis
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">{comparison.summary}</p>
          </div>

          {/* Side by Side Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A card */}
            <div className="p-6 rounded-2xl glass-panel border border-violet-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                  Option A
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Time-to-Value: {comparison.optionA.timeToValue}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{comparison.optionA.name}</h3>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-400 block font-semibold">
                  Strengths & Upside
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {comparison.optionA.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-xs font-mono uppercase text-rose-400 block font-semibold">
                  Hidden Friction & Drawbacks
                </span>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  {comparison.optionA.drawbacks.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Optionality: {comparison.optionA.optionality}</span>
                <span className="text-violet-300">Friction Index: {comparison.optionA.frictionScore}/5</span>
              </div>
            </div>

            {/* Option B card */}
            <div className="p-6 rounded-2xl glass-panel border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Option B
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Time-to-Value: {comparison.optionB.timeToValue}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{comparison.optionB.name}</h3>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-emerald-400 block font-semibold">
                  Strengths & Upside
                </span>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {comparison.optionB.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-xs font-mono uppercase text-rose-400 block font-semibold">
                  Hidden Friction & Drawbacks
                </span>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  {comparison.optionB.drawbacks.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Optionality: {comparison.optionB.optionality}</span>
                <span className="text-cyan-300">Friction Index: {comparison.optionB.frictionScore}/5</span>
              </div>
            </div>
          </div>

          {/* The Verdict & The 48-Hour Experiment Question */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/60 via-purple-950/30 to-slate-900 border border-violet-500/40 space-y-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold mb-1">
                Recommendation & Decision Principle
              </div>
              <p className="text-sm font-medium text-white leading-relaxed">{comparison.verdict}</p>
            </div>

            <div className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-violet-300 font-bold block">
                The Low-Stakes 48-Hour Experiment:
              </span>
              <p className="text-xs text-slate-300">{comparison.experimentQuestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
