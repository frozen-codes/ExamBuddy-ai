import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  CalendarCheck2,
  RefreshCw,
  Zap,
  ShieldCheck,
  BrainCircuit,
  GraduationCap,
} from 'lucide-react';
import heroImage from '../../assets/images/hero_study_planner_1790828558251.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ExamBuddy AI
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            · Adaptive Student Productivity
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#concept" className="hover:text-slate-900 transition-colors">
            Core Concept
          </a>
          <a href="#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
            Adaptive Engine
          </a>
          <a href="#methodology" className="hover:text-slate-900 transition-colors">
            Cognitive Pacing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreDemo}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Live Demo
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Next-Gen Academic Productivity</span>
              <span aria-hidden="true">·</span>
              <span>Built for High-Stakes Exams</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 text-balance leading-tight">
              An adaptive study planner, not just a static timetable.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              ExamBuddy AI audits your real daily routine, automatically spots realistic free-time
              windows, and allocates subjects based on exam urgency, difficulty, and unfinished
              syllabus — without burning you out.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDemo}
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Explore Interactive Demo</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protects sleep & meals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Spaced repetition built-in</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Auto re-adjusts missed slots</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 aspect-16/10">
              <img
                src={heroImage}
                alt="ExamBuddy Study Planner Desk Setup"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <p className="text-xs font-mono text-indigo-300">Exam Urgency Engine</p>
                  <p className="text-sm font-semibold">DBMS & OS Finals in 8 & 14 Days</p>
                  <p className="text-xs text-slate-300">
                    4.0h daily focused slots allocated around university classes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contrast Comparison: Static Timetable vs ExamBuddy */}
      <section id="concept" className="px-6 py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Traditional Timetables Fail University Students
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Static schedules crack the moment a lecture runs late or you miss an evening session.
              ExamBuddy AI adapts dynamically to reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Way */}
            <div className="p-6 rounded-2xl border border-red-200 bg-red-50/30 space-y-4">
              <span className="text-xs font-semibold text-red-700 uppercase tracking-wider">
                The Static Spreadsheet Way
              </span>
              <h3 className="text-lg font-bold text-slate-900">Brittle & Guilt-Inducing</h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Fills every minute back-to-back without travel, dinner, or mental buffers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Miss one session, and the entire weekly plan collapses into guilt.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Treats easy subjects and hard subjects with identical arbitrary hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Zero spaced-repetition logic; forgotten topics are never reviewed.</span>
                </li>
              </ul>
            </div>

            {/* The ExamBuddy Way */}
            <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/30 space-y-4">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                The ExamBuddy AI Way
              </span>
              <h3 className="text-lg font-bold text-slate-900">Resilient & Fatigue-Aware</h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Protects 7.5 hours of sleep, meal windows, and mandatory 15-min recovery pauses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Adaptive Rescheduling shifts missed topics automatically without overworking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Weighs exam urgency, syllabus deficit, and difficulty dynamically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Spaced-repetition queues review sessions at optimal memory retention intervals.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="px-6 py-20 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Engineered For Academic Mastery
          </span>
          <h2 className="text-3xl font-bold text-slate-900">
            Intelligent Features Behind ExamBuddy AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Realistic Free-Time Analyzer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detects true study windows between university lectures, coaching, gym, and commute.
              Prevents scheduling during protected sleep and meal hours.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Adaptive Rescheduling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Missed a study block due to unexpected delays? Click one button or prompt the AI,
              and it seamlessly reorganizes the rest of your week.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Syllabus & Topic Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Break down units into granular topics. As you mark chapters complete, the planner
              automatically re-prioritizes remaining weak spots.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Spaced Repetition Scheduler</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Retain what you study. Automatically queues short 15-minute review sessions at Day 1,
              Day 3, and Day 7 intervals before your exam.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Natural Language Quick AI</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Type or speak instructions like “Plan my evening”, “I only have 2 hours today”, or
              “My exam is in 5 days”. The AI updates your timetable instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3 hover:border-slate-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Exam Urgency Multiplier</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subjects with imminent exam dates and lower preparation receive smart weighting in
              daily study blocks, eliminating last-minute panic.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto px-6 py-12 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-lg font-bold tracking-tight">ExamBuddy AI</span>
            <p className="text-xs text-slate-400 mt-1">
              Realistic, cognitive-fatigue aware study planner for university and high school students.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreDemo}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Demo Workspace
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors cursor-pointer"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
