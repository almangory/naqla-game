/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Star, 
  Trophy, 
  Music, 
  Radio, 
  Heart,
  Flame,
  Award,
  Share2,
  Sliders,
  Repeat,
  Headphones,
  Square,
  Download,
  Trash2
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface KidsKaraokeMicGameProps {
  addStars: (amount: number) => void;
}

type VoiceEffect = 'normal' | 'robot' | 'chipmunk' | 'giant' | 'echo';

interface KaraokeSong {
  id: string;
  title: string;
  category: string;
  emoji: string;
  tempo: number; // BPM
  notes: { freq: number; dur: number }[];
  lyrics: { text: string; time: number }[];
  desc: string;
}

const KARAOKE_SONGS: KaraokeSong[] = [
  {
    id: 'alphabet_song',
    title: 'أَلِفْ بَاءْ بُوبَايَة.. قَلَمْ رَصَاصْ وَمَحَايَة 📝',
    category: 'نَشِيدُ الْحُرُوفِ وَاللُّغَةِ الْعَرَبِيَّة',
    emoji: '🔤',
    tempo: 120,
    desc: 'النَّشِيدُ السُّودَانِيُّ وَالْعَرَبِيُّ الْأَشْهَرُ لِتَعَلُّمِ حُرُوفِ الْهِجَاءِ بِرُوحٍ طُفُولِيَّةٍ مُبْهِجَة!',
    notes: [
      { freq: 261.63, dur: 0.3 }, { freq: 261.63, dur: 0.3 }, { freq: 392.00, dur: 0.3 }, { freq: 392.00, dur: 0.3 },
      { freq: 440.00, dur: 0.3 }, { freq: 440.00, dur: 0.3 }, { freq: 392.00, dur: 0.6 },
      { freq: 349.23, dur: 0.3 }, { freq: 349.23, dur: 0.3 }, { freq: 329.63, dur: 0.3 }, { freq: 329.63, dur: 0.3 },
      { freq: 293.66, dur: 0.3 }, { freq: 293.66, dur: 0.3 }, { freq: 261.63, dur: 0.6 },
    ],
    lyrics: [
      { text: 'أَلِفْ بَاءْ بُوبَايَة 🎵', time: 0 },
      { text: 'قَلَمْ رَصَاصْ وَمَحَايَة ✏️', time: 2 },
      { text: 'أَنَا بَكْتُبْ بِالْحُرُوف 📝', time: 4 },
      { text: 'أَجْمَلَ قِصَّةٍ وَرِوَايَة 📖', time: 6 },
      { text: 'أَلِفٌ أَسَدٌ.. بَاءٌ بَطَّة 🦆', time: 8 },
      { text: 'وَالشَّاطِرُ مَا بَنْسَى خُطَّة! ⭐', time: 10 }
    ]
  },
  {
    id: 'sudan_watan',
    title: 'السُّودَانُ وَطَنِي الْحَبِيبُ وَأَرْضُ النِّيل 🇸🇩',
    category: 'أَنَاشِيدُ الْوَطَنِ وَالتُّرَاثِ الْأَصِيل',
    emoji: '🇸🇩',
    tempo: 110,
    desc: 'أُنْشُودَةُ فَخْرٍ وَاعْتِزَازٍ بِجَمَالِ السُّودَانِ وَأَهْلِهِ الطَّيِّبِينَ وَنِيلِهِ الْخَالِد.',
    notes: [
      { freq: 329.63, dur: 0.35 }, { freq: 392.00, dur: 0.35 }, { freq: 440.00, dur: 0.35 }, { freq: 523.25, dur: 0.5 },
      { freq: 440.00, dur: 0.35 }, { freq: 392.00, dur: 0.35 }, { freq: 329.63, dur: 0.6 },
      { freq: 261.63, dur: 0.35 }, { freq: 329.63, dur: 0.35 }, { freq: 392.00, dur: 0.5 },
    ],
    lyrics: [
      { text: 'السُّودَانُ وَطَنِي الْحَبِيب 🇸🇩', time: 0 },
      { text: 'أَرْضُ الْخَيْرِ وَالنِّيلِ الْعَجِيب 🌊', time: 2.5 },
      { text: 'أَهْلِي كِرَامٌ وَطَيِّبِين 🤝', time: 5 },
      { text: 'بِالْحُبِّ دَائِماً مُتَوَحِّدِين 💖', time: 7.5 },
      { text: 'عَاشَ السُّودَانُ حُرّاً أَبِيَّا! 🌟', time: 10 }
    ]
  },
  {
    id: 'numbers_fun',
    title: 'وَاحِدٌ هُوَ رَبِّي.. اثْنَانِ مَامَا وَبَابَا 🧮',
    category: 'نَشِيدُ الْأَرْقَامِ وَالْحِسَابِ الذَّكِي',
    emoji: '🔢',
    tempo: 130,
    desc: 'أُنْشُودَةُ الْأَرْقَامِ التَّرْبَوِيَّةُ الرَّائِعَةُ لِتَعْلِيمِ الْعَدِّ وَالْقِيَمِ الْجَمِيلَة.',
    notes: [
      { freq: 261.63, dur: 0.25 }, { freq: 329.63, dur: 0.25 }, { freq: 392.00, dur: 0.25 }, { freq: 523.25, dur: 0.4 },
      { freq: 392.00, dur: 0.25 }, { freq: 329.63, dur: 0.25 }, { freq: 261.63, dur: 0.5 },
    ],
    lyrics: [
      { text: 'وَاحِدٌ: هُوَ رَبِّي الْخَالِق ☝️', time: 0 },
      { text: 'اثْنَانِ: مَامَا وَبَابَا الْغَالِيَيْن 👨‍👩‍👧', time: 2.2 },
      { text: 'ثَلَاثَةٌ: إِخْوَتِي الْمَحْبُوبِين 👦👧', time: 4.5 },
      { text: 'أَرْبَعَةٌ: أَرْكَانُ بَيْتِي الْمَعْمُور 🏡', time: 6.8 },
      { text: 'خَمْسَةٌ: صَلَوَاتِي نُورٌ عَلَى نُور! 🕌', time: 9.0 }
    ]
  },
  {
    id: 'twinkle_star',
    title: 'Twinkle Twinkle Little Star ✨',
    category: 'English Nursery Rhymes',
    emoji: '🌟',
    tempo: 115,
    desc: 'Classic world-renowned kid anthem about the shining diamond in the sky!',
    notes: [
      { freq: 261.63, dur: 0.3 }, { freq: 261.63, dur: 0.3 }, { freq: 392.00, dur: 0.3 }, { freq: 392.00, dur: 0.3 },
      { freq: 440.00, dur: 0.3 }, { freq: 440.00, dur: 0.3 }, { freq: 392.00, dur: 0.6 },
      { freq: 349.23, dur: 0.3 }, { freq: 349.23, dur: 0.3 }, { freq: 329.63, dur: 0.3 }, { freq: 329.63, dur: 0.3 },
      { freq: 293.66, dur: 0.3 }, { freq: 293.66, dur: 0.3 }, { freq: 261.63, dur: 0.6 },
    ],
    lyrics: [
      { text: 'Twinkle, twinkle, little star ✨', time: 0 },
      { text: 'How I wonder what you are! 🔭', time: 2.5 },
      { text: 'Up above the world so high 🌌', time: 5.0 },
      { text: 'Like a diamond in the sky 💎', time: 7.5 },
      { text: 'Twinkle, twinkle, little star! ⭐', time: 10.0 }
    ]
  }
];

