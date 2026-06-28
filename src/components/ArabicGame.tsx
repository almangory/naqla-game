/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles, Star, RotateCcw, Volume2, ArrowLeft } from 'lucide-react';

interface ArabicGameProps {
  addStars: (amount: number) => void;
}

type ArabicMode = 'matching' | 'builder';

export default function ArabicGame({ addStars }: ArabicGameProps) {
  const [activeMode, setActiveMode] = useState<ArabicMode>('matching');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // --- 1. Letter Matching States ---
  const [targetLetter, setTargetLetter] = useState('أ');
  const [matchingOptions, setMatchingOptions] = useState<{ word: string; emoji: string; correct: boolean }[]>([]);

  const lettersDatabase = [
    { letter: 'أ', word: 'أرنب', emoji: '🐰', noise: 'أرنب' },
    { letter: 'ب', word: 'بيت', emoji: '🏠', noise: 'بيت' },
    { letter: 'ت', word: 'تفاح', emoji: '🍎', noise: 'تفاح' },
    { letter: 'ث', word: 'ثعلب', emoji: '🦊', noise: 'ثعلب' },
    { letter: 'ج', word: 'جمل', emoji: '🐪', noise: 'جمل' },
    { letter: 'ح', word: 'حصان', emoji: '🐴', noise: 'حصان' },
    { letter: 'خ', word: 'خروف', emoji: '🐑', noise: 'خروف' },
    { letter: 'د', word: 'دب', emoji: '🐻', noise: 'دب' },
    { letter: 'ذ', word: 'ذئب', emoji: '🐺', noise: 'ذئب' },
    { letter: 'ر', word: 'رمان', emoji: '🍉', noise: 'رمان' },
    { letter: 'ز', word: 'زرافة', emoji: '🦒', noise: 'زرافة' },
    { letter: 'س', word: 'سمكة', emoji: '🐟', noise: 'سمكة' },
    { letter: 'ش', word: 'شمس', emoji: '☀️', noise: 'شمس' },
    { letter: 'ص', word: 'صقر', emoji: '🦅', noise: 'صقر' },
    { letter: 'ع', word: 'عصفور', emoji: '🐦', noise: 'عصفور' },
    { letter: 'ف', word: 'فيل', emoji: '🐘', noise: 'فيل' },
    { letter: 'ق', word: 'قرد', emoji: '🐒', noise: 'قرد' },
    { letter: 'ك', word: 'كلب', emoji: '🐶', noise: 'كلب' },
    { letter: 'م', word: 'موز', emoji: '🍌', noise: 'موز' },
    { letter: 'هـ', word: 'هلال', emoji: '🌙', noise: 'هلال' },
    { letter: 'ض', word: 'ضفدع', emoji: '🐸', noise: 'ضفدع' },
    { letter: 'ط', word: 'طائرة', emoji: '✈️', noise: 'طائرة' },
    { letter: 'ظ', word: 'ظرف', emoji: '✉️', noise: 'ظرف' },
    { letter: 'غ', word: 'غزال', emoji: '🦌', noise: 'غزال' },
    { letter: 'ل', word: 'ليمون', emoji: '🍋', noise: 'ليمون' },
    { letter: 'ن', word: 'نمر', emoji: '🐯', noise: 'نمر' },
    { letter: 'و', word: 'وردة', emoji: '🌹', noise: 'وردة' },
    { letter: 'ي', word: 'يد', emoji: '✋', noise: 'يد' }
  ];

  // --- 2. Word Builder States ---
  const wordBuilderDatabase = [
    { word: 'أسد', letters: ['أ', 'س', 'د'], emoji: '🦁' },
    { word: 'بيت', letters: ['ب', 'ي', 'ت'], emoji: '🏠' },
    { word: 'جمل', letters: ['ج', 'م', 'ل'], emoji: '🐪' },
    { word: 'موز', letters: ['م', 'و', 'ز'], emoji: '🍌' },
    { word: 'قرد', letters: ['ق', 'ر', 'د'], emoji: '🐒' },
    { word: 'فيل', letters: ['ف', 'ي', 'ل'], emoji: '🐘' },
    { word: 'بحر', letters: ['ب', 'ح', 'ر'], emoji: '🌊' },
    { word: 'شمس', letters: ['ش', 'م', 'س'], emoji: '☀️' },
    { word: 'تفاح', letters: ['ت', 'ف', 'ا', 'ح'], emoji: '🍎' },
    { word: 'وردة', letters: ['و', 'ر', 'د', 'ة'], emoji: '🌹' },
    { word: 'نمر', letters: ['ن', 'م', 'ر'], emoji: '🐯' },
    { word: 'قمر', letters: ['ق', 'م', 'ر'], emoji: '🌙' },
    { word: 'ولد', letters: ['و', 'ل', 'د'], emoji: '👦' },
    { word: 'بنت', letters: ['ب', 'ن', 'ت'], emoji: '👧' }
  ];

  const [currentBuilderIdx, setCurrentBuilderIdx] = useState(0);
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  // Init Letter Matching
  const initMatchingQuestion = () => {
    const mainItem = lettersDatabase[Math.floor(Math.random() * lettersDatabase.length)];
    setTargetLetter(mainItem.letter);

    // Get 2 distractor items
    let distractors: typeof lettersDatabase = [];
    while (distractors.length < 2) {
      const d = lettersDatabase[Math.floor(Math.random() * lettersDatabase.length)];
      if (d.letter !== mainItem.letter && !distractors.some(x => x.letter === d.letter)) {
        distractors.push(d);
      }
    }

    const options = [
      { word: mainItem.word, emoji: mainItem.emoji, correct: true },
      { word: distractors[0].word, emoji: distractors[0].emoji, correct: false },
      { word: distractors[1].word, emoji: distractors[1].emoji, correct: false }
    ].sort(() => Math.random() - 0.5);

    setMatchingOptions(options);
    setFeedback(null);
    setHasAnswered(false);
  };

  // Init Word Builder
  const initWordBuilder = () => {
    const item = wordBuilderDatabase[currentBuilderIdx];
    // Shuffle the letters
    const shuffled = [...item.letters].sort(() => Math.random() - 0.5);
    setJumbledLetters(shuffled);
    setSelectedLetters([]);
    setFeedback(null);
    setHasAnswered(false);
  };

  useEffect(() => {
    if (activeMode === 'matching') {
      initMatchingQuestion();
    } else {
      initWordBuilder();
    }
  }, [activeMode, currentBuilderIdx]);

  // Say word in Arabic using SpeechSynthesis
  const pronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Answer matching
  const handleMatchingAnswer = (option: { word: string; emoji: string; correct: boolean }) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    pronounce(option.word);

    if (option.correct) {
      setFeedback({ isCorrect: true, message: `صحيح يا بطل! حرف (${targetLetter}) تبدأ به كلمة ${option.word} ${option.emoji}! ⭐` });
      setScore(prev => prev + 1);
      addStars(10);
    } else {
      const correctWord = lettersDatabase.find(x => x.letter === targetLetter);
      setFeedback({ isCorrect: false, message: `أوه! حاول مجدداً. الكلمة الصحيحة لحرف (${targetLetter}) هي ${correctWord?.word} ${correctWord?.emoji}!` });
    }
  };

  // Word building clicks
  const clickLetter = (letter: string, index: number) => {
    if (hasAnswered) return;

    const updatedSelected = [...selectedLetters, letter];
    setSelectedLetters(updatedSelected);

    // Remove letter from jumbled choices at that specific index
    const updatedJumbled = [...jumbledLetters];
    updatedJumbled.splice(index, 1);
    setJumbledLetters(updatedJumbled);

    const currentWord = wordBuilderDatabase[currentBuilderIdx];

    // Check if fully assembled
    if (updatedSelected.length === currentWord.letters.length) {
      setHasAnswered(true);
      const isCorrect = updatedSelected.join('') === currentWord.word;
      pronounce(currentWord.word);

      if (isCorrect) {
        setFeedback({ isCorrect: true, message: `أنت مبدع الحروف! لقد ركبت كلمة (${currentWord.word}) ${currentWord.emoji} بنجاح! 🎉` });
        setScore(prev => prev + 1);
        addStars(15); // Extra stars for full spelling!
      } else {
        setFeedback({ isCorrect: false, message: `التركيب ليس صحيحاً تماماً. الترتيب المناسب هو: ${currentWord.letters.join(' 👈 ')}` });
      }
    }
  };

  const resetBuilder = () => {
    const item = wordBuilderDatabase[currentBuilderIdx];
    setJumbledLetters([...item.letters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setFeedback(null);
    setHasAnswered(false);
  };

  const nextQuestion = () => {
    if (activeMode === 'matching') {
      initMatchingQuestion();
    } else {
      setHasAnswered(false);
      setFeedback(null);
      setCurrentBuilderIdx(prev => (prev + 1) % wordBuilderDatabase.length);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FF6B6B] shadow-[0_8px_0_0_#D64545]" id="arabic-game-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-[#FFF0F0] pb-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#D64545] flex items-center gap-2">
            🎈 مملكة الحروف والكلمات العربية 📝
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">تعلّم الحروف وبناء الكلمات الأولى بأجواء ممتعة وصوتية!</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-[#FFF0F0] px-4 py-2 rounded-2xl border-4 border-[#FF6B6B]">
          <span className="text-sm font-black text-[#D64545]">النقاط:</span>
          <span className="bg-[#FFD93D] text-[#7A6A24] border-2 border-[#7A6A24] font-black px-3 py-1 rounded-full text-lg shadow-sm">
            {score} 🏆
          </span>
        </div>
      </div>

      {/* Mode selectors */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={() => setActiveMode('matching')}
          className={`px-6 py-3 rounded-2xl text-lg font-black transition-all border-4 cursor-pointer ${
            activeMode === 'matching'
              ? 'bg-[#FF6B6B] border-[#D64545] text-white shadow-[0_4px_0_0_#D64545] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="arabic-mode-matching"
        >
          منطاد الحروف 🎈
        </button>
        <button
          onClick={() => setActiveMode('builder')}
          className={`px-6 py-3 rounded-2xl text-lg font-black transition-all border-4 cursor-pointer ${
            activeMode === 'builder'
              ? 'bg-[#FF6B6B] border-[#D64545] text-white shadow-[0_4px_0_0_#D64545] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="arabic-mode-builder"
        >
          تركيب الكلمات السحرية 🧩
        </button>
      </div>

      {/* Main Board */}
      <div className="bg-[#FFF8F8] p-6 rounded-[24px] border-4 border-[#FFC2C2] min-h-[300px] flex flex-col justify-between">
        
        {/* MATCHING MODE */}
        {activeMode === 'matching' && (
          <div className="text-center" id="arabic-matching-panel">
            <h3 className="text-xl font-black text-[#D64545] mb-6">أيّ كلمة تبدأ بهذا الحرف الرائع؟</h3>

            {/* Target Letter Board */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-28 h-28 bg-[#FF6B6B] border-4 border-[#D64545] text-white text-6xl font-black rounded-full flex items-center justify-center shadow-[0_6px_0_0_#D64545] relative cursor-pointer"
                onClick={() => pronounce(targetLetter)}
                id="target-letter-sphere"
              >
                <span>{targetLetter}</span>
                <span className="absolute -bottom-2 -left-2 bg-[#FFD93D] border-2 border-[#7A6A24] text-[#7A6A24] p-1.5 rounded-full text-xs shadow">
                  <Volume2 className="w-4 h-4" />
                </span>
              </motion.div>
            </div>

            {/* Image/Word options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {matchingOptions.map((opt, idx) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={idx}
                  onClick={() => handleMatchingAnswer(opt)}
                  disabled={hasAnswered}
                  className={`p-5 rounded-2xl border-4 text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                    hasAnswered
                      ? opt.correct
                        ? 'bg-[#4ECDC4] border-[#3DA199] text-white shadow-[0_6px_0_0_#3DA199] font-black'
                        : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none opacity-50'
                      : 'bg-white border-gray-200 hover:border-[#FF6B6B] text-gray-800 shadow-[0_6px_0_0_#E2E8F0]'
                  }`}
                  id={`arabic-option-${idx}`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="text-xl font-black">{opt.word}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* WORD BUILDER MODE */}
        {activeMode === 'builder' && (
          <div className="text-center" id="arabic-builder-panel">
            <h3 className="text-xl font-black text-[#D64545] mb-4">رتب الحروف بالترتيب لتكتب الكلمة المقابلة:</h3>
            
            {/* Displaying Image/Emoji Target */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-7xl bg-white p-4 rounded-3xl shadow-[0_6px_0_0_#D1D1D1] border-4 border-gray-200 w-28 h-28 flex items-center justify-center">
                {wordBuilderDatabase[currentBuilderIdx].emoji}
              </div>
              <p className="text-gray-500 text-xs mt-2 font-bold">المجسم المراد تركيبه</p>
            </div>

            {/* Assembled Letters Bar */}
            <div className="flex justify-center gap-3 mb-6 min-h-[64px] bg-white p-4 rounded-2xl border-4 border-dashed border-[#FFC2C2] max-w-sm mx-auto">
              {selectedLetters.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 bg-[#FF6B6B] text-white font-black text-lg rounded-xl flex items-center justify-center shadow-[0_3px_0_0_#D64545]"
                >
                  {l}
                </motion.div>
              ))}
              {selectedLetters.length === 0 && (
                <p className="text-gray-400 text-sm py-1 font-bold">اضغط على الحروف لتبدأ البناء...</p>
              )}
            </div>

            {/* Letter pool choices */}
            <div className="flex justify-center gap-3 max-w-xs mx-auto mb-6">
              {jumbledLetters.map((l, i) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => clickLetter(l, i)}
                  disabled={hasAnswered}
                  className="w-14 h-14 bg-white hover:bg-[#FFF0F0] text-[#4D4D4D] font-black text-2xl rounded-2xl shadow-[0_4px_0_0_#D1D1D1] border-4 border-gray-200 active:translate-y-[2px] transition cursor-pointer flex items-center justify-center"
                  id={`builder-choice-${i}`}
                >
                  {l}
                </motion.button>
              ))}
            </div>

            {selectedLetters.length > 0 && !hasAnswered && (
              <button
                onClick={resetBuilder}
                className="bg-white text-gray-700 border-4 border-gray-400 py-1.5 px-4 rounded-xl shadow-[0_3px_0_0_#9CA3AF] active:translate-y-[2px] transition cursor-pointer font-black text-xs inline-flex items-center gap-1 mx-auto"
                id="reset-builder-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" /> إعادة كتابة الكلمة
              </button>
            )}
          </div>
        )}

        {/* Feedback Section */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`mt-6 p-5 rounded-[24px] border-4 flex items-start gap-4 text-right bg-white ${
                feedback.isCorrect
                  ? 'border-[#4ECDC4] shadow-[0_6px_0_0_#3DA199]'
                  : 'border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130]'
              }`}
              id="arabic-feedback-box"
            >
              <div className="text-3xl shrink-0">{feedback.isCorrect ? '✨' : '🦉'}</div>
              <div className="flex-1">
                <h4 className={`font-black text-lg mb-1 ${feedback.isCorrect ? 'text-[#2D8E87]' : 'text-[#CC7130]'}`}>
                  {feedback.isCorrect ? 'رائع جداً!' : 'فكرة قوية!'}
                </h4>
                <p className="text-gray-700 font-bold text-sm leading-relaxed">{feedback.message}</p>
                
                <button
                  onClick={nextQuestion}
                  className="mt-3 bg-[#FFD93D] text-[#4D4D4D] border-4 border-[#7A6A24] font-black px-6 py-2 rounded-xl shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1B02B] active:translate-y-[3px] active:shadow-none transition-all duration-100"
                  id="next-arabic-question-btn"
                >
                  السؤال التالي <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
