import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Flame, Play, ArrowLeft } from 'lucide-react';

interface HeroAdventureBannerProps {
  onPlayFeaturedGame: (gameId: string) => void;
  streak: number;
  level: number;
  stars: number;
}

export const HeroAdventureBanner: React.FC<HeroAdventureBannerProps> = ({
  onPlayFeaturedGame,
  streak,
  level,
  stars
}) => {
  return (
    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#FF9F43] via-[#FF6B6B] to-[#EE5253] p-6 sm:p-9 text-white shadow-[0_12px_36px_rgba(238,82,83,0.35)] border-4 border-white">
      {/* Decorative Ambient Shapes */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-yellow-300/20 blur-3xl" />
      
      {/* Floating Animated Stars & Clouds */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-4 left-10 text-3xl select-none opacity-80"
      >
        ⭐
      </motion.div>
      <motion.div
        animate={{ y: [0, 6, 0], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
        className="pointer-events-none absolute bottom-4 left-1/4 text-2xl select-none opacity-60"
      >
        ✨
      </motion.div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Avatar Mascot & Speech Bubble */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
          {/* Animated Simsim Mascot */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            animate={{ y: [0, -6, 0] }}
            transition={{ y: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }}
            className="w-24 h-24 sm:w-28 sm:h-28 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/60 flex items-center justify-center text-6xl shadow-inner shrink-0 cursor-pointer select-none"
          >
            🦉
          </motion.div>

          <div>
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-300 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black shadow-xs mb-2.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
              <span>مغامرة اليوم المميزة 🇸🇩👑</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              تحدي بناة أهرامات كوش العظيمة!
            </h2>

            <p className="mt-2 text-sm sm:text-base font-bold text-white/90 max-w-xl leading-relaxed">
              يا بطلنا الصغير! شيد أهرامات البجراوية حجراً فوق حجر، واكتشف أسرار ملوك كوش وحقق رقماً قياسياً جديداً! 🌟
            </p>

            {/* Quick Stats Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-black">
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>حماسة {streak} أيام</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>المستوى {level}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-950 px-3 py-1.5 rounded-xl border border-white/40 shadow-xs">
                <span>⭐ جائزة الإكمال: +30 نجمة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Big 3D Play Button */}
        <div className="shrink-0 w-full sm:w-auto">
          <motion.button
            onClick={() => onPlayFeaturedGame('pyramid_stacker')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-7 py-4 bg-[#FFD93D] hover:bg-[#ffe056] text-gray-900 text-lg font-black rounded-2xl border-4 border-white shadow-[0_8px_0_0_#C49E17] active:translate-y-2 active:shadow-none flex items-center justify-center gap-3 cursor-pointer transition-all"
            id="hero-play-featured-btn"
          >
            <div className="w-9 h-9 rounded-full bg-gray-900 text-[#FFD93D] flex items-center justify-center shadow-xs">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <span>انطلق في المغامرة!</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HeroAdventureBanner;
