import React, { useState } from 'react';
import {
  Code,
  LineChart,
  Layout,
  Server,
  Users,
  Mic,
  Clock,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { ExperienceLevel, InterviewConfig, InterviewType, JobRole } from '../types/interview';

interface InterviewSetupProps {
  onStart: (config: InterviewConfig) => void;
  onCancel: () => void;
  initialRole?: JobRole;
  initialIsDemo?: boolean;
}

const ROLES: Array<{
  id: JobRole;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  focus: string;
}> = [
  {
    id: 'Software Developer',
    title: 'Software Developer',
    icon: Code,
    description: 'Data structures, system design, async patterns, and architecture.',
    focus: 'Algorithms & Architecture',
  },
  {
    id: 'Frontend Developer',
    title: 'Frontend Developer',
    icon: Layout,
    description: 'React, modern CSS, Core Web Vitals, state management, and DOM.',
    focus: 'UI Performance & React',
  },
  {
    id: 'Backend Developer',
    title: 'Backend Developer',
    icon: Server,
    description: 'Distributed systems, database tuning, APIs, and microservices.',
    focus: 'APIs & Scalability',
  },
  {
    id: 'Data Analyst',
    title: 'Data Analyst',
    icon: LineChart,
    description: 'SQL queries, window functions, analytics modeling, and visualization.',
    focus: 'SQL & Insights',
  },
  {
    id: 'HR',
    title: 'HR Specialist',
    icon: Users,
    description: 'Conflict resolution, talent acquisition, culture, and employee advocacy.',
    focus: 'Behavioral & Leadership',
  },
];

export const InterviewSetup: React.FC<InterviewSetupProps> = ({
  onStart,
  onCancel,
  initialRole = 'Software Developer',
  initialIsDemo = false,
}) => {
  const [role, setRole] = useState<JobRole>(initialRole);
  const [level, setLevel] = useState<ExperienceLevel>('Intermediate');
  const [type, setType] = useState<InterviewType>('Technical');
  const [questionCount, setQuestionCount] = useState<5 | 10>(5);
  const [language, setLanguage] = useState<string>('English');
  const [isDemo, setIsDemo] = useState<boolean>(initialIsDemo);
  const [agreedMic, setAgreedMic] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      role,
      level,
      type,
      questionCount,
      language,
      isDemo,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400">
          <span>Step 1 of 2</span>
          <span>·</span>
          <span>Configuration</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Customize Your Interview Session
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Select your target role, seniority level, and format. VoxPrep will formulate tailored questions and intelligent follow-ups.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Job Role Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Target Job Role
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => {
                    setRole(r.id);
                    // Adjust default interview type if HR is chosen
                    if (r.id === 'HR') setType('HR');
                    else if (type === 'HR') setType('Technical');
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/30 text-white shadow-lg shadow-purple-900/20'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {r.focus}
                    </span>
                  </div>
                  <div className="mt-3 font-semibold text-sm text-slate-100">
                    {r.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {r.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Level & Interview Style */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Experience Level */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as ExperienceLevel[]).map(
                (lvl) => {
                  const isSelected = level === lvl;
                  return (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setLevel(lvl)}
                      className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-600 text-white shadow-sm'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {level === 'Beginner' && 'Focus on core fundamentals, language syntax, and basic workflows.'}
              {level === 'Intermediate' && 'Focus on architectural trade-offs, debugging, and real-world execution.'}
              {level === 'Advanced' && 'Focus on high-scale distributed systems, edge cases, and leadership.'}
            </p>
          </div>

          {/* Interview Type */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Interview Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Technical', 'HR', 'Mixed'] as InterviewType[]).map((t) => {
                const isSelected = type === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500">
              {type === 'Technical' && 'In-depth domain questions, algorithms, and technical reasoning.'}
              {type === 'HR' && 'Culture fit, STAR behavioral questions, teamwork, and conflict handling.'}
              {type === 'Mixed' && 'A balanced combination of technical depth and behavioral scenarios.'}
            </p>
          </div>
        </div>

        {/* 3. Duration & Language */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Question Count / Duration */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Interview Length
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQuestionCount(5)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  questionCount === 5
                    ? 'border-purple-500 bg-purple-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Clock className="h-5 w-5 text-purple-400 shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-white">5 Questions</div>
                  <div className="text-[11px] text-slate-400">Quick ~10-15 min sprint</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setQuestionCount(10)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  questionCount === 10
                    ? 'border-purple-500 bg-purple-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Clock className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-xs text-white">10 Questions</div>
                  <div className="text-[11px] text-slate-400">Full ~25-30 min deep dive</div>
                </div>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              Interview Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-medium text-slate-200 focus:border-purple-500 focus:outline-none"
              >
                <option value="English">English (US / Global Standard)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Voice recognition and synthesis are calibrated for standard English speech.
            </p>
          </div>
        </div>

        {/* 4. Execution Mode: AI vs Demo */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Execution Mode</div>
                <div className="text-xs text-slate-400">
                  {isDemo
                    ? 'Demo Mode: Uses curated questions and instant answers. Great for testing without consuming API quota.'
                    : 'AI-Powered Mode: Real-time Gemini 3.8 Flash interviewer with dynamic follow-ups.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsDemo(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  !isDemo
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                AI-Powered
              </button>
              <button
                type="button"
                onClick={() => setIsDemo(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  isDemo
                    ? 'bg-amber-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Demo Mode
              </button>
            </div>
          </div>
        </div>

        {/* Audio Equipment Tips */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/20 p-4 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            <Headphones className="h-4 w-4 text-purple-400" />
            <span>Voice Interview Quick Tips</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
            <div>
              <span className="font-medium text-slate-300">1. Clear Mic:</span> Use headphones or quiet surroundings for the best speech recognition.
            </div>
            <div>
              <span className="font-medium text-slate-300">2. Text Fallback:</span> If your microphone is not connected, you can type your answers directly.
            </div>
            <div>
              <span className="font-medium text-slate-300">3. Smart Follow-Ups:</span> The AI will probe deeper if answers are vague or brief.
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 transition-all hover:shadow-purple-600/40 hover:scale-[1.01]"
          >
            <span>Start Interview Room</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
