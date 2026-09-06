/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  ArrowRight, 
  ArrowLeft,
  Trophy, 
  Play, 
  CheckCircle2, 
  Car,
  Train,
  Headphones,
  Award,
  Zap,
  Gauge
} from 'lucide-react';

interface AlphabetTrainGameProps {
  addStars: (amount: number) => void;
}

type GameMode = 'train' | 'racer' | 'phonics';

// Alphabet Stations for Train Mode
interface TrainStation {
  id: string;
  name: string;
  letters: string[];
  blankIndices: number[];
  themeColor: string;
}

const TRAIN_STATIONS: TrainStation[] = [
  { id: 'st1', name: 'محطة البداية الذهبية 🚉', letters: ['A', 'B', 'C', 'D', 'E'], blankIndices: [2], themeColor: 'from-amber-400 to-orange-500' },
  { id: 'st2', name: 'محطة أبطال الحروف 🚂', letters: ['C', 'D', 'E', 'F', 'G'], blankIndices: [1, 3], themeColor: 'from-blue-400 to-indigo-600' },
  { id: 'st3', name: 'محطة حديقة النجوم 🌟', letters: ['G', 'H', 'I', 'J', 'K'], blankIndices: [2], themeColor: 'from-emerald-400 to-teal-600' },
  { id: 'st4', name: 'محطة المغامرات السريعة ⚡', letters: ['L', 'M', 'N', 'O', 'P'], blankIndices: [1, 3], themeColor: 'from-purple-400 to-pink-600' },
  { id: 'st5', name: 'محطة قوس قزح الساحرة 🌈', letters: ['P', 'Q', 'R', 'S', 'T'], blankIndices: [2, 4], themeColor: 'from-rose-400 to-red-500' },
  { id: 'st6', name: 'محطة خط النهاية الأسطوري 🏆', letters: ['V', 'W', 'X', 'Y', 'Z'], blankIndices: [1, 3], themeColor: 'from-cyan-400 to-blue-600' }
];

// Phonics Database
const PHONICS_DATA: Record<string, { word: string; phonics: string; emoji: string }> = {
  A: { word: 'Apple', phonics: '/æ/ as in Apple', emoji: '🍎' },
  B: { word: 'Bear', phonics: '/b/ as in Bear', emoji: '🐻' },
  C: { word: 'Car', phonics: '/k/ as in Car', emoji: '🚗' },
  D: { word: 'Duck', phonics: '/d/ as in Duck', emoji: '🦆' },
  E: { word: 'Elephant', phonics: '/e/ as in Elephant', emoji: '🐘' },
  F: { word: 'Fish', phonics: '/f/ as in Fish', emoji: '🐟' },
  G: { word: 'Giraffe', phonics: '/dʒ/ as in Giraffe', emoji: '🦒' },
  H: { word: 'Horse', phonics: '/h/ as in Horse', emoji: '🐴' },
  I: { word: 'Ice cream', phonics: '/aɪ/ as in Ice cream', emoji: '🍦' },
  J: { word: 'Jellyfish', phonics: '/dʒ/ as in Jellyfish', emoji: '🪼' },
  K: { word: 'Kite', phonics: '/k/ as in Kite', emoji: '🪁' },
  L: { word: 'Lion', phonics: '/l/ as in Lion', emoji: '🦁' },
  M: { word: 'Monkey', phonics: '/m/ as in Monkey', emoji: '🐒' },
  N: { word: 'Nest', phonics: '/n/ as in Nest', emoji: '🪺' },
  O: { word: 'Orange', phonics: '/ɒ/ as in Orange', emoji: '🍊' },
  P: { word: 'Penguin', phonics: '/p/ as in Penguin', emoji: '🐧' },
  Q: { word: 'Queen', phonics: '/kw/ as in Queen', emoji: '👑' },
  R: { word: 'Rocket', phonics: '/r/ as in Rocket', emoji: '🚀' },
  S: { word: 'Sun', phonics: '/s/ as in Sun', emoji: '☀️' },
  T: { word: 'Tiger', phonics: '/t/ as in Tiger', emoji: '🐯' },
  U: { word: 'Umbrella', phonics: '/ʌ/ as in Umbrella', emoji: '☂️' },
  V: { word: 'Violin', phonics: '/v/ as in Violin', emoji: '🎻' },
  W: { word: 'Whale', phonics: '/w/ as in Whale', emoji: '🐋' },
  X: { word: 'Xylophone', phonics: '/z/ as in Xylophone', emoji: '🪘' },
  Y: { word: 'Yo-yo', phonics: '/j/ as in Yo-yo', emoji: '🪀' },
  Z: { word: 'Zebra', phonics: '/z/ as in Zebra', emoji: '🦓' }
};

