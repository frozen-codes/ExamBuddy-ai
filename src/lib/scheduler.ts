import {
  StudentProfile,
  Subject,
  FixedCommitment,
  StudySession,
  ScheduleAnalysis,
  FreeTimeWindow,
  Topic,
} from '../types';

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minutesToTime(totalMins: number): string {
  const norm = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(norm / 60);
  const m = norm % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function formatTimeAMPM(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr ? mStr.padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${m} ${ampm}`;
}

export function getDaysUntil(targetDate: string, fromDate = new Date()): number {
  const [year, month, day] = targetDate.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const diffTime = target.getTime() - from.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Analyze daily commitments and extract realistic free time
export function analyzeFreeTime(
  profile: StudentProfile,
  commitments: FixedCommitment[],
  date: Date = new Date()
): ScheduleAnalysis {
  const dayOfWeek = date.getDay(); // 0-6

  const wakeMins = timeToMinutes(profile.wakeUpTime || '07:00');
  const sleepMins = timeToMinutes(profile.sleepTime || '23:30');

  // Calculate sleep duration (handles midnight crossing)
  let sleepDuration = 0;
  if (sleepMins >= wakeMins) {
    sleepDuration = 1440 - (sleepMins - wakeMins);
  } else {
    sleepDuration = wakeMins - sleepMins;
  }

  // Filter commitments active for this day
  const todaysCommitments = commitments.filter((c) =>
    c.daysOfWeek.includes(dayOfWeek)
  );

  // Check for overlapping commitment conflicts
  const conflicts: string[] = [];
  for (let i = 0; i < todaysCommitments.length; i++) {
    for (let j = i + 1; j < todaysCommitments.length; j++) {
      const c1 = todaysCommitments[i];
      const c2 = todaysCommitments[j];
      const s1 = timeToMinutes(c1.startTime);
      const e1 = timeToMinutes(c1.endTime);
      const s2 = timeToMinutes(c2.startTime);
      const e2 = timeToMinutes(c2.endTime);

      if (Math.max(s1, s2) < Math.min(e1, e2)) {
        conflicts.push(`Overlap between "${c1.title}" and "${c2.title}"`);
      }
    }
  }

  // Collect busy intervals between wake up and sleep
  const intervals: { start: number; end: number; category: string }[] = [];

  for (const c of todaysCommitments) {
    const s = timeToMinutes(c.startTime);
    const e = timeToMinutes(c.endTime);
    if (e > s) {
      intervals.push({ start: s, end: e, category: c.category });
    }
  }

  // Sort intervals by start time
  intervals.sort((a, b) => a.start - b.start);

  // Merge overlapping busy intervals
  const mergedBusy: { start: number; end: number; category: string }[] = [];
  for (const inv of intervals) {
    if (mergedBusy.length === 0) {
      mergedBusy.push({ ...inv });
    } else {
      const prev = mergedBusy[mergedBusy.length - 1];
      if (inv.start <= prev.end) {
        prev.end = Math.max(prev.end, inv.end);
      } else {
        mergedBusy.push({ ...inv });
      }
    }
  }

  // Calculate free gaps during waking hours
  const freeWindows: FreeTimeWindow[] = [];
  let currentPointer = wakeMins;

  for (const busy of mergedBusy) {
    if (busy.start > currentPointer && busy.start <= sleepMins) {
      const gapMins = Math.min(busy.start, sleepMins) - currentPointer;
      if (gapMins >= 15) {
        const isUsable = gapMins >= (profile.preferredSessionDuration || 45);
        freeWindows.push({
          startTime: minutesToTime(currentPointer),
          endTime: minutesToTime(Math.min(busy.start, sleepMins)),
          durationMinutes: gapMins,
          isUsableStudy: isUsable,
          reason: isUsable
            ? 'Prime focus slot'
            : 'Short gap (best for revision/break)',
          energyLevel:
            currentPointer >= timeToMinutes('09:00') && currentPointer < timeToMinutes('13:00')
              ? 'High'
              : currentPointer >= timeToMinutes('16:00') && currentPointer < timeToMinutes('20:00')
              ? 'High'
              : 'Medium',
        });
      }
    }
    currentPointer = Math.max(currentPointer, busy.end);
  }

  if (currentPointer < sleepMins) {
    const gapMins = sleepMins - currentPointer;
    if (gapMins >= 15) {
      const isUsable = gapMins >= (profile.preferredSessionDuration || 45);
      freeWindows.push({
        startTime: minutesToTime(currentPointer),
        endTime: minutesToTime(sleepMins),
        durationMinutes: gapMins,
        isUsableStudy: isUsable,
        reason: isUsable ? 'Evening focus block' : 'Wind-down buffer',
        energyLevel: currentPointer >= timeToMinutes('21:30') ? 'Low' : 'Medium',
      });
    }
  }

  const fixedCommitmentMinutes = todaysCommitments.reduce((acc, c) => {
    return acc + Math.max(0, timeToMinutes(c.endTime) - timeToMinutes(c.startTime));
  }, 0);

  const grossFreeMinutes = freeWindows.reduce((acc, w) => acc + w.durationMinutes, 0);

  // Realistic study minutes: only count usable windows, deduct 15-min buffers for fatigue management
  let realisticStudyMinutes = 0;
  let bufferRestMinutes = 0;

  for (const w of freeWindows) {
    if (w.isUsableStudy) {
      // For every 60 mins, protect 15 mins of mental break
      const studyPortion = Math.floor(w.durationMinutes * 0.75);
      realisticStudyMinutes += studyPortion;
      bufferRestMinutes += w.durationMinutes - studyPortion;
    } else {
      bufferRestMinutes += w.durationMinutes;
    }
  }

  // Assess burnout risk
  let burnoutRisk: 'Low' | 'Moderate' | 'High' = 'Low';
  const targetStudyMins = (profile.dailyStudyTargetHours || 4) * 60;

  if (realisticStudyMinutes < targetStudyMins * 0.6) {
    burnoutRisk = 'High'; // schedule is overcommitted
  } else if (realisticStudyMinutes < targetStudyMins) {
    burnoutRisk = 'Moderate';
  }

  return {
    totalDayMinutes: 1440,
    sleepMinutes: sleepDuration,
    fixedCommitmentMinutes,
    mealsAndPersonalMinutes: Math.round(1440 - sleepDuration - fixedCommitmentMinutes - grossFreeMinutes),
    grossFreeMinutes,
    realisticStudyMinutes,
    bufferRestMinutes,
    freeWindows,
    burnoutRisk,
    conflicts,
  };
}

// Calculate intelligent allocation score for subjects
export function scoreSubjectsForStudy(subjects: Subject[], date: Date = new Date()): (Subject & { score: number; nextTopic?: Topic; isRevision?: boolean })[] {
  const todayStr = date.toISOString().split('T')[0];

  return subjects.map((sub) => {
    const daysUntilExam = Math.max(0, getDaysUntil(sub.examDate, date));

    // Urgency factor: increases dramatically as exam nears
    let urgencyFactor = 1.0;
    if (daysUntilExam <= 2) urgencyFactor = 3.5;
    else if (daysUntilExam <= 7) urgencyFactor = 2.5;
    else if (daysUntilExam <= 14) urgencyFactor = 1.8;
    else if (daysUntilExam <= 30) urgencyFactor = 1.2;
    else urgencyFactor = 0.9;

    // Difficulty factor
    const diffMap = { Easy: 1.0, Medium: 1.4, Hard: 2.0 };
    const diffFactor = diffMap[sub.difficulty] || 1.2;

    // Priority factor
    const prioMap = { Low: 0.9, Medium: 1.2, High: 1.6, Critical: 2.2 };
    const prioFactor = prioMap[sub.priority] || 1.2;

    // Remaining syllabus factor (lower prep percentage = higher study need)
    const prepFactor = Math.max(0.2, (100 - sub.prepPercentage) / 100);

    // Check if any topic is due for spaced revision
    const revisionTopic = sub.topics.find(
      (t) => t.status === 'completed' && t.nextRevisionDate && t.nextRevisionDate <= todayStr
    );

    // Next topic to study (prefer in-progress, then not started)
    const nextTopic =
      revisionTopic ||
      sub.topics.find((t) => t.status === 'in_progress') ||
      sub.topics.find((t) => t.status === 'not_started');

    let baseScore = urgencyFactor * diffFactor * prioFactor * (prepFactor * 1.5);
    if (revisionTopic) {
      baseScore += 2.0; // Boost revision priority
    }

    return {
      ...sub,
      score: baseScore,
      nextTopic,
      isRevision: !!revisionTopic,
    };
  }).sort((a, b) => b.score - a.score);
}

// Generate an adaptive daily timetable with realistic pacing
export function generateSmartTimetable(
  profile: StudentProfile,
  subjects: Subject[],
  commitments: FixedCommitment[],
  date: Date = new Date(),
  overrideMaxStudyHours?: number
): StudySession[] {
  const analysis = analyzeFreeTime(profile, commitments, date);
  const scoredSubjects = scoreSubjectsForStudy(subjects, date);
  const dateStr = date.toISOString().split('T')[0];

  const sessions: StudySession[] = [];
  const sessionDur = profile.preferredSessionDuration || 45;
  const breakDur = profile.breakDuration || 15;

  let totalAllocatedMins = 0;
  const maxStudyMins = overrideMaxStudyHours
    ? overrideMaxStudyHours * 60
    : (profile.dailyStudyTargetHours || 4) * 60;

  let subjectIdx = 0;

  for (const window of analysis.freeWindows) {
    if (!window.isUsableStudy) continue;

    let windowCurrent = timeToMinutes(window.startTime);
    const windowEnd = timeToMinutes(window.endTime);

    while (windowCurrent + sessionDur <= windowEnd && totalAllocatedMins < maxStudyMins) {
      const activeSubject = scoredSubjects[subjectIdx % scoredSubjects.length];

      const startStr = minutesToTime(windowCurrent);
      const endStr = minutesToTime(windowCurrent + sessionDur);

      sessions.push({
        id: `sess-${dateStr}-${windowCurrent}-${subjectIdx}`,
        subjectId: activeSubject.id,
        subjectName: activeSubject.name,
        topicId: activeSubject.nextTopic?.id,
        topicTitle: activeSubject.nextTopic
          ? activeSubject.isRevision
            ? `[Spaced Revision] ${activeSubject.nextTopic.chapter}: ${activeSubject.nextTopic.title}`
            : `${activeSubject.nextTopic.chapter}: ${activeSubject.nextTopic.title}`
          : 'High-Yield Core Review',
        date: dateStr,
        startTime: startStr,
        endTime: endStr,
        durationMinutes: sessionDur,
        isBreak: false,
        status: 'scheduled',
        isSpacedRevision: activeSubject.isRevision,
        notes: `Focus on problem sets & summaries. Weight: ${activeSubject.difficulty} difficulty.`,
      });

      windowCurrent += sessionDur;
      totalAllocatedMins += sessionDur;

      // Add restorative break if there's enough time in this window
      if (windowCurrent + breakDur <= windowEnd && totalAllocatedMins < maxStudyMins) {
        sessions.push({
          id: `break-${dateStr}-${windowCurrent}`,
          subjectName: 'Restorative Break',
          date: dateStr,
          startTime: minutesToTime(windowCurrent),
          endTime: minutesToTime(windowCurrent + breakDur),
          durationMinutes: breakDur,
          isBreak: true,
          breakType: 'restorative',
          status: 'scheduled',
          notes: 'Hydrate, step away from screens, stretch.',
        });
        windowCurrent += breakDur;
      }

      subjectIdx++;
    }
  }

  return sessions;
}

// Spaced repetition scheduler helper
export function calculateNextRevisionDate(completedDate: string, currentCount: number): string {
  const date = new Date(completedDate);
  // Intervals: 1 day, 3 days, 7 days, 14 days, 30 days
  const intervals = [1, 3, 7, 14, 30];
  const daysToAdd = intervals[Math.min(currentCount, intervals.length - 1)];
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}
