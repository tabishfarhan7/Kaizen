import React from 'react';
import { ShieldCheck, Cpu, Code2, Users, ArrowRight, Zap, Target, BookOpen, Clock } from 'lucide-react';
import { Button } from './ui/button';

interface AboutProps {
  onBackToLanding: () => void;
}

export const About: React.FC<AboutProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-white pt-28 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-950 tracking-tight mb-8">About Kaizen</h1>
          <p className="text-xl md:text-2xl text-zinc-500 font-light max-w-3xl mx-auto leading-relaxed">
            Democratizing technical interview preparation through advanced AI telemetry and real-time feedback.
          </p>
        </div>

        {/* Quick Stats - Flat layout */}
        <div className="flex flex-col md:flex-row justify-between items-center border-y border-zinc-200 py-12 mb-24 gap-8 md:gap-0">
          {[
            { label: 'Interviews Simulated', value: '50k+' },
            { label: 'Engineers Hired', value: '4,500' },
            { label: 'Latency', value: '< 250ms' },
            { label: 'Uptime', value: '99.9%' },
          ].map((stat, i) => (
            <div key={i} className="text-center w-full md:border-r border-zinc-200 last:border-0">
              <div className="text-4xl font-extrabold text-zinc-950 mb-2 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Our Mission */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <Target className="w-5 h-5 text-zinc-900" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight">Our Mission</h2>
          </div>
          <div className="text-lg text-zinc-600 font-light leading-relaxed space-y-6 max-w-3xl">
            <p>
              Technical interviews are fundamentally broken. Ambiguous feedback, high stress environments, and subjective grading create an artificial barrier for incredibly talented engineers. 
            </p>
            <p>
              We built Kaizen to provide an objective, real-time feedback loop that empowers engineers to master the interview format and land their dream jobs on their own terms.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mt-16 pt-16 border-t border-zinc-100">
             <div className="flex gap-4">
                <Cpu className="w-6 h-6 text-zinc-900 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2 text-lg">Advanced Telemetry</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Processing speech in real-time, measuring pacing, tracking filler words, and evaluating technical depth instantly.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-zinc-900 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2 text-lg">Privacy First</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Mock interviews run locally. Camera feeds and audio transcripts never leave your machine without explicit consent.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <Code2 className="w-6 h-6 text-zinc-900 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2 text-lg">Open Source Core</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Built by developers. Our core evaluation architecture is transparent, modifiable, and completely open source.</p>
                </div>
             </div>
             <div className="flex gap-4">
                <Users className="w-6 h-6 text-zinc-900 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-zinc-950 mb-2 text-lg">Community Driven</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">Grading rubrics are constantly refined based on real-world interview data crowdsourced from successful FAANG candidates.</p>
                </div>
             </div>
          </div>
        </section>

        {/* The Genesis Story */}
        <section className="mb-24">
           <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <BookOpen className="w-5 h-5 text-zinc-900" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight">The Genesis</h2>
          </div>
          <div className="text-lg text-zinc-600 font-light leading-relaxed space-y-6 border-l-[3px] border-zinc-200 pl-6 md:pl-10 py-2">
            <p>
              Kaizen was born out of frustration. Our founders spent months preparing for technical interviews at top-tier tech companies. They quickly realized that while there were endless platforms to practice coding algorithms, there was almost nothing to help them practice the <em className="font-semibold text-zinc-900">delivery</em> of those algorithms.
            </p>
            <p>
              Technical interviews aren't just about whether your code compiles. They're about how you communicate tradeoffs, how clearly you articulate complex system designs, and how you manage pacing when under pressure. Traditional mock interviews with peers were slow to schedule and highly subjective.
            </p>
            <p>
              We wanted a tool that was always available, relentlessly objective, and deeply analytical. That's when we decided to build Kaizen—acting as your personal, high-bar interviewer.
            </p>
          </div>
        </section>

        {/* The Roadmap */}
        <section className="mb-24">
           <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <Clock className="w-5 h-5 text-zinc-900" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight">What's Next</h2>
          </div>
          <p className="text-lg text-zinc-600 font-light mb-12 max-w-2xl">Our roadmap is public and driven by the community. Here is what we are building next to evolve the platform.</p>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pb-12 border-b border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-950 w-full md:w-1/3">Live IDE Integration</h3>
              <p className="text-zinc-500 font-light leading-relaxed w-full md:w-2/3">Synchronizing your live code edits with the AI interviewer's evaluation model for real-time pair programming feedback and architectural guidance.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pb-12 border-b border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-950 w-full md:w-1/3">Custom Tracks</h3>
              <p className="text-zinc-500 font-light leading-relaxed w-full md:w-2/3">Role-specific mock tracks spanning Frontend Architecture, DevOps pipelines, Data Engineering, and Machine Learning systems.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 pb-12 border-b border-zinc-200">
              <h3 className="text-xl font-bold text-zinc-950 w-full md:w-1/3">Peer Matching</h3>
              <p className="text-zinc-500 font-light leading-relaxed w-full md:w-2/3">Opt-in matchmaking to pair you with human engineers for live mocks, augmented by Kaizen's AI telemetry scorecard running in the background.</p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center border border-zinc-200">
              <Zap className="w-5 h-5 text-zinc-900" />
            </div>
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight">Under The Hood</h2>
          </div>
          <p className="text-lg text-zinc-600 font-light mb-12 max-w-2xl">Built on a modern, high-performance web stack designed for sub-second latency.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-zinc-950 mb-3 text-lg">React & Vite</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">Lighting fast frontend compilation and reactive state management for a seamless single page experience.</p>
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 mb-3 text-lg">WebSockets</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">Persistent bi-directional connections for real-time audio streaming and instant telemetry updates.</p>
            </div>
            <div>
              <h3 className="font-bold text-zinc-950 mb-3 text-lg">AI Processing</h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-light">Advanced natural language processing models tuned specifically for technical vocabulary and system design.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-20 border-t-[3px] border-zinc-950">
          <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight mb-8">Ready to ace your next interview?</h2>
          <div className="flex justify-center gap-4">
            <Button onClick={onBackToLanding} size="lg" className="px-8 py-6 text-base gap-2 shadow-xl hover:-translate-y-1 hover:shadow-zinc-900/20">
              Return to Home <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