// Word Racer Spelling Challenges
interface RacerWord {
  word: string;
  emoji: string;
  hintAr: string;
  letters: string[];
}

const RACER_WORDS: RacerWord[] = [
  { word: 'CAR', emoji: '🏎️', hintAr: 'سيارة سريعة', letters: ['C', 'A', 'R'] },
  { word: 'SUN', emoji: '☀️', hintAr: 'شمس مشرقة', letters: ['S', 'U', 'N'] },
  { word: 'CAT', emoji: '🐱', hintAr: 'قطة لطيفة', letters: ['C', 'A', 'T'] },
  { word: 'LION', emoji: '🦁', hintAr: 'ملك الغابة', letters: ['L', 'I', 'O', 'N'] },
  { word: 'STAR', emoji: '⭐', hintAr: 'نجمة مضيئة', letters: ['S', 'T', 'A', 'R'] },
  { word: 'FISH', emoji: '🐟', hintAr: 'سمكة ملونة', letters: ['F', 'I', 'S', 'H'] },
  { word: 'TRAIN', emoji: '🚂', hintAr: 'قطار سريع', letters: ['T', 'R', 'A', 'I', 'N'] },
  { word: 'ZEBRA', emoji: '🦓', hintAr: 'حمار وحشي مخطط', letters: ['Z', 'E', 'B', 'R', 'A'] }
];

