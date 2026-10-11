import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wordmark } from '../components/Wordmark';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Shield,
  Clock,
  Sparkles,
  Zap,
  Target,
  AlertCircle,
} from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const { userProfile, updateProfile, loadSampleData } = useApp();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState(userProfile.name || '');
  const [primaryFocus, setPrimaryFocus] = useState(userProfile.primaryFocus || 'Programming & Software Development');
  const [dailyHours, setDailyHours] = useState(userProfile.dailyHours || 2);
  const [peakWindow, setPeakWindow] = useState(userProfile.peakWindow || 'Morning (07:00 - 09:30)');
  const [mainFriction, setMainFriction] = useState(userProfile.mainFriction || 'Social media and phone distraction');
  const [consentGiven, setConsentGiven] = useState(true);

  const focusSuggestions = [
    'Programming & AI Architecture',
    'Balancing College Exams & Tech Projects',
    'Career Transition into Software Engineering',
    'Reclaiming Focus & Reducing Social Media',
    'Startup / Creative Product Launch',
  ];

  const peakWindowOptions = [
    'Early Morning (06:00 - 08:30)',
    'Mid Morning (09:00 - 12:00)',
    'Afternoon (14:00 - 17:00)',
    'Late Evening / Night (20:00 - 23:30)',
  ];

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Explorer',
      primaryFocus,
      dailyHours: Number(dailyHours),
      peakWindow,
      mainFriction,
      consentGiven,
      isOnboarded: true,
    });
    onComplete();
  };

  const handleUsePreset = () => {
    loadSampleData();
    onComplete();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto flex flex-col justify-center">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Wordmark size="sm" className="mx-auto" />
        <h1 className="text-2xl font-bold font-display text-white mt-4">
          Personalize Your Simulation Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          E.S.W.A.R. calibrates its scenario models to your real schedule and energy patterns.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? 'w-8 bg-cyan-400'
                  : i < step
                  ? 'w-4 bg-violet-600'
                  : 'w-4 bg-white/[0.1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Wizard Card */}
      <div className="p-6 sm:p-8 rounded-2xl glass-panel-glow text-left space-y-6">
        {/* Step 1: Name & Ambition */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Step 1 of 4 • Identity & Ambition</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                What should E.S.W.A.R. call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex, Maya, Dev"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] focus:border-violet-500 focus:outline-none text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                What is your primary focus or ambition right now?
              </label>
              <input
                type="text"
                value={primaryFocus}
                onChange={(e) => setPrimaryFocus(e.target.value)}
                placeholder="e.g. Practice programming 1h/day, ship my AI assistant"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] focus:border-cyan-500 focus:outline-none text-white text-sm mb-3"
              />

              <div className="text-[11px] text-slate-400 mb-1.5">Or select a common scenario:</div>
              <div className="flex flex-wrap gap-1.5">
                {focusSuggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPrimaryFocus(item)}
                    className={`text-xs px-2.5 py-1 rounded-lg border text-left transition-all ${
                      primaryFocus === item
                        ? 'bg-violet-600/30 border-violet-500 text-violet-200'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Time Capacity */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Step 2 of 4 • Time Reality & Energy</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Realistic daily hours you can protect (without burn-out):
                </label>
                <span className="text-cyan-400 font-mono font-bold text-sm">{dailyHours} hr/day</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>30 min (Micro-sprint)</span>
                <span>2 hrs (Recommended)</span>
                <span>6 hrs (Full-time deep block)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                When does your highest mental clarity occur?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {peakWindowOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPeakWindow(opt)}
                    className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                      peakWindow === opt
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200 shadow-sm'
                        : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {peakWindow === opt && <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Habits & Friction */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Step 3 of 4 • Friction & Obstacles</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                What is your biggest point of friction or interruption?
              </label>
              <textarea
                rows={3}
                value={mainFriction}
                onChange={(e) => setMainFriction(e.target.value)}
                placeholder="e.g. Checking short-form videos when tired; college exam surges; difficulty starting."
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] focus:border-violet-500 focus:outline-none text-white text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                ESWAR uses this friction factor to model Path A (current default pattern) vs Path B (intentional defense).
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Privacy & Consent */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Step 4 of 4 • Memory Consent & Data Rights</span>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-700 text-violet-600 focus:ring-violet-500 accent-violet-600"
                />
                <label htmlFor="consentCheck" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                  <strong className="text-white block mb-0.5">Explicit Consent for Personal Memory</strong>
                  I agree to allow E.S.W.A.R. to store my goals, habits, and progress logs locally in my browser’s secure storage. I understand I can view, export, or permanently wipe this data at any time from the Memory Vault.
                </label>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-white/[0.06] pt-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>E.S.W.A.R. never sells or shares your personal data. API calls are proxied securely without exposing client keys.</span>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg bg-white/[0.04] text-slate-300 text-xs font-medium hover:bg-white/[0.08] flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleUsePreset}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Load sample profile instead</span>
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 flex items-center gap-1.5 shadow-md shadow-violet-600/20 cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 text-white text-xs font-bold hover:from-cyan-500 hover:to-violet-500 flex items-center gap-2 shadow-lg shadow-cyan-600/20 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Enter E.S.W.A.R. Studio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
