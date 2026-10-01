import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  BookOpen,
  CheckSquare,
  BarChart3,
  CalendarCheck2,
  Settings,
  Flame,
  Moon,
  Sun,
  Home,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const { profile, studyStreak, timetable } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timetable', label: 'Daily Timetable', icon: CalendarDays },
    { id: 'analyzer', label: 'Free-Time Analyzer', icon: Clock },
    { id: 'schedule', label: 'Fixed Commitments', icon: CalendarCheck2 },
    { id: 'subjects', label: 'Subjects & Exams', icon: BookOpen },
    { id: 'syllabus', label: 'Syllabus & Revision', icon: CheckSquare },
    { id: 'analytics', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Profile & Targets', icon: Settings },
  ];

  const pendingCount = timetable.filter((s) => !s.isBreak && s.status === 'scheduled').length;

  const handleSelect = (tab: string) => {
    setCurrentTab(tab);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          {/* Brand header in sidebar */}
          <div className="flex items-center justify-between px-2 pb-5 pt-1 border-b border-slate-800/80">
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                ExamBuddy <span className="text-indigo-400 font-mono text-xs px-1.5 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/50">AI</span>
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">Adaptive Study Planner</p>
            </div>

            <button
              onClick={() => handleSelect('landing')}
              title="View Landing Page"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Student Profile Quick Badge */}
          <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                {profile.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{profile.semester}</p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" />
                <span className="font-mono tabular-nums">{profile.wakeUpTime}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <Moon className="w-3 h-3 text-indigo-400" />
                <span className="font-mono tabular-nums">{profile.sleepTime}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-mono tabular-nums text-slate-300 font-medium">
                {profile.dailyStudyTargetHours}h goal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'timetable' && pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 font-mono text-[10px] rounded bg-indigo-900 text-indigo-200 border border-indigo-700/50">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info: Streak & quick stats */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Flame className="w-3.5 h-3.5" />
              <span>{studyStreak.current} Day Streak</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono tabular-nums">
              Best: {studyStreak.best}d
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (studyStreak.completedTodayMins / (profile.dailyStudyTargetHours * 60)) * 100
                )}%`,
              }}
            />
          </div>

          <p className="text-[10px] text-slate-400 mt-2 text-center">
            {studyStreak.completedTodayMins}m / {profile.dailyStudyTargetHours * 60}m completed today
          </p>
        </div>
      </aside>
    </>
  );
};
