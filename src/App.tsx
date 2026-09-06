/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Star, 
  Flame, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Maximize2, 
  Minimize2, 
  Gamepad2, 
  Landmark, 
  Palette, 
  Trophy, 
  Home, 
  Compass,
  X,
  Play
} from 'lucide-react';
import { GameCategory, UserStats } from './types';
import { useSoundEffects } from './hooks/useSoundEffects';
import { MobileBottomDock, MobileNavSection } from './components/MobileBottomDock';
import { HeroAdventureBanner } from './components/HeroAdventureBanner';
import { MobileStoriesBar } from './components/MobileStoriesBar';

// Lazy Loaded Game Modules for Performance & Code Splitting
const ScienceGame = lazy(() => import('./components/ScienceGame'));
const MathGame = lazy(() => import('./components/MathGame'));
const ArabicGame = lazy(() => import('./components/ArabicGame'));
const EnglishGame = lazy(() => import('./components/EnglishGame'));
const Companion = lazy(() => import('./components/Companion'));
const ToyShop = lazy(() => import('./components/ToyShop'));
const RewardsPanel = lazy(() => import('./components/RewardsPanel'));
const DrawingGame = lazy(() => import('./components/DrawingGame'));
const SudanExplore = lazy(() => import('./components/SudanExplore'));
const SudanQuiz = lazy(() => import('./components/SudanQuiz'));
const SudanMemory = lazy(() => import('./components/SudanMemory'));
const SudanDictionary = lazy(() => import('./components/SudanDictionary'));
const PyramidStackerGame = lazy(() => import('./components/PyramidStackerGame'));
const SudanRhythmGame = lazy(() => import('./components/SudanRhythmGame'));

// Cheerful Kids Loading Spinner Fallback
const LoadingFallback = () => (
  <div className="min-h-[380px] flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-md rounded-[36px] border-4 border-[#FFD93D] shadow-[0_10px_0_0_#D1B02B] max-w-md mx-auto text-center my-6">
    <motion.div
      animate={{ 
        y: [0, -14, 0],
        rotate: [0, 8, -8, 0]
      }}
      transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      className="text-7xl mb-4 select-none"
    >
      🦉✨
    </motion.div>
    <h3 className="text-2xl font-black text-gray-800 mb-2">سمسم يجهز لك المغامرة...</h3>
    <p className="text-sm font-bold text-amber-900 leading-relaxed">
      حبابك عشرة بلا كشرة! ثوانٍ ونبدأ اللعب والتعلم الممتع! 🇸🇩⭐
    </p>
    <div className="mt-6 flex items-center gap-2">
      <div className="w-3.5 h-3.5 bg-[#FF6B6B] rounded-full animate-ping" />
      <div className="w-3.5 h-3.5 bg-[#FFD93D] rounded-full animate-ping [animation-delay:0.2s]" />
      <div className="w-3.5 h-3.5 bg-[#4ECDC4] rounded-full animate-ping [animation-delay:0.4s]" />
    </div>
  </div>
);

const BG_COLORS = [
  { id: 'cream', name: 'البيج الدافئ 🍦', value: '#FFF9E6' },
  { id: 'sky', name: 'الأزرق السماوي ☁️', value: '#E3F2FD' },
  { id: 'lavender', name: 'الخزامى السحري 🦄', value: '#F3E5F5' },
  { id: 'mint', name: 'النعناع المنعش 🍃', value: '#E8F5E9' },
  { id: 'peach', name: 'الدراق اللطيف 🍑', value: '#FFE0B2' },
  { id: 'rose', name: 'الوردي الجميل 🌸', value: '#FCE4EC' }
];

const AVAILABLE_STICKERS = [
  { id: 'lion', emoji: '🦁', name: 'الأسد الشجاع', category: 'animals' },
  { id: 'panda', emoji: '🐼', name: 'الباندا اللطيف', category: 'animals' },
  { id: 'rabbit', emoji: '🐇', name: 'الأرنب السريع', category: 'animals' },
  { id: 'unicorn', emoji: '🦄', name: 'وحيد القرن السحري', category: 'animals' },
  { id: 'rocket', emoji: '🚀', name: 'الصاروخ السريع', category: 'space' },
  { id: 'saturn', emoji: '🪐', name: 'كوكب زحل الجميل', category: 'space' },
  { id: 'earth', emoji: '🌍', name: 'كوكبنا الأرض', category: 'space' },
  { id: 'alien', emoji: '🛸', name: 'الصحن الطائر', category: 'space' },
  { id: 'balloon', emoji: '🎈', name: 'البالون الملون', category: 'fun' },
  { id: 'icecream', emoji: '🍦', name: 'الآيس كريم اللذيذ', category: 'fun' },
  { id: 'dino', emoji: '🦖', name: 'الديناصور الصغير', category: 'fun' },
  { id: 'star_spark', emoji: '✨', name: 'النجوم البراقة', category: 'fun' },
];

