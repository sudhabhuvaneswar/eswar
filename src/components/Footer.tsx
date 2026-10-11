import React from 'react';
import { Wordmark } from './Wordmark';
import { ShieldCheck, Cpu, ArrowUpRight, Compass } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080d] py-12 px-4 sm:px-6 lg:px-8 mt-20 relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.06]">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <Wordmark size="md" />
            <p className="text-sm text-slate-400 max-w-md font-sans">
              “Don’t just plan your future. Explore your possibilities.”
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400 pt-2">
              <span className="px-2 py-0.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-300">
                E — Explore
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-300">
                S — Simulate
              </span>
              <span className="px-2 py-0.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-300">
                W — What-if
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-300">
                A — Act
              </span>
              <span className="px-2 py-0.5 rounded bg-violet-950/40 border border-violet-500/20 text-violet-300">
                R — Reflect
              </span>
            </div>
          </div>

          {/* Quick Core Modules */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Future Simulation Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Decision Comparator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('future-self')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Talk to Your Future Self
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Reality Progress Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Data Sovereignty & Model */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              Privacy & Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>Powered by Gemini 3.8 Flash</span>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('memory')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Memory Vault (User Owned)
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('settings')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1"
                >
                  Data Export & Backup
                </button>
              </li>
              <li className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                Zero client key exposure. Server-side proxy with strict JSON schemas.
              </li>
            </ul>
          </div>
        </div>

        {/* Epistemic disclaimer */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="max-w-3xl leading-relaxed text-[11px] text-slate-400">
            <strong className="text-slate-400 font-medium">Epistemic Notice:</strong> E.S.W.A.R. projections are scenario simulations generated from behavioral compounding models and user-defined constraints. They do not claim to forecast the future with certainty. Projections are labeled estimates to support deliberate human agency.
          </p>
          <div className="text-[11px] font-mono text-slate-400 shrink-0">
            E.S.W.A.R. v1.0 • System Active
          </div>
        </div>
      </div>
    </footer>
  );
};
