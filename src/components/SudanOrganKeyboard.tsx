/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Music, Play, Pause, Square, RotateCcw, Volume2, Star, Sparkles, 
  Award, Disc, CheckCircle, ChevronRight, BookOpen, Zap, Radio, Sliders
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface SudanOrganKeyboardProps {
  addStars: (amount: number) => void;
}

// Key definition
export interface PianoKey {
  note: string; // e.g., 'C4', 'C#4'
  freq: number;
  arabicName: string; // e.g., 'دو'
  solfege: string; // e.g., 'Do'
  isBlack: boolean;
  keyboardKey: string; // Keyboard shortcut
  isPentatonic: boolean; // Part of traditional Sudanese Pentatonic Scale (Do, Re, Mi, Sol, La)
}

export type InstrumentType = 'organ' | 'piano' | 'tanbour' | 'marimba' | 'flute';

interface SongNote {
  note: string;
  durationMs: number;
  lyric?: string;
}

interface Song {
  id: string;
  title: string;
  badge: string;
  emoji: string;
  description: string;
  isSudanesePentatonic: boolean;
  notes: SongNote[];
}

// 17 keys covering C4 to E5
export const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', freq: 261.63, arabicName: 'دو', solfege: 'Do', isBlack: false, keyboardKey: 'A', isPentatonic: true },
  { note: 'C#4', freq: 277.18, arabicName: 'دو#', solfege: 'Do#', isBlack: true, keyboardKey: 'W', isPentatonic: false },
  { note: 'D4', freq: 293.66, arabicName: 'ري', solfege: 'Re', isBlack: false, keyboardKey: 'S', isPentatonic: true },
  { note: 'D#4', freq: 311.13, arabicName: 'ري#', solfege: 'Re#', isBlack: true, keyboardKey: 'E', isPentatonic: false },
  { note: 'E4', freq: 329.63, arabicName: 'مي', solfege: 'Mi', isBlack: false, keyboardKey: 'D', isPentatonic: true },
  { note: 'F4', freq: 349.23, arabicName: 'فا', solfege: 'Fa', isBlack: false, keyboardKey: 'F', isPentatonic: false },
  { note: 'F#4', freq: 369.99, arabicName: 'فا#', solfege: 'Fa#', isBlack: true, keyboardKey: 'T', isPentatonic: false },
  { note: 'G4', freq: 392.00, arabicName: 'صول', solfege: 'Sol', isBlack: false, keyboardKey: 'G', isPentatonic: true },
  { note: 'G#4', freq: 415.30, arabicName: 'صول#', solfege: 'Sol#', isBlack: true, keyboardKey: 'Y', isPentatonic: false },
  { note: 'A4', freq: 440.00, arabicName: 'لا', solfege: 'La', isBlack: false, keyboardKey: 'H', isPentatonic: true },
  { note: 'A#4', freq: 466.16, arabicName: 'لا#', solfege: 'La#', isBlack: true, keyboardKey: 'U', isPentatonic: false },
  { note: 'B4', freq: 493.88, arabicName: 'سي', solfege: 'Si', isBlack: false, keyboardKey: 'J', isPentatonic: false },
  { note: 'C5', freq: 523.25, arabicName: 'دو 2', solfege: 'Do²', isBlack: false, keyboardKey: 'K', isPentatonic: true },
  { note: 'C#5', freq: 554.37, arabicName: 'دو# 2', solfege: 'Do#²', isBlack: true, keyboardKey: 'O', isPentatonic: false },
  { note: 'D5', freq: 587.33, arabicName: 'ري 2', solfege: 'Re²', isBlack: false, keyboardKey: 'L', isPentatonic: true },
  { note: 'D#5', freq: 622.25, arabicName: 'ري# 2', solfege: 'Re#²', isBlack: true, keyboardKey: 'P', isPentatonic: false },
  { note: 'E5', freq: 659.25, arabicName: 'مي 2', solfege: 'Mi²', isBlack: false, keyboardKey: ';', isPentatonic: true },
];

