import React, { useEffect, useRef } from 'react'
import { MessageSquare, Activity } from 'lucide-react'

interface TelemetryPanelProps {
  transcript: string
  confidenceScore: number // 0 to 100
  pace: number // Words per minute (e.g., 0 to 200)
  isRecording: boolean
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  transcript,
  confidenceScore,
  pace,
  isRecording,
}) => {
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transcript])

  // Circular gauge config
  const radius = 40
  const circumference = 2 * Math.PI * radius
  
  // Calculate offsets
  const confidenceOffset = circumference - (confidenceScore / 100) * circumference
  
  // Pace limits: map 0 to 200 WPM
  const maxPace = 200
  const pacePercent = Math.min(Math.max((pace / maxPace) * 100, 0), 100)
  const paceOffset = circumference - (pacePercent / 100) * circumference

  // Dynamic pace label and coloring
  const getPaceStatus = (wpm: number) => {
    if (!isRecording && wpm === 0) return { label: 'Idle', color: 'text-zinc-500', stroke: 'stroke-zinc-100' }
    if (wpm < 80) return { label: 'Too Slow', color: 'text-zinc-550', stroke: 'stroke-zinc-400' }
    if (wpm >= 80 && wpm <= 150) return { label: 'Optimal', color: 'text-zinc-950', stroke: 'stroke-zinc-950' }
    return { label: 'Too Fast', color: 'text-zinc-950', stroke: 'stroke-zinc-950' }
  }

  const paceStatus = getPaceStatus(pace)

  return (
    <div className="flex flex-col h-full gap-6">
      
      {/* Top Half: Live Transcript */}
      <div className="flex-1 flex flex-col glass-panel rounded-3xl border border-zinc-200/80 bg-white p-5 overflow-hidden min-h-[220px]">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-200/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-zinc-950" />
            <span className="text-sm font-semibold text-zinc-900">Live Transcript</span>
          </div>
          {isRecording && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-950">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-950"></span>
              </span>
              STREAMING
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar text-sm font-light text-zinc-800 leading-relaxed font-mono">
          {transcript ? (
            <div className="whitespace-pre-wrap select-text selection:bg-zinc-950/10 selection:text-zinc-950">
              {transcript}
              {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-zinc-950 animate-pulse" />}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500 italic text-xs font-sans">
              {isRecording ? 'Listening for speech...' : 'Transcript will render here once started...'}
            </div>
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* Bottom Half: Live Metrics */}
      <div className="flex-1 glass-panel rounded-3xl border border-zinc-200/80 bg-white p-5 flex flex-col min-h-[220px]">
        <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-zinc-200/50">
          <Activity className="h-4.5 w-4.5 text-zinc-950" />
          <span className="text-sm font-semibold text-zinc-900">Telemetry Metrics</span>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 items-center justify-items-center">
          
          {/* Metric 1: Confidence Score */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-zinc-500 font-medium mb-3">Confidence Score</span>
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-zinc-100 fill-none"
                  strokeWidth="6"
                />
                {/* Foreground circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-zinc-950 fill-none transition-all duration-300 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={confidenceOffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-bold text-zinc-900 font-mono">
                  {confidenceScore}%
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">SCORE</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Pace */}
          <div className="flex flex-col items-center text-center">
            <span className="text-xs text-zinc-500 font-medium mb-3">Speech Pace</span>
            <div className="relative flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className="stroke-zinc-100 fill-none"
                  strokeWidth="6"
                />
                {/* Foreground circle */}
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  className={`fill-none transition-all duration-300 ease-out ${paceStatus.stroke}`}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={paceOffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-bold text-zinc-900 font-mono">
                  {pace}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono">WPM</span>
              </div>
            </div>
            {/* Status indicator badge */}
            <span className={`text-[10px] font-semibold mt-2.5 px-2 py-0.5 rounded border ${
              paceStatus.label === 'Optimal' 
                ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs' 
                : paceStatus.label === 'Idle'
                ? 'bg-zinc-100 border-zinc-200 text-zinc-500'
                : 'bg-zinc-100 border-zinc-200 text-zinc-700'
            }`}>
              {paceStatus.label}
            </span>
          </div>

        </div>
      </div>

    </div>
  )
}
