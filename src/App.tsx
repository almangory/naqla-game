/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Atom, 
  Binary, 
  BookOpen, 
  Globe, 
  MessageSquare, 
  ShoppingBag, 
  Trophy, 
  Star, 
  Flame, 
  User, 
  HelpCircle,
  Menu,
  X,
  Volume2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass
} from 'lucide-react';
import { GameCategory, UserStats } from './types';
import ScienceGame from './components/ScienceGame';
import MathGame from './components/MathGame';
import ArabicGame from './components/ArabicGame';
import EnglishGame from './components/EnglishGame';
import Companion from './components/Companion';
import ToyShop from './components/ToyShop';
import RewardsPanel from './components/RewardsPanel';
import DrawingGame from './components/DrawingGame';
import SudanExplore from './components/SudanExplore';
import SudanQuiz from './components/SudanQuiz';
import SudanMemory from './components/SudanMemory';
import SudanDictionary from './components/SudanDictionary';

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
  { id: 'saturn', emoji: '🪐', name: 'كوكب زحل الجمبل', category: 'space' },
  { id: 'earth', emoji: '🌍', name: 'كوكبنا الأرض', category: 'space' },
  { id: 'alien', emoji: '🛸', name: 'الصحن الطائر', category: 'space' },
  { id: 'balloon', emoji: '🎈', name: 'البالون الملون', category: 'fun' },
  { id: 'icecream', emoji: '🍦', name: 'الآيس كريم اللذيذ', category: 'fun' },
  { id: 'dino', emoji: '🦖', name: 'الديناصور الصغير', category: 'fun' },
  { id: 'star_spark', emoji: '✨', name: 'النجوم البراقة', category: 'fun' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<GameCategory>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Background and Sticker settings states
  const [bgColor, setBgColor] = useState<string>(() => {
    return localStorage.getItem('simsim_kids_bg_color') || 'cream';
  });

  const [selectedStickers, setSelectedStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem('simsim_kids_stickers');
    return saved ? JSON.parse(saved) : ['lion', 'rocket', 'star_spark'];
  });

  const [isVisualFullscreen, setIsVisualFullscreen] = useState(false);

  // Persist background and stickers choices
  useEffect(() => {
    localStorage.setItem('simsim_kids_bg_color', bgColor);
  }, [bgColor]);

  useEffect(() => {
    localStorage.setItem('simsim_kids_stickers', JSON.stringify(selectedStickers));
  }, [selectedStickers]);

  // Turn off full screen when switching games
  useEffect(() => {
    setIsVisualFullscreen(false);
  }, [activeTab]);

  // States for the beautiful custom React confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [onCancel, setOnCancel] = useState<() => void>(() => {});

  // Initialize stats with Local Storage fallback for offline durability
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

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('simsim_kids_stats', JSON.stringify(stats));
  }, [stats]);

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
          newStreak = 1; // Reset streak if missed a day
        }
        return {
          ...prev,
          streak: newStreak,
          lastPlayedDate: todayStr
        };
      });
    }
  }, []);

  // Global Helpers to update stars and scores with Confetti!
  const addStars = (amount: number) => {
    setStats(prev => {
      const nextStars = prev.stars + amount;
      const nextLevel = Math.floor(nextStars / 50) + 1; // Level up every 50 stars
      
      // Fun sound effect on star earn
      playWinSound();

      // Launch gorgeous confetti immediately for achievement reinforcement
      confetti({
        particleCount: 80,
        spread: 75,
        origin: { y: 0.75 }
      });

      if (nextLevel > prev.level) {
        // Double-cannon spectacular confetti on level up!
        setTimeout(() => {
          const duration = 2.5 * 1000;
          const end = Date.now() + duration;

          (function frame() {
            confetti({
              particleCount: 6,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0.8 }
            });
            confetti({
              particleCount: 6,
              angle: 120,
              spread: 55,
              origin: { x: 1, y: 0.8 }
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          }());
        }, 200);
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

  const playStickerSound = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } catch (err) {
        // Ignored
      }
    }
  };

  const handleStickerClick = () => {
    playStickerSound();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const playWinSound = () => {
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Cute high pitch sound (bling!)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } catch (err) {
        // Ignored if browser blocks audio autoplay context
      }
    }
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
      setConfirmMessage("هل أنت متأكد من مغادرة وإغلاق أكاديمية نقلة للأطفال؟ سنشتاق إليك كثيراً! 🦉💔");
      setOnConfirm(() => () => {
        setShowConfirmModal(false);
        // Exiting the app / going back
        window.history.back();
      });
      setOnCancel(() => () => {
        setShowConfirmModal(false);
      });
      setShowConfirmModal(true);
    }
  };

  useEffect(() => {
    // Push initial home state on mount
    window.history.pushState({ tab: 'home' }, '', '');

    const handlePopState = (event: PopStateEvent) => {
      if (activeTab !== 'home') {
        setActiveTab('home');
        window.history.pushState({ tab: 'home' }, '', '');
      } else {
        // Prevent immediate exit, show modal first
        window.history.pushState({ tab: 'home' }, '', '');
        setConfirmMessage("هل أنت متأكد من مغادرة وإغلاق أكاديمية نقلة للأطفال؟ سنشتاق إليك كثيراً! 🦉💔");
        setOnConfirm(() => () => {
          setShowConfirmModal(false);
          // Let the user exit by calling history.go(-2) or similar
          window.removeEventListener('popstate', handlePopState);
          window.history.go(-1);
        });
        setOnCancel(() => () => {
          setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeTab]);

  const menuItems = [
    { id: 'home', label: '🏠 الرئيسية (بوابة الألعاب)', color: 'border-[#FF6B6B] text-gray-800 bg-white', borderColor: 'border-[#FF6B6B]', shadowColor: 'shadow-[0_4px_0_0_#FF6B6B]' },
    { id: 'science', label: '🧪 مختبر العلوم والفيزياء', color: 'border-[#45AAF2] text-[#3888C1] bg-white', borderColor: 'border-[#45AAF2]', shadowColor: 'shadow-[0_4px_0_0_#3888C1]' },
    { id: 'math', label: '🧮 قطار الحساب الممتع', color: 'border-[#FF6B6B] text-[#CC5555] bg-white', borderColor: 'border-[#FF6B6B]', shadowColor: 'shadow-[0_4px_0_0_#CC5555]' },
    { id: 'arabic', label: '📝 مملكة الحروف العربية', color: 'border-[#2ECC71] text-[#25A35A] bg-white', borderColor: 'border-[#2ECC71]', shadowColor: 'shadow-[0_4px_0_0_#25A35A]' },
    { id: 'english', label: '🇬🇧 English Alphabet', color: 'border-[#F1C40F] text-[#C19D0C] bg-white', borderColor: 'border-[#F1C40F]', shadowColor: 'shadow-[0_4px_0_0_#C19D0C]' },
    { id: 'drawing', label: '🎨 مرسم الألوان السحرية', color: 'border-[#FF8E3C] text-[#CC7130] bg-white', borderColor: 'border-[#FF8E3C]', shadowColor: 'shadow-[0_4px_0_0_#CC7130]' },
    { id: 'sudan_dictionary', label: '📖 قاموس نقلة المصور', color: 'border-[#1DD1A1] text-[#10AC84] bg-white', borderColor: 'border-[#1DD1A1]', shadowColor: 'shadow-[0_4px_0_0_#10AC84]' },
    { id: 'sudan_explore', label: '🇸🇩 واحة التراث السوداني الأصيل', color: 'border-[#E28743] text-[#963E00] bg-white', borderColor: 'border-[#E28743]', shadowColor: 'shadow-[0_4px_0_0_#963E00]' },
    { id: 'sudan_quiz', label: '🧠 ألغاز وفوازير سودانية', color: 'border-[#1DD1A1] text-[#10AC84] bg-white', borderColor: 'border-[#1DD1A1]', shadowColor: 'shadow-[0_4px_0_0_#10AC84]' },
    { id: 'sudan_memory', label: '🧩 لعبة الذاكرة التراثية', color: 'border-[#FF6B6B] text-[#CC5555] bg-white', borderColor: 'border-[#FF6B6B]', shadowColor: 'shadow-[0_4px_0_0_#CC5555]' },
    { id: 'companion', label: '🦉 اسأل صديقك سمسم (AI)', color: 'border-[#6C5CE7] text-[#5044AB] bg-white', borderColor: 'border-[#6C5CE7]', shadowColor: 'shadow-[0_4px_0_0_#5044AB]' },
    { id: 'shop', label: '🧸 متجر تزيين الألعاب', color: 'border-[#FF8E3C] text-[#CC7130] bg-white', borderColor: 'border-[#FF8E3C]', shadowColor: 'shadow-[0_4px_0_0_#CC7130]' },
    { id: 'rewards', label: '🏆 لوحة الأوسمة والتقدم', color: 'border-[#4ECDC4] text-[#3DA199] bg-white', borderColor: 'border-[#4ECDC4]', shadowColor: 'shadow-[0_4px_0_0_#3DA199]' }
  ];

  const currentBgColor = BG_COLORS.find(c => c.id === bgColor)?.value || '#FFF9E6';

  return (
    <div 
      className="min-h-screen text-[#4D4D4D] font-sans antialiased flex flex-col transition-all duration-500" 
      dir="rtl" 
      id="app-root"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* Floating control panel when in fullscreen mode */}
      {isVisualFullscreen && activeTab !== 'home' && (
        <div className="fixed top-2 right-2 left-2 z-50 flex justify-between items-center bg-black/80 backdrop-blur-md p-3 rounded-2xl border-2 border-white/20 text-white shadow-xl animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🦉✨</span>
            <span className="text-xs sm:text-sm font-black text-amber-300">أنت الآن في نمط الشاشة الكاملة الممتع!</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsVisualFullscreen(false)}
              className="bg-[#4ECDC4] hover:bg-[#3DA199] border-2 border-white/10 text-white px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer shadow-md transition-all active:scale-95"
            >
              📺 تصغير الشاشة
            </button>
            <button
              onClick={handleBackClick}
              className="bg-[#FF6B6B] hover:bg-red-500 border-2 border-white/10 text-white px-3 py-1.5 rounded-xl text-[11px] font-black cursor-pointer shadow-md transition-all active:scale-95"
            >
              🏠 القائمة الرئيسية
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Animated Header - Hidden on mobile/tablet when playing a game to give maximum screen space */}
      {!isVisualFullscreen && (
        <header className={`bg-[#FFD93D] p-5 flex items-center justify-between shadow-[0_6px_0_0_#D1B02B] relative z-40 ${activeTab !== 'home' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-white bg-[#FF6B6B] border-2 border-white rounded-xl hover:bg-red-500 transition cursor-pointer"
                aria-label="القائمة"
                id="sidebar-toggle-btn"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FF6B6B] border-4 border-white rounded-full flex items-center justify-center text-white text-3xl font-black shrink-0 shadow-md">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="select-none"
                >
                  🦉
                </motion.div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-[#4D4D4D] tracking-tight">
                  أكاديمية نقلة للأطفال 🇸🇩
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#7A6A24] hidden sm:block">ألعاب تعليمية ذكية للأطفال لتعلم العلوم، الحساب، اللغات، واستكشاف تراث السودان الحبيب!</p>
              </div>
            </div>

            {/* Quick stats on top */}
            <div className="flex items-center gap-3">
              {/* Stars score in Vibrant Palette style */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white px-4 py-2 rounded-full border-4 border-[#4ECDC4] flex items-center gap-2 shadow-sm"
                id="header-stars-badge"
              >
                <span className="text-xl sm:text-2xl">⭐</span>
                <span className="text-lg sm:text-2xl font-black text-[#2D8E87]">{stats.stars}</span>
              </motion.div>

              {/* Level badge / Avatar container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white border-4 border-[#FF6B6B] rounded-2xl flex items-center justify-center shadow-sm relative shrink-0">
                <div className="text-3xl select-none">👦</div>
                <span className="absolute -bottom-2 -right-2 bg-[#FF6B6B] border-2 border-white text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                  {stats.level}
                </span>
              </div>

              {/* Active Companion decoration if equipped */}
              {stats.activeToy && (
                <div className="bg-white text-xs font-black px-2.5 py-1 rounded-full border-2 border-[#FF8E3C] hidden md:flex items-center gap-1 animate-bounce">
                  <span>تزيين سمسم:</span>
                  <span>{stats.activeToy}</span>
                </div>
              )}
            </div>

          </div>
        </header>
      )}

      {/* COMPACT STICKY HEADER FOR MOBILE & TABLETS - Gives full image/view space for active games */}
      {!isVisualFullscreen && activeTab !== 'home' && (
        <div className="lg:hidden bg-[#FFD93D] p-3 border-b-4 border-[#D1B02B] flex items-center justify-between relative z-40 shadow-md" id="mobile-compact-bar">
          <button
            onClick={handleBackClick}
            className="bg-[#FF6B6B] text-white border-2 border-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition active:scale-95"
            id="mobile-back-btn"
          >
            <ArrowRight className="w-4 h-4" /> رجوع 🏠
          </button>

          <button
            onClick={() => {
              setIsVisualFullscreen(true);
              playStickerSound();
            }}
            className="bg-[#4ECDC4] hover:bg-[#3DA199] text-white border-2 border-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition active:scale-95"
            id="mobile-fullscreen-btn"
          >
            📺 ملء الشاشة
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[#7A6A24] font-black text-xs">مستوى {stats.level}</span>
            <div className="bg-white text-[#2D8E87] px-2.5 py-1 rounded-full text-xs font-black border-2 border-[#4ECDC4] flex items-center gap-1 shadow-sm">
              <span>⭐</span>
              <span>{stats.stars}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Container - Fullscreen block layout if any game is active */}
      <div className={`flex-1 ${isVisualFullscreen && activeTab !== 'home' ? 'max-w-none w-full p-0 m-0' : `max-w-7xl w-full mx-auto p-4 sm:p-8 ${activeTab !== 'home' ? 'block' : 'grid grid-cols-1 lg:grid-cols-4 gap-8'}`}`}>
        
        {/* Navigation / Profile Sidebar (Large screen) - Omitted entirely in games to open full screen */}
        {activeTab === 'home' && (
          <nav className="hidden lg:flex flex-col gap-6">
            
            {/* Virtual Kid Profile Widget in Vibrant Palette style */}
            <div className="bg-white p-6 rounded-[32px] border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130] flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD93D] to-[#FF8E3C] rounded-full flex items-center justify-center text-4xl shadow-inner select-none border-4 border-white">
                  👦
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#FF8E3C] text-white border-2 border-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow">
                  {stats.level}
                </div>
              </div>
              
              <h3 className="font-black text-2xl text-[#CC7130]">المستكشف الذكي</h3>
              <p className="text-gray-500 text-sm font-bold">المستوى الأكاديمي الحالي: {stats.level}</p>

              {/* Vibrant Progress bar */}
              <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 mt-4 relative">
                <motion.div 
                  className="bg-[#FF8E3C] h-full rounded-full transition-all duration-500"
                  style={{ width: `${(stats.stars % 50) * 2}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-gray-700">
                  {(stats.stars % 50) * 2}% نحو المستوى {stats.level + 1}
                </span>
              </div>

              {/* Streak count */}
              <div className="mt-4 flex items-center gap-2 bg-orange-50 border-2 border-[#FF8E3C] px-4 py-1.5 rounded-2xl text-[#CC7130] text-xs font-black shadow-sm">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>نشاط متواصل: {stats.streak} أيام!</span>
              </div>
            </div>

            {/* Navigation Links in Vibrant Palette style */}
            <div className="bg-[#4ECDC4] p-6 rounded-[32px] border-4 border-white shadow-[0_8px_0_0_#3DA199] flex flex-col gap-3">
              <h3 className="text-xl font-black text-white mb-2 text-right border-b border-white/20 pb-2 flex items-center justify-between">
                <span>الألعاب الاستكشافية</span>
                <span className="text-xl">🎮</span>
              </h3>
              <div className="space-y-3">
                {menuItems.map((item) => {
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        playWinSound();
                      }}
                      className={`w-full py-3.5 px-4 rounded-2xl text-right font-black text-sm transition-all border-4 flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFD93D] border-[#7A6A24] text-gray-800 shadow-[0_4px_0_0_#D1B02B] translate-y-[2px]'
                          : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
                      }`}
                      id={`nav-link-${item.id}`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <Star className="w-4 h-4 fill-amber-950 text-amber-950 animate-spin" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        )}

        {/* Mobile Slide-out Sidebar Menu */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Overlay Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />

              {/* Sidebar Panel */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="fixed top-0 right-0 h-full w-72 bg-[#FFF9E6] z-50 p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto lg:hidden"
                id="mobile-sidebar"
              >
                <div className="flex justify-between items-center border-b-4 border-gray-200 pb-4">
                  <h3 className="font-black text-xl text-[#4D4D4D]">قائمة الألعاب السحرية</h3>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-200 transition text-gray-500"
                    id="close-sidebar-btn"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {menuItems.map((item) => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsSidebarOpen(false);
                          playWinSound();
                        }}
                        className={`w-full py-3.5 px-4 rounded-2xl text-right font-black text-sm transition border-4 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFD93D] border-[#7A6A24] text-gray-800 shadow-[0_4px_0_0_#D1B02B]'
                            : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1]'
                        }`}
                        id={`mobile-nav-link-${item.id}`}
                      >
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto bg-white p-5 rounded-2xl border-4 border-[#FF8E3C] text-center shadow-md">
                  <p className="text-sm text-[#CC7130] font-black">مستواك الحالي: {stats.level} 🌟</p>
                  <p className="text-xs text-gray-600 mt-2">كسبت حتى الآن {stats.stars} نجوم من التعلم واللعب!</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Play Area / Core Screen - Spans full width if any game is active */}
        <main className={activeTab !== 'home' ? 'w-full' : 'lg:col-span-3'}>
          {/* Visual Back Button for Desktop view when playing a game */}
          {activeTab !== 'home' && !isVisualFullscreen && (
            <div className="hidden lg:flex justify-between items-center mb-4">
              <button
                onClick={() => {
                  setIsVisualFullscreen(true);
                  playStickerSound();
                }}
                className="bg-[#4ECDC4] hover:bg-[#3DA199] text-white border-4 border-[#2D8E87] font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-[0_4px_0_0_#23716B] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                id="desktop-fullscreen-btn"
              >
                📺 تشغيل نمط ملء الشاشة الكاملة للعب الممتع
              </button>
              <button
                onClick={handleBackClick}
                className="bg-[#FF6B6B] hover:bg-red-500 text-white border-4 border-red-700 font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-[0_4px_0_0_#990000] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                id="desktop-back-btn"
              >
                🏠 الرجوع للقائمة الرئيسية للألعاب
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'home' && (
                <div className="space-y-8 animate-fade-in" id="home-dashboard">
                  {/* Big Welcoming Banner */}
                  <div className="bg-gradient-to-r from-[#FFD93D] to-[#FF8E3C] p-6 sm:p-8 rounded-[32px] border-4 border-white shadow-[0_8px_0_0_#CC7130] text-center relative overflow-hidden">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="text-6xl sm:text-7xl mb-4 select-none"
                    >
                      🦉🇸🇩
                    </motion.div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
                      مرحباً بك في أكاديمية نقلة للأطفال!
                    </h2>
                    <p className="text-sm sm:text-base font-bold text-amber-950 mt-2 max-w-2xl mx-auto leading-relaxed">
                      بوابتك السحرية لاستكشاف العلوم، وتدريب ذكائك في الحساب، والتمكن من اللغات العربية والإنجليزية، والتعرف على تراث السودان الجميل! 🌟
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/30 backdrop-blur-sm border border-white/40 px-4 py-1.5 rounded-2xl text-xs font-black text-gray-900 shadow-sm">
                      <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                      <span>نشاط متواصل: {stats.streak} أيام! • مستواك الحالي: {stats.level} ⭐</span>
                    </div>
                  </div>

                  {/* Magic Settings and Sticker Board Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="magic-settings-sticker-board">
                    
                    {/* Right Card: Settings and Colors */}
                    <div className="bg-white p-6 rounded-[32px] border-4 border-[#6C5CE7] shadow-[0_8px_0_0_#5044AB] flex flex-col justify-between" id="settings-colors-card">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-3xl">⚙️🎨</span>
                          <h3 className="text-xl font-black text-[#5044AB]">ركن التصميم والألوان السحرية</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-bold mb-4">
                          هنا يمكنك تغيير لون خلفية الموقع وتفعيل الملصقات اللطيفة التي تعبر عن اهتماماتك المفضلة! ✨
                        </p>

                        {/* 1. Background Color Selection */}
                        <div className="mb-6">
                          <h4 className="text-sm font-black text-gray-700 mb-2">🎨 اختر لون خلفية الأكاديمية:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {BG_COLORS.map((color) => {
                              const isSelected = bgColor === color.id;
                              return (
                                <button
                                  key={color.id}
                                  onClick={() => {
                                    setBgColor(color.id);
                                    playStickerSound();
                                  }}
                                  className={`p-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    isSelected
                                      ? 'border-[#6C5CE7] scale-105 bg-[#E8EAF6] shadow-sm font-black'
                                      : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-700'
                                  }`}
                                  id={`color-btn-${color.id}`}
                                >
                                  <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color.value }} />
                                  <span>{color.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Sticker Selection Toggles */}
                        <div>
                          <h4 className="text-sm font-black text-gray-700 mb-2">🪐🦁 اختر ملصقاتك المفضلة للشاشة الرئيسية:</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {AVAILABLE_STICKERS.map((sticker) => {
                              const isSelected = selectedStickers.includes(sticker.id);
                              return (
                                <button
                                  key={sticker.id}
                                  onClick={() => {
                                    playStickerSound();
                                    setSelectedStickers(prev => {
                                      if (prev.includes(sticker.id)) {
                                        return prev.filter(id => id !== sticker.id);
                                      } else {
                                        return [...prev, sticker.id];
                                      }
                                    });
                                  }}
                                  className={`p-2 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                    isSelected
                                      ? 'border-[#FF8E3C] bg-[#FFF3E0] scale-105 font-black text-orange-800'
                                      : 'border-gray-100 bg-gray-50 hover:bg-white text-gray-600'
                                  }`}
                                  id={`sticker-toggle-btn-${sticker.id}`}
                                >
                                  <span className="text-2xl select-none">{sticker.emoji}</span>
                                  <span className="text-[10px] text-center line-clamp-1">{sticker.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left Card: Sticker Board */}
                    <div className="bg-white p-6 rounded-[32px] border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130] flex flex-col justify-between" id="sticker-board-card">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-3xl">🎨✨</span>
                          <h3 className="text-xl font-black text-[#CC7130]">جدار ملصقاتي التفاعلي</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-bold mb-4">
                          ملصقاتك الرائعة تظهر هنا! اضغط على أي ملصق ليقفز بحركات سحرية ويطلق مفاجآت ورقية ملونة! 🎉🪐
                        </p>

                        <div className="border-4 border-dashed border-[#FF8E3C]/30 bg-[#FFFDF9] min-h-[160px] rounded-2xl p-4 flex flex-wrap items-center justify-center gap-4 relative overflow-hidden">
                          {selectedStickers.length === 0 ? (
                            <div className="text-center p-4 text-gray-400 text-xs font-bold">
                              <p className="text-2xl mb-1">🦁🪐🚀</p>
                              <p>لا توجد ملصقات مفعلة حالياً!</p>
                              <p className="text-[10px] text-gray-400 mt-1">اختر ملصقاتك المفضلة من لوحة التصميم بجانبك لتزين جدارك!</p>
                            </div>
                          ) : (
                            selectedStickers.map((stickerId) => {
                              const sticker = AVAILABLE_STICKERS.find(s => s.id === stickerId);
                              if (!sticker) return null;
                              return (
                                <motion.button
                                  key={sticker.id}
                                  onClick={handleStickerClick}
                                  whileHover={{ scale: 1.25, rotate: [0, 10, -10, 0] }}
                                  whileTap={{ scale: 0.9, y: -15 }}
                                  animate={{ y: [0, -4, 0] }}
                                  transition={{
                                    y: {
                                      repeat: Infinity,
                                      duration: 2 + Math.random() * 2,
                                      ease: 'easeInOut'
                                    }
                                  }}
                                  className="text-5xl p-2 select-none cursor-pointer hover:bg-orange-50 rounded-2xl transition-colors relative group"
                                  title={sticker.name}
                                  id={`active-sticker-${sticker.id}`}
                                >
                                  <span>{sticker.emoji}</span>
                                  {/* Tooltip on hover */}
                                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none mb-1">
                                    {sticker.name}
                                  </span>
                                </motion.button>
                              );
                            })
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-[11px] text-[#CC7130] font-black animate-pulse">
                          💡 هل تعلم؟ اختيارك للألوان والملصقات يساعد خلايا عقلك الذكية على التركيز والاستمتاع بالتعليم أكثر! 🧠🌈
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Games Grid */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#4D4D4D] mb-6 text-right flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" /> اختر مغامرتك المفضلة وابدأ التعلم:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {menuItems.filter(item => item.id !== 'home').map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            playWinSound();
                          }}
                          className={`group text-right p-5 rounded-[28px] border-4 bg-white hover:bg-amber-50/20 shadow-[0_6px_0_0_#D1D1D1] transition-all hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#D1D1D1] active:translate-y-[6px] active:shadow-none flex flex-col justify-between h-[180px] cursor-pointer ${item.borderColor}`}
                          id={`dashboard-card-${item.id}`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-4xl select-none group-hover:scale-110 transition-transform duration-300">
                                {item.label.split(' ')[0]}
                              </span>
                              <span className="bg-gray-100 group-hover:bg-amber-200 text-gray-500 group-hover:text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full border border-gray-200 transition-colors">
                                دخول المغامرة 🚀
                              </span>
                            </div>
                            <h4 className="text-base font-black text-gray-800 group-hover:text-[#CC7130] transition-colors mt-1">
                              {item.label.substring(item.label.indexOf(' ') + 1)}
                            </h4>
                            <p className="text-gray-500 text-[11px] font-bold mt-1 line-clamp-2 leading-relaxed">
                              {item.id === 'science' && 'اكتشف قوانين الجاذبية والسرعة الممتعة وقم بإجراء تجارب علمية مذهلة!'}
                              {item.id === 'math' && 'اركب قطار الحساب والرياضيات الممتع وحل أسرع المسائل الحسابية المبهجة!'}
                              {item.id === 'arabic' && 'اكتشف جمال لغتنا العربية الساحرة، رتب الحروف واكشف النقاط لتربح!'}
                              {item.id === 'english' && 'Learn english alphabets, trace letters, and write words with cute animations!'}
                              {item.id === 'drawing' && 'ارسم لوحات جميلة ولونها بالفرشاة السحرية وعرضها على البومة سمسم!'}
                              {item.id === 'sudan_explore' && 'تعلم واستكشف معالم السودان الأثرية وأهرامات مروي وتراثنا وطيبتنا!'}
                              {item.id === 'sudan_quiz' && 'تحديات ذكاء وأسئلة ممتعة جداً عن ثقافة وتراث وطبيعة السودان الحبيب!'}
                              {item.id === 'sudan_memory' && 'اختبر ذاكرتك الحديدية وطابق بطاقات التراث السوداني الأصيل واكسب نقاطاً!'}
                              {item.id === 'sudan_dictionary' && 'قاموس مصور يربط الكلمات العربية والإنجليزية بصور من بيئة السودان الجميلة!'}
                              {item.id === 'companion' && 'تحدث مع صديقك المرشد الذكي البومة سمسم، واسأله أي سؤال تعليمي أو ذكي!'}
                              {item.id === 'shop' && 'استخدم نجومك التي كسبتها لشراء أزياء وتزيين رائع لصديقك سمسم!'}
                              {item.id === 'rewards' && 'لوحة أوسمتك التي كسبتها ومستواك الحالي وإحصائيات رحلتك الممتعة!'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exit Confirmation Button */}
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleBackClick}
                      className="px-6 py-3 bg-[#FF6B6B] hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-2xl border-4 border-red-700 shadow-[0_6px_0_0_#990000] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer"
                      id="exit-academy-btn"
                    >
                      🚪 مغادرة الأكاديمية والبرنامج
                    </button>
                  </div>
                </div>
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
        </main>

      </div>

      {/* Footer credits in Vibrant Palette theme style */}
      <footer className="bg-white p-5 px-12 border-t-4 border-gray-100 flex flex-wrap items-center justify-center gap-12 text-[#4D4D4D] mt-12 font-black">
        <div className="flex items-center gap-2 text-lg sm:text-xl">
          <span className="text-3xl">🎮</span> ألعاب تفاعلية متنوعة
        </div>
        <div className="flex items-center gap-2 text-lg sm:text-xl">
          <span className="text-3xl">🏆</span> أبطال الغد الأذكياء
        </div>
        <div className="flex items-center gap-2 text-lg sm:text-xl">
          <span className="text-3xl">🛡️</span> بيئة آمنة تماماً للأطفال
        </div>
      </footer>

      {/* Beautiful Kid-themed Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" id="custom-confirm-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (onCancel) onCancel();
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
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
                  className="flex-1 py-3 bg-[#FF6B6B] hover:bg-red-500 text-white font-black text-sm rounded-2xl border-4 border-red-700 shadow-[0_4px_0_0_#990000] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                  id="confirm-modal-yes"
                >
                  نعم، متأكد! 👍
                </button>
                <button
                  onClick={() => {
                    if (onCancel) onCancel();
                  }}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-black text-sm rounded-2xl border-4 border-gray-300 shadow-[0_4px_0_0_#D1D1D1] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
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
