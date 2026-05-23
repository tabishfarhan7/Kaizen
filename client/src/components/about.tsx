import React from 'react';
import { ShieldCheck, Cpu, Code2, Users, ArrowRight, Zap, Target, Mic } from 'lucide-react';
import { Button } from './ui/button';

interface AboutProps {
  onBackToLanding: () => void;
}

export const About: React.FC<AboutProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-32 px-4 bg-grid-pattern relative">
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-50" />
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-950 tracking-tight mb-6">About Kaizen</h1>
          <p className="text-lg md:text-xl text-zinc-600 font-light max-w-2xl mx-auto">
            Democratizing technical interview preparation through advanced AI telemetry and real-time feedback.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Interviews Simulated', value: '50k+' },
            { label: 'Engineers Hired', value: '4,500' },
            { label: 'Latency', value: '< 250ms' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-extrabold text-indigo-600 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Target className="w-64 h-64 text-zinc-950" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-zinc-950 mb-6">Our Mission</h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-12 font-light max-w-3xl">
              Technical interviews are fundamentally broken. Ambiguous feedback, high stress environments, and subjective grading create an artificial barrier 
              for incredibly talented engineers. We built Kaizen to provide an objective, real-time feedback loop 
              that empowers engineers to master the interview format and land their dream jobs on their own terms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <Cpu className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2">Advanced Telemetry</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    We process speech in real-time using cutting edge edge-models, measuring your pacing, tracking filler words, and evaluating technical depth instantly as you speak.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2">Privacy First</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    All mock interviews run locally in your browser when possible. Your camera feed and audio transcripts never leave your machine without explicit consent.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <Code2 className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2">Open Source Core</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Built by developers, for developers. Our core evaluation architecture is transparent, modifiable, and completely open source for the community.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2">Community Driven</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Our grading rubrics are constantly refined based on real-world interview data crowdsourced from successful candidates at FAANG companies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Genesis Story */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-zinc-200 shadow-xl">
            <h2 className="text-2xl font-bold text-zinc-950 mb-6">The Genesis of Kaizen</h2>
            <div className="space-y-6 text-zinc-600 font-light leading-relaxed">
              <p>
                Kaizen was born out of frustration. Our founders spent months preparing for technical interviews at top-tier tech companies. They quickly realized that while there were endless platforms to practice coding algorithms, there was almost nothing to help them practice the <em className="font-semibold text-zinc-800">delivery</em> of those algorithms.
              </p>
              <p>
                Technical interviews aren't just about whether your code compiles. They're about how you communicate tradeoffs, how clearly you articulate complex system designs, and how you manage pacing when under pressure. Traditional mock interviews with peers were slow to schedule and highly subjective in their feedback.
              </p>
              <p>
                We wanted a tool that was always available, relentlessly objective, and deeply analytical. That's when we decided to build Kaizen—an AI-powered engine that listens, analyzes, and grades your technical delivery in real-time, acting as your personal, high-bar interviewer.
              </p>
            </div>
          </div>
        </div>

        {/* The Roadmap */}
        <div className="mb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-950 mb-3">What's Next for Kaizen?</h2>
            <p className="text-zinc-600 font-light max-w-2xl mx-auto">Our roadmap is public and driven by the community. Here is what we are building next.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Code2 className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-3 relative z-10">Live IDE Integration</h3>
              <p className="text-sm text-zinc-400 leading-relaxed relative z-10 font-light">
                Synchronizing your live code edits with the AI interviewer's evaluation model for real-time pair programming feedback.
              </p>
            </div>
            <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-3 relative z-10">Custom Tracks</h3>
              <p className="text-sm text-zinc-400 leading-relaxed relative z-10 font-light">
                Role-specific mock tracks spanning Frontend Architecture, DevOps pipelines, Data Engineering, and Machine Learning.
              </p>
            </div>
            <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users className="w-32 h-32" />
              </div>
              <h3 className="text-lg font-bold mb-3 relative z-10">Peer Matching</h3>
              <p className="text-sm text-zinc-400 leading-relaxed relative z-10 font-light">
                Opt-in matchmaking to pair you with human engineers for live mocks, augmented by Kaizen's AI telemetry scorecard.
              </p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-zinc-950 mb-3">The Engine Under the Hood</h2>
            <p className="text-zinc-600 font-light">Built on a modern, high-performance web stack designed for sub-second latency.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-950 mb-2">React & Vite</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Lighting fast frontend compilation and reactive state management for a seamless single page experience.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-950 mb-2">WebSockets</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Persistent bi-directional socket.io connections for real-time audio streaming and instant telemetry updates.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-950 mb-2">AI Processing</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Advanced natural language processing models tuned specifically for technical vocabulary and system design.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-12 text-center mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-3">Meet the Builders</h2>
            <p className="text-zinc-400 font-light mb-10 max-w-xl mx-auto">
              A small team of ex-interviewers and engineers who got tired of the broken technical hiring process.
            </p>
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { name: 'Suraj', role: 'Founder & Lead Engineer', img: 'https://i.pravatar.cc/150?u=suraj_k' },
                { name: 'Sarah', role: 'AI Systems Architect', img: 'https://i.pravatar.cc/150?u=sarah_a' },
                { name: 'David', role: 'Head of Design', img: 'https://i.pravatar.cc/150?u=david_d' },
              ].map((member, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="relative mb-4 overflow-hidden rounded-full border-2 border-zinc-700 group-hover:border-indigo-500 transition-colors">
                     <img src={member.img} alt={member.name} className="w-20 h-20 object-cover" />
                  </div>
                  <h4 className="text-white font-bold">{member.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-8">
          <h2 className="text-2xl font-bold text-zinc-950 mb-6">Ready to ace your next interview?</h2>
          <div className="flex justify-center gap-4">
            <Button onClick={onBackToLanding} size="lg" className="px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-zinc-950 text-white gap-2">
              Return to Home <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
