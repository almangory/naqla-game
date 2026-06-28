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
    { word: 'STAR', letters: ['S', 'T', 'A', 'R'], emoji: '⭐', hint: 'A shining star in the sky' }
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
        message: `Awesome! The small brother of letter (${currentUpper}) is indeed (${lower})! (${correctPair.word}) ⭐`
      });
      setScore(prev => prev + 1);
      addStars(10);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Oops! The correct small letter for (${currentUpper}) is (${correctPair?.lower}). You will get it next time!`
      });
    }
  };

  // Spelling letter clicks
  const handleSpellingLetterClick = (letter: string, index: number) => {
    if (hasAnswered) return;

    const updatedSelected = [...selectedLetters, letter];
    setSelectedLetters(updatedSelected);

    const updatedJumbled = [...jumbledLetters];
    updatedJumbled.splice(index, 1);
    setJumbledLetters(updatedJumbled);

    const targetItem = spellingWords[currentSpellingIdx];

    if (updatedSelected.length === targetItem.letters.length) {
      setHasAnswered(true);
      const isCorrect = updatedSelected.join('') === targetItem.word;
      speakEnglish(targetItem.word);

      if (isCorrect) {
        setFeedback({
          isCorrect: true,
          message: `Great Job spelling champion! You spelled "${targetItem.word}" ${targetItem.emoji} perfectly! 🎉`
        });
        setScore(prev => prev + 1);
        addStars(15);
      } else {
        setFeedback({
          isCorrect: false,
          message: `Nice try! The correct spelling is: ${targetItem.letters.join(' - ')}`
        });
      }
    }
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
          <h2 className="text-3xl font-black text-[#8843C7] flex items-center gap-2">
            🇬🇧 مغامرة اللغة الإنجليزية الممتعة 🚀
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">طابق الحروف الكبيرة والصغيرة وركب الكلمات الإنجليزية البسيطة!</p>
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
          className={`px-6 py-3 rounded-2xl text-lg font-black transition-all border-4 cursor-pointer ${
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
          className={`px-6 py-3 rounded-2xl text-lg font-black transition-all border-4 cursor-pointer ${
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
      <div className="bg-[#FAF6FE] p-6 rounded-[24px] border-4 border-[#E2CEF9] min-h-[300px] flex flex-col justify-between">
        
        {/* CASE MATCHING */}
        {activeMode === 'cases' && (
          <div className="text-center" id="english-cases-panel">
            <h3 className="text-xl font-black text-[#8843C7] mb-6">طابق الحرف الكبير بالأخ الصغير المناسب له:</h3>

            {/* Large Target Upper Case */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                onClick={() => speakEnglish(currentUpper)}
                className="w-28 h-28 bg-[#A55EEA] border-4 border-[#8843C7] text-white text-6xl font-black rounded-3xl flex items-center justify-center shadow-[0_6px_0_0_#8843C7] cursor-pointer relative hover:scale-105 transition-all"
                id="target-uppercase-box"
              >
                <span>{currentUpper}</span>
                <span className="absolute -bottom-1 -left-1 bg-[#FFD93D] border-2 border-[#7A6A24] p-1 rounded-full shadow text-xs">
                  <Volume2 className="w-3.5 h-3.5 text-[#7A6A24]" />
                </span>
              </motion.div>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
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
                    className={`py-6 rounded-2xl text-4xl font-black shadow-[0_6px_0_0_#E2E8F0] border-4 transition cursor-pointer ${
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
            <h3 className="text-xl font-black text-[#8843C7] mb-2">رتب الحروف المبعثرة لتهجئة الكلمة:</h3>
            <p className="text-sm text-gray-500 mb-4 font-bold flex items-center justify-center gap-1">
              تلميح: {spellingWords[currentSpellingIdx].hint}
            </p>

            {/* Visual Emoji Card */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-7xl bg-white p-4 rounded-3xl shadow-[0_6px_0_0_#D1D1D1] border-4 border-gray-200 w-28 h-28 flex items-center justify-center select-none">
                {spellingWords[currentSpellingIdx].emoji}
              </div>
            </div>

            {/* Spelling slots filled */}
            <div className="flex justify-center gap-3 mb-6 min-h-[64px] bg-white p-4 rounded-2xl border-4 border-dashed border-[#E2CEF9] max-w-sm mx-auto">
              {selectedLetters.map((l, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-10 h-10 bg-[#A55EEA] text-white font-black text-lg rounded-xl flex items-center justify-center shadow-[0_3px_0_0_#8843C7]"
                >
                  {l}
                </motion.div>
              ))}
              {selectedLetters.length === 0 && (
                <p className="text-gray-400 text-sm py-1 font-bold">Click the letters below to spell...</p>
              )}
            </div>

            {/* Choices */}
            <div className="flex justify-center gap-3 max-w-xs mx-auto mb-6">
              {jumbledLetters.map((l, i) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => handleSpellingLetterClick(l, i)}
                  disabled={hasAnswered}
                  className="w-14 h-14 bg-white hover:bg-[#F5EDFD] text-[#4D4D4D] font-black text-2xl rounded-2xl shadow-[0_4px_0_0_#D1D1D1] border-4 border-gray-200 active:translate-y-[2px] transition cursor-pointer flex items-center justify-center"
                  id={`english-choice-${i}`}
                >
                  {l}
                </motion.button>
              ))}
            </div>

            {selectedLetters.length > 0 && !hasAnswered && (
              <button
                onClick={resetSpelling}
                className="bg-white text-gray-700 border-4 border-gray-400 py-1.5 px-4 rounded-xl shadow-[0_3px_0_0_#9CA3AF] active:translate-y-[2px] transition cursor-pointer font-black text-xs inline-flex items-center gap-1 mx-auto"
                id="reset-english-spelling-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
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
              id="english-feedback-box"
            >
              <div className="text-3xl shrink-0">{feedback.isCorrect ? '✨' : '🦉'}</div>
              <div className="flex-1 text-right">
                <h4 className={`font-black text-lg mb-1 ${feedback.isCorrect ? 'text-[#2D8E87]' : 'text-[#CC7130]'}`}>
                  {feedback.isCorrect ? 'Amazing Job!' : 'Let\'s think about it!'}
                </h4>
                <p className="text-gray-700 font-bold text-sm leading-relaxed">{feedback.message}</p>
                
                <button
                  onClick={nextQuestion}
                  className="mt-3 bg-[#FFD93D] text-[#4D4D4D] border-4 border-[#7A6A24] font-black px-6 py-2 rounded-xl shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1B02B] active:translate-y-[3px] active:shadow-none transition-all duration-100"
                  id="next-english-question-btn"
                >
                  Next Question <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
