import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Filter,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { FeedbackReport, JobRole } from '../types/interview';

interface HistoryViewProps {
  history: FeedbackReport[];
  onSelectReport: (report: FeedbackReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onStartNew: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  onStartNew,
}) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');

  const filteredHistory = history.filter((item) => {
    if (roleFilter === 'All') return true;
    return item.role === roleFilter;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
            <span>Session Archive</span>
            <span>·</span>
            <span>Local Browser Storage</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Interview History & Scores
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Review past mock interview transcripts, score trends, and areas for improvement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your local interview history?')) {
                  onClearAll();
                }
              }}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs font-medium text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Local Storage Disclaimer Card */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs text-slate-400 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Local Privacy Note: </span>
          Your interview recordings, transcripts, and evaluation reports are stored locally in your current browser session. VoxPrep does not upload your profile or scores to cloud databases. Clearing browser cookies or cache will erase this archive.
        </div>
      </div>

      {/* Filter Tabs */}
      {history.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter by:
          </span>
          {['All', 'Software Developer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'HR'].map(
            (r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  roleFilter === r
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {r}
              </button>
            )
          )}
        </div>
      )}

      {/* Sessions List */}
      <div className="mt-6">
        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-white">No Interview Sessions Found</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
              {roleFilter !== 'All'
                ? `No sessions recorded for ${roleFilter}. Try selecting another filter or start a new mock interview.`
                : 'You have not completed any mock interviews yet. Start your first session to track your progress!'}
            </p>
            <div className="mt-6">
              <button
                onClick={onStartNew}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 shadow-md transition-all"
              >
                <span>Start Mock Interview</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/80"
              >
                <div className="flex items-start gap-4">
                  {/* Score circle */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-purple-500/30 text-purple-400 font-mono font-bold text-base tabular-nums shadow-inner">
                    {item.overallScore}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{item.role}</span>
                      <span className="text-[11px] text-slate-500">·</span>
                      <span className="text-xs text-slate-400">{item.level}</span>
                      {item.isDemo && (
                        <span className="rounded bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-400">
                          Demo
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                      <span>·</span>
                      <span>{Math.round(item.durationSeconds / 60)} min</span>
                      <span>·</span>
                      <span>{item.questionFeedback?.length || 5} questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelectReport(item)}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/30 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/40 transition-colors"
                  >
                    <span>View Report</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteReport(item.id)}
                    title="Delete session"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
