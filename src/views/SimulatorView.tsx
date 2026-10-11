import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Scenario, SimulationResult } from '../types';
import {
  Sparkles,
  GitBranch,
  Sliders,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Layers,
  Share2,
  Copy,
  Download,
  Mic,
  MicOff,
  RefreshCw,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface SimulatorViewProps {
  initialQuery?: string;
  onNavigateToFutureSelf?: (context: string) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({
  initialQuery = '',
  onNavigateToFutureSelf,
}) => {
  const {
    activeSimulation,
    isLoadingSimulation,
    simulationError,
    runSimulation,
    userProfile,
    serverStatus,
  } = useApp();

  const [prompt, setPrompt] = useState(initialQuery || (activeSimulation?.query || ''));
  const [horizon, setHorizon] = useState('90 days');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('path-b');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'focused'>('side-by-side');
  const [isTweakingAssumptions, setIsTweakingAssumptions] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  // Dynamic assumptions that user can tweak
  const [assumptions, setAssumptions] = useState({
    weeklyHours: userProfile.dailyHours * 7 || 14,
    consistencyRate: 85,
    environmentSupport: 'Moderate (Some interruptions)',
    accountabilityType: 'Personal Log + Public Shipments',
  });

  const [isListening, setIsListening] = useState(false);

  // If initialQuery changes from outside, trigger simulation if no active one
  useEffect(() => {
    if (initialQuery && initialQuery !== activeSimulation?.query) {
      setPrompt(initialQuery);
      runSimulation(initialQuery, horizon, assumptions);
    }
  }, [initialQuery]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    await runSimulation(prompt.trim(), horizon, assumptions);
  };

  const handleApplyTweaks = async () => {
    setIsTweakingAssumptions(false);
    if (prompt.trim()) {
      await runSimulation(prompt.trim(), horizon, assumptions);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        setPrompt(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const copySummary = () => {
    if (!activeSimulation) return;
    const text = `E.S.W.A.R. Simulation Report: "${activeSimulation.query}" (Horizon: ${activeSimulation.horizon})\n\n${activeSimulation.comparativeInsight}\n\nDisclaimer: Projections are heuristic scenario models, not factual guarantees.`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  const downloadJson = () => {
    if (!activeSimulation) return;
    const blob = new Blob([JSON.stringify(activeSimulation, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eswar-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedScenario =
    activeSimulation?.scenarios.find((s) => s.id === selectedScenarioId) ||
    activeSimulation?.scenarios[1] ||
    activeSimulation?.scenarios[0];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Simulation Engine Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>Future Simulation Engine • Multi-Path Heuristics</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white mt-1">
            Simulate & Compare Futures
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Generate 3 plausible scenarios, inspect milestones, stress-test trade-offs, and isolate your immediate next step.
          </p>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center gap-2">
          {activeSimulation && (
            <>
              <button
                onClick={() => setViewMode(viewMode === 'side-by-side' ? 'focused' : 'side-by-side')}
                className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-slate-300 flex items-center gap-1.5 cursor-pointer"
              >
                {viewMode === 'side-by-side' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Focus Mode</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Side-by-Side</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsTweakingAssumptions(true)}
                className="px-3 py-1.5 rounded-lg bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/40 text-xs font-semibold text-violet-200 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-300" />
                <span>Tweak Assumptions</span>
              </button>

              <button
                onClick={copySummary}
                title="Copy simulation summary"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={downloadJson}
                title="Download JSON report"
                className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs text-center animate-in fade-in">
          Simulation summary copied to clipboard!
        </div>
      )}

      {/* Query Bar */}
      <div className="p-5 rounded-2xl glass-panel space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. What could happen if I practise programming for 1 hour every day for 90 days?"
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/60 border border-white/[0.12] focus:border-violet-500 focus:outline-none text-white text-sm"
            />
            <button
              type="button"
              onClick={toggleVoice}
              title="Voice dictation"
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border cursor-pointer ${
                isListening
                  ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Horizon Selector */}
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
              className="px-3 py-3 rounded-xl bg-black/60 border border-white/[0.12] text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="30 days">Horizon: 30 Days</option>
              <option value="90 days">Horizon: 90 Days</option>
              <option value="180 days">Horizon: 6 Months</option>
              <option value="1 year">Horizon: 1 Year</option>
            </select>

            {/* Run Button */}
            <button
              type="submit"
              disabled={isLoadingSimulation || !prompt.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 cursor-pointer shrink-0"
            >
              {isLoadingSimulation ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Modeling Possibilities...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Simulate Futures</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Epistemic Label */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Estimates, not facts. Projections reflect behavioral friction and compounding assumptions.</span>
          </div>
          <span className="hidden sm:inline">
            Model: {serverStatus.hasApiKey ? 'Gemini 3.8 Flash' : 'Heuristic Engine'}
          </span>
        </div>
      </div>

      {/* Error state */}
      {simulationError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{simulationError}</span>
        </div>
      )}

      {/* Empty State when no simulation has been loaded */}
      {!activeSimulation && !isLoadingSimulation && (
        <div className="p-12 rounded-2xl glass-panel text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-cyan-300 mx-auto">
            <GitBranch className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Scenario Active</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submit a question above to generate three divergent paths (Current Path, Intentional Path, Alternative Path) and see where different choices lead.
          </p>
          <button
            onClick={() => {
              setPrompt('What could happen if I practise programming for one hour every day for 90 days?');
              runSimulation(
                'What could happen if I practise programming for one hour every day for 90 days?',
                '90 days',
                assumptions
              );
            }}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
          >
            Run Default Scenario
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoadingSimulation && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
            <span>Formulating behavioral assumptions, milestone nodes, and risk matrices...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl glass-panel space-y-4 animate-pulse">
                <div className="h-4 bg-white/[0.08] rounded w-1/3" />
                <div className="h-6 bg-white/[0.08] rounded w-3/4" />
                <div className="h-16 bg-white/[0.04] rounded" />
                <div className="space-y-2 pt-4">
                  <div className="h-3 bg-white/[0.05] rounded" />
                  <div className="h-3 bg-white/[0.05] rounded w-5/6" />
                  <div className="h-3 bg-white/[0.05] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Simulation Results Display */}
      {activeSimulation && !isLoadingSimulation && (
        <div className="space-y-6">
          {/* Comparative Insight Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/50 via-slate-900/60 to-cyan-950/40 border border-violet-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 uppercase tracking-wider font-semibold">
                Comparative Scenario Synthesis
              </span>
              <span className="text-slate-400">Horizon: {activeSimulation.horizon}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {activeSimulation.comparativeInsight}
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/[0.06] flex items-center justify-between">
              <span>{activeSimulation.epistemicDisclaimer}</span>
              {activeSimulation.demoNotice && (
                <span className="text-amber-400/90">{activeSimulation.demoNotice}</span>
              )}
            </div>
          </div>

          {/* Scenario Tab Pills for Mobile or Navigation */}
          <div className="flex rounded-xl bg-black/40 p-1 border border-white/[0.06] max-w-md mx-auto">
            {activeSimulation.scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedScenarioId === sc.id
                    ? sc.pathType === 'current'
                      ? 'bg-slate-700 text-white'
                      : sc.pathType === 'intentional'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-cyan-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sc.badge}
              </button>
            ))}
          </div>

          {/* Side-by-Side Mode */}
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {activeSimulation.scenarios.map((scenario) => {
                const isSelected = selectedScenarioId === scenario.id;
                const pathColors = {
                  current: {
                    border: 'border-slate-700',
                    badge: 'bg-slate-800 text-slate-300 border-slate-600',
                    title: 'text-slate-200',
                    dot: 'bg-slate-400',
                  },
                  intentional: {
                    border: 'border-violet-500/50 shadow-[0_0_25px_rgba(139,92,246,0.12)]',
                    badge: 'bg-violet-950/80 text-violet-300 border-violet-500/40',
                    title: 'text-white',
                    dot: 'bg-violet-400',
                  },
                  alternative: {
                    border: 'border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.1)]',
                    badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
                    title: 'text-white',
                    dot: 'bg-cyan-400',
                  },
                }[scenario.pathType];

                return (
                  <div
                    key={scenario.id}
                    onClick={() => setSelectedScenarioId(scenario.id)}
                    className={`rounded-2xl glass-panel p-6 space-y-5 transition-all cursor-pointer border ${pathColors.border} ${
                      isSelected ? 'ring-2 ring-violet-400/50' : 'opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Badge & Title */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${pathColors.badge}`}
                        >
                          {scenario.badge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {scenario.confidenceLevel}
                        </span>
                      </div>
                      <h3 className={`text-lg font-bold font-display ${pathColors.title}`}>
                        {scenario.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {scenario.summary}
                      </p>
                    </div>

                    {/* Timeline Milestones */}
                    <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                      <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                        Timeline & Milestones
                      </div>
                      <div className="space-y-2.5">
                        {scenario.timeline.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-black/40 border border-white/[0.05] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-mono text-[10px] text-cyan-300 font-semibold">
                              <span>{m.time}</span>
                              <span className="text-slate-300 font-sans">{m.milestone}</span>
                            </div>
                            <p className="text-slate-300 text-[11px] leading-tight">
                              {m.description}
                            </p>
                            {m.indicator && (
                              <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                                Signal: {m.indicator}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Required Effort & Resources */}
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs space-y-1.5">
                      <div className="flex items-center gap-1 text-[11px] font-mono text-violet-300 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Required Effort:</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{scenario.requiredEffort}</p>
                      <div className="pt-1 flex flex-wrap gap-1">
                        {scenario.requiredResources.map((res, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-slate-300 border border-white/[0.06]"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Benefits vs Risks */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1">
                          Potential Benefits
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                          {scenario.potentialBenefits.slice(0, 2).map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-rose-400 block mb-1">
                          Risks & Uncertainties
                        </span>
                        <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                          {scenario.risksAndUncertainties.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Key Assumptions */}
                    <div className="text-[11px] text-slate-400 font-mono bg-black/40 p-2.5 rounded-lg border border-white/[0.04]">
                      <span className="text-slate-300 font-semibold block mb-0.5">Assumptions:</span>
                      {scenario.assumptions.join(' • ')}
                    </div>

                    {/* Immediate Action */}
                    <div className="pt-2">
                      <div className="p-3.5 rounded-xl bg-violet-950/50 border border-violet-500/40 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                          <Lightbulb className="w-4 h-4 text-cyan-300" />
                          <span>Immediate Action Today:</span>
                        </div>
                        <p className="text-slate-200 text-xs font-medium leading-snug">
                          {scenario.immediateAction}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Focused Detailed Mode */
            selectedScenario && (
              <div className="p-8 rounded-2xl glass-panel-glow max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300">
                      {selectedScenario.badge}
                    </span>
                    <h2 className="text-2xl font-bold font-display text-white mt-2">
                      {selectedScenario.title}
                    </h2>
                    <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                      {selectedScenario.summary}
                    </p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400">
                    <div>Confidence Heuristic</div>
                    <div className="text-cyan-300 font-bold">{selectedScenario.confidenceLevel}</div>
                  </div>
                </div>

                {/* Milestones deep dive */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                    Milestone Evolution
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedScenario.timeline.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-black/50 border border-white/[0.08] space-y-2"
                      >
                        <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                          <span className="font-bold">{m.time}</span>
                          <span className="text-slate-400 text-[10px]">Checkpoint #{idx + 1}</span>
                        </div>
                        <div className="font-semibold text-white text-xs">{m.milestone}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.description}</p>
                        {m.indicator && (
                          <div className="text-[10px] font-mono text-violet-300 pt-1">
                            Signal: {m.indicator}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Effort, resources, assumptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono uppercase text-violet-300 font-semibold block">
                      Required Effort & Resources
                    </span>
                    <p className="text-xs text-slate-300">{selectedScenario.requiredEffort}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedScenario.requiredResources.map((res, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-white/[0.08]"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono uppercase text-cyan-300 font-semibold block">
                      Assumptions in Projection
                    </span>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {selectedScenario.assumptions.map((ass, i) => (
                        <li key={i}>{ass}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Immediate Action banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/70 to-indigo-950/50 border border-violet-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-[11px] font-mono uppercase text-cyan-300 font-bold flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      <span>Immediate Practical Step (Action Dimension)</span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {selectedScenario.immediateAction}
                    </p>
                  </div>
                  {onNavigateToFutureSelf && (
                    <button
                      onClick={() => onNavigateToFutureSelf(selectedScenario.title)}
                      className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shrink-0 cursor-pointer shadow-md"
                    >
                      Discuss with Future Self →
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Assumptions Tweak Drawer Modal */}
      {isTweakingAssumptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow p-6 space-y-5 text-left border border-violet-500/40">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Stress-Test Assumptions</h3>
              </div>
              <button
                onClick={() => setIsTweakingAssumptions(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Modify the underlying parameters below. E.S.W.A.R. will re-simulate the outcomes to show how sensitive your future trajectory is to these variables.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Target Protected Hours per Week:</span>
                  <span className="font-mono text-cyan-400 font-bold">{assumptions.weeklyHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  value={assumptions.weeklyHours}
                  onChange={(e) =>
                    setAssumptions({ ...assumptions, weeklyHours: parseInt(e.target.value) })
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Consistency Adherence Target:</span>
                  <span className="font-mono text-violet-400 font-bold">{assumptions.consistencyRate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={assumptions.consistencyRate}
                  onChange={(e) =>
                    setAssumptions({ ...assumptions, consistencyRate: parseInt(e.target.value) })
                  }
                  className="w-full accent-violet-500"
                />
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  (Below 65% triggers high inertia drift in Path A)
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Environmental Friction Level:</label>
                <select
                  value={assumptions.environmentSupport}
                  onChange={(e) =>
                    setAssumptions({ ...assumptions, environmentSupport: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-slate-200"
                >
                  <option value="Low Friction (Dedicated room, phone off)">Low Friction (Dedicated room, phone off)</option>
                  <option value="Moderate (Some interruptions, college/family)">Moderate (Some interruptions, college/family)</option>
                  <option value="High Friction (Volatile schedule, frequent emergencies)">High Friction (Volatile schedule, frequent emergencies)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Accountability Feedback:</label>
                <select
                  value={assumptions.accountabilityType}
                  onChange={(e) =>
                    setAssumptions({ ...assumptions, accountabilityType: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-slate-200"
                >
                  <option value="Personal Log + Public Shipments">Personal Log + Public Shipments</option>
                  <option value="Private Journal Only">Private Journal Only</option>
                  <option value="Peer Partner / Mentor Check-ins">Peer Partner / Mentor Check-ins</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTweakingAssumptions(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] text-slate-300 text-xs font-medium"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleApplyTweaks}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-xs font-bold cursor-pointer"
              >
                Re-Simulate with New Assumptions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
