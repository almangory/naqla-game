/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Filter,
  CheckCircle2
} from 'lucide-react';

import { SUDAN_100_RIDDLES, SudanRiddle } from '../data/sudanRiddlesData';
import { useSpeech } from '../hooks/useSpeech';
import { useSoundEffects } from '../hooks/useSoundEffects';
import confetti from 'canvas-confetti';

interface SudanQuizProps {
  addStars: (amount: number) => void;
}

const CATEGORIES = [
  { id: 'all', name: '🌟 كل الـ 100 لغز' },
  { id: 'history', name: '🏛️ حضارات ومعالم كوش' },
  { id: 'nature', name: '🌊 الأنهار والطبيعة' },
  { id: 'projects', name: '🚜 المشاريع القومية' },
  { id: 'tools', name: '🛠️ الأدوات التراثية والزراعية' },
  { id: 'food', name: '🌾 المحاصيل والأطعمة' },
  { id: 'culture', name: '🪘 التراث والموسيقى والقيم' },
  { id: 'wildlife', name: '🦅 الحياة البرية' }
];

export default function SudanQuiz({ addStars }: SudanQuizProps) {
  const { speak } = useSpeech();
  const { playCorrect, playWrong, playStarSound } = useSoundEffects();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered riddles based on selected category
  const activeRiddles = useMemo(() => {
    if (selectedCategory === 'all') return SUDAN_100_RIDDLES;
    return SUDAN_100_RIDDLES.filter(r => r.category === selectedCategory);
  }, [selectedCategory]);

  const currentRiddle: SudanRiddle = activeRiddles[currentRiddleIdx] || activeRiddles[0];

  // Speech Synthesizer for Riddles
  const readRiddleAloud = (text: string) => {
    speak(text);
  };

  // Timer loop logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playWrong();
      setFeedback({
        correct: false,
        message: "أوه! لقد انتهى الوقت المخصص لحل اللغز! ⏰ حاول مجدداً بنقر 'إعادة المحاولة' لتصبح أسرع!"
      });
      readRiddleAloud("انتهى الوقت المخصص يا بطل، حاول مجدداً!");
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning]);

  // Restart Timer for Question
  const startTimerForQuestion = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTimeLeft(30);
    setIsTimerRunning(true);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setFeedback(null);
  };

  useEffect(() => {
    startTimerForQuestion();
  }, [currentRiddleIdx, selectedCategory]);

  const handleSelectAnswer = (opt: string) => {
    if (selectedAnswer !== null || timeLeft === 0) return;
    setSelectedAnswer(opt);
    setIsTimerRunning(false);
    setShowAnswer(true);

    if (opt === currentRiddle.correct) {
      addStars(20);
      playCorrect();
      playStarSound();
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      if (!solvedIds.includes(currentRiddle.id)) {
        setSolvedIds(prev => [...prev, currentRiddle.id]);
      }

      setFeedback({
        correct: true,
        message: `إجابة عبقرية صحيحة! 🎉 كسبت 20 نجمة ذهبية لذكائك وتفوقك! ⭐`
      });
      readRiddleAloud("يا سلام عليك يا بطل! إجابة عبقرية وصحيحة!");
    } else {
      playWrong();
      setFeedback({
        correct: false,
        message: `أوه! الإجابة غير صحيحة. الإجابة الصحيحة هي: (${currentRiddle.correct})`
      });
      readRiddleAloud("أوه! إجابة غير صحيحة، اقرأ المعلومات لتعرف الإجابة الصحيحة!");
    }
  };

  const handleNextRiddle = () => {
    setCurrentRiddleIdx(prev => (prev + 1) % activeRiddles.length);
  };

  const handlePrevRiddle = () => {
    setCurrentRiddleIdx(prev => (prev - 1 + activeRiddles.length) % activeRiddles.length);
  };

  const handleRandomRiddle = () => {
    const randIdx = Math.floor(Math.random() * activeRiddles.length);
    setCurrentRiddleIdx(randIdx);
  };

  const handleResetTimer = () => {
    startTimerForQuestion();
  };

  return (
    <div className="bg-[#FFFDF6] rounded-[32px] p-5 sm:p-8 border-4 border-[#1DD1A1] shadow-[0_8px_0_0_#10AC84] space-y-6" id="sudan-quiz-container" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & TOP PROGRESS DOCK                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-emerald-50 pb-4 gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#E28743] text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
              موسوعة الألغاز الـ 100 الكاملة
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full">
              100 لغز وفزورة 🧠
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#10AC84] mt-1.5 flex items-center gap-2">
            <span>لغز وفزورة بلمسة سودانية أصيلة</span>
            <span>⏱️</span>
          </h2>
          <p className="text-gray-600 font-bold text-xs sm:text-sm mt-1">
            حل الألغاز قبل انتهاء الوقت المخصص، واكتشف معلومات تاريخية ووطنية وفيرة جداً عن سوداننا الحبيب!
          </p>
        </div>

        {/* Solved Progress Counter */}
        <div className="flex items-center gap-3">
          <div className="bg-white border-3 border-[#1DD1A1] px-4 py-2 rounded-2xl text-xs font-black shadow-xs text-[#10AC84] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>الألغاز المحلولة:</span>
            <span className="text-sm font-black text-orange-600">{solvedIds.length} / 100</span>
          </div>
          <button
            onClick={handleRandomRiddle}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 rounded-2xl text-emerald-700 font-black text-xs flex items-center gap-1 cursor-pointer transition"
            title="لغز عشوائي"
          >
            <Shuffle className="w-4 h-4" />
            <span className="hidden sm:inline">لغز عشوائي 🎲</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CATEGORY PILLS BAR                                                     */}
      {/* ========================================================================= */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentRiddleIdx(0);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition cursor-pointer border-2 ${
              selectedCategory === cat.id
                ? 'bg-[#10AC84] text-white border-[#10AC84] shadow-xs'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN ARENA: RIDDLE CARD & KNOWLEDGE CHEST                              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Riddle & Answer Area (3 columns) */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div className="bg-white p-5 sm:p-6 rounded-[28px] border-4 border-[#1DD1A1] shadow-[0_6px_0_0_#10AC84] flex flex-col justify-between min-h-[440px]">
            
            {/* Top Bar: Timer, Voice, Reset */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-black text-xs ${
                timeLeft <= 10 ? 'bg-red-50 border-red-300 text-red-500 animate-pulse' : 'bg-emerald-50 border-emerald-300 text-emerald-600'
              }`} id="quiz-timer">
                <Timer className="w-4 h-4" />
                <span>الوقت المتبقي: {timeLeft} ثانية</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => readRiddleAloud(currentRiddle.question)}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-[#1DD1A1] rounded-xl text-[#10AC84] cursor-pointer"
                  title="استمع إلى اللغز"
                  id="speak-riddle-btn"
                >
                  <Volume2 className="w-4 h-4 animate-pulse" />
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-2 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 cursor-pointer"
                  title="إعادة ضبط عداد الوقت"
                  id="reset-timer-btn"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Riddle Question & Category Tag */}
            <div className="text-right my-auto space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-5xl select-none shrink-0">{currentRiddle.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-[#10AC84] bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      اللغز رقم {currentRiddle.id} من 100
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {currentRiddle.categoryName}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-gray-800 leading-relaxed mt-1">
                    {currentRiddle.question}
                  </h3>
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 gap-2.5 mt-4 pt-4 border-t border-gray-100">
                {currentRiddle.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === currentRiddle.correct;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={selectedAnswer !== null || timeLeft === 0}
                      className={`w-full p-3.5 rounded-2xl border-3 text-right font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                        selectedAnswer !== null
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-xs'
                            : isSelected
                              ? 'bg-red-50 border-red-400 text-red-800 font-bold opacity-80'
                              : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                          : 'bg-white border-gray-200 hover:border-[#1DD1A1] text-gray-700 shadow-xs hover:translate-x-1'
                      }`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && <span className="text-emerald-600 text-xs">إجابة صحيحة ✔️</span>}
                      {selectedAnswer !== null && isSelected && !isCorrect && <span className="text-red-500 text-xs">إجابة خاطئة ❌</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation & Feedback Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl border text-xs font-black text-center ${
                      feedback.correct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-orange-50 border-orange-200 text-[#963E00]'
                    }`}
                  >
                    {feedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevRiddle}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs rounded-xl flex items-center gap-1 cursor-pointer transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
                <button
                  onClick={handleNextRiddle}
                  className="flex-1 bg-[#1DD1A1] hover:bg-[#10AC84] text-white border-3 border-[#10AC84] py-2.5 px-4 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1 shadow-xs transition active:translate-y-0.5"
                >
                  <span>اللغز التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Abundant Knowledge Panel (2 columns) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-[28px] border-4 border-amber-300 shadow-[0_6px_0_0_#D1B02B] min-h-[440px] flex flex-col justify-between">
            
            <div>
              <div className="flex items-center gap-2 border-b-2 border-amber-50 pb-2.5 mb-3">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-[#963E00]">
                  لوحة الكنز المعرفي السوداني 🇸🇩📚
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {showAnswer ? (
                  <motion.div
                    key="info-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3 text-right"
                  >
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-200 shrink-0" />
                      <h4 className="font-black text-xs text-[#963E00] leading-tight">
                        {currentRiddle.infoTitle}
                      </h4>
                    </div>

                    <p className="text-gray-700 font-bold text-xs leading-relaxed max-h-[260px] overflow-y-auto pr-1">
                      {currentRiddle.abundantInfo}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="info-placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center py-12 text-gray-400"
                  >
                    <span className="text-5xl animate-bounce">🗝️📚</span>
                    <h4 className="font-black text-sm text-gray-700 mt-4">حل اللغز لكشف الكنز المعرفي!</h4>
                    <p className="text-xs text-gray-400 font-bold mt-1.5 max-w-[220px] leading-relaxed">
                      عندما تقوم باختيار إجابة اللغز، ستفتح هذه اللوحة لتكشف لك معلومات تاريخية وجغرافية موثقة عن السودان الحبيب!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Little info footer advice */}
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-[10px] text-gray-600 text-center font-bold mt-4">
              💡 السودان مهد الحضارات الإنسانية العريقة، وثقافة الأهل والأجداد عنوان للجود والنخوة والكرم!
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
