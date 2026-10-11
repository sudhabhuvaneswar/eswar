import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Sparkles,
  Send,
  Volume2,
  VolumeX,
  Clock,
  User,
  Bot,
  Trash2,
  Mic,
  MicOff,
  HelpCircle,
  AlertCircle,
  Play,
  Square,
} from 'lucide-react';

interface FutureSelfViewProps {
  initialContext?: string;
}

export const FutureSelfView: React.FC<FutureSelfViewProps> = ({ initialContext }) => {
  const {
    futureSelfHistory,
    sendFutureSelfMessage,
    clearFutureSelfChat,
    userProfile,
    settings,
    memoryItems,
    realityLogs,
  } = useApp();

  const [inputMessage, setInputMessage] = useState(initialContext ? `How should I approach: ${initialContext}?` : '');
  const [horizon, setHorizon] = useState<'30 days' | '90 days' | '1 year' | '3 years'>('90 days');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterQuestions = [
    'Looking back, what was the hardest week during this stretch?',
    'Did I end up burning out trying to balance everything at once?',
    'Was reducing my phone distraction actually worth the initial friction?',
    'What is one mistake you urge me not to make right now?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [futureSelfHistory, isSending]);

  // Handle Speech Synthesis
  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isSpeaking && currentSpeakingId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate || 1.0;
    utterance.pitch = settings.speechPitch || 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.lang.startsWith('en'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakingId(msgId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Voice Input
  const toggleVoiceInput = () => {
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
        setInputMessage(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const msg = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    try {
      const reply = await sendFutureSelfMessage(msg, horizon);
      // Auto-speak if enabled
      if (settings.speechEnabled && 'speechSynthesis' in window) {
        handleSpeak(reply, `auto-${Date.now()}`);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-fade-in flex flex-col min-h-[calc(100vh-14rem)]">
      {/* Top Header & Horizon Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>The Future Self Experience</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white mt-1">
            Talk to Your Future Self
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            A reflective conversational space informed by your goals, routines, and reality tracking.
          </p>
        </div>

        {/* Horizon Picker */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.08]">
          {(['30 days', '90 days', '1 year', '3 years'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                horizon === h
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              +{h}
            </button>
          ))}
        </div>
      </div>

      {/* Prominent Ethical Notice / Disclaimer */}
      <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20 flex items-start gap-3 text-xs text-slate-300">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block font-medium">Reflective Simulation Notice:</strong>
          This is an AI-generated dialogue model designed to foster psychological distancing and self-compassion. It is not an actual forecast, supernatural message, or prophecy from a real future person.
        </div>
      </div>

      {/* Active Persona Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-purple-950/20 to-slate-900/60 border border-violet-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/50 flex items-center justify-center text-cyan-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {userProfile.name} • Projected from +{horizon} ahead
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Context: {memoryItems.filter((m) => m.status === 'active').length} active goals • {realityLogs.filter((r) => r.completed).length} logged milestones
            </div>
          </div>
        </div>

        {futureSelfHistory.length > 0 && (
          <button
            onClick={clearFutureSelfChat}
            className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-rose-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear conversation history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Dialogue</span>
          </button>
        )}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 min-h-[380px] p-4 sm:p-6 rounded-2xl glass-panel overflow-y-auto space-y-4 max-h-[520px]">
        {futureSelfHistory.length === 0 ? (
          /* Empty / Introduction State */
          <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-violet-950/60 border border-violet-500/40 flex items-center justify-center text-violet-300 mx-auto">
              <Sparkles className="w-6 h-6 text-cyan-300" />
            </div>
            <h3 className="text-base font-bold text-white">
              Start a Dialogue with Your Future Self
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask about the friction you are experiencing today, test your assumptions about burn-out, or ask what you’ll wish you had started sooner.
            </p>

            <div className="pt-2 text-left space-y-2">
              <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Reflective inquiries to begin with:
              </div>
              <div className="grid grid-cols-1 gap-2">
                {starterQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(q);
                    }}
                    className="p-2.5 rounded-xl bg-black/40 hover:bg-violet-950/40 border border-white/[0.06] hover:border-violet-500/30 text-xs text-slate-300 hover:text-white transition-all text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>{q}</span>
                    <span className="text-cyan-400 text-[10px] font-mono">Select →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          futureSelfHistory.map((msg) => {
            const isUser = msg.role === 'user';
            const isThisSpeaking = isSpeaking && currentSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs sm:text-sm ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-violet-900/60 border border-violet-500/50 flex items-center justify-center text-cyan-300 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl space-y-2 relative group ${
                    isUser
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-black/60 border border-white/[0.08] text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono opacity-70 border-b border-white/[0.08] pb-1 mb-1">
                    <span>{isUser ? 'You Today' : `Future Self (+${msg.horizon || horizon})`}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <p className="whitespace-pre-wrap leading-relaxed font-sans">{msg.content}</p>

                  {!isUser && (
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                          isThisSpeaking
                            ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 animate-pulse'
                            : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isThisSpeaking ? (
                          <>
                            <Square className="w-3 h-3 text-rose-400" />
                            <span>Stop voice</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-cyan-400" />
                            <span>Read aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/[0.1] flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isSending && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-8 h-8 rounded-full bg-violet-900/60 border border-violet-500/50 flex items-center justify-center text-cyan-300 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/[0.08] text-slate-400 flex items-center gap-2 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>Synthesizing perspective from +{horizon} ahead...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input formulation area */}
      <form onSubmit={handleSend} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask your future self (+${horizon}) about an obstacle or decision...`}
            className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-black/70 border border-white/[0.12] focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={toggleVoiceInput}
            title="Dictate with voice"
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border cursor-pointer ${
              isListening
                ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputMessage.trim() || isSending}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-40 text-white font-semibold text-xs transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-lg shadow-violet-600/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
