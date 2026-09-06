/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
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
const AlphabetTrainGame = lazy(() => import('./components/AlphabetTrainGame'));
const KidsCodingLogic = lazy(() => import('./components/KidsCodingLogic'));
const Games100Hub = lazy(() => import('./components/Games100Hub'));
const SudanJigsawPuzzle = lazy(() => import('./components/SudanJigsawPuzzle'));
const FiveSensesGame = lazy(() => import('./components/FiveSensesGame'));
const KidsKaraokeMicGame = lazy(() => import('./components/KidsKaraokeMicGame'));

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
  { id: 'lavender_3d', name: 'الخزامى الثلاثي 🔮', value: '#D6D5F2' },
  { id: 'wave_cyan', name: 'الموج الهادئ 🌊', value: '#D8F2F7' },
  { id: 'morning_light', name: 'الضياء الصباحي ☀️', value: '#FFF8E7' },
  { id: 'magic_spark', name: 'النوال السحري ✨', value: '#ECE8FA' },
  { id: 'golden_sands', name: 'الرمال الذهبية 🏜️', value: '#FBEED3' },
  { id: 'royal_rose', name: 'الوردي الملكي 🌸', value: '#FCE6F1' }
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'sudan' | 'science' | 'languages' | 'arts' | 'brain' | 'puzzle'>('all');

  // Screen size detection for automatic mobile responsive parallel layout
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Device Simulator Mode: Toggle between Native Mobile Experience and Desktop Bento Grid
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simsim_kids_mobile_mode');
      if (saved !== null) return saved === 'true';
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Effective mobile layout active when on mobile screen or manually simulated
  const isMobileEffective = isMobileScreen || isMobileSimulator;

  const [isVisualFullscreen, setIsVisualFullscreen] = useState(false);

  // Background and Sticker settings states (Default to Lavender 3D Mockup Theme)
  const [bgColor, setBgColor] = useState<string>(() => {
    return localStorage.getItem('simsim_kids_bg_color') || 'lavender_3d';
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

  // 📲 PWA Installation & Device Back Button Controller
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }
      setDeferredPrompt(null);
    } else {
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setShowIosInstallGuide(true);
      } else {
        alert("لتثبيت تطبيق ألعاب نقلة:\nاضغط على خيارات المتصفح (⋮) ثم اختر 'تثبيت التطبيق' أو 'إضافة إلى الشاشة الرئيسية' 📲✨");
      }
    }
  };

  // Sync browser history with activeTab for mobile hardware & gesture back button
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (activeTab !== 'home') {
      if (window.location.hash !== '#' + activeTab) {
        window.history.pushState({ tab: activeTab }, '', '#' + activeTab);
      }
    } else {
      if (window.location.hash) {
        window.history.replaceState({ tab: 'home' }, '', window.location.pathname);
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.history.state) {
      window.history.replaceState({ tab: 'home' }, '', window.location.pathname);
    }

    const handlePopState = (e: PopStateEvent) => {
      if (activeTab !== 'home') {
        // User pressed phone back button while in a game -> smoothly return to home!
        setActiveTab('home');
      } else {
        // User pressed phone back button while already on home -> Show exit confirmation!
        window.history.pushState({ tab: 'home' }, '', window.location.pathname);
        setShowExitModal(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeTab]);

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

  // Turn off fullscreen and reset any running confetti when switching tabs or sections
  useEffect(() => {
    setIsVisualFullscreen(false);
    try {
      confetti.reset();
    } catch (e) {}
  }, [activeTab]);

  useEffect(() => {
    try {
      confetti.reset();
    } catch (e) {}
  }, [mobileNavSection]);

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

  const lastConfettiTimeRef = useRef(0);

  // Helpers for rewards and confetti with flood protection
  const addStars = (amount: number) => {
    const now = Date.now();
    // Only fire confetti once every 1000ms max to prevent queue flooding
    if (now - lastConfettiTimeRef.current > 1000) {
      lastConfettiTimeRef.current = now;
      playStarSound();
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.75 }
        });
      } catch (e) {}
    }

    setStats(prev => {
      const nextStars = prev.stars + amount;
      const nextLevel = Math.floor(nextStars / 50) + 1;
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
      id: 'games_100_hub', 
      isNew: true, 
      label: '🌟 موسوعة الـ 100 لعبة (100 Hub)', 
      category: 'all', 
      borderColor: 'border-[#F59E0B]', 
      shadowColor: 'shadow-[0_8px_0_0_#D97706]', 
      bgGradient: 'from-amber-100 to-yellow-200',
      desc: 'بوابة الـ 100 لعبة التعليمية المتكاملة عبر 8 أكاديميات عالمية للأذكياء!',
      badge: '100 لعبة 🚀'
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
      label: '🎹 أورغن وأنغام السودان', 
      category: 'arts', 
      borderColor: 'border-[#6C5CE7]', 
      shadowColor: 'shadow-[0_8px_0_0_#4A3CB5]', 
      bgGradient: 'from-purple-50 to-indigo-100',
      desc: 'عزف الأورغن الموسيقي بالسلم الخماسي، وطبول الدلوكة والنقارة التراثية مع سمسم!',
      badge: 'أورغن وموسيقى 🎹'
    },
    { 
      id: 'karaoke_mic', 
      isNew: true, 
      label: '🎤 مايكروفون النجوم الغنائي (Kids Karaoke)', 
      category: 'arts', 
      borderColor: 'border-[#EC4899]', 
      shadowColor: 'shadow-[0_8px_0_0_#BE185D]', 
      bgGradient: 'from-pink-50 to-rose-100', 
      desc: 'امسك مايك الألعاب واغنِّ أجمل الأناشيد وغيّر صوتك لصوت الروبوت والسنجاب مع تصفيق الجمهور وأضواء الديسكو!', 
      badge: 'مايك كاريوكي 🎙️' 
    },
    { 
      id: 'science', 
      label: '🧪 مختبر العلوم والفيزياء', 
      category: 'science', 
      borderColor: 'border-[#45AAF2]', 
      shadowColor: 'shadow-[0_8px_0_0_#3888C1]', 
      bgGradient: 'from-sky-50 to-blue-100',
      desc: 'اكتشف قوانين الجاذبية والسرعة والكثافة وتجارب الفيزياء والكيمياء الممتعة!',
      badge: 'علوم 🔬'
    },
    { 
      id: 'five_senses', 
      isNew: true, 
      label: '🖐️ مختبر الحواس الخمسة (Five Senses Lab)', 
      category: 'science', 
      borderColor: 'border-[#10B981]', 
      shadowColor: 'shadow-[0_8px_0_0_#059669]', 
      bgGradient: 'from-emerald-50 to-teal-100', 
      desc: 'تعرف على حواسك الخمس بطريقة علمية تفاعلية: البصر، السمع، الشم، التذوق، واللمس مع تجارب ومسابقات ممتعة!', 
      badge: 'علوم الحواس 👁️' 
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
      id: 'alphabet_train', 
      isNew: true, 
      label: '🚂 قطار الحروف وسباق الكلمات', 
      category: 'languages', 
      borderColor: 'border-[#3B82F6]', 
      shadowColor: 'shadow-[0_8px_0_0_#1D4ED8]', 
      bgGradient: 'from-blue-50 to-indigo-100',
      desc: 'Alphabet Train Express & Word Racer Car: ركب عربات قطار الحروف وقُد سيارة السباق لتجميع الكلمات!',
      badge: 'قطار وسباق 🏎️'
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
      id: 'kids_coding', 
      isNew: true, 
      label: '🤖 مغامرة برمجة الروبوت (Kids Coding)', 
      category: 'brain', 
      borderColor: 'border-[#8B5CF6]', 
      shadowColor: 'shadow-[0_8px_0_0_#6D28D9]', 
      bgGradient: 'from-purple-50 to-indigo-100',
      desc: 'متاهة الخوارزميات والبرمجة بالأسهم: وجّه الروبوت عبر العقبات والتقط مجوهرات الطاقة!',
      badge: 'برمجة 🧠'
    },
    { 
      id: 'jigsaw_puzzle', 
      isNew: true, 
      label: '🧩 ألعاب البزل وتركيب اللوحات (Jigsaw Puzzle)', 
      category: 'puzzle', 
      borderColor: 'border-[#6C5CE7]', 
      shadowColor: 'shadow-[0_8px_0_0_#5845D8]', 
      bgGradient: 'from-purple-50 to-indigo-100', 
      desc: 'جمّع لوحات التراث السوداني والقصص المصورة قطعة بقطعة مع أصوات تفاعلية ومستويات وتلميحات ذكية!', 
      badge: 'بزل ذكي 🧩' 
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

  const currentBgColor = BG_COLORS.find(c => c.id === bgColor)?.value || '#D6D5F2';
  const isHexTheme = bgColor === 'lavender_3d' || bgColor === 'magic_spark';

  return (
    <div 
      className={`min-h-screen text-[#26214B] font-sans antialiased flex flex-col transition-all duration-500 selection:bg-purple-300 ${
        isHexTheme ? 'bg-hex-ambient' : ''
      }`} 
      dir="rtl" 
      id="app-root"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP GLOBAL APP BAR & FLOATING HUD (WORLD-CLASS 3D CLAYMORPHIC THEME)  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#EAE8FB]/80 backdrop-blur-2xl border-b border-white/80 shadow-[0_8px_30px_rgba(108,92,231,0.08)] px-3 sm:px-6 py-2 sm:py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Brand Logo & Friendly Mascot (matching media_1788709434478.jpg) */}
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
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 rounded-2xl border-2 border-white shadow-[0_4px_14px_rgba(108,92,231,0.18)] flex items-center justify-center shrink-0 group-hover:scale-105 group-active:scale-95 transition-transform overflow-hidden p-1">
                <img 
                  src="/favicon.png" 
                  alt="NAQLA Games Logo" 
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base sm:text-2xl font-black text-[#26214B] tracking-tight flex items-center gap-1.5">
                    <span>ألعاب نقلة</span>
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-black text-xs sm:text-base">NAQLA</span>
                    <span className="text-amber-500 text-xs sm:text-base">🎮</span>
                  </h1>
                </div>
                <p className="text-[10px] sm:text-xs font-bold text-[#635B9F] line-clamp-1 hidden sm:block">
                  منصة الألعاب الإلكترونية التفاعلية لعموم المراحل
                </p>
              </div>
            </button>
          </div>

          {/* Center / Right Controls: Frosted Claymorphic Pills HUD */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Device Mode Switcher (Desktop Bento vs Mobile Parallel Experience) */}
            <button
              onClick={() => {
                setIsMobileSimulator(prev => !prev);
                playClick();
              }}
              className={`clay-pill px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isMobileEffective 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-[0_4px_14px_rgba(108,92,231,0.35)]' 
                  : 'text-[#26214B] hover:bg-white'
              }`}
              title="تبديل طريقة العرض: نمط الجوال الفائق أو النمط المكتبي"
              id="device-mode-toggle-btn"
            >
              {isMobileEffective ? (
                <>
                  <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                  <span className="hidden xs:inline">نمط الجوال 📱</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                  <span className="hidden xs:inline">نمط الحاسوب 💻</span>
                </>
              )}
            </button>

            {/* PWA App Install Button */}
            {!isAppInstalled ? (
              <button
                onClick={handleInstallApp}
                className="clay-pill px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-white/60 shadow-[0_4px_14px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                title="تثبيت التطبيق على هاتفك أو حاسوبك للوصول السريع"
                id="install-pwa-btn"
              >
                <span>📲</span>
                <span className="hidden sm:inline">تثبيت التطبيق</span>
              </button>
            ) : (
              <span className="hidden md:flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-1 rounded-full">
                <span>✅</span>
                <span>تطبيق مثبت</span>
              </span>
            )}

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                toggleMute();
                playClick();
              }}
              className="clay-pill w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-700 cursor-pointer active:scale-90"
              title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم الصوت'}
              id="sound-toggle-btn"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />}
            </button>

            {/* Streak Counter Pill */}
            <div 
              className="clay-pill px-2.5 sm:px-3 py-1.5 flex items-center gap-1 text-xs font-black text-[#C2410C] border-orange-200/90 shadow-[0_4px_14px_rgba(255,142,60,0.18)] shrink-0"
              title={`أيام الحماسة المتواصلة: ${stats.streak}`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-500 text-orange-500" />
              <span>{stats.streak}</span>
            </div>

            {/* Stars Score Badge (Frosted Cyan Pill matching mockup) */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="clay-pill px-3 sm:px-4 py-1.5 flex items-center gap-1.5 border-teal-200/90 shadow-[0_4px_14px_rgba(45,206,196,0.2)] cursor-pointer"
              id="header-stars-badge"
            >
              <span className="text-base sm:text-lg select-none">⭐</span>
              <span className="text-sm sm:text-base font-black text-[#1D7D76]">{stats.stars}</span>
            </motion.div>

            {/* Avatar / Level Indicator */}
            <div 
              className="relative cursor-pointer select-none group"
              onClick={() => {
                if (isMobileEffective) setMobileNavSection('rewards');
                else setActiveTab('rewards');
                playClick();
              }}
              title="لوحة الأوسمة والمستوى"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-[#FF7675] via-[#FFD93D] to-[#4ECDC4] shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white/95 rounded-[14px] flex items-center justify-center text-xl sm:text-2xl shadow-inner">
                  👦
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
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
                  {activeTab === 'alphabet_train' && (
                    <AlphabetTrainGame addStars={addStars} />
                  )}
                  {activeTab === 'kids_coding' && (
                    <KidsCodingLogic addStars={addStars} />
                  )}
                  {activeTab === 'jigsaw_puzzle' && (
                    <SudanJigsawPuzzle addStars={addStars} />
                  )}
                  {activeTab === 'five_senses' && (
                    <FiveSensesGame addStars={addStars} />
                  )}
                  {activeTab === 'karaoke_mic' && (
                    <KidsKaraokeMicGame addStars={addStars} />
                  )}
                  {activeTab === 'games_100_hub' && (
                    <Games100Hub 
                      stars={stats.stars} 
                      onLaunchGame={(engine) => {
                        setActiveTab(engine);
                        playStarSound();
                      }} 
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </Suspense>
          </main>
        ) : (
          /* HOME PORTAL: EITHER MOBILE APP EXPERIENCE OR DESKTOP BENTO GRID */
          <>
            {isMobileEffective ? (
              /* ========================================================================= */
              /* A) NATIVE PARALLEL MOBILE APP EXPERIENCE (تصميم موازي متكامل للجوال)      */
              /* ========================================================================= */
              <div className="w-full max-w-lg mx-auto p-3 sm:p-4 flex-1 flex flex-col pb-28 animate-fade-in space-y-4" id="mobile-app-container">
                
                {/* 1. Mobile Stories Bar (Kids App Quick Launch 3D Circles) */}
                <MobileStoriesBar 
                  onSelectGame={(gameId) => {
                    setActiveTab(gameId);
                    playStarSound();
                  }}
                  playClickSound={playClick}
                />

                {/* 2. Sub-section Views based on Mobile Bottom Dock Selection */}
                {mobileNavSection === 'home' && (
                  <div className="space-y-4">
                    
                    {/* 3D Hero Emblem & Academy Master Ribbon Card */}
                    <div className="clay-card rounded-[32px] p-4 text-center relative overflow-hidden">
                      <div className="flex items-center justify-between mb-2">
                        <span className="clay-pill px-3 py-0.5 text-[10px] font-black text-amber-900 border-amber-200 shadow-xs">
                          🌟 أكاديمية الـ 100 لعبة
                        </span>
                        <span className="clay-pill px-2.5 py-0.5 text-[10px] font-black text-indigo-900 border-indigo-200">
                          100 / 100 جاهزة
                        </span>
                      </div>

                      <div 
                        onClick={() => {
                          setActiveTab('games_100_hub');
                          playStarSound();
                        }}
                        className="py-1 cursor-pointer group flex flex-col items-center justify-center active:scale-98 transition-transform"
                      >
                        <div className="w-44 h-22 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src="/naqla-games-logo.jpg" 
                            alt="NAQLA 3D Emblem" 
                            className="max-h-full object-contain drop-shadow-[0_8px_16px_rgba(108,92,231,0.25)]" 
                          />
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-[#26214B] mt-1">
                          منصة ألعاب نقلة التفاعلية 🎮
                        </h2>
                        <p className="text-[11px] font-bold text-[#635B9F] line-clamp-1 mt-0.5">
                          منهاج الأبطال: قطار الحروف، سباق السيارات، العلوم، وكوش!
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('games_100_hub');
                            playStarSound();
                          }}
                          className="clay-btn-coral flex-1 py-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                        >
                          <span>استكشف موسوعة الـ 100 لعبة 🚀</span>
                        </button>
                      </div>
                    </div>

                    {/* Mini Bento Row: Level Progress & Live Theme Swatches */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Level Progress */}
                      <div className="clay-card rounded-[24px] p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#26214B]">المستوى {stats.level}</span>
                          <span className="text-sm">👦⭐</span>
                        </div>
                        <div className="w-full h-3.5 bg-white/80 rounded-full overflow-hidden border border-white mt-1.5 p-0.5">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" 
                            style={{ width: `${Math.max(15, (stats.stars % 50) * 2)}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-[#635B9F] mt-1">
                          {(stats.stars % 50) * 2}% نحو المستوى {stats.level + 1}
                        </span>
                      </div>

                      {/* Quick Theme Swatches */}
                      <div className="clay-card rounded-[24px] p-3 flex flex-col justify-between">
                        <span className="text-xs font-black text-[#26214B] flex items-center gap-1">
                          <span>🎨</span>
                          <span>ثيم المنصة:</span>
                        </span>
                        <div className="flex items-center justify-between gap-1 mt-1.5">
                          {BG_COLORS.map(c => (
                            <button
                              key={c.id}
                              onClick={() => {
                                setBgColor(c.id);
                                playClick();
                              }}
                              className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer shrink-0 ${
                                bgColor === c.id ? 'border-purple-600 scale-125 shadow-xs' : 'border-white'
                              }`}
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-bold text-[#635B9F] mt-1 truncate">
                          {BG_COLORS.find(c => c.id === bgColor)?.name}
                        </span>
                      </div>
                    </div>

                    {/* Swipeable Category Chips */}
                    <div>
                      <div className="flex items-center justify-between px-1 mb-2">
                        <h3 className="text-xs sm:text-sm font-black text-[#26214B] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>اختر مغامرتك وابدأ:</span>
                        </h3>
                        <button
                          onClick={() => setMobileNavSection('games')}
                          className="text-xs font-black text-purple-700 hover:underline cursor-pointer"
                        >
                          كل الألعاب ({menuItems.length - 1}) 👈
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: 'all', label: '🌟 الكل' },
                          { id: 'puzzle', label: '🧩 بزل' },
                          { id: 'sudan', label: '🇸🇩 كوش' },
                          { id: 'science', label: '🧪 علوم' },
                          { id: 'languages', label: '📚 لغات' },
                          { id: 'arts', label: '🎨 فنون' },
                          { id: 'brain', label: '🦉 ذكاء' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveFilter(tab.id as any);
                              playClick();
                            }}
                            className={`clay-pill px-3 py-1.5 text-xs font-black shrink-0 transition-all cursor-pointer ${
                              activeFilter === tab.id 
                                ? 'clay-pill-active scale-105' 
                                : 'text-[#26214B] hover:bg-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2-Column Mobile Tactile Games Grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {filteredMenuItems.map(item => (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            playStarSound();
                          }}
                          whileTap={{ scale: 0.94 }}
                          className="clay-card p-3 rounded-[26px] text-right flex flex-col justify-between h-[155px] cursor-pointer transition-all active:scale-95 hover:shadow-[0_12px_24px_rgba(108,92,231,0.15)]"
                          id={`mobile-card-${item.id}`}
                        >
                          <div>
                            <div className="flex items-start justify-between">
                              <span className="text-3xl select-none">{item.label.split(' ')[0]}</span>
                              <span className="clay-pill px-2 py-0.5 text-indigo-950 text-[9px] font-black border-indigo-100">
                                {item.badge}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-[#26214B] line-clamp-1 mt-2">
                              {item.label.substring(item.label.indexOf(' ') + 1)}
                            </h4>
                            <p className="text-[10px] font-bold text-[#635B9F] line-clamp-2 mt-0.5 leading-snug">
                              {item.desc}
                            </p>
                          </div>
                          <div className="flex items-center justify-between border-t border-white/60 pt-2 mt-1">
                            <span className="text-[10px] font-black text-teal-700 flex items-center gap-0.5">
                              <span>العب</span>
                              <span>👈</span>
                            </span>
                            <span className="clay-pill px-1.5 py-0.2 text-[9px] font-black text-amber-700">⭐ +10</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Daily Wisdom Mascot Card */}
                    <div className="clay-card rounded-[28px] p-4 flex items-center gap-3">
                      <div className="text-3xl select-none animate-bounce shrink-0">🦉✨</div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-[#26214B]">نصيحة سمسم اليومية:</h4>
                        <p className="text-[11px] font-bold text-[#635B9F] leading-snug mt-0.5">
                          "كل لغز تحله وكل مسألة تركبها تقودك لتكون بطل المستقبل! انطلق واصنع الإنجاز!"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-section: 100 Games Catalog (mobileNavSection === 'games') */}
                {mobileNavSection === 'games' && (
                  <div className="space-y-3">
                    <div className="clay-card rounded-[28px] p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#26214B]">موسوعة الألعاب الكاملة 🌟</span>
                        <span className="clay-pill px-2.5 py-0.5 text-[10px] font-black text-purple-900 border-purple-200">
                          100 لعبة
                        </span>
                      </div>
                      {/* Filter chips */}
                      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: 'all', label: '🌟 الكل' },
                          { id: 'puzzle', label: '🧩 بزل' },
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
                            className={`clay-pill px-3 py-1 text-xs font-black shrink-0 transition-all cursor-pointer ${
                              activeFilter === filter.id 
                                ? 'clay-pill-active scale-105' 
                                : 'text-gray-700 hover:bg-white'
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 1-column responsive game list */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {filteredMenuItems.map((item) => (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id as any);
                            playStarSound();
                          }}
                          whileTap={{ scale: 0.96 }}
                          className="clay-card p-3.5 rounded-[24px] flex items-center justify-between text-right cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-3xl select-none">{item.label.split(' ')[0]}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-black text-[#26214B]">
                                  {item.label.substring(item.label.indexOf(' ') + 1)}
                                </h4>
                                {item.isNew && (
                                  <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                                    جديد 🔥
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-[#635B9F] line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-purple-100/80 text-purple-900 flex items-center justify-center text-xs font-black shrink-0 border border-purple-200">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-section: Sudan Heritage (mobileNavSection === 'sudan') */}
                {mobileNavSection === 'sudan' && (
                  <div className="space-y-3">
                    <div className="clay-card rounded-[32px] p-5 text-center relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 text-white border-white/80 shadow-md">
                      <span className="text-4xl">🇸🇩👑</span>
                      <h3 className="text-lg font-black mt-1">واحة أمجاد وتراث السودان</h3>
                      <p className="text-xs font-bold text-white/90 mt-1">
                        ألعاب تفاعلية ممتعة تعرّف أبطالنا بحضارة كوش والتراث السوداني الأصيل
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
                          className="clay-card p-4 rounded-[28px] text-right flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{item.label.split(' ')[0]}</span>
                            <div>
                              <h4 className="text-sm font-black text-[#26214B]">
                                {item.label.substring(item.label.indexOf(' ') + 1)}
                              </h4>
                              <p className="text-xs font-bold text-[#635B9F] mt-0.5 line-clamp-2">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <div className="clay-btn-coral px-3.5 py-1.5 text-xs font-black rounded-xl shadow-xs shrink-0">
                            العب 🚀
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-section: Rewards (mobileNavSection === 'rewards') */}
                {mobileNavSection === 'rewards' && (
                  <div className="space-y-4">
                    <div className="clay-card rounded-[32px] p-5 text-center">
                      <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2 border-2 border-white shadow-md">
                        🏆
                      </div>
                      <h3 className="text-base font-black text-[#26214B]">أوسمة البطل الذكي</h3>
                      <p className="text-xs font-bold text-[#635B9F] mt-1">
                        كسبت {stats.stars} نجمة ووصلت للمستوى {stats.level}!
                      </p>
                      
                      <div className="w-full h-5 bg-white/70 rounded-full overflow-hidden border border-white mt-3 p-0.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(stats.stars % 50) * 2}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-black text-[#635B9F] mt-1 block">
                        {(stats.stars % 50) * 2}% نحو المستوى {stats.level + 1}
                      </span>
                    </div>

                    <Suspense fallback={<LoadingFallback />}>
                      <RewardsPanel stats={stats} />
                    </Suspense>
                  </div>
                )}

                {/* Sub-section: Settings & Themes (mobileNavSection === 'settings') */}
                {mobileNavSection === 'settings' && (
                  <div className="space-y-4">
                    {/* Background Color Picker */}
                    <div className="clay-card rounded-[32px] p-5">
                      <h4 className="text-xs font-black text-[#26214B] mb-3 flex items-center gap-1.5">
                        <Palette className="w-4 h-4 text-purple-600" />
                        <span>اختر لون وثيم المنصة:</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        {BG_COLORS.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              setBgColor(c.id);
                              playClick();
                            }}
                            className={`clay-pill p-2 text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                              bgColor === c.id 
                                ? 'border-purple-400 bg-purple-100 text-purple-950 shadow-xs' 
                                : 'text-gray-700 hover:bg-white'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full border border-white/80 shadow-xs shrink-0" style={{ backgroundColor: c.value }} />
                            <span className="line-clamp-1">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sticker Board */}
                    <div className="clay-card rounded-[32px] p-5">
                      <h4 className="text-xs font-black text-[#26214B] mb-2">جدار ملصقاتي التفاعلي ✨</h4>
                      <div className="border-2 border-dashed border-purple-200 bg-purple-50/40 p-3 rounded-2xl flex flex-wrap justify-center gap-3 min-h-[100px] items-center">
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
                
                {/* 1. Top Bento Row: 3 Claymorphic Cards (matching media_1788709434478.jpg) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Card 1: 3D Golden Naqla Emblem Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="clay-card rounded-[32px] p-6 flex flex-col items-center justify-center relative overflow-hidden group min-h-[220px]"
                  >
                    <div className="w-24 h-24 relative flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
                      <div className="w-20 h-20 rounded-3xl p-1 shadow-[0_10px_24px_rgba(212,175,55,0.35)] flex items-center justify-center bg-gradient-to-tr from-[#D4AF37] via-[#FFD700] to-[#FFF4BD] border-2 border-white/80">
                        <img 
                          src="/favicon.png" 
                          alt="Naqla 3D Golden Emblem" 
                          className="w-16 h-16 object-contain drop-shadow-md filter brightness-110" 
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-widest bg-gradient-to-r from-[#B38728] via-[#E5C158] to-[#DAA520] bg-clip-text text-transparent drop-shadow-xs">
                      NAQLA
                    </h3>
                    <p className="text-[11px] font-bold text-[#635B9F] mt-1">
                      منصة الألعاب الإلكترونية التفاعلية
                    </p>
                  </motion.div>

                  {/* Card 2: Theme / Atmosphere Customizer */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="clay-card rounded-[32px] p-6 flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-100/80 flex items-center justify-center text-lg border border-purple-200">
                        🎨
                      </div>
                      <h3 className="text-base font-black text-[#26214B]">لون خلفية المنصة:</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {BG_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setBgColor(c.id);
                            playClick();
                          }}
                          className={`clay-pill px-3 py-2 text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                            bgColor === c.id
                              ? 'border-purple-400 bg-purple-100/90 text-purple-950 shadow-[0_4px_12px_rgba(108,92,231,0.25)]'
                              : 'text-gray-700 hover:bg-white/90'
                          }`}
                        >
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/80 shadow-xs shrink-0" 
                            style={{ backgroundColor: c.value }} 
                          />
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Card 3: Kid Profile & Explorer Level */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="clay-card rounded-[32px] p-6 flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <span className="clay-pill px-3 py-0.5 text-[11px] font-black text-amber-800 border-amber-200/90 shadow-xs inline-flex items-center gap-1">
                            <span>المستكشف الذكي</span>
                            <span>⭐</span>
                          </span>
                          <h3 className="text-2xl font-black text-[#26214B] mt-1.5">
                            المستوى {stats.level}
                          </h3>
                        </div>
                        <div className="w-15 h-15 rounded-2xl p-1 bg-gradient-to-tr from-[#FF7675] via-[#FFD93D] to-[#4ECDC4] shadow-md flex items-center justify-center shrink-0">
                          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl shadow-inner">
                            👦
                          </div>
                        </div>
                      </div>

                      {/* Candy Gradient Progress Bar */}
                      <div className="w-full h-6 bg-white/70 rounded-full overflow-hidden border border-white/90 shadow-inner mt-2 relative p-0.5">
                        <motion.div 
                          className="h-full rounded-full bg-gradient-to-r from-[#2ECC71] via-[#4ECDC4] to-[#FF7675] shadow-xs"
                          style={{ width: `${Math.max(12, Math.min(100, (stats.stars % 50) * 2))}%` }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-800 drop-shadow-xs">
                          {Math.min(100, (stats.stars % 50) * 2)}% نحو المستوى {stats.level + 1}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-black text-[#635B9F] border-t border-white/60 pt-3">
                      <span>إجمالي النجوم: ⭐ {stats.stars}</span>
                      <span>النشاط المتواصل: 🔥 {stats.streak} أيام</span>
                    </div>
                  </motion.div>

                </div>

                {/* 2. Central Hero Ribbon: 3D Emblem & 100 Games Academy Master Ribbon */}
                <div className="clay-card rounded-[36px] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                  
                  {/* Right: Academy Title & Highlights */}
                  <div className="flex items-center gap-4 text-right order-1 md:order-3">
                    <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-white shrink-0 animate-bounce">
                      🌟
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 clay-pill px-3 py-0.5 text-[11px] font-black text-amber-900 border-amber-200 shadow-xs mb-1">
                        <span>موسوعة المئة لعبة العالمية</span>
                        <span>🌟</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-[#26214B]">
                        أكاديمية الـ 100 لعبة ومنهاج التميز 🚀
                      </h3>
                      <p className="text-[11px] sm:text-xs font-bold text-[#635B9F] max-w-md line-clamp-1 mt-0.5">
                        قطار الحروف الأبجدية، سباق سيارات تجميع الكلمات، محاكاة العلوم، الرياضيات، والبرمجة!
                      </p>
                    </div>
                  </div>

                  {/* Center: Iconic 3D NAQLA Emblem (from media_1788709434478.jpg) */}
                  <div 
                    onClick={() => {
                      setActiveTab('games_100_hub');
                      playStarSound();
                    }}
                    className="flex flex-col items-center justify-center cursor-pointer group order-2 shrink-0 py-1"
                    title="انقر لفتح موسوعة الـ 100 لعبة"
                  >
                    <div className="w-44 sm:w-52 h-20 sm:h-24 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src="/naqla-games-logo.jpg" 
                        alt="NAQLA 3D Emblem" 
                        className="max-h-full object-contain drop-shadow-[0_8px_18px_rgba(108,92,231,0.25)]" 
                      />
                    </div>
                    <span className="text-[10px] font-black tracking-wider text-[#635B9F] mt-1">
                      منصة الألعاب الإلكترونية التفاعلية
                    </span>
                  </div>

                  {/* Left: Quick Launch & 100/100 Pill */}
                  <div className="flex items-center gap-3 order-3 md:order-1 shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab('games_100_hub');
                        playStarSound();
                      }}
                      className="clay-btn-coral px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                    >
                      <span>استكشف الأكاديمية</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="clay-pill px-3.5 py-2 text-center text-xs font-black text-[#26214B]">
                      <span className="block text-sm font-black text-indigo-900">100 / 100</span>
                      <span className="text-[9px] text-gray-500 font-bold">لعبة منجزة</span>
                    </div>
                  </div>

                </div>

                {/* 3. Category Filter Chips & Stylish Arabic Header (matching mockup bottom) */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    
                    {/* Right: Stylish 3D Title */}
                    <h3 className="text-2xl sm:text-3xl font-black text-[#26214B] flex items-center gap-2 drop-shadow-xs">
                      <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                      <span>اختر مغامرتك وابدأ 🧭</span>
                    </h3>

                    {/* Left: 3D Rounded Claymorphic Pills */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: '🌟 كل الألعاب', color: 'bg-amber-100 text-amber-950 border-amber-300' },
                        { id: 'puzzle', label: '🧩 بزل وتراكيب', color: 'bg-violet-100 text-violet-950 border-violet-300' },
                        { id: 'sudan', label: '🇸🇩 أمجاد السودان', color: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
                        { id: 'science', label: '🧪 علوم وحساب', color: 'bg-cyan-100 text-cyan-950 border-cyan-300' },
                        { id: 'languages', label: '📚 لغات وحروف', color: 'bg-purple-100 text-purple-950 border-purple-300' },
                        { id: 'arts', label: '🎨 فنون وموسيقى', color: 'bg-rose-100 text-rose-950 border-rose-300' },
                        { id: 'brain', label: '🦉 أذكياء نقلة', color: 'bg-indigo-100 text-indigo-950 border-indigo-300' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveFilter(tab.id as any);
                            playClick();
                          }}
                          className={`clay-pill px-4 py-2 text-xs font-black cursor-pointer transition-all ${
                            activeFilter === tab.id
                              ? 'clay-pill-active scale-105'
                              : 'text-[#26214B] hover:bg-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 4. World-Class Claymorphic Bento Games Grid */}
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
                        className="clay-card group text-right p-6 rounded-[32px] flex flex-col justify-between h-[215px] cursor-pointer relative overflow-hidden transition-all duration-300 hover:shadow-[0_16px_36px_rgba(108,92,231,0.18)]"
                        id={`bento-card-${item.id}`}
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-4xl sm:text-5xl select-none group-hover:scale-110 transition-transform duration-300">
                              {item.label.split(' ')[0]}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.isNew && (
                                <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs animate-pulse">
                                  جديد 🔥
                                </span>
                              )}
                              <span className="clay-pill px-2.5 py-0.5 text-[11px] font-black text-indigo-900 border-indigo-100">
                                {item.badge}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-base sm:text-lg font-black text-[#26214B] group-hover:text-purple-700 transition-colors">
                            {item.label.substring(item.label.indexOf(' ') + 1)}
                          </h4>
                          <p className="text-[#635B9F] text-xs font-bold mt-1.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/60 pt-3 mt-2">
                          <span className="text-xs font-black text-teal-700 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                            <span>ابدأ اللعبة الآن</span>
                            <span>👈</span>
                          </span>
                          <span className="clay-pill px-2 py-0.5 text-[10px] font-black text-amber-600">⭐ +10</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Exit Confirmation Button */}
                <div className="flex justify-center pt-8">
                  <button
                    onClick={handleBackClick}
                    className="clay-btn-coral px-7 py-3 rounded-2xl text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
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
            <span className="text-2xl">🎮</span> 100 لعبة تعليمية وتراثية عبر 8 أكاديميات عالمية
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
        {/* ========================================================================= */}
        {/* 6. APP EXIT CONFIRMATION MODAL (FOR MOBILE HARDWARE & GESTURE BACK)       */}
        {/* ========================================================================= */}
        {showExitModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" id="app-exit-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-[32px] border-4 border-[#6C5CE7] shadow-[0_12px_0_0_#4A3CB5] p-6 sm:p-8 max-w-md w-full relative z-50 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl border-3 border-purple-300 overflow-hidden shadow-lg p-1 bg-gradient-to-tr from-purple-100 to-indigo-50">
                <img src="/favicon.png" alt="Naqla Games" className="w-full h-full object-cover rounded-xl" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-relaxed">
                هل أنت متأكد من الخروج من تطبيق ألعاب نقلة؟ 🎮👋
              </h3>
              
              <p className="text-xs sm:text-sm font-bold text-gray-600 mb-6">
                سنشتاق إليك كثيراً! كل ألعابك وإنجازاتك ونجومك ⭐ محفوظة وجاهزة دائماً لعودتك في أي وقت!
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowExitModal(false);
                    // Try closing the tab/app or navigate back
                    if (window.history.length > 1) {
                      window.history.go(-2);
                    } else {
                      window.close();
                    }
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm rounded-2xl border-3 border-red-700 shadow-[0_4px_0_0_#991B1B] active:translate-y-1 active:shadow-none transition cursor-pointer flex items-center justify-center gap-1.5"
                  id="exit-modal-confirm"
                >
                  <span>🚪</span>
                  <span>نعم، خروج من التطبيق</span>
                </button>
                <button
                  onClick={() => setShowExitModal(false)}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs sm:text-sm rounded-2xl border-3 border-emerald-700 shadow-[0_4px_0_0_#065F46] active:translate-y-1 active:shadow-none transition cursor-pointer flex items-center justify-center gap-1.5"
                  id="exit-modal-stay"
                >
                  <span>🎮</span>
                  <span>البقاء واللعب!</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* 7. iOS Safari Installation Guide Modal */}
        {showIosInstallGuide && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" id="ios-install-modal">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosInstallGuide(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white rounded-[32px] border-4 border-indigo-500 shadow-[0_12px_0_0_#3730A3] p-6 sm:p-8 max-w-md w-full relative z-50 text-right"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-indigo-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-200 p-0.5 bg-indigo-50">
                    <img src="/favicon.png" alt="Naqla Games" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900">تثبيت تطبيق ألعاب نقلة 📲</h3>
                    <p className="text-[11px] text-gray-500 font-bold">على أجهزة الآيفون والآيباد (iOS)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosInstallGuide(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm font-bold text-gray-700 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">1</span>
                  <span>اضغط على زر المشاركة <strong>(⎋ Share)</strong> في أسفل شاشة متصفح Safari.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">2</span>
                  <span>مرر القائمة لأسفل واختر <strong>(إضافة إلى الشاشة الرئيسية ➕ Add to Home Screen)</strong>.</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">3</span>
                  <span>اضغط على <strong>(إضافة Add)</strong> في الزاوية العلوية وسيظهر التطبيق على شاشتك بأيقونته الرسمية فوراً! 🌟</span>
                </div>
              </div>

              <button
                onClick={() => setShowIosInstallGuide(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl border-3 border-indigo-800 shadow-[0_4px_0_0_#312E81] active:translate-y-1 transition cursor-pointer"
              >
                فهمت، سأقوم بالتثبيت الآن! 👍
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
