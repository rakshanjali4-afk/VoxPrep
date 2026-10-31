export interface StudentProfile {
  name: string;
  status: 'Student' | 'Job Seeker' | 'Fresher' | 'Experienced';
  targetRole: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  preferredCompanies: string[];
  preferredLocation: string;
  jobType: 'Remote' | 'Hybrid' | 'On-site' | 'Full-time' | 'Internship';
  resumeDetails?: string;
  updatedAt: string;
}
