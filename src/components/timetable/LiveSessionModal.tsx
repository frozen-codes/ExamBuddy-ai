import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { StudySession } from '../../types';
import { useApp } from '../../context/AppContext';

interface LiveSessionModalProps {
  session: StudySession;
  onClose: () => void;
}

export const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ session, onClose }) => {
  const { updateSessionStatus } = useApp();
  const initialSeconds = session.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((initialSeconds - secondsRemaining) / initialSeconds) * 100;

  const handleComplete = () => {
    updateSessionStatus(session.id, 'completed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {session.isBreak ? 'Recovery Break' : 'Active Study Session'}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{session.subjectName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Focus Timer Body */}
        <div className="px-6 py-8 flex flex-col items-center justify-center bg-radial from-indigo-50/50 via-white to-white">
          {session.topicTitle && (
            <p className="text-xs text-slate-500 font-medium mb-5 text-center max-w-sm px-2">
              Topic: <span className="text-slate-800 font-semibold">{session.topicTitle}</span>
            </p>
          )}

          {/* Circular / Large Timer Display */}
          <div className="relative flex items-center justify-center w-52 h-52 my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-100"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-indigo-600 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-mono font-bold tracking-tight text-slate-900 tabular-nums">
                {formatTimer(secondsRemaining)}
              </span>
              <span className="text-[11px] font-medium text-slate-400 mt-1">
                {isActive ? 'In Progress' : secondsRemaining === 0 ? 'Completed' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setIsActive(!isActive)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-medium text-sm shadow-sm transition-all cursor-pointer"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Resume
                </>
              )}
            </button>

            <button
              onClick={() => {
                setSecondsRemaining(initialSeconds);
                setIsActive(false);
              }}
              title="Reset Timer"
              className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              title={isMuted ? 'Focus Sound Off' : 'Focus Ambient Sound Active'}
              className={`p-2.5 border rounded-xl transition-colors cursor-pointer ${
                !isMuted
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'text-slate-400 hover:text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Study Strategy Tip */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-slate-800">High-Yield Protocol:</span> Study in uninterrupted blocks. Write summary formulas or active recall flash notes at the end of each session.
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <button
            onClick={() => {
              updateSessionStatus(session.id, 'skipped');
              onClose();
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors cursor-pointer"
          >
            Skip Session
          </button>

          <button
            onClick={handleComplete}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Session Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
