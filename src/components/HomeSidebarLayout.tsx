import React, { useState } from 'react';
import {
  Home as HomeIcon,
  Mic,
  History,
  FileText,
  Target,
  Award,
  TrendingUp,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Lightbulb,
  Menu,
  X,
  PlayCircle,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { FeedbackReport, JobRole } from '../types/interview';
import { StudentProfile } from '../types/profile';
import { CompanyRequirement } from '../data/companyRequirements';

interface HomeSidebarLayoutProps {
  profile: StudentProfile;
  companyRequirements: CompanyRequirement[];
  recentHistory: FeedbackReport[];
  onNavigate: (view: any) => void;
  onStartSetup: () => void;
  onOpenProfile: () => void;
  onOpenResumeModal: () => void;
}

export const HomeSidebarLayout: React.FC<HomeSidebarLayoutProps> = ({
  profile,
  companyRequirements,
  recentHistory,
  onNavigate,
  onStartSetup,
  onOpenProfile,
  onOpenResumeModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalInterviews = recentHistory.length;
  const latestReport = recentHistory[0];
  const overallReadiness = latestReport ? latestReport.overallScore : (profile.skills.length > 0 ? 82 : 45);
  const skillsCount = profile.skills.length;

  const navGroups = [
    {
      title: 'HOME',
      items: [{ label: 'Home', view: 'home', icon: HomeIcon, active: true }],
    },
    {
      title: 'INTERVIEW',
      items: [
        { label: 'Mock Interview', view: 'setup', icon: Mic },
        { label: 'Interview History', view: 'history', icon: History },
      ],
    },
    {
      title: 'RESUME',
      items: [
        { label: 'Upload Resume', action: 'resume', icon: FileText },
        { label: 'Resume Analysis', action: 'resume', icon: BarChart3 },
      ],
    },
    {
      title: 'PRACTICE',
      items: [
        { label: 'Practice Weak Areas', view: 'practice_weak', icon: Target },
        { label: 'Skill Assessment', view: 'practice_weak', icon: Award },
      ],
    },
    {
      title: 'PERFORMANCE',
      items: [
        { label: 'Interview Readiness', view: 'recommendations', icon: TrendingUp },
        { label: 'Progress Reports', view: 'history', icon: BarChart3 },
      ],
    },
    {
      title: 'CAREER',
      items: [
        { label: 'Company Recommendations', view: 'recommendations', icon: Building2 },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'My Profile', action: 'profile', icon: User },
      ],
    },
  ];

  const handleItemClick = (item: any) => {
    setMobileMenuOpen(false);
    if (item.view) {
      onNavigate(item.view);
    } else if (item.action === 'resume') {
      onOpenResumeModal();
    } else if (item.action === 'profile') {
      onOpenProfile();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white">
            <Mic className="h-4 w-4" />
          </div>
          <span className="font-bold text-white text-base">VoxPrep</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-300 p-2 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[270px] border-r border-slate-800 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 pt-16 lg:pt-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Logo & Tagline */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 shadow-lg shadow-purple-500/20">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">VoxPrep</span>
                <span className="ml-1.5 rounded bg-purple-950 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">AI</span>
              </div>
            </div>
            <p className="text-[11px] font-medium text-slate-400 pl-1">
              Speak · Improve · Get Hired
            </p>
          </div>

          {/* Navigation Groups */}
          <div className="space-y-6 pt-2">
            {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[10px] font-bold tracking-wider text-slate-500 px-3 uppercase">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = item.label === 'Home';
                    return (
                      <button
                        key={i}
                        onClick={() => handleItemClick(item)}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-md shadow-purple-600/25'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Back to Dashboard Button */}
        <div className="p-6 border-t border-slate-900">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all text-center"
          >
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-[270px] pt-16 lg:pt-0 min-h-screen bg-slate-950 p-4 sm:p-8 lg:p-10 space-y-10">
        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -z-10 h-80 w-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Better Skills → Better Interviews → A Brighter Future</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold tracking-wider uppercase text-purple-400">
                  AI-Powered Interview Preparation
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Welcome to VoxPrep
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Your personal AI interview coach. Practice, improve, and build the skills you need to land your dream job with real-time speech AI and precision analytics.
              </p>
            </div>

            {/* Right side: 3 small feature tiles */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { title: 'Practice & Improve', icon: Target, desc: 'Real-time AI drills' },
                { title: 'Build Your Resume', icon: FileText, desc: 'Instant skill parser' },
                { title: 'Get Hired', icon: Building2, desc: 'Top company alignment' },
              ].map((tile, i) => {
                const Icon = tile.icon;
                return (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tile.title}</div>
                      <div className="text-[10px] text-slate-400">{tile.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-white">Quick Actions</h2>
            <p className="text-xs text-slate-400">Jump into what you want to do</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Start Mock Interview',
                desc: 'Practice with AI and get instant feedback.',
                icon: Mic,
                gradient: 'from-purple-600 to-indigo-600',
                action: onStartSetup,
              },
              {
                title: 'Upload Resume',
                desc: 'Analyze your resume and get personalized insights.',
                icon: FileText,
                gradient: 'from-indigo-600 to-blue-600',
                action: onOpenResumeModal,
              },
              {
                title: 'Practice Weak Areas',
                desc: 'Focus on your weak skills and improve faster.',
                icon: Target,
                gradient: 'from-blue-600 to-cyan-600',
                action: () => onNavigate('practice_weak'),
              },
              {
                title: 'View Reports',
                desc: 'Track your progress and performance.',
                icon: BarChart3,
                gradient: 'from-cyan-600 to-emerald-600',
                action: () => onNavigate('history'),
              },
            ].map((qa, idx) => {
              const Icon = qa.icon;
              return (
                <div
                  key={idx}
                  onClick={qa.action}
                  className="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm hover:border-purple-500/50 hover:bg-slate-900/80 transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${qa.gradient} text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {qa.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {qa.desc}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-purple-400 group-hover:underline">Get started</span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-300 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress Overview & Your Next Step (Side by Side Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Progress Overview Panel (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">Your Progress Overview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Real application metrics and recent activity</p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-medium text-purple-400 hover:text-purple-300"
              >
                View History →
              </button>
            </div>

            {/* 4 Small Statistic Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Interviews', val: totalInterviews, icon: Mic },
                { label: 'Resume', val: skillsCount > 0 ? 'Uploaded' : 'Pending', icon: FileText },
                { label: 'Skills', val: skillsCount, icon: Target },
                { label: 'Readiness', val: `${overallReadiness}%`, icon: Award },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="text-[11px] font-medium">{stat.label}</span>
                      <Icon className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <div className="text-lg font-extrabold text-white font-mono tabular-nums">
                      {stat.val}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Timeline */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-slate-300">Recent Activity</div>
              {recentHistory.length > 0 ? (
                <div className="space-y-2">
                  {recentHistory.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-white">Mock Interview Completed ({item.role})</div>
                          <div className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-purple-400">{item.overallScore}/100</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-center text-xs text-slate-400">
                  No mock interviews completed yet. Start your first session above!
                </div>
              )}
            </div>

            {/* Motivational Progress Card with Progress Bar */}
            <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-indigo-950/30 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-purple-200">
                <span>Skill Alignment Progress</span>
                <span className="font-mono">{overallReadiness}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-1000"
                  style={{ width: `${overallReadiness}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400">
                Keep practicing weak areas and uploading your resume to maximize your hiring readiness.
              </div>
            </div>
          </div>

          {/* Your Next Step Panel (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white">Your Next Step</h2>
              <p className="text-xs text-slate-400 mt-0.5">Recommended action items</p>
            </div>

            {/* Highlighted Try a Mock Interview card */}
            <div
              onClick={onStartSetup}
              className="cursor-pointer rounded-2xl border border-purple-500/40 bg-gradient-to-tr from-purple-950/60 to-indigo-950/60 p-5 space-y-3 shadow-lg hover:border-purple-400 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                  <PlayCircle className="h-4 w-4 text-purple-400" />
                  <span>Try a Mock Interview</span>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test your spoken communication and technical depth with our AI examiner for <strong className="text-white">{profile.targetRole}</strong>.
              </p>
            </div>

            {/* Pro Tips Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Lightbulb className="h-4 w-4 text-cyan-400" />
                <span>Pro Tips for Success</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                {[
                  'Maintain high vocal confidence and clear pacing during speech.',
                  'Use the STAR method (Situation, Task, Action, Result) for behavioral prompts.',
                  'Highlight measurable project impact in your resume analysis.',
                  'Regular daily practice significantly improves your interview readiness score.',
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Motivational footer text */}
            <div className="pt-2 text-center">
              <span className="inline-block rounded-full bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 text-xs font-bold text-cyan-300">
                You got this! 🚀
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
