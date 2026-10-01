import React, { useState } from 'react';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Brain,
  Coffee,
  Sun,
  Moon,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAMPM } from '../../lib/scheduler';

export const FreeTimeAnalyzerView: React.FC = () => {
  const { profile, commitments, subjects, analysis } = useApp();
  const [isAuditingAI, setIsAuditingAI] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);

  const handleDeepAIAudit = async () => {
    setIsAuditingAI(true);
    try {
      const res = await fetch('/api/ai/analyze-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          commitments,
          subjects,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiReport(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditingAI(false);
    }
  };

  const sleepHours = (analysis.sleepMinutes / 60).toFixed(1);
  const fixedHours = (analysis.fixedCommitmentMinutes / 60).toFixed(1);
  const bufferHours = (analysis.bufferRestMinutes / 60).toFixed(1);
  const studyHours = (analysis.realisticStudyMinutes / 60).toFixed(1);
  const grossFreeHours = (analysis.grossFreeMinutes / 60).toFixed(1);

  // Weekly projections
  const weeklyRealisticStudyHours = (analysis.realisticStudyMinutes / 60 * 7).toFixed(1);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Free-Time Analyzer</h1>
          <p className="text-xs text-slate-500 mt-1">
            Detects genuine, sustainable study windows by respecting sleep, transit, meals, and cognitive buffers.
          </p>
        </div>

        <button
          onClick={handleDeepAIAudit}
          disabled={isAuditingAI}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {isAuditingAI ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Cognitive Load...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deep Gemini Schedule Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Conflicts Alert if any */}
      {analysis.conflicts.length > 0 && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/70 text-xs text-red-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Commitment Overlaps Detected</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-red-700">
            {analysis.conflicts.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 24-Hour Daylight Allocation Strip */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-900">24-Hour Daily Allocation Breakdown</span>
          <span className="text-slate-500 font-mono">1,440 minutes total</span>
        </div>

        {/* Visual segmented bar */}
        <div className="w-full h-8 bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
          {/* Sleep */}
          <div
            style={{ width: `${(analysis.sleepMinutes / 1440) * 100}%` }}
            className="bg-slate-700 text-white flex items-center justify-center text-[10px] font-semibold tracking-wider uppercase"
            title={`Sleep: ${sleepHours}h`}
          >
            Sleep ({sleepHours}h)
          </div>

          {/* Fixed Commitments */}
          <div
            style={{ width: `${(analysis.fixedCommitmentMinutes / 1440) * 100}%` }}
            className="bg-indigo-300 text-indigo-950 flex items-center justify-center text-[10px] font-semibold tracking-wider uppercase"
            title={`Fixed: ${fixedHours}h`}
          >
            Fixed ({fixedHours}h)
          </div>

          {/* Buffers & Meals */}
          <div
            style={{ width: `${(analysis.bufferRestMinutes / 1440) * 100}%` }}
            className="bg-amber-200 text-amber-950 flex items-center justify-center text-[10px] font-semibold tracking-wider uppercase"
            title={`Buffers: ${bufferHours}h`}
          >
            Buffer ({bufferHours}h)
          </div>

          {/* Realistic Study */}
          <div
            style={{ width: `${(analysis.realisticStudyMinutes / 1440) * 100}%` }}
            className="bg-emerald-500 text-white flex items-center justify-center text-[10px] font-semibold tracking-wider uppercase"
            title={`Usable Study: ${studyHours}h`}
          >
            Study ({studyHours}h)
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-700 shrink-0" />
            <div>
              <span className="text-slate-500">Sleep Window</span>
              <p className="font-bold text-slate-900 font-mono tabular-nums">{sleepHours} hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-indigo-300 shrink-0" />
            <div>
              <span className="text-slate-500">Fixed Commitments</span>
              <p className="font-bold text-slate-900 font-mono tabular-nums">{fixedHours} hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-200 shrink-0" />
            <div>
              <span className="text-slate-500">Breaks & Meals</span>
              <p className="font-bold text-slate-900 font-mono tabular-nums">{bufferHours} hrs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <div>
              <span className="text-slate-500">Realistic Study</span>
              <p className="font-bold text-emerald-600 font-mono tabular-nums">{studyHours} hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics: Today vs Week vs Fatigue Risk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <span className="text-xs text-slate-500 font-medium">Available Free Time Today</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
              {studyHours}h
            </span>
            <span className="text-xs text-slate-500">realistic usable time</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Gross free time: {grossFreeHours}h (adjusted for 15m mental recovery buffers)
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <span className="text-xs text-slate-500 font-medium">Weekly Study Capacity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">
              ~{weeklyRealisticStudyHours}h
            </span>
            <span className="text-xs text-slate-500">
              target: {profile.weeklyStudyTargetHours}h
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Adequate capacity across weekdays & weekends.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <span className="text-xs text-slate-500 font-medium">Burnout & Fatigue Risk</span>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold font-mono ${
                analysis.burnoutRisk === 'Low'
                  ? 'text-emerald-600'
                  : analysis.burnoutRisk === 'Moderate'
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              {analysis.burnoutRisk} Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {analysis.burnoutRisk === 'Low'
              ? 'Waking hours allow ample transition buffers before bedtime.'
              : 'Workload is tight. Reduce non-essential commitments.'}
          </p>
        </div>
      </div>

      {/* Identified Free Time Windows List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Identified Daily Study Windows</h2>
          <span className="text-xs text-slate-500 font-mono">
            {analysis.freeWindows.length} slots detected
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {analysis.freeWindows.map((win, idx) => (
            <div
              key={idx}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 tabular-nums">
                    {formatTimeAMPM(win.startTime)} – {formatTimeAMPM(win.endTime)}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono text-slate-600">{win.durationMinutes} minutes</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span
                    className={`font-semibold ${
                      win.energyLevel === 'High'
                        ? 'text-emerald-600'
                        : win.energyLevel === 'Medium'
                        ? 'text-indigo-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {win.energyLevel} Energy
                  </span>
                </div>
                <p className="text-slate-500">{win.reason}</p>
              </div>

              <div>
                {win.isUsableStudy ? (
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    Prime Study Slot
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                    Buffer / Quick Revision
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep AI Schedule Audit Results if available */}
      {aiReport && (
        <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gemini AI Cognitive Audit & Recommendations</span>
          </div>

          <p className="text-xs text-indigo-900 leading-relaxed">
            {aiReport.burnoutAssessment || 'Your schedule balances productivity with restorative recovery.'}
          </p>

          {aiReport.insights && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-indigo-950">Key Insights:</span>
              <ul className="list-disc pl-5 text-xs text-indigo-900 space-y-1">
                {aiReport.insights.map((ins: string, i: number) => (
                  <li key={i}>{ins}</li>
                ))}
              </ul>
            </div>
          )}

          {aiReport.recommendations && (
            <div className="space-y-1.5 pt-2 border-t border-indigo-200/60">
              <span className="text-xs font-semibold text-indigo-950">Actionable Advice:</span>
              <ul className="list-disc pl-5 text-xs text-indigo-900 space-y-1">
                {aiReport.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
