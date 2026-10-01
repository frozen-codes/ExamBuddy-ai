import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const quickPrompts = [
  'Plan my evening.',
  'I only have 2 hours today.',
  'I missed my DBMS session.',
  'My exam is in 5 days, prioritize high-yield units.',
  'I do not want to study after 9 PM.',
  'Add extra 15-minute breaks between subjects.',
];

export const QuickAIModal: React.FC<QuickAIModalProps> = ({ isOpen, onClose }) => {
  const { executeQuickAICommand, isLoadingAI } = useApp();
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!command.trim() || isLoadingAI) return;

    const res = await executeQuickAICommand(command.trim());
    setResponse(res);
  };

  const handleSelectQuick = (prompt: string) => {
    setCommand(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick AI Adaptive Planner</h3>
              <p className="text-[11px] text-slate-500">Natural-language schedule reorganization & optimization</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              What would you like to adjust in your schedule?
            </label>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="e.g., 'I only have 2 hours today' or 'I missed my DBMS session'"
                className="w-full px-4 py-3 pr-12 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                disabled={isLoadingAI}
                autoFocus
              />
              <button
                type="submit"
                disabled={!command.trim() || isLoadingAI}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-200 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>

          {/* Preset quick actions */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Popular Quick Prompts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectQuick(p)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Display */}
          {response && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Timetable Recalibrated</span>
              </div>
              <p className="text-xs text-indigo-950 leading-relaxed whitespace-pre-line">
                {response}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Engine: Gemini Flash · Cognitive Fatigue Protection
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <span>Done & View Timetable</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
