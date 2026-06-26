import { useEffect, useRef, useState } from 'react';

const SOCKET_URL = 'ws://localhost:5000/ws/interview';
const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

function formatTime() {
  return new Date().toLocaleTimeString();
}

export default function InterviewRoomTester() {
  const [socketStatus, setSocketStatus] = useState('disconnected');
  const [role, setRole] = useState('Full-Stack Developer');
  const [isMicActive, setIsMicActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState('starting');
  const [logs, setLogs] = useState([]);
  const socketRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const logEndRef = useRef(null);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  const addLog = (event, payload = '') => {
    setLogs((current) => [
      ...current.slice(-199),
      {
        id: `${Date.now()}-${Math.random()}`,
        time: formatTime(),
        event,
        payload,
      },
    ]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      socketRef.current?.close();
      audioContextRef.current?.close();
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('unavailable');
        addLog('camera_unavailable', 'navigator.mediaDevices.getUserMedia is unavailable.');
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
        addLog('camera_live', 'Webcam preview started.');
      } catch (error) {
        setCameraStatus('blocked');
        addLog('camera_error', error?.message || 'Camera permission denied.');
      }
    };

    startCamera();

    return () => {
      isMounted = false;
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    };
  }, []);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return audioContextRef.current;
  };

  const playNextAudioChunk = async () => {
    if (isPlayingRef.current || !audioQueueRef.current.length) return;

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift();

    try {
      const audioContext = getAudioContext();
      const decoded = await audioContext.decodeAudioData(buffer.slice(0));
      const source = audioContext.createBufferSource();

      source.buffer = decoded;
      source.connect(audioContext.destination);
      source.onended = () => {
        isPlayingRef.current = false;
        playNextAudioChunk();
      };
      source.start();
    } catch (error) {
      addLog('audio_decode_error', error.message);
      isPlayingRef.current = false;
      playNextAudioChunk();
    }
  };

  const enqueueAudio = (arrayBuffer) => {
    audioQueueRef.current.push(arrayBuffer);
    addLog('binary_audio_chunk', `${arrayBuffer.byteLength} bytes queued`);
    playNextAudioChunk();
  };

  const handleTextMessage = (text) => {
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      addLog('text_message', text);
      return;
    }

    if (payload.type === 'ai_response_chunk') {
      addLog('ai_response_chunk', payload.text || '');
      return;
    }

    if (payload.type === 'ai_sentence_complete') {
      addLog('ai_sentence_complete', payload.text || 'sentence complete');
      return;
    }

    if (payload.type === 'ai_response_complete') {
      addLog('ai_response_complete', payload.status || 'done');
      return;
    }

    if (payload.type === 'error') {
      addLog('socket_error_payload', payload.message || JSON.stringify(payload));
      return;
    }

    addLog(payload.type || 'json_message', JSON.stringify(payload));
  };

  const connectSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      addLog('socket_info', 'Socket is already connected.');
      return;
    }

    const socket = new WebSocket(SOCKET_URL);
    socket.binaryType = 'arraybuffer';
    socketRef.current = socket;
    setSocketStatus('connecting');
    addLog('socket_connecting', SOCKET_URL);

    socket.onopen = () => {
      setSocketStatus('connected');
      addLog('socket_connected', 'Ready for transcripts.');
    };

    socket.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        enqueueAudio(event.data);
        return;
      }

      if (event.data instanceof Blob) {
        event.data.arrayBuffer().then(enqueueAudio);
        return;
      }

      handleTextMessage(String(event.data));
    };

    socket.onerror = () => {
      addLog('socket_error', 'WebSocket error event fired.');
    };

    socket.onclose = (event) => {
      setSocketStatus('disconnected');
      setIsMicActive(false);
      addLog('socket_disconnected', `code=${event.code} reason=${event.reason || 'none'}`);
    };
  };

  const sendTranscript = (text) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      addLog('transcript_blocked', 'Socket is not connected.');
      return;
    }

    const payload = {
      type: 'user_transcript',
      role,
      text,
    };

    socket.send(JSON.stringify(payload));
    addLog('user_transcript_sent', text);
  };

  const startMic = () => {
    if (!SpeechRecognitionApi) {
      addLog('speech_recognition_unavailable', 'Use Chrome or Edge for native SpeechRecognition.');
      return;
    }

    if (isMicActive) {
      recognitionRef.current?.stop();
      setIsMicActive(false);
      addLog('mic_stopped');
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsMicActive(true);
      addLog('mic_started');
    };

    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];

        if (result.isFinal) {
          const transcript = result[0]?.transcript?.trim();

          if (transcript) {
            addLog('speech_final', transcript);
            sendTranscript(transcript);
          }
        }
      }
    };

    recognition.onerror = (event) => {
      addLog('speech_error', event.error || 'unknown speech recognition error');
    };

    recognition.onend = () => {
      setIsMicActive(false);
      addLog('mic_ended');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const endInterview = () => {
    recognitionRef.current?.stop();
    socketRef.current?.close(1000, 'Interview ended by tester');
    setIsMicActive(false);
    addLog('end_interview_requested', 'Socket close requested.');
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-950">Mock Interview Room</h2>
        <p className="text-sm text-slate-600">WebSocket voice flow with live camera preview.</p>
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

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Target Role</span>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              <option>Full-Stack Developer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>System Design</option>
              <option>Data Structures and Algorithms</option>
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-100 px-3 py-2 text-sm">
              Socket: <span className="font-semibold capitalize text-slate-950">{socketStatus}</span>
            </div>
            <div className="rounded-md bg-slate-100 px-3 py-2 text-sm">
              Camera: <span className="font-semibold capitalize text-slate-950">{cameraStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={connectSocket}
              className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Connect & Start Session
            </button>
            <button
              type="button"
              onClick={startMic}
              className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
                isMicActive ? 'bg-amber-700 hover:bg-amber-800' : 'bg-slate-950 hover:bg-slate-800'
              }`}
            >
              {isMicActive ? 'Stop Mic' : 'Start Mic'}
            </button>
            <button
              type="button"
              onClick={() => sendTranscript('Hello, I am ready to begin the mock interview.')}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Send Ready Text
            </button>
            <button
              type="button"
              onClick={endInterview}
              className="rounded-md bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
            >
              End Interview / Grade
            </button>
          </div>
        </div>

        <div className="h-[620px] overflow-auto rounded-md bg-slate-950 p-3 font-mono text-xs text-slate-100">
          {logs.length ? (
            logs.map((log) => (
              <div key={log.id} className="mb-2">
                <span className="text-slate-500">[{log.time}]</span>{' '}
                <span className="text-teal-300">{log.event}</span>
                {log.payload ? <span className="whitespace-pre-wrap text-slate-100"> {log.payload}</span> : null}
              </div>
            ))
          ) : (
            <div className="text-slate-500">Terminal feed waiting for events...</div>
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </section>
  );
}
