export type JobRole =
  | 'Software Developer'
  | 'Data Analyst'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'HR';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type InterviewType = 'Technical' | 'HR' | 'Mixed';

export interface InterviewConfig {
  role: JobRole;
  level: ExperienceLevel;
  type: InterviewType;
  questionCount: 5 | 10;
  language: string;
  isDemo: boolean;
}

export interface TranscriptItem {
  id: string;
  questionIndex: number;
  question: string;
  answer: string;
  isFollowUp?: boolean;
  timestamp: number;
  durationSeconds?: number;
}

export interface QuestionFeedback {
  question: string;
  answer: string;
  score: number;
  strengths: string;
  critique: string;
  idealAnswer: string;
}

export interface FeedbackReport {
  id: string;
  date: string;
  role: JobRole;
  level: ExperienceLevel;
  type: InterviewType;
  isDemo: boolean;
  durationSeconds: number;
  overallScore: number;
  technicalScore: number;
  clarityScore: number;
  relevanceScore: number;
  problemSolvingScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  questionFeedback: QuestionFeedback[];
  recommendedTopics: string[];
}
