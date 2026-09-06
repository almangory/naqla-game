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
  Play, 
  Volume2, 
  Check, 
  Flame, 
  Zap, 
  Magnet, 
  Sun, 
  Droplet, 
  Thermometer, 
  Compass, 
  Layers, 
  Globe, 
  Award,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface ScienceGameProps {
  addStars: (amount: number) => void;
}

type ExperimentId = 
  | 'volcano'
  | 'circuit'
  | 'magnet'
  | 'matter_states'
  | 'density_tower'
  | 'planetary_gravity'
  | 'plant_growth'
  | 'static_balloon'
  | 'light_prism'
  | 'sound_waves'
  | 'soap_germs'
  | 'day_night';

type CategoryFilter = 'all' | 'chemistry' | 'physics' | 'space' | 'biology';

export default function ScienceGame({ addStars }: ScienceGameProps) {
  const { speak } = useSpeech();
  const [activeExp, setActiveExp] = useState<ExperimentId>('volcano');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [completedExperiments, setCompletedExperiments] = useState<string[]>([]);
  const [showTakeaway, setShowTakeaway] = useState(false);

  // Mark experiment as completed and award stars
  const markCompleted = (expId: string) => {
    if (!completedExperiments.includes(expId)) {
      setCompletedExperiments(prev => [...prev, expId]);
      addStars(15);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    setShowTakeaway(true);
  };

  // Sound generator helper for hands-on feedback
  const playLabSynth = (type: 'sizzle' | 'spark' | 'clink' | 'water' | 'whoosh' | 'pop') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'spark') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'clink') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'water') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'sizzle') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(450, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      // Ignore audio failure
    }
  };

  // =========================================================================
  // 12 EXPERIMENT SPECIFIC STATES & HANDLERS
  // =========================================================================

  // 1. Volcano States
  const [volcanoSoda, setVolcanoSoda] = useState(false);
  const [volcanoDye, setVolcanoDye] = useState(false);
  const [volcanoVinegar, setVolcanoVinegar] = useState(false);
  const [volcanoErupting, setVolcanoErupting] = useState(false);

  const triggerVolcano = () => {
    if (volcanoSoda && volcanoDye && volcanoVinegar) {
      setVolcanoErupting(true);
      playLabSynth('sizzle');
      markCompleted('volcano');
      setTimeout(() => setVolcanoErupting(false), 5000);
    }
  };

  // 2. Circuit States
  const [circuitSwitch, setCircuitSwitch] = useState(false);
  const [circuitHasBulb, setCircuitHasBulb] = useState(true);

  // 3. Magnet States
  const [magnetPole, setMagnetPole] = useState<'N' | 'S'>('N');
  const [attractedItems, setAttractedItems] = useState<string[]>([]);
  const magnetItems = [
    { id: 'nail', name: 'مسمار حديد 🔩', isMagnetic: true, emoji: '🔩' },
    { id: 'gold', name: 'عملة ذهبية 🪙', isMagnetic: false, emoji: '🪙' },
    { id: 'clip', name: 'مشبك ورق 📎', isMagnetic: true, emoji: '📎' },
    { id: 'wood', name: 'مكعب خشب 🪵', isMagnetic: false, emoji: '🪵' },
    { id: 'key', name: 'مفتاح فولاذ 🔑', isMagnetic: true, emoji: '🔑' }
  ];

  // 4. States of Matter
  const [temperature, setTemperature] = useState(25); // -20 to 120

  // 5. Density Tower
  const [droppedInTower, setDroppedInTower] = useState<string[]>([]);
  const densityObjects = [
    { id: 'bolt', name: 'صمولة حديد ثقيلة', layer: 'bottom', emoji: '🔩', layerName: 'قاع العسل' },
    { id: 'grape', name: 'حبة عنب', layer: 'middle', emoji: '🍇', layerName: 'فوق العسل وتحت الماء' },
    { id: 'cap', name: 'غطاء بلاستيك', layer: 'water', emoji: '🔘', layerName: 'فوق الماء' },
    { id: 'cork', name: 'قطعة فلين خفيفة', layer: 'top', emoji: '🪵', layerName: 'أعلى الزيت' }
  ];

  // 6. Planetary Gravity
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'moon' | 'mars' | 'jupiter' | 'space'>('earth');
  const [isDropping, setIsDropping] = useState(false);
  const planetSpecs = {
    earth: { name: 'الأرض 🌍', gravity: 9.8, duration: 1.0, desc: 'جاذبية طبيعية متوازنة' },
    moon: { name: 'القمر 🌕', gravity: 1.6, duration: 2.8, desc: 'جاذبية ضعيفة جداً، الأجسام تطير ببطء!' },
    mars: { name: 'المريخ 🔴', gravity: 3.7, duration: 1.8, desc: 'جاذبية أخف من الأرض' },
    jupiter: { name: 'المشتري 🪐', gravity: 24.8, duration: 0.5, desc: 'جاذبية عملاقة قوية تسحب بسرعة هائلة!' },
    space: { name: 'الفضاء الحر 🌌', gravity: 0, duration: 6.0, desc: 'انعدام تام للجاذبية، طفو أبدي!' }
  };

  // 7. Plant Growth
  const [plantWater, setPlantWater] = useState(0);
  const [plantSun, setPlantSun] = useState(0);
  const [plantFertilizer, setPlantFertilizer] = useState(0);

  // 8. Static Electricity
  const [balloonCharges, setBalloonCharges] = useState(0); // 0 to 5
  const [paperStuck, setPaperStuck] = useState(false);

  // 9. Light Prism
  const [prismAngle, setPrismAngle] = useState(45);
  const [isLightOn, setIsLightOn] = useState(true);

  // 10. Sound Waves
  const [frequency, setFrequency] = useState(300); // 100 to 800 Hz
  const playFrequencyTone = (freq: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  // 11. Soap Surface Tension
  const [hasSoap, setHasSoap] = useState(false);

  // 12. Day / Night Cycle
  const [earthTime, setEarthTime] = useState(12); // 0 to 24 hours

  // Experiments Registry
  const experimentsList: {
    id: ExperimentId;
    title: string;
    category: CategoryFilter;
    icon: string;
    subtitle: string;
    scientificTakeaway: string;
  }[] = [
    {
      id: 'volcano',
      title: 'بركان الصودا الفوار 🌋',
      category: 'chemistry',
      icon: '🌋',
      subtitle: 'تفاعل كيميائي ممتع بين الحمض والقاعدة',
      scientificTakeaway: 'عند خلط الخل (حمض) مع بيكربونات الصودا (قاعدة)، ينطلق غاز ثاني أكسيد الكربون (CO₂) على شكل فوران هائل يدفع السائل الأحمر للأعلى كبركان حقيقي!'
    },
    {
      id: 'circuit',
      title: 'الدائرة الكهربائية ⚡',
      category: 'physics',
      icon: '⚡',
      subtitle: 'مسار تدفق الإلكترونات لإضاءة المصباح',
      scientificTakeaway: 'الكهرباء لا تسري إلا في دائرة مغلقة وكاملة! عندما نغلق المفتاح، تتدفق شحنات الإلكترونات من البطارية إلى المصباح ليتوهج وينير غرفتنا!'
    },
    {
      id: 'magnet',
      title: 'المغناطيس والمواد الجاذبة 🧲',
      category: 'physics',
      icon: '🧲',
      subtitle: 'اكتشف ما يجذبه المغناطيس وما يرفضه',
      scientificTakeaway: 'المغناطيس يمتلك مجالات قوة خفية تجذب المعادن المصنوعة من الحديد والصلب فقط، بينما لا يجذب الذهب النقي، البلاستيك، أو الخشب!'
    },
    {
      id: 'matter_states',
      title: 'حالات المادة: ثلج وماء وبخار 🧊💧💨',
      category: 'chemistry',
      icon: '🧊',
      subtitle: 'تحول المادة بالحرارة بين الصلب والسائل والغاز',
      scientificTakeaway: 'الحرارة تحرك جزيئات المادة! تحت الصفر تتجمد لتصبح صلباً، وعند التدفئة تذوب لسائل، وفوق 100°C تغلي وتتبخر وتصعد للسماء لتشكل الغيوم!'
    },
    {
      id: 'density_tower',
      title: 'برج الكثافة والطفو ⚖️',
      category: 'physics',
      icon: '⚖️',
      subtitle: 'لماذا تطفو بعض الأشياء وتغوص أخرى؟',
      scientificTakeaway: 'الكثافة هي مقدار ثقل المادة بالنسبة لحجمها. السوائل الأثقل كالعسل تستقر في القاع، والماء في الوسط، والزيت الأخف يطفو بالأعلى، والأجسام تسبح حسب كثافتها!'
    },
    {
      id: 'planetary_gravity',
      title: 'الجاذبية عبر الكواكب 🪐',
      category: 'space',
      icon: '🪐',
      subtitle: 'شاهد سرعة سقوط الأجسام في الفضاء والقمر',
      scientificTakeaway: 'كل كوكب يجذب الأشياء نحوه بقوة تعتمد على حجم كتلته! على القمر جاذبية خفيفة تجعلنا نقفز عالياً، بينما على المشتري جاذبية ساحقة تسحبنا لأسفل بسرعة!'
    },
    {
      id: 'plant_growth',
      title: 'نمو النبتة والتركيب الضوئي 🌱',
      category: 'biology',
      icon: '🌱',
      subtitle: 'كيف تصنع النبتة طعامها وتتنفس؟',
      scientificTakeaway: 'النباتات كائنات حية معجزة! بفضل الماء وضوء الشمس والتربة، تصنع أوراقها السكر لتنمو وتطلق لنا غاز الأكسجين النقي الذي نتنفسه كل يوم!'
    },
    {
      id: 'static_balloon',
      title: 'الكهرباء الساكنة بالبالون 🎈',
      category: 'physics',
      icon: '🎈',
      subtitle: 'سحر جذب الأجسام بالشحنات الكهربائية',
      scientificTakeaway: 'عند فرك البالون بالصوف، تنتقل إليه إلكترونات سالبة إضافية. هذه الشحنات الكهربائية الساكنة تولد قوة جذب تسحب قصاصات الورق الخفيفة في الهواء!'
    },
    {
      id: 'light_prism',
      title: 'منشور الضوء وألوان الطيف 🌈',
      category: 'space',
      icon: '🌈',
      subtitle: 'اكتشف كيف يتكون قوس قزح من الضوء الأبيض',
      scientificTakeaway: 'الضوء الأبيض الذي نراه ليس لوناً واحداً، بل هو مزيج من ألوان الطيف السبعة! المنشور الزجاجي يكسر كل لون بزاوية مختلفة فيفصلها أمام أعيننا!'
    },
    {
      id: 'sound_waves',
      title: 'أمواج الصوت والتردد 🌊🎵',
      category: 'biology',
      icon: '🌊',
      subtitle: 'اهتزاز الأوتار وسر الترددات الحادة والغليظة',
      scientificTakeaway: 'الصوت هو اهتزاز الهواء! كلما زادت سرعة الاهتزاز (التردد بالهرتز) سمعنا صوتاً رفيعاً حاداً، وكلما أبطأ الاهتزاز سمعنا صوتاً عميقاً غليظاً!'
    },
    {
      id: 'soap_germs',
      title: 'المجهر والتوتر السطحي 🦠🧼',
      category: 'biology',
      icon: '🦠',
      subtitle: 'سر هروب الجراثيم عند استخدام الصابون',
      scientificTakeaway: 'الماء يمتلك غشاءً سطحياً مشدوداً. قطرة الصابون تكسر هذا التوتر السطحي فوراً وتفكك غشاء الجراثيم والدهون، فتجعلها تفر هاربة بسرعة مذهلة!'
    },
    {
      id: 'day_night',
      title: 'تعاقب الليل والنهار والظل ☀️🌙',
      category: 'space',
      icon: '☀️',
      subtitle: 'دوران كوكب الأرض أمام الشمس',
      scientificTakeaway: 'الأرض تدور حول نفسها كل 24 ساعة! النصف المواجه للشمس يعيش نهاراً مشرقاً، بينما النصف البعيد يدخل في الليل والظلام وظهور النجوم والقمر!'
    }
  ];

  const currentExperiment = experimentsList.find(e => e.id === activeExp) || experimentsList[0];

  const filteredExperiments = experimentsList.filter(e => {
    if (activeFilter === 'all') return true;
    return e.category === activeFilter;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* 1. LABORATORY TOP CONTROL WORKBENCH */}
      <div className="bg-gradient-to-r from-[#4ECDC4] via-[#45AAF2] to-[#6C5CE7] p-5 sm:p-7 rounded-[36px] border-4 border-white text-white shadow-[0_12px_36px_rgba(69,170,242,0.35)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 text-center md:text-right">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md rounded-3xl border-3 border-white/60 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0 animate-bounce-subtle select-none">
            🔬
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-yellow-300 text-yellow-950 px-3 py-0.5 rounded-full text-xs font-black shadow-xs mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-yellow-950" />
              <span>مختبر الأبطال العلمي التفاعلي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              طاولة التجارب والمحاكاة العلمية 🧪
            </h2>
            <p className="text-xs sm:text-sm font-bold text-white/90 mt-1 max-w-lg">
              اختر أي تجربة علمية من الـ 12، تحكم بالسوائل والحرارة والجاذبية بيديك وشاهد النتيجة فوراً!
            </p>
          </div>
        </div>

        {/* Experiment Progress Counter */}
        <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-center shrink-0">
          <div className="text-xs font-bold text-white/80">التجارب المنجزة:</div>
          <div className="text-2xl sm:text-3xl font-black text-yellow-300 mt-0.5">
            {completedExperiments.length} / 12 ⭐
          </div>
          <div className="text-[10px] font-bold text-teal-100 mt-1">
            +15 نجمة لكل تجربة تكتمل!
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTERS & EXPERIMENT SHELF */}
      <div className="bg-white p-4 sm:p-5 rounded-[32px] border-4 border-amber-200 shadow-sm space-y-4">
        
        {/* Category Filter Chips */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black text-gray-700 flex items-center gap-1">
            <span>🗂️</span>
            <span>تصنيف العلوم:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '🌟 كل التجارب (12)' },
              { id: 'chemistry', label: '🧪 كيمياء ومواد' },
              { id: 'physics', label: '⚡ فيزياء وقوى' },
              { id: 'space', label: '🪐 فضاء وضوء' },
              { id: 'biology', label: '🌱 أحياء وصوت' },
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

        {/* Horizontal Experiment Carousel Shelf */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
          {filteredExperiments.map(exp => {
            const isSelected = activeExp === exp.id;
            const isDone = completedExperiments.includes(exp.id);
            return (
              <button
                key={exp.id}
                onClick={() => {
                  setActiveExp(exp.id);
                  setShowTakeaway(false);
                  playLabSynth('whoosh');
                }}
                className={`flex-1 min-w-[155px] sm:min-w-[175px] p-3 rounded-2xl border-3 text-right flex flex-col justify-between transition-all cursor-pointer snap-start select-none ${
                  isSelected
                    ? 'bg-amber-100/80 border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130] translate-y-[-2px]'
                    : 'bg-white border-gray-200 hover:border-amber-300 shadow-[0_3px_0_0_#E0E0E0]'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-3xl">{exp.icon}</span>
                  {isDone ? (
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                      <Check className="w-3 h-3" /> تم
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400">
                      تجربة
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 line-clamp-1">{exp.title}</h4>
                  <p className="text-[10px] font-bold text-gray-500 line-clamp-1 mt-0.5">{exp.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVE INTERACTIVE WORKSTATION ARENA */}
      <div className="bg-white rounded-[36px] border-4 border-gray-200 p-5 sm:p-8 shadow-[0_10px_0_0_#D1D1D1] relative overflow-hidden">
        
        {/* Experiment Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-gray-100 pb-4 mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl select-none">{currentExperiment.icon}</span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-800">
                {currentExperiment.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
              {currentExperiment.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                speak(`${currentExperiment.title}. ${currentExperiment.subtitle}. ${currentExperiment.scientificTakeaway}`);
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-900 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="استمع للشرح الصوتي"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>شرح سمسم الصوتي</span>
            </button>
          </div>
        </div>

        {/* WORKSTATION SIMULATION BOX */}
        <div className="bg-gradient-to-b from-gray-50 to-amber-50/30 rounded-3xl border-3 border-dashed border-amber-200 p-4 sm:p-8 min-h-[360px] flex flex-col items-center justify-center relative">

          {/* ========================================================= */}
          {/* EXPERIMENT 1: VOLCANO ERUPTION                            */}
          {/* ========================================================= */}
          {activeExp === 'volcano' && (
            <div className="w-full flex flex-col items-center space-y-6 text-center">
              {/* Visual Volcano Graphic */}
              <div className="relative w-64 h-56 flex items-end justify-center">
                {/* Erupting Lava Animation */}
                {volcanoErupting && (
                  <>
                    <motion.div
                      animate={{ y: [-20, -120, -20], scale: [0.8, 1.4, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="absolute top-2 text-5xl z-20 select-none"
                    >
                      💥🔥
                    </motion.div>
                    <motion.div
                      animate={{ height: ['40px', '90px', '40px'] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="absolute top-8 w-16 bg-gradient-to-t from-red-600 to-orange-400 rounded-t-full z-10 blur-xs"
                    />
                  </>
                )}

                {/* Mountain Body */}
                <div className="w-56 h-40 bg-gradient-to-b from-[#8D6E63] to-[#4E342E] rounded-t-[100px] border-4 border-[#3E2723] relative z-0 overflow-hidden shadow-md">
                  {/* Crater Top */}
                  <div className="w-20 h-6 bg-[#3E2723] rounded-full mx-auto -mt-2 border-2 border-amber-800" />
                  {/* Lava Streams */}
                  {volcanoErupting && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="w-8 mx-auto bg-gradient-to-b from-red-500 via-orange-500 to-yellow-400 rounded-full blur-xs"
                    />
                  )}
                </div>
              </div>

              {/* Volcano Interactive Ingredients */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setVolcanoSoda(true);
                    playLabSynth('water');
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black border-3 transition-all cursor-pointer ${
                    volcanoSoda 
                      ? 'bg-emerald-500 text-white border-emerald-700 shadow-xs' 
                      : 'bg-white text-gray-800 border-gray-300 shadow-[0_4px_0_0_#D1D1D1] active:translate-y-1'
                  }`}
                >
                  {volcanoSoda ? '✅ أضفت بيكربونات الصودا 🧂' : '1. أضف بيكربونات الصودا 🧂'}
                </button>

                <button
                  onClick={() => {
                    setVolcanoDye(true);
                    playLabSynth('water');
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black border-3 transition-all cursor-pointer ${
                    volcanoDye 
                      ? 'bg-rose-500 text-white border-rose-700 shadow-xs' 
                      : 'bg-white text-gray-800 border-gray-300 shadow-[0_4px_0_0_#D1D1D1] active:translate-y-1'
                  }`}
                >
                  {volcanoDye ? '✅ أضفت الصبغة الحمراء 🎨' : '2. أضف الصبغة البركانية 🎨'}
                </button>

                <button
                  onClick={() => {
                    setVolcanoVinegar(true);
                    playLabSynth('sizzle');
                  }}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-black border-3 transition-all cursor-pointer ${
                    volcanoVinegar 
                      ? 'bg-amber-500 text-white border-amber-700 shadow-xs' 
                      : 'bg-white text-gray-800 border-gray-300 shadow-[0_4px_0_0_#D1D1D1] active:translate-y-1'
                  }`}
                >
                  {volcanoVinegar ? '✅ أضفت الخل الفوار 🧪' : '3. اسكب الخل الفوار 🧪'}
                </button>
              </div>

              {/* Trigger Button */}
              <div>
                <button
                  onClick={triggerVolcano}
                  disabled={!volcanoSoda || !volcanoDye || !volcanoVinegar}
                  className={`px-8 py-3.5 rounded-2xl text-sm font-black border-4 shadow-[0_6px_0_0_#990000] transition-all cursor-pointer ${
                    volcanoSoda && volcanoDye && volcanoVinegar
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white border-white animate-bounce'
                      : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  🌋 فجّر البركان العلمي الآن!
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 2: ELECTRIC CIRCUIT                            */}
          {/* ========================================================= */}
          {activeExp === 'circuit' && (
            <div className="w-full flex flex-col items-center space-y-6 text-center">
              {/* Circuit Board Graphic */}
              <div className="relative w-full max-w-md h-52 bg-slate-900 rounded-3xl border-4 border-slate-700 p-4 flex items-center justify-around shadow-inner overflow-hidden">
                {/* Wires */}
                <div className={`absolute inset-x-8 inset-y-12 border-4 rounded-2xl transition-colors duration-300 ${circuitSwitch ? 'border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-slate-600'}`} />

                {/* 1. Battery */}
                <div className="relative z-10 flex flex-col items-center bg-slate-800 p-2.5 rounded-2xl border-2 border-slate-600 text-white">
                  <span className="text-3xl">🔋</span>
                  <span className="text-[10px] font-black text-emerald-400 mt-1">بطارية 9V</span>
                </div>

                {/* 2. Switch */}
                <button
                  onClick={() => {
                    const next = !circuitSwitch;
                    setCircuitSwitch(next);
                    playLabSynth('spark');
                    if (next) markCompleted('circuit');
                  }}
                  className={`relative z-10 px-4 py-2 rounded-2xl border-3 text-xs font-black cursor-pointer transition-all ${
                    circuitSwitch
                      ? 'bg-emerald-500 text-white border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'bg-rose-500 text-white border-rose-300'
                  }`}
                >
                  {circuitSwitch ? 'المفتاح: مغلق (متصل) 🟢' : 'المفتاح: مفتوح (مفصول) 🔴'}
                </button>

                {/* 3. Light Bulb */}
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    animate={circuitSwitch ? { scale: [1, 1.15, 1], filter: 'drop-shadow(0px 0px 20px #FDE047)' } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-5xl select-none"
                  >
                    {circuitSwitch ? '💡' : '🌑'}
                  </motion.div>
                  <span className={`text-[11px] font-black mt-1 ${circuitSwitch ? 'text-yellow-300' : 'text-slate-500'}`}>
                    {circuitSwitch ? 'المصباح مضيء! ✨' : 'المصباح مطفأ'}
                  </span>
                </div>
              </div>

              <p className="text-xs font-bold text-gray-600">
                💡 اضغط على زر المفتاح لإغلاق الدائرة وتدفق الإلكترونات نحو المصباح!
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 3: MAGNETISM                                   */}
          {/* ========================================================= */}
          {activeExp === 'magnet' && (
            <div className="w-full flex flex-col items-center space-y-6 text-center">
              {/* Horseshoe Magnet */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 bg-gradient-to-b from-red-500 to-blue-600 rounded-t-full border-4 border-white flex flex-col justify-between items-center p-2 shadow-lg select-none"
                >
                  <span className="text-white text-xs font-black">N {magnetPole === 'N' ? '🔴' : '🔵'}</span>
                  <span className="text-2xl font-black text-white">🧲</span>
                  <span className="text-white text-xs font-black">S {magnetPole === 'S' ? '🔵' : '🔴'}</span>
                </motion.div>

                <button
                  onClick={() => {
                    setMagnetPole(p => p === 'N' ? 'S' : 'N');
                    playLabSynth('spark');
                  }}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 border-2 border-purple-400 text-purple-900 text-xs font-black rounded-xl cursor-pointer"
                >
                  🔄 عكس أقطاب المغناطيس
                </button>
              </div>

              {/* Items to Test */}
              <div>
                <p className="text-xs font-bold text-gray-600 mb-3">
                  قرب المغناطيس بالضغط على المواد واكتشف أيها ينجذب وأيها يرفض:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {magnetItems.map(item => {
                    const isAttracted = attractedItems.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.isMagnetic) {
                            playLabSynth('clink');
                            if (!attractedItems.includes(item.id)) {
                              const next = [...attractedItems, item.id];
                              setAttractedItems(next);
                              if (next.length >= 3) markCompleted('magnet');
                            }
                          } else {
                            playLabSynth('pop');
                          }
                        }}
                        className={`p-3 rounded-2xl border-3 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          isAttracted
                            ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-xs'
                            : 'bg-white border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-[11px] font-black text-gray-800">{item.name}</span>
                        <span className={`text-[10px] font-bold ${isAttracted ? 'text-emerald-700' : 'text-gray-400'}`}>
                          {isAttracted ? '🧲 انجذب للمغناطيس!' : 'اضغط للاختبار'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 4: STATES OF MATTER (ICE, WATER, STEAM)        */}
          {/* ========================================================= */}
          {activeExp === 'matter_states' && (
            <div className="w-full flex flex-col items-center space-y-6 text-center">
              {/* Beaker Graphic */}
              <div className="relative w-48 h-56 border-4 border-t-0 border-blue-400/80 rounded-b-3xl bg-blue-50/40 flex flex-col justify-end p-2 overflow-hidden shadow-md">
                {/* Steam Rising when Temp >= 100 */}
                {temperature >= 100 && (
                  <motion.div
                    animate={{ y: [-10, -50, -10], opacity: [0.3, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute top-2 inset-x-0 text-center text-3xl select-none"
                  >
                    💨💨💨
                  </motion.div>
                )}

                {/* State Container */}
                <div className="w-full flex flex-col items-center justify-center min-h-[120px] transition-all duration-300">
                  {temperature < 0 ? (
                    <motion.div
                      animate={{ rotate: [0, 2, -2, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="text-6xl select-none"
                    >
                      🧊
                    </motion.div>
                  ) : temperature >= 100 ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="text-5xl select-none"
                    >
                      ♨️🫧
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-6xl select-none"
                    >
                      💧🌊
                    </motion.div>
                  )}
                </div>

                {/* State Label */}
                <div className="w-full bg-blue-500/80 backdrop-blur-xs text-white text-xs font-black py-1 rounded-xl mt-2">
                  {temperature < 0 ? 'حالة صلبة (ثلج متجمد) ❄️' : temperature >= 100 ? 'حالة غازية (بخار ماء) 💨' : 'حالة سائلة (ماء عذب) 💧'}
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-black text-gray-700">
                  <span>درجة الحرارة:</span>
                  <span className="text-base text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-xl border border-blue-200">
                    {temperature}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="120"
                  value={temperature}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTemperature(val);
                    if (val >= 100 || val <= 0) markCompleted('matter_states');
                  }}
                  className="w-full accent-blue-500 cursor-pointer h-3 rounded-full bg-gray-200"
                />
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>-20°C تجمد</span>
                  <span>0°C ذوبان</span>
                  <span>100°C غليان وتبخر</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 5: DENSITY TOWER                               */}
          {/* ========================================================= */}
          {activeExp === 'density_tower' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Density Cylinder */}
              <div className="w-48 h-64 border-4 border-t-0 border-amber-300 rounded-b-3xl overflow-hidden flex flex-col shadow-md relative">
                {/* Layer 1: Oil (Yellow) */}
                <div className="flex-1 bg-yellow-200/90 border-b border-yellow-300 flex items-center justify-center relative">
                  <span className="text-[10px] font-black text-amber-900 absolute left-2 top-1">زيت نباتي (أخف طبقة)</span>
                  {droppedInTower.includes('cork') && <span className="text-2xl animate-bounce">🪵</span>}
                </div>

                {/* Layer 2: Water (Blue) */}
                <div className="flex-1 bg-sky-200/90 border-b border-sky-300 flex items-center justify-center relative">
                  <span className="text-[10px] font-black text-sky-900 absolute left-2 top-1">ماء عذب (كثافة وسط)</span>
                  {droppedInTower.includes('cap') && <span className="text-2xl animate-bounce">🔘</span>}
                  {droppedInTower.includes('grape') && <span className="text-2xl animate-bounce ml-2">🍇</span>}
                </div>

                {/* Layer 3: Honey (Dark Amber) */}
                <div className="flex-1 bg-amber-500/90 flex items-center justify-center relative">
                  <span className="text-[10px] font-black text-amber-950 absolute left-2 top-1">عسل ثقيل (أعلى كثافة)</span>
                  {droppedInTower.includes('bolt') && <span className="text-2xl animate-bounce">🔩</span>}
                </div>
              </div>

              {/* Objects to Drop */}
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">
                  أسقط الأجسام في البرج واكتشف في أي طبقة ستقف:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {densityObjects.map(obj => (
                    <button
                      key={obj.id}
                      onClick={() => {
                        playLabSynth('water');
                        if (!droppedInTower.includes(obj.id)) {
                          const next = [...droppedInTower, obj.id];
                          setDroppedInTower(next);
                          if (next.length >= 3) markCompleted('density_tower');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black cursor-pointer transition-all ${
                        droppedInTower.includes(obj.id)
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                          : 'bg-white border-gray-300 hover:border-amber-400 text-gray-800'
                      }`}
                    >
                      {obj.emoji} {obj.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 6: PLANETARY GRAVITY                           */}
          {/* ========================================================= */}
          {activeExp === 'planetary_gravity' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Drop Simulation Canvas */}
              <div className="relative w-full max-w-sm h-52 bg-slate-900 rounded-3xl border-4 border-slate-700 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
                {/* Celestial Background Header */}
                <div className="flex items-center justify-between text-white text-xs font-black z-10">
                  <span>الكوكب: {planetSpecs[selectedPlanet].name}</span>
                  <span className="text-yellow-300">الجاذبية: {planetSpecs[selectedPlanet].gravity} m/s²</span>
                </div>

                {/* Falling Objects */}
                <div className="flex justify-around items-end h-32 relative">
                  {/* Apple */}
                  <motion.div
                    animate={isDropping ? { y: [0, 80] } : { y: 0 }}
                    transition={{ duration: planetSpecs[selectedPlanet].duration, ease: 'easeIn' }}
                    className="text-4xl select-none"
                  >
                    🍎
                  </motion.div>

                  {/* Feather */}
                  <motion.div
                    animate={isDropping ? { y: [0, 80], rotate: [0, 15, -15, 0] } : { y: 0 }}
                    transition={{ duration: planetSpecs[selectedPlanet].duration * 1.5, ease: 'easeInOut' }}
                    className="text-4xl select-none"
                  >
                    🪶
                  </motion.div>

                  {/* Bowling Ball */}
                  <motion.div
                    animate={isDropping ? { y: [0, 80] } : { y: 0 }}
                    transition={{ duration: planetSpecs[selectedPlanet].duration * 0.9, ease: 'easeIn' }}
                    className="text-4xl select-none"
                  >
                    🎳
                  </motion.div>
                </div>

                {/* Surface Ground */}
                <div className="w-full h-3 bg-amber-600 rounded-full" />
              </div>

              {/* Planet Selector Tabs */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {(Object.keys(planetSpecs) as (keyof typeof planetSpecs)[]).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPlanet(p);
                      setIsDropping(false);
                      playLabSynth('whoosh');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                      selectedPlanet === p
                        ? 'bg-purple-600 text-white border-purple-800 shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {planetSpecs[p].name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsDropping(true);
                  playLabSynth('whoosh');
                  markCompleted('planetary_gravity');
                  setTimeout(() => setIsDropping(false), (planetSpecs[selectedPlanet].duration + 0.5) * 1000);
                }}
                disabled={isDropping}
                className="px-6 py-2.5 bg-[#FF8E3C] hover:bg-orange-500 text-white text-xs font-black rounded-2xl border-3 border-white shadow-[0_4px_0_0_#CC7130] cursor-pointer"
              >
                🚀 أفلت الأجسام وشاهد سرعة السقوط!
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 7: PLANT GROWTH & PHOTOSYNTHESIS               */}
          {/* ========================================================= */}
          {activeExp === 'plant_growth' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Plant Pot Canvas */}
              <div className="relative w-48 h-52 flex flex-col items-center justify-end">
                {/* Plant Graphic Stage */}
                <motion.div
                  className="select-none text-center"
                  animate={{ scale: [0.95, 1, 0.95] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {plantWater >= 2 && plantSun >= 2 && plantFertilizer >= 1 ? (
                    <div>
                      <div className="text-6xl animate-bounce">🌻✨</div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        تفتحت الزهرة وأطلقت الأكسجين! O₂ 🍃
                      </span>
                    </div>
                  ) : plantWater >= 1 && plantSun >= 1 ? (
                    <div className="text-5xl">🌿</div>
                  ) : plantWater >= 1 ? (
                    <div className="text-4xl">🌱</div>
                  ) : (
                    <div className="text-3xl">🌰</div>
                  )}
                </motion.div>

                {/* Pot */}
                <div className="w-36 h-20 bg-amber-700 border-4 border-amber-900 rounded-b-3xl mt-2 flex items-center justify-center text-white font-black text-xs shadow-md">
                  🪴 تربة خصبة
                </div>
              </div>

              {/* Plant Nutrition Buttons */}
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => {
                    setPlantWater(w => w + 1);
                    playLabSynth('water');
                    if (plantSun >= 1) markCompleted('plant_growth');
                  }}
                  className="px-3.5 py-2 bg-blue-100 hover:bg-blue-200 border-2 border-blue-400 text-blue-900 text-xs font-black rounded-xl cursor-pointer"
                >
                  💧 اسقِ ماءً ({plantWater})
                </button>

                <button
                  onClick={() => {
                    setPlantSun(s => s + 1);
                    playLabSynth('spark');
                    if (plantWater >= 1) markCompleted('plant_growth');
                  }}
                  className="px-3.5 py-2 bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 text-yellow-900 text-xs font-black rounded-xl cursor-pointer"
                >
                  ☀️ وفّر ضوء الشمس ({plantSun})
                </button>

                <button
                  onClick={() => {
                    setPlantFertilizer(f => f + 1);
                    playLabSynth('pop');
                  }}
                  className="px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 border-2 border-emerald-400 text-emerald-900 text-xs font-black rounded-xl cursor-pointer"
                >
                  🪴 سماد ومغذيات ({plantFertilizer})
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 8: STATIC ELECTRICITY (BALLOON)                */}
          {/* ========================================================= */}
          {activeExp === 'static_balloon' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              <div className="flex items-center justify-center gap-8">
                {/* Wool Sweater */}
                <div className="flex flex-col items-center p-3 bg-amber-100 rounded-2xl border-2 border-amber-300">
                  <span className="text-5xl">🧥</span>
                  <span className="text-[10px] font-black text-amber-900 mt-1">سترة صوفية</span>
                </div>

                {/* Charged Balloon */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative text-7xl select-none">
                    🎈
                    {balloonCharges > 0 && (
                      <span className="absolute top-2 right-2 text-xs font-black text-yellow-300 bg-black/60 px-1.5 py-0.5 rounded-full animate-pulse">
                        -{balloonCharges} شحنة
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-gray-700">البالون المطاطي</span>
                </motion.div>

                {/* Paper Confetti */}
                <div className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl border-2 border-blue-200 min-h-[90px] justify-center">
                  <motion.div
                    animate={paperStuck ? { y: [-15, 0], scale: 1.2 } : {}}
                    className="text-4xl"
                  >
                    {paperStuck ? '✨⭐📎' : '📄✂️'}
                  </motion.div>
                  <span className="text-[10px] font-black text-blue-900 mt-1">
                    {paperStuck ? 'قفز الورق للبالون!' : 'قصاصات ورق خفيفة'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBalloonCharges(c => c + 1);
                    playLabSynth('spark');
                  }}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-xl border-2 border-white shadow-xs cursor-pointer"
                >
                  ⚡ افرك البالون بالصوف لشحنه!
                </button>

                <button
                  onClick={() => {
                    if (balloonCharges >= 2) {
                      setPaperStuck(true);
                      playLabSynth('clink');
                      markCompleted('static_balloon');
                    } else {
                      playLabSynth('pop');
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl border-2 border-white shadow-xs cursor-pointer"
                >
                  🧲 قرّب البالون من الورق!
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 9: LIGHT PRISM & RAINBOW                      */}
          {/* ========================================================= */}
          {activeExp === 'light_prism' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Prism Simulation Canvas */}
              <div className="relative w-full max-w-md h-52 bg-slate-950 rounded-3xl border-4 border-slate-800 p-4 flex items-center justify-between overflow-hidden shadow-inner">
                {/* White Flashlight */}
                <div className="flex flex-col items-center text-white z-10">
                  <span className="text-4xl">🔦</span>
                  <span className="text-[10px] font-black text-slate-300">ضوء أبيض</span>
                </div>

                {/* White Beam */}
                <div className="w-20 h-2 bg-white/90 shadow-[0_0_12px_#ffffff] rounded-full" />

                {/* Glass Prism */}
                <motion.div
                  style={{ rotate: `${prismAngle - 45}deg` }}
                  className="w-16 h-16 border-3 border-cyan-300 bg-cyan-100/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(103,232,249,0.5)] select-none"
                >
                  🔺
                </motion.div>

                {/* Dispersed Rainbow Spectrum */}
                <div className="flex flex-col gap-1 w-24">
                  {['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF'].map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: i * 0.05 }}
                      className="h-1.5 rounded-full shadow-xs"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="text-[9px] font-black text-amber-300 mt-1">ألوان الطيف الـ 7 🌈</span>
                </div>
              </div>

              {/* Angle Control */}
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs font-black text-gray-700">
                  <span>زاوية المنشور:</span>
                  <span>{prismAngle}°</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  value={prismAngle}
                  onChange={(e) => {
                    setPrismAngle(Number(e.target.value));
                    markCompleted('light_prism');
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 10: SOUND WAVES & FREQUENCY                   */}
          {/* ========================================================= */}
          {activeExp === 'sound_waves' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Wave Oscilloscope Screen */}
              <div className="relative w-full max-w-md h-44 bg-slate-900 rounded-3xl border-4 border-slate-700 p-3 flex items-center justify-center overflow-hidden shadow-inner">
                {/* Oscillating Sound Wave Bars */}
                <div className="flex items-center gap-1.5 h-28">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [`${Math.sin(idx + frequency / 50) * 40 + 50}px`, `${Math.cos(idx + frequency / 50) * 40 + 50}px`] }}
                      transition={{ repeat: Infinity, duration: 0.15 + (800 - frequency) / 1000 }}
                      className="w-2 bg-gradient-to-t from-emerald-400 to-teal-200 rounded-full shadow-xs"
                    />
                  ))}
                </div>

                <span className="absolute bottom-2 left-4 text-xs font-mono font-black text-emerald-400">
                  {frequency} Hz (هرتز)
                </span>
              </div>

              {/* Frequency Slider & Play Button */}
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-xs font-black text-gray-700">
                  <span>صوت غليظ (تردد منخفض)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">{frequency} Hz</span>
                  <span>صوت رفيع (تردد حاد)</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  value={frequency}
                  onChange={(e) => {
                    const f = Number(e.target.value);
                    setFrequency(f);
                    playFrequencyTone(f);
                    markCompleted('sound_waves');
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <button
                  onClick={() => playFrequencyTone(frequency)}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl border-2 border-white shadow-xs cursor-pointer"
                >
                  🔊 اعزف هذه النغمة واستمع لترددها!
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 11: SOAP SURFACE TENSION                      */}
          {/* ========================================================= */}
          {activeExp === 'soap_germs' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Petri Dish Graphic */}
              <div className="relative w-56 h-56 rounded-full border-4 border-teal-300 bg-teal-50/70 flex items-center justify-center overflow-hidden shadow-inner p-4">
                {/* Center Soap Droplet */}
                {hasSoap && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 rounded-full bg-cyan-400/90 border-2 border-white flex items-center justify-center text-xs font-black text-white shadow-md z-10"
                  >
                    🧼
                  </motion.div>
                )}

                {/* Pepper / Germs Particles */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    animate={hasSoap ? { x: (i % 2 === 0 ? 80 : -80), y: (i % 3 === 0 ? 80 : -80) } : { x: 0, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute text-xl select-none"
                    style={{
                      top: `${30 + (i * 12) % 60}%`,
                      left: `${25 + (i * 15) % 60}%`
                    }}
                  >
                    🦠
                  </motion.span>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setHasSoap(true);
                    playLabSynth('water');
                    markCompleted('soap_germs');
                  }}
                  className="px-4 py-2.5 bg-[#4ECDC4] hover:bg-teal-500 text-white text-xs font-black rounded-xl border-2 border-white shadow-xs cursor-pointer"
                >
                  🧼 ضع قطرة صابون سحرية!
                </button>
                <button
                  onClick={() => setHasSoap(false)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 cursor-pointer"
                >
                  🔄 إعادة الصحن
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* EXPERIMENT 12: DAY & NIGHT CYCLE                         */}
          {/* ========================================================= */}
          {activeExp === 'day_night' && (
            <div className="w-full flex flex-col items-center space-y-5 text-center">
              {/* Sky Canvas */}
              <div 
                className="relative w-full max-w-md h-52 rounded-3xl border-4 border-amber-300 p-4 flex flex-col justify-between overflow-hidden shadow-inner transition-colors duration-500"
                style={{
                  backgroundColor: earthTime >= 6 && earthTime <= 17 ? '#70a1ff' : '#1e272e'
                }}
              >
                {/* Sun or Moon */}
                <div className="flex justify-between items-center z-10">
                  {earthTime >= 6 && earthTime <= 17 ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20 }} className="text-5xl select-none">
                      ☀️
                    </motion.div>
                  ) : (
                    <div className="text-4xl select-none">🌙✨</div>
                  )}
                  <span className="text-xs font-black text-white bg-black/40 px-2.5 py-1 rounded-xl">
                    الساعة: {earthTime}:00 {earthTime >= 6 && earthTime < 18 ? 'نهاراً' : 'ليلاً'}
                  </span>
                </div>

                {/* Earth Horizon and Person Shadow */}
                <div className="flex flex-col items-center relative z-10">
                  <div className="text-4xl select-none">👦</div>
                  {/* Cast Shadow */}
                  {earthTime >= 6 && earthTime <= 18 && (
                    <div
                      className="h-2 bg-black/40 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.abs(earthTime - 12) * 12 + 20}px`,
                        transform: `translateX(${(earthTime - 12) * 6}px)`
                      }}
                    />
                  )}
                </div>

                {/* Ground */}
                <div className="w-full h-4 bg-emerald-600 rounded-full" />
              </div>

              {/* Time Slider */}
              <div className="w-full max-w-sm space-y-1">
                <div className="flex justify-between text-xs font-black text-gray-700">
                  <span>شروق (06:00)</span>
                  <span>ظهيرة (12:00)</span>
                  <span>غروب (18:00)</span>
                  <span>منتصف الليل (24:00)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={earthTime}
                  onChange={(e) => {
                    setEarthTime(Number(e.target.value));
                    markCompleted('day_night');
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          )}

        </div>

        {/* 4. SCIENTIFIC TAKEAWAY PANEL (سر العلم والمستقبل) */}
        <div className="mt-6 bg-amber-50 border-3 border-amber-300 p-5 rounded-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🦉💡</span>
            <h4 className="text-base font-black text-amber-950">
              ماذا تعلمنا من هذه التجربة؟ (سر العلم):
            </h4>
          </div>
          <p className="text-xs sm:text-sm font-bold text-amber-900 leading-relaxed">
            {currentExperiment.scientificTakeaway}
          </p>
        </div>

      </div>

    </div>
  );
}
