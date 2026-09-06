/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Music, Play, RotateCcw, Volume2, Star, Trophy, Sparkles, Heart } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useSpeech } from '../hooks/useSpeech';

interface SudanRhythmGameProps {
  addStars: (amount: number) => void;
}

interface InstrumentPad {
  id: 'daluka_bass' | 'daluka_slap' | 'tanbur' | 'naqqara' | 'safqa';
  name: string;
  subtext: string;
  emoji: string;
  color: string;
  borderColor: string;
  shadowColor: string;
}

const INSTRUMENTS: InstrumentPad[] = [
  {
    id: 'daluka_bass',
    name: 'دلوكة: نغمة دُم 🪘',
    subtext: 'ضربة قوية في المنتصف (صوت عميق)',
    emoji: '🪘',
    color: 'bg-[#FF8E3C]',
    borderColor: 'border-[#B85D19]',
    shadowColor: 'shadow-[0_6px_0_0_#B85D19]'
  },
  {
    id: 'daluka_slap',
    name: 'دلوكة: نغمة تَك 🪘',
    subtext: 'ضربة سريعة على الحافة (صوت حاد)',
    emoji: '✨',
    color: 'bg-[#FFD93D]',
    borderColor: 'border-[#C49E17]',
    shadowColor: 'shadow-[0_6px_0_0_#C49E17]'
  },
  {
    id: 'tanbur',
    name: 'طنبور الشايقية 🎸',
    subtext: 'أوتار خشبية تطرب الآذان بالنغم',
    emoji: '🎸',
    color: 'bg-[#4ECDC4]',
    borderColor: 'border-[#2D8E87]',
    shadowColor: 'shadow-[0_6px_0_0_#2D8E87]'
  },
  {
    id: 'naqqara',
    name: 'نقارة كردفان ودارفور 🥁',
    subtext: 'إيقاع الفروسية والحماس الشعبي',
    emoji: '🥁',
    color: 'bg-[#FF6B6B]',
    borderColor: 'border-[#B33939]',
    shadowColor: 'shadow-[0_6px_0_0_#B33939]'
  },
  {
    id: 'safqa',
    name: 'الصفقة السودانية 👏',
    subtext: 'تصفيق بالأكف ينشر الحماس والمحبة',
    emoji: '👏',
    color: 'bg-[#2ECC71]',
    borderColor: 'border-[#1E824C]',
    shadowColor: 'shadow-[0_6px_0_0_#1E824C]'
  }
];