export default function App() {
  const { isMuted, toggleMute, playClick, playStarSound, playLevelUp } = useSoundEffects();

  const [activeTab, setActiveTab] = useState<GameCategory>('home');
  const [mobileNavSection, setMobileNavSection] = useState<MobileNavSection>('home');
  const [activeFilter, setActiveFilter] = useState<'all' | 'sudan' | 'science' | 'languages' | 'arts' | 'brain'>('all');

  // Device Simulator Mode: Toggle between Native Mobile Experience and Desktop Bento Grid
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simsim_kids_mobile_mode');
      if (saved !== null) return saved === 'true';
      return window.innerWidth < 1024;
    }
    return false;
  });

  const [isVisualFullscreen, setIsVisualFullscreen] = useState(false);

  // Background and Sticker settings states
  const [bgColor, setBgColor] = useState<string>(() => {
    return localStorage.getItem('simsim_kids_bg_color') || 'cream';
  });

  const [selectedStickers, setSelectedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('simsim_kids_stickers');
    return saved ? JSON.parse(saved) : ['lion', 'rocket', 'star_spark'];
  });

  // Modal confirmation state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => {});

  // Initialize stats with Local Storage fallback
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('simsim_kids_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      stars: 0,
      level: 1,
      streak: 1,
      badges: [],
      unlockedToys: [],
      activeToy: null,
      lastPlayedDate: new Date().toLocaleDateString()
    };
  });

  // Persist states
  useEffect(() => {
    localStorage.setItem('simsim_kids_bg_color', bgColor);
  }, [bgColor]);

  useEffect(() => {
    localStorage.setItem('simsim_kids_stickers', JSON.stringify(selectedStickers));
  }, [selectedStickers]);

  useEffect(() => {
    localStorage.setItem('simsim_kids_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('simsim_kids_mobile_mode', String(isMobileSimulator));
  }, [isMobileSimulator]);

  // Turn off fullscreen when switching tabs
  useEffect(() => {
    setIsVisualFullscreen(false);
  }, [activeTab]);

  // Handle consecutive streak logic on mount
  useEffect(() => {
    const todayStr = new Date().toLocaleDateString();
    if (stats.lastPlayedDate && stats.lastPlayedDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toLocaleDateString();

      setStats(prev => {
        let newStreak = prev.streak;
        if (prev.lastPlayedDate === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
        return {
          ...prev,
          streak: newStreak,
          lastPlayedDate: todayStr
        };
      });
    }
  }, []);

  // Helpers for rewards and confetti
  const addStars = (amount: number) => {
    setStats(prev => {
      const nextStars = prev.stars + amount;
      const nextLevel = Math.floor(nextStars / 50) + 1;

      playStarSound();

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.75 }
      });

      if (nextLevel > prev.level) {
        playLevelUp();
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.6 }
          });
        }, 300);
      }

      return {
        ...prev,
        stars: nextStars,
        level: nextLevel > prev.level ? nextLevel : prev.level
      };
    });
  };

  const unlockToy = (toyId: string, cost: number) => {
    setStats(prev => {
      if (prev.stars >= cost && !prev.unlockedToys.includes(toyId)) {
        return {
          ...prev,
          stars: prev.stars - cost,
          unlockedToys: [...prev.unlockedToys, toyId]
        };
      }
      return prev;
    });
  };

  const equipToy = (toyEmoji: string | null) => {
    setStats(prev => ({
      ...prev,
      activeToy: toyEmoji
    }));
  };

  const handleStickerClick = () => {
    playStarSound();
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.8 }
    });
  };

  const handleBackClick = () => {
    if (activeTab !== 'home') {
      setConfirmMessage("هل أنت متأكد من مغادرة اللعبة والرجوع للقائمة الرئيسية؟ 🦉⭐");
      setOnConfirm(() => () => {
        setActiveTab('home');
        setShowConfirmModal(false);
      });
      setOnCancel(() => () => {
        setShowConfirmModal(false);
      });
      setShowConfirmModal(true);
    } else {
      setConfirmMessage("هل أنت متأكد من مغادرة أكاديمية نقلة للأطفال؟ سنشتاق إليك كثيراً! 🦉💔");
      setOnConfirm(() => () => {
        setShowConfirmModal(false);
        window.history.back();
      });
      setOnCancel(() => () => {
        setShowConfirmModal(false);
      });
      setShowConfirmModal(true);
    }
  };

  const menuItems = [
    { 
      id: 'home', 
      label: '🏠 الرئيسية', 
      category: 'all', 
      borderColor: 'border-[#FF6B6B]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC5555]',
      bgGradient: 'from-rose-50 to-orange-50',
      badge: 'الرئيسية'
    },
    { 
      id: 'pyramid_stacker', 
      isNew: true, 
      label: '⛰️ بناة أهرامات كوش', 
      category: 'sudan', 
      borderColor: 'border-[#FFD93D]', 
      shadowColor: 'shadow-[0_8px_0_0_#C49E17]', 
      bgGradient: 'from-amber-50 to-yellow-100',
      desc: 'شيد أهرامات البجراوية حجراً فوق حجر واكتشف أسرار ملوك كوش العظام!',
      badge: 'تراث كوش 👑'
    },
    { 
      id: 'sudan_rhythm', 
      isNew: true, 
      label: '🪘 إيقاعات وطبول السودان', 
      category: 'arts', 
      borderColor: 'border-[#FF8E3C]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC7130]', 
      bgGradient: 'from-orange-50 to-amber-100',
      desc: 'مختبر موسيقي لعزف الدلوكة والنقارة والطنبور مع سمسم بإيقاعات حقيقية!',
      badge: 'موسيقى 🎵'
    },
    { 
      id: 'science', 
      label: '🧪 مختبر العلوم والفيزياء', 
      category: 'science', 
      borderColor: 'border-[#45AAF2]', 
      shadowColor: 'shadow-[0_8px_0_0_#3888C1]', 
      bgGradient: 'from-sky-50 to-blue-100',
      desc: 'اكتشف قوانين الجاذبية والسرعة والكثافة وتجارب الحواس الخمس الممتعة!',
      badge: 'علوم 🔬'
    },
    { 
      id: 'math', 
      label: '🧮 قطار الحساب الممتع', 
      category: 'science', 
      borderColor: 'border-[#FF6B6B]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC5555]', 
      bgGradient: 'from-red-50 to-rose-100',
      desc: 'اركب قطار الحساب والرياضيات وحل أمتع المسائل واجمع النجوم الذهبية!',
      badge: 'رياضيات 🔢'
    },
    { 
      id: 'arabic', 
      label: '📝 مملكة الحروف العربية', 
      category: 'languages', 
      borderColor: 'border-[#2ECC71]', 
      shadowColor: 'shadow-[0_8px_0_0_#25A35A]', 
      bgGradient: 'from-emerald-50 to-green-100',
      desc: 'اكتشف جمال لغتنا العربية، رتب الحروف واكشف النقاط لتربح أروع الأوسمة!',
      badge: 'لغتي 📖'
    },
    { 
      id: 'english', 
      label: '🇬🇧 English Alphabet', 
      category: 'languages', 
      borderColor: 'border-[#F1C40F]', 
      shadowColor: 'shadow-[0_8px_0_0_#C19D0C]', 
      bgGradient: 'from-yellow-50 to-amber-100',
      desc: 'Learn english alphabets, trace letters, and write words with cute animations!',
      badge: 'English 🔤'
    },
    { 
      id: 'drawing', 
      label: '🎨 مرسم الألوان السحرية', 
      category: 'arts', 
      borderColor: 'border-[#FF8E3C]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC7130]', 
      bgGradient: 'from-pink-50 to-rose-100',
      desc: 'ارسم لوحات جميلة وضع طوابع التراث السوداني واحفظ لوحتك وشاركها!',
      badge: 'فنون 🖌️'
    },
    { 
      id: 'sudan_dictionary', 
      label: '📖 قاموس نقلة المصور', 
      category: 'sudan', 
      borderColor: 'border-[#1DD1A1]', 
      shadowColor: 'shadow-[0_8px_0_0_#10AC84]', 
      bgGradient: 'from-teal-50 to-emerald-100',
      desc: 'قاموس مصور يربط الكلمات العربية والإنجليزية ببيئة السودان الحبيبة!',
      badge: 'قاموس 🇸🇩'
    },
    { 
      id: 'sudan_explore', 
      label: '🇸🇩 واحة التراث السوداني', 
      category: 'sudan', 
      borderColor: 'border-[#E28743]', 
      shadowColor: 'shadow-[0_8px_0_0_#963E00]', 
      bgGradient: 'from-amber-50 to-orange-100',
      desc: 'تعلم واستكشف معالم السودان الأثرية وأهرامات مروي وتراث أجدادنا الأصيل!',
      badge: 'معالم 🗺️'
    },
    { 
      id: 'sudan_quiz', 
      label: '🧠 ألغاز وفوازير سودانية', 
      category: 'brain', 
      borderColor: 'border-[#1DD1A1]', 
      shadowColor: 'shadow-[0_8px_0_0_#10AC84]', 
      bgGradient: 'from-teal-50 to-cyan-100',
      desc: 'تحديات ذكاء وأسئلة ممتعة جداً عن ثقافة وطبيعة وتاريخ السودان!',
      badge: 'فوازير 💡'
    },
    { 
      id: 'sudan_memory', 
      label: '🧩 لعبة الذاكرة التراثية', 
      category: 'brain', 
      borderColor: 'border-[#FF6B6B]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC5555]', 
      bgGradient: 'from-rose-50 to-pink-100',
      desc: 'اختبر ذاكرتك الحديدية وطابق بطاقات التراث السوداني الأصيل بسرعة!',
      badge: 'ذاكرة 🃏'
    },
    { 
      id: 'companion', 
      label: '🦉 اسأل صديقك سمسم (AI)', 
      category: 'brain', 
      borderColor: 'border-[#6C5CE7]', 
      shadowColor: 'shadow-[0_8px_0_0_#5044AB]', 
      bgGradient: 'from-purple-50 to-indigo-100',
      desc: 'تحدث مع صديقك المرشد الذكي البومة سمسم واسأله أي سؤال يجيبك فوراً!',
      badge: 'ذكاء اصطناعي 🤖'
    },
    { 
      id: 'shop', 
      label: '🧸 متجر تزيين الألعاب', 
      category: 'brain', 
      borderColor: 'border-[#FF8E3C]', 
      shadowColor: 'shadow-[0_8px_0_0_#CC7130]', 
      bgGradient: 'from-orange-50 to-yellow-100',
      desc: 'استخدم نجومك التي كسبتها لشراء أزياء وتزيين رائع لصديقك سمسم!',
      badge: 'متجر 🛍️'
    },
    { 
      id: 'rewards', 
      label: '🏆 لوحة الأوسمة والتقدم', 
      category: 'brain', 
      borderColor: 'border-[#4ECDC4]', 
      shadowColor: 'shadow-[0_8px_0_0_#3DA199]', 
      bgGradient: 'from-emerald-50 to-teal-100',
      desc: 'لوحة أوسمتك التي كسبتها ومستواك الحالي وإحصائيات رحلتك التعليمية!',
      badge: 'إنجازات 🌟'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.id === 'home') return false;
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const sudanHeritageGames = menuItems.filter(item => item.category === 'sudan' || item.id === 'sudan_rhythm');

  const currentBgColor = BG_COLORS.find(c => c.id === bgColor)?.value || '#FFF9E6';

  return (
    <div 
      className="min-h-screen text-[#4D4D4D] font-sans antialiased flex flex-col transition-all duration-500 selection:bg-amber-300" 
      dir="rtl" 
      id="app-root"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL APP BAR & FLOATING HUD (WORLD-CLASS KIDS THEME)            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b-4 border-amber-300 shadow-[0_6px_20px_rgba(255,217,61,0.25)] px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand Logo & Friendly Mascot */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileNavSection('home');
                playClick();
              }}
              className="flex items-center gap-2.5 cursor-pointer group text-right"
              id="header-logo-btn"
            >
              <div className="w-11 h-11 sm:w-13 sm:h-13 bg-gradient-to-tr from-[#FF6B6B] to-[#FF8E3C] rounded-2xl border-3 border-white shadow-[0_4px_0_0_#CC5555] flex items-center justify-center text-2xl sm:text-3xl text-white shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform">
                <motion.span
                  animate={{ rotate: [0, 6, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                  className="select-none"
                >
                  🦉
                </motion.span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-1">
                    <span>أكاديمية نقلة</span>
                    <span className="text-amber-500 text-xs sm:text-base">🇸🇩✨</span>
                  </h1>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-amber-800 line-clamp-1 hidden sm:block">
                  عالم الألعاب الذكية، التراث، وحساب الأبطال
                </p>
              </div>
            </button>
          </div>

          {/* Center / Right Controls: Stats, Sound Toggle, and Mobile Simulator Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Device Mode Switcher (Desktop Bento vs Mobile Parallel Experience) */}
            <button
              onClick={() => {
                setIsMobileSimulator(prev => !prev);
                playClick();
              }}
              className={`px-2.5 sm:px-3 py-1.5 rounded-2xl text-[11px] sm:text-xs font-black border-2 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 ${
                isMobileSimulator 
                  ? 'bg-purple-600 text-white border-purple-800 shadow-[0_3px_0_0_#4c1d95]' 
                  : 'bg-white text-gray-800 border-amber-300 hover:bg-amber-50'
              }`}
              title="تبديل طريقة العرض: نمط الجوال الفائق أو النمط المكتبي"
              id="device-mode-toggle-btn"
            >
              {isMobileSimulator ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  <span className="hidden xs:inline">نمط الجوال 📱</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  <span className="hidden xs:inline">نمط الحاسوب 💻</span>
                </>
              )}
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              className="w-9 h-9 sm:w-11 sm:h-11 bg-white hover:bg-amber-50 border-2 sm:border-3 border-[#FF8E3C] rounded-2xl flex items-center justify-center text-gray-700 shadow-xs cursor-pointer transition-transform active:scale-90"
              title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
              id="sound-toggle-btn"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />}
            </button>

            {/* Streak Counter Pill */}
            <div 
              className="bg-orange-50 text-orange-700 border-2 border-[#FF8E3C] px-2.5 sm:px-3 py-1 rounded-2xl flex items-center gap-1 text-xs font-black shadow-xs shrink-0"
              title={`أيام الحماسة المتواصلة: ${stats.streak}`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-500 text-orange-500" />
              <span>{stats.streak}</span>
            </div>

            {/* Stars Score Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-2xl border-2 sm:border-3 border-[#4ECDC4] flex items-center gap-1.5 shadow-xs shrink-0"
              id="header-stars-badge"
            >
              <span className="text-base sm:text-xl select-none">⭐</span>
              <span className="text-sm sm:text-xl font-black text-[#2D8E87]">{stats.stars}</span>
            </motion.div>

            {/* Avatar / Level Indicator */}
            <div 
              className="relative cursor-pointer select-none"
              onClick={() => {
                if (isMobileSimulator) setMobileNavSection('rewards');
                else setActiveTab('rewards');
                playClick();
              }}
              title="لوحة الأوسمة والمستوى"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 sm:border-3 border-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-xs text-xl sm:text-2xl">
                👦
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#FF6B6B] text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                {stats.level}
              </span>
            </div>

          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. GAME ARENA TOP BAR (WHEN PLAYING ANY GAME)                              */}
      {/* ========================================================================= */}
      {activeTab !== 'home' && (
        <div className="bg-amber-100/90 backdrop-blur-md border-b-2 border-amber-300 px-3 sm:px-6 py-2 flex items-center justify-between sticky top-[57px] sm:top-[69px] z-20 shadow-sm" id="game-active-bar">
          <button
            onClick={handleBackClick}
            className="bg-[#FF6B6B] hover:bg-red-500 text-white font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border-2 border-white shadow-[0_3px_0_0_#CC5555] active:translate-y-1 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
            id="game-back-to-home-btn"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية 🏠</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVisualFullscreen(prev => !prev)}
              className="bg-[#4ECDC4] hover:bg-[#3DA199] text-white font-black px-3 py-1.5 rounded-xl text-xs border-2 border-white shadow-[0_3px_0_0_#3DA199] active:translate-y-1 active:shadow-none flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {isVisualFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">إنهاء ملء الشاشة</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ملء الشاشة 📺</span>
                </>
              )}
            </button>

            <div className="bg-white px-2.5 py-1 rounded-xl border border-amber-300 text-xs font-black text-amber-900 flex items-center gap-1 shadow-xs">
              <span>⭐</span>
              <span>{stats.stars}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CORE CONTENT (DUAL EXPERIENCE: MOBILE APP SIMULATOR vs DESKTOP BENTO)   */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-start">
        
        {/* IF A GAME IS ACTIVE: FULL SCREEN ARENA */}
        {activeTab !== 'home' ? (
          <main className="w-full max-w-7xl mx-auto p-2 sm:p-6 flex-1 pb-20">
            <Suspense fallback={<LoadingFallback />}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  {activeTab === 'pyramid_stacker' && (
                    <PyramidStackerGame addStars={addStars} />
                  )}
                  {activeTab === 'sudan_rhythm' && (
                    <SudanRhythmGame addStars={addStars} />
                  )}
                  {activeTab === 'science' && (
                    <ScienceGame addStars={addStars} />
                  )}
                  {activeTab === 'math' && (
                    <MathGame addStars={addStars} />
                  )}
                  {activeTab === 'arabic' && (
                    <ArabicGame addStars={addStars} />
                  )}
                  {activeTab === 'english' && (
                    <EnglishGame addStars={addStars} />
                  )}
                  {activeTab === 'drawing' && (
                    <DrawingGame addStars={addStars} />
                  )}
                  {activeTab === 'sudan_dictionary' && (
                    <SudanDictionary addStars={addStars} onBackToMain={() => handleBackClick()} />
                  )}
                  {activeTab === 'sudan_explore' && (
                    <SudanExplore addStars={addStars} />
                  )}
                  {activeTab === 'sudan_quiz' && (
                    <SudanQuiz addStars={addStars} />
                  )}
                  {activeTab === 'sudan_memory' && (
                    <SudanMemory addStars={addStars} />
                  )}
                  {activeTab === 'companion' && (
                    <Companion stats={stats} addStars={addStars} />
                  )}
                  {activeTab === 'shop' && (
                    <ToyShop stats={stats} unlockToy={unlockToy} equipToy={equipToy} />
                  )}
                  {activeTab === 'rewards' && (
                    <RewardsPanel stats={stats} />
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>
        ) : (
          /* HOME PORTAL: EITHER MOBILE APP EXPERIENCE OR DESKTOP BENTO GRID */
          <>
            {isMobileSimulator ? (
              /* ========================================================================= */
              /* A) NATIVE MOBILE APP EXPERIENCE (تصميم موازي يتناسب مع الجوال تماماً)    */
              /* ========================================================================= */
              <div className="w-full max-w-md mx-auto p-3 sm:p-4 flex-1 flex flex-col pb-28 animate-fade-in" id="mobile-app-container">
                
                {/* Mobile Stories Bar (Instagram/Kids App Style) */}
                <MobileStoriesBar 
                  onSelectGame={(gameId) => {
                    setActiveTab(gameId);
                    playStarSound();
                  }}
                  playClickSound={playClick}
                />

                {/* Sub-section Views based on Mobile Bottom Dock Selection */}
                {mobileNavSection === 'home' && (
                  <div className="space-y-4">
                    {/* Compact Hero Adventure */}
                    <HeroAdventureBanner 
                      onPlayFeaturedGame={(gameId) => {
                        setActiveTab(gameId as any);
                        playStarSound();
                      }}
                      streak={stats.streak}
                      level={stats.level}
                      stars={stats.stars}
                    />

                    {/* Quick Access Featured Games */}
                    <div>
                      <div className="flex items-center justify-between px-1 mb-2.5">
                        <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>ألعاب مميزة للأبطال:</span>
                        </h3>
                        <button
                          onClick={() => setMobileNavSection('games')}
                          className="text-xs font-black text-[#FF8E3C] hover:underline cursor-pointer"
                        >
                          عرض الكل ({menuItems.length - 1}) 👈
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {menuItems.filter(i => i.id === 'pyramid_stacker' || i.id === 'sudan_rhythm' || i.id === 'math' || i.id === 'science').map((item) => (
                          <motion.button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as any);
                              playStarSound();
                            }}
                            whileTap={{ scale: 0.94 }}
                            className={`p-3.5 rounded-3xl border-3 bg-white text-right flex flex-col justify-between h-[150px] shadow-[0_6px_0_0_#E0E0E0] cursor-pointer transition-all ${item.borderColor}`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-3xl select-none">{item.label.split(' ')[0]}</span>
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-gray-800 line-clamp-1">
                                {item.label.substring(item.label.indexOf(' ') + 1)}
                              </h4>
                              <p className="text-[10px] font-bold text-gray-500 line-clamp-2 mt-1 leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Daily Wisdom / Mascot Cheer Card */}
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-200 border-3 border-[#FFD93D] p-3.5 rounded-3xl flex items-center gap-3 shadow-xs">
                      <div className="text-3xl select-none animate-bounce">🦉✨</div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-gray-900">نصيحة سمسم اليومية:</h4>
                        <p className="text-[11px] font-bold text-amber-950 leading-tight mt-0.5">
                          "كل مسألة تحلها وكل هرم تبنيه يجعلك أذكى بطل في السودان! استمر في الإبداع!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {mobileNavSection === 'games' && (
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-xs">
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: 'all', label: '🌟 الكل' },
                          { id: 'sudan', label: '🇸🇩 كوش' },
                          { id: 'science', label: '🧪 علوم' },
                          { id: 'languages', label: '📚 لغات' },
                          { id: 'arts', label: '🎨 فنون' },
                          { id: 'brain', label: '🦉 ذكاء' },
                        ].map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => {
                              setActiveFilter(filter.id as any);
                              playClick();
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition cursor-pointer ${
                              activeFilter === filter.id 
                                ? 'bg-[#FF8E3C] text-white shadow-xs' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {filteredMenuItems.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            playStarSound();
                          }}
                          whileTap={{ scale: 0.96 }}
                          className={`p-3.5 rounded-2xl border-3 bg-white flex items-center justify-between text-right shadow-[0_4px_0_0_#E0E0E0] cursor-pointer ${item.borderColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl select-none">{item.label.split(' ')[0]}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-black text-gray-800">
                                  {item.label.substring(item.label.indexOf(' ') + 1)}
                                </h4>
                                {item.isNew && (
                                  <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                    جديد 🔥
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-gray-500 line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-black shrink-0">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {mobileNavSection === 'sudan' && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-[#FF8E3C] to-[#E28743] text-white p-4 rounded-3xl border-3 border-white shadow-md text-center">
                      <span className="text-4xl">🇸🇩👑</span>
                      <h3 className="text-lg font-black mt-1">واحة أمجاد وتراث السودان</h3>
                      <p className="text-xs font-bold text-white/90 mt-1">
                        ألعاب ممتعة مخصصة لتعريف أطفالنا بحضارة كوش والتراث السوداني الأصيل
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {sudanHeritageGames.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            playStarSound();
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-3xl border-3 bg-white text-right shadow-[0_6px_0_0_#D1D1D1] flex items-center justify-between cursor-pointer ${item.borderColor}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{item.label.split(' ')[0]}</span>
                            <div>
                              <h4 className="text-sm font-black text-gray-800">
                                {item.label.substring(item.label.indexOf(' ') + 1)}
                              </h4>
                              <p className="text-xs font-bold text-gray-500 mt-0.5 line-clamp-2">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1.5 bg-[#FF8E3C] text-white text-xs font-black rounded-xl shadow-xs shrink-0">
                            العب 🚀
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {mobileNavSection === 'rewards' && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-3xl border-3 border-[#FFD93D] shadow-[0_6px_0_0_#D1B02B] text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-2 border-2 border-amber-300">
                        🏆
                      </div>
                      <h3 className="text-base font-black text-gray-800">أوسمة البطل الذكي</h3>
                      <p className="text-xs font-bold text-gray-500 mt-1">
                        كسبت {stats.stars} نجمة ووصلت للمستوى {stats.level}!
                      </p>
                      
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200 mt-3">
                        <div 
                          className="bg-[#FF8E3C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${(stats.stars % 50) * 2}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-gray-600 mt-1 block">
                        {(stats.stars % 50) * 2}% نحو المستوى {stats.level + 1}
                      </span>
                    </div>

                    <Suspense fallback={<LoadingFallback />}>
                      <RewardsPanel stats={stats} />
                    </Suspense>
                  </div>
                )}

                {mobileNavSection === 'settings' && (
                  <div className="space-y-4">
                    {/* Background Color Picker */}
                    <div className="bg-white p-4 rounded-3xl border-3 border-[#6C5CE7] shadow-[0_6px_0_0_#5044AB]">
                      <h4 className="text-xs font-black text-purple-900 mb-2.5 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>اختر لون خلفية التطبيق:</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {BG_COLORS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setBgColor(c.id);
                              playClick();
                            }}
                            className={`p-2 rounded-xl text-xs font-bold border-2 flex items-center gap-2 cursor-pointer ${
                              bgColor === c.id 
                                ? 'border-[#6C5CE7] bg-purple-50 font-black' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: c.value }} />
                            <span className="line-clamp-1">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sticker Board */}
                    <div className="bg-white p-4 rounded-3xl border-3 border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130]">
                      <h4 className="text-xs font-black text-orange-900 mb-2">جدار ملصقاتي التفاعلي ✨</h4>
                      <div className="border-2 border-dashed border-orange-200 bg-orange-50/50 p-3 rounded-2xl flex flex-wrap justify-center gap-3 min-h-[100px] items-center">
                        {selectedStickers.map((stkId) => {
                          const stk = AVAILABLE_STICKERS.find(s => s.id === stkId);
                          if (!stk) return null;
                          return (
                            <motion.button
                              key={stk.id}
                              onClick={handleStickerClick}
                              whileTap={{ scale: 1.3, rotate: 15 }}
                              className="text-4xl p-1 cursor-pointer select-none"
                            >
                              {stk.emoji}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Bottom App Dock for Mobile */}
                <MobileBottomDock 
                  activeNav={mobileNavSection}
                  onSelectNav={(section) => setMobileNavSection(section)}
                  stars={stats.stars}
                  level={stats.level}
                  playClickSound={playClick}
                />
              </div>
            ) : (
              /* ========================================================================= */
              /* B) WORLD-CLASS DESKTOP BENTO GRID (التصميم المكتبي المتطور الفائق)         */
              /* ========================================================================= */
              <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-8 animate-fade-in" id="desktop-bento-portal">
                
                {/* 1. Hero Adventure Banner */}
                <HeroAdventureBanner 
                  onPlayFeaturedGame={(gameId) => {
                    setActiveTab(gameId as any);
                    playStarSound();
                  }}
                  streak={stats.streak}
                  level={stats.level}
                  stars={stats.stars}
                />

                {/* 2. Top Bento Row: Quick Stats + Customizer Station + Interactive Stickers Wall */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: Kid Profile & Explorer Level */}
                  <div className="bg-white p-6 rounded-[32px] border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-16 h-16 bg-gradient-to-tr from-[#FFD93D] to-[#FF8E3C] rounded-2xl flex items-center justify-center text-3xl shadow-inner select-none border-3 border-white shrink-0">
                          👦
                        </div>
                        <div>
                          <span className="text-xs font-black text-[#FF8E3C] bg-orange-50 px-2.5 py-0.5 rounded-full">
                            المستكشف الذكي 🌟
                          </span>
                          <h3 className="text-xl font-black text-gray-800 mt-1">المستوى {stats.level}</h3>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 mt-2 relative">
                        <motion.div 
                          className="bg-[#FF8E3C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${(stats.stars % 50) * 2}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-800">
                          {(stats.stars % 50) * 2}% نحو المستوى {stats.level + 1}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-gray-500 border-t pt-3">
                      <span>إجمالي النجوم: ⭐ {stats.stars}</span>
                      <span>نشاط متواصل: 🔥 {stats.streak} أيام</span>
                    </div>
                  </div>

                  {/* Card 2: Background Colors Customizer */}
                  <div className="bg-white p-6 rounded-[32px] border-4 border-[#6C5CE7] shadow-[0_8px_0_0_#5044AB]">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">🎨</span>
                      <h3 className="text-base font-black text-[#5044AB]">لون خلفية الأكاديمية:</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {BG_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setBgColor(c.id);
                            playClick();
                          }}
                          className={`p-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                            bgColor === c.id
                              ? 'border-[#6C5CE7] bg-purple-50 font-black shadow-xs'
                              : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: c.value }} />
                          <span className="text-[11px] truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Interactive Sticker Board */}
                  <div className="bg-white p-6 rounded-[32px] border-4 border-[#4ECDC4] shadow-[0_8px_0_0_#3DA199] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">✨</span>
                          <h3 className="text-base font-black text-[#2D8E87]">جدار ملصقاتي:</h3>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">انقر للمفاجآت!</span>
                      </div>
                      <div className="border-2 border-dashed border-[#4ECDC4]/40 bg-teal-50/30 min-h-[95px] rounded-2xl p-2 flex flex-wrap items-center justify-center gap-2">
                        {selectedStickers.map((stickerId) => {
                          const stk = AVAILABLE_STICKERS.find(s => s.id === stickerId);
                          if (!stk) return null;
                          return (
                            <motion.button
                              key={stk.id}
                              onClick={handleStickerClick}
                              whileHover={{ scale: 1.25, rotate: [0, 8, -8, 0] }}
                              whileTap={{ scale: 0.9 }}
                              className="text-3xl p-1 cursor-pointer select-none"
                              title={stk.name}
                            >
                              {stk.emoji}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-center mt-2">
                      <span className="text-[10px] font-bold text-[#2D8E87]">
                        💡 انقر على أي ملصق لإطلاق مفاجآت ورقية ملونة!
                      </span>
                    </div>
                  </div>

                </div>

                {/* 3. Games Bento Grid with Quick Filter Chips */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                    <h3 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                      <span>اختر مغامرتك وابدأ التعلم:</span>
                    </h3>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-1.5 bg-white p-1.5 rounded-2xl border-2 border-amber-200 shadow-xs">
                      {[
                        { id: 'all', label: '🌟 كل الألعاب' },
                        { id: 'sudan', label: '🇸🇩 أمجاد السودان' },
                        { id: 'science', label: '🧪 علوم وحساب' },
                        { id: 'languages', label: '📚 لغات وحروف' },
                        { id: 'arts', label: '🎨 فنون وموسيقى' },
                        { id: 'brain', label: '🦉 أذكياء نقلة' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveFilter(tab.id as any);
                            playClick();
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                            activeFilter === tab.id
                              ? 'bg-[#FFD93D] text-gray-900 shadow-xs font-black'
                              : 'text-gray-600 hover:bg-amber-50'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* World-Class Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          playStarSound();
                        }}
                        whileHover={{ y: -6, scale: 1.01 }}
                        whileTap={{ y: 2, scale: 0.98 }}
                        className={`group text-right p-6 rounded-[32px] border-4 bg-white flex flex-col justify-between h-[210px] cursor-pointer relative overflow-hidden transition-all shadow-[0_8px_0_0_#E0E0E0] hover:shadow-[0_12px_0_0_#E0E0E0] ${item.borderColor}`}
                        id={`bento-card-${item.id}`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-4xl sm:text-5xl select-none group-hover:scale-110 transition-transform duration-300">
                              {item.label.split(' ')[0]}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.isNew && (
                                <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                                  جديد 🔥
                                </span>
                              )}
                              <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-full border border-amber-200">
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-lg font-black text-gray-800 group-hover:text-[#FF8E3C] transition-colors">
                            {item.label.substring(item.label.indexOf(' ') + 1)}
                          </h4>
                          <p className="text-gray-500 text-xs font-bold mt-1.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
                          <span className="text-xs font-black text-[#4ECDC4] flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                            <span>ابدأ اللعبة الآن</span>
                            <span>👈</span>
                          </span>
                          <span className="text-xs text-amber-500">⭐ +10</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Exit Confirmation Button */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleBackClick}
                    className="px-6 py-3 bg-[#FF6B6B] hover:bg-red-500 text-white font-black text-sm rounded-2xl border-4 border-red-700 shadow-[0_6px_0_0_#990000] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                    id="exit-academy-btn"
                  >
                    🚪 مغادرة الأكاديمية
                  </button>
                </div>

              </div>
            )}
          </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER                                                                 */}
      {/* ========================================================================= */}
      {!isMobileSimulator && (
        <footer className="bg-white p-5 border-t-4 border-amber-200 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-[#4D4D4D] mt-12 font-black text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span> 14 لعبة تعليمية وتراثية ممتعة
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇸🇩</span> حضارة وتاريخ السودان للأطفال
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span> بيئة آمنة وخالية من الإعلانات
          </div>
        </footer>
      )}

      {/* ========================================================================= */}
      {/* 5. KID-THEMED CUSTOM CONFIRMATION MODAL                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" id="custom-confirm-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (onCancel) onCancel();
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#FFFDF4] rounded-[32px] border-4 border-[#FF6B6B] shadow-[0_12px_0_0_#EE5253] p-6 sm:p-8 max-w-md w-full relative z-50 text-center"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-[#FF6B6B] animate-bounce">
                🦉
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-4 leading-relaxed">
                {confirmMessage}
              </h3>
              
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm();
                  }}
                  className="flex-1 py-3 bg-[#FF6B6B] hover:bg-red-500 text-white font-black text-sm rounded-2xl border-4 border-red-700 shadow-[0_4px_0_0_#990000] active:translate-y-1 active:shadow-none transition cursor-pointer"
                  id="confirm-modal-yes"
                >
                  نعم، متأكد! 👍
                </button>
                <button
                  onClick={() => {
                    if (onCancel) onCancel();
                  }}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-black text-sm rounded-2xl border-4 border-gray-300 shadow-[0_4px_0_0_#D1D1D1] active:translate-y-1 active:shadow-none transition cursor-pointer"
                  id="confirm-modal-no"
                >
                  لا، إلغاء ❌
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
