import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Cpu, CheckCircle2, Mic, Code2, Users, Network, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

type TrackType = 'system' | 'algo' | 'behavioral';

const TRACK_DATA: Record<TrackType, { title: string; prompt: string; phrases: string[] }> = {
  system: {
    title: 'System Design',
    prompt: '"Design a scalable URL shortening service like TinyURL. How would you handle high read/write volume and caching?"',
    phrases: [
      "So, for the system design of this service...",
      "I would start by... um... breaking down the monolithic architecture.",
      "We can implement a distributed cache using Redis.",
      "This will... like... significantly reduce the latency for read-heavy operations."
    ]
  },
  algo: {
    title: 'Algorithms',
    prompt: '"Given an array of integers, return indices of the two numbers such that they add up to a specific target. Assume exactly one solution."',
    phrases: [
      "Well, the naive approach would be O(N squared) using a nested loop.",
      "But... um... we can optimize this to O(N) time complexity.",
      "I would use a hash map to store the complements...",
      "And... like... as we iterate, we just check if the complement exists in the map."
    ]
  },
  behavioral: {
    title: 'Behavioral',
    prompt: '"Tell me about a time you had a major disagreement with a coworker about a technical decision. How did you resolve it?"',
    phrases: [
      "In my last role, we disagreed on migrating to microservices.",
      "I felt it was premature... um... because our team was too small.",
      "Instead of arguing... like... I built a small prototype to measure overhead.",
      "We ended up adopting a modular monolith instead, which saved months of work."
    ]
  }
};

