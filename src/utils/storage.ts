import { FeedbackReport } from '../types/interview';
import { StudentProfile } from '../types/profile';
import { CompanyRequirement, INITIAL_COMPANY_REQUIREMENTS } from '../data/companyRequirements';

const HISTORY_STORAGE_KEY = 'voxprep_interview_history_v1';
const PROFILE_STORAGE_KEY = 'voxprep_student_profile_v1';
const COMPANIES_STORAGE_KEY = 'voxprep_company_requirements_v1';

export function getInterviewHistory(): FeedbackReport[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return [];
  } catch (err) {
    console.error('Failed to load interview history from localStorage', err);
    return [];
  }
}

export function saveInterviewSession(report: FeedbackReport): void {
  try {
    const history = getInterviewHistory();
    const filtered = history.filter((item) => item.id !== report.id);
    const updated = [report, ...filtered].slice(0, 25);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save interview session to localStorage', err);
  }
}

export function deleteInterviewSession(id: string): FeedbackReport[] {
  try {
    const history = getInterviewHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete interview session', err);
    return getInterviewHistory();
  }
}

export function clearInterviewHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear interview history', err);
  }
}

// Student Profile Storage
export function getStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      const defaultProfile: StudentProfile = {
        name: 'Alex Johnson',
        status: 'Student',
        targetRole: 'Software Developer',
        experienceLevel: 'Intermediate',
        skills: ['JavaScript', 'React', 'Python', 'SQL', 'Data Structures'],
        preferredCompanies: ['Google', 'Microsoft', 'TCS', 'Infosys'],
        preferredLocation: 'Remote / Bangalore',
        jobType: 'Full-time',
        resumeDetails: 'B.Tech Computer Science student with 2 projects in full-stack web development and machine learning.',
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load student profile', err);
    return {
      name: 'Alex Johnson',
      status: 'Student',
      targetRole: 'Software Developer',
      experienceLevel: 'Intermediate',
      skills: ['JavaScript', 'React', 'Python', 'SQL'],
      preferredCompanies: ['Google', 'Microsoft', 'TCS'],
      preferredLocation: 'Remote',
      jobType: 'Full-time',
      updatedAt: new Date().toISOString(),
    };
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    const updated = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save student profile', err);
  }
}

// Company Requirements Storage
export function getCompanyRequirements(): CompanyRequirement[] {
  try {
    const raw = localStorage.getItem(COMPANIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(INITIAL_COMPANY_REQUIREMENTS));
      return INITIAL_COMPANY_REQUIREMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load company requirements', err);
    return INITIAL_COMPANY_REQUIREMENTS;
  }
}

export function saveCompanyRequirement(req: CompanyRequirement): CompanyRequirement[] {
  try {
    const current = getCompanyRequirements();
    const filtered = current.filter((c) => c.id !== req.id);
    const updated = [req, ...filtered];
    localStorage.setItem(COMPANIES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save company requirement', err);
    return getCompanyRequirements();
  }
}
