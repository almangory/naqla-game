/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  Check, 
  Play, 
  Pause,
  Sun,
  Moon,
  Zap,
  Magnet,
  Flame,
  Droplet,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface ScienceGameProps {
  addStars: (amount: number) => void;
}

type ExperimentId = 
  | 'magnet'
  | 'gravity'
  | 'day_night'
  | 'matter_states'
  | 'circuit'
  | 'volcano'
  | 'density'
  | 'prism'
  | 'sound_string'
  | 'static_balloon'
  | 'surface_tension'
  | 'plant_growth';

type CategoryFilter = 'all' | 'physics' | 'chemistry' | 'space' | 'biology';

export default function ScienceGame({ addStars }: ScienceGameProps) {
  const { speak } = useSpeech();
  const [activeExp, setActiveExp] = useState<ExperimentId>('magnet');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Audio Synthesizer for Physical Events
  const playRealisticSound = (type: 'metal_clink' | 'heavy_thud' | 'spark' | 'bubble' | 'splash' | 'hum' | 'whoosh' | 'tone', freq = 440) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'metal_clink') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'heavy_thud') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'spark') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'bubble') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + Math.random() * 300, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600 + Math.random() * 200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'splash') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'tone') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {}
  };

  const markExperimentDone = (id: ExperimentId) => {
    if (!completedExperiments.includes(id)) {
      setCompletedExperiments(prev => [...prev, id]);
      addStars(15);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
    setShowExplanation(true);
  };

  // =========================================================================
  // 1. REALISTIC MAGNETISM ENGINE (DRAGGABLE HORSESHOE MAGNET WITH POLES)
  // =========================================================================
  const [magnetPos, setMagnetPos] = useState({ x: 180, y: 70 });
  const [magnetFlipped, setMagnetFlipped] = useState(false);
  const [magnetItems, setMagnetItems] = useState([
    { id: 'nail1', name: 'مسمار صلب', isMagnetic: true, x: 60, y: 220, attached: false, type: 'nail' },
    { id: 'nail2', name: 'مسمار فولاذ', isMagnetic: true, x: 120, y: 240, attached: false, type: 'nail' },
    { id: 'clip1', name: 'مشبك ورق حديد', isMagnetic: true, x: 200, y: 230, attached: false, type: 'clip' },
    { id: 'clip2', name: 'مشبك ورق ثان', isMagnetic: true, x: 260, y: 220, attached: false, type: 'clip' },
    { id: 'coin', name: 'عملة ذهبية', isMagnetic: false, x: 320, y: 235, attached: false, type: 'coin' },
    { id: 'wood', name: 'قطعة خشب', isMagnetic: false, x: 380, y: 225, attached: false, type: 'wood' },
  ]);

  // Magnet drag & distance attraction physics
  const handleMagnetMove = (clientX: number, clientY: number, containerRect: DOMRect) => {
    const newX = Math.max(30, Math.min(containerRect.width - 70, clientX - containerRect.left - 40));
    const newY = Math.max(20, Math.min(containerRect.height - 90, clientY - containerRect.top - 40));
    setMagnetPos({ x: newX, y: newY });

    // Center of poles
    const poleX = newX + 40;
    const poleY = newY + 70;

    // Check physics distance for each item
    setMagnetItems(prev => {
      let anyAttached = false;
      const updated = prev.map(item => {
        if (!item.isMagnetic) return item;

        const currentX = item.attached ? poleX + (Math.random() * 16 - 8) : item.x;
        const currentY = item.attached ? poleY + (Math.random() * 8) : item.y;

        const dx = poleX - currentX;
        const dy = poleY - currentY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Attraction threshold (85px)
        if (dist < 85 && !item.attached) {
          playRealisticSound('metal_clink');
          anyAttached = true;
          return {
            ...item,
            x: poleX + (Math.random() * 16 - 8),
            y: poleY + 4,
            attached: true
          };
        } else if (item.attached) {
          return {
            ...item,
            x: poleX + (Math.random() * 12 - 6),
            y: poleY + 4
          };
        }
        return item;
      });

      if (anyAttached) {
        markExperimentDone('magnet');
      }
      return updated;
    });
  };

  const shakeMagnetRelease = () => {
    playRealisticSound('metal_clink');
    setMagnetItems(prev => prev.map(item => ({
      ...item,
      attached: false,
      y: 220 + Math.random() * 25
    })));
  };

  // =========================================================================
  // 2. REALISTIC GALILEO'S FREE FALL & PLANETARY GRAVITY (WITH VACUUM TOGGLE)
  // =========================================================================
  const [gravityPlanet, setGravityPlanet] = useState<'earth' | 'moon' | 'mars' | 'jupiter'>('earth');
  const [isVacuum, setIsVacuum] = useState(false);
  const [dropState, setDropState] = useState<'ready' | 'falling' | 'landed'>('ready');
  const [dropProgress, setDropProgress] = useState({ ball: 0, apple: 0, feather: 0 });
  const [fallTimer, setFallTimer] = useState(0);

  const planetGravities = {
    earth: { name: 'الأرض', g: 9.8, color: '#3888C1' },
    moon: { name: 'القمر', g: 1.6, color: '#9E9E9E' },
    mars: { name: 'المريخ', g: 3.7, color: '#E28743' },
    jupiter: { name: 'المشتري', g: 24.8, color: '#FF8E3C' }
  };

  const triggerFreeFall = () => {
    if (dropState === 'falling') return;
    setDropState('falling');
    setFallTimer(0);
    playRealisticSound('whoosh');

    const g = planetGravities[gravityPlanet].g;
    const startTime = Date.now();

    // In vacuum: All objects have identical fall time t = sqrt(2h/g)
    // With air resistance: Ball has high density (fast), apple medium, feather high drag (slow)
    const baseDuration = Math.sqrt(20 / g) * 800; // ms
    const ballDuration = baseDuration;
    const appleDuration = isVacuum ? baseDuration : baseDuration * 1.15;
    const featherDuration = isVacuum ? baseDuration : baseDuration * 2.8;

    const maxDuration = Math.max(ballDuration, appleDuration, featherDuration);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setFallTimer(Math.min(elapsed / 1000, maxDuration / 1000));

      const pBall = Math.min(100, (elapsed / ballDuration) * 100);
      const pApple = Math.min(100, (elapsed / appleDuration) * 100);
      const pFeather = Math.min(100, (elapsed / featherDuration) * 100);

      setDropProgress({ ball: pBall, apple: pApple, feather: pFeather });

      if (pBall >= 100 && elapsed - ballDuration < 50) {
        playRealisticSound('heavy_thud');
      }

      if (elapsed >= maxDuration) {
        clearInterval(interval);
        setDropState('landed');
        markExperimentDone('gravity');
      }
    }, 20);
  };

  const resetFreeFall = () => {
    setDropState('ready');
    setDropProgress({ ball: 0, apple: 0, feather: 0 });
    setFallTimer(0);
  };

  // =========================================================================
  // 3. REALISTIC SOLAR ARC, DAY/NIGHT & RAYTRACED SHADOW
  // =========================================================================
  const [solarHour, setSolarHour] = useState(12); // 6 to 18 daytime, 18-6 nighttime

  // Calculate sun position on an astronomical parabolic arc
  const sunAngleRad = ((solarHour - 6) / 12) * Math.PI; // 0 at 6:00, PI/2 at 12:00, PI at 18:00
  const isDaytime = solarHour >= 6 && solarHour <= 18;
  const sunX = isDaytime ? 50 - Math.cos(sunAngleRad) * 44 : 50; // %
  const sunY = isDaytime ? 75 - Math.sin(sunAngleRad) * 60 : 120; // %

  // Raytraced character shadow on the ground
  // At noon (12:00): Shadow is directly under feet (length ~15px, scaleX = 0)
  // At 6:00: Shadow extends far to the west (-120px)
  // At 18:00: Shadow extends far to the east (+120px)
  const shadowOffset = isDaytime ? (solarHour - 12) * 18 : 0;
  const shadowLength = isDaytime ? Math.abs(solarHour - 12) * 14 + 20 : 0;
  const shadowOpacity = isDaytime ? Math.max(0.2, 0.7 - Math.abs(solarHour - 12) * 0.06) : 0;

  // Sky color palette based on hour
  const getSkyGradient = (hour: number) => {
    if (hour >= 6 && hour < 8) return 'from-amber-200 via-rose-300 to-sky-400'; // Sunrise
    if (hour >= 8 && hour < 16) return 'from-sky-400 via-sky-300 to-blue-200'; // Full daylight
    if (hour >= 16 && hour <= 18) return 'from-orange-400 via-rose-400 to-purple-700'; // Sunset golden hour
    if (hour > 18 && hour < 20) return 'from-indigo-900 via-purple-900 to-slate-900'; // Twilight
    return 'from-slate-950 via-slate-900 to-indigo-950'; // Night starry sky
  };

  // =========================================================================
  // 4. MOLECULAR KINETICS & STATES OF MATTER WITH BUNSEN BURNER
  // =========================================================================
  const [burnerFlame, setBurnerFlame] = useState<'off' | 'low' | 'high' | 'ice'>('off');
  const [matterTemp, setMatterTemp] = useState(22); // Celsius

  useEffect(() => {
    if (burnerFlame === 'off') return;
    const interval = setInterval(() => {
      setMatterTemp(t => {
        if (burnerFlame === 'high') {
          const next = Math.min(130, t + 4);
          if (next >= 100) {
            playRealisticSound('bubble');
            markExperimentDone('matter_states');
          }
          return next;
        } else if (burnerFlame === 'low') {
          const next = Math.min(75, t + 2);
          return next;
        } else if (burnerFlame === 'ice') {
          const next = Math.max(-25, t - 4);
          if (next <= 0) markExperimentDone('matter_states');
          return next;
        }
        return t;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [burnerFlame]);

  // =========================================================================
  // 5. INTERACTIVE CIRCUIT BREADBOARD (BATTERY, WIRES, KNIFE SWITCH & BULB)
  // =========================================================================
  const [circuitClosed, setCircuitClosed] = useState(false);

  // =========================================================================
  // 6. VISCOUS FLUID VOLCANO ERUPTION
  // =========================================================================
  const [pouredIngredients, setPouredIngredients] = useState<string[]>([]);
  const [isVolcanoFoaming, setIsVolcanoFoaming] = useState(false);

  const pourIngredient = (name: string) => {
    if (!pouredIngredients.includes(name)) {
      playRealisticSound('splash');
      const next = [...pouredIngredients, name];
      setPouredIngredients(next);
      if (next.length === 3) {
        setIsVolcanoFoaming(true);
        playRealisticSound('bubble');
        markExperimentDone('volcano');
      }
    }
  };

  // =========================================================================
  // 7. DENSITY COLUMN WITH REAL HYDROSTATIC EQUILIBRIUM
  // =========================================================================
  const [droppedDensityItems, setDroppedDensityItems] = useState<{ id: string; name: string; y: number; settled: boolean }[]>([]);

  const dropDensityObject = (id: string, name: string, targetY: number) => {
    if (droppedDensityItems.find(i => i.id === id)) return;
    playRealisticSound('splash');
    setDroppedDensityItems(prev => [...prev, { id, name, y: targetY, settled: true }]);
    if (droppedDensityItems.length >= 2) markExperimentDone('density');
  };

  // =========================================================================
  // 8. OPTICAL SNELL'S LAW PRISM & CHROMATIC DISPERSION
  // =========================================================================
  const [prismAngle, setPrismAngle] = useState(38); // degrees

  // =========================================================================
  // 9. VIBRATING GUITAR STRING & WEB AUDIO RESONANCE
  // =========================================================================
  const [stringTension, setStringTension] = useState(440); // A4 440Hz
  const [isStringVibrating, setIsStringVibrating] = useState(false);

  const pluckString = () => {
    setIsStringVibrating(true);
    playRealisticSound('tone', stringTension);
    markExperimentDone('sound_string');
    setTimeout(() => setIsStringVibrating(false), 800);
  };

  // =========================================================================
  // 10. COULOMB STATIC ELECTRICITY BALLOON
  // =========================================================================
  const [balloonChargeCount, setBalloonChargeCount] = useState(0);
  const [paperSnapped, setPaperSnapped] = useState(false);

  const rubBalloon = () => {
    playRealisticSound('spark');
    setBalloonChargeCount(c => Math.min(10, c + 1));
  };

  const attractPaper = () => {
    if (balloonChargeCount >= 3) {
      playRealisticSound('metal_clink');
      setPaperSnapped(true);
      markExperimentDone('static_balloon');
    }
  };

  // =========================================================================
  // 11. WATER SURFACE TENSION SHOCKWAVE & SOAP REPULSION
  // =========================================================================
  const [soapDropped, setSoapDropped] = useState(false);

  const dropSoapDroplet = () => {
    playRealisticSound('splash');
    setSoapDropped(true);
    markExperimentDone('surface_tension');
  };

  // =========================================================================
  // 12. BOTANICAL LIFE CYCLE SIMULATOR & PHOTOSYNTHESIS
  // =========================================================================
  const [plantHydration, setPlantHydration] = useState(0);
  const [plantSunlight, setPlantSunlight] = useState(0);

  // Experiments Catalog
  const experimentsList: {
    id: ExperimentId;
    title: string;
    category: CategoryFilter;
    badge: string;
    description: string;
    scientificTakeaway: string;
  }[] = [
    {
      id: 'magnet',
      title: 'ميدان المغناطيس الفولاذي',
      category: 'physics',
      badge: 'فيزياء ومغناطيس 🧲',
      description: 'اسحب المغناطيس بيدك واقترب من المواد؛ شاهد المسامير تنجذب فعلياً وتلتصق بالقطبين!',
      scientificTakeaway: 'المغناطيس يمتلك مجال قوة غير مرئي يجذب المواد الفيرومغناطيسية (الحديد والصلب والنيكل). كلما قلّت المسافة زادت قوة الجذب وفق قانون التربيع العكسي، بينما الذهب والخشب لا يتأثران أبداً!'
    },
    {
      id: 'gravity',
      title: 'برج غاليليو وغرفة الفراغ',
      category: 'physics',
      badge: 'سقوط حر وجاذبية 🪐',
      description: 'أسقط كرة الحديد والتفاحة والريشة، وجرّب تفريغ الهواء لتشاهد سقوطها معاً في نفس اللحظة!',
      scientificTakeaway: 'اكتشف غاليليو أن جميع الأجسام في الفراغ تسقط بنفس التسارع الثابت مهما اختلفت أوزانها! تأخر الريشة في الهواء سببه احتكاك ومقاومة جزيئات الهواء لمساحة سطحها، وليس خفة وزنها!'
    },
    {
      id: 'day_night',
      title: 'مدار الشمس والظل الشعاعي',
      category: 'space',
      badge: 'فلك وبصريات ☀️',
      description: 'اسحب الشمس بيدك عبر قبة السماء؛ شاهد تغير ألوان الأفق واستطالة وانكماش ظلك الحقيقي!',
      scientificTakeaway: 'الضوء يسير في خطوط مستقيمة! عندما تحجب جسمك أشعة الشمس يتكون الظل. عند الشروق والغروب تكون الشمس منخفضة فيستطيل الظل، وفي الظهيرة تكون فوق رأسك تماماً فيتقلص الظل تحت قدميك!'
    },
    {
      id: 'matter_states',
      title: 'موقد بنسن وحالات المادة',
      category: 'chemistry',
      badge: 'ديناميكا حرارية 🧊♨️',
      description: 'أشعل لهب الموقد تحت قارورة الماء وشاهد تحول بلورات الثلج إلى سائل ثم غليان البخار!',
      scientificTakeaway: 'المادة مكونة من جزيئات دائمة الحركة. الحرارة تزيد من طاقتها الحركية؛ ففي الثلج ترتبط في شبكة صلبة، وفي السائل تنزلق بحرية، وعند الغليان (100°C) تتطاير كغاز في الهواء!'
    },
    {
      id: 'circuit',
      title: 'لوحة الدائرة ومفتاح السكين',
      category: 'physics',
      badge: 'كهرباء وإلكترون ⚡',
      description: 'أغلق مفتاح السكين النحاسي لترى تدفق الإلكترونات وتوهج سلك التنغستن داخل المصباح!',
      scientificTakeaway: 'التيار الكهربائي هو سيل من الإلكترونات الحرة التي تسري فقط في المسار المغلق. عند إغلاق المفتاح تسخن مقاومة سلك التنغستن الدقيق حتى يتوهج بالضوء والحرارة!'
    },
    {
      id: 'volcano',
      title: 'بركان التفاعل الكيميائي',
      category: 'chemistry',
      badge: 'تفاعلات كيميائية 🌋',
      description: 'اسكب بيكربونات الصودا والصبغة وحمض الخل وشاهد فوران الحمم اللزجة وغاز ثاني أكسيد الكربون!',
      scientificTakeaway: 'التفاعل بين حمض الخليك وبيكربونات الصودا ينتج غاز ثاني أكسيد الكربون (CO₂). هذا الغاز المحبوس يرفع الضغط داخل الفوهة ويفور للأعلى حاملاً الصبغة كحمم بركانية حقيقية!'
    },
    {
      id: 'density',
      title: 'عمود الكثافة والطفو السائل',
      category: 'physics',
      badge: 'كثافة أركيميدس ⚖️',
      description: 'أسقط الصمولة الحديدية والعنب والفلين لتشاهد استقرار كل جسم عند طبقة كثافته الدقيقة!',
      scientificTakeaway: 'قاعدة أركيميدس للطفو: الجسم يغوص إذا كانت كثافته أكبر من السائل، ويطفو إذا كانت كثافته أقل. لهذا يستقر الفلين فوق الزيت، والعنب فوق العسل، والصمولة في القاع!'
    },
    {
      id: 'prism',
      title: 'المنشور وتشتت ألوان الطيف',
      category: 'space',
      badge: 'بصريات وضوء 🌈',
      description: 'حرك المنشور الزجاجي في مسار الضوء الأبيض لتشاهد انكساره وتحلله إلى ألوان قوس قزح السبعة!',
      scientificTakeaway: 'وفق قانون سنيل للانكسار، الضوء الأبيض مزيج من أطوال موجية متعددة. لأن الزجاج يبطئ الضوء الأزرق والبنفسجي أكثر من الأحمر، ينكسر كل لون بزاوية مختلفة فيظهر قوس قزح!'
    },
    {
      id: 'sound_string',
      title: 'الوتر الصوتي والرنين النغمي',
      category: 'biology',
      badge: 'صوتيات واهتزاز 🎵',
      description: 'انقر الوتر المشدود واسحبه؛ شاهد اهتزاز الموجة واستمع لتردد النغمة الحقيقي من السماعة!',
      scientificTakeaway: 'الأصوات اهتزازات ميكانيكية في الهواء. عندما يرتعش الوتر يُحدث تضاغطات وتخلخلات هوائية تصل لطبلة أذننا. شد الوتر يزيد سرعة الاهتزاز (التردد بالهرتز) فيصبح الصوت أكثر حدة!'
    },
    {
      id: 'static_balloon',
      title: 'الكهرباء الساكنة وشحنات كولوم',
      category: 'physics',
      badge: 'كهرومغناطيسية 🎈',
      description: 'افرك البالون بالسترة الصوفية لتجميع الشحنات السالبة، وقربه من الورق ليطير ويلتصق به!',
      scientificTakeaway: 'الاحتكاك ينقل الإلكترونات من الصوف إلى البالون فيصبح مشحوناً بشحنة سالبة. عند تقريبه من الورق الخفيف، يستقطب شحناته الموجبة فتجذبه قوة كولوم الكهروستاتيكية في الهواء!'
    },
    {
      id: 'surface_tension',
      title: 'صدمة التوتر السطحي والصابون',
      category: 'biology',
      badge: 'أحياء وموائع 🧼',
      description: 'أسقط قطرة صابون في صحن الماء؛ شاهد موجة كسر التوتر السطحي وهروب الجراثيم فوراً للأطراف!',
      scientificTakeaway: 'جزيئات الماء على السطح تترابط بقوة كوهيجية مشدودة تشبه الغشاء المطاطي. جزيئات الصابون تكسر هذه الروابط فوراً، فينكمش الغشاء نحو الأطراف ساحباً معه الجراثيم والأوساخ!'
    },
    {
      id: 'plant_growth',
      title: 'التمثيل الضوئي ودورة حياة النبات',
      category: 'biology',
      badge: 'أحياء ونبات 🌱',
      description: 'اسقِ التربة بالماء ووفّر أشعة الشمس؛ شاهد تغلغل الجذور ونمو الساق وتفتح زهرة الأكسجين!',
      scientificTakeaway: 'التمثيل الضوئي هو معجزة الطبيعة: تمتص الجذور الماء والأملاح المعدنية، وتمتص صبغة الكلوروفيل في الأوراق فوتونات الشمس وثاني أكسيد الكربون لتصنع السكر وتطلق الأكسجين النقي!'
    }
  ];

  const currentExpData = experimentsList.find(e => e.id === activeExp) || experimentsList[0];

  const filteredList = experimentsList.filter(e => {
    if (activeFilter === 'all') return true;
    return e.category === activeFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in select-none" dir="rtl">
      
      {/* 1. TOP SCIENTIFIC LABORATORY HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-7 rounded-[36px] border-4 border-indigo-400 text-white shadow-[0_12px_36px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 text-center md:text-right relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600/30 backdrop-blur-md rounded-3xl border-2 border-indigo-400/50 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0">
            🔬
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-0.5 rounded-full text-xs font-black shadow-xs mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
              <span>محاكي الفيزياء والكيمياء الواقعي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              مختبر التجارب التفاعلية الحقيقية ⚙️
            </h2>
            <p className="text-xs sm:text-sm font-bold text-indigo-200 mt-1 max-w-xl">
              تجارب فيزيائية وكيميائية واقعية مبنية على قوانين الحركة والجاذبية والموائع؛ تحكّم بيدك وشاهد الأثر الحقيقي!
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0 relative z-10">
          <div className="text-xs font-bold text-indigo-200">التجارب المكتملة:</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
            {completedExperiments.length} / 12 ⭐
          </div>
          <div className="text-[10px] font-bold text-teal-300 mt-0.5">
            +15 نجمة لكل تجربة ناجحة
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTERS & EXPERIMENT SELECTOR TABS */}
      <div className="bg-white p-4 sm:p-5 rounded-[32px] border-4 border-amber-200 shadow-sm space-y-4">
        
        {/* Category Filters */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black text-gray-700 flex items-center gap-1">
            <span>🧭</span>
            <span>المجال العلمي:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '🌟 كل التجارب (12)' },
              { id: 'physics', label: '🧲 فيزياء وقوى' },
              { id: 'chemistry', label: '🧪 كيمياء ومواد' },
              { id: 'space', label: '🪐 فضاء وضوء' },
              { id: 'biology', label: '🌱 أحياء وموجات' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#FF8E3C] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Experiments Carousel */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
          {filteredList.map(exp => {
            const isSelected = activeExp === exp.id;
            const isDone = completedExperiments.includes(exp.id);
            return (
              <button
                key={exp.id}
                onClick={() => {
                  setActiveExp(exp.id);
                  setShowExplanation(false);
                  playRealisticSound('whoosh');
                }}
                className={`flex-1 min-w-[170px] sm:min-w-[190px] p-3.5 rounded-2xl border-3 text-right flex flex-col justify-between transition-all cursor-pointer snap-start ${
                  isSelected
                    ? 'bg-amber-100/90 border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130] translate-y-[-2px]'
                    : 'bg-white border-gray-200 hover:border-amber-300 shadow-[0_3px_0_0_#E0E0E0]'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-950">
                    {exp.badge.split(' ')[0]}
                  </span>
                  {isDone ? (
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                      <Check className="w-3 h-3" /> تم
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400">محاكاة</span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 line-clamp-1">{exp.title}</h4>
                  <p className="text-[10px] font-bold text-gray-500 line-clamp-1 mt-0.5">{exp.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CORE INTERACTIVE SIMULATION SANDBOX */}
      <div className="bg-white rounded-[36px] border-4 border-gray-200 p-4 sm:p-7 shadow-[0_10px_0_0_#D1D1D1] relative">
        
        {/* Active Experiment Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-gray-100 pb-4 mb-5 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-1 rounded-xl">
                {currentExpData.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                {currentExpData.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
              {currentExpData.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                speak(`${currentExpData.title}. ${currentExpData.description}. ${currentExpData.scientificTakeaway}`);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>استمع للشرح</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SIMULATION WORKBENCH CONTAINER                                */}
        {/* ------------------------------------------------------------- */}
        <div className="relative rounded-3xl overflow-hidden border-3 border-gray-300 bg-slate-900 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between p-4">

          {/* =========================================================== */}
          {/* 1. REALISTIC MAGNETISM EXPERIMENT                           */}
          {/* =========================================================== */}
          {activeExp === 'magnet' && (
            <div 
              className="relative w-full h-full min-h-[360px] cursor-crosshair overflow-hidden touch-none"
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleMagnetMove(e.clientX, e.clientY, rect);
              }}
            >
              {/* Wooden Lab Desk Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#2d3436] to-[#1e272e] opacity-90" />

              {/* Instructions Pill */}
              <div className="absolute top-3 inset-x-0 flex justify-center z-20 pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md text-gray-800 px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                  🧲 حرّك المغناطيس بإصبعك واقترب من المسامير لتلتصق به!
                </span>
              </div>

              {/* Draggable Horseshoe Magnet */}
              <div
                style={{
                  transform: `translate(${magnetPos.x}px, ${magnetPos.y}px)`,
                  transition: 'transform 0.04s ease-out'
                }}
                className="absolute top-0 left-0 z-30 pointer-events-none select-none"
              >
                <div className="relative w-24 h-24">
                  {/* Horseshoe Magnet Realistic SVG Graphic */}
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                    {/* Arch */}
                    <path
                      d="M 20 85 L 20 40 A 30 30 0 0 1 80 40 L 80 85"
                      fill="none"
                      stroke="#e74c3c"
                      strokeWidth="20"
                      strokeLinecap="square"
                    />
                    {/* South Blue Half */}
                    <path
                      d="M 80 40 L 80 85"
                      fill="none"
                      stroke="#0984e3"
                      strokeWidth="20"
                      strokeLinecap="square"
                    />
                    {/* Silver Tips */}
                    <rect x="10" y="80" width="20" height="8" fill="#dfe6e9" stroke="#b2bec3" strokeWidth="1" />
                    <rect x="70" y="80" width="20" height="8" fill="#dfe6e9" stroke="#b2bec3" strokeWidth="1" />
                    {/* Labels N & S */}
                    <text x="20" y="60" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">N</text>
                    <text x="80" y="60" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">S</text>
                  </svg>
                </div>
              </div>

              {/* Scattered Physical Objects on the Table */}
              {magnetItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    transform: `translate(${item.x}px, ${item.y}px)`,
                    transition: item.attached ? 'transform 0.05s ease-out' : 'transform 0.3s ease-out'
                  }}
                  className={`absolute top-0 left-0 z-20 flex flex-col items-center pointer-events-none select-none transition-opacity ${item.attached ? 'scale-110' : ''}`}
                >
                  {item.type === 'nail' && (
                    <div className="w-4 h-10 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 rounded-sm shadow-md flex flex-col items-center rotate-45">
                      <div className="w-7 h-2 bg-gray-400 rounded-xs -mt-1" />
                      <div className="w-1 flex-1 bg-gray-300" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    </div>
                  )}
                  {item.type === 'clip' && (
                    <div className="w-5 h-9 border-2 border-gray-300 rounded-full shadow-md -rotate-12" />
                  )}
                  {item.type === 'coin' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-500 shadow-md flex items-center justify-center text-[10px] font-black text-amber-900">
                      ذهب
                    </div>
                  )}
                  {item.type === 'wood' && (
                    <div className="w-9 h-9 rounded-lg bg-[#8d6e63] border-2 border-[#5d4037] shadow-md flex items-center justify-center text-[10px] font-black text-white">
                      خشب
                    </div>
                  )}

                  <span className={`text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full ${item.attached ? 'bg-emerald-500 text-white' : 'bg-black/60 text-white'}`}>
                    {item.name}
                  </span>
                </div>
              ))}

              {/* Bottom Sandbox Action Controls */}
              <div className="absolute bottom-3 inset-x-3 flex justify-between items-center z-30">
                <button
                  onClick={shakeMagnetRelease}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md border-2 border-white cursor-pointer active:scale-95"
                >
                  📳 هز المغناطيس لإسقاط المعادن
                </button>
                <div className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-xl">
                  المعادن الملتصقة: {magnetItems.filter(i => i.attached).length} / 4
                </div>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 2. REALISTIC GALILEO FREE FALL & VACUUM TUBE                */}
          {/* =========================================================== */}
          {activeExp === 'gravity' && (
            <div className="w-full h-full flex flex-col justify-between space-y-4">
              {/* Drop Chamber and Gauge */}
              <div className="flex-1 flex gap-4 items-stretch min-h-[260px]">
                
                {/* Metric Measurement Ruler */}
                <div className="w-12 bg-slate-800 rounded-2xl border-2 border-slate-700 p-1 flex flex-col justify-between items-center text-[10px] text-gray-400 font-mono">
                  <span>10m</span>
                  <span>8m</span>
                  <span>6m</span>
                  <span>4m</span>
                  <span>2m</span>
                  <span className="text-amber-400 font-black">0m</span>
                </div>

                {/* Vertical Glass Vacuum Chamber */}
                <div className={`flex-1 rounded-3xl border-4 ${isVacuum ? 'border-purple-400 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-sky-400 bg-sky-950/20'} relative overflow-hidden flex justify-around items-start p-4`}>
                  
                  {/* Vacuum Indicator Tag */}
                  <div className="absolute top-2 right-3 text-[11px] font-black z-10">
                    {isVacuum ? (
                      <span className="bg-purple-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        🌌 تفريغ هوائي تام (فراغ)
                      </span>
                    ) : (
                      <span className="bg-sky-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                        💨 هواء طبيعي (مقاومة سحب)
                      </span>
                    )}
                  </div>

                  {/* 1. Heavy Cannonball */}
                  <div className="flex flex-col items-center h-full justify-start relative w-16">
                    <div 
                      style={{ transform: `translateY(${dropProgress.ball * 2.1}px)` }}
                      className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-300 border-2 border-slate-400 shadow-xl flex items-center justify-center text-xs font-black text-white"
                    >
                      5kg
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold mt-2">حديد ثقيل</span>
                  </div>

                  {/* 2. Apple */}
                  <div className="flex flex-col items-center h-full justify-start relative w-16">
                    <div 
                      style={{ transform: `translateY(${dropProgress.apple * 2.1}px)` }}
                      className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border-2 border-red-300 shadow-md flex items-center justify-center text-xl select-none"
                    >
                      🍎
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold mt-2">تفاحة 150g</span>
                  </div>

                  {/* 3. Light Feather */}
                  <div className="flex flex-col items-center h-full justify-start relative w-16">
                    <div 
                      style={{ 
                        transform: `translateY(${dropProgress.feather * 2.1}px) rotate(${isVacuum ? 0 : Math.sin(dropProgress.feather / 5) * 20}deg)` 
                      }}
                      className="w-12 h-12 flex items-center justify-center text-3xl select-none"
                    >
                      🪶
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold mt-2">ريشة 2g</span>
                  </div>

                  {/* Bottom Landing Surface */}
                  <div className="absolute bottom-0 inset-x-0 h-3 bg-amber-600 border-t-2 border-amber-400" />
                </div>

                {/* Digital Stopwatch & Readout */}
                <div className="w-32 bg-slate-800 rounded-2xl border-2 border-slate-700 p-3 flex flex-col justify-between text-center">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400">ساعة التوقيت:</span>
                    <div className="text-2xl font-mono font-black text-amber-300 mt-1">
                      {fallTimer.toFixed(2)}s
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400">جاذبية الكوكب:</span>
                    <div className="text-sm font-black text-white mt-0.5">
                      {planetGravities[gravityPlanet].g} m/s²
                    </div>
                  </div>
                  <button
                    onClick={triggerFreeFall}
                    disabled={dropState === 'falling'}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    🚀 إطلاق السقوط
                  </button>
                </div>
              </div>

              {/* Bottom Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/90 p-3 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-300">الكوكب:</span>
                  {(Object.keys(planetGravities) as (keyof typeof planetGravities)[]).map(p => (
                    <button
                      key={p}
                      onClick={() => {
                        setGravityPlanet(p);
                        resetFreeFall();
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer ${
                        gravityPlanet === p ? 'bg-[#FF8E3C] text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {planetGravities[p].name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsVacuum(v => !v);
                      resetFreeFall();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-black border cursor-pointer ${
                      isVacuum ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-700 text-gray-200 border-slate-600'
                    }`}
                  >
                    {isVacuum ? '🌌 الفراغ مفعّل' : '💨 تفريغ الهواء (Vacuum)'}
                  </button>
                  <button
                    onClick={resetFreeFall}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl cursor-pointer"
                    title="إعادة ضبط الأجسام"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 3. REALISTIC SOLAR ARC, DAY/NIGHT & RAYTRACED SHADOW        */}
          {/* =========================================================== */}
          {activeExp === 'day_night' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              {/* Sky Dome with Animated Sun & Horizon */}
              <div className={`relative flex-1 rounded-3xl overflow-hidden bg-gradient-to-b ${getSkyGradient(solarHour)} transition-colors duration-700 p-4 flex flex-col justify-between min-h-[250px]`}>
                
                {/* Sun Orb traversing parabolic arc */}
                {isDaytime && (
                  <div
                    style={{
                      left: `${sunX}%`,
                      top: `${sunY}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className="absolute z-10 pointer-events-none transition-all duration-300"
                  >
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-200 to-white shadow-[0_0_40px_#fde047] flex items-center justify-center animate-pulse">
                      <Sun className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
                    </div>
                  </div>
                )}

                {/* Night Moon & Stars */}
                {!isDaytime && (
                  <div className="absolute top-6 left-12 z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 shadow-[0_0_30px_#e2e8f0] flex items-center justify-center text-2xl">
                      🌙
                    </div>
                    <span className="text-white text-xs font-black bg-black/40 px-2 py-0.5 rounded-full">
                      سماء الليل والنجوم ✨
                    </span>
                  </div>
                )}

                {/* Hour Badge */}
                <div className="self-end bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-black z-20">
                  الساعة: {solarHour}:00 {isDaytime ? 'نهاراً ☀️' : 'ليلاً 🌙'}
                </div>

                {/* Landscape Horizon & Standing Explorer */}
                <div className="relative z-10 flex flex-col items-center">
                  
                  {/* Explorer Character */}
                  <div className="relative z-20 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-lg shadow-sm">
                      👦
                    </div>
                    <div className="w-6 h-8 bg-blue-600 rounded-t-lg -mt-1" />
                    <div className="flex gap-1">
                      <div className="w-2 h-6 bg-slate-700 rounded-b-sm" />
                      <div className="w-2 h-6 bg-slate-700 rounded-b-sm" />
                    </div>
                  </div>

                  {/* Raytraced Cast Shadow on Ground */}
                  {isDaytime && (
                    <div
                      style={{
                        width: `${shadowLength}px`,
                        transform: `translateX(${shadowOffset}px) scaleY(0.4)`,
                        opacity: shadowOpacity
                      }}
                      className="h-4 bg-slate-950 rounded-full blur-xs transition-all duration-300 -mt-1 z-10 pointer-events-none"
                    />
                  )}

                  {/* Rolling Grass Ground */}
                  <div className="w-full h-8 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-t-3xl mt-1 border-t-2 border-emerald-400 shadow-md" />
                </div>
              </div>

              {/* 24-Hour Slider Control */}
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-1.5">
                <div className="flex justify-between text-xs font-black text-gray-300">
                  <span>الشروق (06:00)</span>
                  <span className="text-amber-300 bg-slate-700 px-3 py-0.5 rounded-lg">
                    حرّك الشمس: {solarHour}:00
                  </span>
                  <span>الغروب (18:00)</span>
                  <span>الليل (24:00)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={solarHour}
                  onChange={(e) => {
                    setSolarHour(Number(e.target.value));
                    markExperimentDone('day_night');
                  }}
                  className="w-full accent-amber-400 cursor-pointer h-2.5 bg-slate-700 rounded-full"
                />
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 4. MOLECULAR DYNAMICS & STATES OF MATTER                   */}
          {/* =========================================================== */}
          {activeExp === 'matter_states' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              {/* Glass Flask with Particle Simulation */}
              <div className="flex-1 relative rounded-3xl bg-slate-950 border-2 border-slate-800 p-4 flex items-center justify-center min-h-[240px]">
                
                {/* Pyrex Glass Flask Outline */}
                <div className="relative w-52 h-56 border-4 border-t-0 border-cyan-400/70 rounded-b-[40px] bg-cyan-950/20 flex flex-col justify-end p-2 overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                  
                  {/* Thermometer Column on the side */}
                  <div className="absolute top-3 right-2 w-3 h-32 bg-slate-800 rounded-full border border-slate-600 flex flex-col justify-end p-0.5">
                    <div 
                      style={{ height: `${Math.max(5, Math.min(100, ((matterTemp + 30) / 160) * 100))}%` }}
                      className={`w-full rounded-full transition-all duration-300 ${matterTemp > 100 ? 'bg-red-500' : matterTemp > 0 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                    />
                  </div>
                  <span className="absolute top-2 left-3 text-xs font-mono font-black text-white">
                    {matterTemp}°C
                  </span>

                  {/* Interactive H2O Molecular Particles */}
                  <div className="w-full h-40 relative">
                    {Array.from({ length: 32 }).map((_, idx) => {
                      // Solid: fixed grid, Liquid: clustered at bottom, Gas: flying everywhere
                      const isSolid = matterTemp <= 0;
                      const isGas = matterTemp >= 100;
                      
                      const solidX = (idx % 6) * 26 + 15;
                      const solidY = Math.floor(idx / 6) * 22 + 50;

                      const liquidX = (idx % 8) * 20 + 10 + (Math.sin(idx + Date.now() / 300) * 4);
                      const liquidY = Math.floor(idx / 8) * 18 + 70;

                      const gasX = (idx * 23) % 160 + 10;
                      const gasY = (idx * 37) % 130 + 10;

                      const posX = isSolid ? solidX : isGas ? gasX : liquidX;
                      const posY = isSolid ? solidY : isGas ? gasY : liquidY;

                      return (
                        <motion.div
                          key={idx}
                          animate={isGas ? {
                            x: [posX, posX + (Math.random() * 40 - 20), posX],
                            y: [posY, posY + (Math.random() * 40 - 20), posY]
                          } : isSolid ? {
                            x: [posX - 1, posX + 1, posX - 1],
                            y: [posY - 1, posY + 1, posY - 1]
                          } : {
                            x: [posX, posX + 3, posX],
                            y: [posY, posY - 2, posY]
                          }}
                          transition={{ repeat: Infinity, duration: isGas ? 0.3 : isSolid ? 0.1 : 0.8 }}
                          style={{ left: `${posX}px`, top: `${posY}px` }}
                          className={`absolute w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs ${
                            isSolid ? 'bg-cyan-300' : isGas ? 'bg-rose-400' : 'bg-sky-400'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* State Description Banner */}
                  <div className="w-full py-1 text-center bg-black/60 rounded-xl text-[11px] font-black text-white">
                    {matterTemp <= 0 ? 'حالة صلبة (شبكة بلورية جليدية ❄️)' : matterTemp >= 100 ? 'حالة غازية (جزيئات سريعة متباعدة ♨️)' : 'حالة سائلة (جزيئات تنزلق بحرية 💧)'}
                  </div>
                </div>

                {/* Bunsen Burner underneath */}
                <div className="absolute bottom-2 flex flex-col items-center">
                  {burnerFlame === 'high' && (
                    <div className="w-8 h-10 bg-gradient-to-t from-blue-600 via-cyan-400 to-yellow-200 rounded-t-full blur-xs animate-pulse" />
                  )}
                  {burnerFlame === 'low' && (
                    <div className="w-5 h-6 bg-gradient-to-t from-blue-500 to-yellow-300 rounded-t-full blur-xs animate-pulse" />
                  )}
                  {burnerFlame === 'ice' && (
                    <div className="text-xl animate-bounce">🧊🧊</div>
                  )}
                  <div className="w-16 h-3 bg-slate-700 rounded-full border border-slate-500" />
                </div>
              </div>

              {/* Thermal Controls */}
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setBurnerFlame('ice')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                    burnerFlame === 'ice' ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-cyan-300 border-cyan-800'
                  }`}
                >
                  🧊 تبريد بالثلج (-25°C)
                </button>
                <button
                  onClick={() => setBurnerFlame('off')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-800 text-gray-300 border border-slate-700 cursor-pointer"
                >
                  ⏹️ إطفاء الموقد
                </button>
                <button
                  onClick={() => setBurnerFlame('low')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                    burnerFlame === 'low' ? 'bg-amber-500 text-white' : 'bg-slate-800 text-amber-300 border-amber-800'
                  }`}
                >
                  🔥 لهب هادئ
                </button>
                <button
                  onClick={() => setBurnerFlame('high')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer ${
                    burnerFlame === 'high' ? 'bg-red-600 text-white' : 'bg-slate-800 text-red-400 border-red-800'
                  }`}
                >
                  ⚡ لهب بنسن قوي (غليان 100°C)
                </button>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 5. INTERACTIVE CIRCUIT BREADBOARD                           */}
          {/* =========================================================== */}
          {activeExp === 'circuit' && (
            <div className="w-full h-full flex flex-col justify-between space-y-4">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-6 flex items-center justify-around relative overflow-hidden min-h-[260px]">
                
                {/* Glowing Copper Wire Loop */}
                <div className={`absolute inset-x-12 inset-y-12 border-4 rounded-3xl transition-all duration-300 ${
                  circuitClosed ? 'border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.5)]' : 'border-slate-700'
                }`} />

                {/* Battery */}
                <div className="relative z-10 flex flex-col items-center bg-slate-800 p-3 rounded-2xl border-2 border-slate-600 shadow-md">
                  <div className="w-10 h-16 bg-gradient-to-b from-blue-700 via-blue-600 to-slate-800 rounded-lg border border-blue-400 flex flex-col justify-between items-center py-1">
                    <span className="text-[10px] font-black text-amber-300">+</span>
                    <span className="text-[9px] font-mono text-white">9V</span>
                    <span className="text-[10px] font-black text-gray-300">-</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 mt-1">بطارية كيميائية</span>
                </div>

                {/* Mechanical Knife Switch */}
                <button
                  onClick={() => {
                    const next = !circuitClosed;
                    setCircuitClosed(next);
                    playRealisticSound('spark');
                    if (next) markExperimentDone('circuit');
                  }}
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                >
                  <div className="w-20 h-16 bg-slate-800 p-2 rounded-2xl border-2 border-slate-600 flex flex-col justify-between items-center shadow-md">
                    {/* Brass Knife Lever */}
                    <div 
                      style={{ 
                        transformOrigin: 'bottom left',
                        transform: circuitClosed ? 'rotate(0deg)' : 'rotate(-35deg)'
                      }}
                      className="w-12 h-2 bg-gradient-to-r from-amber-400 to-yellow-200 rounded-sm shadow-md transition-transform duration-200 border border-amber-500"
                    />
                    <span className={`text-[10px] font-black ${circuitClosed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {circuitClosed ? 'مغلق (متصل)' : 'مفتوح (مفصول)'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 mt-1">انقر للتبديل</span>
                </button>

                {/* Incandescent Bulb */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`relative w-20 h-20 rounded-full border-2 border-slate-600 flex items-center justify-center transition-all duration-300 ${
                    circuitClosed ? 'bg-yellow-200 shadow-[0_0_50px_#fde047] border-yellow-300' : 'bg-slate-800'
                  }`}>
                    {/* Tungsten Filament */}
                    <div className={`w-6 h-6 border-t-2 border-dashed rounded-full ${circuitClosed ? 'border-amber-600 animate-pulse' : 'border-slate-500'}`} />
                  </div>
                  <span className={`text-xs font-black mt-2 ${circuitClosed ? 'text-yellow-300' : 'text-gray-500'}`}>
                    {circuitClosed ? 'المصباح يتوهج! 💡' : 'المصباح مطفأ'}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-gray-400">
                ⚡ عندما تغلق المفتاح يسري تيار الإلكترونات في الدائرة المغلقة ليسخن سلك التنغستن وينير الغرفة!
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 6. VISCOUS FLUID CHEMISTRY VOLCANO                          */}
          {/* =========================================================== */}
          {activeExp === 'volcano' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              {/* Volcano Canvas */}
              <div className="flex-1 relative rounded-3xl bg-slate-950 border-2 border-slate-800 p-4 flex flex-col items-center justify-end overflow-hidden min-h-[250px]">
                
                {/* Chemical Lava Eruption */}
                {isVolcanoFoaming && (
                  <div className="absolute top-6 z-20 flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], y: [-10, -30, -10] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-4xl"
                    >
                      💥🌋🫧
                    </motion.div>
                    <div className="w-14 h-16 bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 rounded-t-full blur-xs" />
                  </div>
                )}

                {/* Mountain Structure */}
                <div className="w-64 h-36 bg-gradient-to-b from-[#5c4033] to-[#2c1d11] rounded-t-[90px] border-4 border-[#1e130a] relative overflow-hidden flex flex-col items-center">
                  <div className="w-16 h-5 bg-[#1e130a] rounded-full mt-1 border border-amber-900" />
                  {isVolcanoFoaming && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="w-8 bg-gradient-to-b from-red-500 to-orange-400 rounded-full blur-xs mt-1"
                    />
                  )}
                </div>
              </div>

              {/* Chemical Reagents Shelf */}
              <div className="flex flex-wrap justify-center gap-2 bg-slate-800 p-2.5 rounded-2xl border border-slate-700">
                {[
                  { id: 'soda', name: 'بيكربونات الصودا 🧂', color: 'bg-emerald-600' },
                  { id: 'dye', name: 'الصبغة البركانية 🔴', color: 'bg-rose-600' },
                  { id: 'vinegar', name: 'حمض الخل الفوار 🧪', color: 'bg-amber-600' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => pourIngredient(r.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-black text-white cursor-pointer transition-all ${r.color} ${
                      pouredIngredients.includes(r.id) ? 'opacity-50 ring-2 ring-white' : 'hover:scale-105 active:scale-95'
                    }`}
                  >
                    {pouredIngredients.includes(r.id) ? `✅ أضفت ${r.name}` : `اسكب ${r.name}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 7. DENSITY COLUMN WITH REAL HYDROSTATIC EQUILIBRIUM         */}
          {/* =========================================================== */}
          {activeExp === 'density' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 flex items-center justify-center min-h-[240px]">
                {/* Graduated Density Cylinder */}
                <div className="w-48 h-60 border-4 border-t-0 border-amber-300 rounded-b-3xl overflow-hidden flex flex-col shadow-xl relative bg-slate-900">
                  {/* Layer 1: Oil (0.92 g/cm3) */}
                  <div className="flex-1 bg-gradient-to-b from-yellow-300/80 to-yellow-400/80 border-b border-yellow-200/40 flex items-center justify-center relative">
                    <span className="text-[9px] font-black text-amber-950 absolute top-1 left-2">زيت نباتي (0.92g/cm³)</span>
                    {droppedDensityItems.find(i => i.id === 'cork') && <span className="text-xl animate-bounce">🪵 فلين</span>}
                  </div>

                  {/* Layer 2: Water (1.00 g/cm3) */}
                  <div className="flex-1 bg-gradient-to-b from-sky-400/80 to-blue-500/80 border-b border-sky-300/40 flex items-center justify-center relative">
                    <span className="text-[9px] font-black text-white absolute top-1 left-2">ماء عذب (1.00g/cm³)</span>
                    {droppedDensityItems.find(i => i.id === 'cap') && <span className="text-xl animate-bounce">🔘 غطاء</span>}
                  </div>

                  {/* Layer 3: Honey (1.42 g/cm3) */}
                  <div className="flex-1 bg-gradient-to-b from-amber-600/90 to-amber-700/90 flex items-center justify-center relative">
                    <span className="text-[9px] font-black text-amber-100 absolute top-1 left-2">عسل ثقيل (1.42g/cm³)</span>
                    {droppedDensityItems.find(i => i.id === 'grape') && <span className="text-xl animate-bounce ml-2">🍇 عنب</span>}
                    {droppedDensityItems.find(i => i.id === 'bolt') && <span className="text-xl animate-bounce absolute bottom-1">🔩 صمولة</span>}
                  </div>
                </div>
              </div>

              {/* Object Drop Shelf */}
              <div className="flex flex-wrap justify-center gap-2 bg-slate-800 p-2 rounded-2xl border border-slate-700">
                {[
                  { id: 'cork', name: 'قطعة فلين خفيف 🪵', target: 20 },
                  { id: 'cap', name: 'غطاء بلاستيك 🔘', target: 80 },
                  { id: 'grape', name: 'حبة عنب طازجة 🍇', target: 140 },
                  { id: 'bolt', name: 'صمولة حديد ثقيلة 🔩', target: 190 }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => dropDensityObject(item.id, item.name, item.target)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-black rounded-xl border border-slate-500 cursor-pointer"
                  >
                    أسقط {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 8. OPTICAL RAY-TRACING PRISM & CHROMATIC DISPERSION         */}
          {/* =========================================================== */}
          {activeExp === 'prism' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-4 flex items-center justify-around overflow-hidden relative min-h-[240px]">
                {/* White Light Torch */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-8 bg-slate-700 rounded-lg border border-slate-500 flex items-center justify-center text-xs font-black text-white">
                    🔦 كشاف
                  </div>
                </div>

                {/* White Ray */}
                <div className="w-24 h-2 bg-white shadow-[0_0_15px_#ffffff]" />

                {/* Rotating Glass Prism */}
                <div 
                  style={{ transform: `rotate(${prismAngle}deg)` }}
                  className="w-16 h-16 border-2 border-cyan-300 bg-cyan-200/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(103,232,249,0.4)] cursor-pointer"
                >
                  🔺
                </div>

                {/* 7-Color Rainbow Fan */}
                <div className="flex flex-col gap-1 w-32">
                  {['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8f00ff'].map((c, i) => (
                    <div 
                      key={i} 
                      style={{ backgroundColor: c }} 
                      className="h-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                    />
                  ))}
                  <span className="text-[10px] font-black text-amber-300 mt-1">تشتت الطيف الـ 7 🌈</span>
                </div>
              </div>

              <div className="bg-slate-800 p-2.5 rounded-2xl border border-slate-700 flex items-center justify-between gap-4">
                <span className="text-xs font-bold text-gray-300">تدوير زاوية المنشور: {prismAngle}°</span>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={prismAngle}
                  onChange={(e) => {
                    setPrismAngle(Number(e.target.value));
                    markExperimentDone('prism');
                  }}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 9. ACOUSTIC OSCILLATING STRING & HARMONIC RESONANCE         */}
          {/* =========================================================== */}
          {activeExp === 'sound_string' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[240px]">
                {/* Soundboard Wooden Bridge */}
                <div className="w-full max-w-md h-24 bg-[#3e2723] rounded-2xl border-4 border-[#5d4037] relative flex items-center justify-between px-6 shadow-inner">
                  
                  {/* Left & Right Brass Frets */}
                  <div className="w-3 h-16 bg-amber-400 rounded-sm" />
                  <div className="w-3 h-16 bg-amber-400 rounded-sm" />

                  {/* Vibrating String */}
                  <motion.div
                    animate={isStringVibrating ? {
                      scaleY: [1, 5, 1, 4, 1, 2, 1],
                      boxShadow: ['0 0 0px #fff', '0 0 15px #fde047', '0 0 0px #fff']
                    } : {}}
                    transition={{ duration: 0.8 }}
                    onClick={pluckString}
                    className="absolute inset-x-8 h-1.5 bg-gradient-to-r from-gray-200 via-amber-200 to-gray-200 shadow-md cursor-pointer hover:bg-yellow-300"
                  />
                </div>

                <span className="text-xs font-mono font-black text-amber-300 mt-4">
                  التردد: {stringTension} Hz (هرتز)
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-800 p-3 rounded-2xl border border-slate-700">
                <button
                  onClick={pluckString}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  🎸 انقر الوتر واعزفه
                </button>
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-gray-300">شد الوتر:</span>
                  <input
                    type="range"
                    min="220"
                    max="660"
                    value={stringTension}
                    onChange={(e) => setStringTension(Number(e.target.value))}
                    className="flex-1 accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 10. COULOMB STATIC ELECTRICITY BALLOON                      */}
          {/* =========================================================== */}
          {activeExp === 'static_balloon' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-6 flex items-center justify-around relative min-h-[240px]">
                {/* Wool Cloth */}
                <div 
                  onClick={rubBalloon}
                  className="flex flex-col items-center p-3 bg-amber-900/60 rounded-2xl border-2 border-amber-600 cursor-pointer hover:bg-amber-900 active:scale-95"
                >
                  <span className="text-4xl select-none">🧥</span>
                  <span className="text-[10px] font-black text-amber-200 mt-1">انقر للفرك بالصوف</span>
                </div>

                {/* Balloon with Minus Charges */}
                <div className="flex flex-col items-center relative">
                  <div className="w-20 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-300 shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center justify-center text-3xl select-none">
                    🎈
                  </div>
                  {balloonChargeCount > 0 && (
                    <span className="text-[10px] font-black text-yellow-300 bg-black/60 px-2 py-0.5 rounded-full mt-1">
                      -{balloonChargeCount} شحنات سالبة
                    </span>
                  )}
                </div>

                {/* Paper Confetti */}
                <div 
                  onClick={attractPaper}
                  className="flex flex-col items-center p-3 bg-slate-800 rounded-2xl border-2 border-slate-600 cursor-pointer hover:bg-slate-700"
                >
                  <div className={`text-3xl transition-transform ${paperSnapped ? 'translate-y-[-20px] scale-125' : ''}`}>
                    {paperSnapped ? '✨⭐📎' : '📄✂️'}
                  </div>
                  <span className="text-[10px] font-black text-slate-300 mt-1">
                    {paperSnapped ? 'انجذب للبالون!' : 'قرّب البالون هنا'}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-gray-400">
                ⚡ افرك البالون أولاً لتجميع الإلكترونات، ثم قرّبه من الورق ليشحنه بالحث ويجذبه في الهواء!
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 11. WATER SURFACE TENSION SHOCKWAVE                         */}
          {/* =========================================================== */}
          {activeExp === 'surface_tension' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-4 flex items-center justify-center relative min-h-[240px]">
                {/* Water Bowl */}
                <div className="relative w-60 h-60 rounded-full border-4 border-cyan-400/80 bg-cyan-950/40 flex items-center justify-center overflow-hidden shadow-inner">
                  {/* Floating Microbes / Pepper Specks */}
                  {Array.from({ length: 16 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={soapDropped ? {
                        x: Math.cos((i / 16) * Math.PI * 2) * 95,
                        y: Math.sin((i / 16) * Math.PI * 2) * 95
                      } : {
                        x: Math.cos((i / 16) * Math.PI * 2) * 35,
                        y: Math.sin((i / 16) * Math.PI * 2) * 35
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute text-xl select-none"
                    >
                      🦠
                    </motion.div>
                  ))}

                  {/* Center Soap Droplet */}
                  {soapDropped && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-10 h-10 rounded-full bg-cyan-300/90 border-2 border-white flex items-center justify-center text-sm shadow-md"
                    >
                      🧼
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={dropSoapDroplet}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer"
                >
                  🧼 أضف قطرة صابون سحرية لكسر التوتر السطحي
                </button>
                <button
                  onClick={() => setSoapDropped(false)}
                  className="px-3 py-2 bg-slate-800 text-gray-300 text-xs font-bold rounded-xl border border-slate-700 cursor-pointer"
                >
                  🔄 إعادة التجربة
                </button>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* 12. BOTANICAL LIFE CYCLE SIMULATOR & PHOTOSYNTHESIS         */}
          {/* =========================================================== */}
          {activeExp === 'plant_growth' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex-1 bg-slate-950 rounded-3xl border-2 border-slate-800 p-4 flex flex-col items-center justify-end relative min-h-[240px]">
                {/* Plant Stage */}
                <div className="relative z-10 flex flex-col items-center">
                  {plantHydration >= 2 && plantSunlight >= 2 ? (
                    <div className="text-6xl animate-bounce">🌻🍃</div>
                  ) : plantHydration >= 1 && plantSunlight >= 1 ? (
                    <div className="text-5xl">🌿</div>
                  ) : plantHydration >= 1 ? (
                    <div className="text-4xl">🌱</div>
                  ) : (
                    <div className="text-3xl">🌰</div>
                  )}
                </div>

                {/* Soil Cross Section */}
                <div className="w-56 h-20 bg-gradient-to-b from-[#5c4033] to-[#2c1d11] rounded-b-3xl border-4 border-[#3e2723] flex items-center justify-center text-amber-200 text-xs font-black shadow-md">
                  🪴 تربة رطبة غنية بالمعادن
                </div>
              </div>

              <div className="flex justify-center gap-3 bg-slate-800 p-2.5 rounded-2xl border border-slate-700">
                <button
                  onClick={() => {
                    setPlantHydration(h => h + 1);
                    playRealisticSound('splash');
                    if (plantSunlight >= 1) markExperimentDone('plant_growth');
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  💧 اسقِ ماءً ({plantHydration})
                </button>
                <button
                  onClick={() => {
                    setPlantSunlight(s => s + 1);
                    playRealisticSound('spark');
                    if (plantHydration >= 1) markExperimentDone('plant_growth');
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl cursor-pointer"
                >
                  ☀️ وفّر ضوء شمس ({plantSunlight})
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 4. SCIENTIFIC TAKEAWAY PANEL */}
        <div className="mt-5 bg-amber-50 border-3 border-amber-300 p-4 sm:p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">🦉💡</span>
            <h4 className="text-base font-black text-amber-950">
              سر العلم الفيزيائي (ماذا تعلمنا؟):
            </h4>
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
            {currentExpData.scientificTakeaway}
          </p>
        </div>

      </div>

    </div>
  );
}
