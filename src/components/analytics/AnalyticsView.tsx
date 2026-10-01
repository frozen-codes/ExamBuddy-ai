import React from 'react';
import {
  TrendingUp,
  Clock,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle,
  BarChart2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDaysUntil } from '../../lib/scheduler';

export const AnalyticsView: React.FC = () => {
  const { subjects, profile, studyStreak, timetable } = useApp();

  const totalTargetHours = subjects.reduce((acc, s) => acc + s.targetStudyHours, 0);
  const totalCompletedHours = subjects.reduce((acc, s) => acc + s.completedStudyHours, 0);
  const remainingHours = Math.max(0, totalTargetHours - totalCompletedHours);

  const overallPrep = Math.round(
    subjects.reduce((acc, s) => acc + s.prepPercentage, 0) / (subjects.length || 1)
  );

  const completedTodayHours = (studyStreak.completedTodayMins / 60).toFixed(1);
  const dailyTargetHours = profile.dailyStudyTargetHours;
  const todayRate = Math.min(100, Math.round((studyStreak.completedTodayMins / (dailyTargetHours * 60)) * 100));

  // Mock past 7 days completion history for streak analytics
  const weekDays = [
    { day: 'Mon', completed: 3.5, target: 4.0 },
    { day: 'Tue', completed: 4.2, target: 4.0 },
    { day: 'Wed', completed: 4.0, target: 4.0 },
    { day: 'Thu', completed: 3.8, target: 4.0 },
    { day: 'Fri', completed: 4.5, target: 4.0 },
    { day: 'Sat', completed: 5.0, target: 5.0 },
    { day: 'Today', completed: Number(completedTodayHours), target: dailyTargetHours },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Progress & Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics tracking your study velocity, syllabus completion, and exam readiness.
        </p>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs text-slate-500">Overall Readiness</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">
              {overallPrep}%
            </span>
            <span className="text-xs text-slate-500">across {subjects.length} subjects</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${overallPrep}%` }} />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs text-slate-500">Study Hours Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600 tabular-nums">
              {totalCompletedHours.toFixed(1)}h
            </span>
            <span className="text-xs text-slate-500">of {totalTargetHours}h target</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.round((totalCompletedHours / (totalTargetHours || 1)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs text-slate-500">Remaining Study Deficit</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-600 tabular-nums">
              {remainingHours.toFixed(1)}h
            </span>
            <span className="text-xs text-slate-500">remaining to goal</span>
          </div>
          <p className="text-[11px] text-slate-400">Paced over upcoming study weeks</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs text-slate-500">Consistency Streak</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-orange-600 tabular-nums flex items-center gap-1">
              <Flame className="w-6 h-6 fill-orange-500 text-orange-500" />
              {studyStreak.current} Days
            </span>
            <span className="text-xs text-slate-500">best: {studyStreak.best}d</span>
          </div>
          <p className="text-[11px] text-slate-400">Today completion: {todayRate}%</p>
        </div>
      </div>

      {/* 7-Day Velocity Chart */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">7-Day Study Velocity</h3>
            <p className="text-slate-500 mt-0.5">Actual completed hours vs daily target</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" /> Target
            </span>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-4 pt-6 pb-2 items-end h-44">
          {weekDays.map((w, idx) => {
            const heightPercent = Math.min(100, Math.round((w.completed / 6.0) * 100));
            const targetHeightPercent = Math.min(100, Math.round((w.target / 6.0) * 100));

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end gap-2">
                <span className="text-[10px] font-mono text-slate-700 font-semibold tabular-nums">
                  {w.completed}h
                </span>
                <div className="w-full max-w-[48px] h-32 bg-slate-100 rounded-lg relative flex items-end overflow-hidden">
                  {/* Target line */}
                  <div
                    className="absolute w-full border-t border-dashed border-slate-400 z-10"
                    style={{ bottom: `${targetHeightPercent}%` }}
                    title={`Target: ${w.target}h`}
                  />
                  {/* Completed bar */}
                  <div
                    className="w-full bg-indigo-600 rounded-b-lg transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{w.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-Wise Preparation Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Subject-Wise Preparation Matrix</h3>
          <span className="text-xs text-slate-500 font-mono">{subjects.length} subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-4">Exam Date</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Hours (Done/Target)</th>
                <th className="py-3 px-6 text-right">Readiness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {subjects.map((sub) => {
                const daysLeft = getDaysUntil(sub.examDate);
                const isUrgent = daysLeft <= 10;

                return (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>
                        {sub.name}
                        <span className="text-slate-400 font-mono text-[11px] block font-normal">
                          {sub.code}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono tabular-nums">
                      <span className={isUrgent ? 'text-red-600 font-bold' : 'text-slate-600'}>
                        {daysLeft}d ({sub.examDate})
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="capitalize">{sub.difficulty}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="capitalize">{sub.priority}</span>
                    </td>

                    <td className="py-4 px-4 font-mono tabular-nums">
                      {sub.completedStudyHours}h / {sub.targetStudyHours}h
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${sub.prepPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {sub.prepPercentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
