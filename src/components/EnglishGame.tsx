/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, RotateCcw, Volume2, ArrowRight } from 'lucide-react';

interface EnglishGameProps {
  addStars: (amount: number) => void;
}

type EnglishMode = 'cases' | 'spelling';

export default function EnglishGame({ addStars }: EnglishGameProps) {
  const [activeMode, setActiveMode] = useState<EnglishMode>('cases');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // --- 1. Case Matching Database ---
  const alphabetPairs = [
    { upper: 'A', lower: 'a', word: 'Apple 🍎' },
    { upper: 'B', lower: 'b', word: 'Bear 🐻' },
    { upper: 'C', lower: 'c', word: 'Cat 🐱' },
    { upper: 'D', lower: 'd', word: 'Dog 🐶' },
    { upper: 'E', lower: 'e', word: 'Elephant 🐘' },
    { upper: 'F', lower: 'f', word: 'Fish 🐟' },
    { upper: 'G', lower: 'g', word: 'Giraffe 🦒' },
    { upper: 'H', lower: 'h', word: 'Horse 🐴' },
    { upper: 'I', lower: 'i', word: 'Ice cream 🍦' },
    { upper: 'J', lower: 'j', word: 'Jellyfish 🪼' },
    { upper: 'K', lower: 'k', word: 'Kangaroo 🦘' },
    { upper: 'L', lower: 'l', word: 'Lion 🦁' },
    { upper: 'M', lower: 'm', word: 'Monkey 🐒' },
    { upper: 'N', lower: 'n', word: 'Nest 🪺' },
    { upper: 'O', lower: 'o', word: 'Orange 🍊' },
    { upper: 'P', lower: 'p', word: 'Penguin 🐧' },
    { upper: 'Q', lower: 'q', word: 'Queen 👑' },
    { upper: 'R', lower: 'r', word: 'Rabbit 🐰' },
    { upper: 'S', lower: 's', word: 'Sun ☀️' },
    { upper: 'T', lower: 't', word: 'Tree 🌳' },
    { upper: 'U', lower: 'u', word: 'Umbrella ☂️' },
    { upper: 'V', lower: 'v', word: 'Violin 🎻' },
    { upper: 'W', lower: 'w', word: 'Watermelon 🍉' },
    { upper: 'X', lower: 'x', word: 'Xylophone 🪘' },
    { upper: 'Y', lower: 'y', word: 'Yo-yo 🪀' },
    { upper: 'Z', lower: 'z', word: 'Zebra 🦓' }
  ];

  const [currentUpper, setCurrentUpper] = useState('A');
  const [casesOptions, setCasesOptions] = useState<string[]>([]);

  // --- 2. Spelling Quest Database ---
  const spellingWords = [
    { word: 'CAT', letters: ['C', 'A', 'T'], emoji: '🐱', hint: 'A cute little cat' },
    { word: 'DOG', letters: ['D', 'O', 'G'], emoji: '🐶', hint: 'A loyal dog friend' },
    { word: 'SUN', letters: ['S', 'U', 'N'], emoji: '☀️', hint: 'A bright warm sun' },
    { word: 'CAR', letters: ['C', 'A', 'R'], emoji: '🚗', hint: 'A fast red car' },
    { word: 'TOY', letters: ['T', 'O', 'Y'], emoji: '🧸', hint: 'A fluffy teddy bear' },
    { word: 'FISH', letters: ['F', 'I', 'S', 'H'], emoji: '🐟', hint: 'A colorful swimming fish' },
    { word: 'LION', letters: ['L', 'I', 'O', 'N'], emoji: '🦁', hint: 'King of the jungle' },
    { word: 'TREE', letters: ['T', 'R', 'E', 'E'], emoji: '🌳', hint: 'A green leafy tree' },
    { word: 'BIRD', letters: ['B', 'I', 'R', 'D'], emoji: '🐦', hint: 'A small flying bird' },
    { word: 'MILK', letters: ['M', 'I', 'L', 'K'], emoji: '🥛', hint: 'A cup of cold milk' },
    { word: 'STAR', letters: ['S', 'T', 'A', 'R'], emoji: '⭐', hint: 'A shining star in the sky' },
    { word: 'DUCK', letters: ['D', 'U', 'C', 'K'], emoji: '🦆', hint: 'A yellow swimming duck' },
    { word: 'FROG', letters: ['F', 'R', 'O', 'G'], emoji: '🐸', hint: 'A little hopping frog' },
    { word: 'BOAT', letters: ['B', 'O', 'A', 'T'], emoji: '⛵', hint: 'A sailing boat on the river' },
    { word: 'APPLE', letters: ['A', 'P', 'P', 'L', 'E'], emoji: '🍎', hint: 'A sweet red apple' },
    { word: 'TRAIN', letters: ['T', 'R', 'A', 'I', 'N'], emoji: '🚂', hint: 'A fast steam train' },
    { word: 'HORSE', letters: ['H', 'O', 'R', 'S', 'E'], emoji: '🐴', hint: 'A swift noble horse' },
    { word: 'PLANE', letters: ['P', 'L', 'A', 'N', 'E'], emoji: '✈️', hint: 'An airplane in the sky' }
  ];

  const [currentSpellingIdx, setCurrentSpellingIdx] = useState(0);
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  // Initialize Case Match
  const initCaseMatch = () => {
    const randomPair = alphabetPairs[Math.floor(Math.random() * alphabetPairs.length)];
    setCurrentUpper(randomPair.upper);

    // Collect 2 wrong lowercase letters
    const wrongSet = new Set<string>();
    while (wrongSet.size < 2) {
      const p = alphabetPairs[Math.floor(Math.random() * alphabetPairs.length)];
      if (p.lower !== randomPair.lower) {
        wrongSet.add(p.lower);
      }
    }

    const options = [randomPair.lower, ...Array.from(wrongSet)].sort(() => Math.random() - 0.5);
    setCasesOptions(options);
    setFeedback(null);
    setHasAnswered(false);
  };

  // Initialize Spelling Quest
  const initSpellingQuest = () => {
    const item = spellingWords[currentSpellingIdx];
    const shuffled = [...item.letters].sort(() => Math.random() - 0.5);
    setJumbledLetters(shuffled);
    setSelectedLetters([]);
    setFeedback(null);
    setHasAnswered(false);
  };

  useEffect(() => {
    if (activeMode === 'cases') {
      initCaseMatch();
    } else {
      initSpellingQuest();
    }
  }, [activeMode, currentSpellingIdx]);

  // English pronunciation
  const speakEnglish = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Case matching answer click
  const handleCaseAnswer = (lower: string) => {
    if (hasAnswered) return;
    setHasAnswered(true);

    const correctPair = alphabetPairs.find(p => p.upper === currentUpper);
    speakEnglish(currentUpper + ' is for ' + (correctPair?.word || ''));

    if (correctPair && correctPair.lower === lower) {
      setFeedback({
        isCorrect: true,
        message: `Awesome! Letter (${currentUpper}) matches lowercase (${lower})! (${correctPair.word}) ⭐`
      });
      setScore(prev => prev + 1);
      addStars(10);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Oops! The small letter for (${currentUpper}) is (${correctPair?.lower}). Try again next time!`
      });
    }
  };

  // Spelling letter clicks (fills next slot from Left to Right)
  const handleSpellingLetterClick = (letter: string, index: number) => {
    if (hasAnswered) return;

    speakEnglish(letter);
    const updatedSelected = [...selectedLetters, letter];
    setSelectedLetters(updatedSelected);

    const updatedJumbled = [...jumbledLetters];
    updatedJumbled.splice(index, 1);
    setJumbledLetters(updatedJumbled);

    const targetItem = spellingWords[currentSpellingIdx];

    if (updatedSelected.length === targetItem.letters.length) {
      setHasAnswered(true);
      const isCorrect = updatedSelected.join('') === targetItem.word;
      
      setTimeout(() => {
        speakEnglish(targetItem.word);
      }, 300);

      if (isCorrect) {
        setFeedback({
          isCorrect: true,
          message: `Great Job spelling champion! You spelled "${targetItem.word}" ${targetItem.emoji} correctly from left to right! 🎉`
        });
        setScore(prev => prev + 1);
        addStars(15);
      } else {
        setFeedback({
          isCorrect: false,
          message: `Nice try! The correct spelling from left to right is: ${targetItem.letters.join(' - ')}`
        });
      }
    }
  };

  // Remove a letter from slots back to jumbled choices
  const handleRemoveLetter = (indexToRemove: number) => {
    if (hasAnswered) return;
    const letter = selectedLetters[indexToRemove];
    if (!letter) return;

    const updatedSelected = selectedLetters.filter((_, i) => i !== indexToRemove);
    setSelectedLetters(updatedSelected);
    setJumbledLetters(prev => [...prev, letter]);
    setFeedback(null);
  };

  const resetSpelling = () => {
    const item = spellingWords[currentSpellingIdx];
    setJumbledLetters([...item.letters].sort(() => Math.random() - 0.5));
    setSelectedLetters([]);
    setFeedback(null);
    setHasAnswered(false);
  };

  const nextQuestion = () => {
    if (activeMode === 'cases') {
      initCaseMatch();
    } else {
      setHasAnswered(false);
      setFeedback(null);
      setCurrentSpellingIdx(prev => (prev + 1) % spellingWords.length);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#A55EEA] shadow-[0_8px_0_0_#8843C7]" id="english-game-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-[#F5EDFD] pb-4">
        <div className="text-right">
          <h2 className="text-2xl sm:text-3xl font-black text-[#8843C7] flex items-center gap-2">
            🇬🇧 مغامرة اللغة الإنجليزية الممتعة 🚀
          </h2>
          <p className="text-gray-500 font-bold text-xs sm:text-sm mt-1">
            طابق الحروف الإنجليزية وركّب الكلمات الصحيحة من اليسار لليمين (Left to Right)!
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-[#F5EDFD] px-4 py-2 rounded-2xl border-4 border-[#A55EEA]">
          <span className="text-sm font-black text-[#8843C7]">النقاط:</span>
          <span className="bg-[#FFD93D] text-[#7A6A24] border-2 border-[#7A6A24] font-black px-3 py-1 rounded-full text-lg shadow-sm">
            {score} 🏆
          </span>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={() => setActiveMode('cases')}
          className={`px-6 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeMode === 'cases'
              ? 'bg-[#A55EEA] border-[#8843C7] text-white shadow-[0_4px_0_0_#8843C7] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="english-mode-cases"
        >
          أخوة الحروف (Match Cases) ⛅
        </button>
        <button
          onClick={() => setActiveMode('spelling')}
          className={`px-6 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeMode === 'spelling'
              ? 'bg-[#A55EEA] border-[#8843C7] text-white shadow-[0_4px_0_0_#8843C7] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="english-mode-spelling"
        >
          سباق الإملاء (Spelling Quest) 🎈
        </button>
      </div>

      {/* Game board */}
      <div className="bg-[#FAF6FE] p-5 sm:p-8 rounded-[28px] border-4 border-[#E2CEF9] min-h-[320px] flex flex-col justify-between">
        
        {/* CASE MATCHING */}
        {activeMode === 'cases' && (
          <div className="text-center" id="english-cases-panel">
            <h3 className="text-lg sm:text-xl font-black text-[#8843C7] mb-2">طابق الحرف الكبير بالأخ الصغير المناسب له:</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-bold mb-6">انقر على الحرف لسماع صوته ونطقه بالإنجليزية 🔊</p>

            {/* Large Target Upper Case */}
            <div className="flex justify-center mb-8" dir="ltr">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                onClick={() => speakEnglish(currentUpper)}
                className="w-28 h-28 bg-gradient-to-tr from-[#8843C7] to-[#A55EEA] border-4 border-[#67299E] text-white text-6xl font-black rounded-3xl flex items-center justify-center shadow-[0_6px_0_0_#67299E] cursor-pointer relative hover:scale-105 transition-all select-none"
                id="target-uppercase-box"
              >
                <span>{currentUpper}</span>
                <span className="absolute -bottom-1 -right-1 bg-[#FFD93D] border-2 border-[#7A6A24] p-1.5 rounded-full shadow text-xs">
                  <Volume2 className="w-4 h-4 text-[#7A6A24]" />
                </span>
              </motion.div>
            </div>

            {/* Option Cards in LTR */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto" dir="ltr">
              {casesOptions.map((opt, idx) => {
                const correctPair = alphabetPairs.find(p => p.upper === currentUpper);
                const isCorrect = correctPair?.lower === opt;
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={idx}
                    onClick={() => handleCaseAnswer(opt)}
                    disabled={hasAnswered}
                    className={`py-5 sm:py-6 rounded-2xl text-4xl font-black shadow-[0_6px_0_0_#E2E8F0] border-4 transition cursor-pointer select-none ${
                      hasAnswered
                        ? isCorrect
                          ? 'bg-[#4ECDC4] text-white border-[#3DA199] shadow-[0_6px_0_0_#3DA199]'
                          : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none opacity-50 scale-95'
                        : 'bg-white border-gray-200 hover:border-[#A55EEA] text-[#4D4D4D]'
                    }`}
                    id={`english-option-${idx}`}
                  >
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* SPELLING QUEST */}
        {activeMode === 'spelling' && (
          <div className="text-center" id="english-spelling-panel">
            <h3 className="text-lg sm:text-xl font-black text-[#8843C7] mb-1">
              رتّب الحروف المبعثرة لتهجئة الكلمة:
            </h3>

            {/* Hint & Audio Button */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xs sm:text-sm text-gray-600 font-bold" dir="ltr">
                Hint: {spellingWords[currentSpellingIdx].hint}
              </span>
              <button
                onClick={() => speakEnglish(spellingWords[currentSpellingIdx].word)}
                className="p-1.5 bg-[#F5EDFD] hover:bg-[#E2CEF9] text-[#8843C7] rounded-xl border border-[#A55EEA] cursor-pointer transition"
                title="استمع للكلمة"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Emoji Card */}
            <div className="flex flex-col items-center mb-5">
              <div 
                onClick={() => speakEnglish(spellingWords[currentSpellingIdx].word)}
                className="text-6xl sm:text-7xl bg-white p-4 rounded-3xl shadow-[0_6px_0_0_#D1D1D1] border-4 border-gray-200 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center select-none cursor-pointer hover:scale-105 transition"
              >
                {spellingWords[currentSpellingIdx].emoji}
              </div>
            </div>

            {/* Left to Right Educational Guide Ribbon */}
            <div className="flex items-center justify-center gap-2 mb-3 max-w-sm mx-auto bg-[#F5EDFD] px-3.5 py-1.5 rounded-full border border-[#E2CEF9]" dir="ltr">
              <span className="text-[11px] font-black text-[#8843C7] flex items-center gap-1">
                <span>Start</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold text-gray-700" dir="rtl">
                الكتابة بالإنجليزية من اليسار إلى اليمين
              </span>
              <span className="text-[11px] font-black text-[#8843C7]">Finish</span>
            </div>

            {/* Ordered Letter Slots: Strictly Left to Right (LTR) */}
            <div 
              className="flex items-center justify-center gap-2.5 sm:gap-3 mb-5 p-3 sm:p-4 bg-white rounded-2xl border-4 border-dashed border-[#A55EEA] max-w-md mx-auto shadow-inner" 
              dir="ltr"
            >
              {Array.from({ length: spellingWords[currentSpellingIdx].letters.length }).map((_, slotIdx) => {
                const letter = selectedLetters[slotIdx];
                const isFilled = Boolean(letter);

                return (
                  <motion.div
                    key={slotIdx}
                    initial={false}
                    animate={isFilled ? { scale: [0.85, 1.1, 1] } : { scale: 1 }}
                    onClick={() => isFilled && handleRemoveLetter(slotIdx)}
                    className={`w-13 sm:w-16 h-16 sm:h-20 rounded-2xl flex flex-col items-center justify-between p-1.5 sm:p-2 transition-all select-none ${
                      isFilled
                        ? 'bg-gradient-to-t from-[#8843C7] to-[#A55EEA] text-white border-3 border-[#67299E] shadow-[0_4px_0_0_#67299E] cursor-pointer hover:brightness-110 active:scale-95'
                        : slotIdx === selectedLetters.length
                        ? 'bg-[#FAF6FE] border-3 border-dashed border-[#A55EEA] ring-4 ring-[#E2CEF9] text-[#A55EEA]'
                        : 'bg-gray-50 border-3 border-dashed border-gray-300 text-gray-400'
                    }`}
                  >
                    <span className="text-[9px] sm:text-[10px] font-black opacity-70">
                      #{slotIdx + 1}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black">
                      {isFilled ? letter : '_'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-bold opacity-60">
                      {isFilled ? 'إزالة ✖' : 'حرف ' + (slotIdx + 1)}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Letter Choices (Jumbled): Click to append from Left to Right */}
            <div className="flex justify-center gap-2.5 sm:gap-3 max-w-sm mx-auto mb-5 flex-wrap" dir="ltr">
              {jumbledLetters.map((l, i) => (
                <motion.button
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  key={i}
                  onClick={() => handleSpellingLetterClick(l, i)}
                  disabled={hasAnswered}
                  className="w-13 sm:w-16 h-13 sm:h-16 bg-white hover:bg-[#F5EDFD] text-[#4D4D4D] font-black text-2xl sm:text-3xl rounded-2xl shadow-[0_5px_0_0_#D1D1D1] border-4 border-gray-200 active:translate-y-[2px] active:shadow-none transition cursor-pointer flex items-center justify-center select-none"
                  id={`english-choice-${i}`}
                >
                  {l}
                </motion.button>
              ))}
            </div>

            {selectedLetters.length > 0 && !hasAnswered && (
              <button
                onClick={resetSpelling}
                className="bg-white text-gray-700 border-3 border-gray-400 py-1.5 px-4 rounded-xl shadow-[0_3px_0_0_#9CA3AF] active:translate-y-[2px] transition cursor-pointer font-black text-xs inline-flex items-center gap-1 mx-auto"
                id="reset-english-spelling-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" /> إعادة ترتيب الحروف
              </button>
            )}
          </div>
        )}

        {/* Feedback Section (Clean Bilingual with proper English LTR) */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`mt-6 p-5 rounded-[24px] border-4 flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white ${
                feedback.isCorrect
                  ? 'border-[#4ECDC4] shadow-[0_6px_0_0_#3DA199]'
                  : 'border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130]'
              }`}
              id="english-feedback-box"
            >
              <div className="text-4xl shrink-0">{feedback.isCorrect ? '🎉✨' : '💡🦉'}</div>
              <div className="flex-1 w-full text-center sm:text-left" dir="ltr">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h4 className={`font-black text-xl ${feedback.isCorrect ? 'text-[#2D8E87]' : 'text-[#CC7130]'}`}>
                    {feedback.isCorrect ? 'Amazing Job! 🌟' : "Let's think about it! 💭"}
                  </h4>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800" dir="rtl">
                    {feedback.isCorrect ? 'تهجئة ممتازة من اليسار لليمين' : 'تذكّر: الإنجليزية من اليسار لليمين'}
                  </span>
                </div>

                <p className="text-gray-700 font-bold text-sm leading-relaxed mb-1" dir="ltr">
                  {feedback.message}
                </p>
                
                <div className="mt-4 flex items-center justify-center sm:justify-start gap-3" dir="ltr">
                  <button
                    onClick={nextQuestion}
                    className="bg-[#FFD93D] hover:bg-[#F6CD28] text-[#4D4D4D] border-4 border-[#7A6A24] font-black px-6 py-2.5 rounded-xl shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1B02B] active:translate-y-[3px] active:shadow-none transition-all duration-100 flex items-center gap-2 cursor-pointer"
                    id="next-english-question-btn"
                  >
                    <span>Next Word</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {activeMode === 'spelling' && (
                    <button
                      onClick={() => speakEnglish(spellingWords[currentSpellingIdx].word)}
                      className="p-2.5 bg-[#F5EDFD] hover:bg-[#E2CEF9] text-[#8843C7] rounded-xl border-2 border-[#A55EEA] cursor-pointer transition flex items-center gap-1.5 text-xs font-black"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Listen Again</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
