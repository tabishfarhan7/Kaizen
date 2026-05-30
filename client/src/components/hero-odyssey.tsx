import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MoveRight, Cpu, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from './ui/button'

interface HeroOdysseyProps {
  onStartInterview: () => void
  onEnhanceSkills: () => void
}

export const HeroOdyssey: React.FC<HeroOdysseyProps> = ({ onStartInterview, onEnhanceSkills }) => {
  const [titleNumber, setTitleNumber] = useState(0)
  const titles = useMemo(
    () => [
      { text: 'confidence', color: 'text-indigo-600' },
      { text: 'technical readiness', color: 'text-emerald-600' },
      { text: 'vocal clarity', color: 'text-violet-600' },
      { text: 'instant feedback', color: 'text-amber-500' },
      { text: 'performance analytics', color: 'text-rose-600' }
    ],
    []
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2500)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-50 bg-grid-pattern px-4">
      {/* Glow effects */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />

      {/* Top Header */}
      <header className="absolute top-0 w-full max-w-7xl px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 shadow-md">
            <Cpu className="h-5.5 w-5.5 text-white animate-pulse-slow" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-zinc-950">
              KAIZEN
            </span>
            <span className="text-[10px] block font-mono text-zinc-500 tracking-widest font-semibold mt-[-3px]">
              IMPROVEMENT ENGINE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-400">v1.0.0-beta</span>
          <a
            href="https://github.com/tabishfarhan7"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition-colors border border-zinc-200 rounded-lg px-3.5 py-1.5 bg-white/50 backdrop-blur-sm shadow-xs"
          >
            GitHub Docs
          </a>
        </div>
      </header>

      {/* Main Hero Component */}
      <main className="relative max-w-4xl w-full text-center flex flex-col items-center pt-28 pb-16 z-10">

        {/* Secondary Badge link */}
        <div className="mb-6">
          <Button variant="outline" size="sm" className="gap-2.5 rounded-full border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300">
            Read our launch article <MoveRight className="w-3.5 h-3.5 text-zinc-500" />
          </Button>
        </div>

        {/* Title with sliding text rotation */}
        <div className="flex gap-4 flex-col mb-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-zinc-950 leading-none">
            <span className="block mb-2">Master your next interview with</span>

            {/* Height-constrained sliding container */}
            <span className="relative flex w-full justify-center overflow-hidden text-center h-[1.25em] py-1 select-none">
              &nbsp;
              {titles.map((titleObj, index) => (
                <motion.span
                  key={index}
                  className={`absolute font-extrabold ${titleObj.color}`}
                  initial={{ opacity: 0, y: '-100%' }}
                  transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                  animate={
                    titleNumber === index
                      ? {
                        y: 0,
                        opacity: 1,
                      }
                      : {
                        y: titleNumber > index ? '-150%' : '150%',
                        opacity: 0,
                      }
                  }
                >
                  {titleObj.text}.
                </motion.span>
              ))}
            </span>
          </h1>

          {/* Description Pitch */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-light mt-4">
            Real-time speech analysis, technical grading, and confidence tracking.
            Experience a high-fidelity mock interview platform designed for modern engineers.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            onClick={onStartInterview}
            size="lg"
            className="gap-2 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden bg-zinc-950 text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            Attempt Live Interview <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            onClick={onEnhanceSkills}
            size="lg"
            variant="outline"
            className="gap-2 hover:shadow-md hover:-translate-y-1 transition-all duration-300 border-zinc-200"
          >
            Enhance Your Skills
          </Button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-24">

          {/* <div className="glass-panel glass-panel-hover rounded-2xl p-5.5 text-left transition-all duration-300">
            <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              Live Speech Processing
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed font-light">
              Continuous 250ms audio chunk slicing directly evaluates delivery pace and filler word occurrences.
            </p>
          </div> */}

          {/* <div className="glass-panel glass-panel-hover rounded-2xl p-5.5 text-left transition-all duration-300">
            <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              Technical AI Grading
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed font-light">
              Get an instant AI technical score, strengths report, and actionable improvement feedback upon completion.
            </p>
          </div> */}

          {/* <div className="glass-panel glass-panel-hover rounded-2xl p-5.5 text-left transition-all duration-300">
            <h3 className="text-sm font-bold text-zinc-900 mb-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
              Telemetry Dials
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed font-light">
              Interactive telemetry dials show confidence metrics and pace changes synchronously as you speak.
            </p>
          </div> */}

        </div>

      </main>

      {/* Footer Info */}
      <div className="absolute bottom-6 text-center text-[10px] text-zinc-500 font-mono z-10 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-zinc-400" />
        Data is processed locally on mock session startup
      </div>
    </div>
  )
}
