import React, { useState, useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { VideoStage } from './video-stage'
import { TelemetryPanel } from './telemetry-panel'
import { FeedbackModal } from './feedback-modal'
import type { GradingPayload } from './feedback-modal'
import type { CandidateProfile } from './candidate-settings'
import { 
  Settings, 
  Sliders, 
  LogOut, 
  HelpCircle as HelpIcon,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

interface InterviewDashboardProps {
  user: { name: string; email: string; isGuest?: boolean } | null
  candidateProfile: CandidateProfile | null
  onLogout: () => void
}

export const InterviewDashboard: React.FC<InterviewDashboardProps> = ({ 
  user, 
  candidateProfile,
  onLogout 
}) => {
  // App States
  const [interviewState, setInterviewState] = useState<'setup' | 'recording' | 'grading' | 'completed'>('setup')
  const [isMuted, setIsMuted] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  
  // Real-time metrics
  const [transcript, setTranscript] = useState('')
  const [confidenceScore, setConfidenceScore] = useState(70)
  const [pace, setPace] = useState(0)
  
  // Feedback Overlay States
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [gradingData, setGradingData] = useState<GradingPayload | null>(null)

  // WebSocket Server configurations
  const [serverUrl, setServerUrl] = useState('http://localhost:5001')
  const [showSettings, setShowSettings] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)

  // Refs for recording & WebSocket
  const socketRef = useRef<Socket | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  // Request media streams on mount
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((userStream) => {
        setStream(userStream)
        activeStream = userStream
      })
      .catch((err) => {
        console.error("Failed to acquire user media", err)
      })

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Establish WebSocket connection when serverUrl changes
  useEffect(() => {
    // Connect to server
    socketRef.current = io(serverUrl, {
      transports: ['websocket'],
      autoConnect: true
    })

    socketRef.current.on('connect', () => {
      setSocketConnected(true)
      console.log('Socket server connected')
    })

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false)
      console.log('Socket server disconnected')
    })

    // Listeners for socket events
    socketRef.current.on('transcript_update', (data: { text: string }) => {
      setTranscript(prev => prev + data.text)
    })

    socketRef.current.on('metric_update', (data: { confidence: number; pace: number }) => {
      setConfidenceScore(data.confidence)
      setPace(data.pace)
    })

    socketRef.current.on('final_grading_complete', (data: GradingPayload) => {
      setGradingData(data)
      setInterviewState('completed')
      setFeedbackOpen(true)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [serverUrl])

  // Handle live toggle mute
  const handleToggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsMuted(!isMuted)
    }
  }

  // Triggered when clicking "Start Interview" in setup overlay
  const handleStartInterview = () => {
    if (!stream) return

    setTranscript('')
    setConfidenceScore(75)
    setPace(0)
    setInterviewState('recording')

    // 1. Emit start session to Socket
    if (socketRef.current) {
      socketRef.current.emit('start_session', { profile: candidateProfile })
    }

    // 2. Setup audio slicing MediaRecorder
    try {
      // Audio-only recorder for streaming chunk emissions
      const audioStream = new MediaStream(stream.getAudioTracks())
      const mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          if (socketRef.current?.connected) {
            socketRef.current.emit('audio_chunk', event.data)
          }
        }
      }

      // Start slicing every 250ms
      mediaRecorder.start(250)
    } catch (e) {
      console.error("Error setting up MediaRecorder", e)
    }
  }

  // Triggered when ending mock interview
  const handleEndInterview = () => {
    // 1. Stop recording
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    setInterviewState('grading')

    // 2. Emit End to Socket/Server
    if (socketRef.current) {
      socketRef.current.emit('end_interview')
    }
  }

  // Reset interview session to setup state
  const handleResetSession = () => {
    setFeedbackOpen(false)
    setGradingData(null)
    setTranscript('')
    setConfidenceScore(75)
    setPace(0)
    setInterviewState('setup')
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 flex flex-col text-zinc-900">
      {/* Glow mesh elements */}
      <div className="absolute inset-0 bg-radial-dash pointer-events-none" />

      {/* Header */}
      <header className="relative w-full border-b border-zinc-200 bg-white/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onLogout}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 border border-zinc-200 bg-white transition-colors cursor-pointer shadow-xs"
            title="Log out and exit"
          >
            <LogOut className="h-4.5 w-4.5 rotate-180" />
          </button>
          
          <div className="h-6 w-[1px] bg-zinc-200" />
          
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              Kaizen Dashboard
            </h1>
            <span className="text-[10px] text-zinc-400 font-mono tracking-wider">MOCK INTERVIEW SESSION</span>
          </div>
        </div>

        {/* Status badges & configuration settings button */}
        <div className="flex items-center gap-3">
          
          {/* Connected badge with pulsing status dot */}
          <div className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-mono border bg-white shadow-xs ${
            socketConnected
              ? 'border-emerald-200 text-emerald-700 bg-emerald-50/20'
              : 'border-zinc-200 text-zinc-500 bg-zinc-50/30'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                socketConnected ? 'bg-emerald-400' : 'bg-red-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                socketConnected ? 'bg-emerald-500' : 'bg-red-500'
              }`}></span>
            </span>
            <span>
              {socketConnected ? 'Connected' : 'Offline'}
            </span>
          </div>

          {/* User Profile avatar initials */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 border border-zinc-200 rounded-xl px-2.5 py-1.5 bg-white text-xs text-zinc-700 shadow-xs select-none">
              <div className="h-5 w-5 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-[10px] uppercase font-mono">
                {user.name.slice(0, 2)}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-zinc-950 mt-[-1px] max-w-[80px] truncate leading-none">
                  {user.name}
                </span>
                <span className="text-[8px] text-zinc-400 font-mono leading-none mt-1">
                  {user.isGuest ? 'GUEST' : 'ENGINEER'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-all cursor-pointer bg-white shadow-xs ${
              showSettings 
                ? 'bg-zinc-100 border-zinc-400 text-zinc-950 font-semibold' 
                : 'border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
            }`}
            title="Configure connection settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* Settings Popover */}
      {showSettings && (
        <div className="relative w-full max-w-7xl mx-auto px-6 pt-4 z-20">
          <div className="glass-panel rounded-2xl border border-zinc-200 p-4.5 max-w-md ml-auto shadow-2xl flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-zinc-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-zinc-950" />
              Connection Settings
            </h4>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-mono text-zinc-500">WEBSOCKET SERVER URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono text-zinc-800 focus:outline-none focus:border-zinc-950"
                  placeholder="http://localhost:5001"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        
        {/* Left/Center side: The Stage (Main video) */}
        <div className="lg:col-span-2 flex flex-col justify-start gap-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-bold text-zinc-950 font-sans">Interview Stage</h2>
              <p className="text-xs text-zinc-500 font-light mt-0.5">Focus here and answer the technical prompt when active.</p>
            </div>
            {interviewState === 'recording' && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-600 font-mono tracking-wider font-semibold">STREAMING</span>
              </div>
            )}
          </div>

          <VideoStage
            stream={stream}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onEndInterview={handleEndInterview}
            onStartInterview={handleStartInterview}
            interviewState={interviewState}
          />
          
          {/* Subtle Tip Card */}
          <div className="glass-panel rounded-2xl border border-zinc-200/80 bg-white p-4.5 flex gap-3.5 items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-500">
              <HelpIcon className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-zinc-800">Quick Guidelines</h4>
              <p className="text-zinc-500 text-xs font-light mt-1 leading-relaxed">
                Position your camera so your face is clearly visible. Speak naturally at an average pace. AI evaluation grades technical substance, grammar structure, and fillers.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Telemetry split view */}
        <div className="lg:col-span-1">
          <TelemetryPanel
            transcript={transcript}
            confidenceScore={confidenceScore}
            pace={pace}
            isRecording={interviewState === 'recording'}
          />
        </div>

      </main>

      {/* Slide up/overlay Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onReset={handleResetSession}
        grading={gradingData}
      />
    </div>
  )
}
