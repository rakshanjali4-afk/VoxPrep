import React from 'react';
import {
  Mic,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
  Award,
  Clock,
  PlayCircle,
  ShieldCheck,
  CheckCircle2,
  Code,
  Layout,
  Server,
  LineChart,
  Users,
  Building2,
  Target,
  FileText,
  User,
  ChevronRight,
  Zap,
  Check,
  Lightbulb,
} from 'lucide-react';
import { FeedbackReport, JobRole } from '../types/interview';
import { StudentProfile } from '../types/profile';
import { CompanyRequirement } from '../data/companyRequirements';

interface DashboardProps {
  profile: StudentProfile;
  companyRequirements: CompanyRequirement[];
  onStartSetup: () => void;
  onStartDemo: () => void;
  onSelectRole: (role: JobRole) => void;
  recentHistory: FeedbackReport[];
  onViewReport: (report: FeedbackReport) => void;
  onNavigate: (view: any) => void;
  onOpenProfile: () => void;
  onOpenResumeModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  companyRequirements,
  onStartSetup,
  onStartDemo,
  onSelectRole,
  recentHistory,
  onViewReport,
  onNavigate,
  onOpenProfile,
  onOpenResumeModal,
}) => {
  const latestReport = recentHistory[0];
  const overallReadiness = latestReport ? latestReport.overallScore : (profile.skills.length > 0 ? 82 : 45);
  const technicalScore = latestReport ? latestReport.technicalScore : 78;
  const clarityScore = latestReport ? latestReport.clarityScore : 85;
  const problemSolvingScore = latestReport ? latestReport.problemSolvingScore : 80;
  const hrScore = latestReport ? latestReport.relevanceScore : 82;

  const studentSkillSet = new Set(profile.skills.map((s) => s.toLowerCase()));
  const topCompanyMatches = companyRequirements
    .map((req) => {
      const required = req.requiredSkills.map((s) => s.toLowerCase());
      const matching = req.requiredSkills.filter((s) => studentSkillSet.has(s.toLowerCase()));
      const matchRatio = required.length > 0 ? matching.length / required.length : 0.4;
      const score = Math.round((matchRatio * 60) + (technicalScore * 0.4));
      return { ...req, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const strengths = latestReport
    ? latestReport.strengths
    : [
        'Clear communication structure and logical progression',
        'Strong grasp of core data structures and algorithms',
        'Professional tone and structured problem framing',
      ];

  const improvements = latestReport
    ? latestReport.areasForImprovement
    : [
        'Incorporate specific quantitative metrics (p99 latencies, error budgets)',
        'Clarify non-functional constraints before solution architecture',
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Welcome Banner (Picture-Free, Professional Gradient & Tagline) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 p-8 sm:p-12 shadow-2xl">
        {/* Glowing CSS background accents */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 text-xs font-semibold text-cyan-300">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Better Skills → Better Interviews → A Brighter Future</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">VoxPrep</span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-indigo-200">
              Your personal AI interview coach.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Practice, improve, and build the skills you need to land your dream job at top-tier companies with real-time speech AI and precision analytics.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <button
              onClick={onStartSetup}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.02] hover:shadow-purple-600/40"
            >
              <Mic className="h-4 w-4" />
              <span>Start Mock Interview</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenResumeModal}
              className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-5 py-3.5 text-sm font-semibold text-indigo-200 hover:bg-indigo-900/40 transition-all shadow-sm"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={() => onNavigate('practice_weak')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <Target className="h-4 w-4 text-purple-400" />
              <span>Practice My Weak Areas</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid: Interview Readiness & Skill Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Card: Interview Readiness & Skill Breakdowns (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Interview Readiness</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your current performance across key skill areas.</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>{overallReadiness >= 75 ? 'Good Progress' : 'Needs Practice'}</span>
            </div>
          </div>

          {/* Circular / Large Score Indicator & Skill Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Large Readiness Score Badge */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono tabular-nums">
                {overallReadiness}%
              </div>
              <div className="text-xs font-semibold text-slate-300">Overall Readiness Score</div>
              <p className="text-[11px] text-slate-400">
                Based on {recentHistory.length} mock interview session{recentHistory.length === 1 ? '' : 's'} & resume profile.
              </p>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="sm:col-span-7 space-y-3.5">
              {[
                { name: 'Technical Knowledge', score: technicalScore, icon: Code, color: 'from-purple-500 to-indigo-500' },
                { name: 'Communication Clarity', score: clarityScore, icon: MessageSquare, color: 'from-indigo-500 to-blue-500' },
                { name: 'Problem Solving', score: problemSolvingScore, icon: Brain, color: 'from-blue-500 to-cyan-500' },
                { name: 'HR & Behavioral', score: hrScore, icon: Users, color: 'from-cyan-500 to-emerald-500' },
              ].map((skill) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-200">
                        <Icon className="h-3.5 w-3.5 text-purple-400" />
                        {skill.name}
                      </span>
                      <span className="font-mono font-bold text-slate-300 tabular-nums">{skill.score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Key Strengths</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {strengths.slice(0, 2).map((s, i) => (
                  <li key={i} className="line-clamp-1">{s}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Target className="h-3.5 w-3.5" />
                <span>Areas to Improve</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                {improvements.slice(0, 2).map((imp, i) => (
                  <li key={i} className="line-clamp-1">{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onNavigate('recommendations')}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View Detailed Assessment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Next Step & Pro Tips (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Your Next Step</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Complete a technical mock interview targeting <strong className="text-white">{profile.targetRole}</strong> to boost your alignment score for <strong className="text-purple-300">{profile.preferredCompanies[0] || 'Google'}</strong>.
            </p>
            <button
              onClick={onStartSetup}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all text-center"
            >
              Launch Practice Round Now
            </button>
          </div>

          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-white">Pro Tips for Freshers</h3>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Quantify impact in your resume projects (e.g., "Reduced latency by 40%").</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (4 Feature Cards as requested) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Platform Modules
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Comprehensive Interview Toolkit
            </h2>
          </div>
          <span className="text-xs text-slate-400">All features fully connected & active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Resume Analysis */}
          <div
            onClick={onOpenResumeModal}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition-all hover:border-purple-500/50 hover:bg-slate-900/80 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Resume Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract skills, projects, and education instantly to get personalized insights and target alignment.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Upload & Analyze</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 2: Company Recommendations */}
          <div
            onClick={() => onNavigate('recommendations')}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                Company Recommendations
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Find suitable companies based on your verified skills, experience level, and career goals.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-semibold">
              <span>View Matches</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 3: Progress Tracking */}
          <div
            onClick={() => onNavigate('history')}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition-all hover:border-cyan-500/50 hover:bg-slate-900/80 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Progress Tracking
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor your score improvement, session duration, and readiness trends over time.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
              <span>View History ({recentHistory.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Card 4: Personalized Practice */}
          <div
            onClick={() => onNavigate('practice_weak')}
            className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm transition-all hover:border-emerald-500/50 hover:bg-slate-900/80 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Personalized Practice
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Focus directly on your weak areas and growth gaps with AI-driven remediation loops.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Practice Weak Areas</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Existing Features Section: "How VoxPrep Accelerates Your Interview Mastery" */}
      <section className="space-y-6 pt-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Platform Architecture
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            How VoxPrep Accelerates Your Interview Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Interactive Voice Interviews', desc: 'Practice speaking aloud with browser speech recognition and spoken prompts.', icon: Mic },
            { title: 'AI-Powered Feedback', desc: 'Receive objective rubrics, score breakdowns, and constructive critiques.', icon: Brain },
            { title: 'Resume-Based Questions', desc: 'Tailor mock interview questions directly to your projects and tech stack.', icon: FileText },
            { title: 'Skill Assessment', desc: 'Track technical depth, communication clarity, and problem-solving metrics.', icon: Award },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-purple-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Role Tracks Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Select Your Specialization
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Role-Specific Interview Tracks
            </h2>
          </div>
          <span className="text-xs text-slate-400">Choose a track to prefill setup</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { role: 'Software Developer' as JobRole, icon: Code, desc: 'Algorithms & System Architecture' },
            { role: 'Frontend Developer' as JobRole, icon: Layout, desc: 'React, Web Vitals & CSS' },
            { role: 'Backend Developer' as JobRole, icon: Server, desc: 'APIs, Concurrency & Databases' },
            { role: 'Data Analyst' as JobRole, icon: LineChart, desc: 'SQL, Modeling & Analytics' },
            { role: 'HR' as JobRole, icon: Users, desc: 'Behavioral, Leadership & Culture' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.role}
                onClick={() => onSelectRole(item.role)}
                className="flex flex-col text-left p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-3 font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                  {item.role}
                </div>
                <div className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Demonstration Banner */}
      <section className="rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-purple-950/30 via-slate-900/40 to-indigo-950/30 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Demo Simulation Available
            </span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Want to test without using API quota?
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Explore our curated interview scenarios with pre-configured questions, follow-up chains, and sample candidate answers across software engineering, analytics, and HR tracks.
          </p>
        </div>

        <button
          onClick={onStartDemo}
          className="rounded-xl border border-purple-500/40 bg-purple-950/40 px-5 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-900/40 transition-colors whitespace-nowrap self-start sm:self-center"
        >
          Launch Demo Interview
        </button>
      </section>
    </div>
  );
};
