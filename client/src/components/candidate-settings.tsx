import React, { useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Save, Plus, X, Sliders, Target, Code2, ShieldCheck, AlertCircle, Zap } from 'lucide-react';

export interface CandidateProfile {
  targetCompany?: string;
  techStack: string[];
  topics: string[];
  strengths: string[];
  weaknesses: string[];
  avatarUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

interface CandidateSettingsProps {
  initialProfile: CandidateProfile | null;
  onSave: (profile: CandidateProfile) => void;
  onBack: () => void;
}

const SUGGESTIONS = {
  techStack: ['React', 'Python', 'Node.js', 'Go', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Java', 'C++'],
  topics: ['System Design', 'Microservices', 'Algorithms', 'Data Structures', 'Behavioral', 'DB Optimization', 'API Design'],
  strengths: ['Clean Architecture', 'Leadership', 'Communication', 'Mentorship', 'Performance Tuning', 'Problem Solving'],
  weaknesses: ['Verbosity', 'Dynamic Programming', 'Speaking Fast', 'Test Driven Development', 'Nervousness', 'Over-engineering']
};

const SettingSection = ({ 
  title, 
  description, 
  icon: Icon, 
  tags, 
  onChange, 
  suggestions,
  placeholder = "Add custom option..."
}: { 
  title: string; 
  description: string; 
  icon: any; 
  tags: string[]; 
  onChange: (t: string[]) => void;
  suggestions: string[];
  placeholder?: string;
}) => {
  const [input, setInput] = useState('');

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      onChange(tags.filter(t => t !== tag));
    } else {
      onChange([...tags, tag]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const addCustomTag = () => {
    const val = input.trim().replace(/,$/, '');
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
    }
    setInput('');
  };

  // Find custom tags that are not in the predefined suggestions
  const customTags = tags.filter(t => !suggestions.includes(t));

  return (
    <div className="py-10 border-b border-zinc-200 last:border-0 relative">
      <div className="flex flex-col md:flex-row gap-6 md:gap-12">
        
        {/* Left Side: Info */}
        <div className="md:w-1/3 flex items-start gap-4">
          <div className="mt-1 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100/80 border border-zinc-200">
            <Icon className="w-5 h-5 text-zinc-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-950">{title}</h3>
            <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        
        {/* Right Side: Interactive Selection */}
        <div className="md:w-2/3">
          {/* Predefined Quick Selects */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => toggleTag(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  tags.includes(s) 
                    ? 'bg-zinc-950 text-white shadow-md hover:bg-zinc-800 scale-105 border border-transparent' 
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Custom Input & Custom Tags */}
          <div className="flex flex-col gap-3">
            {customTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag, i) => (
                  <span key={`custom-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)} 
                      className="hover:bg-indigo-200 p-0.5 rounded-md transition-colors cursor-pointer"
                      title="Remove custom tag"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="relative flex items-center max-w-sm">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addCustomTag}
                placeholder={placeholder}
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-zinc-950 transition-colors shadow-xs"
              />
              <button 
                type="button" 
                onClick={addCustomTag}
                className="absolute right-2 p-1.5 text-zinc-400 hover:text-zinc-950 transition-colors bg-white cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export const CandidateSettings: React.FC<CandidateSettingsProps> = ({ initialProfile, onSave, onBack }) => {
  const [profile, setProfile] = useState<CandidateProfile>(initialProfile || {
    techStack: [],
    topics: [],
    strengths: [],
    weaknesses: []
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      onSave(profile);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 600);
  };

  const updateField = (field: keyof CandidateProfile, items: string[]) => {
    setProfile(prev => ({ ...prev, [field]: items }));
  };

  return (
    <div className="min-h-screen bg-white relative pb-32">
      
      {/* Header */}
      <header className="w-full border-b border-zinc-200 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 max-w-5xl mx-auto w-full justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-zinc-950 flex items-center gap-2">
                <Sliders className="w-5 h-5" /> Interview Settings
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {saved && (
               <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pulse">
                 <ShieldCheck className="w-4 h-4" /> Saved Successfully
               </span>
            )}
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                 <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                 <Save className="w-4 h-4" />
              )}
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-5xl mx-auto px-6 py-12 z-10">
        
        <div className="mb-8 border-b border-zinc-200 pb-12">
          <h2 className="text-4xl font-extrabold text-zinc-950 tracking-tight">Profile Configuration</h2>
          <p className="text-zinc-500 mt-3 text-lg font-light leading-relaxed max-w-2xl">
            Select predefined options below to instantly calibrate the AI evaluation engine. You can also type custom parameters if your specific skillset isn't listed.
          </p>
        </div>

        <div className="flex flex-col">
          
          <SettingSection
            title="Tech Stack"
            description="Languages and frameworks you are proficient in. The AI will cater coding questions to these technologies."
            icon={Code2}
            tags={profile.techStack}
            suggestions={SUGGESTIONS.techStack}
            onChange={(tags) => updateField('techStack', tags)}
            placeholder="Add custom language..."
          />

          <SettingSection
            title="Strong Topics"
            description="Areas of computer science or engineering where you feel most confident."
            icon={Target}
            tags={profile.topics}
            suggestions={SUGGESTIONS.topics}
            onChange={(tags) => updateField('topics', tags)}
            placeholder="Add custom topic..."
          />

          <SettingSection
            title="Key Strengths"
            description="Professional strengths you want to emphasize. The AI will evaluate if you demonstrate them effectively."
            icon={Zap}
            tags={profile.strengths}
            suggestions={SUGGESTIONS.strengths}
            onChange={(tags) => updateField('strengths', tags)}
            placeholder="Add custom strength..."
          />

          <SettingSection
            title="Target Weaknesses"
            description="Areas you are actively trying to improve. The AI will provide harsher, targeted feedback on these vectors."
            icon={AlertCircle}
            tags={profile.weaknesses}
            suggestions={SUGGESTIONS.weaknesses}
            onChange={(tags) => updateField('weaknesses', tags)}
            placeholder="Add custom weakness..."
          />

        </div>
      </main>
    </div>
  );
};
