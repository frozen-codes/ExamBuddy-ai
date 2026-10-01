import React from 'react';
import {
  Sparkles,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Brain,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAMPM, getDaysUntil } from '../../lib/scheduler';
import { StudySession } from '../../types';

interface OverviewDashboardProps {
  onStartSession: (session: StudySession) => void;
  onOpenQuickAI: () => void;
  onNavigate: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onStartSession,
  onOpenQuickAI,
  onNavigate,
}) => {
  const {
    profile,
    subjects,
    timetable,
    analysis,
    studyStreak,
    updateSessionStatus,
    regenerateTimetable,
    aiMessage,
  } = useApp();

  // Calculate overall preparation percentage across all subjects
  const overallPrep = Math.round(
    subjects.reduce((acc, s) => acc + s.prepPercentage, 0) / (subjects.length || 1)
  );

  // Today's study target vs completed
  const targetMins = (profile.dailyStudyTargetHours || 4) * 60;
  const completedMins = studyStreak.completedTodayMins;
  const completionPercentage = Math.min(100, Math.round((completedMins / targetMins) * 100));

  // Sort subjects by nearest exam date
  const sortedExams = [...subjects].sort((a, b) => {
    return getDaysUntil(a.examDate) - getDaysUntil(b.examDate);
  });
  const nextExam = sortedExams[0];
  const daysToNextExam = nextExam ? getDaysUntil(nextExam.examDate) : null;

  // Active / next scheduled study session
  const nextSession = timetable.find((s) => !s.isBreak && s.status === 'scheduled');

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* AI Notification Banner if any */}
      {aiMessage && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            aiMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <p className="font-medium">{aiMessage.text}</p>
          </div>
          <button
            onClick={() => onNavigate('timetable')}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer shrink-0"
          >
            Review Timetable
          </button>
        </div>
      )}

      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{todayFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.course}</span>
            <span aria-hidden="true">·</span>
            <span>{profile.semester}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Adaptive plan active. Your sleep and meal hours are locked; study blocks adapt to exam urgency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => regenerateTimetable()}
            title="Recalculate study slots"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Rebalance Slots</span>
          </button>

          <button
            onClick={onOpenQuickAI}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick AI Command</span>
          </button>
        </div>
      </div>

      {/* Quick Adaptive Presets Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
          <Brain className="w-3.5 h-3.5 text-indigo-500" />
          Adaptive Adjustments:
        </span>
        <button
          onClick={() => regenerateTimetable(2.0)}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
        >
          I only have 2 hours today
        </button>
        <button
          onClick={() => onOpenQuickAI()}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
        >
          Plan my evening
        </button>
        <button
          onClick={() => onOpenQuickAI()}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
        >
          I missed a study session
        </button>
        <button
          onClick={() => onNavigate('analyzer')}
          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors cursor-pointer"
        >
          Audit Free Time
        </button>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Preparation */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Overall Readiness</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {overallPrep}%
            </span>
            <span className="text-xs text-slate-500">syllabus covered</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${overallPrep}%` }}
            />
          </div>
        </div>

        {/* Card 2: Today's Study Progress */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Today's Study Progress</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {(completedMins / 60).toFixed(1)}h
            </span>
            <span className="text-xs text-slate-500">
              of {profile.dailyStudyTargetHours}h target ({completionPercentage}%)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Card 3: Study Streak */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Current Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-600 tabular-nums">
              {studyStreak.current} Days
            </span>
            <span className="text-xs text-slate-500">best: {studyStreak.best}d</span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">Keep momentum for upcoming finals</p>
        </div>

        {/* Card 4: Next Urgent Exam */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Next Urgent Exam</span>
            <Calendar className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 line-clamp-1">
              {nextExam ? nextExam.name : 'No exams'}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600 font-semibold">
              <span className="font-mono tabular-nums">
                {daysToNextExam !== null ? `${daysToNextExam} days remaining` : '—'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500 font-normal">
                {nextExam ? `${nextExam.prepPercentage}% ready` : ''}
              </span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Allocating priority study blocks</p>
        </div>
      </div>

      {/* Main Grid: Today's Focus Session & Schedule Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Active Timetable */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Today's Study Timetable</h2>
              <span className="text-xs text-slate-500 font-mono">
                {timetable.filter((s) => !s.isBreak).length} study sessions planned
              </span>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Day View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Highlight Banner if next session available */}
          {nextSession && (
            <div className="p-5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  <span>Up Next</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    {formatTimeAMPM(nextSession.startTime)} – {formatTimeAMPM(nextSession.endTime)} ({nextSession.durationMinutes} min)
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{nextSession.subjectName}</h3>
                {nextSession.topicTitle && (
                  <p className="text-xs text-slate-600">
                    Topic: <span className="font-medium text-slate-800">{nextSession.topicTitle}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onStartSession(nextSession)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus Session</span>
                </button>
                <button
                  onClick={() => updateSessionStatus(nextSession.id, 'completed')}
                  title="Mark Completed"
                  className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Sessions List */}
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs overflow-hidden">
            {timetable.slice(0, 6).map((session) => {
              const isCompleted = session.status === 'completed';
              const isSkipped = session.status === 'skipped';

              if (session.isBreak) {
                return (
                  <div
                    key={session.id}
                    className="px-5 py-3 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500"
                  >
                    <div className="flex items-center gap-2.5">
                      <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-medium text-slate-700">{session.subjectName}</span>
                      <span className="text-slate-400">({session.durationMinutes}m buffer)</span>
                    </div>
                    <span className="font-mono tabular-nums text-slate-500">
                      {formatTimeAMPM(session.startTime)} – {formatTimeAMPM(session.endTime)}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={session.id}
                  className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isCompleted
                      ? 'bg-slate-50/80 opacity-70'
                      : isSkipped
                      ? 'bg-red-50/30'
                      : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-medium text-slate-500 tabular-nums">
                        {formatTimeAMPM(session.startTime)} – {formatTimeAMPM(session.endTime)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 font-mono">{session.durationMinutes} mins</span>
                      {session.isSpacedRevision && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-amber-700 font-medium">Spaced Revision</span>
                        </>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-semibold text-slate-900 ${
                        isCompleted ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {session.subjectName}
                    </h4>
                    {session.topicTitle && (
                      <p className="text-xs text-slate-500">{session.topicTitle}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : isSkipped ? (
                      <span className="text-xs font-medium text-slate-400">Skipped</span>
                    ) : (
                      <>
                        <button
                          onClick={() => onStartSession(session)}
                          className="px-3 py-1.5 text-xs font-medium text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updateSessionStatus(session.id, 'completed')}
                          className="px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => updateSessionStatus(session.id, 'skipped')}
                          className="px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          Skip
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Free Time Audit & Upcoming Exams */}
        <div className="lg:col-span-4 space-y-6">
          {/* Free-Time Capacity Snapshot */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Today's Schedule Audit</h3>
              <button
                onClick={() => onNavigate('analyzer')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Analyze
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Protected Sleep</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {(analysis.sleepMinutes / 60).toFixed(1)} hrs
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Fixed Commitments (Classes/Gym)</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {(analysis.fixedCommitmentMinutes / 60).toFixed(1)} hrs
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Meals & Rest Buffers</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {(analysis.bufferRestMinutes / 60).toFixed(1)} hrs
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-semibold">
                <span className="text-slate-900">Realistic Usable Study</span>
                <span className="font-mono text-indigo-600 tabular-nums">
                  {(analysis.realisticStudyMinutes / 60).toFixed(1)} hrs
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Burnout Status: </span>
                {analysis.burnoutRisk} risk. Your schedule allows sustainable study blocks with adequate cognitive recovery.
              </p>
            </div>
          </div>

          {/* Upcoming Exams Countdown List */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Upcoming Exams</h3>
              <button
                onClick={() => onNavigate('subjects')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {sortedExams.map((sub) => {
                const daysLeft = getDaysUntil(sub.examDate);
                const isUrgent = daysLeft <= 10;

                return (
                  <div
                    key={sub.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 truncate max-w-[180px]">
                        {sub.name}
                      </span>
                      <span
                        className={`font-mono font-semibold tabular-nums ${
                          isUrgent ? 'text-red-600' : 'text-slate-600'
                        }`}
                      >
                        {daysLeft}d left
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Diff: <span className="text-slate-700 font-medium">{sub.difficulty}</span>
                      </span>
                      <span>
                        Prep: <span className="font-mono text-slate-900">{sub.prepPercentage}%</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-indigo-600 h-1 rounded-full"
                        style={{ width: `${sub.prepPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
