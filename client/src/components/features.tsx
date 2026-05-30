import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, Cpu, CheckCircle2, Mic, Code2, Users, Network } from 'lucide-react';
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

  // 3D Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation based on cursor position relative to center
    // Max rotation is 5 degrees
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const phraseIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio wave animation state
  const [waveHeights, setWaveHeights] = useState([20, 40, 60, 30, 80, 50, 20]);

  // Handle waveform animation
  useEffect(() => {
    let waveInterval: NodeJS.Timeout;
    if (demoState === 'running') {
      waveInterval = setInterval(() => {
        setWaveHeights(Array.from({ length: 7 }, () => Math.floor(Math.random() * 80) + 10));
      }, 150);
    } else {
      setWaveHeights([10, 10, 10, 10, 10, 10, 10]); // Flat line
    }
    return () => clearInterval(waveInterval);
  }, [demoState]);

  useEffect(() => {
    if (demoState === 'running') {
      // Reset
      setTranscript('');
      setScore(75);
      setPace(120);
      setFillerCount(0);
      phraseIndexRef.current = 0;
      charIndexRef.current = 0;

      const phrases = TRACK_DATA[activeTrack].phrases;

      intervalRef.current = setInterval(() => {
        // Typing effect
        if (phraseIndexRef.current < phrases.length) {
          const currentPhrase = phrases[phraseIndexRef.current];
          if (charIndexRef.current < currentPhrase.length) {
            const char = currentPhrase[charIndexRef.current];
            setTranscript(prev => prev + char);
            charIndexRef.current++;
            
            // Detect filler words on space
            if (char === ' ') {
              const currentWord = currentPhrase.substring(0, charIndexRef.current).split(' ').pop()?.toLowerCase();
              if (currentWord === 'um...' || currentWord === 'like...') {
                setFillerCount(prev => prev + 1);
                setFillerFlash(true);
                setTimeout(() => setFillerFlash(false), 300);
              }
            }

            // Randomize metrics slightly
            if (Math.random() > 0.5) {
              setScore(prev => Math.min(99, Math.max(70, prev + (Math.random() > 0.5 ? 2 : -2))));
              setPace(prev => Math.min(160, Math.max(100, prev + (Math.random() > 0.5 ? 5 : -5))));
            }
          } else {
            // Move to next phrase
            setTranscript(prev => prev + ' ');
            phraseIndexRef.current++;
            charIndexRef.current = 0;
          }
        } else {
          // Finished
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDemoState('completed');
          setScore(activeTrack === 'system' ? 92 : activeTrack === 'algo' ? 95 : 88);
        }
      }, 50);
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
    <section className="relative w-full bg-white font-sans py-24 sm:py-32 overflow-hidden border-t border-zinc-200">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container relative z-10 mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 mb-6">
          Experience the <span className="text-indigo-600">Engine</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-zinc-500 font-light leading-relaxed">
          Kaizen processes your speech in real-time, extracting technical vocabulary, detecting filler words, and dynamically adjusting pacing metrics to objectively grade your interview performance.
        </p>
      </div>

      {/* Track Selector */}
      <div className="flex justify-center gap-3 mb-8 relative z-10">
        <button 
          onClick={() => handleTrackChange('system')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeTrack === 'system' ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 disabled:opacity-50'}`}
        >
          <Network className="w-4 h-4" /> System Design
        </button>
        <button 
          onClick={() => handleTrackChange('algo')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeTrack === 'algo' ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 disabled:opacity-50'}`}
        >
          <Code2 className="w-4 h-4" /> Algorithms
        </button>
        <button 
          onClick={() => handleTrackChange('behavioral')}
          disabled={demoState === 'running'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${activeTrack === 'behavioral' ? 'bg-zinc-950 text-white border-zinc-950 shadow-md' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 disabled:opacity-50'}`}
        >
          <Users className="w-4 h-4" /> Behavioral
        </button>
      </div>

      {/* Interactive Engine Demo UI */}
      <div 
        className="max-w-[1100px] mx-auto px-4 relative z-10"
        style={{ perspective: '1200px' }}
      >
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden flex flex-col md:flex-row hover:shadow-indigo-500/10"
          style={{ 
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out',
            transformStyle: 'preserve-3d'
          }}
        >
          
          {/* Left Panel: Camera/Code placeholder */}
          <div className="w-full md:w-[45%] bg-zinc-950 p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20" />
            
            <div>
              <div className="flex items-center gap-2 text-white/50 mb-8">
                <div className={`w-3 h-3 rounded-full ${demoState === 'running' ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
                <span className="text-xs font-mono tracking-widest">{demoState === 'running' ? 'LIVE RECORDING' : 'READY TO RECORD'}</span>
              </div>
              
              <div className="space-y-4 relative z-10 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" /> AI Interviewer
                </h3>
                <p className="text-zinc-300 font-light leading-relaxed text-sm italic">
                  {TRACK_DATA[activeTrack].prompt}
                </p>
              </div>
            </div>

            {/* Audio Visualizer */}
            <div className="h-24 mt-8 flex items-end justify-center gap-1.5 opacity-80">
              {waveHeights.map((h, i) => (
                <div 
                  key={i} 
                  className={`w-3 rounded-t-sm transition-all duration-150 ${demoState === 'running' ? 'bg-indigo-500' : 'bg-zinc-800'}`} 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

            <div className="mt-8 relative z-10">
              <Button 
                onClick={handleToggleDemo}
                variant={demoState === 'running' ? 'destructive' : 'default'}
                className={`w-full py-6 text-lg font-bold transition-all shadow-lg ${demoState !== 'running' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20' : ''}`}
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
          <div className="w-full md:w-[55%] bg-zinc-50 p-8 border-l border-zinc-200 flex flex-col gap-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
              <h4 className="font-bold text-zinc-950 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Live Telemetry Stream
              </h4>
              <span className={`text-[10px] font-mono px-2 py-1 rounded-md ${demoState === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-500'}`}>
                {demoState === 'running' ? 'PROCESSING...' : 'STANDBY'}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm transition-all text-center md:text-left">
                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-1">SCORE</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-950">{demoState === 'idle' ? '--' : score}</span>
                  <span className="text-xs text-zinc-400 font-bold">/100</span>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm transition-all text-center md:text-left">
                <p className="text-[9px] sm:text-[10px] font-bold text-zinc-500 font-mono tracking-wider mb-1">PACE</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-950">{demoState === 'idle' ? '--' : pace}</span>
                  <span className="text-xs text-zinc-400 font-bold">WPM</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl border shadow-sm transition-all text-center md:text-left ${fillerFlash ? 'bg-red-50 border-red-200 scale-[1.02]' : 'bg-white border-zinc-200'}`}>
                <p className={`text-[9px] sm:text-[10px] font-bold font-mono tracking-wider mb-1 transition-colors ${fillerFlash ? 'text-red-500' : 'text-zinc-500'}`}>FILLERS</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className={`text-2xl sm:text-3xl font-black transition-colors ${fillerFlash ? 'text-red-600' : 'text-zinc-950'}`}>
                    {demoState === 'idle' ? '--' : fillerCount}
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">WRDS</span>
                </div>
              </div>
            </div>

            {/* Transcript Box */}
            <div className="flex-1 min-h-[180px] bg-white rounded-xl border border-zinc-200 shadow-sm p-5 relative flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold text-zinc-500 font-mono tracking-wider">SPEECH-TO-TEXT</p>
                {demoState === 'running' && <Mic className="w-4 h-4 text-emerald-500 animate-pulse" />}
              </div>
              
              {demoState === 'idle' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <Mic className="w-5 h-5 opacity-40" />
                  </div>
                  <span className="text-sm font-light">Waiting for voice input...</span>
                </div>
              ) : (
                <div className="flex-1">
                  <p className="text-zinc-700 text-[15px] leading-relaxed font-medium">
                    {transcript}
                    {demoState === 'running' && <span className="inline-block w-2 h-[15px] ml-1 bg-indigo-600 animate-pulse align-middle translate-y-[-1px]" />}
                  </p>
                </div>
              )}

              {/* Completion Overlay */}
              {demoState === 'completed' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center animate-in fade-in zoom-in duration-300">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h5 className="font-extrabold text-zinc-950 text-xl mb-1">Grade: Strong Hire</h5>
                    <p className="text-zinc-500 text-sm font-medium px-4">
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
