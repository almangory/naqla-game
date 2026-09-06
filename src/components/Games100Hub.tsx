/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Play, 
  Filter, 
  Trophy, 
  Star, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { ALL_100_GAMES, ACADEMIES_INFO, GameCatalogItem } from '../data/gamesCatalog';
import { GameCategory } from '../types';

interface Games100HubProps {
  onLaunchGame: (engine: GameCategory, gameId: string) => void;
  stars: number;
}

export default function Games100Hub({ onLaunchGame, stars }: Games100HubProps) {
  const [selectedAcademy, setSelectedAcademy] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Filtered list
  const filteredGames = useMemo(() => {
    return ALL_100_GAMES.filter((game) => {
      // Academy filter
      if (selectedAcademy !== 'all' && game.academy !== selectedAcademy) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'all' && game.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchDesc = game.desc.toLowerCase().includes(q);
        const matchSkills = game.skillsLearned.some(s => s.toLowerCase().includes(q));
        const matchAcademy = game.academyName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSkills && !matchAcademy) {
          return false;
        }
      }
      return true;
    });
  }, [selectedAcademy, selectedDifficulty, searchQuery]);

  const handleLaunch = (game: GameCatalogItem) => {
    // Map catalog engine string to GameCategory
    const engineMap: Record<string, GameCategory> = {
      alphabet_train: 'alphabet_train',
      kids_coding: 'kids_coding',
      science: 'science',
      math: 'math',
      arabic: 'arabic',
      english: 'english',
      pyramid_stacker: 'pyramid_stacker',
      sudan_rhythm: 'sudan_rhythm',
      sudan_explore: 'sudan_explore',
      sudan_quiz: 'sudan_quiz',
      sudan_memory: 'sudan_memory',
      sudan_dictionary: 'sudan_dictionary',
      drawing: 'drawing',
      companion: 'companion',
      shop: 'shop',
      rewards: 'rewards'
    };

    const targetCategory: GameCategory = engineMap[game.engine] || 'alphabet_train';
    onLaunchGame(targetCategory, game.id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: 100 EDUCATIONAL GAMES HUB                                 */}
      {/* ========================================================================= */}
      <div className="clay-card rounded-[36px] p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-2 border-white/80 shadow-[0_16px_40px_rgba(108,92,231,0.25)]">
        
        {/* Background Decorative Emojis */}
        <div className="absolute top-2 left-6 text-5xl opacity-20 select-none animate-pulse">
          🚂🏎️🔬🧮
        </div>
        <div className="absolute bottom-2 right-12 text-6xl opacity-15 select-none animate-bounce">
          🇸🇩👑🤖🎨
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 clay-pill bg-white/20 backdrop-blur-md px-4 py-1 text-xs font-black mb-3 border-white/40 text-yellow-300">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>موسوعة ألعاب نقلة الذكية العالمية • 100 لعبة تعليمية تفاعلية</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight drop-shadow-sm">
              أكاديمية الـ 100 لعبة للأبطال الصغار 🌟
            </h1>
            
            <p className="text-xs sm:text-sm font-bold text-white/95 mt-2 leading-relaxed">
              منهاج تعليمي متكامل يجمع قطار الحروف الإنجليزية، سباق السيارات، مختبرات العلوم الواقعية، الرياضيات، حضارة كوش، وبرمجة الروبوتات!
            </p>
          </div>

          {/* Quick Hub Stats Card */}
          <div className="clay-card rounded-[28px] p-4 sm:p-5 text-[#26214B] shadow-xl flex items-center gap-4 shrink-0 bg-white/90">
            <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl border-2 border-white shadow-md select-none">
              🏆
            </div>
            <div>
              <span className="clay-pill px-2.5 py-0.5 text-[10px] font-black text-amber-900 border-amber-200">
                مكتبة الألعاب التفاعلية
              </span>
              <h3 className="text-2xl font-black text-[#26214B] mt-1">100 / 100</h3>
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>جاهزة للعب الفوري</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER DOCK                                                   */}
      {/* ========================================================================= */}
      <div className="clay-card rounded-[32px] p-5 space-y-4">
        
        {/* Search Bar & Difficulty */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن لعبة، مهارة، أو موضوع (مثال: قطار، كيمياء، سيارة، كوش، جمع)..."
              className="w-full bg-white/80 border-2 border-purple-100 rounded-2xl py-3 pr-11 pl-4 text-xs sm:text-sm font-black text-[#26214B] focus:outline-none focus:border-purple-400 focus:bg-white transition shadow-inner"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 hover:text-gray-600"
              >
                مسح ✕
              </button>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-1.5 bg-purple-50/60 p-1.5 rounded-2xl shrink-0 w-full sm:w-auto justify-center border border-purple-100">
            <span className="text-xs font-black text-[#635B9F] px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>المستوى:</span>
            </span>
            {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`clay-pill px-3 py-1 text-xs font-black transition cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'clay-pill-active scale-105'
                    : 'text-gray-700 hover:bg-white'
                }`}
              >
                {diff === 'all' && 'الكل'}
                {diff === 'easy' && 'سهل 🌱'}
                {diff === 'medium' && 'متوسط 🌟'}
                {diff === 'hard' && 'تحدي 🔥'}
              </button>
            ))}
          </div>
        </div>

        {/* Academies Tab Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
          {ACADEMIES_INFO.map((academy) => (
            <button
              key={academy.id}
              onClick={() => setSelectedAcademy(academy.id)}
              className={`clay-pill px-4 py-2 text-xs font-black shrink-0 transition cursor-pointer ${
                selectedAcademy === academy.id
                  ? 'clay-pill-active scale-105'
                  : 'text-[#26214B] hover:bg-white'
              }`}
            >
              {academy.name}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. GAMES GRID DISPLAY (CARDS OF THE 100 GAMES)                            */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between px-2 mb-3">
          <h3 className="text-sm sm:text-base font-black text-[#26214B] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>نتائج الألعاب المتاحة ({filteredGames.length} لعبة):</span>
          </h3>
          <span className="text-xs font-bold text-[#635B9F]">
            انقر على أي لعبة للانطلاق فوراً 🚀
          </span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="clay-card rounded-[32px] p-12 text-center border-dashed border-gray-300">
            <div className="text-5xl mb-3">🔍🦉</div>
            <h4 className="text-lg font-black text-[#26214B]">لم يتم العثور على ألعاب تطابق بحثك</h4>
            <p className="text-xs font-bold text-[#635B9F] mt-1">
              جرّب تغيير كلمات البحث أو اختيار أكاديمية أخرى!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAcademy('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 clay-btn-coral px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-md"
            >
              عرض كل الـ 100 لعبة 🌟
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.id}
                whileHover={{ y: -4 }}
                className="clay-card rounded-[30px] p-4 sm:p-5 flex flex-col justify-between transition-all group hover:shadow-[0_16px_36px_rgba(108,92,231,0.15)]"
              >
                <div>
                  {/* Card Header: Icon, Badge, Stars */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-gradient-to-tr from-purple-100 to-indigo-50 rounded-2xl flex items-center justify-center text-3xl border border-white/80 shadow-xs group-hover:scale-110 transition-transform">
                      {game.icon}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="clay-pill px-2.5 py-0.5 text-[10px] font-black text-indigo-900 border-indigo-100">
                        {game.badge}
                      </span>
                      <span className="clay-pill px-2 py-0.5 text-[10px] font-black text-amber-700 flex items-center gap-0.5 border-amber-200">
                        ⭐ +{game.starsReward}
                      </span>
                    </div>
                  </div>

                  {/* Title & Academy */}
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded-lg inline-block mb-1 border border-indigo-100">
                    {game.academyName} • {game.ageGroup}
                  </span>
                  
                  <h4 className="text-base font-black text-[#26214B] line-clamp-1 group-hover:text-purple-700 transition-colors">
                    {game.title}
                  </h4>

                  <p className="text-xs font-bold text-[#635B9F] line-clamp-2 mt-1.5 leading-relaxed">
                    {game.desc}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {game.skillsLearned.slice(0, 2).map((skill, sIdx) => (
                      <span key={sIdx} className="bg-white/80 text-[#635B9F] text-[9px] font-black px-2 py-0.5 rounded-md border border-purple-100">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="border-t border-white/60 pt-3 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] font-black text-[#635B9F]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>لعبة #{idx + 1}</span>
                  </div>

                  <button
                    onClick={() => handleLaunch(game)}
                    className="clay-btn-coral px-4 py-2 text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
                  >
                    <span>العب الآن</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
