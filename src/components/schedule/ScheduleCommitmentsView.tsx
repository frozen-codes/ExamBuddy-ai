import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sun,
  Moon,
  CalendarCheck2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAMPM } from '../../lib/scheduler';
import { FixedCommitment, CommitmentCategory } from '../../types';

export const ScheduleCommitmentsView: React.FC = () => {
  const { profile, updateProfile, commitments, addCommitment, updateCommitment, deleteCommitment } =
    useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCommitment, setEditingCommitment] = useState<FixedCommitment | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CommitmentCategory>('classes');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 2, 3, 4, 5]);

  const openAddModal = () => {
    setEditingCommitment(null);
    setTitle('');
    setCategory('classes');
    setStartTime('09:00');
    setEndTime('13:00');
    setDaysOfWeek([1, 2, 3, 4, 5]);
    setIsModalOpen(true);
  };

  const openEditModal = (c: FixedCommitment) => {
    setEditingCommitment(c);
    setTitle(c.title);
    setCategory(c.category);
    setStartTime(c.startTime);
    setEndTime(c.endTime);
    setDaysOfWeek(c.daysOfWeek);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingCommitment) {
      updateCommitment({
        ...editingCommitment,
        title,
        category,
        startTime,
        endTime,
        daysOfWeek,
      });
    } else {
      addCommitment({
        title,
        category,
        startTime,
        endTime,
        daysOfWeek,
      });
    }
    setIsModalOpen(false);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (dayIndex: number) => {
    if (daysOfWeek.includes(dayIndex)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter((d) => d !== dayIndex));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, dayIndex].sort());
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fixed Commitments</h1>
          <p className="text-xs text-slate-500 mt-1">
            Specify your fixed routines (classes, coaching, gym, meals, sleep). ExamBuddy protects these hours.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Commitment</span>
        </button>
      </div>

      {/* Sleeping & Waking Boundaries */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Circadian Boundaries (Protected Sleep)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Wake-Up Time</span>
                <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {formatTimeAMPM(profile.wakeUpTime)}
                </p>
              </div>
            </div>
            <input
              type="time"
              value={profile.wakeUpTime}
              onChange={(e) => updateProfile({ ...profile, wakeUpTime: e.target.value })}
              className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500">Sleep Time</span>
                <p className="text-base font-bold font-mono text-slate-900 tabular-nums">
                  {formatTimeAMPM(profile.sleepTime)}
                </p>
              </div>
            </div>
            <input
              type="time"
              value={profile.sleepTime}
              onChange={(e) => updateProfile({ ...profile, sleepTime: e.target.value })}
              className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Commitments List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Weekly Fixed Commitments</h2>
          <span className="text-xs text-slate-500 font-mono">{commitments.length} routines</span>
        </div>

        <div className="divide-y divide-slate-100">
          {commitments.map((com) => (
            <div
              key={com.id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{com.title}</h3>
                  <span className="text-[11px] font-medium text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded">
                    {com.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-medium text-slate-700 tabular-nums">
                    {formatTimeAMPM(com.startTime)} – {formatTimeAMPM(com.endTime)}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-medium text-slate-600">
                    {com.daysOfWeek.map((d) => dayNames[d]).join(', ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(com)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit Commitment"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCommitment(com.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Commitment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Add / Edit Commitment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCommitment ? 'Edit Commitment' : 'Add Fixed Commitment'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Commitment Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. University Lectures, Gym Workout, Commute"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CommitmentCategory)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="classes">College / Classes / Labs</option>
                  <option value="coaching">Coaching / Tutoring</option>
                  <option value="work">Work / Internship</option>
                  <option value="gym">Gym / Sports / Fitness</option>
                  <option value="travel">Travel / Commute</option>
                  <option value="meals">Meals (Breakfast/Lunch/Dinner)</option>
                  <option value="personal">Personal / Family Time</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Active Days of Week
                </label>
                <div className="flex items-center gap-1.5">
                  {dayNames.map((name, i) => {
                    const isSelected = daysOfWeek.includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleDay(i)}
                        className={`flex-1 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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
                  {editingCommitment ? 'Save Changes' : 'Add Commitment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