export const SONGS_LIBRARY: Song[] = [
  {
    id: 'ana_sudani',
    title: 'أنا سوداني أنا 🇸🇩',
    badge: 'تراث سوداني خماسي',
    emoji: '🇸🇩',
    description: 'النشيد الوطني والتراثي الخالد بالسلم الخماسي الأصيل',
    isSudanesePentatonic: true,
    notes: [
      { note: 'C4', durationMs: 400, lyric: 'كل' },
      { note: 'C4', durationMs: 400, lyric: 'أجـ' },
      { note: 'D4', durationMs: 450, lyric: 'ـزائـ' },
      { note: 'E4', durationMs: 500, lyric: 'ـه' },
      { note: 'E4', durationMs: 400, lyric: 'لـ' },
      { note: 'E4', durationMs: 500, lyric: 'ـنا' },
      { note: 'D4', durationMs: 450, lyric: 'أنـا' },
      { note: 'C4', durationMs: 400, lyric: 'سو' },
      { note: 'D4', durationMs: 450, lyric: 'دا' },
      { note: 'E4', durationMs: 650, lyric: 'ني' },
      { note: 'G4', durationMs: 500, lyric: 'أ' },
      { note: 'G4', durationMs: 650, lyric: 'نا!' },
      { note: 'E4', durationMs: 450, lyric: 'في' },
      { note: 'D4', durationMs: 450, lyric: 'العـ' },
      { note: 'C4', durationMs: 700, lyric: 'ـلا!' },
    ]
  },
  {
    id: 'twinkle',
    title: 'توينكل توينكل يا نجمتي 🌟',
    badge: 'أغنية عالمية للأطفال',
    emoji: '🌟',
    description: 'نغمة النجمة الذهبية الساحرة وسهلة العزف للأطفال',
    isSudanesePentatonic: false,
    notes: [
      { note: 'C4', durationMs: 450, lyric: 'توينـ' },
      { note: 'C4', durationMs: 450, lyric: 'ـكل' },
      { note: 'G4', durationMs: 450, lyric: 'توينـ' },
      { note: 'G4', durationMs: 450, lyric: 'ـكل' },
      { note: 'A4', durationMs: 450, lyric: 'يا' },
      { note: 'A4', durationMs: 450, lyric: 'صـ' },
      { note: 'G4', durationMs: 700, lyric: 'ـغار' },
      { note: 'F4', durationMs: 450, lyric: 'تلـ' },
      { note: 'F4', durationMs: 450, lyric: 'ـمع' },
      { note: 'E4', durationMs: 450, lyric: 'في' },
      { note: 'E4', durationMs: 450, lyric: 'ضوء' },
      { note: 'D4', durationMs: 450, lyric: 'النـ' },
      { note: 'D4', durationMs: 450, lyric: 'ـها' },
      { note: 'C4', durationMs: 800, lyric: 'ر' },
    ]
  },
  {
    id: 'ya_biladi',
    title: 'يا بلادي يا بلد الحبايب 🌾',
    badge: 'نغم سوداني عذب',
    emoji: '🌾',
    description: 'لحن شجي مفعم برائحة الوطن وطيبة أهل السودان',
    isSudanesePentatonic: true,
    notes: [
      { note: 'C4', durationMs: 400, lyric: 'يا' },
      { note: 'D4', durationMs: 450, lyric: 'بـ' },
      { note: 'E4', durationMs: 500, lyric: 'ـلا' },
      { note: 'G4', durationMs: 650, lyric: 'دي' },
      { note: 'A4', durationMs: 500, lyric: 'يا' },
      { note: 'G4', durationMs: 500, lyric: 'بلـ' },
      { note: 'E4', durationMs: 650, lyric: 'ـد' },
      { note: 'D4', durationMs: 450, lyric: 'الحـ' },
      { note: 'C4', durationMs: 500, lyric: 'ـبا' },
      { note: 'D4', durationMs: 700, lyric: 'يب' },
    ]
  },
  {
    id: 'happy_train',
    title: 'قطار الحروف السعيد 🚂',
    badge: 'لحن مرح للتعلم',
    emoji: '🚂',
    description: 'لحن حماسي سريع يشجع الأطفال على النشاط والعزف',
    isSudanesePentatonic: true,
    notes: [
      { note: 'C4', durationMs: 300, lyric: 'توت' },
      { note: 'E4', durationMs: 300, lyric: 'توت' },
      { note: 'G4', durationMs: 400, lyric: 'يمـ' },
      { note: 'C5', durationMs: 500, lyric: 'ـشي' },
      { note: 'G4', durationMs: 350, lyric: 'القـ' },
      { note: 'E4', durationMs: 350, lyric: 'ـطا' },
      { note: 'C4', durationMs: 600, lyric: 'ر!' },
    ]
  }
];

