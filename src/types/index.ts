export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type TopicStatus = 'not_started' | 'in_progress' | 'completed';
export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'skipped' | 'rescheduled';
export type CommitmentCategory =
  | 'classes'
  | 'work'
  | 'coaching'
  | 'gym'
  | 'travel'
  | 'meals'
  | 'personal'
  | 'sleep';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: string;
  wakeUpTime: string; // "07:00"
  sleepTime: string; // "23:30"
  preferredTimes: ('morning' | 'afternoon' | 'evening' | 'night')[];
  preferredSessionDuration: number; // minutes: 30, 45, 60, 90
  breakDuration: number; // minutes: 10, 15, 20
  dailyStudyTargetHours: number; // e.g., 4.5
  weeklyStudyTargetHours: number; // e.g., 28
  bufferMinutes: number; // transition buffer between commitments
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  chapter: string;
  status: TopicStatus;
  estimatedHours: number;
  completedDate?: string;
  nextRevisionDate?: string;
  revisionCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  examDate: string; // "YYYY-MM-DD"
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  prepPercentage: number; // 0 - 100
  targetStudyHours: number;
  completedStudyHours: number;
  color: string;
  topics: Topic[];
}

export interface FixedCommitment {
  id: string;
  title: string;
  category: CommitmentCategory;
  startTime: string; // "09:00"
  endTime: string; // "13:00"
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  isFlexible?: boolean;
  notes?: string;
}

export interface StudySession {
  id: string;
  subjectId?: string;
  subjectName: string;
  topicId?: string;
  topicTitle?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "16:00"
  endTime: string; // "16:45"
  durationMinutes: number;
  isBreak: boolean;
  breakType?: 'restorative' | 'meal' | 'transition';
  status: SessionStatus;
  notes?: string;
  isSpacedRevision?: boolean;
}

export interface FreeTimeWindow {
  startTime: string;
  endTime: string;
  durationMinutes: number;
  isUsableStudy: boolean;
  reason?: string;
  energyLevel: 'High' | 'Medium' | 'Low';
}

export interface ScheduleAnalysis {
  totalDayMinutes: number;
  sleepMinutes: number;
  fixedCommitmentMinutes: number;
  mealsAndPersonalMinutes: number;
  grossFreeMinutes: number;
  realisticStudyMinutes: number;
  bufferRestMinutes: number;
  freeWindows: FreeTimeWindow[];
  burnoutRisk: 'Low' | 'Moderate' | 'High';
  conflicts: string[];
}
