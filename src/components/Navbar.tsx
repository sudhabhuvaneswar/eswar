import React, { useState } from 'react';
import { Wordmark } from './Wordmark';
import { useApp } from '../context/AppContext';
import {
  Compass,
  GitBranch,
  Split,
  MessageSquare,
  Activity,
  Database,
  Settings,
  Sparkles,
  Menu,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { userProfile, serverStatus, settings, updateSettings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'simulator', label: 'Future Simulator', icon: GitBranch },
    { id: 'compare', label: 'Compare Decisions', icon: Split },
    { id: 'future-self', label: 'Future Self', icon: MessageSquare },
    { id: 'tracker', label: 'Reality Tracker', icon: Activity },
    { id: 'memory', label: 'Memory Vault', icon: Database },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#08090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-6">
          <Wordmark size="sm" onClick={() => onNavigate('landing')} />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-white/[0.08]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-200 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          {/* AI Server indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus.hasApiKey
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
              }`}
            />
            <span className="text-slate-300">
              {serverStatus.hasApiKey ? 'Gemini 3.8 Flash' : 'Deterministic Engine'}
            </span>
          </div>

          {/* Audio toggle button */}
          <button
            onClick={() => updateSettings({ speechEnabled: !settings.speechEnabled })}
            title={settings.speechEnabled ? 'Future Self voice enabled' : 'Voice synthesis muted'}
            className={`p-2 rounded-lg border transition-colors ${
              settings.speechEnabled
                ? 'bg-violet-950/40 border-violet-500/30 text-violet-300'
                : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-300'
            }`}
          >
            {settings.speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings button */}
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-lg border transition-colors ${
              currentView === 'settings'
                ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
            title="System Settings & Privacy"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Quick Simulate CTA */}
          <button
            onClick={() => onNavigate('simulator')}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(124,58,237,0.35)] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
            <span>Simulate Path</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/[0.08] bg-[#0c0e18] px-4 py-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] text-xs text-slate-400">
            <span>Welcome, {userProfile.name}</span>
            <span className="font-mono text-[10px] text-cyan-400">
              {serverStatus.hasApiKey ? 'Live AI Active' : 'Heuristic Mode'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-left ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-200 border border-violet-500/40'
                      : 'bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => handleLinkClick('landing')}
              className="text-xs text-slate-400 hover:text-violet-300 underline"
            >
              Back to Overview
            </button>
            <button
              onClick={() => handleLinkClick('settings')}
              className="text-xs text-slate-400 hover:text-violet-300 flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings & Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
