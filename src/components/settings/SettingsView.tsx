import React, { useState } from 'react';
import {
  User,
  Clock,
  RotateCcw,
  Check,
  Save,
  Shield,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import avatarImg from '../../assets/images/student_avatar_1790828573850.jpg';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, resetToDemoData, regenerateTimetable } = useApp();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [course, setCourse] = useState(profile.course);
  const [semester, setSemester] = useState(profile.semester);
  const [wakeUpTime, setWakeUpTime] = useState(profile.wakeUpTime);
  const [sleepTime, setSleepTime] = useState(profile.sleepTime);
  const [preferredSessionDuration, setPreferredSessionDuration] = useState(
    profile.preferredSessionDuration || 45
  );
  const [breakDuration, setBreakDuration] = useState(profile.breakDuration || 15);
  const [dailyTarget, setDailyTarget] = useState(profile.dailyStudyTargetHours || 4);
  const [weeklyTarget, setWeeklyTarget] = useState(profile.weeklyStudyTargetHours || 26);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...profile,
      name,
      email,
      course,
      semester,
      wakeUpTime,
      sleepTime,
      preferredSessionDuration: Number(preferredSessionDuration),
      breakDuration: Number(breakDuration),
      dailyStudyTargetHours: Number(dailyTarget),
      weeklyStudyTargetHours: Number(weeklyTarget),
    });
    regenerateTimetable(Number(dailyTarget));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Profile & Scheduling Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          ExamBuddy uses these constraints to generate realistic, sustainable study sessions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={avatarImg}
              alt="Student Avatar"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500">{profile.course} · {profile.semester}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree / Course</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Semester / Year</label>
              <input
                type="text"
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Pacing & Target Preferences */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900">Study Pacing & Fatigue Buffers</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Study Session Duration
              </label>
              <select
                value={preferredSessionDuration}
                onChange={(e) => setPreferredSessionDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={30}>30 minutes (Pomodoro short)</option>
                <option value={45}>45 minutes (Optimal concentration)</option>
                <option value={60}>60 minutes (Standard deep focus)</option>
                <option value={90}>90 minutes (Ultradian rhythm block)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Restorative Break Duration
              </label>
              <select
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes (Recommended)</option>
                <option value={20}>20 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Daily Study Target (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Weekly Study Target (Hours)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="60"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Recalculate Planner</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
