import React from 'react';
import { Mic, Moon, Sun, Sparkles, Volume2, Building2, Target, User } from 'lucide-react';
import { StudentProfile } from '../types/profile';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onStartDemo: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  historyCount: number;
  profile: StudentProfile;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onStartDemo,
  isDark,
  onToggleTheme,
  historyCount,
  profile,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand wordmark */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="group flex items-center gap-3 text-left transition-opacity hover:opacity-95 shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 shadow-lg shadow-purple-500/20">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">VoxPrep</span>
              <span className="text-xs font-semibold text-purple-400">AI</span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              Interview & Recommendation Platform
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'dashboard' ? 'font-semibold text-white' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('recommendations')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'recommendations' ? 'font-semibold text-white' : ''
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Companies</span>
          </button>
          <button
            onClick={() => onNavigate('practice_weak')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'practice_weak' ? 'font-semibold text-white' : ''
            }`}
          >
            <Target className="h-3.5 w-3.5 text-purple-400" />
            <span>Practice Weak Areas</span>
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`flex items-center gap-2 whitespace-nowrap transition-colors hover:text-white ${
              currentView === 'history' ? 'font-semibold text-white' : ''
            }`}
          >
            <span>History</span>
            {historyCount > 0 && (
              <span className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] font-mono tabular-nums text-slate-300">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Primary Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <User className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden sm:inline">{profile.name}</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => onNavigate('setup')}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/25 transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-purple-600/35 whitespace-nowrap"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Start Mock Interview</span>
          </button>
        </div>
      </div>
    </header>
  );
};
