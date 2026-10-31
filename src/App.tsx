import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { HomeSidebarLayout } from './components/HomeSidebarLayout';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewRoom } from './components/InterviewRoom';
import { FeedbackView } from './components/FeedbackView';
import { HistoryView } from './components/HistoryView';
import { CompanyRecommendationsView } from './components/CompanyRecommendationsView';
import { PracticeWeakAreasView } from './components/PracticeWeakAreasView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ResumeUploadModal } from './components/ResumeUploadModal';

import { FeedbackReport, InterviewConfig, JobRole } from './types/interview';
import { StudentProfile } from './types/profile';
import { CompanyRequirement } from './data/companyRequirements';
import {
  getInterviewHistory,
  saveInterviewSession,
  deleteInterviewSession,
  clearInterviewHistory,
  getStudentProfile,
  saveStudentProfile,
  getCompanyRequirements,
  saveCompanyRequirement,
} from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'dashboard' | 'setup' | 'interview' | 'report' | 'history' | 'recommendations' | 'practice_weak'
  >('home');

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('voxprep_theme_v1');
      if (saved !== null) {
        return saved === 'dark';
      }
      return true;
    } catch {
      return true;
    }
  });

  const [history, setHistory] = useState<FeedbackReport[]>([]);
  const [activeConfig, setActiveConfig] = useState<InterviewConfig | null>(null);
  const [activeReport, setActiveReport] = useState<FeedbackReport | null>(null);
  const [prefilledRole, setPrefilledRole] = useState<JobRole>('Software Developer');
  const [prefilledIsDemo, setPrefilledIsDemo] = useState<boolean>(false);

  // Student Profile & Company Requirements
  const [profile, setProfile] = useState<StudentProfile>(getStudentProfile());
  const [companyRequirements, setCompanyRequirements] = useState<CompanyRequirement[]>(
    getCompanyRequirements()
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const stored = getInterviewHistory();
    setHistory(stored);
  }, []);

  // Sync theme class to documentElement & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('voxprep_theme_v1', isDark ? 'dark' : 'light');
    } catch {}
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Navigate to setup with specific role
  const handleSelectRoleFromDashboard = (role: JobRole) => {
    setPrefilledRole(role);
    setPrefilledIsDemo(false);
    setCurrentView('setup');
  };

  // Launch Demo Mode immediately
  const handleStartDemo = (role: JobRole = 'Software Developer') => {
    const demoConfig: InterviewConfig = {
      role,
      level: 'Intermediate',
      type: role === 'HR' ? 'HR' : 'Technical',
      questionCount: 5,
      language: 'English',
      isDemo: true,
    };
    setActiveConfig(demoConfig);
    setCurrentView('interview');
  };

  // Start configured interview
  const handleStartInterview = (config: InterviewConfig) => {
    setActiveConfig(config);
    setCurrentView('interview');
  };

  // On interview completion
  const handleFinishInterview = (report: FeedbackReport) => {
    saveInterviewSession(report);
    setHistory(getInterviewHistory());
    setActiveReport(report);
    setCurrentView('report');
  };

  // View specific past report
  const handleViewReport = (report: FeedbackReport) => {
    setActiveReport(report);
    setCurrentView('report');
  };

  // Practice weak topics
  const handlePracticeWeakTopics = (topics: string[]) => {
    setCurrentView('practice_weak');
  };

  // Delete past session
  const handleDeleteReport = (id: string) => {
    const updated = deleteInterviewSession(id);
    setHistory(updated);
    if (activeReport?.id === id) {
      setActiveReport(null);
      setCurrentView('history');
    }
  };

  // Clear all past sessions
  const handleClearHistory = () => {
    clearInterviewHistory();
    setHistory([]);
    setActiveReport(null);
  };

  // Save updated student profile
  const handleSaveProfile = (updated: StudentProfile) => {
    saveStudentProfile(updated);
    setProfile(updated);
  };

  // Add custom company requirement
  const handleAddCompanyRequirement = (req: CompanyRequirement) => {
    const updated = saveCompanyRequirement(req);
    setCompanyRequirements(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* If home view, render HomeSidebarLayout. Otherwise render Navbar and active view */}
      {currentView === 'home' ? (
        <HomeSidebarLayout
          profile={profile}
          companyRequirements={companyRequirements}
          recentHistory={history}
          onNavigate={(v) => setCurrentView(v)}
          onStartSetup={() => {
            setPrefilledIsDemo(false);
            setCurrentView('setup');
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenResumeModal={() => setIsResumeModalOpen(true)}
        />
      ) : (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onStartDemo={() => handleStartDemo()}
            isDark={isDark}
            onToggleTheme={() => setIsDark((prev) => !prev)}
            historyCount={history.length}
            profile={profile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />

          <main className="flex-1">
            {currentView === 'dashboard' && (
              <Dashboard
                profile={profile}
                companyRequirements={companyRequirements}
                onStartSetup={() => {
                  setPrefilledIsDemo(false);
                  setCurrentView('setup');
                }}
                onStartDemo={() => handleStartDemo()}
                onSelectRole={handleSelectRoleFromDashboard}
                recentHistory={history}
                onViewReport={handleViewReport}
                onNavigate={(v) => setCurrentView(v)}
                onOpenProfile={() => setIsProfileModalOpen(true)}
                onOpenResumeModal={() => setIsResumeModalOpen(true)}
              />
            )}

            {currentView === 'recommendations' && (
              <CompanyRecommendationsView
                profile={profile}
                companyRequirements={companyRequirements}
                recentHistory={history}
                onAddCompanyRequirement={handleAddCompanyRequirement}
                onStartInterviewForRole={(role) => {
                  setPrefilledRole(role);
                  setCurrentView('setup');
                }}
              />
            )}

            {currentView === 'practice_weak' && (
              <PracticeWeakAreasView
                profile={profile}
                recentHistory={history}
                onStartInterview={(role, type) => {
                  setActiveConfig({
                    role,
                    level: profile.experienceLevel,
                    type,
                    questionCount: 5,
                    language: 'English',
                    isDemo: false,
                  });
                  setCurrentView('interview');
                }}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}

            {currentView === 'setup' && (
              <InterviewSetup
                initialRole={prefilledRole}
                initialIsDemo={prefilledIsDemo}
                onStart={handleStartInterview}
                onCancel={() => setCurrentView('home')}
              />
            )}

            {currentView === 'interview' && activeConfig && (
              <InterviewRoom
                config={activeConfig}
                onFinish={handleFinishInterview}
                onExit={() => setCurrentView('home')}
              />
            )}

            {currentView === 'report' && activeReport && (
              <FeedbackView
                report={activeReport}
                onTryAgain={() => {
                  if (activeConfig) {
                    setCurrentView('interview');
                  } else {
                    setCurrentView('setup');
                  }
                }}
                onPracticeWeakTopics={handlePracticeWeakTopics}
                onBackToDashboard={() => setCurrentView('home')}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                history={history}
                onSelectReport={handleViewReport}
                onDeleteReport={handleDeleteReport}
                onClearAll={handleClearHistory}
                onStartNew={() => setCurrentView('setup')}
              />
            )}
          </main>
        </>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        profile={profile}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleSaveProfile}
      />

      {/* Footer */}
      {currentView !== 'home' && (
        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-xs text-slate-500 transition-colors no-print">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">VoxPrep AI</span>
              <span>·</span>
              <span>Speak with confidence. Interview with success.</span>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentView('home')}
                className="hover:text-slate-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="hover:text-slate-300 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('recommendations')}
                className="hover:text-slate-300 transition-colors"
              >
                Companies
              </button>
              <button
                onClick={() => setCurrentView('practice_weak')}
                className="hover:text-slate-300 transition-colors"
              >
                Practice Weak Areas
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
