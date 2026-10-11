import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RealityLog } from '../types';
import {
  Activity,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Compass,
  ArrowRight,
  Sparkles,
  Calendar,
  Filter,
  Trash2,
  Zap,
} from 'lucide-react';

export const TrackerView: React.FC = () => {
  const { realityLogs, addRealityLog, deleteRealityLog, userProfile } = useApp();

  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState({
    title: '',
    category: userProfile.primaryFocus || 'Programming & AI Architecture',
    plannedHours: 2,
    actualHours: 2,
    completed: true,
    notes: '',
    obstacle: '',
    lessonsLearned: '',
  });

  const categories = [
    'Programming & AI Architecture',
    'Academic & Exams',
    'Health & Deep Rest',
    'Personal Writing & Thinking',
    'Distraction Defense',
  ];

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.title.trim()) return;

    addRealityLog({
      date: new Date().toISOString().split('T')[0],
      title: newLog.title.trim(),
      category: newLog.category,
      plannedHours: Number(newLog.plannedHours),
      actualHours: Number(newLog.actualHours),
      completed: newLog.completed,
      notes: newLog.notes.trim() || undefined,
      obstacle: newLog.obstacle.trim() || undefined,
      lessonsLearned: newLog.lessonsLearned.trim() || undefined,
    });

    setNewLog({
      title: '',
      category: userProfile.primaryFocus || 'Programming & AI Architecture',
      plannedHours: 2,
      actualHours: 2,
      completed: true,
      notes: '',
      obstacle: '',
      lessonsLearned: '',
    });
    setIsAddingLog(false);
  };

  // Calculations for analytics
  const totalPlanned = realityLogs.reduce((acc, l) => acc + (l.plannedHours || 0), 0);
  const totalActual = realityLogs.reduce((acc, l) => acc + (l.actualHours || 0), 0);
  const completedCount = realityLogs.filter((l) => l.completed).length;
  const missedLogs = realityLogs.filter((l) => !l.completed);
  const adherenceRate =
    realityLogs.length > 0 ? Math.round((completedCount / realityLogs.length) * 100) : 100;
  const effortDelta = totalActual - totalPlanned;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Reality Tracker & Ground Truth Engine</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white mt-1">
            Measure Planned vs Accomplished
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            Observe your actual execution velocity without self-criticism. Feed empirical data back into future simulations.
          </p>
        </div>

        <button
          onClick={() => setIsAddingLog(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Daily Reality</span>
        </button>
      </div>

      {/* Metric High-Level Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Planned vs Actual Total */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Total Hours Logged
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">{totalActual}h</span>
            <span className="text-xs text-slate-400 font-mono">/ {totalPlanned}h planned</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {effortDelta >= 0 ? (
              <span className="text-emerald-400">+{effortDelta}h ahead of planned budget</span>
            ) : (
              <span className="text-amber-400">{Math.abs(effortDelta)}h unspent reserve</span>
            )}
          </div>
        </div>

        {/* Adherence Rate */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Commitment Consistency
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-300">{adherenceRate}%</span>
            <span className="text-xs text-slate-400">
              ({completedCount}/{realityLogs.length})
            </span>
          </div>
          <div className="text-[11px] text-slate-400">Based on documented sessions</div>
        </div>

        {/* Recalibration Signal */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Simulation Velocity Index
          </div>
          <div className="text-2xl font-bold font-mono text-violet-300">
            {adherenceRate >= 80 ? 'Path B Stable' : adherenceRate >= 60 ? 'Path C Aligned' : 'Path A Drift'}
          </div>
          <div className="text-[11px] text-slate-400">Scenario calibration status</div>
        </div>

        {/* Recalibration State */}
        <div className="p-5 rounded-2xl glass-panel space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Non-Judgmental Recalibration
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {missedLogs.length} to adjust
          </div>
          <div className="text-[11px] text-slate-400">Friction logged without shame</div>
        </div>
      </div>

      {/* Visual Effort Comparison Chart (SVG) */}
      <div className="p-6 rounded-2xl glass-panel-glow space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Effort Variance: Planned vs Actual Hours</h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-violet-600/70" />
              <span className="text-slate-300">Planned Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-cyan-400" />
              <span className="text-slate-300">Actual Hours</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="pt-4 overflow-x-auto">
          {realityLogs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No sessions logged yet. Record your first reality check above.
            </div>
          ) : (
            <div className="min-w-[500px] h-52 flex items-end gap-6 px-4 pb-4 border-b border-white/[0.08] relative">
              {realityLogs.slice(0, 8).map((log, i) => {
                const maxVal = 4;
                const plannedHeight = Math.min(100, (log.plannedHours / maxVal) * 100);
                const actualHeight = Math.min(100, (log.actualHours / maxVal) * 100);

                return (
                  <div key={log.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      {/* Planned Bar */}
                      <div
                        className="w-4 bg-violet-600/40 border border-violet-500/40 rounded-t transition-all group-hover:bg-violet-600/60"
                        style={{ height: `${plannedHeight}%` }}
                        title={`Planned: ${log.plannedHours}h`}
                      />
                      {/* Actual Bar */}
                      <div
                        className={`w-4 rounded-t transition-all ${
                          log.completed
                            ? 'bg-cyan-400 border border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                            : 'bg-rose-400/80 border border-rose-400'
                        }`}
                        style={{ height: `${actualHeight}%` }}
                        title={`Actual: ${log.actualHours}h`}
                      />
                    </div>
                    {/* Date label */}
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                      {log.date.slice(5)}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate max-w-[80px] group-hover:text-cyan-300">
                      {log.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Missed Commitments: Non-Judgmental Recalibration Module */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/60 to-purple-950/30 border border-violet-500/30 space-y-4">
        <div className="flex items-center gap-2 text-violet-300">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <h3 className="text-base font-bold text-white">
            Constructive Recalibration Engine (No Shame / Zero Guilt)
          </h3>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          When life intervenes, traditional habit trackers declare a "broken streak" and foster avoidance. E.S.W.A.R. treats missed sessions as vital telemetry to adjust simulation assumptions.
        </p>

        {missedLogs.length === 0 ? (
          <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>All recorded sessions met planned targets. Your baseline momentum is currently stable.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missedLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-black/50 border border-rose-500/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between text-slate-300 font-semibold">
                  <span>{log.title}</span>
                  <span className="text-[10px] font-mono text-rose-300">
                    {log.actualHours}h vs {log.plannedHours}h
                  </span>
                </div>
                {log.obstacle && (
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Telemetry:</strong> {log.obstacle}
                  </p>
                )}
                <div className="pt-1 text-[11px] text-cyan-300 font-mono flex items-center gap-1.5 border-t border-white/[0.06]">
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Recommendation: Shift tomorrow’s block to 45 min instead of 2 hours.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Feed Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Historical Reality Log</h3>
          <span className="text-xs font-mono text-slate-400">{realityLogs.length} total entries</span>
        </div>

        <div className="space-y-2.5">
          {realityLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{log.title}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                    {log.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{log.date}</span>
                </div>
                {log.notes && <p className="text-slate-400 text-[11px]">{log.notes}</p>}
                {log.lessonsLearned && (
                  <p className="text-violet-300 text-[11px] italic font-mono">
                    Lesson: {log.lessonsLearned}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right font-mono text-xs">
                  <div className="text-white font-bold">{log.actualHours}h completed</div>
                  <div className="text-[10px] text-slate-400">Planned: {log.plannedHours}h</div>
                </div>
                <button
                  onClick={() => deleteRealityLog(log.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Log Modal */}
      {isAddingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow p-6 space-y-4 text-left border border-emerald-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Log Daily Reality</span>
              </h3>
              <button
                onClick={() => setIsAddingLog(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Session Title:</label>
                <input
                  type="text"
                  required
                  value={newLog.title}
                  onChange={(e) => setNewLog({ ...newLog, title: e.target.value })}
                  placeholder="e.g. Morning 60-min coding sprint on LLM integration"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Planned Hours:
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={newLog.plannedHours}
                    onChange={(e) =>
                      setNewLog({ ...newLog, plannedHours: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Actual Hours Done:
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={newLog.actualHours}
                    onChange={(e) =>
                      setNewLog({ ...newLog, actualHours: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Domain Category:</label>
                <select
                  value={newLog.category}
                  onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-slate-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Obstacle Faced (if disrupted):
                </label>
                <input
                  type="text"
                  value={newLog.obstacle}
                  onChange={(e) => setNewLog({ ...newLog, obstacle: e.target.value })}
                  placeholder="e.g. Phone notifications broke flow state after 25 min"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Key Lesson or Insight:
                </label>
                <input
                  type="text"
                  value={newLog.lessonsLearned}
                  onChange={(e) => setNewLog({ ...newLog, lessonsLearned: e.target.value })}
                  placeholder="e.g. Close browser communication tabs before launching IDE"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="logCompleted"
                  checked={newLog.completed}
                  onChange={(e) => setNewLog({ ...newLog, completed: e.target.checked })}
                  className="rounded text-emerald-600 accent-emerald-500"
                />
                <label htmlFor="logCompleted" className="text-xs text-slate-300 cursor-pointer">
                  Mark session as satisfactorily completed
                </label>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingLog(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
