import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Shield,
  Cpu,
  Volume2,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    settings,
    updateSettings,
    serverStatus,
    exportAllData,
    resetAllData,
    loadSampleData,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [primaryFocus, setPrimaryFocus] = useState(userProfile.primaryFocus);
  const [dailyHours, setDailyHours] = useState(userProfile.dailyHours);
  const [peakWindow, setPeakWindow] = useState(userProfile.peakWindow);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Explorer',
      primaryFocus,
      dailyHours: Number(dailyHours),
      peakWindow,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eswar-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>System Configuration & Privacy</span>
        </div>
        <h1 className="text-3xl font-bold font-display text-white mt-1">
          Settings & Intelligence Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
          Manage your AI model connection, speech synthesis, profile calibration, and data privacy.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Profile configuration updated successfully.</span>
        </div>
      )}

      {/* 1. AI Intelligence Engine Diagnostic */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">AI Engine Diagnostics</h3>
          </div>
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
              serverStatus.hasApiKey
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}
          >
            {serverStatus.hasApiKey ? 'Live Gemini 3.8 Flash' : 'Deterministic Heuristic Mode'}
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            E.S.W.A.R. utilizes a secure server-side Express proxy. API keys are stored in backend environment secrets (`GEMINI_API_KEY`) and are never exposed to browser memory.
          </p>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Server Status:</span>
              <span className="text-emerald-400 font-bold">Online (Port 3000)</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">Inference Model:</span>
              <span className="text-cyan-300 font-bold">{serverStatus.model}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono">
              <span className="text-slate-400">SDK Version:</span>
              <span className="text-slate-300">@google/genai ^2.4.0</span>
            </div>
          </div>

          {!serverStatus.hasApiKey && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Demo & Heuristic Mode Active:</strong> Your app is currently using ESWAR's deterministic behavioral heuristics engine. To activate live generative scenarios, configure your `GEMINI_API_KEY` in the AI Studio Secrets panel.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. User Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl glass-panel space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Profile & Daily Capacity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Explorer Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Protected Hours / Day:
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Primary Craft Focus:</label>
          <input
            type="text"
            value={primaryFocus}
            onChange={(e) => setPrimaryFocus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Peak Clarity Window:</label>
          <input
            type="text"
            value={peakWindow}
            onChange={(e) => setPeakWindow(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold cursor-pointer transition-colors"
          >
            Save Profile Calibration
          </button>
        </div>
      </form>

      {/* 3. Audio & Voice Synthesis */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
          <Volume2 className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-bold text-white">Speech & Future Self Voice</h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Future Self Voice Readout</span>
              <span className="text-slate-400">
                Automatically read future self responses using web speech synthesis.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.speechEnabled}
              onChange={(e) => updateSettings({ speechEnabled: e.target.checked })}
              className="h-4 w-4 rounded accent-violet-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Speech Rate:</span>
              <span className="font-mono text-cyan-400">{settings.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={settings.speechRate}
              onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Privacy & Data Sovereignty */}
      <div className="p-6 rounded-2xl glass-panel border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-white/[0.08]">
          <Shield className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Data Sovereignty & Permanent Wipe</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          You own 100% of your data. All memory records, reality logs, and scenarios reside strictly in your local sandbox unless you choose to export them.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Complete Archive (JSON)</span>
          </button>

          <button
            onClick={loadSampleData}
            className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
            <span>Reset to Curated Sample Data</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Local Storage</span>
          </button>
        </div>

        {showResetConfirm && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500 text-xs space-y-2 mt-3 animate-in fade-in">
            <p className="text-white font-bold">
              Are you sure? This will delete all saved goals, logs, and simulated scenarios.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Yes, Permanently Wipe
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-black/60 text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
