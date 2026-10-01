import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  Subject,
  FixedCommitment,
  StudySession,
  ScheduleAnalysis,
} from '../types';
import {
  analyzeFreeTime,
  generateSmartTimetable,
  calculateNextRevisionDate,
} from '../lib/scheduler';

interface AppContextType {
  profile: StudentProfile;
  subjects: Subject[];
  commitments: FixedCommitment[];
  timetable: StudySession[];
  selectedDate: string;
  activeSession: StudySession | null;
  analysis: ScheduleAnalysis;
  studyStreak: {
    current: number;
    best: number;
    completedTodayMins: number;
  };
  isLoadingAI: boolean;
  aiMessage: { type: 'success' | 'info' | 'warning'; text: string } | null;
  updateProfile: (profile: StudentProfile) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addTopic: (subjectId: string, title: string, chapter: string, estimatedHours: number) => void;
  updateTopicStatus: (subjectId: string, topicId: string, status: 'not_started' | 'in_progress' | 'completed') => void;
  addCommitment: (commitment: Omit<FixedCommitment, 'id'>) => void;
  updateCommitment: (commitment: FixedCommitment) => void;
  deleteCommitment: (id: string) => void;
  updateSessionStatus: (sessionId: string, status: StudySession['status']) => void;
  setActiveSession: (session: StudySession | null) => void;
  regenerateTimetable: (maxHoursOverride?: number) => void;
  executeQuickAICommand: (command: string) => Promise<string>;
  resetToDemoData: () => void;
  setSelectedDate: (date: string) => void;
}

const defaultProfile: StudentProfile = {
  id: 'student-1',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  course: 'Computer Science & Engineering',
  semester: 'Semester 5',
  wakeUpTime: '07:00',
  sleepTime: '23:30',
  preferredTimes: ['morning', 'afternoon', 'evening'],
  preferredSessionDuration: 45,
  breakDuration: 15,
  dailyStudyTargetHours: 4.0,
  weeklyStudyTargetHours: 26.0,
  bufferMinutes: 15,
};

const defaultSubjects: Subject[] = [
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS501',
    examDate: '2026-10-09',
    difficulty: 'Hard',
    priority: 'High',
    prepPercentage: 45,
    targetStudyHours: 28,
    completedStudyHours: 12.5,
    color: '#3b82f6', // blue
    topics: [
      {
        id: 'top-db-1',
        subjectId: 'sub-dbms',
        title: 'Relational Algebra & Normalization (3NF & BCNF)',
        chapter: 'Unit 2',
        status: 'completed',
        estimatedHours: 4,
        completedDate: '2026-09-28',
        nextRevisionDate: '2026-10-01',
        revisionCount: 1,
      },
      {
        id: 'top-db-2',
        subjectId: 'sub-dbms',
        title: 'B+ Tree Indexing & Query Execution Plans',
        chapter: 'Unit 3',
        status: 'in_progress',
        estimatedHours: 3.5,
        revisionCount: 0,
      },
      {
        id: 'top-db-3',
        subjectId: 'sub-dbms',
        title: 'ACID Properties & Two-Phase Locking (Concurrency)',
        chapter: 'Unit 4',
        status: 'not_started',
        estimatedHours: 4,
        revisionCount: 0,
      },
      {
        id: 'top-db-4',
        subjectId: 'sub-dbms',
        title: 'Distributed Databases & CAP Theorem',
        chapter: 'Unit 5',
        status: 'not_started',
        estimatedHours: 3,
        revisionCount: 0,
      },
    ],
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS502',
    examDate: '2026-10-15',
    difficulty: 'Hard',
    priority: 'Critical',
    prepPercentage: 35,
    targetStudyHours: 32,
    completedStudyHours: 10,
    color: '#8b5cf6', // purple
    topics: [
      {
        id: 'top-os-1',
        subjectId: 'sub-os',
        title: 'CPU Scheduling Algorithms & Multithreading',
        chapter: 'Unit 1',
        status: 'completed',
        estimatedHours: 4,
        completedDate: '2026-09-29',
        nextRevisionDate: '2026-10-02',
        revisionCount: 1,
      },
      {
        id: 'top-os-2',
        subjectId: 'sub-os',
        title: 'Virtual Memory, Page Replacement & Thrashing',
        chapter: 'Unit 3',
        status: 'in_progress',
        estimatedHours: 5,
        revisionCount: 0,
      },
      {
        id: 'top-os-3',
        subjectId: 'sub-os',
        title: 'Deadlock Avoidance & Banker’s Algorithm',
        chapter: 'Unit 4',
        status: 'not_started',
        estimatedHours: 3.5,
        revisionCount: 0,
      },
    ],
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS503',
    examDate: '2026-10-22',
    difficulty: 'Medium',
    priority: 'Medium',
    prepPercentage: 60,
    targetStudyHours: 20,
    completedStudyHours: 12,
    color: '#06b6d4', // cyan
    topics: [
      {
        id: 'top-cn-1',
        subjectId: 'sub-cn',
        title: 'TCP Flow Control & Congestion Avoidance',
        chapter: 'Unit 3',
        status: 'completed',
        estimatedHours: 3,
        completedDate: '2026-09-27',
        nextRevisionDate: '2026-10-04',
        revisionCount: 2,
      },
      {
        id: 'top-cn-2',
        subjectId: 'sub-cn',
        title: 'Distance Vector & Link State Routing (OSPF)',
        chapter: 'Unit 4',
        status: 'in_progress',
        estimatedHours: 3.5,
        revisionCount: 0,
      },
    ],
  },
  {
    id: 'sub-math',
    name: 'Discrete Mathematics',
    code: 'MA501',
    examDate: '2026-10-28',
    difficulty: 'Hard',
    priority: 'High',
    prepPercentage: 50,
    targetStudyHours: 25,
    completedStudyHours: 12.5,
    color: '#f59e0b', // amber
    topics: [
      {
        id: 'top-math-1',
        subjectId: 'sub-math',
        title: 'Graph Theory & Eulerian / Hamiltonian Paths',
        chapter: 'Unit 2',
        status: 'completed',
        estimatedHours: 4,
        completedDate: '2026-09-25',
        nextRevisionDate: '2026-10-02',
        revisionCount: 1,
      },
      {
        id: 'top-math-2',
        subjectId: 'sub-math',
        title: 'Recurrence Relations & Generating Functions',
        chapter: 'Unit 4',
        status: 'not_started',
        estimatedHours: 4.5,
        revisionCount: 0,
      },
    ],
  },
];