export default function SudanOrganKeyboard({ addStars }: SudanOrganKeyboardProps) {
  const { speak } = useSpeech();

  // Audio Context & Active Nodes
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<Map<string, { oscList: OscillatorNode[]; gainNode: GainNode }>>(new Map());

  // Component States
  const [instrument, setInstrument] = useState<InstrumentType>('organ');
  const [highlightPentatonic, setHighlightPentatonic] = useState<boolean>(true);
  const [showKeyLabels, setShowKeyLabels] = useState<boolean>(true);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [noteVisuals, setNoteVisuals] = useState<{ id: number; note: string; emoji: string; x: number }[]>([]);
  
  // Guided Song Player States
  const [selectedSong, setSelectedSong] = useState<Song>(SONGS_LIBRARY[0]);
  const [isSongPlaying, setIsSongPlaying] = useState<boolean>(false);
  const [learnMode, setLearnMode] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [songFeedback, setSongFeedback] = useState<string>('اختر لحناً أو اعزف بحرية على مفاتيح الأورغن!');

  // Recording Studio States
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedNotes, setRecordedNotes] = useState<{ note: string; time: number }[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const [isPlayingRecording, setIsPlayingRecording] = useState<boolean>(false);
  const [savedRecordingsCount, setSavedRecordingsCount] = useState<number>(0);

  // Initialize Web Audio Context
  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
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
  }, []);

  // Floating note animation helper
  const spawnNoteVisual = (note: string) => {
    const emojis = ['🎵', '🎶', '🎼', '✨', '⭐', '💫', '🪘'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const keyIndex = PIANO_KEYS.findIndex(k => k.note === note);
    const xPos = keyIndex >= 0 ? (keyIndex / PIANO_KEYS.length) * 100 : 50;

    const newVisual = {
      id: Date.now() + Math.random(),
      note,
      emoji: randomEmoji,
      x: Math.max(5, Math.min(95, xPos + (Math.random() * 6 - 3)))
    };

    setNoteVisuals(prev => [...prev.slice(-15), newVisual]);
    setTimeout(() => {
      setNoteVisuals(prev => prev.filter(v => v.id !== newVisual.id));
    }, 1200);
  };

  // Sound Synthesizer Engine
  const startNote = useCallback((noteId: string) => {
    const keyData = PIANO_KEYS.find(k => k.note === noteId);
    if (!keyData) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    // If note is already sounding, stop it first to prevent stuck notes
    if (activeNodesRef.current.has(noteId)) {
      stopNote(noteId);
    }

    try {
      const freq = keyData.freq;
      const now = ctx.currentTime;
      const oscList: OscillatorNode[] = [];
      const gainNode = ctx.createGain();

      if (instrument === 'organ') {
        // Electronic Organ (Multi-oscillator with rich harmonics & vibrato LFO)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now); // 1st overtone

        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(freq * 3, now); // 2nd overtone

        // Subtle Organ Vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, now); // 5.5 Hz vibrato
        lfoGain.gain.setValueAtTime(2.2, now);
        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);
        lfo.start(now);

        const subGain1 = ctx.createGain();
        const subGain2 = ctx.createGain();
        const subGain3 = ctx.createGain();

        subGain1.gain.setValueAtTime(0.25, now);
        subGain2.gain.setValueAtTime(0.15, now);
        subGain3.gain.setValueAtTime(0.08, now);

        osc1.connect(subGain1);
        osc2.connect(subGain2);
        osc3.connect(subGain3);

        subGain1.connect(gainNode);
        subGain2.connect(gainNode);
        subGain3.connect(gainNode);

        // Organ Envelope: Quick attack, full sustain
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.03);

        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        oscList.push(osc1, osc2, osc3, lfo);

      } else if (instrument === 'piano') {
        // Kids Piano (Acoustic decay)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        const subGain1 = ctx.createGain();
        const subGain2 = ctx.createGain();
        subGain1.gain.setValueAtTime(0.3, now);
        subGain2.gain.setValueAtTime(0.12, now);

        osc1.connect(subGain1);
        osc2.connect(subGain2);
        subGain1.connect(gainNode);
        subGain2.connect(gainNode);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.45, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc1.start(now);
        osc2.start(now);
        oscList.push(osc1, osc2);

      } else if (instrument === 'tanbour') {
        // Sudanese Tanbour (Plucked string with bandpass resonator)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, now);
        filter.Q.setValueAtTime(3.5, now);

        osc.connect(filter);
        filter.connect(gainNode);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.start(now);
        oscList.push(osc);

      } else if (instrument === 'marimba') {
        // Marimba / Wooden Chime
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gainNode);
        osc.start(now);
        oscList.push(osc);

      } else {
        // Flute / Mazmar
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(6.0, now);
        lfoGain.gain.setValueAtTime(4.0, now);
        lfo.connect(osc.frequency);
        lfo.start(now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.08);

        osc.connect(gainNode);
        osc.start(now);
        oscList.push(osc, lfo);
      }

      gainNode.connect(ctx.destination);
      activeNodesRef.current.set(noteId, { oscList, gainNode });

      setActiveNotes(prev => new Set(prev).add(noteId));
      spawnNoteVisual(noteId);

      // Record note if recording session is running
      if (isRecording) {
        const offsetMs = Date.now() - recordingStartTimeRef.current;
        setRecordedNotes(prev => [...prev, { note: noteId, time: offsetMs }]);
      }

    } catch (e) {
      console.error("Audio playback error:", e);
    }
  }, [getAudioContext, instrument, isRecording]);

  const stopNote = useCallback((noteId: string) => {
    const nodeData = activeNodesRef.current.get(noteId);
    if (!nodeData) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Gentle release envelope to prevent click/pop
      nodeData.gainNode.gain.cancelScheduledValues(now);
      nodeData.gainNode.gain.setValueAtTime(nodeData.gainNode.gain.value, now);
      nodeData.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.15);

      setTimeout(() => {
        nodeData.oscList.forEach(osc => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (err) {}
        });
        nodeData.gainNode.disconnect();
        activeNodesRef.current.delete(noteId);
      }, 160);

    } catch (e) {
      activeNodesRef.current.delete(noteId);
    }

    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(noteId);
      return next;
    });
  }, [getAudioContext]);

  // Clean up all active sounds when unmounting
  useEffect(() => {
    return () => {
      activeNodesRef.current.forEach(({ oscList, gainNode }) => {
        try {
          oscList.forEach(o => o.stop());
          gainNode.disconnect();
        } catch (e) {}
      });
      activeNodesRef.current.clear();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Desktop Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const pressedChar = e.key.toUpperCase();
      const matchedKey = PIANO_KEYS.find(k => k.keyboardKey === pressedChar);
      if (matchedKey) {
        startNote(matchedKey.note);
        if (learnMode) {
          handleLearnStep(matchedKey.note);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const pressedChar = e.key.toUpperCase();
      const matchedKey = PIANO_KEYS.find(k => k.keyboardKey === pressedChar);
      if (matchedKey) {
        stopNote(matchedKey.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startNote, stopNote, learnMode]);

  // Handle Learn Mode User Press
  const handleLearnStep = (pressedNote: string) => {
    const targetNote = selectedSong.notes[currentStepIndex]?.note;
    if (pressedNote === targetNote) {
      // Step matched!
      const nextIndex = currentStepIndex + 1;
      if (nextIndex >= selectedSong.notes.length) {
        // Song completed!
        addStars(25);
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setSongFeedback(`رائع ومبدع يا بطل! 🎉 عزفت أغنية "${selectedSong.title}" كاملة وكسبت 25 نجمة ذهبية! ⭐🇸🇩`);
        setCurrentStepIndex(0);
        setLearnMode(false);
      } else {
        setCurrentStepIndex(nextIndex);
        const currentLyric = selectedSong.notes[nextIndex].lyric || '';
        setSongFeedback(`أحسنت! النغمة التالية: ${selectedSong.notes[nextIndex].note} (${currentLyric}) ✨`);
      }
    } else {
      setSongFeedback(`حاول مرة أخرى! اضغط على المفتاح الذهبي المضيء: ${targetNote} 🎶`);
    }
  };

  // Play Full Song Demo Automatically
  const playSongDemo = async () => {
    if (isSongPlaying) return;
    setIsSongPlaying(true);
    setLearnMode(false);
    setSongFeedback(`استمع إلى لحن: ${selectedSong.title} 🎶`);

    for (let i = 0; i < selectedSong.notes.length; i++) {
      const item = selectedSong.notes[i];
      startNote(item.note);
      await new Promise(r => setTimeout(r, Math.min(item.durationMs, 500)));
      stopNote(item.note);
      await new Promise(r => setTimeout(r, 60));
    }

    setIsSongPlaying(false);
    setSongFeedback(`انتهى العرض! الآن يمكنك تشغيل "تعلم العزف" لتلعب اللحن بنفسك! 🎹✨`);
  };

  // Start Learn Mode
  const startLearnMode = () => {
    setLearnMode(true);
    setIsSongPlaying(false);
    setCurrentStepIndex(0);
    const firstNote = selectedSong.notes[0];
    setSongFeedback(`اضغط على المفتاح المضيء [${firstNote.note}] لتبدأ عزف: ${selectedSong.title} 🎵`);
  };

  // Recording Studio Controls
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      setSavedRecordingsCount(prev => prev + 1);
      addStars(10);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      setSongFeedback(`تم حفظ عزفك الجميل! كسبت 10 نجوم تأليف موسيقي! ⭐ اضغط "استمع لعزفي" للاستماع!`);
    } else {
      // Start recording
      setRecordedNotes([]);
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setSongFeedback('🔴 جاري التسجيل الآن... اعزف أحلى الألحان بأناملك الذكية!');
    }
  };

  const playMyRecording = async () => {
    if (isPlayingRecording || recordedNotes.length === 0) return;
    setIsPlayingRecording(true);
    setSongFeedback('▶️ جاري تشغيل عزفك المسجل... استمتع بموسيقاك الخاصة!');

    const baseTime = recordedNotes[0].time;
    for (let i = 0; i < recordedNotes.length; i++) {
      const cur = recordedNotes[i];
      const next = recordedNotes[i + 1];
      const waitDuration = next ? next.time - cur.time : 350;

      startNote(cur.note);
      await new Promise(r => setTimeout(r, Math.min(waitDuration, 400)));
      stopNote(cur.note);
      if (next) {
        const gap = Math.max(20, waitDuration - 400);
        await new Promise(r => setTimeout(r, gap));
      }
    }

    setIsPlayingRecording(false);
    setSongFeedback('ما أروع موسيقاك! استمر في الإبداع والعزف يا فنان! 🌟');
  };

  // Target note in learn mode
  const targetLearnNote = learnMode ? selectedSong.notes[currentStepIndex]?.note : null;

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-[32px] p-4 sm:p-7 border-4 border-[#6C5CE7] shadow-[0_12px_0_0_#4A3CB5] max-w-5xl mx-auto select-none overflow-hidden relative" id="kids-organ-studio">
      
      {/* Visual Floating Musical Notes Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {noteVisuals.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: '80%', x: `${item.x}%`, scale: 0.5 }}
              animate={{ opacity: 0, y: '10%', scale: 1.6, rotate: Math.random() * 40 - 20 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              className="absolute text-2xl sm:text-3xl text-yellow-300 font-bold drop-shadow-[0_2px_8px_rgba(255,215,0,0.8)]"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pb-4 mb-5 border-b-2 border-indigo-700/60 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl animate-bounce">🎹</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 flex items-center gap-2">
                <span>أورغن الأنغام والموسيقى للأطفال</span>
                <span className="bg-gradient-to-r from-red-600 via-green-600 to-black text-[10px] sm:text-xs text-white px-2.5 py-0.5 rounded-full border border-yellow-400 font-bold">
                  السلم الخماسي 🇸🇩
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-indigo-200 mt-0.5">
                اعزف ألحانك المفضلة، تعلم النوتات الموسيقية، واكتشف سحر الموسيقى السودانية الأصيلة! ✨
              </p>
            </div>
          </div>
        </div>

        {/* Sudanese Pentatonic Toggle */}
        <div className="flex items-center gap-2 bg-indigo-950/80 p-2 rounded-2xl border border-indigo-600">
          <button
            onClick={() => {
              setHighlightPentatonic(!highlightPentatonic);
              speak(highlightPentatonic ? "تم إيقاف تمييز السلم الخماسي" : "تم تمييز مفاتيح السلم الخماسي السوداني الأصيل!");
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              highlightPentatonic 
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-indigo-950 shadow-[0_3px_0_0_#B8860B]' 
                : 'bg-indigo-800/80 text-indigo-300 hover:bg-indigo-700'
            }`}
          >
            <span>🇸🇩</span>
            <span>تمييز السلم الخماسي</span>
            {highlightPentatonic && <Sparkles className="w-3.5 h-3.5 text-indigo-950" />}
          </button>

          <button
            onClick={() => setShowKeyLabels(!showKeyLabels)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-800/80 text-indigo-300 hover:bg-indigo-700 cursor-pointer"
            title="إظهار أو إخفاء أسماء النغمات"
          >
            {showKeyLabels ? 'إخفاء الحروف' : 'إظهار الحروف'}
          </button>
        </div>
      </div>

      {/* Instrument Sound Timbre Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-700/50">
        <div className="flex items-center gap-2 text-xs font-black text-indigo-200">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>اختر صوت الآلة:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: 'organ', name: 'أورغن كهربائي 🎹' },
              { id: 'piano', name: 'بيانو الأطفال 🎼' },
              { id: 'tanbour', name: 'طنبور سوداني 🇸🇩' },
              { id: 'marimba', name: 'ماريمبا خشبية 🔔' },
              { id: 'flute', name: 'مزمار / فلوت 🪈' }
            ] as const
          ).map(item => (
            <button
              key={item.id}
              onClick={() => setInstrument(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                instrument === item.id
                  ? 'bg-[#FF8E3C] text-white shadow-[0_3px_0_0_#CC7130] scale-105'
                  : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Song Learning Studio & Recording Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        
        {/* Songs Selector & Player (2 Cols) */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-indigo-950/80 border border-indigo-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>مكتبة الألحان والأغاني التعليمية:</span>
              </span>
              <span className="text-[11px] font-bold text-indigo-300">
                {selectedSong.badge}
              </span>
            </div>

            {/* Song Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {SONGS_LIBRARY.map(song => (
                <button
                  key={song.id}
                  onClick={() => {
                    setSelectedSong(song);
                    setCurrentStepIndex(0);
                    setLearnMode(false);
                    setSongFeedback(`تم اختيار أغنية: ${song.title}`);
                  }}
                  className={`p-2 rounded-xl text-right transition-all cursor-pointer text-xs font-black border ${
                    selectedSong.id === song.id
                      ? 'bg-amber-400 text-indigo-950 border-yellow-300 shadow-sm'
                      : 'bg-indigo-900/80 text-indigo-200 border-indigo-700/70 hover:bg-indigo-800'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <span>{song.emoji}</span>
                    <span className="truncate">{song.title}</span>
                  </div>
                  {song.isSudanesePentatonic && (
                    <span className="text-[9px] bg-red-700/80 text-white px-1.5 py-0.2 rounded font-normal inline-block">
                      خماسي 🇸🇩
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Song Controls & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-indigo-800/80">
            <div className="flex items-center gap-2">
              <button
                onClick={playSongDemo}
                disabled={isSongPlaying}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[0_3px_0_0_#1E824C] disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>استمع للعزف 🎧</span>
              </button>

              <button
                onClick={startLearnMode}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  learnMode
                    ? 'bg-amber-400 text-indigo-950 shadow-[0_3px_0_0_#B8860B] animate-pulse'
                    : 'bg-indigo-700 hover:bg-indigo-600 text-white shadow-[0_3px_0_0_#3944BC]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{learnMode ? 'جاري التعلم (اضغط المفتاح المضيء) 🎯' : 'تعلم العزف خطوة بخطوة 🎯'}</span>
              </button>
            </div>

            {learnMode && (
              <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                <span>الخطوة: {currentStepIndex + 1} / {selectedSong.notes.length}</span>
                <span className="bg-yellow-400 text-indigo-950 px-2 py-0.5 rounded-full font-black">
                  {selectedSong.notes[currentStepIndex]?.note}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recording Studio Panel (1 Col) */}
        <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-600 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-rose-400" />
                <span>استديو تسجيل نغماتي:</span>
              </span>
              <span className="text-[10px] font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800">
                تسجيلاتك: {savedRecordingsCount}
              </span>
            </div>
            <p className="text-[11px] text-indigo-200 mb-3 leading-relaxed">
              سجل مقطوعتك الموسيقية الخاصة واستمع إليها في أي وقت وكأنك في استديو حقيقي! 🎙️
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-indigo-800/80">
            <button
              onClick={toggleRecording}
              className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-[0_3px_0_0_#9E1C1C]'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_3px_0_0_#B83232]'
              }`}
            >
              {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />}
              <span>{isRecording ? 'إيقاف وحفظ ⏹️' : 'تسجيل نغمتي 🔴'}</span>
            </button>

            <button
              onClick={playMyRecording}
              disabled={isPlayingRecording || recordedNotes.length === 0}
              className="flex-1 py-2 rounded-xl text-xs font-black bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_3px_0_0_#2B78E4] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>استمع لعزفي ▶️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Instruction & Status Bar */}
      <div className="mb-4 p-3 rounded-2xl bg-indigo-950/90 border-2 border-amber-400/60 flex items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl shrink-0">🎶</span>
          <span className="text-xs sm:text-sm font-black text-amber-300 truncate">
            {songFeedback}
          </span>
        </div>

        {highlightPentatonic && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-black text-yellow-300 bg-yellow-950/60 px-2.5 py-1 rounded-xl border border-yellow-500/50 shrink-0">
            <span>⭐ المفاتيح الذهبية:</span>
            <span>سلم السودان الخماسي (دو، ري، مي، صول، لا)</span>
          </div>
        )}
      </div>

      {/* Piano Keyboard Wrapper */}
      <div className="bg-slate-950 p-4 sm:p-6 rounded-[26px] border-4 border-slate-800 shadow-[inset_0_8px_16px_rgba(0,0,0,0.8)] overflow-x-auto">
        <div className="relative flex justify-center min-w-[650px] sm:min-w-[760px] pb-2 pt-1 px-2 mx-auto">
          
          {/* White Keys */}
          <div className="flex w-full justify-center">
            {PIANO_KEYS.filter(k => !k.isBlack).map((key) => {
              const isActive = activeNotes.has(key.note);
              const isTargetInLearn = targetLearnNote === key.note;
              const isPenta = highlightPentatonic && key.isPentatonic;

              return (
                <button
                  key={key.note}
                  onMouseDown={() => {
                    startNote(key.note);
                    if (learnMode) handleLearnStep(key.note);
                  }}
                  onMouseUp={() => stopNote(key.note)}
                  onMouseLeave={() => stopNote(key.note)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startNote(key.note);
                    if (learnMode) handleLearnStep(key.note);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    stopNote(key.note);
                  }}
                  className={`relative flex-1 h-56 sm:h-64 rounded-b-2xl border-2 border-slate-400 transition-all flex flex-col justify-end pb-3 items-center cursor-pointer select-none ${
                    isActive
                      ? 'bg-amber-300 translate-y-1 shadow-inner border-amber-500'
                      : isTargetInLearn
                      ? 'bg-yellow-200 border-amber-500 ring-4 ring-yellow-400 animate-pulse'
                      : isPenta
                      ? 'bg-gradient-to-b from-amber-50 via-yellow-100 to-amber-200 border-amber-300 shadow-[0_5px_0_0_#D4AF37]'
                      : 'bg-gradient-to-b from-slate-100 via-white to-slate-200 hover:bg-slate-50 shadow-[0_5px_0_0_#94A3B8]'
                  }`}
                >
                  {/* Pentatonic Indicator Star */}
                  {isPenta && (
                    <div className="absolute top-2 w-5 h-5 rounded-full bg-amber-400/90 text-[10px] font-black text-indigo-950 flex items-center justify-center shadow-xs">
                      ⭐
                    </div>
                  )}

                  {/* Target Guide Arrow in Learn Mode */}
                  {isTargetInLearn && (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="absolute top-8 bg-amber-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md"
                    >
                      اضغطني! 👇
                    </motion.div>
                  )}

                  {/* Note Labels */}
                  {showKeyLabels && (
                    <div className="text-center pointer-events-none">
                      <span className="block text-xs sm:text-sm font-black text-slate-900 leading-none">
                        {key.arabicName}
                      </span>
                      <span className="block text-[10px] font-bold text-slate-500 mt-0.5">
                        {key.solfege}
                      </span>
                      <span className="block text-[9px] font-mono font-black text-indigo-900 bg-indigo-100/80 px-1 rounded mt-1">
                        {key.keyboardKey}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Black Keys Overlay */}
          <div className="absolute top-1 left-0 right-0 flex justify-center pointer-events-none px-2">
            <div className="flex w-full justify-center relative">
              {PIANO_KEYS.map((key, index) => {
                if (!key.isBlack) return null;

                const isActive = activeNotes.has(key.note);
                const isTargetInLearn = targetLearnNote === key.note;
                
                // Calculate position relative to white keys
                const whiteKeysBefore = PIANO_KEYS.slice(0, index).filter(k => !k.isBlack).length;
                const totalWhiteKeys = PIANO_KEYS.filter(k => !k.isBlack).length;
                const leftPercent = ((whiteKeysBefore - 0.5) / totalWhiteKeys) * 100;

                return (
                  <button
                    key={key.note}
                    style={{ left: `${leftPercent}%` }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      startNote(key.note);
                      if (learnMode) handleLearnStep(key.note);
                    }}
                    onMouseUp={(e) => {
                      e.stopPropagation();
                      stopNote(key.note);
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      stopNote(key.note);
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startNote(key.note);
                      if (learnMode) handleLearnStep(key.note);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      stopNote(key.note);
                    }}
                    className={`absolute pointer-events-auto w-7 sm:w-10 h-32 sm:h-38 rounded-b-xl transition-all -ml-3.5 sm:-ml-5 flex flex-col justify-end pb-2 items-center cursor-pointer select-none z-20 ${
                      isActive
                        ? 'bg-amber-400 translate-y-1 shadow-inner'
                        : isTargetInLearn
                        ? 'bg-amber-500 ring-4 ring-yellow-400 animate-pulse'
                        : 'bg-gradient-to-b from-slate-900 via-slate-800 to-black hover:bg-slate-700 shadow-[0_4px_0_0_#0F172A]'
                    }`}
                  >
                    {/* Target Arrow in Learn Mode */}
                    {isTargetInLearn && (
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6 }}
                        className="absolute top-2 bg-yellow-400 text-indigo-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow"
                      >
                        👇
                      </motion.div>
                    )}

                    {showKeyLabels && (
                      <div className="text-center pointer-events-none">
                        <span className="block text-[10px] font-black text-white">
                          {key.arabicName}
                        </span>
                        <span className="block text-[8px] font-mono font-bold text-amber-300">
                          {key.keyboardKey}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-indigo-300 gap-2 px-2">
        <div className="flex items-center gap-2">
          <span>⌨️ اختصارات لوحة المفاتيح:</span>
          <span className="bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700 font-mono text-amber-300">
            A, S, D, F, G, H, J, K, L, ;
          </span>
          <span>للمفاتيح البيضاء، و</span>
          <span className="bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700 font-mono text-amber-300">
            W, E, T, Y, U, O, P
          </span>
          <span>للسوداء.</span>
        </div>

        <button
          onClick={() => speak("الموسيقى السودانية غنية بألحان السلم الخماسي البهيج، ويعتبر الأورغن من الآلات الرائعة التي يحبها الكبار والصغار للعزف والابتكار!")}
          className="hover:text-amber-300 cursor-pointer flex items-center gap-1 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>استمع إلى نصيحة سمسم الموسيقية 🦉</span>
        </button>
      </div>

    </div>
  );
}
