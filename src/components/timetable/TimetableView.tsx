import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Coffee,
  Sparkles,
  Clock,
  Filter,
  Plus,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAMPM } from '../../lib/scheduler';
import { StudySession } from '../../types';

interface TimetableViewProps {
  onStartSession: (session: StudySession) => void;
  onOpenQuickAI: () => void;
}

export const TimetableView: React.FC<TimetableViewProps> = ({ onStartSession, onOpenQuickAI }) => {
  const {
    timetable,
    selectedDate,
    setSelectedDate,
    updateSessionStatus,
    regenerateTimetable,
    subjects,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'skipped'>('all');

  const filteredSessions = timetable.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.status === statusFilter;
  });

  const totalStudyMinutes = timetable
    .filter((s) => !s.isBreak)
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const completedStudyMinutes = timetable
    .filter((s) => !s.isBreak && s.status === 'completed')
    .reduce((acc, s) => acc + s.durationMinutes, 0);

  const missedCount = timetable.filter((s) => s.status === 'skipped').length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Adaptive Timetable</h1>
          <p className="text-xs text-slate-500 mt-1">
            Realistically spaced study blocks respecting sleep, meals, and cognitive stamina.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => regenerateTimetable()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Regenerate Day</span>
          </button>

          <button
            onClick={onOpenQuickAI}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Adjust</span>
          </button>
        </div>
      </div>

      {/* Adaptive Reorganization Banner if missed sessions exist */}
      {missedCount > 0 && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-amber-900">
              {missedCount} Missed Session{missedCount > 1 ? 's' : ''} Detected
            </span>
            <p className="text-amber-800">
              Adaptive Planner can re-route these topics to evening windows without cutting sleep.
            </p>
          </div>
          <button
            onClick={() => regenerateTimetable()}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold rounded-lg shrink-0 cursor-pointer shadow-2xs"
          >
            Adaptive Reschedule Now
          </button>
        </div>
      )}

      {/* Date & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            Date:
          </span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs text-slate-800 font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          />
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({timetable.length})
          </button>
          <button
            onClick={() => setStatusFilter('scheduled')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'scheduled'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-400">Total Planned Study</span>
          <p className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
            {(totalStudyMinutes / 60).toFixed(1)} hrs
          </p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-400">Completed So Far</span>
          <p className="text-base font-bold font-mono text-emerald-600 mt-0.5 tabular-nums">
            {(completedStudyMinutes / 60).toFixed(1)} hrs
          </p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-400">Recovery Breaks</span>
          <p className="text-base font-bold font-mono text-amber-600 mt-0.5 tabular-nums">
            {timetable.filter((s) => s.isBreak).length} slots
          </p>
        </div>
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <span className="text-slate-400">Remaining Today</span>
          <p className="text-base font-bold font-mono text-indigo-600 mt-0.5 tabular-nums">
            {Math.max(0, (totalStudyMinutes - completedStudyMinutes) / 60).toFixed(1)} hrs
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No sessions match this filter.</p>
            <p className="text-xs text-slate-400">Try switching to 'All' or regenerate the day.</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const isCompleted = session.status === 'completed';
            const isSkipped = session.status === 'skipped';
            const subjectObj = subjects.find((s) => s.id === session.subjectId);

            if (session.isBreak) {
              return (
                <div
                  key={session.id}
                  className="px-6 py-3.5 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 border-l-4 border-l-amber-300"
                >
                  <div className="flex items-center gap-3">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-semibold text-slate-700">{session.subjectName}</span>
                      <span className="text-slate-400 ml-2">({session.durationMinutes} minutes)</span>
                      <p className="text-[11px] text-slate-400">{session.notes}</p>
                    </div>
                  </div>
                  <span className="font-mono font-medium text-slate-600 tabular-nums">
                    {formatTimeAMPM(session.startTime)} – {formatTimeAMPM(session.endTime)}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={session.id}
                className={`px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors border-l-4 ${
                  isCompleted
                    ? 'border-l-emerald-500 bg-slate-50/40 opacity-75'
                    : isSkipped
                    ? 'border-l-red-400 bg-red-50/20'
                    : 'border-l-indigo-600 hover:bg-slate-50/50'
                }`}
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-slate-700 tabular-nums">
                      {formatTimeAMPM(session.startTime)} – {formatTimeAMPM(session.endTime)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-500">{session.durationMinutes} min block</span>
                    {subjectObj && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-600">{subjectObj.difficulty} difficulty</span>
                      </>
                    )}
                    {session.isSpacedRevision && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-amber-700 font-semibold">Spaced Revision</span>
                      </>
                    )}
                  </div>

                  <h3
                    className={`text-base font-bold text-slate-900 ${
                      isCompleted ? 'line-through text-slate-500' : ''
                    }`}
                  >
                    {session.subjectName}
                  </h3>

                  {session.topicTitle && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{session.topicTitle}</span>
                    </div>
                  )}

                  {session.notes && (
                    <p className="text-[11px] text-slate-400 italic">{session.notes}</p>
                  )}
                </div>

                {/* Session Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'scheduled')}
                        title="Revert to scheduled"
                        className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        Undo
                      </button>
                    </div>
                  ) : isSkipped ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span>Missed</span>
                      </span>
                      <button
                        onClick={() => updateSessionStatus(session.id, 'scheduled')}
                        className="text-xs font-medium text-indigo-600 hover:underline cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => onStartSession(session)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start</span>
                      </button>

                      <button
                        onClick={() => updateSessionStatus(session.id, 'completed')}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>

                      <button
                        onClick={() => updateSessionStatus(session.id, 'skipped')}
                        className="px-2.5 py-2 text-xs font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Skip session"
                      >
                        Skip
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