const defaultCommitments: FixedCommitment[] = [
  {
    id: 'com-1',
    title: 'University Classes & Labs',
    category: 'classes',
    startTime: '09:00',
    endTime: '13:30',
    daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  },
  {
    id: 'com-2',
    title: 'Lunch & Transit Buffer',
    category: 'meals',
    startTime: '13:30',
    endTime: '14:45',
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Every day
  },
  {
    id: 'com-3',
    title: 'Gym & Physical Fitness',
    category: 'gym',
    startTime: '18:00',
    endTime: '19:15',
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
  },
  {
    id: 'com-4',
    title: 'Dinner & Family Recharge',
    category: 'meals',
    startTime: '20:00',
    endTime: '21:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('exambuddy_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('exambuddy_subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [commitments, setCommitments] = useState<FixedCommitment[]>(() => {
    const saved = localStorage.getItem('exambuddy_commitments');
    return saved ? JSON.parse(saved) : defaultCommitments;
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [timetable, setTimetable] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('exambuddy_timetable');
    if (saved) return JSON.parse(saved);
    return generateSmartTimetable(defaultProfile, defaultSubjects, defaultCommitments, new Date());
  });

  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<{ type: 'success' | 'info' | 'warning'; text: string } | null>(null);

  const [studyStreak, setStudyStreak] = useState({
    current: 6,
    best: 14,
    completedTodayMins: 90,
  });

  // Schedule analysis calculated on the fly
  const analysis = analyzeFreeTime(profile, commitments, new Date(selectedDate));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('exambuddy_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('exambuddy_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('exambuddy_commitments', JSON.stringify(commitments));
  }, [commitments]);

  useEffect(() => {
    localStorage.setItem('exambuddy_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const updateProfile = (updated: StudentProfile) => {
    setProfile(updated);
  };

  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const subject: Subject = {
      ...newSub,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, subject]);
  };

  const updateSubject = (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const addTopic = (subjectId: string, title: string, chapter: string, estimatedHours: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const newTopic = {
          id: `top-${Date.now()}`,
          subjectId,
          title,
          chapter,
          status: 'not_started' as const,
          estimatedHours,
          revisionCount: 0,
        };
        return {
          ...s,
          topics: [...s.topics, newTopic],
        };
      })
    );
  };

  const updateTopicStatus = (
    subjectId: string,
    topicId: string,
    status: 'not_started' | 'in_progress' | 'completed'
  ) => {
    const today = new Date().toISOString().split('T')[0];

    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const updatedTopics = s.topics.map((t) => {
          if (t.id !== topicId) return t;
          const nextCount = status === 'completed' ? (t.revisionCount || 0) + 1 : t.revisionCount;
          const nextRev =
            status === 'completed'
              ? calculateNextRevisionDate(today, nextCount)
              : t.nextRevisionDate;

          return {
            ...t,
            status,
            completedDate: status === 'completed' ? today : t.completedDate,
            nextRevisionDate: nextRev,
            revisionCount: nextCount,
          };
        });

        // Recalculate preparation percentage
        const completedCount = updatedTopics.filter((t) => t.status === 'completed').length;
        const inProgCount = updatedTopics.filter((t) => t.status === 'in_progress').length;
        const total = updatedTopics.length || 1;
        const prepPercentage = Math.round(((completedCount + inProgCount * 0.4) / total) * 100);

        return {
          ...s,
          prepPercentage,
          topics: updatedTopics,
        };
      })
    );
  };

  const addCommitment = (newCom: Omit<FixedCommitment, 'id'>) => {
    const commitment: FixedCommitment = {
      ...newCom,
      id: `com-${Date.now()}`,
    };
    setCommitments((prev) => [...prev, commitment]);
  };

  const updateCommitment = (updated: FixedCommitment) => {
    setCommitments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCommitment = (id: string) => {
    setCommitments((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSessionStatus = (sessionId: string, status: StudySession['status']) => {
    setTimetable((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return { ...s, status };
      })
    );

    // If marked completed, increment completed minutes and subject study hours
    if (status === 'completed') {
      const targetSession = timetable.find((s) => s.id === sessionId);
      if (targetSession && !targetSession.isBreak) {
        setStudyStreak((prev) => ({
          ...prev,
          completedTodayMins: prev.completedTodayMins + targetSession.durationMinutes,
        }));

        if (targetSession.subjectId) {
          setSubjects((prev) =>
            prev.map((sub) =>
              sub.id === targetSession.subjectId
                ? {
                    ...sub,
                    completedStudyHours: +(
                      sub.completedStudyHours +
                      targetSession.durationMinutes / 60
                    ).toFixed(1),
                  }
                : sub
            )
          );
        }
      }
    }

    // If skipped, automatically show adaptive reschedule banner or suggest reorganization
    if (status === 'skipped') {
      setAiMessage({
        type: 'info',
        text: 'Session skipped. Adaptive study planner ready to reorganize remaining slots without burnout.',
      });
    }
  };

  const regenerateTimetable = (maxHoursOverride?: number) => {
    const newSessions = generateSmartTimetable(
      profile,
      subjects,
      commitments,
      new Date(selectedDate),
      maxHoursOverride
    );
    setTimetable(newSessions);
    setAiMessage({
      type: 'success',
      text: 'Schedule rebalanced based on exam urgency, difficulty, and free time.',
    });
  };

  const executeQuickAICommand = async (command: string): Promise<string> => {
    setIsLoadingAI(true);
    setAiMessage(null);

    try {
      const res = await fetch('/api/ai/quick-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command,
          studentProfile: profile,
          subjects,
          commitments,
          timetable,
          currentDate: selectedDate,
        }),
      });

      const result = await res.json();

      if (result.success && result.data) {
        const { summary, explanation, adjustedSessions, adviceTip } = result.data;

        // If adjusted sessions are provided, merge or replace today's upcoming sessions
        if (Array.isArray(adjustedSessions) && adjustedSessions.length > 0) {
          const formatted: StudySession[] = adjustedSessions.map((adj: any, i: number) => ({
            id: `ai-adj-${Date.now()}-${i}`,
            subjectId: adj.subjectId,
            subjectName: adj.subjectName,
            topicTitle: adj.topic,
            date: selectedDate,
            startTime: adj.startTime,
            endTime: adj.endTime,
            durationMinutes: 45,
            isBreak: adj.isBreak || false,
            status: 'scheduled',
            notes: adj.reason || 'AI Adaptive Adjustment',
          }));
          setTimetable(formatted);
        } else {
          // If algorithmic adjustment requested (e.g. "I only have 2 hours today")
          const lower = command.toLowerCase();
          if (lower.includes('2 hour') || lower.includes('2hr')) {
            regenerateTimetable(2.0);
          } else if (lower.includes('evening') || lower.includes('night')) {
            regenerateTimetable(3.0);
          } else {
            regenerateTimetable();
          }
        }

        const fullMsg = `${summary || 'Schedule updated.'} ${explanation ? `\n\n${explanation}` : ''} ${adviceTip ? `\n💡 Tip: ${adviceTip}` : ''}`;
        setAiMessage({
          type: 'success',
          text: summary || 'AI successfully reorganized your study timetable.',
        });
        return fullMsg;
      } else {
        // Fallback local logic
        regenerateTimetable();
        const fallbackText = `Processed "${command}". Your study blocks have been recalculated to preserve sleep and breaks while prioritizing upcoming exams.`;
        setAiMessage({
          type: 'success',
          text: fallbackText,
        });
        return fallbackText;
      }
    } catch (err: any) {
      console.error(err);
      regenerateTimetable();
      return `Rebalanced your schedule locally: protected meal times and shifted urgent topics forward.`;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const resetToDemoData = () => {
    setProfile(defaultProfile);
    setSubjects(defaultSubjects);
    setCommitments(defaultCommitments);
    const initialTimetable = generateSmartTimetable(defaultProfile, defaultSubjects, defaultCommitments, new Date());
    setTimetable(initialTimetable);
    localStorage.clear();
    setAiMessage({
      type: 'info',
      text: 'Demo dataset restored successfully.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        subjects,
        commitments,
        timetable,
        selectedDate,
        activeSession,
        analysis,
        studyStreak,
        isLoadingAI,
        aiMessage,
        updateProfile,
        addSubject,
        updateSubject,
        deleteSubject,
        addTopic,
        updateTopicStatus,
        addCommitment,
        updateCommitment,
        deleteCommitment,
        updateSessionStatus,
        setActiveSession,
        regenerateTimetable,
        executeQuickAICommand,
        resetToDemoData,
        setSelectedDate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