export function Features() {
  const [demoState, setDemoState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [activeTrack, setActiveTrack] = useState<TrackType>('system');
  
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [pace, setPace] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerFlash, setFillerFlash] = useState(false);

  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio wave animation state
  const [waveHeights, setWaveHeights] = useState([20, 40, 60, 30, 80, 50, 20]);

  useEffect(() => {
    let waveInterval: NodeJS.Timeout;
    if (demoState === 'running') {
      waveInterval = setInterval(() => {
        setWaveHeights(Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 10));
      }, 120);
    } else {
      setWaveHeights([15, 15, 15, 15, 15, 15, 15]); 
    }
    return () => clearInterval(waveInterval);
  }, [demoState]);

  useEffect(() => {
    if (demoState === 'running') {
      setTranscript('');
      setScore(75);
      setPace(120);
      setFillerCount(0);
      phraseIndexRef.current = 0;
      charIndexRef.current = 0;

      const phrases = TRACK_DATA[activeTrack].phrases;

      intervalRef.current = setInterval(() => {
        if (phraseIndexRef.current < phrases.length) {
          const currentPhrase = phrases[phraseIndexRef.current];
          if (charIndexRef.current < currentPhrase.length) {
            const char = currentPhrase[charIndexRef.current];
            setTranscript(prev => prev + char);
            charIndexRef.current++;
            
            if (char === ' ') {
              const currentWord = currentPhrase.substring(0, charIndexRef.current).split(' ').pop()?.toLowerCase();
              if (currentWord === 'um...' || currentWord === 'like...') {
                setFillerCount(prev => prev + 1);
                setFillerFlash(true);
                setTimeout(() => setFillerFlash(false), 400);
              }
            }

            if (Math.random() > 0.5) {
              setScore(prev => Math.min(99, Math.max(70, prev + (Math.random() > 0.5 ? 2 : -2))));
              setPace(prev => Math.min(160, Math.max(100, prev + (Math.random() > 0.5 ? 5 : -5))));
            }
          } else {
            setTranscript(prev => prev + ' ');
            phraseIndexRef.current++;
            charIndexRef.current = 0;
          }
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDemoState('completed');
          setScore(activeTrack === 'system' ? 92 : activeTrack === 'algo' ? 95 : 88);
        }
      }, 45);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [demoState, activeTrack]);

  const handleToggleDemo = () => {
    if (demoState === 'running') {
      setDemoState('idle');
      setTranscript('');
      setFillerCount(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setDemoState('running');
    }
  };

  const handleTrackChange = (track: TrackType) => {
    if (demoState === 'running') return;
    setActiveTrack(track);
    setDemoState('idle');
    setTranscript('');
    setFillerCount(0);
  };

  return (
    <section className="relative w-full bg-[#FAFAFA] font-sans py-32 overflow-hidden border-t border-black/[0.04]">
      
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container relative z-10 mx-auto px-4 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.06] mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-zinc-600" />
          <span className="text-sm font-medium text-zinc-600">Next-Generation Telemetry</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-zinc-900 mb-6">
          Experience the Engine
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-zinc-500 font-light leading-relaxed">
          Kaizen processes your speech in real-time, extracting technical vocabulary, detecting filler words, and dynamically adjusting pacing metrics to objectively grade your interview performance.
        </p>
      </div>

      {/* Track Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 relative z-10 px-4">
        <button 
          onClick={() => handleTrackChange('system')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${activeTrack === 'system' ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-500 border-black/10 hover:border-black/20 hover:text-zinc-900 disabled:opacity-50'}`}
        >
          <Network className="w-4 h-4" /> System Design
        </button>
        <button 
          onClick={() => handleTrackChange('algo')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${activeTrack === 'algo' ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-500 border-black/10 hover:border-black/20 hover:text-zinc-900 disabled:opacity-50'}`}
        >
          <Code2 className="w-4 h-4" /> Algorithms
        </button>
        <button 
          onClick={() => handleTrackChange('behavioral')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${activeTrack === 'behavioral' ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white text-zinc-500 border-black/10 hover:border-black/20 hover:text-zinc-900 disabled:opacity-50'}`}
        >
          <Users className="w-4 h-4" /> Behavioral
        </button>
      </div>

      {/* Interactive Engine Demo UI */}
      <div className="max-w-[1100px] mx-auto px-4 relative z-10">
        <div 
          className="bg-white rounded-[2rem] border border-black/[0.06] overflow-hidden flex flex-col md:flex-row shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1"
        >
          
          {/* Left Panel: Camera/Code placeholder */}
          <div className="w-full md:w-[45%] p-10 flex flex-col justify-between relative bg-zinc-50 border-r border-black/[0.04]">
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-zinc-500 mb-10">
                <div className={`w-2.5 h-2.5 rounded-full ${demoState === 'running' ? 'bg-red-500 animate-pulse' : 'bg-zinc-300'}`} />
                <span className="text-[11px] font-bold tracking-widest">{demoState === 'running' ? 'LIVE RECORDING' : 'READY TO RECORD'}</span>
              </div>
              
              <div className="space-y-4 bg-white p-6 rounded-2xl border border-black/[0.04] shadow-sm">
                <h3 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-zinc-700" /> AI Interviewer
                </h3>
                <p className="text-zinc-600 font-normal leading-relaxed text-sm">
                  {TRACK_DATA[activeTrack].prompt}
                </p>
              </div>
            </div>

            {/* Audio Visualizer */}
            <div className="h-28 mt-12 flex items-end justify-center gap-2 opacity-90 relative z-10">
              {waveHeights.map((h, i) => (
                <div 
                  key={i} 
                  className={`w-4 rounded-t-sm transition-all duration-150 ${demoState === 'running' ? 'bg-zinc-800' : 'bg-zinc-200'}`} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="mt-12 relative z-10">
              <Button 
                onClick={handleToggleDemo}
                variant={demoState === 'running' ? 'destructive' : 'default'}
                className={`w-full py-7 rounded-xl text-base font-semibold transition-all duration-300 ${demoState !== 'running' ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm'}`}
              >
                {demoState === 'running' ? (
                  <><Square className="w-5 h-5 mr-2 fill-current" /> Stop Simulation</>
                ) : demoState === 'completed' ? (
                  <><Play className="w-5 h-5 mr-2 fill-current" /> Restart Simulation</>
                ) : (
                  <><Play className="w-5 h-5 mr-2 fill-current" /> Run Live Demo</>
                )}
              </Button>
            </div>
          </div>

          {/* Right Panel: Telemetry Output */}
          <div className="w-full md:w-[55%] bg-white p-10 flex flex-col gap-8 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-black/[0.06]">
              <h4 className="font-semibold text-zinc-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-zinc-700" />
                Live Telemetry Stream
              </h4>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${demoState === 'running' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-zinc-50 text-zinc-500 border-black/10'}`}>
                {demoState === 'running' ? 'PROCESSING...' : 'STANDBY'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 relative z-10">
              <div className="bg-zinc-50 p-5 rounded-2xl border border-black/[0.04] transition-all text-center md:text-left hover:border-black/[0.1] hover:bg-zinc-100/50">
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2">SCORE</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-3xl sm:text-4xl font-semibold text-zinc-900">{demoState === 'idle' ? '--' : score}</span>
                  <span className="text-xs text-zinc-400 font-semibold">/100</span>
                </div>
              </div>
              <div className="bg-zinc-50 p-5 rounded-2xl border border-black/[0.04] transition-all text-center md:text-left hover:border-black/[0.1] hover:bg-zinc-100/50">
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider mb-2">PACE</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-3xl sm:text-4xl font-semibold text-zinc-900">{demoState === 'idle' ? '--' : pace}</span>
                  <span className="text-xs text-zinc-400 font-semibold">WPM</span>
                </div>
              </div>
              <div className={`p-5 rounded-2xl border transition-all duration-300 text-center md:text-left ${fillerFlash ? 'bg-red-50 border-red-200 scale-[1.03]' : 'bg-zinc-50 border-black/[0.04] hover:border-black/[0.1] hover:bg-zinc-100/50'}`}>
                <p className={`text-[10px] font-bold tracking-wider mb-2 transition-colors ${fillerFlash ? 'text-red-500' : 'text-zinc-400'}`}>FILLERS</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className={`text-3xl sm:text-4xl font-semibold transition-colors ${fillerFlash ? 'text-red-600' : 'text-zinc-900'}`}>
                    {demoState === 'idle' ? '--' : fillerCount}
                  </span>
                  <span className={`text-xs font-semibold transition-colors ${fillerFlash ? 'text-red-400' : 'text-zinc-400'}`}>WRDS</span>
                </div>
              </div>
            </div>

            {/* Transcript Box */}
            <div className="flex-1 min-h-[220px] bg-zinc-50 rounded-2xl border border-black/[0.04] p-6 relative flex flex-col z-10 transition-colors hover:bg-zinc-100/50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-zinc-400 tracking-wider">SPEECH-TO-TEXT</p>
                {demoState === 'running' && <Mic className="w-4 h-4 text-zinc-600 animate-pulse" />}
              </div>
              
              {demoState === 'idle' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-4">
                  <div className="w-14 h-14 rounded-full bg-white border border-black/[0.06] flex items-center justify-center shadow-sm">
                    <Mic className="w-6 h-6 opacity-40" />
                  </div>
                  <span className="text-sm font-medium">Waiting for voice input...</span>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-zinc-700 text-[16px] leading-relaxed font-normal">
                    {transcript}
                    {demoState === 'running' && <span className="inline-block w-2 h-[16px] ml-1 bg-zinc-400 animate-pulse align-middle translate-y-[-1px]" />}
                  </p>
                </div>
              )}

              {/* Completion Overlay */}
              {demoState === 'completed' && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-in fade-in zoom-in duration-500 border border-black/[0.04]">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100 shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h5 className="font-semibold text-zinc-900 text-2xl mb-2">Grade: Strong Hire</h5>
                    <p className="text-zinc-500 text-sm font-normal px-4 max-w-[280px] mx-auto">
                      Excellent {activeTrack === 'algo' ? 'time complexity optimization' : activeTrack === 'system' ? 'caching strategy' : 'conflict resolution approach'}, but watch your {fillerCount} filler words.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
