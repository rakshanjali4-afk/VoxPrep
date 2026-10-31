import React, { useState } from 'react';
import { Target, Sparkles, ArrowRight, CheckCircle2, AlertCircle, RotateCcw, Brain, Check } from 'lucide-react';
import { FeedbackReport, JobRole } from '../types/interview';
import { StudentProfile } from '../types/profile';

interface PracticeWeakAreasViewProps {
  profile: StudentProfile;
  recentHistory: FeedbackReport[];
  onStartInterview: (role: JobRole, type: 'Technical' | 'HR' | 'Mixed') => void;
  onBackToDashboard: () => void;
}

export const PracticeWeakAreasView: React.FC<PracticeWeakAreasViewProps> = ({
  profile,
  recentHistory,
  onStartInterview,
  onBackToDashboard,
}) => {
  const latestReport = recentHistory[0];

  // Extract weak areas or topics
  const weakTopics = latestReport
    ? latestReport.areasForImprovement
    : [
        'Incorporate specific production metrics (p99 latencies, error rates)',
        'Clarify non-functional constraints before solution architecture',
        'Elaborate on edge case handling and failure isolation',
      ];

  const lowestSkills = latestReport
    ? [
        { name: 'Technical Depth', score: latestReport.technicalScore },
        { name: 'Problem Solving', score: latestReport.problemSolvingScore },
        { name: 'Communication Clarity', score: latestReport.clarityScore },
      ].sort((a, b) => a.score - b.score)
    : [
        { name: 'Technical Depth', score: 70 },
        { name: 'Problem Solving', score: 72 },
        { name: 'Communication Clarity', score: 75 },
      ];

  const [selectedTopic, setSelectedTopic] = useState(weakTopics[0]);
  const [practiceMode, setPracticeMode] = useState<'select' | 'drill'>('select');
  const [drillAnswer, setDrillAnswer] = useState('');
  const [drillFeedback, setDrillFeedback] = useState<{
    score: number;
    strengths: string;
    missing: string;
    idealAnswer: string;
  } | null>(null);
  const [isSubmittingDrill, setIsSubmittingDrill] = useState(false);

  const handleRunDrill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillAnswer.trim()) return;

    setIsSubmittingDrill(true);
    setTimeout(() => {
      setDrillFeedback({
        score: 82,
        strengths: 'Addressed the core concept with clear structured reasoning.',
        missing: 'Could include explicit quantitative metrics or failure recovery scenarios.',
        idealAnswer: 'Define the architectural bottleneck upfront, specify exact trade-offs made, and validate performance with concrete benchmarks.',
      });
      setIsSubmittingDrill(false);
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/60 px-3 py-1 text-xs font-semibold text-purple-300">
              <Target className="h-3.5 w-3.5 text-purple-400" />
              <span>Targeted Remediation Loop</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Practice My Weak Areas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Based on your recent mock interview assessments, we have isolated your top skill gaps and lowest scoring dimensions. Drill down into specific topics or launch a targeted practice session.
            </p>
          </div>

          <button
            onClick={() => onStartInterview(profile.targetRole as JobRole, 'Technical')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3.5 text-xs font-semibold text-white shadow-xl shadow-purple-600/30 hover:shadow-purple-600/40 transition-all self-start sm:self-center whitespace-nowrap"
          >
            <Brain className="h-4 w-4" />
            <span>Launch Full Focused Round</span>
          </button>
        </div>
      </div>

      {/* Top Weak Skills & Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lowestSkills.map((skill, idx) => (
          <div
            key={skill.name}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-400">Gap #{idx + 1}</span>
                <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                  {skill.score}/100
                </span>
              </div>
              <h3 className="mt-2 text-base font-bold text-white">{skill.name}</h3>
              <p className="mt-1 text-xs text-slate-400">
                Identified as a primary area for improvement across recent responses.
              </p>
            </div>

            <button
              onClick={() => {
                setPracticeMode('drill');
                setDrillAnswer('');
                setDrillFeedback(null);
              }}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors text-left flex items-center gap-1"
            >
              <span>Drill This Skill</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Actionable Practice Plan / Weak Topics */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white">Recommended Practice Plan & Weak Topics</h2>

        <div className="space-y-3">
          {weakTopics.map((topic, i) => (
            <div
              key={i}
              className={`flex items-start justify-between rounded-xl border p-4 transition-all ${
                selectedTopic === topic
                  ? 'border-purple-500/50 bg-purple-950/20'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 shrink-0 text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white">{topic}</div>
                  <div className="text-[11px] text-slate-400">
                    Targeted practice question available for immediate review.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTopic(topic);
                  setPracticeMode('drill');
                  setDrillAnswer('');
                  setDrillFeedback(null);
                }}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors whitespace-nowrap"
              >
                Practice This
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Drill Section (if practiceMode === 'drill') */}
      {practiceMode === 'drill' && (
        <div className="rounded-2xl border border-purple-500/40 bg-slate-900/80 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                Focused Skill Drill
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{selectedTopic}</h3>
            </div>
            <button
              onClick={() => setPracticeMode('select')}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close Drill
            </button>
          </div>

          <form onSubmit={handleRunDrill} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Practice Prompt: How would you address this gap in a real production interview?
              </label>
              <textarea
                value={drillAnswer}
                onChange={(e) => setDrillAnswer(e.target.value)}
                placeholder="Type your structured answer here..."
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingDrill}
                className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
              >
                {isSubmittingDrill ? 'Evaluating...' : 'Evaluate Drill Answer'}
              </button>
            </div>
          </form>

          {drillFeedback && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <Check className="h-4 w-4" />
                  <span>Drill Evaluation Complete</span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                  Score: {drillFeedback.score}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="font-semibold text-emerald-300">Strengths:</div>
                  <div className="text-slate-300">{drillFeedback.strengths}</div>
                </div>
                <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="font-semibold text-amber-300">Missing Elements:</div>
                  <div className="text-slate-300">{drillFeedback.missing}</div>
                </div>
              </div>

              <div className="space-y-1 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
                <div className="font-semibold text-purple-300">Exemplary Model Answer:</div>
                <div className="text-slate-300 italic">{drillFeedback.idealAnswer}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
