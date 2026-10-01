import React from 'react';
import { Sparkles, Calendar, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickAI: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenQuickAI }) => {
  const { studyStreak, resetToDemoData } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors"
        >
          ExamBuddy AI
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('timetable')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'timetable'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Timetable
          </button>
          <button
            onClick={() => setCurrentTab('analyzer')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'analyzer'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Free-Time Analyzer
          </button>
          <button
            onClick={() => setCurrentTab('subjects')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'subjects'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Subjects & Exams
          </button>
          <button
            onClick={() => setCurrentTab('syllabus')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'syllabus'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Syllabus & Revision
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`transition-colors whitespace-nowrap ${
              currentTab === 'analytics'
                ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5'
                : 'hover:text-slate-900'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Zone 3: Primary actions & Quick AI */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
          <span className="text-amber-500 font-mono font-semibold tabular-nums">🔥 {studyStreak.current}d</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono tabular-nums">{Math.round(studyStreak.completedTodayMins / 60 * 10) / 10}h today</span>
        </div>

        <button
          onClick={onOpenQuickAI}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick AI Command</span>
        </button>

        <button
          onClick={resetToDemoData}
          title="Reset sample data"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