export default function KidsKaraokeMicGame({ addStars }: KidsKaraokeMicGameProps) {
  const { speak } = useSpeech();
  const [selectedSongIdx, setSelectedSongIdx] = useState(0);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [currentLyricIdx, setCurrentLyricIdx] = useState(0);
  const [activeVoiceEffect, setActiveVoiceEffect] = useState<VoiceEffect>('normal');
  const [micColor, setMicColor] = useState<'gold' | 'pink' | 'cyan' | 'purple'>('gold');
  
  // Real Mic Stream & Recording State
  const [isLiveMicActive, setIsLiveMicActive] = useState(false);
  const [liveMicError, setLiveMicError] = useState<string | null>(null);
  const [soundVolumeLevel, setSoundVolumeLevel] = useState(30);

  // Kid Voice Recording & Playback State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState(false);

  // Performance Stars & Cheer
  const [singingScore, setSingingScore] = useState(0);
  const [isApplausePlaying, setIsApplausePlaying] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const songIntervalRef = useRef<any>(null);
  const lyricIntervalRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const recordedBufferRef = useRef<AudioBuffer | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioPlaybackRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const currentSong = KARAOKE_SONGS[selectedSongIdx];

  // Helper to initialize AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Play Tone helper with Voice FX modification
  const playTone = (freq: number, duration: number, effect: VoiceEffect = 'normal') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      let targetFreq = freq;
      let waveType: OscillatorType = 'sine';

      if (effect === 'chipmunk') {
        targetFreq = freq * 1.5; // High pitch like a cartoon squirrel
        waveType = 'triangle';
      } else if (effect === 'giant') {
        targetFreq = freq * 0.6; // Deep resonant hero pitch
        waveType = 'sawtooth';
      } else if (effect === 'robot') {
        waveType = 'square';
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      if (effect === 'echo') {
        const delay = ctx.createDelay();
        delay.delayTime.value = 0.18;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.45;

        osc.connect(gain);
        gain.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(ctx.destination);
        gain.connect(ctx.destination);
      } else {
        osc.connect(gain);
        gain.connect(ctx.destination);
      }

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Crowd Applause Synthesizer
  const playCrowdCheer = () => {
    setIsApplausePlaying(true);
    setSingingScore(prev => prev + 15);
    addStars(10);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Generate soft cheering bursts
      for (let i = 0; i < 16; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400 + Math.random() * 600, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.15);
      }
    } catch (e) {}

    setTimeout(() => setIsApplausePlaying(false), 2000);
  };

  // Play Funny FX
  const playFunnyFX = (type: 'horn' | 'bell' | 'laser' | 'drum') => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (type === 'horn') {
        playTone(330, 0.2);
        setTimeout(() => playTone(330, 0.35), 180);
      } else if (type === 'bell') {
        playTone(1200, 0.5);
      } else if (type === 'laser') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'drum') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {}
  };

  const EFFECT_LABELS: Record<VoiceEffect, string> = {
    normal: 'صوت طبيعي نقي 🎤',
    robot: 'صوت روبوت آلي 🤖',
    chipmunk: 'صوت سنجاب كارتوني 🐿️',
    giant: 'صوت بطل عملاق 🦁',
    echo: 'صدى صوت سينمائي 🏰'
  };

  // Setup sound level animation from live audio stream
  const connectStreamVisualizer = (stream: MediaStream) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setSoundVolumeLevel(Math.min(100, Math.max(20, avg * 1.5)));
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };
      animFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (e) {}
  };

  // Toggle Live Microphone input
  const toggleLiveMic = async () => {
    if (isLiveMicActive) {
      if (isRecording) {
        stopRecording();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setIsLiveMicActive(false);
      setLiveMicError(null);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setLiveMicError('ميزة المايكروفون غير مدعومة في هذا المتصفح');
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        setIsLiveMicActive(true);
        setLiveMicError(null);
        connectStreamVisualizer(stream);
        playCrowdCheer();
      } catch (err) {
        setLiveMicError('يرجى السماح بالوصول للمايكروفون للغناء بصوتك!');
        setIsLiveMicActive(false);
      }
    }
  };

  // Start Recording
  const startRecording = async () => {
    stopRecordedVoice();
    setLiveMicError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setLiveMicError('ميزة تسجيل الصوت غير مدعومة في هذا المتصفح');
        return;
      }

      let stream = micStreamRef.current;
      if (!stream || !stream.active) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
      }
      setIsLiveMicActive(true);
      connectStreamVisualizer(stream);

      // Determine supported MIME type
      let mimeType = '';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = new Blob(recordedChunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setRecordedAudioBlob(blob);
        setRecordedAudioUrl(url);
        setIsRecording(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

        // Decode audio data for Web Audio pitch manipulation
        try {
          const ctx = getAudioContext();
          if (ctx) {
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            recordedBufferRef.current = audioBuffer;
          }
        } catch (err) {
          console.warn('Direct decode failed, fallback will be used:', err);
        }

        playCrowdCheer();
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 44) {
            stopRecording();
            return 45;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      setLiveMicError('يرجى السماح بالوصول للمايكروفون للتمكن من التسجيل!');
      setIsRecording(false);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  // Stop recorded voice playback
  const stopRecordedVoice = () => {
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch (e) {}
      activeSourceRef.current = null;
    }
    if (audioPlaybackRef.current) {
      audioPlaybackRef.current.pause();
      audioPlaybackRef.current.currentTime = 0;
    }
    setIsPlayingRecordedVoice(false);
  };

  // Play child's recorded voice with active Voice FX
  const handlePlayRecordedVoice = async () => {
    if (isPlayingRecordedVoice) {
      stopRecordedVoice();
      return;
    }

    if (!recordedAudioUrl && !recordedBufferRef.current) return;

    // 1. Try Web Audio API playback (supports real-time pitch shifting and FX)
    try {
      const ctx = getAudioContext();
      if (ctx && recordedBufferRef.current) {
        if (activeSourceRef.current) {
          try { activeSourceRef.current.stop(); } catch (e) {}
        }

        const source = ctx.createBufferSource();
        source.buffer = recordedBufferRef.current;

        // Apply Voice FX modulation
        if (activeVoiceEffect === 'chipmunk') {
          source.playbackRate.value = 1.45; // High pitch funny cartoon
        } else if (activeVoiceEffect === 'giant') {
          source.playbackRate.value = 0.72; // Deep booming hero
        } else {
          source.playbackRate.value = 1.0;
        }

        if (activeVoiceEffect === 'echo') {
          const delay = ctx.createDelay();
          delay.delayTime.value = 0.22;
          const feedback = ctx.createGain();
          feedback.gain.value = 0.45;

          source.connect(ctx.destination);
          source.connect(delay);
          delay.connect(feedback);
          feedback.connect(delay);
          delay.connect(ctx.destination);
        } else if (activeVoiceEffect === 'robot') {
          const biquad = ctx.createBiquadFilter();
          biquad.type = 'bandpass';
          biquad.frequency.value = 1100;
          biquad.Q.value = 4.5;
          source.connect(biquad);
          biquad.connect(ctx.destination);
        } else {
          source.connect(ctx.destination);
        }

        source.onended = () => {
          setIsPlayingRecordedVoice(false);
          activeSourceRef.current = null;
        };

        activeSourceRef.current = source;
        setIsPlayingRecordedVoice(true);
        source.start(0);
        return;
      }
    } catch (e) {
      console.warn('Web Audio playback error, using HTMLAudio fallback:', e);
    }

    // 2. Resilient HTMLAudio fallback
    if (recordedAudioUrl) {
      if (!audioPlaybackRef.current) {
        audioPlaybackRef.current = new Audio(recordedAudioUrl);
      } else {
        audioPlaybackRef.current.src = recordedAudioUrl;
      }
      const audio = audioPlaybackRef.current;
      if (activeVoiceEffect === 'chipmunk') {
        audio.playbackRate = 1.4;
      } else if (activeVoiceEffect === 'giant') {
        audio.playbackRate = 0.75;
      } else {
        audio.playbackRate = 1.0;
      }

      audio.onended = () => setIsPlayingRecordedVoice(false);
      audio.onerror = () => setIsPlayingRecordedVoice(false);
      try {
        await audio.play();
        setIsPlayingRecordedVoice(true);
      } catch (err) {
        setIsPlayingRecordedVoice(false);
      }
    }
  };

  // Delete recording
  const handleDeleteRecording = () => {
    stopRecordedVoice();
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
    }
    setRecordedAudioUrl(null);
    setRecordedAudioBlob(null);
    recordedBufferRef.current = null;
    setRecordingSeconds(0);
  };

  // Download recorded voice note
  const handleDownloadRecording = () => {
    if (!recordedAudioUrl) return;
    const a = document.createElement('a');
    a.href = recordedAudioUrl;
    a.download = `تسجيل-صوت-بطل-نقلة-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Clean up all resources on unmount
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (songIntervalRef.current) clearInterval(songIntervalRef.current);
      if (lyricIntervalRef.current) clearInterval(lyricIntervalRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (activeSourceRef.current) {
        try { activeSourceRef.current.stop(); } catch (e) {}
      }
      if (audioPlaybackRef.current) {
        audioPlaybackRef.current.pause();
      }
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
    };
  }, [recordedAudioUrl]);

  // Karaoke Track Playback Loop
  const handleTogglePlaySong = () => {
    if (isPlayingSong) {
      setIsPlayingSong(false);
      if (songIntervalRef.current) clearInterval(songIntervalRef.current);
      if (lyricIntervalRef.current) clearInterval(lyricIntervalRef.current);
    } else {
      setIsPlayingSong(true);
      setCurrentLyricIdx(0);

      // Play notes in sequence
      let noteIdx = 0;
      const notes = currentSong.notes;

      songIntervalRef.current = setInterval(() => {
        if (noteIdx < notes.length) {
          const note = notes[noteIdx];
          playTone(note.freq, note.dur, activeVoiceEffect);
          setSoundVolumeLevel(40 + Math.random() * 50);
          noteIdx++;
        } else {
          noteIdx = 0; // loop
        }
      }, 350);

      // Advance lyrics
      let sec = 0;
      lyricIntervalRef.current = setInterval(() => {
        sec += 1;
        const matchingIdx = currentSong.lyrics.findIndex((l, i) => {
          const nextTime = currentSong.lyrics[i + 1]?.time || 999;
          return sec >= l.time && sec < nextTime;
        });
        if (matchingIdx !== -1) {
          setCurrentLyricIdx(matchingIdx);
        }
        if (sec >= 12) {
          sec = 0;
        }
      }, 1000);
    }
  };

  // Switch song
  const handleSelectSong = (idx: number) => {
    if (isPlayingSong) {
      if (songIntervalRef.current) clearInterval(songIntervalRef.current);
      if (lyricIntervalRef.current) clearInterval(lyricIntervalRef.current);
      setIsPlayingSong(false);
    }
    setSelectedSongIdx(idx);
    setCurrentLyricIdx(0);
  };

  // Microphone theme palette
  const MIC_THEMES = {
    gold: {
      head: 'from-amber-300 via-yellow-400 to-amber-500',
      ring: 'border-yellow-300',
      glow: 'shadow-[0_0_40px_rgba(245,158,11,0.55)]',
      handle: 'from-amber-500 via-amber-600 to-yellow-700',
      badge: 'مايك الذهب الملكي 👑'
    },
    pink: {
      head: 'from-pink-400 via-rose-400 to-fuchsia-500',
      ring: 'border-pink-300',
      glow: 'shadow-[0_0_40px_rgba(244,63,94,0.55)]',
      handle: 'from-rose-500 via-pink-600 to-purple-600',
      badge: 'مايك النجوم الوردي 💖'
    },
    cyan: {
      head: 'from-cyan-300 via-teal-400 to-blue-500',
      ring: 'border-cyan-300',
      glow: 'shadow-[0_0_40px_rgba(6,182,212,0.55)]',
      handle: 'from-teal-500 via-cyan-600 to-blue-700',
      badge: 'مايك المستقبل الفضائي 🚀'
    },
    purple: {
      head: 'from-purple-400 via-violet-500 to-indigo-600',
      ring: 'border-purple-300',
      glow: 'shadow-[0_0_40px_rgba(139,92,246,0.55)]',
      handle: 'from-purple-600 via-indigo-700 to-violet-800',
      badge: 'مايك السحر البنفسجي 🔮'
    }
  };

  const currentMicTheme = MIC_THEMES[micColor];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HUD                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#EC4899] shadow-[0_8px_0_0_#BE185D] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EC4899] to-[#F472B6] flex items-center justify-center text-3xl shadow-inner text-white shrink-0 select-none animate-bounce">
            🎤✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-pink-100 text-pink-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-pink-200">
                استوديو المواهب وكاريوكي الأطفال 🎶
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ {singingScore} نقطة نجومية
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
              مايكروفون النجوم الغنائي (Kids Karaoke Studio) 🎙️🌟
            </h2>
            <p className="text-xs font-bold text-gray-500 mt-0.5">
              غنِّ أجمل الأناشيد وغيّر صوتك مع مؤثرات الروبوت والسنجاب والصدى وتصفيق الجمهور!
            </p>
          </div>
        </div>

        {/* Mic Color Chooser */}
        <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-2xl border border-pink-200">
          <span className="text-xs font-black text-pink-900">لون المايك:</span>
          {(['gold', 'pink', 'cyan', 'purple'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setMicColor(c)}
              className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                micColor === c ? 'scale-125 border-gray-900 shadow-md' : 'border-white hover:scale-110'
              } ${
                c === 'gold' ? 'bg-amber-400' : c === 'pink' ? 'bg-pink-500' : c === 'cyan' ? 'bg-cyan-400' : 'bg-purple-600'
              }`}
              title={MIC_THEMES[c].badge}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THE PHYSICAL TOY MICROPHONE ARENA                                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: THE 3D TOY MICROPHONE (7 Columns) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-gray-900 via-indigo-950 to-purple-950 rounded-[36px] p-6 sm:p-8 border-4 border-pink-400 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-white">
          
          {/* Dancing Disco Lights on background */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-4 left-8 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-6 right-8 w-36 h-36 bg-cyan-400 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Current Song Karaoke Ribbon */}
          <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6 text-center relative z-10">
            <span className="text-[11px] font-bold text-pink-300 block mb-1">
              🎵 الأنشودة الحالية:
            </span>
            <h3 className="text-base sm:text-lg font-black text-yellow-300">
              {currentSong.title}
            </h3>

            {/* Karaoke Live Lyrics Prompter */}
            <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/10 min-h-[50px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentLyricIdx}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-base sm:text-xl font-black text-white drop-shadow-[0_2px_10px_rgba(236,72,153,0.8)]"
                >
                  {isPlayingSong 
                    ? currentSong.lyrics[currentLyricIdx]?.text || '...استعد للغناء! 🎶'
                    : 'اضغط على زر التشغيل ⏵ في المايكروفون للغناء!'}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* THE 3D TOY MICROPHONE BODY */}
          <div className="relative flex flex-col items-center justify-center select-none py-2 z-10">
            
            {/* 1. MICROPHONE HEAD: Glowing Metallic Disco Sphere */}
            <motion.div
              animate={{
                scale: isPlayingSong || isLiveMicActive ? [1, 1.06, 1] : 1,
                rotate: isPlayingSong ? [-1.5, 1.5, -1.5] : 0
              }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr ${currentMicTheme.head} ${currentMicTheme.glow} p-3 relative flex items-center justify-center border-4 ${currentMicTheme.ring} shadow-2xl cursor-pointer`}
              onClick={handleTogglePlaySong}
            >
              {/* Metallic Grille Pattern */}
              <div className="w-full h-full rounded-full bg-black/30 backdrop-blur-xs flex flex-col items-center justify-center relative overflow-hidden border-2 border-white/50">
                
                {/* Visualizer Sound Waves */}
                <div className="flex items-center gap-1.5 h-16">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isPlayingSong || isLiveMicActive 
                          ? [8, 20 + Math.sin(i * 1.2) * (soundVolumeLevel / 2) + Math.random() * 25, 8]
                          : 8
                      }}
                      transition={{ repeat: Infinity, duration: 0.2 + (i % 3) * 0.08 }}
                      className="w-2.5 rounded-full bg-white shadow-[0_0_8px_white]"
                    />
                  ))}
                </div>

                <div className="text-2xl mt-1 select-none">
                  {isPlayingSong ? '🎵' : '🎤'}
                </div>
              </div>

              {/* Glowing Outer Ring Lights */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/40 animate-spin" style={{ animationDuration: '16s' }} />
            </motion.div>

            {/* Microphone Neck Ring */}
            <div className="w-16 h-4 bg-gray-300 rounded-full shadow-md -mt-1 border border-white relative z-20" />

            {/* 2. MICROPHONE HANDLE: Ergonomic Glossy Stick with Buttons */}
            <div className={`w-32 sm:w-36 bg-gradient-to-b ${currentMicTheme.handle} rounded-b-[40px] rounded-t-lg p-3 pt-4 border-3 border-white/60 shadow-2xl flex flex-col items-center gap-2.5 relative -mt-1`}>
              
              {/* Main Play / Pause Melody Button */}
              <button
                onClick={handleTogglePlaySong}
                className="w-16 h-16 rounded-full bg-white hover:bg-yellow-100 text-pink-600 flex items-center justify-center text-2xl font-black shadow-lg cursor-pointer active:scale-95 transition-transform border-3 border-pink-400"
                title={isPlayingSong ? 'إيقاف اللحن' : 'تشغيل اللحن والغناء'}
              >
                {isPlayingSong ? <Pause className="w-7 h-7 fill-pink-600" /> : <Play className="w-7 h-7 fill-pink-600 ml-1" />}
              </button>

              {/* Dynamic Record / Listen Button on Mic Handle */}
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 animate-pulse border border-white"
                  title="إيقاف التسجيل وحفظ صوتك"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>إيقاف (00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds})</span>
                </button>
              ) : recordedAudioUrl ? (
                <button
                  onClick={handlePlayRecordedVoice}
                  className="w-full py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 border border-white"
                  title="استمع لصوتك المسجل"
                >
                  {isPlayingRecordedVoice ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlayingRecordedVoice ? 'إيقاف ⏸️' : 'استمع لصوتك 🎧'}</span>
                </button>
              ) : (
                <button
                  onClick={startRecording}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-md cursor-pointer active:scale-95 transition flex items-center justify-center gap-1.5 border border-white/50"
                  title="سجل صوتك وأنت تغني"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>سجّل صوتي 🔴</span>
                </button>
              )}

              {/* Audience Applause Button on handle */}
              <button
                onClick={playCrowdCheer}
                className="w-full py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-amber-950 rounded-xl text-[11px] font-black shadow-md cursor-pointer active:scale-95 transition flex items-center justify-center gap-1"
                title="اضغط هنا لسماع تصفيق وتشجيع الجمهور!"
              >
                <span>تصفيق الجمهور 👏🎉</span>
              </button>

              {/* Decorative speaker grille on bottom of mic handle */}
              <div className="flex gap-1 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-black/40" />
                <div className="w-2 h-2 rounded-full bg-black/40" />
                <div className="w-2 h-2 rounded-full bg-black/40" />
              </div>

            </div>

          </div>

          {/* ============================================================= */}
          {/* 3. KID VOICE RECORDING & PLAYBACK CASSETTE STUDIO DOCK        */}
          {/* ============================================================= */}
          <div className="w-full mt-4 relative z-10">
            {isRecording ? (
              // ACTIVE RECORDING BANNER
              <div className="w-full bg-gradient-to-r from-red-600/90 via-rose-600/90 to-red-700/90 backdrop-blur-md rounded-2xl p-4 border-2 border-red-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
                <div className="flex items-center gap-3 text-right">
                  <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center text-xl font-black shrink-0 animate-bounce">
                    🎙️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" />
                      <span className="text-sm font-black text-white">جارِ تسجيل صوتك الجميل الآن...</span>
                    </div>
                    <p className="text-[11px] text-red-100 font-bold mt-0.5">
                      غنِّ بصوت واضح وقريب من المايكروفون!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-yellow-300 font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-white/20">
                    ⏱️ 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 00:45
                  </span>
                  <button
                    onClick={stopRecording}
                    className="bg-white hover:bg-yellow-100 text-red-700 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg cursor-pointer active:scale-95 transition flex items-center gap-1.5"
                  >
                    <Square className="w-4 h-4 fill-red-700" />
                    <span>إيقاف وحفظ الصوت</span>
                  </button>
                </div>
              </div>
            ) : recordedAudioUrl ? (
              // RECORDED & READY TO LISTEN (The core answer to the user's question!)
              <div className="w-full bg-gradient-to-r from-emerald-600/90 via-teal-700/90 to-indigo-800/90 backdrop-blur-md rounded-2xl p-4 border-2 border-emerald-400 shadow-2xl space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-right">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-green-300 text-emerald-950 flex items-center justify-center text-2xl font-black shadow-md shrink-0">
                      🎧✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                          تم التسجيل بنجاح! 🎉
                        </span>
                        <h4 className="text-sm font-black text-white">
                          صوتك مسجل وجاهز للاستماع!
                        </h4>
                      </div>
                      <p className="text-xs text-emerald-200 font-bold mt-0.5">
                        المؤثر المطبق: <span className="text-yellow-300 font-black underline">{EFFECT_LABELS[activeVoiceEffect]}</span>
                        <span className="text-[10px] text-gray-300 mr-1.5">(غيّر المؤثر من لوحة اليمين واسمع صوتك يتغير فوراً!)</span>
                      </p>
                    </div>
                  </div>

                  {/* ACTION CONTROLS */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    {/* PLAY / PAUSE BUTTON */}
                    <button
                      onClick={handlePlayRecordedVoice}
                      className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-amber-950 font-black text-sm px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 transition border-2 border-yellow-200"
                    >
                      {isPlayingRecordedVoice ? (
                        <>
                          <Pause className="w-4 h-4 fill-amber-950" />
                          <span>إيقاف الاستماع ⏸️</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-amber-950" />
                          <span>استمع لصوتك الآن 🎧▶️</span>
                        </>
                      )}
                    </button>

                    {/* RE-RECORD */}
                    <button
                      onClick={startRecording}
                      className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-2.5 rounded-2xl border border-white/30 flex items-center gap-1 cursor-pointer transition active:scale-95"
                      title="تسجيل جديد من البداية"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>تسجيل جديد</span>
                    </button>

                    {/* DOWNLOAD AUDIO */}
                    <button
                      onClick={handleDownloadRecording}
                      className="bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-black text-xs p-2.5 rounded-2xl shadow flex items-center gap-1 cursor-pointer transition active:scale-95"
                      title="حفظ وتنزيل صوت طفلك على الجهاز"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* DELETE AUDIO */}
                    <button
                      onClick={handleDeleteRecording}
                      className="bg-rose-500/30 hover:bg-rose-600/50 text-rose-200 p-2.5 rounded-2xl border border-rose-400/30 cursor-pointer transition active:scale-95"
                      title="حذف التسجيل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* PLAYBACK WAVE VISUALIZER */}
                {isPlayingRecordedVoice && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5">
                    <span className="text-[11px] font-bold text-yellow-300 ml-2">🔊 صوتك يغني الآن:</span>
                    {Array.from({ length: 16 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [6, 16 + Math.random() * 22, 6] }}
                        transition={{ repeat: Infinity, duration: 0.25 + (i % 5) * 0.05 }}
                        className="w-1.5 rounded-full bg-gradient-to-t from-amber-400 to-yellow-200 shadow-[0_0_8px_#FBBF24]"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // IDLE PROMPT TO RECORD
              <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/30 border border-pink-400/40 flex items-center justify-center text-xl shrink-0">
                    🎙️
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">
                      هل تريد تسجيل صوتك أثناء الغناء والاستماع إليه؟ 🌟
                    </h4>
                    <p className="text-[10px] text-gray-300 font-bold">
                      اضغط على زر التسجيل أدناه أو على المايكروفون، وغنِّ، ثم استمع لصوتك مع مؤثرات مضحكة!
                    </p>
                  </div>
                </div>

                <button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-black text-xs px-5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 transition shrink-0 border border-red-300/40"
                >
                  <Mic className="w-4 h-4" />
                  <span>سجّل صوتي الآن 🔴</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Mic Error Notice if any */}
          {liveMicError && (
            <p className="text-xs font-bold text-amber-300 mt-2 bg-black/50 px-3 py-1.5 rounded-xl border border-amber-400/40">
              ⚠️ {liveMicError}
            </p>
          )}

        </div>

        {/* RIGHT / BOTTOM: FX & SONG SELECTION DASHBOARD (5 Columns) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. MAGIC VOICE MODULATOR (مغير الصوت السحري) */}
          <div className="bg-white rounded-[32px] p-5 border-4 border-purple-400 shadow-[0_8px_0_0_#9333EA] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>مغير الصوت السحري (Voice FX):</span>
              </h3>
              <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full">
                5 أصوات مضحكة
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'normal', label: 'طبيعي 🎤', desc: 'صوتك النقي' },
                { id: 'robot', label: 'روبوت 🤖', desc: 'صوت آلي ذكي' },
                { id: 'chipmunk', label: 'سنجاب 🐿️', desc: 'صوت كارتوني سريع' },
                { id: 'giant', label: 'بطل عملاق 🦁', desc: 'صوت فخم وعميق' },
                { id: 'echo', label: 'صدى القلعة 🏰', desc: 'صدى صوت سينمائي' },
              ].map((fx) => {
                const isSelected = activeVoiceEffect === fx.id;
                return (
                  <button
                    key={fx.id}
                    onClick={() => {
                      setActiveVoiceEffect(fx.id as VoiceEffect);
                      playTone(440, 0.3, fx.id as VoiceEffect);
                    }}
                    className={`p-2.5 rounded-2xl border-2 text-right transition cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-100 text-purple-950 shadow scale-105 font-black'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-black">{fx.label}</div>
                    <div className="text-[10px] text-gray-500 font-bold mt-0.5">{fx.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. FUNNY SOUND FX SOUNDBOARD */}
          <div className="bg-white rounded-[32px] p-5 border-4 border-amber-300 shadow-[0_8px_0_0_#F59E0B] space-y-3">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>مؤثرات الحفلة المرحة:</span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => playFunnyFX('horn')}
                className="p-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-2xl border-2 border-amber-300 text-center font-black text-xs cursor-pointer shadow-xs active:scale-95 transition"
              >
                <span className="text-2xl block mb-1">🎺</span>
                <span>زمور</span>
              </button>
              <button
                onClick={() => playFunnyFX('bell')}
                className="p-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 rounded-2xl border-2 border-cyan-300 text-center font-black text-xs cursor-pointer shadow-xs active:scale-95 transition"
              >
                <span className="text-2xl block mb-1">🔔</span>
                <span>جرس</span>
              </button>
              <button
                onClick={() => playFunnyFX('laser')}
                className="p-3 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-2xl border-2 border-purple-300 text-center font-black text-xs cursor-pointer shadow-xs active:scale-95 transition"
              >
                <span className="text-2xl block mb-1">⚡</span>
                <span>ليزر</span>
              </button>
              <button
                onClick={() => playFunnyFX('drum')}
                className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-2xl border-2 border-rose-300 text-center font-black text-xs cursor-pointer shadow-xs active:scale-95 transition"
              >
                <span className="text-2xl block mb-1">🥁</span>
                <span>طبلة</span>
              </button>
            </div>
          </div>

          {/* 3. SONG SELECTION PLAYLIST */}
          <div className="bg-white rounded-[32px] p-5 border-4 border-pink-400 shadow-[0_8px_0_0_#EC4899] space-y-3">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-pink-500" />
              <span>اختر نشيد الكاريوكي المفضل:</span>
            </h3>

            <div className="space-y-2 max-h-[260px] overflow-y-auto no-scrollbar pr-1">
              {KARAOKE_SONGS.map((song, idx) => {
                const isSelected = selectedSongIdx === idx;
                return (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(idx)}
                    className={`w-full p-3 rounded-2xl border-2 text-right transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 shadow-md ring-2 ring-pink-300'
                        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl select-none">{song.emoji}</span>
                      <div>
                        <h4 className="text-xs font-black text-gray-900">{song.title}</h4>
                        <span className="text-[10px] font-bold text-pink-700">{song.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isSelected && isPlayingSong && (
                        <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                      )}
                      <span className="text-xs text-gray-400">👈</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
