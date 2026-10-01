import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { TimetableView } from './components/timetable/TimetableView';
import { FreeTimeAnalyzerView } from './components/analyzer/FreeTimeAnalyzerView';
import { ScheduleCommitmentsView } from './components/schedule/ScheduleCommitmentsView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { LiveSessionModal } from './components/timetable/LiveSessionModal';
import { QuickAIModal } from './components/ai/QuickAIModal';
import { StudySession } from './types';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);
  const [isQuickAIOpen, setIsQuickAIOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);

  // If on landing page, display standalone landing experience
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentTab('dashboard')}
        onExploreDemo={() => setCurrentTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenQuickAI={() => setIsQuickAIOpen(true)}
      />

      {/* Mobile top bar toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <button
          onClick={() => setIsOpenMobileSidebar(true)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5 text-slate-600" />
          <span>Menu</span>
        </button>

        <span className="text-xs font-bold text-slate-800 capitalize">
          {currentTab.replace('-', ' ')}
        </span>
      </div>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isOpenMobile={isOpenMobileSidebar}
          setIsOpenMobile={setIsOpenMobileSidebar}
        />

        {/* Primary Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <OverviewDashboard
              onStartSession={(session) => setActiveSession(session)}
              onOpenQuickAI={() => setIsQuickAIOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'timetable' && (
            <TimetableView
              onStartSession={(session) => setActiveSession(session)}
              onOpenQuickAI={() => setIsQuickAIOpen(true)}
            />
          )}

          {currentTab === 'analyzer' && <FreeTimeAnalyzerView />}

          {currentTab === 'schedule' && <ScheduleCommitmentsView />}

          {currentTab === 'subjects' && <SubjectsView />}

          {currentTab === 'syllabus' && <SyllabusView />}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Focus Timer Modal */}
      {activeSession && (
        <LiveSessionModal
          session={activeSession}
          onClose={() => setActiveSession(null)}
        />
      )}

      {/* Quick AI Planner Modal */}
      <QuickAIModal
        isOpen={isQuickAIOpen}
        onClose={() => setIsQuickAIOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
