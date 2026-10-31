import React, { useState } from 'react';
import { Building2, CheckCircle2, AlertTriangle, Sparkles, PlusCircle, ArrowRight, ShieldAlert, Award } from 'lucide-react';
import { StudentProfile } from '../types/profile';
import { CompanyRequirement } from '../data/companyRequirements';
import { FeedbackReport } from '../types/interview';

interface CompanyRecommendationsViewProps {
  profile: StudentProfile;
  companyRequirements: CompanyRequirement[];
  recentHistory: FeedbackReport[];
  onAddCompanyRequirement: (req: CompanyRequirement) => void;
  onStartInterviewForRole: (role: any) => void;
}

export const CompanyRecommendationsView: React.FC<CompanyRecommendationsViewProps> = ({
  profile,
  companyRequirements,
  recentHistory,
  onAddCompanyRequirement,
  onStartInterviewForRole,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState(profile.targetRole);
  const [newSkills, setNewSkills] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Determine student's overall skill competency from recent interview or profile
  const latestReport = recentHistory[0];
  const technicalScore = latestReport ? latestReport.technicalScore : 75;
  const studentSkillSet = new Set(profile.skills.map((s) => s.toLowerCase()));

  // Match companies
  const evaluatedCompanies = companyRequirements.map((req) => {
    const required = req.requiredSkills.map((s) => s.toLowerCase());
    const matching = req.requiredSkills.filter((s) => studentSkillSet.has(s.toLowerCase()));
    const missing = req.requiredSkills.filter((s) => !studentSkillSet.has(s.toLowerCase()));

    const matchRatio = required.length > 0 ? matching.length / required.length : 0.5;
    
    // Transparent alignment score calculation: 50% skill match ratio + 50% interview technical score normalized
    const skillScorePct = matchRatio * 100;
    const alignmentScore = Math.round((skillScorePct * 0.6) + (technicalScore * 0.4));

    let category: 'Good skill alignment' | 'Possible target' | 'Build skills first' = 'Possible target';
    if (alignmentScore >= 80) {
      category = 'Good skill alignment';
    } else if (alignmentScore >= 60) {
      category = 'Possible target';
    } else {
      category = 'Build skills first';
    }

    const isPreferred = profile.preferredCompanies.map(c => c.toLowerCase()).includes(req.companyName.toLowerCase());

    return {
      ...req,
      matching,
      missing,
      alignmentScore,
      category,
      isPreferred,
    };
  });

  // Filter into recommended matches vs target companies requiring prep
  const recommendedMatches = evaluatedCompanies.filter(
    (c) => c.category === 'Good skill alignment' || c.isPreferred
  );
  const targetPrepCompanies = evaluatedCompanies.filter(
    (c) => c.category !== 'Good skill alignment' && !c.isPreferred
  );

  const handleCreateCompanyReq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    const skillList = newSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const created: CompanyRequirement = {
      id: `custom-${Date.now()}`,
      companyName: newCompany.trim(),
      role: newRole,
      requiredSkills: skillList.length > 0 ? skillList : ['Problem Solving', 'Coding'],
      minExperienceLevel: profile.experienceLevel,
      description: newDesc.trim() || 'Custom added company requirements.',
      isDemoData: false,
    };

    onAddCompanyRequirement(created);
    setNewCompany('');
    setNewSkills('');
    setNewDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-10 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300">
              <Building2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Company Recommendation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Target Company Alignment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We compare your verified skills and interview performance against structured company requirements. Use these transparent metrics to prioritize your interview preparation.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all self-start md:self-center whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Custom Company Role</span>
          </button>
        </div>

        {/* Notice on demo data */}
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3.5 text-xs text-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Demo Data Disclaimer:</span> Company requirements listed below are sample benchmarks. Alignment scores reflect estimated skill overlap and mock interview performance, and do not guarantee hiring outcomes or interview selection.
          </div>
        </div>
      </div>

      {/* Group 1: Recommended Matches & Preferred Companies */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Top Matches & Preferences
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Recommended Company Matches
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedMatches.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 font-bold text-sm border border-purple-500/30">
                      {comp.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{comp.companyName}</h3>
                      <p className="text-xs text-slate-400">{comp.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-extrabold text-purple-400 tabular-nums">
                      {comp.alignmentScore}%
                    </span>
                    <div className="text-[10px] text-slate-500">Alignment Score</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      comp.category === 'Good skill alignment'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{comp.category}</span>
                  </span>

                  {comp.isDemoData && (
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                      Demo Benchmark
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                {/* Matching vs Missing Skills */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400">Matching Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {comp.matching.length > 0 ? (
                      comp.matching.map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-300"
                        >
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">No direct matches yet</span>
                    )}
                  </div>

                  {comp.missing.length > 0 && (
                    <>
                      <div className="text-[11px] font-semibold text-slate-400 pt-1">Skills to Build:</div>
                      <div className="flex flex-wrap gap-1">
                        {comp.missing.map((s) => (
                          <span
                            key={s}
                            className="rounded-md bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 text-[11px] text-amber-300"
                          >
                            + {s}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Next Step: {comp.missing.length > 0 ? `Review ${comp.missing[0]}` : 'Mock Interview'}
                </span>
                <button
                  onClick={() => onStartInterviewForRole(comp.role)}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-350 transition-colors"
                >
                  <span>Practice for {comp.companyName}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Group 2: Target Companies Requiring Preparation */}
      <section className="space-y-6 pt-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Growth Targets
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Target Companies Requiring Preparation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {targetPrepCompanies.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 font-bold text-sm border border-slate-700">
                      {comp.companyName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{comp.companyName}</h3>
                      <p className="text-xs text-slate-400">{comp.role}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-extrabold text-amber-400 tabular-nums">
                      {comp.alignmentScore}%
                    </span>
                    <div className="text-[10px] text-slate-500">Alignment Score</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{comp.category}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {comp.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400">Key Skill Gaps:</div>
                  <div className="flex flex-wrap gap-1">
                    {comp.missing.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 text-[11px] text-amber-300"
                      >
                        ! {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Recommended: Build missing skills first
                </span>
                <button
                  onClick={() => onStartInterviewForRole(comp.role)}
                  className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Start Targeted Practice</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Add Custom Company Requirement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-white">Add Company Requirement</h3>
            <form onSubmit={handleCreateCompanyReq} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Stripe, Uber, Zomato"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Role</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Required Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="React, TypeScript, System Design, GraphQL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Briefly describe what this company looks for..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                >
                  Save Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