export default function SudanRhythmGame({ addStars }: SudanRhythmGameProps) {
  const { playPercussion, playStarSound, playClick, playCorrect, playWrong } = useSoundEffects();
  const { speak } = useSpeech();

  const [activeTab, setActiveTab] = useState<'free' | 'challenge'>('free');
  const [activePad, setActivePad] = useState<string | null>(null);
  const [lastPlayedText, setLastPlayedText] = useState<string>('انقر على أي آلة لتبدأ عزف إيقاعك التراثي الجميل!');

  // Challenge Mode States
  const [challengeLevel, setChallengeLevel] = useState(1);
  const [simsimSequence, setSimsimSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [isSimsimPlaying, setIsSimsimPlaying] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState<string | null>(null);
  const [challengeScore, setChallengeScore] = useState(0);

  const triggerPad = (padId: InstrumentPad['id']) => {
    setActivePad(padId);
    playPercussion(padId);

    const pad = INSTRUMENTS.find(p => p.id === padId);
    if (pad) {
      setLastPlayedText(`عزفت: ${pad.name}`);
    }

    setTimeout(() => {
      setActivePad(null);
    }, 150);

    // If in challenge mode, record player input
    if (activeTab === 'challenge' && !isSimsimPlaying) {
      handlePlayerChallengeStep(padId);
    }
  };

  // Start a new rhythm challenge round
  const startChallengeRound = (level: number) => {
    setIsSimsimPlaying(true);
    setPlayerSequence([]);
    setChallengeFeedback('استمع وركّز جيداً مع إيقاع سمسم... 🦉🎶');

    // Generate random sequence of length 2 + level
    const seqLength = Math.min(2 + level, 6);
    const availablePads = INSTRUMENTS.map(i => i.id);
    const newSeq: string[] = [];
    for (let i = 0; i < seqLength; i++) {
      const randomPad = availablePads[Math.floor(Math.random() * availablePads.length)];
      newSeq.push(randomPad);
    }
    setSimsimSequence(newSeq);

    // Play sequence sequentially
    newSeq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        playPercussion(padId as any);
        setTimeout(() => setActivePad(null), 250);

        if (index === newSeq.length - 1) {
          setTimeout(() => {
            setIsSimsimPlaying(false);
            setChallengeFeedback('دورك الآن يا بطل! أعد عزف نفس الإيقاع بالترتيب! 👇');
          }, 350);
        }
      }, (index + 1) * 600);
    });
  };

  const handlePlayerChallengeStep = (padId: string) => {
    const nextPlayerSeq = [...playerSequence, padId];
    setPlayerSequence(nextPlayerSeq);

    const currentIndex = nextPlayerSeq.length - 1;
    // Verify match
    if (nextPlayerSeq[currentIndex] !== simsimSequence[currentIndex]) {
      // Mistake!
      playWrong();
      setChallengeFeedback('أوه! اختلف الإيقاع قليلاً يا بطل 🦉. لا بأس، لنحاول مرة أخرى!');
      setTimeout(() => {
        startChallengeRound(challengeLevel);
      }, 1400);
      return;
    }

    // If whole sequence matched successfully!
    if (nextPlayerSeq.length === simsimSequence.length) {
      playCorrect();
      const roundStars = 15 + challengeLevel * 5;
      addStars(roundStars);
      playStarSound();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      setChallengeScore(prev => prev + 1);
      setChallengeFeedback(`إيقاع سوداني متقن ومطرب! كسبت ${roundStars} نجمة ذهبية! ⭐🪘`);

      setTimeout(() => {
        setChallengeLevel(prev => prev + 1);
        startChallengeRound(challengeLevel + 1);
      }, 1600);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130] max-w-4xl mx-auto" id="sudan-rhythm-game">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 mb-6 border-b-4 border-orange-100 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2">
            <span>🪘🎶</span>
            <span>مختبر الإيقاعات والطبول السودانية</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-orange-950 mt-1">
            تعرف على الدلوكة والطنبور والنقارة واعزف أحلى الأنغام التراثية بأصابعك الذكية! 🇸🇩✨
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-orange-50 p-1.5 rounded-2xl border-2 border-orange-200 gap-2">
          <button
            onClick={() => {
              setActiveTab('free');
              playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'free'
                ? 'bg-[#FF8E3C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-orange-100'
            }`}
          >
            🎨 العزف الحر
          </button>
          <button
            onClick={() => {
              setActiveTab('challenge');
              playClick();
              startChallengeRound(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'challenge'
                ? 'bg-[#6C5CE7] text-white shadow-sm'
                : 'text-gray-600 hover:bg-orange-100'
            }`}
          >
            🦉 تحدي إيقاع سمسم
          </button>
        </div>
      </div>

      {/* Challenge Status Bar */}
      {activeTab === 'challenge' && (
        <div className="mb-6 p-4 rounded-2xl bg-violet-50 border-2 border-violet-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦉🎵</span>
            <div>
              <p className="text-xs font-black text-violet-900">{challengeFeedback}</p>
              <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                المرحلة: {challengeLevel} • إيقاعات صحيحة متتالية: {challengeScore}
              </p>
            </div>
          </div>
          <button
            onClick={() => startChallengeRound(challengeLevel)}
            disabled={isSimsimPlaying}
            className="px-4 py-2 bg-white border-2 border-violet-300 text-violet-800 text-xs font-black rounded-xl hover:bg-violet-100 transition cursor-pointer disabled:opacity-50"
          >
            🔄 إعادة عزف نغمة سمسم
          </button>
        </div>
      )}

      {/* Main Drum Pads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8" id="drum-pads-container">
        {INSTRUMENTS.map((pad) => {
          const isTriggered = activePad === pad.id;
          return (
            <motion.button
              key={pad.id}
              onClick={() => triggerPad(pad.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={isTriggered ? { scale: [1, 1.08, 1], y: [0, -4, 0] } : {}}
              className={`p-6 rounded-[28px] border-4 ${pad.color} ${pad.borderColor} ${pad.shadowColor} text-white text-right flex flex-col justify-between h-[160px] cursor-pointer transition-transform relative overflow-hidden group select-none`}
            >
              {/* Ripple Effect on active */}
              {isTriggered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 bg-white rounded-full pointer-events-none"
                />
              )}

              <div className="flex justify-between items-start">
                <span className="text-4xl group-hover:scale-125 transition-transform">{pad.emoji}</span>
                <span className="bg-black/20 px-2 py-0.5 rounded-full text-[10px] font-black">
                  انقر للعزف 🎵
                </span>
              </div>

              <div>
                <h3 className="text-base font-black leading-tight drop-shadow-sm">{pad.name}</h3>
                <p className="text-[11px] font-bold text-white/90 mt-1 line-clamp-1">{pad.subtext}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom Live Feedback Bar */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎶✨</span>
          <span className="text-xs sm:text-sm font-black text-amber-950">{lastPlayedText}</span>
        </div>
        <button
          onClick={() => speak("الإيقاعات التراثية السودانية تمتاز بالبهجة والروح الطيبة، كصوت الدلوكة التي تجمع الأهل والأحباب!")}
          className="bg-white hover:bg-amber-100 p-2 rounded-xl border border-amber-300 text-amber-800 shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">قصة الآلات التراثية</span>
        </button>
      </div>
    </div>
  );
}
