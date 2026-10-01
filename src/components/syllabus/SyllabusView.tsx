import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  X,
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TopicStatus } from '../../types';

export const SyllabusView: React.FC = () => {
  const { subjects, addTopic, updateTopicStatus, selectedDate } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  // Form states
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicChapter, setNewTopicChapter] = useState('Unit 1');
  const [estimatedHours, setEstimatedHours] = useState(3);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !activeSubject) return;
    addTopic(activeSubject.id, newTopicTitle, newTopicChapter, estimatedHours);
    setNewTopicTitle('');
    setIsAddTopicModalOpen(false);
  };

  const filteredTopics = activeSubject
    ? activeSubject.topics.filter((t) => {
        if (filterStatus === 'all') return true;
        return t.status === filterStatus;
      })
    : [];

  // Spaced Repetition Queue across all subjects
  const allCompletedTopics = subjects.flatMap((s) =>
    s.topics
      .filter((t) => t.status === 'completed' && t.nextRevisionDate)
      .map((t) => ({ ...t, subjectName: s.name, subjectColor: s.color }))
  );

  const todayStr = selectedDate || new Date().toISOString().split('T')[0];

  const dueForRevision = allCompletedTopics.filter(
    (t) => t.nextRevisionDate && t.nextRevisionDate <= todayStr
  );
  const upcomingRevisions = allCompletedTopics.filter(
    (t) => t.nextRevisionDate && t.nextRevisionDate > todayStr
  );

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Syllabus & Smart Revision
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track chapters and topics. Completed topics automatically enter the spaced repetition cycle.
          </p>
        </div>

        <button
          onClick={() => setIsAddTopicModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Topic / Chapter</span>
        </button>
      </div>

      {/* Spaced Repetition Highlight Box */}
      <div className="p-6 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 rounded-xl border border-amber-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Spaced Repetition Review Queue ({dueForRevision.length} Due Today)
            </h2>
          </div>
          <span className="text-xs text-amber-800 font-medium">Memory Retention Algorithm</span>
        </div>

        {dueForRevision.length === 0 ? (
          <p className="text-xs text-slate-500">
            No revisions due today. As you mark chapters complete, 1-day, 3-day, and 7-day recall sessions will appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueForRevision.map((rev) => (
              <div
                key={rev.id}
                className="p-3 bg-white rounded-lg border border-amber-200/80 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-800 truncate max-w-[160px]">
                    {rev.subjectName}
                  </span>
                  <span className="font-mono text-amber-700 font-bold">Review #{rev.revisionCount}</span>
                </div>
                <p className="text-xs font-medium text-slate-900 line-clamp-1">{rev.title}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Scheduled into today's timetable</span>
                  <span className="text-emerald-600 font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {subjects.map((sub) => {
          const isActive = sub.id === activeSubject?.id;
          const completed = sub.topics.filter((t) => t.status === 'completed').length;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {completed}/{sub.topics.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Topics Control & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">{activeSubject?.name} Syllabus</h3>
          <span className="text-xs text-slate-500 font-mono">
            {activeSubject?.topics.length} total units
          </span>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('not_started')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'not_started'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Not Started
          </button>
          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'in_progress'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Topics Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No topics found under this status.
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isCompleted = topic.status === 'completed';
            const isInProgress = topic.status === 'in_progress';

            return (
              <div
                key={topic.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-indigo-600">{topic.chapter}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono">~{topic.estimatedHours} hrs needed</span>
                    {topic.revisionCount > 0 && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-amber-600 font-medium">
                          Revised {topic.revisionCount}x
                        </span>
                      </>
                    )}
                  </div>
                  <h4
                    className={`text-sm font-semibold text-slate-900 ${
                      isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {topic.title}
                  </h4>
                </div>

                {/* Status selector buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateTopicStatus(activeSubject.id, topic.id, 'not_started')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      topic.status === 'not_started'
                        ? 'bg-slate-200 text-slate-800 font-bold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Not Started
                  </button>
                  <button
                    onClick={() => updateTopicStatus(activeSubject.id, topic.id, 'in_progress')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      isInProgress
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateTopicStatus(activeSubject.id, topic.id, 'completed')}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Add Topic to {activeSubject?.name}
              </h3>
              <button
                onClick={() => setIsAddTopicModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Topic / Sub-chapter Title
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g., Two-Phase Commit Protocol"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Chapter / Unit
                  </label>
                  <input
                    type="text"
                    required
                    value={newTopicChapter}
                    onChange={(e) => setNewTopicChapter(e.target.value)}
                    placeholder="e.g. Unit 3"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Add to Syllabus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
