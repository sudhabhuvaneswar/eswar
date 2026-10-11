import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MemoryItem } from '../types';
import {
  Database,
  PlusCircle,
  Download,
  Upload,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const MemoryView: React.FC = () => {
  const {
    memoryItems,
    addMemoryItem,
    updateMemoryItem,
    deleteMemoryItem,
    exportAllData,
    importAllData,
    resetAllData,
    userProfile,
    updateProfile,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);

  const [formCategory, setFormCategory] = useState<MemoryItem['category']>('long-term-goal');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formHorizon, setFormHorizon] = useState('90 days');
  const [formProgress, setFormProgress] = useState(30);

  const categories = [
    { id: 'all', label: 'All Memory Records' },
    { id: 'long-term-goal', label: 'Long-Term Goals' },
    { id: 'current-project', label: 'Current Projects' },
    { id: 'commitment', label: 'Personal Commitments' },
    { id: 'lesson', label: 'Lessons Learned' },
    { id: 'routine', label: 'Preferred Routines' },
  ];

  const filteredItems = memoryItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      updateMemoryItem(editingItem.id, {
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        targetHorizon: formHorizon,
        progressPercent: formProgress,
      });
      setEditingItem(null);
    } else {
      addMemoryItem({
        category: formCategory,
        title: formTitle.trim(),
        description: formDescription.trim(),
        targetHorizon: formHorizon,
        status: 'active',
        progressPercent: formProgress,
      });
    }

    setFormTitle('');
    setFormDescription('');
    setIsAdding(false);
  };

  const handleStartEdit = (item: MemoryItem) => {
    setEditingItem(item);
    setFormCategory(item.category);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormHorizon(item.targetHorizon || '90 days');
    setFormProgress(item.progressPercent || 0);
    setIsAdding(true);
  };

  const handleExport = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eswar-personal-vault-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) {
        alert('Vault backup imported successfully!');
      } else {
        alert('Failed to parse vault file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Personal Memory Vault • Sovereign Storage</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-white mt-1">
            Manage Saved Personal Context
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-light">
            E.S.W.A.R. only recalls what you explicitly save here. No ghost data, no clandestine tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingItem(null);
              setFormTitle('');
              setFormDescription('');
              setIsAdding(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-violet-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Memory Item</span>
          </button>

          <button
            onClick={handleExport}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer"
            title="Export vault backup"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Consent & Privacy Status Banner */}
      <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-semibold text-white">Local Privacy Sovereignty:</span>
            <span className="text-slate-300 ml-1.5">
              Storage is active with your explicit permission. You can export or erase this vault at any time.
            </span>
          </div>
        </div>

        <label className="text-[11px] font-mono text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
          <Upload className="w-3.5 h-3.5" />
          <span>Restore Backup</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </label>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-1.5 pb-2 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === c.id
                  ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-sm'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/[0.1] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-white/[0.08] rounded-2xl p-6 space-y-3 max-w-md mx-auto">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Items Found in this Category</h4>
          <p className="text-xs text-slate-400">
            {searchQuery
              ? 'Try modifying your search keywords.'
              : 'Add your first goal, project, or personal commitment above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const badgeColor = {
              'long-term-goal': 'text-cyan-300 bg-cyan-950/60 border-cyan-800/50',
              'current-project': 'text-violet-300 bg-violet-950/60 border-violet-800/50',
              'commitment': 'text-amber-300 bg-amber-950/60 border-amber-800/50',
              'lesson': 'text-emerald-300 bg-emerald-950/60 border-emerald-800/50',
              'routine': 'text-purple-300 bg-purple-950/60 border-purple-800/50',
            }[item.category];

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}
                    >
                      {item.category.replace('-', ' ')}
                    </span>
                    {item.targetHorizon && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.targetHorizon}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                  {item.progressPercent !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Progress</span>
                        <span className="text-cyan-300 font-bold">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        item.status === 'completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                          : item.status === 'paused'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-violet-950/60 text-violet-300'
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                        title="Edit item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMemoryItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl glass-panel-glow p-6 space-y-4 text-left border border-violet-500/40">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>{editingItem ? 'Edit Memory Item' : 'New Memory Record'}</span>
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-slate-200"
                >
                  <option value="long-term-goal">Long-Term Goal</option>
                  <option value="current-project">Current Project</option>
                  <option value="commitment">Personal Commitment</option>
                  <option value="lesson">Lesson Learned</option>
                  <option value="routine">Preferred Routine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title:</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Master Autonomous AI Agents Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description & Context:
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Build complete full-stack agent applications with low latency and real tool execution."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Target Horizon:
                  </label>
                  <input
                    type="text"
                    value={formHorizon}
                    onChange={(e) => setFormHorizon(e.target.value)}
                    placeholder="e.g. 90 days, 1 year"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/[0.1] text-xs text-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Progress:</span>
                    <span className="font-mono text-cyan-400">{formProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formProgress}
                    onChange={(e) => setFormProgress(parseInt(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-lg bg-white/[0.04] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  {editingItem ? 'Save Changes' : 'Record in Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
