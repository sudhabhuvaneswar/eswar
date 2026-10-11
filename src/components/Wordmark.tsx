import React, { useState } from 'react';

interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
}) => {
  const [showExpansionTooltip, setShowExpansionTooltip] = useState(false);

  const expansion = [
    { letter: 'E', word: 'Explore', desc: 'Survey your landscape of possibilities' },
    { letter: 'S', word: 'Simulate', desc: 'Model branching scenario outcomes' },
    { letter: 'W', word: 'What-if', desc: 'Stress-test alternative paths & assumptions' },
    { letter: 'A', word: 'Act', desc: 'Isolate today’s single highest leverage action' },
    { letter: 'R', word: 'Reflect', desc: 'Calibrate via non-judgmental reality feedback' },
  ];

  const sizeClasses = {
    sm: 'text-lg tracking-[0.25em]',
    md: 'text-2xl tracking-[0.3em]',
    lg: 'text-4xl tracking-[0.35em]',
    xl: 'text-5xl md:text-6xl tracking-[0.4em]',
  };

  return (
    <div
      className={`relative inline-flex flex-col items-start select-none group ${className}`}
      onMouseEnter={() => setShowExpansionTooltip(true)}
      onMouseLeave={() => setShowExpansionTooltip(false)}
      onClick={onClick}
    >
      <div className="flex items-center space-x-1 cursor-pointer">
        <div className={`font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-cyan-200 to-white drop-shadow-[0_0_12px_rgba(139,92,246,0.35)] ${sizeClasses[size]}`}>
          <span>E</span>
          <span className="text-violet-400 opacity-80 mx-0.5">.</span>
          <span>S</span>
          <span className="text-cyan-400 opacity-80 mx-0.5">.</span>
          <span>W</span>
          <span className="text-violet-400 opacity-80 mx-0.5">.</span>
          <span>A</span>
          <span className="text-cyan-400 opacity-80 mx-0.5">.</span>
          <span>R</span>
          <span className="text-violet-400 opacity-80 mx-0.5">.</span>
        </div>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 ml-2 tracking-widest hidden sm:inline-block">
          AI
        </span>
      </div>

      {showSubtitle && (
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
          <span>Personal Future Simulator</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse"></span>
        </div>
      )}

      {/* Floating Interactive Brand Expansion Card */}
      {showExpansionTooltip && (
        <div className="absolute top-full left-0 mt-2 z-50 w-72 p-3.5 rounded-xl bg-[#0e101c]/95 border border-violet-500/30 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="text-[10px] font-mono uppercase tracking-wider text-violet-400 mb-2 border-b border-violet-500/20 pb-1 flex justify-between items-center">
            <span>System Architecture</span>
            <span className="text-slate-400 font-sans">E.S.W.A.R.</span>
          </div>
          <div className="space-y-1.5">
            {expansion.map((item) => (
              <div key={item.letter} className="flex items-start text-xs group/item">
                <span className="w-5 font-mono font-bold text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded text-center mr-2 text-[11px]">
                  {item.letter}
                </span>
                <div className="leading-tight">
                  <span className="font-semibold text-slate-200 mr-1.5">{item.word}</span>
                  <span className="text-slate-400 text-[11px] block">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
