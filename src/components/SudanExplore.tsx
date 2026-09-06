/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MapPin, 
  Sparkles, 
  Volume2, 
  Award, 
  Heart, 
  CheckCircle2, 
  Search,
  Building2,
  Tractor,
  Wrench
} from 'lucide-react';

import { SUDAN_COMPREHENSIVE_ITEMS, SudanExploreItem } from '../data/sudanComprehensiveData';
import { useSpeech } from '../hooks/useSpeech';
import { useSoundEffects } from '../hooks/useSoundEffects';
import confetti from 'canvas-confetti';

interface SudanExploreProps {
  addStars: (amount: number) => void;
}

type CategoryType = 'landmarks' | 'projects' | 'tools';

export default function SudanExplore({ addStars }: SudanExploreProps) {
  const { speak } = useSpeech();
  const { playCorrect, playWrong, playStarSound } = useSoundEffects();

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('landmarks');
  const [selectedItemId, setSelectedItemId] = useState<string>('pyramids_meroe');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [answeredQuizList, setAnsweredQuizList] = useState<string[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Filtered by category and search
  const categoryItems = useMemo(() => {
    return SUDAN_COMPREHENSIVE_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  // Helper to remove Arabic diacritics (Tashkeel) for flexible searching
  const stripTashkeel = (s: string) => s.replace(/[\u064B-\u065F\u0670]/g, '');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return categoryItems;
    const q = stripTashkeel(searchQuery).toLowerCase().trim();
    return categoryItems.filter(item => 
      stripTashkeel(item.name).toLowerCase().includes(q) || 
      stripTashkeel(item.locationOrUsage).toLowerCase().includes(q) || 
      stripTashkeel(item.summary).toLowerCase().includes(q)
    );
  }, [categoryItems, searchQuery]);

  // Current selected item
  const currentItem: SudanExploreItem = useMemo(() => {
    const found = SUDAN_COMPREHENSIVE_ITEMS.find(item => item.id === selectedItemId);
    if (found && found.category === selectedCategory) return found;
    return filteredItems[0] || categoryItems[0];
  }, [selectedItemId, selectedCategory, filteredItems, categoryItems]);

  const pronounceText = (text: string) => {
    speak(text);
  };

  const handleQuizAnswer = (option: string) => {
    if (!currentItem) return;
    if (answeredQuizList.includes(currentItem.id)) return;

    if (option === currentItem.quiz.correct) {
      addStars(currentItem.quiz.reward);
      playCorrect();
      playStarSound();
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setAnsweredQuizList(prev => [...prev, currentItem.id]);
      setQuizFeedback(`إجابة صحيحة مذهلة ومتقنة! كسبت ${currentItem.quiz.reward} نجمة ذهبية في أكاديمية نقلة! ⭐🎉`);
      pronounceText("يا سلام عليك يا بطل! إجابة صحيحة ممتازة!");
    } else {
      playWrong();
      setQuizFeedback('حاول مجدداً يا بطل، اقرأ التفاصيل بالأعلى وستعرف الحل بالتأكيد! ✨🔍');
      pronounceText("أوه! حاول مرة أخرى يا ذكي!");
    }
  };

  return (
    <div className="bg-[#FFF9F2] rounded-[32px] p-5 sm:p-8 border-4 border-[#E28743] shadow-[0_8px_0_0_#963E00] space-y-6 animate-fade-in" id="sudan-explore-container" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & GREETINGS                                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap justify-between items-center border-b-4 border-orange-100 pb-4 gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#1DD1A1] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-green-700 shadow-xs">
              موسوعة استكشاف السودان الشاملة
            </span>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
              مدن • مشاريع • أدوات 🌴
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#963E00] mt-1.5 flex items-center gap-2">
            <span>استكشاف مدن ومعالم ومشاريع وأدوات السودان</span>
            <span>🌴</span>
          </h2>
          <p className="text-gray-600 font-bold text-xs sm:text-sm mt-1">
            تعرّف على كافة مدن ومعالم السودان الأثرية، المشاريع القومية كمشروع الجزيرة، والأدوات التراثية والزراعية الأصيلة!
          </p>
        </div>

        {/* Traditional Greeting Card */}
        <div className="bg-amber-100/70 border-2 border-amber-300 rounded-2xl px-4 py-2 text-right">
          <p className="text-[#963E00] font-black text-xs flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> 
            <span>حبابكم عشرة بلا كشرة!</span>
          </p>
          <p className="text-gray-600 text-[10px] font-bold mt-0.5">
            المعالم المستكشفة: <span className="text-orange-700 font-black">{answeredQuizList.length} / {SUDAN_COMPREHENSIVE_ITEMS.length}</span>
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE COMPREHENSIVE TABS: LANDMARKS / PROJECTS / TOOLS                 */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        <button
          onClick={() => {
            setSelectedCategory('landmarks');
            setSelectedItemId('pyramids_meroe');
            setQuizFeedback(null);
          }}
          className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all border-3 cursor-pointer ${
            selectedCategory === 'landmarks'
              ? 'bg-[#E28743] text-white border-[#963E00] shadow-[0_4px_0_0_#963E00] scale-102'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>🏛️ المدن والمعالم التاريخية ({SUDAN_COMPREHENSIVE_ITEMS.filter(i => i.category === 'landmarks').length})</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('projects');
            setSelectedItemId('gezira_scheme');
            setQuizFeedback(null);
          }}
          className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all border-3 cursor-pointer ${
            selectedCategory === 'projects'
              ? 'bg-[#10AC84] text-white border-[#065F46] shadow-[0_4px_0_0_#065F46] scale-102'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
          }`}
        >
          <Tractor className="w-4 h-4" />
          <span>🚜 المشاريع القومية الكبرى ({SUDAN_COMPREHENSIVE_ITEMS.filter(i => i.category === 'projects').length})</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('tools');
            setSelectedItemId('toriya_tool');
            setQuizFeedback(null);
          }}
          className={`flex items-center gap-2 py-3 px-5 rounded-2xl font-black text-xs sm:text-sm transition-all border-3 cursor-pointer ${
            selectedCategory === 'tools'
              ? 'bg-[#F59E0B] text-white border-[#B45309] shadow-[0_4px_0_0_#B45309] scale-102'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-50'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>🛠️ الأدوات التراثية والزراعية ({SUDAN_COMPREHENSIVE_ITEMS.filter(i => i.category === 'tools').length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH & QUICK ITEM SELECTOR CAROUSEL                                  */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Search input */}
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`ابحث في قسم ${selectedCategory === 'landmarks' ? 'المدن والمعالم' : selectedCategory === 'projects' ? 'المشاريع القومية' : 'الأدوات'}...`}
            className="w-full bg-white border-2 border-orange-200 rounded-2xl py-2.5 pr-10 pl-4 text-xs font-black text-gray-800 focus:outline-none focus:border-orange-500 shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontal Chips Carousel */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
          {filteredItems.map((item) => {
            const isSelected = item.id === currentItem?.id;
            const isAnswered = answeredQuizList.includes(item.id);
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setSelectedItemId(item.id);
                  setQuizFeedback(null);
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 font-black text-xs shrink-0 cursor-pointer shadow-xs transition ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 ring-3 ring-amber-300'
                    : 'bg-white text-gray-800 border-orange-200 hover:border-orange-400'
                }`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-7 h-7 rounded-xl object-cover border border-amber-300 shrink-0 shadow-xs"
                  />
                ) : (
                  <span className="text-xl select-none">{item.emoji}</span>
                )}
                <span className="truncate max-w-[130px]">{item.name}</span>
                {isAnswered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-white shrink-0" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN DETAIL CARD & INTERACTIVE QUIZ                                    */}
      {/* ========================================================================= */}
      {currentItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Info Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 border-4 border-amber-300 shadow-[0_6px_0_0_#D1B02B] space-y-4 text-right">
            
            {/* Authentic High-Definition Heritage Photograph */}
            {currentItem.image && (
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-3 border-amber-300 shadow-md bg-amber-50 group">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3 right-3 bg-black/65 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-xl flex items-center gap-1.5 border border-white/20 shadow-md">
                  <span>🇸🇩</span>
                  <span>صورة حقيقية من أرض وتراث السودان</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {currentItem.name}
                </div>
              </div>
            )}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-100 to-orange-50 rounded-2xl flex items-center justify-center text-4xl border-2 border-amber-300 shadow-inner select-none shrink-0 overflow-hidden">
                  {currentItem.image ? (
                    <img src={currentItem.image} alt={currentItem.name} className="w-full h-full object-cover" />
                  ) : (
                    currentItem.emoji
                  )}
                </div>
                <div>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {currentItem.locationOrUsage}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                    {currentItem.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => pronounceText(currentItem.summary)}
                className="p-3 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl text-amber-800 cursor-pointer shadow-xs transition"
                title="استمع إلى الشرح الصوتي"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
              </button>
            </div>

            {/* Summary Box */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>نبذة استكشافية سريعة:</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed">
                {currentItem.summary}
              </p>
            </div>

            {/* Detailed Educational Paragraph */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-gray-600 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                <span>تفاصيل تاريخية ووطنية موسعة:</span>
              </h4>
              <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200">
                {currentItem.details}
              </p>
            </div>

          </div>

          {/* Interactive Knowledge Challenge Quiz (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-[32px] p-6 border-4 border-[#1DD1A1] shadow-[0_6px_0_0_#10AC84] space-y-4 text-right">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-emerald-900">
                  تحدي ذكاء البطل المستكشف
                </h4>
              </div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                ⭐ +{currentItem.quiz.reward} نجمة
              </span>
            </div>

            <p className="text-xs sm:text-sm font-black text-gray-800 leading-snug">
              ❓ {currentItem.quiz.question}
            </p>

            {/* Options */}
            <div className="space-y-2 pt-2">
              {currentItem.quiz.options.map((option, idx) => {
                const isAnswered = answeredQuizList.includes(currentItem.id);
                const isCorrect = option === currentItem.quiz.correct;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(option)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-2xl border-2 text-right font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${
                      isAnswered
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                        : 'bg-white border-gray-200 hover:border-[#1DD1A1] text-gray-700 hover:bg-emerald-50/40 shadow-xs'
                    }`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <span className="text-emerald-600 text-xs">صحيح ✔️</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback notification */}
            <AnimatePresence>
              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs font-black text-center shadow-xs"
                >
                  {quizFeedback}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-[10px] font-bold text-gray-400 text-center pt-2 border-t border-gray-100">
              💡 أجب على السؤال لكسب النجوم وحفظ المعلم في سجل إنجازاتك!
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
