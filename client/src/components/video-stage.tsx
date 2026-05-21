import React, { useRef, useEffect } from 'react'
import { Video, VideoOff, Mic, MicOff, AlertCircle, Play, Square } from 'lucide-react'

interface VideoStageProps {
  stream: MediaStream | null
  isMuted: boolean
  onToggleMute: () => void
  onEndInterview: () => void
  onStartInterview: () => void
  interviewState: 'setup' | 'recording' | 'grading' | 'completed'
}

export const VideoStage: React.FC<VideoStageProps> = ({
  stream,
  isMuted,
  onToggleMute,
  onEndInterview,
  onStartInterview,
  interviewState,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream
      } else {
        videoRef.current.srcObject = null
      }
    }
  }, [stream])

  const renderContent = () => {
    switch (interviewState) {
      case 'setup':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-6 text-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 border border-zinc-200 mb-4 text-zinc-850">
              <Video className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">Camera & Microphone Access</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-6 font-light">
              We need access to your camera and mic to conduct the live mock interview.
            </p>
            {stream ? (
              <button
                onClick={onStartInterview}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 cursor-pointer border border-zinc-950 shadow-sm"
              >
                <Play className="h-4 w-4" />
                Start Live Interview
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 border border-zinc-200 rounded-lg px-4 py-2.5 bg-white shadow-xs">
                <AlertCircle className="h-4 w-4 text-yellow-600 animate-pulse" />
                Awaiting media permissions...
              </div>
            )}
          </div>
        )
      
      case 'grading':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-10 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-200" />
              <div className="absolute inset-0 rounded-full border-4 border-t-zinc-950 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">Analyzing Performance</h3>
            <p className="text-sm text-zinc-500 max-w-xs font-light">
              Calculating grading matrices, grammar accuracy, confidence profiles, and qualitative insights...
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-md">
      {/* Video element */}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // Always mute local video playback to avoid feedback loop
          className={`w-full h-full object-cover transition-transform duration-500 ${isMuted ? 'opacity-85' : 'opacity-100'}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
          <VideoOff className="h-12 w-12 text-zinc-300" />
        </div>
      )}

      {/* Recording indicator badge */}
      {interviewState === 'recording' && (
        <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-red-200 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs text-red-600 z-10 select-none shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-mono font-semibold tracking-wider">LIVE RECORDING</span>
        </div>
      )}

      {/* State overlay */}
      {renderContent()}

      {/* Overlaid controls at bottom */}
      {interviewState === 'recording' && (
        <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-10 px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMute}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isMuted
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
            </button>
            <span className="text-xs text-zinc-500 font-mono">
              {isMuted ? 'Microphone Muted' : 'Microphone Live'}
            </span>
          </div>

          <button
            onClick={onEndInterview}
            className="inline-flex items-center gap-2 rounded-xl bg-red-650 hover:bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-all duration-200 cursor-pointer shadow-md shadow-red-500/10"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
            End Mock Interview
          </button>
        </div>
      )}
    </div>
  )
}