export default function AlphabetTrainGame({ addStars }: AlphabetTrainGameProps) {
  const [activeMode, setActiveMode] = useState<GameMode>('train');

  // Audio synthesis helper
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playWhistleSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Dual tone steam whistle (frequencies 480Hz & 600Hz)
      [480, 600].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      });
    } catch (e) {}
  };

  const playEngineRevSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // =========================================================================
  // 1. TRAIN MODE STATE & LOGIC
  // =========================================================================
  const [stationIdx, setStationIdx] = useState(0);
  const currentStation = TRAIN_STATIONS[stationIdx];
  const [userTrainWagons, setUserTrainWagons] = useState<(string | null)[]>([]);
  const [availableWagonOptions, setAvailableWagonOptions] = useState<string[]>([]);
  const [isTrainMoving, setIsTrainMoving] = useState(false);
  const [trainComplete, setTrainComplete] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // Initialize Station
  const initStation = (idx: number) => {
    const station = TRAIN_STATIONS[idx];
    const initialWagons = station.letters.map((letter, i) => 
      station.blankIndices.includes(i) ? null : letter
    );
    setUserTrainWagons(initialWagons);

    // Collect correct missing letters
    const missingLetters = station.blankIndices.map(i => station.letters[i]);
    
    // Pick 2 random distractor letters
    const allAlphabet = Object.keys(PHONICS_DATA);
    const distractors: string[] = [];
    while (distractors.length < 2) {
      const rand = allAlphabet[Math.floor(Math.random() * allAlphabet.length)];
      if (!station.letters.includes(rand) && !distractors.includes(rand)) {
        distractors.push(rand);
      }
    }

    const options = [...missingLetters, ...distractors].sort(() => Math.random() - 0.5);
    setAvailableWagonOptions(options);
    setIsTrainMoving(false);
    setTrainComplete(false);

    // Default select first blank slot
    const firstBlank = station.blankIndices[0];
    setSelectedSlotIndex(firstBlank ?? null);
  };

  useEffect(() => {
    if (activeMode === 'train') {
      initStation(stationIdx);
    }
  }, [stationIdx, activeMode]);

  // Handle clicking an option wagon
  const handleSelectWagonLetter = (letter: string) => {
    if (trainComplete || isTrainMoving) return;
    
    // Find target slot: either selectedSlotIndex or first empty slot
    let targetIndex = selectedSlotIndex;
    if (targetIndex === null || userTrainWagons[targetIndex] !== null) {
      targetIndex = userTrainWagons.findIndex((w, i) => currentStation.blankIndices.includes(i) && w === null);
    }
    if (targetIndex === -1 || targetIndex === null) return;

    // Check if letter matches the correct station letter at targetIndex
    const expectedLetter = currentStation.letters[targetIndex];
    speakWord(`${letter}! ${PHONICS_DATA[letter]?.word || ''}`);

    if (letter === expectedLetter) {
      const updated = [...userTrainWagons];
      updated[targetIndex] = letter;
      setUserTrainWagons(updated);

      // Remove from available options
      setAvailableWagonOptions(prev => {
        const idx = prev.indexOf(letter);
        if (idx !== -1) {
          const clone = [...prev];
          clone.splice(idx, 1);
          return clone;
        }
        return prev;
      });

      // Find next empty slot
      const nextEmpty = updated.findIndex((w, i) => currentStation.blankIndices.includes(i) && w === null);
      setSelectedSlotIndex(nextEmpty !== -1 ? nextEmpty : null);

      // Check if all blank slots filled
      const allFilled = updated.every(w => w !== null);
      if (allFilled) {
        setTrainComplete(true);
        setIsTrainMoving(true);
        playWhistleSound();
        addStars(20);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        // Speak full alphabet run
        setTimeout(() => {
          speakWord(currentStation.letters.join(' '));
        }, 600);
      }
    } else {
      // Wrong letter hint
      speakWord(`Try again! We need letter ${expectedLetter}`);
    }
  };

  const handleNextStation = () => {
    if (stationIdx < TRAIN_STATIONS.length - 1) {
      setStationIdx(prev => prev + 1);
    } else {
      setStationIdx(0);
    }
  };

  // =========================================================================
  // 2. WORD RACER MODE STATE & LOGIC
  // =========================================================================
  const [racerWordIdx, setRacerWordIdx] = useState(0);
  const currentRacer = RACER_WORDS[racerWordIdx];
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [carLane, setCarLane] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [trackLanes, setTrackLanes] = useState<{ id: number; lane: number; letter: string; isObstacle?: boolean }[]>([]);
  const [racerWon, setRacerWon] = useState(false);
  const [carBoost, setCarBoost] = useState(false);

  const initRacerLevel = (wordIndex: number) => {
    const target = RACER_WORDS[wordIndex];
    setCollectedLetters([]);
    setCarLane(1);
    setRacerWon(false);
    setCarBoost(false);
    generateTrackWave(target, 0);
  };

  // Generates the next wave of floating crystals across lanes
  const generateTrackWave = (target: RacerWord, currentCollectedCount: number) => {
    const nextRequiredLetter = target.letters[currentCollectedCount];
    if (!nextRequiredLetter) return;

    // Pick random target lane
    const correctLane = Math.floor(Math.random() * 3);
    const allAlphabet = Object.keys(PHONICS_DATA);

    const newItems: { id: number; lane: number; letter: string; isObstacle?: boolean }[] = [];
    
    // Correct letter
    newItems.push({
      id: Date.now() + 1,
      lane: correctLane,
      letter: nextRequiredLetter
    });

    // 2 distractors in other lanes
    [0, 1, 2].forEach((lane) => {
      if (lane !== correctLane) {
        let randomLetter = allAlphabet[Math.floor(Math.random() * allAlphabet.length)];
        while (randomLetter === nextRequiredLetter) {
          randomLetter = allAlphabet[Math.floor(Math.random() * allAlphabet.length)];
        }
        newItems.push({
          id: Date.now() + lane + 10,
          lane,
          letter: randomLetter
        });
      }
    });

    setTrackLanes(newItems);
  };

  useEffect(() => {
    if (activeMode === 'racer') {
      initRacerLevel(racerWordIdx);
    }
  }, [racerWordIdx, activeMode]);

  // Handle steering / capturing letter
  const handleDriveToLane = (lane: number) => {
    if (racerWon) return;
    setCarLane(lane);
    playEngineRevSound();

    // Check item in this lane
    const itemInLane = trackLanes.find(item => item.lane === lane);
    if (!itemInLane) return;

    const nextIndex = collectedLetters.length;
    const expected = currentRacer.letters[nextIndex];

    if (itemInLane.letter === expected) {
      // Correct crystal hit!
      const updated = [...collectedLetters, itemInLane.letter];
      setCollectedLetters(updated);
      setCarBoost(true);
      setTimeout(() => setCarBoost(false), 500);

      speakWord(`${itemInLane.letter}!`);

      if (updated.length === currentRacer.letters.length) {
        // Complete word finished!
        setRacerWon(true);
        addStars(25);
        try {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        setTimeout(() => {
          speakWord(`${currentRacer.word}! Excellent driving!`);
        }, 500);
      } else {
        // Generate next wave
        generateTrackWave(currentRacer, updated.length);
      }
    } else {
      // Wrong letter hit
      speakWord(`Oops! Find letter ${expected}`);
    }
  };

  const handleNextRacerWord = () => {
    if (racerWordIdx < RACER_WORDS.length - 1) {
      setRacerWordIdx(prev => prev + 1);
    } else {
      setRacerWordIdx(0);
    }
  };

  // Keyboard navigation for car racing
  useEffect(() => {
    if (activeMode !== 'racer') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCarLane(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCarLane(prev => Math.min(2, prev + 1));
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleDriveToLane(carLane);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMode, carLane, racerWon, collectedLetters]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & MODE SELECTOR                                             */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#3B82F6] shadow-[0_8px_0_0_#1D4ED8] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-inner text-white shrink-0">
            {activeMode === 'train' ? '🚂' : activeMode === 'racer' ? '🏎️' : '🎧'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                أكاديمية الحروف الإنجليزية الذكية 🇬🇧
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ +20 نجمة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
              {activeMode === 'train' && 'قطار الحروف الأبجدية المتسلسل (Alphabet Train)'}
              {activeMode === 'racer' && 'سباق سيارات تجميع الكلمات (Word Racer Car)'}
              {activeMode === 'phonics' && 'مختبر نطق أصوات الحروف (Phonics Lab)'}
            </h2>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 bg-blue-50 p-1.5 rounded-2xl border-2 border-blue-200">
          <button
            onClick={() => setActiveMode('train')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === 'train'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-900 hover:bg-blue-100'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>قطار الحروف 🚂</span>
          </button>
          <button
            onClick={() => setActiveMode('racer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === 'racer'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-red-900 hover:bg-red-100'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>سباق السيارات 🏎️</span>
          </button>
          <button
            onClick={() => setActiveMode('phonics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === 'phonics'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span>مختبر الأصوات 🔊</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE 1: ALPHABET TRAIN EXPRESS (🚂)                                   */}
      {/* ========================================================================= */}
      {activeMode === 'train' && (
        <div className="space-y-6">
          
          {/* Station Badge & Instructions */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚉</span>
              <div>
                <span className="text-xs font-bold text-blue-200">المحطة {stationIdx + 1} من {TRAIN_STATIONS.length}</span>
                <h3 className="text-base sm:text-lg font-black">{currentStation.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={playWhistleSound}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition"
              >
                <Volume2 className="w-4 h-4" />
                <span>صافرة القطار 💨</span>
              </button>
              <button
                onClick={() => initStation(stationIdx)}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحطة 🔄</span>
              </button>
            </div>
          </div>

          {/* Interactive Train Scenic Track Area */}
          <div className="bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 rounded-[36px] p-6 sm:p-10 border-4 border-blue-400 shadow-[0_10px_0_0_#3B82F6] overflow-hidden relative">
            
            {/* Background Clouds & Sun */}
            <div className="absolute top-4 left-6 text-4xl animate-pulse">☀️</div>
            <div className="absolute top-6 right-16 text-3xl opacity-80">☁️</div>
            <div className="absolute top-10 left-32 text-2xl opacity-60">☁️</div>

            {/* Instruction Banner */}
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border-2 border-blue-300 inline-flex items-center gap-2 mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-black text-blue-900">
                رتّب عربات الحروف المفقودة لتكتمل سكة القطار وينطلق بصافرته القوية!
              </span>
            </div>

            {/* The Moving / Interactive Train on Rails */}
            <div className="relative py-8">
              
              <motion.div 
                className="flex items-end justify-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap"
                animate={isTrainMoving ? { x: [0, 40, -40, 0] } : {}}
                transition={{ duration: 1.5, repeat: isTrainMoving ? Infinity : 0 }}
              >
                {/* 🚂 Locomotive Steam Engine */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Animated Steam Puffs */}
                  <motion.div 
                    className="text-2xl select-none mb-[-4px]"
                    animate={{ y: [-4, -14], opacity: [1, 0], scale: [0.8, 1.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
                  >
                    💨
                  </motion.div>
                  <div className="w-24 sm:w-28 h-20 sm:h-24 bg-gradient-to-t from-red-600 to-rose-500 rounded-t-3xl border-3 border-red-800 shadow-md relative flex flex-col justify-between p-2 text-white">
                    <div className="flex justify-between items-center">
                      <div className="w-5 h-5 bg-amber-300 rounded-full border-2 border-amber-500 animate-pulse" />
                      <span className="text-[10px] font-black bg-red-900 px-1.5 rounded">EXPRESS</span>
                    </div>
                    <div className="text-center font-black text-xs">قاطرة سمسم</div>
                    {/* Engine Wheels */}
                    <div className="flex justify-around items-center -mb-5">
                      <motion.div 
                        animate={{ rotate: isTrainMoving ? 360 : 0 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-7 h-7 bg-gray-900 rounded-full border-2 border-amber-400 flex items-center justify-center text-[10px] text-white"
                      >
                        ⚙️
                      </motion.div>
                      <motion.div 
                        animate={{ rotate: isTrainMoving ? 360 : 0 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-7 h-7 bg-gray-900 rounded-full border-2 border-amber-400 flex items-center justify-center text-[10px] text-white"
                      >
                        ⚙️
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* 🚃 Train Wagons (Slots) */}
                {userTrainWagons.map((wagonLetter, idx) => {
                  const isBlankSlot = currentStation.blankIndices.includes(idx);
                  const isFilled = wagonLetter !== null;
                  const isSelected = selectedSlotIndex === idx;

                  return (
                    <motion.div 
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        if (isBlankSlot && !trainComplete) {
                          setSelectedSlotIndex(idx);
                        }
                      }}
                      className={`w-16 sm:w-20 h-20 sm:h-24 rounded-t-2xl border-3 flex flex-col justify-between p-2 shrink-0 cursor-pointer relative shadow-md transition-all ${
                        isFilled
                          ? 'bg-gradient-to-t from-amber-400 to-yellow-300 border-amber-600 text-amber-950'
                          : isSelected
                          ? 'bg-white/90 border-dashed border-4 border-blue-600 ring-4 ring-blue-300 animate-pulse text-blue-800'
                          : 'bg-white/60 border-dashed border-3 border-gray-400 text-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-black">
                        <span>#{idx + 1}</span>
                        {isFilled && <span>{PHONICS_DATA[wagonLetter]?.emoji}</span>}
                      </div>

                      <div className="text-center font-black text-2xl sm:text-3xl">
                        {isFilled ? wagonLetter : '?'}
                      </div>

                      <div className="text-[9px] font-bold text-center truncate">
                        {isFilled ? PHONICS_DATA[wagonLetter]?.word : 'ضع الحرف'}
                      </div>

                      {/* Wagon Wheels */}
                      <div className="flex justify-around items-center -mb-5">
                        <div className="w-5 h-5 bg-gray-800 rounded-full border border-gray-400" />
                        <div className="w-5 h-5 bg-gray-800 rounded-full border border-gray-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ════ Train Rails & Sleepers ════ */}
              <div className="w-full mt-4 flex flex-col items-center">
                <div className="w-full h-2 bg-gray-700 rounded-full shadow-inner" />
                <div className="w-full flex justify-between px-2 -mt-1.5">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-3 bg-amber-900 rounded-xs shadow-xs" />
                  ))}
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full shadow-inner -mt-1.5" />
              </div>

            </div>

            {/* Celebration Card when Station is Finished */}
            <AnimatePresence>
              {trainComplete && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/95 rounded-3xl p-6 border-4 border-emerald-500 shadow-xl max-w-md mx-auto text-center mt-6"
                >
                  <div className="text-5xl mb-2">🎉🚂✨</div>
                  <h4 className="text-xl font-black text-emerald-800">مرحى يا بطل الحروف!</h4>
                  <p className="text-xs font-bold text-emerald-950 mt-1">
                    اكتمل قطار الحروف بنجاح! كسبت 20 نجمة إضافية ⭐
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                      onClick={handleNextStation}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition"
                    >
                      <span>المحطة التالية</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => initStation(stationIdx)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs rounded-xl cursor-pointer"
                    >
                      إعادة اللعب 🔄
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Letter Wagon Choices Dock */}
          {!trainComplete && (
            <div className="bg-white rounded-3xl p-5 border-4 border-amber-300 shadow-[0_6px_0_0_#D1B02B]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>اختر العربة الصحيحة لملء العربة المحددة:</span>
                </h4>
                <span className="text-xs font-bold text-gray-500">
                  انقر على الحرف لسماعه ووضعه بالقطار 👆
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                {availableWagonOptions.map((letter) => (
                  <motion.button
                    key={letter}
                    onClick={() => handleSelectWagonLetter(letter)}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 sm:w-20 h-20 bg-gradient-to-b from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl border-3 border-blue-800 shadow-[0_6px_0_0_#1E3A8A] flex flex-col items-center justify-between p-2 cursor-pointer transition-all"
                  >
                    <span className="text-2xl sm:text-3xl font-black">{letter}</span>
                    <span className="text-base">{PHONICS_DATA[letter]?.emoji}</span>
                    <span className="text-[9px] font-bold text-blue-100">{PHONICS_DATA[letter]?.word}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODE 2: WORD RACER CAR (🏎️🏁)                                        */}
      {/* ========================================================================= */}
      {activeMode === 'racer' && (
        <div className="space-y-6">
          
          {/* Target Word Dashboard */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-3xl p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg border-3 border-red-700">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl">{currentRacer.emoji}</span>
              <div>
                <span className="text-xs font-bold text-red-200">الكلمة المستهدفة ({currentRacer.hintAr})</span>
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-widest bg-black/20 px-4 py-1 rounded-2xl border border-white/20">
                    {currentRacer.word}
                  </h3>
                  <button
                    onClick={() => speakWord(currentRacer.word)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer transition"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Collected Letters Progress Bar */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-100 ml-1">الحروف المجموعة:</span>
              <div className="flex gap-1.5">
                {currentRacer.letters.map((char, idx) => {
                  const isCollected = idx < collectedLetters.length;
                  return (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-black text-lg ${
                        isCollected
                          ? 'bg-amber-300 text-amber-950 border-amber-500 shadow-md animate-bounce'
                          : 'bg-white/20 border-white/40 text-white/60'
                      }`}
                    >
                      {isCollected ? char : '_'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic 3-Lane Race Track Arena */}
          <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[36px] p-6 border-4 border-red-500 shadow-[0_10px_0_0_#991B1B] relative overflow-hidden">
            
            {/* Speedometer & Turbo HUD */}
            <div className="flex items-center justify-between text-white text-xs font-black mb-4 px-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Gauge className="w-4 h-4" />
                <span>السرعة: 180 كم/س</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Zap className="w-4 h-4" />
                <span>الهدف التالي: الحرف [{currentRacer.letters[collectedLetters.length] || '🏆'}]</span>
              </div>
            </div>

            {/* 3 Asphalt Lanes */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 relative min-h-[320px] sm:min-h-[360px] bg-gray-950 p-4 rounded-3xl border-2 border-gray-700">
              
              {/* Lane Markings */}
              {[0, 1, 2].map((laneIndex) => (
                <div 
                  key={laneIndex} 
                  onClick={() => handleDriveToLane(laneIndex)}
                  className={`relative rounded-2xl flex flex-col justify-between items-center py-4 border-2 border-dashed border-gray-700 hover:bg-white/5 cursor-pointer transition ${
                    carLane === laneIndex ? 'bg-red-500/10 border-red-500/50' : ''
                  }`}
                >
                  <span className="text-[10px] font-black text-gray-500">
                    {laneIndex === 0 ? 'المسار الأيسر' : laneIndex === 1 ? 'المسار الأوسط' : 'المسار الأيمن'}
                  </span>

                  {/* Floating Letter Crystals in Lanes */}
                  {trackLanes
                    .filter(item => item.lane === laneIndex)
                    .map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ y: -40, opacity: 0, scale: 0.8 }}
                        animate={{ y: [0, 10, 0], opacity: 1, scale: 1 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200 border-3 border-amber-600 shadow-[0_6px_0_0_#B45309] flex flex-col items-center justify-center text-amber-950 font-black text-2xl sm:text-3xl"
                      >
                        <span>{item.letter}</span>
                        <span className="text-[10px] text-amber-900">{PHONICS_DATA[item.letter]?.emoji}</span>
                      </motion.div>
                    ))}

                  {/* Race Car in Active Lane */}
                  {carLane === laneIndex && (
                    <motion.div
                      layoutId="racecar"
                      className="flex flex-col items-center relative z-20"
                    >
                      {/* Turbo Flames when boosting */}
                      {carBoost && (
                        <motion.div 
                          className="text-3xl select-none -mb-3"
                          animate={{ scale: [1, 1.4, 1], y: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.2 }}
                        >
                          🔥⚡
                        </motion.div>
                      )}
                      
                      {/* Car Body */}
                      <div className="w-16 sm:w-20 h-24 sm:h-28 bg-gradient-to-t from-red-600 via-rose-500 to-red-400 rounded-3xl border-3 border-red-900 shadow-2xl flex flex-col justify-between p-2 text-white relative">
                        <div className="flex justify-between items-center">
                          <div className="w-3 h-3 bg-yellow-300 rounded-full shadow-xs animate-ping" />
                          <div className="w-3 h-3 bg-yellow-300 rounded-full shadow-xs animate-ping" />
                        </div>

                        <div className="text-center font-black text-xs">
                          🏎️ NAQLA
                        </div>

                        <div className="flex justify-between items-center text-[10px]">
                          <div className="w-3 h-4 bg-gray-900 rounded-xs" />
                          <div className="w-3 h-4 bg-gray-900 rounded-xs" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Steering Buttons Controls (Accessible for Mobile & Desktop) */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <button
                onClick={() => setCarLane(prev => Math.max(0, prev - 1))}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl border-3 border-blue-800 shadow-[0_4px_0_0_#1E3A8A] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1"
              >
                <ArrowRight className="w-5 h-5" />
                <span>المسار السابق</span>
              </button>

              <button
                onClick={() => handleDriveToLane(carLane)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl border-3 border-red-800 shadow-[0_4px_0_0_#991B1B] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1"
              >
                <Zap className="w-5 h-5 text-yellow-300" />
                <span>التقط الحرف! 💎</span>
              </button>

              <button
                onClick={() => setCarLane(prev => Math.min(2, prev + 1))}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-2xl border-3 border-blue-800 shadow-[0_4px_0_0_#1E3A8A] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1"
              >
                <span>المسار التالي</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Victory Finish Line Modal */}
            <AnimatePresence>
              {racerWon && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-30"
                >
                  <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-red-500 shadow-2xl max-w-md w-full text-center">
                    <div className="text-6xl mb-2 animate-bounce">🏁🏎️🏆</div>
                    <h3 className="text-2xl font-black text-red-600">بطل السباق الخارق!</h3>
                    <p className="text-sm font-bold text-gray-700 mt-2">
                      جمّعت كلمة ({currentRacer.word}) بمهارة فائقة وسرعة قياسية!
                    </p>
                    <div className="bg-amber-100 text-amber-900 font-black text-xs py-2 px-4 rounded-xl inline-block mt-3 border border-amber-300">
                      ⭐ كسبت +25 نجمة ذهبية
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-6">
                      <button
                        onClick={handleNextRacerWord}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition"
                      >
                        <span>الكلمة التالية 🚀</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => initRacerLevel(racerWordIdx)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs rounded-2xl cursor-pointer"
                      >
                        إعادة السباق 🔄
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODE 3: PHONICS & SOUNDS LAB (🔊)                                     */}
      {/* ========================================================================= */}
      {activeMode === 'phonics' && (
        <div className="bg-white rounded-[32px] p-6 border-4 border-emerald-400 shadow-[0_8px_0_0_#059669] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Headphones className="w-5 h-5 text-emerald-600" />
              <span>انقر على أي حرف للاستماع إلى نطقه الأمريكي ومثاله الصوتي:</span>
            </h3>
            <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
              26 حرف أبجدي كامل
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Object.entries(PHONICS_DATA).map(([letter, data]) => (
              <motion.button
                key={letter}
                onClick={() => speakWord(`${letter}! ${data.phonics}`)}
                whileHover={{ scale: 1.06, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="p-3.5 rounded-2xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50 to-white hover:border-emerald-500 flex flex-col items-center justify-center text-center shadow-xs cursor-pointer transition"
              >
                <span className="text-3xl font-black text-emerald-800">{letter}</span>
                <span className="text-2xl my-1">{data.emoji}</span>
                <span className="text-xs font-bold text-gray-800">{data.word}</span>
                <span className="text-[10px] text-gray-500 mt-0.5">{data.phonics}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
