import React, { useState } from 'react';
import { User, Building2, Briefcase, Award, CheckCircle2, X } from 'lucide-react';
import { StudentProfile } from '../types/profile';
import { JobRole, ExperienceLevel } from '../types/interview';

interface StudentProfileModalProps {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: StudentProfile) => void;
}

const AVAILABLE_ROLES: JobRole[] = [
  'Software Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'HR',
];

const POPULAR_COMPANIES = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'TCS',
  'Infosys',
  'Wipro',
  'Accenture',
  'Apple',
  'Netflix',
  'Startup',
];

const POPULAR_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'Data Structures',
  'System Design',
  'Java',
  'AWS',
  'Problem Solving',
  'Communication',
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<StudentProfile>(profile);
  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleToggleCompany = (company: string) => {
    const current = formData.preferredCompanies;
    if (current.includes(company)) {
      setFormData({
        ...formData,
        preferredCompanies: current.filter((c) => c !== company),
      });
    } else {
      setFormData({
        ...formData,
        preferredCompanies: [...current, company],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/25 text-purple-400 border border-purple-500/30">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Student & Career Profile</h2>
              <p className="text-xs text-slate-400">
                Configure your target role, skills, and preferred companies for tailored readiness insights.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as StudentProfile['status'],
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Student">Student / Fresher</option>
                <option value="Job Seeker">Job Seeker</option>
                <option value="Experienced">Experienced Professional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Job Role</label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experienceLevel: e.target.value as ExperienceLevel,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Beginner">Beginner (0-1 yrs)</option>
                <option value="Intermediate">Intermediate (1-3 yrs)</option>
                <option value="Advanced">Advanced (3+ yrs)</option>
              </select>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Your Current Skills (Click to add or type custom)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-lg bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 text-xs text-purple-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && skillInput.trim()) {
                    e.preventDefault();
                    handleAddSkill(skillInput.trim());
                    setSkillInput('');
                  }
                }}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (skillInput.trim()) {
                    handleAddSkill(skillInput.trim());
                    setSkillInput('');
                  }
                }}
                className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {POPULAR_SKILLS.filter((s) => !formData.skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="rounded-md bg-slate-800/60 px-2 py-0.5 text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Companies */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Target / Preferred Companies (Select multiple)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {POPULAR_COMPANIES.map((company) => {
                const isSelected = formData.preferredCompanies.includes(company);
                return (
                  <button
                    key={company}
                    type="button"
                    onClick={() => handleToggleCompany(company)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950/40 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{company}</span>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Location</label>
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                placeholder="e.g. Remote, Bangalore, Hyderabad"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    jobType: e.target.value as StudentProfile['jobType'],
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Optional Resume / Project Summary (Helps tailor interview questions)
            </label>
            <textarea
              value={formData.resumeDetails || ''}
              onChange={(e) => setFormData({ ...formData, resumeDetails: e.target.value })}
              placeholder="Briefly describe key projects, internships, or coursework..."
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
