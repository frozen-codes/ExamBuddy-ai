import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getDaysUntil } from '../../lib/scheduler';
import { Subject, DifficultyLevel, PriorityLevel } from '../../types';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, regenerateTimetable } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [examDate, setExamDate] = useState('2026-10-15');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [prepPercentage, setPrepPercentage] = useState(40);
  const [targetStudyHours, setTargetStudyHours] = useState(25);
  const [color, setColor] = useState('#3b82f6');

  const openAddModal = () => {
    setEditingSubject(null);
    setName('');
    setCode('');
    setExamDate('2026-10-20');
    setDifficulty('Medium');
    setPriority('High');
    setPrepPercentage(40);
    setTargetStudyHours(25);
    setColor('#3b82f6');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setExamDate(sub.examDate);
    setDifficulty(sub.difficulty);
    setPriority(sub.priority);
    setPrepPercentage(sub.prepPercentage);
    setTargetStudyHours(sub.targetStudyHours);
    setColor(sub.color);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject({
        ...editingSubject,
        name,
        code,
        examDate,
        difficulty,
        priority,
        prepPercentage: Number(prepPercentage),
        targetStudyHours: Number(targetStudyHours),
        color,
      });
    } else {
      addSubject({
        name,
        code: code || 'CS101',
        examDate,
        difficulty,
        priority,
        prepPercentage: Number(prepPercentage),
        targetStudyHours: Number(targetStudyHours),
        completedStudyHours: 0,
        color,
        topics: [
          {
            id: `top-${Date.now()}-1`,
            subjectId: '',
            title: 'Unit 1 Fundamentals & Definitions',
            chapter: 'Unit 1',
            status: 'not_started',
            estimatedHours: 4,
            revisionCount: 0,
          },
        ],
      });
    }
    setIsModalOpen(false);
    regenerateTimetable();
  };

  const colorOptions = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Subjects & Exam Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ExamBuddy assigns daily study blocks based on urgency, difficulty, and preparation gap.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => {
          const daysUntil = getDaysUntil(sub.examDate);
          const isUrgent = daysUntil <= 10;
          const completedTopics = sub.topics.filter((t) => t.status === 'completed').length;

          return (
            <div
              key={sub.id}
              className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Top row */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold tracking-wide">
                      {sub.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{sub.name}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sub)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                      title="Edit Subject"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                      title="Delete Subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Exam Countdown & Difficulty Tags */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      isUrgent ? 'text-red-600 font-bold' : 'text-slate-600'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {daysUntil} days left ({sub.examDate})
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600">
                    Difficulty: <span className="font-semibold text-slate-800">{sub.difficulty}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-600">
                    Priority: <span className="font-semibold text-slate-800">{sub.priority}</span>
                  </span>
                </div>
              </div>

              {/* Progress & Target Stats */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Preparation Status</span>
                  <span className="font-bold text-slate-900 font-mono tabular-nums">
                    {sub.prepPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${sub.prepPercentage}%`,
                      backgroundColor: sub.color || '#4f46e5',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Study Hours: <span className="font-mono text-slate-800 font-semibold">{sub.completedStudyHours}h / {sub.targetStudyHours}h</span>
                  </span>
                  <span>
                    Topics: <span className="font-mono text-slate-800 font-semibold">{completedTopics}/{sub.topics.length}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Add / Edit Subject */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSubject ? 'Edit Subject' : 'Add Subject & Exam'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS502"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Preparation %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={prepPercentage}
                    onChange={(e) => setPrepPercentage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Study Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={targetStudyHours}
                    onChange={(e) => setTargetStudyHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {editingSubject ? 'Save Changes' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
