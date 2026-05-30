import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { ActivityCalendar } from 'react-activity-calendar';
import { Save, MapPin, Mail, Settings, X, Check, Target, Code2, Briefcase, Eye, TrendingUp, Award, Upload } from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  for (let i = 180; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    data.push({
      date: d.toISOString().split('T')[0],
      count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      level: 0
    });
  }
  return data;
};

export const DashboardHome: React.FC = () => {
  const { user, candidateProfile, setUser, setCandidateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const heatmapData = React.useMemo(() => generateHeatmapData(), []);

  // Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editTarget, setEditTarget] = useState(candidateProfile?.targetCompany || '');
  const [editTech, setEditTech] = useState(candidateProfile?.techStack?.join(', ') || '');
  const [editGithub, setEditGithub] = useState(candidateProfile?.githubUrl || '');
  const [editLinkedin, setEditLinkedin] = useState(candidateProfile?.linkedinUrl || '');
  const [editAvatar, setEditAvatar] = useState(candidateProfile?.avatarUrl || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    setUser({ ...user, name: editName });
    setCandidateProfile({
      ...candidateProfile,
      targetCompany: editTarget,
      techStack: editTech.split(',').map(t => t.trim()).filter(Boolean),
      githubUrl: editGithub,
      linkedinUrl: editLinkedin,
      avatarUrl: editAvatar
    });
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a random avatar based on the user's email or name
  const randomAvatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || user?.name || 'kaizen'}&backgroundColor=e2e8f0`;
  const displayAvatar = candidateProfile?.avatarUrl || randomAvatarUrl;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Profile Sidebar (LeetCode Style) */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
          
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-50 to-white pointer-events-none" />
            
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setIsEditing(true)} className="text-zinc-400 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur-sm p-1.5 rounded-md shadow-sm border border-zinc-100">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center relative z-10 mb-6 mt-4">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-white border-4 border-white shadow-lg shrink-0 mb-4 ring-1 ring-zinc-200">
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-xl font-extrabold text-zinc-950 leading-tight tracking-tight">{user?.name}</h1>
              <p className="text-sm font-medium text-zinc-500 mt-0.5">{user?.email}</p>
              <div className="mt-3 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" /> Rank: Top 5%
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 justify-center mb-6">
              {candidateProfile?.githubUrl ? (
                <a href={candidateProfile.githubUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition-all">
                  <GithubIcon className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 cursor-not-allowed">
                  <GithubIcon className="w-4 h-4" />
                </div>
              )}
              {candidateProfile?.linkedinUrl ? (
                <a href={candidateProfile.linkedinUrl} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-all">
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 cursor-not-allowed">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-4 text-sm font-medium text-zinc-600 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 shrink-0">
                  <Briefcase className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Target</span>
                  <span className="text-zinc-900 font-bold leading-none">{candidateProfile?.targetCompany || 'Top Tech'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center border border-zinc-100 shrink-0">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-zinc-400">Location</span>
                  <span className="text-zinc-900 font-bold leading-none">Remote / Relocating</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-6">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Skills & Stack</h3>
              <div className="flex flex-wrap gap-2">
                {candidateProfile?.techStack?.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold border border-zinc-200/80 shadow-sm cursor-default hover:border-indigo-300 transition-colors">
                    {tech}
                  </span>
                ))}
                {(!candidateProfile?.techStack || candidateProfile.techStack.length === 0) && (
                  <span className="text-xs text-zinc-400 italic font-medium">No stack defined. Edit profile to add.</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-zinc-100 pt-6 mt-6">
              <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 text-center">
                  <Eye className="w-4 h-4 text-zinc-400 mx-auto mb-1.5" />
                  <div className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">Views</div>
                  <div className="font-extrabold text-zinc-900">1.2k</div>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                  <Award className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
                  <div className="text-[10px] uppercase font-bold text-amber-600/70 mb-0.5">Rep</div>
                  <div className="font-extrabold text-amber-700">450</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Top Row: Circular Stats & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-500 mb-1">Total Mock Interviews</h3>
                <div className="text-4xl font-black text-zinc-900 mb-2">124</div>
                <div className="flex gap-2 text-xs font-medium mt-3">
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md font-bold shadow-sm">82 Pass</span>
                  <span className="text-rose-700 bg-rose-100 px-2 py-1 rounded-md font-bold shadow-sm">42 Fail</span>
                </div>
              </div>
              <div className="w-28 h-28 rounded-full border-8 border-indigo-50 flex items-center justify-center relative shadow-inner">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-indigo-500" strokeDasharray="251" strokeDashoffset="85" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <span className="block text-2xl font-black text-indigo-600 leading-none">66%</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1 block">Win Rate</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-center">
              <h3 className="text-sm font-bold text-zinc-500 mb-5">Topic Proficiency</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-emerald-600 uppercase tracking-wide text-[10px]">Algorithms</span>
                    <span className="text-zinc-900">85<span className="text-zinc-400 font-medium">/100</span></span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-amber-500 uppercase tracking-wide text-[10px]">System Design</span>
                    <span className="text-zinc-900">62<span className="text-zinc-400 font-medium">/100</span></span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-rose-500 uppercase tracking-wide text-[10px]">Behavioral</span>
                    <span className="text-zinc-900">40<span className="text-zinc-400 font-medium">/100</span></span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                124 submissions in the past 6 months
              </h2>
            </div>
            <div className="overflow-x-auto pb-2">
              <ActivityCalendar 
                data={heatmapData} 
                theme={{
                  light: ['#f4f4f5', '#c7d2fe', '#818cf8', '#4f46e5', '#312e81'],
                }}
                labels={{
                  totalCount: '{{count}} mock interviews in the last 6 months',
                }}
                blockSize={14}
                blockRadius={4}
                blockMargin={5}
                fontSize={12}
              />
            </div>
          </div>

          {/* Saved Vault Miniature view */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex-1 mb-8">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-4">
              <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Save className="w-4 h-4 text-zinc-400" />
                Saved Questions
              </h2>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">View Vault</button>
            </div>
            
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center border border-zinc-200 mb-4 shadow-sm">
                <Save className="w-6 h-6 text-zinc-300" />
              </div>
              <p className="text-sm font-bold text-zinc-900 mb-1">Your vault is empty</p>
              <p className="text-xs font-medium text-zinc-500 mb-6 max-w-sm">Bookmark tricky technical questions or MCQs from the Practice Hub.</p>
              <Button variant="outline" size="sm" className="h-9 px-6 text-xs font-bold rounded-xl border-zinc-200 hover:bg-zinc-50 shadow-sm">Browse Practice Hub</Button>
            </div>
          </div>

        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-zinc-200 flex flex-col md:flex-row"
            >
              
              {/* Left Column: Photo Upload */}
              <div className="w-full md:w-1/3 bg-zinc-50 border-r border-zinc-200 p-8 flex flex-col items-center justify-center text-center relative">
                <button onClick={() => setIsEditing(false)} className="absolute top-4 left-4 p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500 md:hidden">
                  <X className="w-4 h-4" />
                </button>
                
                <h3 className="font-extrabold text-zinc-900 mb-6 w-full text-left md:hidden">Edit Profile</h3>

                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-white border-4 border-white shadow-xl ring-1 ring-zinc-200 relative">
                    <img src={editAvatar || randomAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                </div>
                
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="w-full font-bold shadow-sm rounded-xl">
                  Upload Photo
                </Button>
                <p className="text-[10px] text-zinc-400 mt-3 font-medium px-4">JPG, GIF or PNG. Max size of 5MB.</p>
              </div>

              {/* Right Column: Form Inputs */}
              <div className="w-full md:w-2/3 flex flex-col">
                <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between bg-white hidden md:flex">
                  <h3 className="font-extrabold text-lg text-zinc-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-600" /> Profile Settings
                  </h3>
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 space-y-6 flex-1 overflow-y-auto max-h-[60vh] md:max-h-none">
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Target Company</label>
                      <div className="relative">
                        <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          value={editTarget}
                          onChange={(e) => setEditTarget(e.target.value)}
                          placeholder="e.g. Google, Stripe"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Tech Stack</label>
                      <div className="relative">
                        <Code2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          value={editTech}
                          onChange={(e) => setEditTech(e.target.value)}
                          placeholder="React, Node.js, Python"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all focus:bg-white"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 font-medium">Comma separated list</p>
                    </div>

                    {/* Social Links Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">GitHub Profile</label>
                        <div className="relative">
                          <GithubIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input 
                            type="url" 
                            value={editGithub}
                            onChange={(e) => setEditGithub(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all focus:bg-white"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">LinkedIn Profile</label>
                        <div className="relative">
                          <LinkedinIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input 
                            type="url" 
                            value={editLinkedin}
                            onChange={(e) => setEditLinkedin(e.target.value)}
                            placeholder="https://linkedin.com/in/..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="px-8 py-5 border-t border-zinc-100 bg-zinc-50/80 flex justify-end gap-3 mt-auto">
                  <Button variant="ghost" onClick={() => setIsEditing(false)} className="font-bold text-zinc-500 hover:text-zinc-900 h-11 px-6 rounded-xl">
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="gap-2 font-bold h-11 px-8 rounded-xl shadow-md shadow-indigo-500/20 text-base">
                    <Check className="w-4 h-4" /> Save Profile
                  </Button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
