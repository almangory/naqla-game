/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Star, Award, ChevronRight, HelpCircle, Flame } from 'lucide-react';

interface MathGameProps {
  addStars: (amount: number) => void;
}

type MathMode = 'counting' | 'arithmetic' | 'logic';

export default function MathGame({ addStars }: MathGameProps) {
  const [activeMode, setActiveMode] = useState<MathMode>('counting');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // --- 1. Counting Mode States ---
  const [countItems, setCountItems] = useState<{ emoji: string; count: number }>({ emoji: '🍎', count: 4 });
  const [countOptions, setCountOptions] = useState<number[]>([]);

  // --- 2. Arithmetic Train States ---
  const [numA, setNumA] = useState(4);
  const [numB, setNumB] = useState(2);
  const [operation, setOperation] = useState<'+' | '-'>('+');
  const [mathOptions, setMathOptions] = useState<number[]>([]);

  // --- 3. Logic Questions States ---
  const [currentLogicIdx, setCurrentLogicIdx] = useState(0);
  const logicQuestions = [
    {
      question: 'أيهما أثقل وزناً يا عبقري: كيلو غرام من القطن المنفوش ☁️ أم كيلو غرام من الحديد الثقيل ⚓؟',
      options: ['الحديد أثقل ⚓', 'القطن أثقل ☁️', 'متساويان في الوزن! ⚖️'],
      correctIdx: 2,
      explanation: 'يا لك من بطل! كلاهما يزن كيلو غرام واحد، لذا هما متساويان تماماً بالرغم من أن الحديد صلب والقطن منفوش!'
    },
    {
      question: 'صندوق يحتوي على تفاحتين 🍎🍎. إذا أخذت تفاحة ثالثة ووضعتها بالداخل، ثم أكلت تفاحتين، كم يتبقى في الصندوق؟',
      options: ['3 تفاحات', 'تفاحة واحدة 🍎', '0 تفاحات'],
      correctIdx: 1,
      explanation: 'رائع جداً! كان هناك 2 تفاحة + 1 تفاحة = 3 تفاحات. أكلت 2 فتبقى تفاحة واحدة في الصندوق!'
    },
    {
      question: 'لدى أحمد 5 شمعات مضيئة 🕯️🕯️🕯️🕯️🕯️. هبت الريح وأطفأت شمعتين. كم شمعة بقيت في الغرفة؟',
      options: ['3 شمعات', '5 شمعات 🕯️', '2 شمعة'],
      correctIdx: 1,
      explanation: 'ذكي للغاية! الشموع لم تختفِ، بقيت الشمعات الخمس بالكامل في الغرفة، منها شمعتان مطفأتان وثلاث مضيئة!'
    },
    {
      question: 'إذا كان عمر مها 6 سنوات، وعمر أخيها سليم نصف عمرها. بعد 4 سنوات، كم يصبح عمر سليم؟',
      options: ['3 سنوات', '7 سنوات 👦', '10 سنوات'],
      correctIdx: 1,
      explanation: 'مبهر! نصف الـ 6 سنوات هو 3 سنوات (عمر سليم الآن). بعد 4 سنوات: 3 + 4 = 7 سنوات!'
    }
  ];

  // Initialize counting question
  const initCountingQuestion = () => {
    const emojis = ['🍎', '🍓', '🍌', '🥕', '⭐', '🎈', '🦖', '🚗', '🐱', '🐝'];
    const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const count = Math.floor(Math.random() * 8) + 2; // 2 to 9
    
    // Generate 4 unique options
    const optionsSet = new Set<number>();
    optionsSet.add(count);
    while (optionsSet.size < 4) {
      optionsSet.add(Math.floor(Math.random() * 9) + 1);
    }
    
    setCountItems({ emoji: selectedEmoji, count });
    setCountOptions(Array.from(optionsSet).sort((a, b) => a - b));
    setFeedback(null);
    setHasAnswered(false);
  };

  // Initialize math question
  const initMathQuestion = () => {
    const op = Math.random() > 0.5 ? '+' : '-';
    let a = Math.floor(Math.random() * 7) + 3; // 3 to 9
    let b = Math.floor(Math.random() * (a - 1)) + 1; // 1 to a-1 (to avoid negative answers in subtraction)
    
    const correctAnswer = op === '+' ? a + b : a - b;

    const optionsSet = new Set<number>();
    optionsSet.add(correctAnswer);
    while (optionsSet.size < 4) {
      optionsSet.add(Math.max(0, Math.floor(Math.random() * 16)));
    }

    setNumA(a);
    setNumB(b);
    setOperation(op as any);
    setMathOptions(Array.from(optionsSet).sort((a, b) => a - b));
    setFeedback(null);
    setHasAnswered(false);
  };

  // Initialize on load & mode changes
  useEffect(() => {
    if (activeMode === 'counting') {
      initCountingQuestion();
    } else if (activeMode === 'arithmetic') {
      initMathQuestion();
    } else {
      setFeedback(null);
      setHasAnswered(false);
    }
  }, [activeMode, currentLogicIdx]);

  // Handle Answers
  const handleCountingAnswer = (option: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);

    if (option === countItems.count) {
      setFeedback({ isCorrect: true, message: 'إجابة عبقرية! لقد عددت بشكل صحيح تماماً! 🥳🎉' });
      setScore(prev => prev + 1);
      addStars(10);
    } else {
      setFeedback({ isCorrect: false, message: `أوه، إجابة غير صحيحة. حاول مجدداً يا بطل، العدد الصحيح هو ${countItems.count}.` });
    }
  };

  const handleMathAnswer = (option: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    const correct = operation === '+' ? numA + numB : numA - numB;

    if (option === correct) {
      setFeedback({ isCorrect: true, message: `صح ممتاز! ${numA} ${operation} ${numB} يساوي بالفعل ${correct}! 🚂💨` });
      setScore(prev => prev + 1);
      addStars(10);
    } else {
      setFeedback({ isCorrect: false, message: `أوه، ليس تماماً. الإجابة الصحيحة هي ${correct}. ستبدع في السؤال القادم!` });
    }
  };

  const handleLogicAnswer = (optionIdx: number) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    const quest = logicQuestions[currentLogicIdx];

    if (optionIdx === quest.correctIdx) {
      setFeedback({ isCorrect: true, message: quest.explanation });
      setScore(prev => prev + 1);
      addStars(15); // Extra stars for critical thinking logic!
    } else {
      setFeedback({ isCorrect: false, message: `أوه! فكر بالأمر بذكاء: ${quest.explanation}` });
    }
  };

  const handleNextQuestion = () => {
    if (activeMode === 'counting') {
      initCountingQuestion();
    } else if (activeMode === 'arithmetic') {
      initMathQuestion();
    } else {
      setHasAnswered(false);
      setFeedback(null);
      setCurrentLogicIdx(prev => (prev + 1) % logicQuestions.length);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FFB800] shadow-[0_8px_0_0_#CC9300]" id="math-game-container">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-[#FFFDF5] pb-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#CC9300] flex items-center gap-2">
            🧮 لعبة العبقري الصغير والرياضيات 🧠
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">تحديات الحساب والتفكير النقدي التي تنمي ذكاء الأطفال!</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-[#FFFDF5] px-4 py-2 rounded-2xl border-4 border-[#FFB800]">
          <span className="text-sm font-black text-[#CC9300]">نقاط اللعب الحالي:</span>
          <span className="bg-[#FFD93D] text-[#7A6A24] border-2 border-[#7A6A24] font-black px-3 py-1 rounded-full text-lg shadow-sm">
            {score} 🏆
          </span>
        </div>
      </div>

      {/* Mode Switches */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8">
        <button
          onClick={() => setActiveMode('counting')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-4 cursor-pointer ${
            activeMode === 'counting'
              ? 'bg-[#FFB800] border-[#CC9300] text-amber-950 shadow-[0_4px_0_0_#CC9300] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="mode-counting"
        >
          🔢 العداد السحري لربط الأرقام
        </button>
        <button
          onClick={() => setActiveMode('arithmetic')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-4 cursor-pointer ${
            activeMode === 'arithmetic'
              ? 'bg-[#FFB800] border-[#CC9300] text-amber-950 shadow-[0_4px_0_0_#CC9300] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="mode-arithmetic"
        >
          🚂 قطار العمليات الحسابية
        </button>
        <button
          onClick={() => setActiveMode('logic')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-4 cursor-pointer ${
            activeMode === 'logic'
              ? 'bg-[#FFB800] border-[#CC9300] text-amber-950 shadow-[0_4px_0_0_#CC9300] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="mode-logic"
        >
          💡 ألغاز التفكير النقدي والذكاء
        </button>
      </div>

      {/* Main Question Display Box */}
      <div className="bg-[#FFFDF5] p-6 rounded-[24px] border-4 border-[#FFEAA7] min-h-[250px] flex flex-col justify-between">
        
        {/* COUNTING MODE */}
        {activeMode === 'counting' && (
          <div className="text-center" id="counting-panel">
            <h3 className="text-xl font-black text-[#CC9300] mb-6">عدّ العناصر الرائعة واكتب العدد الصحيح:</h3>
            
            {/* Grid of Emojis to count */}
            <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto mb-8">
              {Array.from({ length: countItems.count }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ delay: i * 0.08 }}
                  className="text-5xl filter drop-shadow select-none"
                >
                  {countItems.emoji}
                </motion.div>
              ))}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
              {countOptions.map((opt, i) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  onClick={() => handleCountingAnswer(opt)}
                  disabled={hasAnswered}
                  className={`py-4 rounded-2xl text-2xl font-black shadow-[0_6px_0_0_#E2E8F0] border-4 transition cursor-pointer ${
                    hasAnswered 
                      ? opt === countItems.count 
                        ? 'bg-[#4ECDC4] text-white border-[#3DA199] shadow-[0_6px_0_0_#3DA199]' 
                        : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none scale-95 opacity-50'
                      : 'bg-white border-gray-200 hover:border-[#FFB800] text-gray-800'
                  }`}
                  id={`counting-opt-${opt}`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* ARITHMETIC TRAIN MODE */}
        {activeMode === 'arithmetic' && (
          <div className="text-center" id="arithmetic-panel">
            <h3 className="text-xl font-black text-[#CC9300] mb-4">ساعد القطار على التقدم بحل المعادلة:</h3>

            {/* Animated Train Equation */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <motion.div
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="bg-[#45AAF2] text-white font-black text-4xl p-6 rounded-3xl border-4 border-[#3888C1] shadow-[0_6px_0_0_#3888C1] relative flex items-center gap-4"
              >
                <span>{numA}</span>
                <span className="text-[#FFD93D]">{operation}</span>
                <span>{numB}</span>
                <span className="text-[#FFD93D]">=</span>
                <span className="bg-[#1B4F72] px-5 py-1.5 rounded-2xl border-2 border-sky-200 text-white animate-pulse">؟</span>
                <div className="absolute -bottom-3 left-10 text-2xl">🚂</div>
              </motion.div>
            </div>

            {/* Balloons answer options */}
            <div className="flex justify-center gap-4 flex-wrap max-w-md mx-auto">
              {mathOptions.map((opt, i) => {
                const correct = operation === '+' ? numA + numB : numA - numB;
                return (
                  <motion.button
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    key={i}
                    onClick={() => handleMathAnswer(opt)}
                    disabled={hasAnswered}
                    className={`px-6 py-4 rounded-2xl text-xl font-black shadow-[0_4px_0_0_#D1D1D1] border-4 transition cursor-pointer flex items-center gap-2 ${
                      hasAnswered
                        ? opt === correct
                          ? 'bg-[#4ECDC4] text-white border-[#3DA199] shadow-[0_4px_0_0_#3DA199]'
                          : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none opacity-50 scale-95'
                        : 'bg-white border-gray-200 hover:border-[#FFB800] text-gray-800'
                    }`}
                    id={`arithmetic-opt-${opt}`}
                  >
                    <span>🎈</span>
                    <span>{opt}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGIC CHALLENGE MODE */}
        {activeMode === 'logic' && (
          <div className="text-right" id="logic-panel">
            <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-2xl border-4 border-[#A55EEA] shadow-[0_4px_0_0_#8843C7]">
              <Flame className="w-5 h-5 text-[#A55EEA]" />
              <h3 className="text-base font-black text-[#8843C7]">سؤال تفكير نقدي رقم {currentLogicIdx + 1} من {logicQuestions.length}:</h3>
            </div>

            <p className="text-lg font-black text-gray-800 leading-relaxed mb-6">
              {logicQuestions[currentLogicIdx].question}
            </p>

            {/* Option Cards */}
            <div className="space-y-3 max-w-xl">
              {logicQuestions[currentLogicIdx].options.map((opt, idx) => {
                const isCorrectIdx = idx === logicQuestions[currentLogicIdx].correctIdx;
                return (
                  <motion.button
                    whileHover={{ x: -6 }}
                    key={idx}
                    onClick={() => handleLogicAnswer(idx)}
                    disabled={hasAnswered}
                    className={`w-full p-4 rounded-2xl text-right font-black text-sm transition shadow-[0_4px_0_0_#E2E8F0] border-4 flex items-center justify-between cursor-pointer ${
                      hasAnswered
                        ? isCorrectIdx
                          ? 'bg-[#4ECDC4] border-[#3DA199] text-white shadow-[0_4px_0_0_#3DA199]'
                          : 'bg-gray-100 text-gray-400 border-gray-300 shadow-none opacity-50 scale-95'
                        : 'bg-white hover:border-[#FFB800] border-gray-200 text-gray-800'
                    }`}
                    id={`logic-opt-${idx}`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isCorrectIdx && <Check className="w-5 h-5 text-white" />}
                  </motion.button>
                );
              })}
            </div>
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
              id="math-feedback-box"
            >
              <div className="text-3xl shrink-0">{feedback.isCorrect ? '🏆' : '🦉'}</div>
              <div className="flex-1">
                <h4 className={`font-black text-lg mb-1 ${feedback.isCorrect ? 'text-[#2D8E87]' : 'text-[#CC7130]'}`}>
                  {feedback.isCorrect ? 'عمل عبقري وممتاز!' : 'حاول مجدداً يا بطل!'}
                </h4>
                <p className="text-gray-700 font-bold text-sm leading-relaxed">{feedback.message}</p>
                
                <button
                  onClick={handleNextQuestion}
                  className="mt-3 bg-[#FFD93D] text-[#4D4D4D] border-4 border-[#7A6A24] font-black px-6 py-2 rounded-xl shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1B02B] active:translate-y-[3px] active:shadow-none transition-all duration-100"
                  id="next-question-btn"
                >
                  التالي <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
