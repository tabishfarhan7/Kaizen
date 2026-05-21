import React from 'react'
import { Award, CheckCircle2, AlertTriangle, RefreshCw, X, MessageSquare } from 'lucide-react'

export interface GradingPayload {
  overallScore: number // 0-100
  overallGrade: string // e.g. "A-", "B+", "A"
  fillerWords: {
    like: number
    um: number
    ah: number
    so: number
    youKnow: number
  }
  qualitativeFeedback: {
    strengths: string[]
    improvements: string[]
    summary: string
  }
}

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  grading: GradingPayload | null
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onReset,
  grading,
}) => {
  if (!isOpen || !grading) return null

  const { overallScore, overallGrade, fillerWords, qualitativeFeedback } = grading
  const totalFillerWords = Object.values(fillerWords).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Modal Card container */}
      <div className="relative max-w-2xl w-full bg-white border border-zinc-200/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8 animate-in fade-in zoom-in duration-300">
        
        {/* Border line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-zinc-950" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-750 hover:bg-zinc-100 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-5 border-b border-zinc-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-205 text-zinc-800">
              <Award className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Interview Performance Assessment</h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">Kaizen Grading Protocol v1.0</p>
            </div>
          </div>
          
          {/* Badge overall grade */}
          <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-2xl p-3 pr-4 shadow-xs">
            <div className="text-3xl font-extrabold text-zinc-950 font-mono">
              {overallGrade}
            </div>
            <div className="h-8 w-[1px] bg-zinc-200" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider font-semibold">OVERALL SCORE</span>
              <span className="text-xs font-bold text-zinc-700 font-mono">{overallScore}/100</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 py-5 flex-1 overflow-y-auto max-h-[60vh] space-y-6 no-scrollbar">
          
          {/* Summary Quote */}
          <div className="p-4 rounded-2xl bg-zinc-50/50 border border-zinc-200/60">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest font-mono mb-2 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-950" />
              Executive Summary
            </h4>
            <p className="text-sm text-zinc-700 leading-relaxed font-light font-sans italic">
              "{qualitativeFeedback.summary}"
            </p>
          </div>

          {/* Metrics & Filler Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Score Progress Bar Card */}
            <div className="p-4.5 rounded-2xl bg-zinc-50/50 border border-zinc-200/60 flex flex-col justify-center">
              <span className="text-xs text-zinc-500 font-medium mb-2.5">Technical Accuracy Level</span>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                  <div 
                    className="h-full bg-zinc-950 rounded-full" 
                    style={{ width: `${overallScore}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-zinc-900 font-mono">{overallScore}%</span>
              </div>
            </div>

            {/* Filler Words Stats Card */}
            <div className="p-4.5 rounded-2xl bg-zinc-50/50 border border-zinc-200/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium">Filler Word Incidents</span>
                <span className="text-xs font-mono font-bold text-zinc-950">{totalFillerWords} total</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(fillerWords).map(([word, count]) => (
                  <span 
                    key={word} 
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700 font-mono shadow-xs"
                  >
                    <span className="text-zinc-400 font-sans">{word}:</span>
                    <span className="font-bold text-zinc-950">{count}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Strengths & Improvements Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Strengths Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col h-full">
              <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-widest font-mono mb-3.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Key Strengths
              </h3>
              <ul className="space-y-2.5 flex-1">
                {qualitativeFeedback.strengths.map((str, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="text-emerald-600 text-xs mt-1">•</span>
                    <span className="text-zinc-750 text-sm font-light leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvement Card */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col h-full">
              <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-widest font-mono mb-3.5 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Opportunities
              </h3>
              <ul className="space-y-2.5 flex-1">
                {qualitativeFeedback.improvements.map((imp, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="text-amber-600 text-xs mt-1">•</span>
                    <span className="text-zinc-750 text-sm font-light leading-relaxed">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-6 border-t border-zinc-200/50 bg-zinc-50/50 flex flex-col sm:flex-row gap-3 items-center justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-zinc-600 hover:text-zinc-800 border border-zinc-200 hover:border-zinc-300 bg-white rounded-xl transition-all cursor-pointer text-center shadow-xs"
          >
            Review Transcript
          </button>
          
          <button
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 px-6 py-3 text-xs font-semibold text-white transition-all duration-200 cursor-pointer border border-zinc-950 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Restart Interview Session
          </button>
        </div>

      </div>
    </div>
  )
}
