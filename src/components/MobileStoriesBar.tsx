import React from 'react';
import { motion } from 'motion/react';
import { GameCategory } from '../types';

interface StoryItem {
  id: GameCategory;
  title: string;
  emoji: string;
  bgGradient: string;
  isHot?: boolean;
}

interface MobileStoriesBarProps {
  onSelectGame: (gameId: GameCategory) => void;
  playClickSound?: () => void;
}

export const MobileStoriesBar: React.FC<MobileStoriesBarProps> = ({
  onSelectGame,
  playClickSound
}) => {
  const stories: StoryItem[] = [
    { id: 'games_100_hub', title: '100 لعبة', emoji: '🌟', bgGradient: 'from-amber-400 to-red-500', isHot: true },
    { id: 'jigsaw_puzzle', title: 'البزل', emoji: '🧩', bgGradient: 'from-fuchsia-500 to-indigo-600', isHot: true },
    { id: 'alphabet_train', title: 'قطار الحروف', emoji: '🚂', bgGradient: 'from-blue-500 to-indigo-600', isHot: true },
    { id: 'kids_coding', title: 'البرمجة', emoji: '🤖', bgGradient: 'from-purple-500 to-indigo-600', isHot: true },
    { id: 'pyramid_stacker', title: 'الأهرامات', emoji: '⛰️', bgGradient: 'from-amber-400 to-orange-500', isHot: true },
    { id: 'sudan_rhythm', title: 'الأورغن', emoji: '🎹', bgGradient: 'from-purple-500 to-indigo-600', isHot: true },
    { id: 'drawing', title: 'المرسم', emoji: '🎨', bgGradient: 'from-pink-500 to-purple-500' },
    { id: 'science', title: 'العلوم', emoji: '🧪', bgGradient: 'from-cyan-400 to-blue-500' },
    { id: 'math', title: 'الحساب', emoji: '🧮', bgGradient: 'from-emerald-400 to-teal-500' },
    { id: 'arabic', title: 'الحروف', emoji: '📝', bgGradient: 'from-green-500 to-emerald-600' },
    { id: 'english', title: 'English', emoji: '🇬🇧', bgGradient: 'from-yellow-400 to-amber-500' },
    { id: 'sudan_explore', title: 'التراث', emoji: '🇸🇩', bgGradient: 'from-amber-600 to-yellow-600' },
    { id: 'sudan_quiz', title: 'الفوازير', emoji: '🧠', bgGradient: 'from-violet-500 to-indigo-600' },
    { id: 'companion', title: 'سمسم AI', emoji: '🦉', bgGradient: 'from-purple-500 to-pink-600' }
  ];

  return (
    <div className="w-full overflow-hidden py-2" dir="rtl">
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-black text-[#26214B] flex items-center gap-1">
          <span>⚡</span>
          <span>مغامرات سريعة اليوم:</span>
        </span>
        <span className="clay-pill px-2.5 py-0.5 text-[10px] font-black text-amber-900 border-amber-200">
          اسحب للاستكشاف 👈
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar px-2 pb-2 snap-x">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              if (playClickSound) playClickSound();
              onSelectGame(story.id);
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer active:scale-95 transition-transform"
            id={`story-item-${story.id}`}
          >
            {/* Story Ring Avatar */}
            <div className={`relative p-1 rounded-full bg-gradient-to-tr ${story.bgGradient} shadow-[0_6px_16px_rgba(108,92,231,0.22)]`}>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl border-2 border-white shadow-inner">
                <motion.span
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="select-none"
                >
                  {story.emoji}
                </motion.span>
              </div>

              {story.isHot && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-xs animate-pulse">
                  جديد 🔥
                </span>
              )}
            </div>

            <span className="text-[11px] font-black text-[#26214B] tracking-tight text-center max-w-[68px] truncate">
              {story.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileStoriesBar;
