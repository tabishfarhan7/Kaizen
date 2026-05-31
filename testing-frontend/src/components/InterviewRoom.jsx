import { useEffect, useRef, useState } from 'react';

const SOCKET_URL = 'ws://localhost:5000/ws/interview';
const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function InterviewRoom() {
  const [status, setStatus] = useState('Disconnected');
  const [transcriptLog, setTranscriptLog] = useState([]);
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [cameraStatus, setCameraStatus] = useState('starting');

  const wsRef = useRef(null);
  const recognitionRef = useRef(null);
  const targetRoleRef = useRef(targetRole);
  const shouldListenRef = useRef(false);
  const isMicStartingRef = useRef(false);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const logEndRef = useRef(null);

  // --- FREE NATIVE TTS REFS ---
  const speechQueueRef = useRef([]);
  const isSpeakingTextRef = useRef(false);
  const backendDoneRef = useRef(false);

  const logEvent = (sender, message) => {
    setTranscriptLog((current) => [
      ...current.slice(-199),
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        sender,
        message,
      },
    ]);
  };

  const stopMic = () => {
    shouldListenRef.current = false;
    isMicStartingRef.current = false;
    recognitionRef.current?.stop();
    setStatus('Mic Paused');
  };

  const startMic = () => {
    if (!SpeechRecognitionApi) {
      logEvent('SYSTEM', 'Speech Recognition not supported in this browser.');
      return;
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognitionApi();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim();

        if (!transcript) {
          return;
        }

        logEvent('USER', transcript);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'user_transcript',
              role: targetRoleRef.current,
              text: transcript,
            })
          );
        }

        shouldListenRef.current = false;
        recognitionRef.current.stop();
      };

      recognitionRef.current.onerror = (event) => {
        isMicStartingRef.current = false;

        if (event.error === 'no-speech' && shouldListenRef.current && !isSpeakingTextRef.current) {
          window.setTimeout(startMic, 250);
          return;
        }

        if (event.error !== 'aborted') {
          logEvent('SYSTEM', `Mic Error: ${event.error}`);
        }
      };

      recognitionRef.current.onstart = () => {
        isMicStartingRef.current = false;
        setStatus('Listening...');
      };

      recognitionRef.current.onend = () => {
        isMicStartingRef.current = false;

        if (shouldListenRef.current && !isSpeakingTextRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
          window.setTimeout(startMic, 250);
        }
      };
    }

    if (isMicStartingRef.current || isSpeakingTextRef.current) {
      return;
    }

    shouldListenRef.current = true;
    isMicStartingRef.current = true;
    setStatus('Listening...');

    try {
      recognitionRef.current.start();
    } catch (error) {
      isMicStartingRef.current = false;
      logEvent('SYSTEM', `Mic Start Error: ${error.message}`);
    }
  };

  // --- THE NEW NATIVE TTS CONTROLLER ---
  const processSpeechQueue = () => {
    if (isSpeakingTextRef.current) return;

    if (speechQueueRef.current.length === 0) {
      // If the backend has signaled it is done sending text, turn the mic on!
      if (backendDoneRef.current) {
        backendDoneRef.current = false;
        setStatus('AI Finished. Starting Mic...');
        startMic();
      }
      return;
    }

    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    isSpeakingTextRef.current = true;
    setStatus('AI is speaking...');

    const textToSpeak = speechQueueRef.current.shift();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Find a clean, natural browser voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find((v) => v.lang.startsWith('en-'));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.rate = 1.05; // Slightly faster for natural flow
    utterance.pitch = 1.0;

    utterance.onend = () => {
      isSpeakingTextRef.current = false;
      processSpeechQueue(); // Recursively play next sentence
    };

    utterance.onerror = () => {
      isSpeakingTextRef.current = false;
      processSpeechQueue();
    };

    window.speechSynthesis.speak(utterance);
  };

  const connectAndStart = () => {
    const socket = new WebSocket(SOCKET_URL);
    wsRef.current = socket;
    setStatus('Connecting...');

    // Clear any stuck audio from previous sessions
    window.speechSynthesis.cancel();
    speechQueueRef.current = [];
    isSpeakingTextRef.current = false;
    backendDoneRef.current = false;

    socket.onopen = () => {
      setStatus('Connected');
      logEvent('SYSTEM', 'WebSocket Connected. Initializing Interview...');
      socket.send(
        JSON.stringify({
          type: 'user_transcript',
          role: targetRoleRef.current,
          text: 'Hello, I am ready. Please introduce yourself briefly and ask me my first technical question.',
        })
      );
    };

    socket.onmessage = async (event) => {
      // 🚨 IGNORE ALL BINARY (We don't need ElevenLabs anymore!)
      if (event.data instanceof ArrayBuffer || event.data instanceof Blob) {
        return; 
      }

      try {
        const payload = JSON.parse(String(event.data));

        if (payload.type === 'ai_sentence_complete') {
          logEvent('AI', payload.sentence || payload.text || '');
          // Push text to browser voice engine queue
          speechQueueRef.current.push(payload.sentence || payload.text);
          processSpeechQueue();
          return;
        }

        if (payload.type === 'ai_response_complete') {
          backendDoneRef.current = true;
          // If queue is already empty, immediately trigger mic
          if (!isSpeakingTextRef.current && speechQueueRef.current.length === 0) {
            backendDoneRef.current = false;
            setStatus('AI Finished. Starting Mic...');
            startMic();
          }
        }

        if (payload.type === 'error') {
          logEvent('SYSTEM', payload.message || 'WebSocket error payload received.');
        }
      } catch (error) {
        logEvent('SYSTEM', `Failed to parse JSON: ${error.message}`);
      }
    };

    socket.onerror = () => {
      logEvent('SYSTEM', 'WebSocket error event fired.');
    };

    socket.onclose = () => {
      setStatus('Disconnected');
      logEvent('SYSTEM', 'Interview Terminated. Background grading started.');
      stopMic();
      
      // Kill audio if user hangs up
      window.speechSynthesis.cancel();
      speechQueueRef.current = [];
      isSpeakingTextRef.current = false;
      backendDoneRef.current = false;
    };
  };

  useEffect(() => {
    targetRoleRef.current = targetRole;
  }, [targetRole]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptLog]);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('unavailable');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        cameraStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraStatus('live');
      } catch (error) {
        setCameraStatus('blocked');
        logEvent('SYSTEM', `Camera Error: ${error.message}`);
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      stopMic();
      window.speechSynthesis.cancel(); // Stop talking if user leaves page
    };
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-950">Live Mock Interview</h2>
        <p className="text-sm text-slate-600">Continuous AI voice loop with mic and speaker turn-taking.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-950">
            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
            {cameraStatus !== 'live' ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900 px-4 text-center text-sm text-slate-200">
                Camera status: {cameraStatus}
              </div>
            ) : null}
            <div className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Candidate
            </div>
          </div>

          <div className="mb-6 flex gap-4">
            <select
              className="rounded border p-2 text-black"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              disabled={status !== 'Disconnected' && status !== 'Mic Paused'}
            >
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full-Stack Developer">Full-Stack Developer</option>
            </select>

            <button
              type="button"
              onClick={connectAndStart}
              className="rounded bg-green-600 px-4 py-2 font-semibold text-white transition-opacity disabled:opacity-50"
              disabled={status !== 'Disconnected' && status !== 'Mic Paused'}
            >
              Connect & Start
            </button>

            <button
              type="button"
              onClick={() => wsRef.current?.close()}
              className="rounded bg-red-600 px-4 py-2 font-semibold text-white transition-opacity disabled:opacity-50"
              disabled={status === 'Disconnected' || status === 'Mic Paused'}
            >
              End Interview
            </button>
          </div>

          <div className="rounded-md bg-slate-100 p-3 text-sm font-semibold text-slate-700">
            Status:{' '}
            <span className={status === 'Listening...' ? 'text-rose-700' : 'text-blue-700'}>
              {status}
            </span>
          </div>
        </div>

        <div className="h-[620px] overflow-y-auto rounded-md bg-black p-4 font-mono text-sm text-green-400">
          {transcriptLog.length ? (
            transcriptLog.map((log) => (
              <div key={log.id} className="mb-2">
                <span className="text-gray-500">[{log.time}] </span>
                <span
                  className={
                    log.sender === 'USER'
                      ? 'text-blue-400'
                      : log.sender === 'AI'
                        ? 'text-purple-400'
                        : 'text-yellow-400'
                  }
                >
                  {log.sender}:
                </span>
                <span className="ml-2 whitespace-pre-wrap text-white">{log.message}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">Terminal feed waiting for events...</div>
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </section>
  );
}