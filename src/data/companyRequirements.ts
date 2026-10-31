export interface CompanyRequirement {
  id: string;
  companyName: string;
  role: string;
  requiredSkills: string[];
  minExperienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  isDemoData: boolean; // clearly labelled demo data
}

export const INITIAL_COMPANY_REQUIREMENTS: CompanyRequirement[] = [
  {
    id: 'comp-1',
    companyName: 'Google',
    role: 'Software Developer',
    requiredSkills: ['Algorithms', 'Data Structures', 'System Design', 'Concurrency', 'Python', 'Java', 'Distributed Systems'],
    minExperienceLevel: 'Intermediate',
    description: 'Focuses on rigorous algorithm problem solving, scalable distributed system design, and code optimization.',
    isDemoData: true,
  },
  {
    id: 'comp-2',
    companyName: 'Microsoft',
    role: 'Software Developer',
    requiredSkills: ['C#', 'Cloud Architecture', 'REST APIs', 'SQL', 'System Design', 'Data Structures'],
    minExperienceLevel: 'Intermediate',
    description: 'Emphasizes robust software engineering practices, cloud services (Azure), and collaborative problem solving.',
    isDemoData: true,
  },
  {
    id: 'comp-3',
    companyName: 'Amazon',
    role: 'Software Developer',
    requiredSkills: ['Java', 'AWS', 'Distributed Systems', 'Object Oriented Design', 'Leadership Principles'],
    minExperienceLevel: 'Intermediate',
    description: 'Evaluates technical depth along with Amazon Leadership Principles (Customer Obsession, Ownership, etc.).',
    isDemoData: true,
  },
  {
    id: 'comp-4',
    companyName: 'TCS',
    role: 'Software Developer',
    requiredSkills: ['Java', 'SQL', 'OOPs', 'Data Structures', 'Communication', 'Problem Solving'],
    minExperienceLevel: 'Beginner',
    description: 'Focuses on fundamental programming concepts, database queries, and logical aptitude.',
    isDemoData: true,
  },
  {
    id: 'comp-5',
    companyName: 'Infosys',
    role: 'Software Developer',
    requiredSkills: ['Python', 'Java', 'SQL', 'Data Structures', 'Analytical Thinking'],
    minExperienceLevel: 'Beginner',
    description: 'Tests core programming proficiency, SQL querying, and fundamental software design principles.',
    isDemoData: true,
  },
  {
    id: 'comp-6',
    companyName: 'Wipro',
    role: 'Software Developer',
    requiredSkills: ['Java', 'SQL', 'Web Technologies', 'Communication', 'Basic Algorithms'],
    minExperienceLevel: 'Beginner',
    description: 'Assesses core technical foundation, communication skills, and adaptability.',
    isDemoData: true,
  },
  {
    id: 'comp-7',
    companyName: 'Accenture',
    role: 'Software Developer',
    requiredSkills: ['Java', 'Cloud Fundamentals', 'Agile Methodologies', 'Problem Solving', 'SQL'],
    minExperienceLevel: 'Beginner',
    description: 'Looks for agile mindset, technical adaptability, and client-facing communication skills.',
    isDemoData: true,
  },
  {
    id: 'comp-8',
    companyName: 'Google',
    role: 'Frontend Developer',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'Web Vitals', 'CSS', 'Performance Optimization'],
    minExperienceLevel: 'Intermediate',
    description: 'Advanced UI engineering, rendering performance optimization, and modern web architecture.',
    isDemoData: true,
  },
  {
    id: 'comp-9',
    companyName: 'Microsoft',
    role: 'Frontend Developer',
    requiredSkills: ['React', 'TypeScript', 'Accessibility', 'State Management', 'CSS'],
    minExperienceLevel: 'Intermediate',
    description: 'Focuses on accessible UI design, component architecture, and responsive web experiences.',
    isDemoData: true,
  },
  {
    id: 'comp-10',
    companyName: 'Google',
    role: 'Data Analyst',
    requiredSkills: ['SQL', 'Python', 'Data Modeling', 'Tableau', 'Statistics', 'Business Intelligence'],
    minExperienceLevel: 'Intermediate',
    description: 'Advanced SQL window functions, statistical hypothesis testing, and actionable data storytelling.',
    isDemoData: true,
  },
];
