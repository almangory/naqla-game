/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Sparkles, Award, RotateCcw, AlertTriangle, BookOpen, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';

interface SudanQuizProps {
  addStars: (amount: number) => void;
}

interface Riddle {
  id: number;
  question: string;
  options: string[];
  correct: string;
  infoTitle: string;
  abundantInfo: string;
  emoji: string;
}

export default function SudanQuiz({ addStars }: SudanQuizProps) {
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Abundant educational database of Sudan riddles and culture
  const riddles: Riddle[] = [
    {
      id: 1,
      question: "أنا نهر سوداني عظيم وعذب، أنبع من بحيرة تانا في إثيوبيا، وألتقي بالنيل الأبيض في مقرن الخرطوم لنشكل أطول نهر في العالم. فمن أكون؟",
      options: ["النيل الأزرق", "نهر عطبرة", "بحر الغزال"],
      correct: "النيل الأزرق",
      emoji: "🌊",
      infoTitle: "نهر النيل الأزرق وسر جريانه العظيم 🌊",
      abundantInfo: "النيل الأزرق يمد نهر النيل الرئيسي بحوالي 80% إلى 85% من مجمل مياهه خلال فترة الفيضان الصيفية! ينبع من بحيرة تانا في مرتفعات إثيوبيا، ويتميز بقوة جارفة ومياه محملة بالطمي الخصيب المفيد للزراعة. يلتقي مع النيل الأبيض الهادئ في الخرطوم مشكلاً لوحة طبيعية فريدة من تعانق النهرين بلونيهما المختلفين."
    },
    {
      id: 2,
      question: "أنا سرير خشبي سوداني عريق، منسوج بحبال قوية من السعف أو خيوط الجلد، لا يخلو مني أي ديوان أو حوش سوداني للجلوس والترحيب بالضيوف. فمن أكون؟",
      options: ["العنقريب", "الفندك", "المشلعيب"],
      correct: "العنقريب",
      emoji: "🪵",
      infoTitle: "تاريخ وسحر 'العنقريب' السوداني 🪵",
      abundantInfo: "يعتبر العنقريب من أقدم قطع الأثاث التراثية في وادي النيل والسودان، حيث وجدت نماذج شبيهة به في مقابر الفراعنة والملوك الكوشيين في كرمة ومروي! يرمز العنقريب للأصالة والهيبة في المنزل السوداني، وتصنع هياكله يدوياً من أخشاب الغابات الصلبة مثل السيال والطلح، ويُنسج بالدوم أو الجلد ليوفر راحة باردة وطبيعية ممتازة في صيف السودان الحار."
    },
    {
      id: 3,
      question: "أنا معلم أثري مذهل يقع في شمال السودان، شيدتُ قبل آلاف السنين لتكون مدافن لملوك وملكات مملكة كوش. هل تعلم أن عددنا يتجاوز 220؟ فمن أكون؟",
      options: ["أهرامات مروي (البجراوية)", "جزيرة سواكن", "جبل البركل"],
      correct: "أهرامات مروي (البجراوية)",
      emoji: "⛰️",
      infoTitle: "أهرامات مروي (البجراوية) حضارة كوش العريقة ⛰️",
      abundantInfo: "تعتبر أهرامات مروي في منطقة البجراوية شهادة حية على عظمة مملكة كوش النوبية القديمة التي ازدهرت في شمال السودان. تتميز هذه الأهرامات بزواياها الحادة الضيقة وقواعدها الصغيرة مقارنة بأهرامات مصر. كانت هذه الأهرامات مدافن للملوك والملكات الذين حكموا إمبراطورية شاسعة امتدت حتى مصر والشرق الأوسط، وهي مسجلة كأثر عالمي فريد في اليونسكو."
    },
    {
      id: 4,
      question: "أنا إناء طيني فخاري أسود اللون ذو عنق ضيق وقاعدة مستديرة، أصنع فيه القهوة السودانية اللذيذة الممزوجة بالزنجبيل والمستكة والبهارات، فمن أكون؟",
      options: ["الجبنة", "الزير", "الفندك"],
      correct: "الجبنة",
      emoji: "🏺",
      infoTitle: "طقوس 'الجبنة' السودانية والقهوة بالزنجبيل ☕",
      abundantInfo: "الجبنة (بفتح الجيم والباء) هي رمز الكرم والضيافة والونسة الحميمة في السودان. تُصنع الجبنة يدوياً من الطين الأسود الفخاري الحراري المحروق، وتوضع فوق موقد صغير مملوء بالجمر لغلي البن المحمص مع الزنجبيل الطازج والقرفة والمستكة. ترافق جلسة الجبنة طقوس جميلة مثل تزيين المكان بجريد النخل وسعف النخل وبخور التيمام وصينية الفناجين الصغيرة المبهجة."
    },
    {
      id: 5,
      question: "أنا إقليم بركاني جبلي مخضر يقع في غرب السودان، أتميز بطقس بارد معتدل كطقس البحر المتوسط، وتتساقط فيّ الأمطار لتشكل شلالات رائعة وتسقي بساتين الفاكهة كالتفاح والموالح. فمن أكون؟",
      options: ["جبل مرة", "تلال البحر الأحمر", "جبال النوبة"],
      correct: "جبل مرة",
      emoji: "🌲",
      infoTitle: "جنة غرب السودان: جبل مرة الساحر 🌲⛰️",
      abundantInfo: "جبل مرة هو عبارة عن مجموعة من القمم البركانية الخامدة التي ترتفع إلى أكثر من 3000 متر فوق سطح البحر في ولاية وسط دارفور. يتميز الجبل بمناخ فريد شديد الاعتدال، حيث تزرع فيه شتى أنواع الفواكه التي لا تنبت في مناطق السودان الأخرى مثل التفاح والعنب والكمثرى والبرتقال. تكثر فيه العيون الكبريتية والمجاري المائية والشلالات المنحدرة مثل شلال قلول الساحر."
    },
    {
      id: 6,
      question: "أنا مادة طبيعية ثمينة صمغية، يستخرجني الأهل من جذوع أشجار الهشاب والطلح في حزام الصمغ العربي في السودان، ويعتبر السودان أكبر منتج لي في العالم بنسبة تفوق 70%! فمن أكون؟",
      options: ["الصمغ العربي", "القطن طويل التيلة", "زيت السمسم"],
      correct: "الصمغ العربي",
      emoji: "🌳",
      infoTitle: "الصمغ العربي السوداني: الذهب الأصفر الفريد 🌳✨",
      abundantInfo: "الصمغ العربي السوداني هو منتج استراتيجي عالمي هام جداً، يدخل في صناعة الأدوية والأغذية والمشروبات الغازية والحلويات والطباعة لخصائصه الفيزيائية الفريدة. ينمو الصمغ طبيعياً في مناطق كردفان ودارفور والنيل الأزرق عبر طقس 'طق الصمغ' التقليدي حيث يقوم المزارعون بقشط لحاء شجرة الهشاب بلطف لتبدأ الشجرة بإفراز دموع صمغية ذهبية مذهلة تُجمع وتُفرز وتُصدر لكل بقاع الأرض."
    },
    {
      id: 7,
      question: "أنا مروحة يد تراثية سودانية، أنسج يدوياً من سعف النخيل الملون، يستخدمني الأجداد والآباء لتبريد الوجه وتحريك الهواء عند الحر الشديد. فمن أكون؟",
      options: ["الهبابة (الهواية)", "البرش", "المشلعيب"],
      correct: "الهبابة (الهواية)",
      emoji: "🪭",
      infoTitle: "الهبابة اليدوية ومصنوعات السعف التراثية 🪭🌾",
      abundantInfo: "الهبابة أو الهواية هي مروحة يد صغيرة منسوجة ببراعة من خوص أو سعف النخيل، حيث يتم غمر سعف النخيل في الماء ليرطب ثم صبغه بألوان مبهجة مثل الأحمر والأخضر والأصفر، وتنسج يدوياً بنقوش هندسية نوبية تراثية ساحرة. تستخدم لتوليد الهواء البارد اللطيف باليد وتعتبر من التحف التقليدية اللطيفة في التراث الشعبي السوداني."
    }
  ];

  const currentRiddle = riddles[currentRiddleIdx];

  // Speech Synthesizer for Riddles
  const readRiddleAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Timer loop logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
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

  // Restart Timer for Next Question
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
  }, [currentRiddleIdx]);

  const handleSelectAnswer = (opt: string) => {
    if (selectedAnswer !== null || timeLeft === 0) return;
    setSelectedAnswer(opt);
    setIsTimerRunning(false);
    setShowAnswer(true);

    if (opt === currentRiddle.correct) {
      addStars(20);
      setScore(prev => prev + 1);
      setFeedback({
        correct: true,
        message: `إجابة عبقرية صحيحة! 🎉 كسبت 20 نجمة ذهبية لذكائك وتفوقك! ⭐`
      });
      readRiddleAloud("يا سلام عليك يا بطل! إجابة عبقرية وصحيحة!");
    } else {
      setFeedback({
        correct: false,
        message: `أوه! الإجابة غير صحيحة تماماً. الإجابة الصحيحة هي: (${currentRiddle.correct})`
      });
      readRiddleAloud("أوه! إجابة خاطئة، اقرأ المعلومات لتعرف الإجابة الصحيحة!");
    }
  };

  const handleNextRiddle = () => {
    setCurrentRiddleIdx(prev => (prev + 1) % riddles.length);
  };

  const handleResetTimer = () => {
    startTimerForQuestion();
  };

  return (
    <div className="bg-[#FFFDF6] rounded-[32px] p-6 sm:p-8 border-4 border-[#1DD1A1] shadow-[0_8px_0_0_#10AC84]" id="sudan-quiz-container">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-emerald-50 pb-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#E28743] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-orange-700 shadow-sm">
              ألغاز وحقائق سودانية
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#10AC84] mt-1.5 flex items-center gap-2">
            🧠 لغز وفزورة بلمسة سودانية أصيلة ⏱️
          </h2>
          <p className="text-gray-600 font-bold text-sm mt-1">
            حل اللغز قبل انتهاء الوقت المخصص، واقرأ المعلومات الوفيرة جداً عن ملامح وتراث بلاد الكرم والخير!
          </p>
        </div>

        {/* Score & Stars indicators */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="bg-white border-3 border-[#1DD1A1] px-4 py-1.5 rounded-2xl text-xs font-black shadow-sm text-[#10AC84]">
            الألغاز المجابة: <span className="text-sm text-orange-500">{score} / {riddles.length}</span>
          </div>
        </div>
      </div>

      {/* Grid: Riddle area on Left / Top, Information area on Right / Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Riddle & Answer Area (3 columns) */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          <div className="bg-white p-6 rounded-[28px] border-4 border-[#1DD1A1] shadow-[0_6px_0_0_#10AC84] flex flex-col justify-between min-h-[420px]">
            
            {/* Countdown timer & speaker bar */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-black text-xs ${
                timeLeft <= 10 ? 'bg-red-50 border-red-300 text-red-500 animate-pulse' : 'bg-emerald-50 border-emerald-300 text-emerald-600'
              }`} id="quiz-timer">
                <Timer className="w-4 h-4" />
                <span>الوقت المتبقي: {timeLeft} ثانية</span>
              </div>

              <div className="flex gap-2">
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

            {/* Riddle box */}
            <div className="text-right my-auto space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-5xl select-none shrink-0">{currentRiddle.emoji}</span>
                <div>
                  <span className="text-xs font-black text-[#10AC84] bg-emerald-50 px-2 py-0.5 rounded-md">اللغز رقم {currentRiddleIdx + 1}</span>
                  <h3 className="text-lg font-black text-gray-800 leading-relaxed mt-1">
                    {currentRiddle.question}
                  </h3>
                </div>
              </div>

              {/* Multiple choice options */}
              <div className="grid grid-cols-1 gap-2.5 mt-6 pt-4 border-t border-gray-100">
                {currentRiddle.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === currentRiddle.correct;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={selectedAnswer !== null || timeLeft === 0}
                      className={`w-full p-3.5 rounded-2xl border-3 text-right font-black text-sm transition-all cursor-pointer flex items-center justify-between ${
                        selectedAnswer !== null
                          ? isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-black shadow-sm'
                            : isSelected
                              ? 'bg-red-50 border-red-400 text-red-800 font-bold opacity-80'
                              : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                          : 'bg-white border-gray-200 hover:border-[#1DD1A1] text-gray-700 shadow-sm hover:translate-x-1'
                      }`}
                      id={`riddle-option-${idx}`}
                    >
                      <span>{opt}</span>
                      {selectedAnswer !== null && isCorrect && <span className="text-emerald-600 text-xs">إجابة صحيحة ✔️</span>}
                      {selectedAnswer !== null && isSelected && !isCorrect && <span className="text-red-500 text-xs">إجابة خاطئة ❌</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next buttons & feedback footer */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl border text-xs font-black text-center mb-3 ${
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
                  onClick={handleNextRiddle}
                  className="flex-1 bg-[#1DD1A1] text-white border-4 border-[#10AC84] py-2.5 px-4 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1 shadow-[0_3px_0_0_#10AC84] active:translate-y-0.5 active:shadow-none"
                  id="next-riddle-btn"
                >
                  اللغز التالي <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Abundant Information Panel (2 columns) */}
        <div className="lg:col-span-2">
          <div className="bg-white p-5 rounded-[28px] border-4 border-amber-300 shadow-[0_6px_0_0_#D1B02B] min-h-[420px] flex flex-col justify-between">
            
            <div>
              <div className="flex items-center gap-2 border-b-2 border-amber-50 pb-2.5 mb-3">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-[#963E00]">
                  لوحة المعلومات الوفيرة جداً عن السودان 🇸🇩📚
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {showAnswer ? (
                  <motion.div
                    key="info-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3.5 text-right"
                  >
                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 flex items-center gap-1.5">
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
                    <p className="text-xs text-gray-400 font-bold mt-1.5 max-w-[200px] leading-relaxed">
                      عندما تقوم باختيار إجابة اللغز، ستفتح هذه اللوحة لتكشف لك معلومات وفيرة جداً وتاريخية عن السودان الحبيب!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Little info footer advice */}
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-[10px] text-gray-500 text-center font-semibold mt-4">
              💡 السودان غني جداً بالمعالم والكنوز الحضارية والآثار، وثقافة الأهل هي رمز الجود والكرم!
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
