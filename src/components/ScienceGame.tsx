/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, HelpCircle, Star, Sparkles, AlertCircle, Apple, Shield, Heart, Activity, Check, Trash2 } from 'lucide-react';

interface ScienceGameProps {
  addStars: (amount: number) => void;
}

type ExperimentType = 'gravity' | 'density' | 'biology' | 'animals' | 'hygiene' | 'pollution';

export default function ScienceGame({ addStars }: ScienceGameProps) {
  const [activeTab, setActiveTab] = useState<ExperimentType>('gravity');

  // --- Five Senses Static Configuration (Inside Biology Tab) ---
  const sensesList = {
    sight: {
      name: 'حاسة البصر (العين) 👁️',
      emoji: '👁️',
      question: 'أنا العين اللطيفة! أساعدك على مشاهدة الطبيعة والألوان السحرية. ماذا ترى بي؟',
      correctId: 'rainbow',
      options: [
        { id: 'bell', emoji: '🔔', label: 'صوت الجرس الموسيقي' },
        { id: 'rainbow', emoji: '🌈', label: 'قوس قزح الملون' },
        { id: 'rose', emoji: '🌹', label: 'رائحة الوردة العطرة' }
      ],
      explanation: 'رائع جداً! العين تستقبل الضوء وترى قوس قزح الساحر وجميع الألوان الجميلة! 🌈✨'
    },
    hearing: {
      name: 'حاسة السمع (الأذن) 👂',
      emoji: '👂',
      question: 'أنا الأذن الحساسة! أسمع الأصوات الجميلة والأناشيد والقرآن والتنبيهات. ماذا تسمع بي؟',
      correctId: 'bell',
      options: [
        { id: 'bell', emoji: '🔔', label: 'رنين الجرس الموسيقي' },
        { id: 'lemon', emoji: '🍋', label: 'ليمونة حامضة ومغذية' },
        { id: 'rabbit', emoji: '🐇', label: 'فرو الأرنب الناعم' }
      ],
      explanation: 'أحسنت! الأذن تلتقط الاهتزازات الصوتية وتترجمها لأصوات كالأناشيد ورنين الجرس الموسيقي! 🔔🎶'
    },
    smell: {
      name: 'حاسة الشم (الأنف) 👃',
      emoji: '👃',
      question: 'أنا الأنف النشيط! أشم الروائح الذكية في المطبخ والحديقة. ماذا تشم بي؟',
      correctId: 'rose',
      options: [
        { id: 'cactus', emoji: '🌵', label: 'أشواك الصبار الحادة' },
        { id: 'rainbow', emoji: '🌈', label: 'قوس قزح البعيد' },
        { id: 'rose', emoji: '🌹', label: 'رائحة الوردة الجميلة' }
      ],
      explanation: 'مدهش! الأنف يمرر جزيئات الرائحة للداخل ويميز الروائح الجميلة كعطر الورود والزهور! 🌹👃'
    },
    taste: {
      name: 'حاسة التذوق (اللسان) 👅',
      emoji: '👅',
      question: 'أنا اللسان المتذوق! أميز الطعم الحلو، المالح، الحامض، والمر في الأطعمة. ماذا تتذوق بي؟',
      correctId: 'lemon',
      options: [
        { id: 'lemon', emoji: '🍋', label: 'ليمونة حامضة ومبهجة' },
        { id: 'bell', emoji: '🔔', label: 'رنين الموسيقى' },
        { id: 'rabbit', emoji: '🐇', label: 'نعومة الفرو' }
      ],
      explanation: 'يا لك من ذكي! براعم التذوق على لسانك تساعدك على الإحساس بحموضة الليمون وحلاوة العسل! 🍋👅'
    },
    touch: {
      name: 'حاسة اللمس (اليد والجلد) ✋',
      emoji: '✋',
      question: 'أنا الجلد واليد الحنونة! أشعر بالحرارة والبرودة والأشياء الخشنة والناعمة. ماذا تلمس بي وتشعر بنعومته؟',
      correctId: 'rabbit',
      options: [
        { id: 'rainbow', emoji: '🌈', label: 'قوس قزح البعيد' },
        { id: 'rabbit', emoji: '🐇', label: 'فرو الأرنب الناعم جداً' },
        { id: 'bell', emoji: '🔔', label: 'الأصوات المحيطة' }
      ],
      explanation: 'ممتاز! ملايين النهايات العصبية في جلدك تشعرك بنعومة فرو الأرنب الصغير ودفء الشمس! 🐇✋'
    }
  };

  // --- Carnivores & Herbivores Static Config (Animals Tab) ---
  const animalsList = [
    { name: 'الأسد الشجاع 🦁', emoji: '🦁', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'الأسد من آكلات اللحوم! لديه مخالب وأنياب حادة وهو ملك الغابة الأقوى.', fact: 'آكلات اللحوم لها أسنان حادة وأنياب قوية لتقطيع الطعام وسد الجوع!' },
    { name: 'الخروف الأليف 🐑', emoji: '🐑', type: 'herbivore', foodEmoji: '🌿', foodName: 'العشب الأخضر', desc: 'الخروف من آكلات الأعشاب! يأكل العشب اللذيذ ويصنع لنا الصوف الدافئ.', fact: 'آكلات الأعشاب لها أسنان مسطحة تساعدها على طحن وهرس أوراق النباتات!' },
    { name: 'النمر السريع 🐯', emoji: '🐯', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'النمر صياد ذكي وماهر يتغذى على اللحوم فقط ليجري بسرعة فائقة!', fact: 'النمور والفهود تحتاج للبروتين من اللحوم للحفاظ على عضلاتها القوية والسريعة!' },
    { name: 'الأرنب الصغير 🐇', emoji: '🐇', type: 'herbivore', foodEmoji: '🥕', foodName: 'الجزر والعشب', desc: 'الأرنب يحب الجزر والأعشاب الخضراء اللذيذة ليقفز عالياً!', fact: 'الأرانب تمتلك قواطع أمامية حادة تنمو باستمرار لقضم الألياف النباتية الصلبة!' },
    { name: 'البقرة الكريمة 🐄', emoji: '🐄', type: 'herbivore', foodEmoji: '🌾', foodName: 'القش والبرسيم', desc: 'البقرة تأكل العشب والبرسيم طوال اليوم لتصنع لنا الحليب الأبيض الطازج والصحي!', fact: 'الأبقار من المجترات، ولديها معدة خاصة تساعدها على هضم السيقان النباتية الصعبة!' },
    { name: 'الذئب الذكي 🐺', emoji: '🐺', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'الذئب حيوان بري قوي، يعيش في مجموعات وهو من آكلات اللحوم بامتياز.', fact: 'الذئاب تساعد في حفظ توازن الطبيعة والبيئة البرية وتمنع تكاثر الأعشاب المفرط!' },
    { name: 'الفيل الضخم 🐘', emoji: '🐘', type: 'herbivore', foodEmoji: '🍌', foodName: 'الموز والأغصان', desc: 'الفيل العملاق يتغذى على أوراق الأشجار، والأغصان، والفواكه اللذيذة باستخدام خرطومه الطويل!', fact: 'الفيل يحتاج لتناول كميات كبيرة جداً من النباتات يومياً ليغذي جسمه العملاق!' }
  ];

  // --- Five Senses States (Inside Biology) ---
  const [activeSenseKey, setActiveSenseKey] = useState<'sight' | 'hearing' | 'smell' | 'taste' | 'touch'>('sight');
  const [selectedSenseOption, setSelectedSenseOption] = useState<string | null>(null);
  const [senseIsCorrect, setSenseIsCorrect] = useState<boolean | null>(null);
  const [matchedSenses, setMatchedSenses] = useState<string[]>([]);
  const [senseFeedback, setSenseFeedback] = useState<string>('اختر الإجابة الصحيحة لتكتشف أسرار الحواس الخمسة اللطيفة! 👀👂👃👅✋');

  // --- Carnivores & Herbivores States (Animals Tab) ---
  const [currentAnimalIdx, setCurrentAnimalIdx] = useState<number>(0);
  const [animalFeedback, setAnimalFeedback] = useState<string>('أنا جائع جداً! 😋 ساعدني في اختيار طعامي المناسب لأكسب القوة والنجوم! 🥩🌿');
  const [animalAnswered, setAnimalAnswered] = useState<boolean>(false);
  const [animalIsCorrect, setAnimalIsCorrect] = useState<boolean | null>(null);

  // --- Hygiene & Disease Prevention States (Hygiene Tab) ---
  const [activeHygieneStep, setActiveHygieneStep] = useState<'wash_hands' | 'brush_teeth' | 'shower' | 'prevention_quiz'>('wash_hands');
  const [handsGerms, setHandsGerms] = useState<number>(3); // Number of germs on hands (3 -> 0)
  const [handsSoaped, setHandsSoaped] = useState<boolean>(false);
  const [handsClean, setHandsClean] = useState<boolean>(false);
  
  const [teethCleanState, setTeethCleanState] = useState<'dirty' | 'brushing' | 'clean'>('dirty');
  const [showerCleanState, setShowerCleanState] = useState<'dirty' | 'showering' | 'clean'>('dirty');
  
  // Hygiene Quiz selections
  const [hygieneQuizSelections, setHygieneQuizSelections] = useState<{ [key: string]: boolean }>({});
  const [hygieneFeedback, setHygieneFeedback] = useState<string>('النظافة من الإيمان! 🧼 دعنا نقضي على الجراثيم الشريرة ونحافظ على جسمنا قوياً ومعافى!');

  // --- Gravity Lab States ---
  const [gravityType, setGravityType] = useState<'earth' | 'moon' | 'space' | 'jupiter'>('earth');
  const [selectedObjects, setSelectedObjects] = useState<string[]>(['apple', 'feather']);
  const [dropState, setDropState] = useState<'idle' | 'dropping' | 'landed'>('idle');
  const [dropPositions, setDropPositions] = useState<{ [key: string]: number }>({
    apple: 0,
    anchor: 0,
    feather: 0,
    balloon: 0
  });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [explanation, setExplanation] = useState<string>('اختر كوكباً والأجسام التي تريد إسقاطها، ثم اضغط على زر "إطلاق"! 🚀');

  const gravityValues = {
    space: { value: 0, name: 'الفضاء الخارجي 🌌 (جاذبية منعدمة)', speed: 0, desc: 'في الفضاء، لا توجد جاذبية! تسبح الأجسام بحرية دون سقوط.' },
    moon: { value: 1.6, name: 'القمر 🌙 (جاذبية ضعيفة)', speed: 1.5, desc: 'جاذبية القمر ضعيفة جداً! تسقط الأجسام ببطء شديد كأنها تطير.' },
    earth: { value: 9.8, name: 'كوكب الأرض 🌍 (جاذبية طبيعية)', speed: 4.5, desc: 'الجاذبية الطبيعية للأرض تسحب كل شيء للأسفل بسرعة!' },
    jupiter: { value: 24.8, name: 'كوكب المشتري 🪐 (جاذبية عملاقة)', speed: 8, desc: 'جاذبية المشتري قوية جداً! تسحب الأجسام للأسفل بسرعة خارقة!' }
  };

  const gravityObjects = {
    apple: { name: 'تفاحة حمراء 🍎', weight: 'خفيفة', isBalloon: false, speedFactor: 1 },
    anchor: { name: 'مخطاف حديد ⚓', weight: 'ثقيل جداً', isBalloon: false, speedFactor: 1.1 },
    feather: { name: 'ريشة طائر 🪶', weight: 'خفيفة جداً (تتأثر بالهواء)', isBalloon: false, speedFactor: 0.4 },
    balloon: { name: 'بالون هيليوم 🎈', weight: 'تطير للأعلى', isBalloon: true, speedFactor: -0.5 }
  };

  // --- Density / Float or Sink States ---
  const [waterObjects, setWaterObjects] = useState<{ id: string; name: string; emoji: string; status: 'dry' | 'tank'; density: number; result: 'float' | 'sink'; desc: string }[]>([
    { id: 'stone', name: 'حجر ثقيل 🪨', emoji: '🪨', status: 'dry', density: 3.0, result: 'sink', desc: 'الحجر يغرق! لأن مادته متراصة جداً وكثافته أكبر من كثافة الماء.' },
    { id: 'duck', name: 'بطة ألعاب مطاطية 🦆', emoji: '🦆', status: 'dry', density: 0.6, result: 'float', desc: 'البطة المطاطية تطفو! لأنها مليئة بالهواء وكثافتها الإجمالية أقل بكثير من الماء.' },
    { id: 'wood', name: 'قطعة خشبية 🪵', emoji: '🪵', status: 'dry', density: 0.8, result: 'float', desc: 'الخشب يطفو فوق الماء! لأن كثافة ألياف الخشب أقل من كثافة جزيئات الماء.' },
    { id: 'coin', name: 'عملة معدنية 🪙', emoji: '🪙', status: 'dry', density: 7.8, result: 'sink', desc: 'العملة المعدنية تغرق بسرعة! لأن المعادن لها كثافة عالية جداً مقارنة بالماء.' },
    { id: 'bottle', name: 'زجاجة بلاستيكية فارغة 🧴', emoji: '🧴', status: 'dry', density: 0.4, result: 'float', desc: 'الزجاجة تطفو! الهواء المحبوس داخلها خفيف جداً ويساعدها على الطفو بسعادة.' }
  ]);
  const [tankContents, setTankContents] = useState<string[]>([]);
  const [densityExplanation, setDensityExplanation] = useState<string>('اضغط على أي مجسم لإلقائه في حوض المياه، وشاهد هل يطفو أم يغرق! 🌊');

  // --- Biology / Human Body States ---
  const [selectedBodyPart, setSelectedBodyPart] = useState<'brain' | 'heart' | 'lungs' | 'stomach' | 'muscles' | 'senses'>('brain');
  const [heartRate, setHeartRate] = useState<number>(72);
  const [lungsBreath, setLungsBreath] = useState<number>(0);
  const [lungsBreatheState, setLungsBreatheState] = useState<'idle' | 'شهيق 🌬️' | 'زفير 💨'>('idle');
  const [stomachHappiness, setStomachHappiness] = useState<number>(50);
  const [stomachFeedHistory, setStomachFeedHistory] = useState<string[]>([]);
  const [muscleStrength, setMuscleStrength] = useState<number>(10);
  const [bioExplanation, setBioExplanation] = useState<string>('اضغط على أي عضو من أعضاء الجسم لتتعرف على وظيفته الرائعة وتجربته! 🧠❤️🫁');

  // --- Pollution / Planet Earth States ---
  const [selectedPollution, setSelectedPollution] = useState<'air' | 'water' | 'soil'>('air');
  const [airTreesCount, setAirTreesCount] = useState<number>(0);
  const [airFilterInstalled, setAirFilterInstalled] = useState<boolean>(false);
  const [waterTrashList, setWaterTrashList] = useState<{ id: string; name: string; emoji: string; collected: boolean }[]>([
    { id: 'bottle', name: 'زجاجة بلاستيكية 🧴', emoji: '🧴', collected: false },
    { id: 'bag', name: 'كيس بلاستيك 🛍️', emoji: '🛍️', collected: false },
    { id: 'can', name: 'علبة معدنية 🥫', emoji: '🥫', collected: false },
  ]);
  const [soilTrashList, setSoilTrashList] = useState<{ id: string; name: string; emoji: string; type: 'plastic' | 'paper' | 'organic'; binned: boolean }[]>([
    { id: 'soil-bottle', name: 'قنينة بلاستيكية', emoji: '🧴', type: 'plastic', binned: false },
    { id: 'soil-paper', name: 'ورقة دفتر', emoji: '📄', type: 'paper', binned: false },
    { id: 'soil-apple', name: 'بقايا تفاحة', emoji: '🍎', type: 'organic', binned: false },
  ]);
  const [pollutionExplanation, setPollutionExplanation] = useState<string>('الأرض حزينة من التلوث! دعنا ننظف الهواء والماء والتربة لنكسب النجوم وننقذ الطبيعة! 🌍💚');

  // --- Biology Functions ---
  const handleFeedStomach = (food: { name: string; emoji: string; healthy: boolean; response: string }) => {
    setStomachFeedHistory(prev => [food.emoji, ...prev.slice(0, 4)]);
    if (food.healthy) {
      setStomachHappiness(prev => Math.min(100, prev + 15));
      addStars(5);
      setBioExplanation(`أكلت المعدة ${food.name} ${food.emoji}! ${food.response} حصلت على 5 نجوم! ⭐`);
    } else {
      setStomachHappiness(prev => Math.max(10, prev - 20));
      setBioExplanation(`أكلت المعدة ${food.name} ${food.emoji}! ${food.response} الأكل غير الصحي يتعب المعدة! 🫄`);
    }
  };

  const handleExerciseMuscles = (action: 'milk' | 'workout') => {
    if (action === 'milk') {
      setMuscleStrength(prev => Math.min(100, prev + 10));
      addStars(5);
      setBioExplanation('شربت كوب حليب دافئ 🥛! الحليب غني بالكالسيوم والبروتين ويقوي العظام والعضلات! كسبت 5 نجوم! 💪');
    } else {
      setMuscleStrength(prev => Math.min(100, prev + 15));
      addStars(10);
      setBioExplanation('قمت بتمارين القفز والجري الكرتونية 🏃‍♂️🏋️! التمارين تزيد الكتلة العضلية وتحسن الدورة الدموية! كسبت 10 نجوم! 🏆');
    }
  };

  const handleLungsBreathing = () => {
    setLungsBreatheState('شهيق 🌬️');
    setLungsBreath(100);
    addStars(5);
    setBioExplanation('شهيق عميق... يمتلئ صدرك بالأكسجين النقي! 🌬️');
    setTimeout(() => {
      setLungsBreatheState('زفير 💨');
      setLungsBreath(10);
      setBioExplanation('زفير مريح... تطرد الرئتان الهواء المستعمل والغازات الضارة! 💨 كسبت 5 نجوم! ⭐');
    }, 2500);
  };

  // --- Pollution Functions ---
  const handlePlantTree = () => {
    if (airTreesCount >= 6) {
      setPollutionExplanation('رائع! الغابة ممتلئة بالأشجار الرائعة والجميلة وتصنع الكثير من الأكسجين! 🌲🌳☀️');
      return;
    }
    setAirTreesCount(prev => prev + 1);
    addStars(5);
    setPollutionExplanation(`رائع! لقد زرعت شجرة خضراء جديدة 🌲! تمتص الأشجار ثاني أكسيد الكربون وتنقي الهواء! كسبت 5 نجوم! ⭐`);
  };

  const handleInstallFilter = () => {
    setAirFilterInstalled(true);
    addStars(10);
    setPollutionExplanation('مذهل! لقد ركبت مصفاة/فلتر هواء ذكي على مدخنة المصنع ⚙️! انخفض الدخان الملوث بشكل هائل! كسبت 10 نجوم! 🚀');
  };

  const handleResetAir = () => {
    setAirTreesCount(0);
    setAirFilterInstalled(false);
    setPollutionExplanation('تمت إعادة ضبط تجربة تلوث الهواء! حاول جعل الهواء نقياً مجدداً! ☀️🏭');
  };

  const handleCollectWaterTrash = (id: string) => {
    setWaterTrashList(prev => prev.map(t => {
      if (t.id === id && !t.collected) {
        addStars(5);
        return { ...t, collected: true };
      }
      return t;
    }));
    
    // Check if all collected
    const nextTrash = waterTrashList.map(t => t.id === id ? { ...t, collected: true } : t);
    const allClean = nextTrash.every(t => t.collected);
    if (allClean) {
      addStars(15);
      setPollutionExplanation('يا لك من بطل بيئي حقيقي! 🐢💎 لقد نظفت المياه بالكامل وأصبحت السلحفاة والأسماك تسبح بسعادة وأمان! كسبت 15 نجمة إضافية! 🌟🏆');
    } else {
      const target = waterTrashList.find(t => t.id === id);
      setPollutionExplanation(`رائع! لقد أزلت (${target?.name}) من الماء! كسبت 5 نجوم! استمر لتنظيف باقي النفايات! 🗑️🐠`);
    }
  };

  const handleResetWater = () => {
    setWaterTrashList(prev => prev.map(t => ({ ...t, collected: false })));
    setPollutionExplanation('تمت إعادة النفايات إلى حوض المياه! دعنا ننقذ الكائنات البحرية مجدداً! 🐢🌊');
  };

  const handleSortSoilTrash = (id: string, bin: 'plastic' | 'paper' | 'organic') => {
    const item = soilTrashList.find(t => t.id === id);
    if (!item || item.binned) return;

    if (item.type === bin) {
      addStars(5);
      setSoilTrashList(prev => prev.map(t => t.id === id ? { ...t, binned: true } : t));
      
      const nextSoil = soilTrashList.map(t => t.id === id ? { ...t, binned: true } : t);
      const allSorted = nextSoil.every(t => t.binned);
      if (allSorted) {
        addStars(15);
        setPollutionExplanation('عمل استثنائي! ♻️🌸 قمت بفرز جميع النفايات بشكل صحيح! تدوير البلاستيك والورق يحمي الغابات، والسماد العضوي يغذي التربة لتنمو الزهور! كسبت 15 نجمة إضافية! 🎉🏵️');
      } else {
        setPollutionExplanation(`إجابة صحيحة تماماً! وضعت ${item.name} ${item.emoji} في الصندوق المناسب! كسبت 5 نجوم! ⭐`);
      }
    } else {
      let binArabic = '';
      if (item.type === 'plastic') binArabic = 'صندوق البلاستيك 🔵';
      if (item.type === 'paper') binArabic = 'صندوق الورق 🟢';
      if (item.type === 'organic') binArabic = 'صندوق بقايا الطعام 🟤';
      setPollutionExplanation(`أوه، فكر مجدداً! ${item.name} ${item.emoji} يجب وضعه في ${binArabic} لتدويره بشكل صحيح! ♻️`);
    }
  };

  const handleResetSoil = () => {
    setSoilTrashList(prev => prev.map(t => ({ ...t, binned: false })));
    setPollutionExplanation('أعدت بعثرة المهملات على العشب! دعنا نضعها في صناديق إعادة التدوير بشكل مثالي! ♻️🏕️');
  };

  // --- Gravity Physics Simulation ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (dropState === 'dropping') {
      const g = gravityValues[gravityType].speed;
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 0.05);
        setDropPositions(prev => {
          const updated = { ...prev };

          selectedObjects.forEach(objId => {
            const obj = gravityObjects[objId as keyof typeof gravityObjects];
            let currentPos = prev[objId];

            if (g === 0) {
              // Space floating effect
              currentPos += Math.sin(timeElapsed * 5) * 0.5;
              updated[objId] = Math.max(-20, Math.min(220, currentPos));
            } else {
              // Standard Gravity
              const speed = g * obj.speedFactor;
              if (obj.isBalloon) {
                // Balloon floats up
                currentPos -= speed * 1.2;
              } else {
                // Falling object
                currentPos += speed * 3.5;
                if (currentPos > 230) {
                  currentPos = 230; // Land floor limit
                }
              }
              updated[objId] = currentPos;
            }
          });

          return updated;
        });
      }, 30);
    }
    return () => clearInterval(interval);
  }, [dropState, gravityType, selectedObjects, timeElapsed]);

  // Check if gravity drop has finished
  useEffect(() => {
    if (dropState === 'dropping') {
      const g = gravityValues[gravityType].speed;
      if (g > 0) {
        let allFinished = true;
        selectedObjects.forEach(objId => {
          const obj = gravityObjects[objId as keyof typeof gravityObjects];
          const pos = dropPositions[objId] || 0;
          if (obj.isBalloon) {
            if (pos > -100) {
              allFinished = false;
            }
          } else {
            if (pos < 230) {
              allFinished = false;
            }
          }
        });

        if (allFinished) {
          setDropState('landed');
          generateGravityReport();
        }
      }
    }
  }, [dropPositions, dropState, gravityType, selectedObjects]);

  const startGravityDrop = () => {
    if (selectedObjects.length === 0) {
      setExplanation('أوه! يرجى اختيار جسم واحد على الأقل لإسقاطه! 🍏🪶');
      return;
    }
    setDropPositions({ apple: 0, anchor: 0, feather: 0, balloon: 120 });
    setTimeElapsed(0);
    setDropState('dropping');
    setExplanation('انظر جيداً للأجسام وهي تتحرك! 👀 هل تلاحظ فرق السرعة؟');
  };

  const resetGravity = () => {
    setDropState('idle');
    setDropPositions({ apple: 0, anchor: 0, feather: 0, balloon: 120 });
    setTimeElapsed(0);
    setExplanation('تمت إعادة التجربة! اختر ظروفاً جديدة واختبر عقلك الفياض! 🧠⭐');
  };

  const toggleSelectObject = (id: string) => {
    if (dropState === 'dropping') return;
    setSelectedObjects(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const generateGravityReport = () => {
    addStars(10); // Reward for completing scientific experiment!
    let report = `تقرير التجربة العلمي 🧪:\nعلى ${gravityValues[gravityType].name}، `;
    
    if (gravityType === 'space') {
      report += 'لا تسقط الأشياء أبداً وتسبح معاً في فضاء هادئ!';
    } else {
      const activeObjNames = selectedObjects.map(id => gravityObjects[id as keyof typeof gravityObjects].name);
      
      if (selectedObjects.includes('anchor') && selectedObjects.includes('feather')) {
        report += 'المخطاف الحديدي سقط أسرع بكثير من الريشة لأن مقاومة الهواء تعيق الريشة الخفيفة!';
      } else if (selectedObjects.includes('balloon')) {
        report += 'البالون طار للأعلى بينما سقطت الأجسام الأخرى للأسفل بسبب قوة الطفو في الهواء!';
      } else {
        report += 'جميع الأجسام تسقط للأسفل، والأجسام الأكثر مقاومة للهواء تسقط ببطء أكثر.';
      }
    }
    
    report += `\n🌟 أحسنت! كسبت 10 نجوم لإتمام التفكير العلمي!`;
    setExplanation(report);
  };

  // --- Float or Sink Functions ---
  const handleWaterDrop = (id: string) => {
    const targetObj = waterObjects.find(obj => obj.id === id);
    if (!targetObj) return;

    if (targetObj.status === 'dry') {
      addStars(5); // Reward per drop!
      setDensityExplanation(targetObj.desc + ' 🎉 كسبت 5 نجوم!');
    }

    setWaterObjects(prev =>
      prev.map(obj => (obj.id === id ? { ...obj, status: obj.status === 'dry' ? 'tank' : 'dry' } : obj))
    );
  };

  const resetDensityTank = () => {
    setWaterObjects(prev => prev.map(obj => ({ ...obj, status: 'dry' })));
    setDensityExplanation('تم إفراغ الحوض! اختر مجسمات لتجربتها مجدداً. 🌊');
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#45AAF2] shadow-[0_8px_0_0_#3888C1]" id="science-game-container">
      {/* Title Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-[#3888C1] flex items-center justify-center gap-2">
          🧪 مختبر العلوم والفيزياء السحري 🚀
        </h2>
        <p className="text-gray-500 mt-2 text-sm font-bold">كن عالماً صغيراً واستكشف أسرار الطبيعة والجاذبية والكثافة!</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('gravity')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'gravity'
              ? 'bg-[#45AAF2] border-[#3888C1] text-white shadow-[0_4px_0_0_#3888C1] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-gravity"
        >
          🍏 مختبر الجاذبية
        </button>
        <button
          onClick={() => setActiveTab('density')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'density'
              ? 'bg-[#2ECC71] border-[#25A35A] text-white shadow-[0_4px_0_0_#25A35A] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-density"
        >
          🌊 يطفو أم يغرق؟
        </button>
        <button
          onClick={() => setActiveTab('biology')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'biology'
              ? 'bg-[#FF6B6B] border-[#CC5555] text-white shadow-[0_4px_0_0_#CC5555] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-biology"
        >
          🧬 جسم الإنسان (الأحياء)
        </button>
        <button
          onClick={() => setActiveTab('animals')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'animals'
              ? 'bg-[#FF9F43] border-[#CC7D30] text-white shadow-[0_4px_0_0_#CC7D30] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-animals"
        >
          🦁 آكلات اللحوم والأعشاب
        </button>
        <button
          onClick={() => setActiveTab('hygiene')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'hygiene'
              ? 'bg-[#10B981] border-[#078F62] text-white shadow-[0_4px_0_0_#078F62] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-hygiene"
        >
          🧼 النظافة والوقاية
        </button>
        <button
          onClick={() => setActiveTab('pollution')}
          className={`px-5 py-3 rounded-2xl text-base sm:text-lg font-black transition-all border-4 cursor-pointer ${
            activeTab === 'pollution'
              ? 'bg-[#6C5CE7] border-[#5044AB] text-white shadow-[0_4px_0_0_#5044AB] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300 hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1D1D1] active:translate-y-[4px] active:shadow-none'
          }`}
          id="tab-pollution"
        >
          🌍 كوكبنا الجميل (التلوث)
        </button>
      </div>

      {/* Experiment Views */}
      <AnimatePresence mode="wait">
        {activeTab === 'gravity' ? (
          <motion.div
            key="gravity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Controls */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#CC7130] mb-3 flex items-center gap-1">
                  1. اختر الكوكب أو البيئة:
                </h3>
                <div className="space-y-2">
                  {Object.entries(gravityValues).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (dropState !== 'dropping') setGravityType(key as any);
                      }}
                      disabled={dropState === 'dropping'}
                      className={`w-full py-2.5 px-4 rounded-xl text-right font-black text-sm transition flex items-center justify-between border-4 cursor-pointer ${
                        gravityType === key
                          ? 'bg-[#FF8E3C] text-white border-[#CC7130] shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-orange-50/50'
                      }`}
                      id={`gravity-selector-${key}`}
                    >
                      <span>{val.name}</span>
                      {gravityType === key && <Sparkles className="w-4 h-4 text-yellow-200" />}
                    </button>
                  ))}
                </div>

                <h3 className="text-lg font-black text-[#CC7130] mt-5 mb-3">
                  2. اختر الأجسام للإسقاط:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(gravityObjects).map(([key, val]) => {
                    const isSelected = selectedObjects.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleSelectObject(key)}
                        disabled={dropState === 'dropping'}
                        className={`py-2 px-3 rounded-xl font-black text-xs transition border-4 flex flex-col items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-[#FFD93D] text-[#7A6A24] border-[#7A6A24] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        id={`gravity-object-${key}`}
                      >
                        <span className="text-xl">{val.name.split(' ')[0]}</span>
                        <span>{val.name.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simulation Buttons */}
              <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 flex gap-2">
                {dropState === 'idle' ? (
                  <button
                    onClick={startGravityDrop}
                    className="w-full bg-[#FFD93D] text-[#4D4D4D] border-4 border-[#7A6A24] py-3 px-4 rounded-xl shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#D1B02B] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer font-black text-base transition-all duration-100"
                    id="gravity-launch-btn"
                  >
                    <Play className="w-5 h-5 fill-[#4D4D4D] text-[#4D4D4D]" /> أطلق الأجسام!
                  </button>
                ) : (
                  <button
                    onClick={resetGravity}
                    className="w-full bg-white text-gray-700 border-4 border-gray-400 py-3 px-4 rounded-xl shadow-[0_4px_0_0_#9CA3AF] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#9CA3AF] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer font-black text-base transition-all duration-100"
                    id="gravity-reset-btn"
                  >
                    <RotateCcw className="w-5 h-5" /> إعادة التجربة
                  </button>
                )}
              </div>
            </div>

            {/* Middle Screen Visualizer */}
            <div className="bg-sky-950 rounded-[28px] border-4 border-[#4D4D4D] shadow-[0_8px_0_0_#4D4D4D] min-h-[350px] relative overflow-hidden flex flex-col justify-between p-4 md:col-span-2">
              {/* Sky Background Decor */}
              <div className="absolute top-2 left-2 text-sky-200/20 text-xs font-mono">
                {gravityValues[gravityType].name}
              </div>

              {/* Drop Stage/Tracks */}
              <div className="flex-1 w-full relative flex justify-around items-stretch pt-4 pb-12">
                {selectedObjects.map(objId => {
                  const obj = gravityObjects[objId as keyof typeof gravityObjects];
                  const yPos = dropPositions[objId] || 0;
                  return (
                    <div key={objId} className="flex flex-col items-center justify-between w-1/4 relative">
                      {/* Drag guide line */}
                      <div className="absolute inset-y-0 w-0.5 bg-white/10 border-dashed border-white/20"></div>

                      {/* Moving Object */}
                      <motion.div
                        style={{ y: yPos }}
                        transition={{ type: 'tween', ease: 'linear' }}
                        className="absolute text-5xl cursor-grab active:cursor-grabbing select-none"
                        id={`visual-object-${objId}`}
                      >
                        {objId === 'apple' && '🍎'}
                        {objId === 'anchor' && '⚓'}
                        {objId === 'feather' && '🪶'}
                        {objId === 'balloon' && '🎈'}
                      </motion.div>

                      {/* Weight Label / Indicator */}
                      <div className="absolute top-1 text-[10px] bg-sky-900/80 px-1.5 py-0.5 rounded text-sky-200">
                        {obj.weight}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lab Floor/Landing Zone */}
              <div className="h-8 bg-gradient-to-t from-emerald-800 to-emerald-900 border-t-2 border-emerald-500 relative flex items-center justify-center text-xs text-emerald-100 font-bold">
                أرضية المختبر 🛬
              </div>
            </div>

            {/* Explanation box */}
            <div className="md:col-span-3 bg-white border-4 border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#CC7130] font-black text-lg mb-1 flex items-center gap-1">
                  شرح المعلم سمسم:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">{explanation}</p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 معلومات ذكية: {gravityValues[gravityType].desc}
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'density' ? (
          <motion.div
            key="density"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Dry Items */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#4ECDC4] shadow-[0_6px_0_0_#3DA199] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#2D8E87] mb-3">
                  1. اختر جسماً لإلقائه في الماء:
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">اضغط على الجسم ليركب في الماء وتجربة طفوه أو غرقه!</p>
                <div className="space-y-3">
                  {waterObjects.map(obj => (
                    <button
                      key={obj.id}
                      onClick={() => handleWaterDrop(obj.id)}
                      className={`w-full p-3 rounded-xl border-4 text-right transition flex items-center justify-between cursor-pointer ${
                        obj.status === 'tank'
                          ? 'bg-amber-100 border-[#FF8E3C] text-[#CC7130] shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-cyan-50 shadow-sm'
                      }`}
                      id={`density-item-${obj.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{obj.emoji}</span>
                        <div className="text-right">
                          <p className="font-black text-sm">{obj.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold">
                            حالة التجربة: {obj.status === 'tank' ? 'داخل الماء 🌊' : 'جاف على الرف 🪵'}
                          </p>
                        </div>
                      </div>
                      {obj.status === 'tank' && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                          obj.result === 'float' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {obj.result === 'float' ? 'يطفو 🎈' : 'يغرق ⚓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={resetDensityTank}
                className="w-full mt-6 bg-white text-gray-700 border-4 border-gray-400 py-3 px-4 rounded-xl shadow-[0_4px_0_0_#9CA3AF] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#9CA3AF] active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2 cursor-pointer font-black text-sm transition-all duration-100"
                id="density-reset-btn"
              >
                <RotateCcw className="w-4 h-4" /> تفريغ حوض المياه
              </button>
            </div>

            {/* Water Tank Screen */}
            <div className="bg-gradient-to-b from-sky-100 to-sky-300 rounded-[28px] border-4 border-[#4D4D4D] shadow-[0_8px_0_0_#4D4D4D] relative min-h-[350px] md:col-span-2 overflow-hidden flex flex-col justify-end">
              
              {/* Sky Air Part */}
              <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-amber-50 to-sky-100 border-b-2 border-sky-200 flex items-center justify-between px-4">
                <span className="text-xs text-sky-800 font-bold">الهواء الخارجي 🌬️</span>
                <span className="text-xs text-sky-600">الكثافة = 0</span>
              </div>

              {/* Water Surface Ripple Line */}
              <div className="absolute inset-x-0 top-[25%] h-2 bg-sky-400/50 animate-pulse"></div>

              {/* Inside Water Tank Container */}
              <div className="h-3/4 w-full relative bg-sky-400/30 flex items-stretch justify-around px-4">
                
                {/* Floating objects container */}
                <div className="absolute inset-x-0 top-0 h-10 flex justify-around items-center">
                  {waterObjects.filter(o => o.status === 'tank' && o.result === 'float').map(obj => (
                    <motion.div
                      key={obj.id}
                      initial={{ y: -60, scale: 0.5 }}
                      animate={{ y: [0, -5, 0], scale: 1 }}
                      transition={{
                        y: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                      }}
                      className="text-4xl filter drop-shadow cursor-pointer select-none"
                      onClick={() => handleWaterDrop(obj.id)}
                      title="اضغط لإخراجي!"
                    >
                      {obj.emoji}
                    </motion.div>
                  ))}
                </div>

                {/* Sinking/Sunk objects container */}
                <div className="absolute inset-x-0 bottom-4 flex justify-around items-center">
                  {waterObjects.filter(o => o.status === 'tank' && o.result === 'sink').map(obj => (
                    <motion.div
                      key={obj.id}
                      initial={{ y: -180, scale: 0.5 }}
                      animate={{ y: 0, scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      className="text-4xl filter drop-shadow cursor-pointer select-none"
                      onClick={() => handleWaterDrop(obj.id)}
                      title="اضغط لإخراجي!"
                    >
                      {obj.emoji}
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-2 right-4 text-xs font-bold text-sky-800/60 select-none">
                  حوض الماء العذب 🌊 (الكثافة = 1)
                </div>
              </div>
            </div>

            {/* Explanation Box */}
            <div className="md:col-span-3 bg-white border-4 border-[#4ECDC4] shadow-[0_6px_0_0_#3DA199] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#2D8E87] font-black text-lg mb-1 flex items-center gap-1">
                  ملاحظة المعلم سمسم:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">{densityExplanation}</p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 الكثافة تعني مدى قرب جزيئات المادة من بعضها البعض! إذا كانت جزيئات المادة متراصة أكثر من جزيئات الماء، فإنها تغرق للأسفل!
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'biology' ? (
          <motion.div
            key="biology"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Controls: Choose Body Part */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#FF6B6B] shadow-[0_6px_0_0_#CC5555] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#CC5555] mb-3">
                  1. اختر عضواً لاستكشافه:
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">اضغط على أي جزء لتفعيل مختبر الأحياء التفاعلي لجسم الإنسان!</p>
                <div className="space-y-2">
                  {[
                    { id: 'brain', name: 'الدماغ الذكي 🧠', desc: 'مركز الأفكار والذكاء والذاكرة' },
                    { id: 'heart', name: 'القلب النابض ❤️', desc: 'مضخة الحياة وتوزيع الأكسجين' },
                    { id: 'lungs', name: 'الرئتان اللطيفتان 🫁', desc: 'مصفاة الهواء وتنفس الأكسجين' },
                    { id: 'stomach', name: 'المعدة النشيطة 🍽️', desc: 'هضم الغذاء وصناعة الطاقة للنشاط' },
                    { id: 'muscles', name: 'العضلات والعظام 💪', desc: 'الحركة والقفز وبناء البنية القوية' },
                    { id: 'senses', name: 'الحواس الخمسة 👁️👂', desc: 'بوابتنا لاستكشاف وفهم العالم الخارجي' },
                  ].map(part => (
                    <button
                      key={part.id}
                      onClick={() => {
                        setSelectedBodyPart(part.id as any);
                        setBioExplanation(`أنت الآن تستكشف: ${part.name}! ${part.desc}. تفاعل مع اللوحة في اليسار لتعرف أسراره! ✨`);
                      }}
                      className={`w-full p-3 rounded-xl border-4 text-right transition flex items-center justify-between cursor-pointer ${
                        selectedBodyPart === part.id
                          ? 'bg-[#FFF0F0] border-[#FF6B6B] text-[#D64545] shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-rose-50/50 shadow-sm'
                      }`}
                      id={`bio-part-${part.id}`}
                    >
                      <div className="text-right">
                        <p className="font-black text-sm">{part.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{part.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right/Middle Screen: Biology Interactive Visualizer */}
            <div className="bg-white p-6 rounded-[28px] border-4 border-[#FF6B6B] shadow-[0_8px_0_0_#CC5555] min-h-[350px] md:col-span-2 flex flex-col justify-between">
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                {selectedBodyPart === 'brain' && (
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="text-8xl select-none"
                    >
                      🧠
                    </motion.div>
                    <div className="bg-amber-50 border-2 border-[#FFB800] p-4 rounded-2xl max-w-md mx-auto">
                      <p className="text-[#CC9300] font-black text-sm">💡 هل تعلم؟</p>
                      <p className="text-gray-700 font-bold text-xs mt-1 leading-relaxed">
                        يحتوي دماغك على حوالي 86 مليار خلية عصبية ترسل رسائل لجميع أجزاء جسمك بسرعة تزيد عن سرعة سيارات السباق! 🏎️⚡
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        addStars(5);
                        setBioExplanation('رائع! أرسل الدماغ نبضة فكرية خارقة ⚡ ونشّط خلايا الذكاء والتعلم بذكاء! كسبت 5 نجوم! ⭐');
                      }}
                      className="bg-[#FFD93D] text-gray-800 border-4 border-[#7A6A24] px-6 py-2 rounded-xl shadow-[0_4px_0_0_#D1B02B] font-black text-xs hover:translate-y-[2px] hover:shadow-none transition-all cursor-pointer"
                    >
                      أرسل نبضة ذكاء خارقة! ⚡
                    </button>
                  </div>
                )}

                {selectedBodyPart === 'heart' && (
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{
                        scale: heartRate === 130 ? [1, 1.3, 1] : heartRate === 60 ? [1, 1.08, 1] : [1, 1.15, 1]
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: heartRate === 130 ? 0.45 : heartRate === 60 ? 1.0 : 0.8,
                        ease: "easeInOut"
                      }}
                      className="text-8xl select-none text-red-500 drop-shadow"
                    >
                      ❤️
                    </motion.div>
                    
                    <div className="text-sm font-black text-gray-700">
                      معدل النبض الحالي: <span className="text-red-500 text-lg font-black">{heartRate} نبضة/دقيقة</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { rate: 60, label: 'نائم 😴', desc: 'في النوم، يرتاح قلبك وينبض ببطء مريح.' },
                        { rate: 72, label: 'جالس يقرأ 📚', desc: 'معدل طبيعي هادئ ومستقر أثناء الدراسة.' },
                        { rate: 130, label: 'يجري ويلعب 🏃‍♂️', desc: 'عند الجري، يسرع قلبك ليضخ الأكسجين لعضلاتك القوية!' }
                      ].map(opt => (
                        <button
                          key={opt.rate}
                          onClick={() => {
                            setHeartRate(opt.rate);
                            addStars(5);
                            setBioExplanation(`لقد جعلت الشخصية بحالة: ${opt.label}! ${opt.desc} كسبت 5 نجوم! ⭐`);
                          }}
                          className={`px-3 py-1.5 rounded-xl border-4 text-xs font-black cursor-pointer transition ${
                            heartRate === opt.rate
                              ? 'bg-[#FF6B6B] border-[#CC5555] text-white shadow-sm'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-rose-50'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBodyPart === 'lungs' && (
                  <div className="text-center space-y-4 w-full max-w-xs">
                    <div className="flex justify-center gap-6">
                      <motion.div
                        animate={{
                          scale: lungsBreatheState === 'شهيق 🌬️' ? 1.3 : lungsBreatheState === 'زفير 💨' ? 0.95 : 1.0
                        }}
                        transition={{ duration: 2 }}
                        className="text-8xl select-none"
                      >
                        🫁
                      </motion.div>
                    </div>

                    <div className="bg-[#FAF6FE] border-2 border-[#E2CEF9] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#8843C7] font-black">حالة التنفس: <span className="text-base font-black">{lungsBreatheState}</span></p>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mt-2 relative border border-gray-300">
                        <motion.div
                          animate={{ width: lungsBreatheState === 'شهيق 🌬️' ? '100%' : lungsBreatheState === 'زفير 💨' ? '10%' : '50%' }}
                          transition={{ duration: 2 }}
                          className="bg-sky-400 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleLungsBreathing}
                      disabled={lungsBreatheState !== 'idle'}
                      className="w-full bg-[#FFD93D] disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 border-4 border-[#7A6A24] disabled:border-gray-300 py-2.5 px-4 rounded-xl shadow-[0_4px_0_0_#D1B02B] disabled:shadow-none font-black text-xs cursor-pointer"
                    >
                      {lungsBreatheState === 'idle' ? 'ابدأ تمرين التنفس السحري (شهيق وزفير) 🌬️' : 'يتنفس الآن... 🫁'}
                    </button>
                  </div>
                )}

                {selectedBodyPart === 'stomach' && (
                  <div className="text-center space-y-4 w-full">
                    <div className="flex justify-center gap-4 items-center">
                      <div className="text-8xl relative select-none">
                        🍽️
                        {stomachHappiness > 70 ? (
                          <span className="absolute bottom-1 right-1 text-4xl">😋</span>
                        ) : stomachHappiness < 30 ? (
                          <span className="absolute bottom-1 right-1 text-4xl">🤢</span>
                        ) : (
                          <span className="absolute bottom-1 right-1 text-4xl">🙂</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full max-w-sm mx-auto bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <div className="flex justify-between text-xs font-black text-gray-600 mb-1">
                        <span>مستوى راحة وسعادة المعدة:</span>
                        <span>{stomachHappiness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden border border-gray-300">
                        <div
                          style={{ width: `${stomachHappiness}%` }}
                          className={`h-full transition-all duration-500 rounded-full ${
                            stomachHappiness > 70 ? 'bg-green-500' : stomachHappiness < 35 ? 'bg-red-500' : 'bg-yellow-400'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { name: 'تفاحة صحية', emoji: '🍎', healthy: true, response: 'رائع جداً! الفواكه غنية بالفيتامينات وتعطي المعدة طاقة ممتازة ونظيفة!' },
                        { name: 'بروكلي أخضر', emoji: '🥦', healthy: true, response: 'مذهل! الخضروات تحتوي على الألياف التي تسهل هضم الطعام وتجعلك بطلاً!' },
                        { name: 'كوب حليب', emoji: '🥛', healthy: true, response: 'لذيذ جداً! الكالسيوم يبني عظاماً وأسناناً قوية كالصخر!' },
                        { name: 'حلوى وسكاكر', emoji: '🍬', healthy: false, response: 'أوتش! الكثير من السكر المكرر يسبب خمولاً وتسوساً للأسنان ويجهد المعدة!' },
                        { name: 'مشروب غازي', emoji: '🥤', healthy: false, response: 'يا إلهي! المشروبات الغازية مليئة بالغازات والسكريات الضارة وتضعف العظام!' }
                      ].map(food => (
                        <button
                          key={food.emoji}
                          onClick={() => handleFeedStomach(food)}
                          className="bg-white hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-400 p-2 rounded-xl text-xs font-black cursor-pointer flex items-center gap-1 shadow-sm transition"
                        >
                          <span>{food.emoji}</span>
                          <span>{food.name}</span>
                        </button>
                      ))}
                    </div>

                    {stomachFeedHistory.length > 0 && (
                      <div className="text-right text-xs text-gray-500 font-bold flex justify-center gap-2 items-center mt-2">
                        <span>آخر الأطعمة المهضومة:</span>
                        <div className="flex gap-1.5 bg-gray-100 px-2 py-1 rounded-lg">
                          {stomachFeedHistory.map((emoji, i) => (
                            <span key={i} className="text-sm animate-pulse">{emoji}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedBodyPart === 'muscles' && (
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1]
                      }}
                      style={{ scale: 1 + (muscleStrength - 10) / 150 }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="text-8xl select-none text-amber-600 drop-shadow"
                    >
                      💪
                    </motion.div>

                    <div className="text-xs font-black text-gray-700 bg-orange-50 border-2 border-orange-200 p-2 rounded-xl max-w-sm mx-auto">
                      مستوى قوة الهيكل العظمي والعضلات: <span className="text-[#CC7130] text-sm font-black">{muscleStrength} / 100</span>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleExerciseMuscles('milk')}
                        className="bg-white hover:bg-[#FFF5EE] border-4 border-[#FF8E3C] px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-[0_3px_0_0_#CC7130]"
                      >
                        🥛 اشرب حليباً طازجاً (+5 ⭐)
                      </button>
                      <button
                        onClick={() => handleExerciseMuscles('workout')}
                        className="bg-white hover:bg-[#FFF5EE] border-4 border-[#FF8E3C] px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-[0_3px_0_0_#CC7130]"
                      >
                        🏋️‍♂️ قم بتمرين القفز والبطل (+10 ⭐)
                      </button>
                    </div>
                  </div>
                )}

                {selectedBodyPart === 'senses' && (
                  <div className="w-full space-y-4">
                    {/* Senses selection bar */}
                    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                      {(Object.keys(sensesList) as Array<keyof typeof sensesList>).map(key => {
                        const sense = sensesList[key];
                        const isCompleted = matchedSenses.includes(key);
                        return (
                          <button
                            key={key}
                            onClick={() => {
                              setActiveSenseKey(key);
                              setSelectedSenseOption(null);
                              setSenseIsCorrect(null);
                              setSenseFeedback(`لقد اخترت حاسة: ${sense.name}! اقرأ السؤال وحاول معرفة الجواب الصحيح! 👀`);
                            }}
                            className={`p-2 sm:p-3 rounded-xl border-4 text-center transition flex flex-col items-center cursor-pointer min-w-[70px] ${
                              activeSenseKey === key
                                ? 'bg-[#FFF0F0] border-[#FF6B6B] text-[#D64545] shadow-sm'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-rose-50/50 shadow-sm'
                            }`}
                          >
                            <span className="text-3xl relative">
                              {sense.emoji}
                              {isCompleted && (
                                <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white rounded-full p-0.5 text-[10px] w-4 h-4 flex items-center justify-center font-bold">✓</span>
                              )}
                            </span>
                            <span className="text-[10px] font-black mt-1">{sense.name.split(' ')[0]}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active sense play board */}
                    <div className="bg-[#FFFDF9] border-4 border-[#FFA502] rounded-2xl p-4 text-center space-y-3">
                      <div className="text-5xl select-none animate-bounce">
                        {sensesList[activeSenseKey].emoji}
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-amber-800 leading-relaxed">
                        {sensesList[activeSenseKey].question}
                      </h4>

                      {/* Display options */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {sensesList[activeSenseKey].options.map(opt => {
                          const isSelected = selectedSenseOption === opt.id;
                          const isCorrectOpt = opt.id === sensesList[activeSenseKey].correctId;
                          let btnClass = 'bg-white border-gray-300 text-gray-700 hover:bg-amber-50';
                          if (isSelected) {
                            btnClass = senseIsCorrect
                              ? 'bg-green-100 border-green-500 text-green-800'
                              : 'bg-red-100 border-red-500 text-red-800';
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (senseIsCorrect) return; // Already solved
                                setSelectedSenseOption(opt.id);
                                if (isCorrectOpt) {
                                  setSenseIsCorrect(true);
                                  setSenseFeedback(sensesList[activeSenseKey].explanation);
                                  if (!matchedSenses.includes(activeSenseKey)) {
                                    setMatchedSenses(prev => [...prev, activeSenseKey]);
                                    addStars(5);
                                  }
                                } else {
                                  setSenseIsCorrect(false);
                                  setSenseFeedback('أوه! هذه الإجابة ليست مطابقة تماماً لهذه الحاسة الذكية! حاول مجدداً يا بطل 🍎💡');
                                }
                              }}
                              className={`p-2.5 border-4 rounded-xl font-bold text-xs cursor-pointer transition flex flex-col items-center gap-1 ${btnClass}`}
                            >
                              <span className="text-2xl">{opt.emoji}</span>
                              <span>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Feedback banner */}
                      <div className={`p-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                        senseIsCorrect === true
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : senseIsCorrect === false
                          ? 'bg-red-50 border-red-200 text-red-800 animate-pulse'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}>
                        <p>{senseFeedback}</p>
                      </div>

                      {/* Reset button / celebration */}
                      {matchedSenses.length === 5 && senseIsCorrect === true && (
                        <div className="bg-emerald-100 border-2 border-emerald-300 p-2 rounded-xl text-emerald-800 text-xs font-black animate-pulse">
                          🎉 كفو يا عبقري! لقد قمت بمطابقة جميع الحواس الخمس بنجاح تام! أنت بطل حقيقي في العلوم! 🏆🌟
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Explanation box */}
            <div className="md:col-span-3 bg-white border-4 border-[#FF6B6B] shadow-[0_6px_0_0_#CC5555] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#CC5555] font-black text-lg mb-1 flex items-center gap-1">
                  شرح البومة الحكيمة سمسم:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">{bioExplanation}</p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 معلومات صحية: جسمك هو بيتك الثمين! حافظ عليه بتناول الفواكه والخضار والأسماك 🍎🥦🐟، واشرب الماء بكثرة، ومارس الرياضة لتظل عبقرياً ونشيطاً دوماً!
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'animals' ? (
          <motion.div
            key="animals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Controls: Choose Animal */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#FF9F43] shadow-[0_6px_0_0_#CC7D30] flex flex-col justify-between animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[#CC7D30] mb-3">
                  1. قائمة الحيوانات الجائعة:
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">اضغط على أي حيوان لمساعدته في معرفة نوع غذائه وتغذيته!</p>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {animalsList.map((animal, idx) => {
                    return (
                      <button
                        key={animal.name}
                        onClick={() => {
                          setCurrentAnimalIdx(idx);
                          setAnimalAnswered(false);
                          setAnimalIsCorrect(null);
                          setAnimalFeedback(`أنا ${animal.name}! هل يمكنك معرفة هل أنا من آكلات اللحوم 🥩 أم آكلات الأعشاب 🌿؟`);
                        }}
                        className={`w-full p-2.5 rounded-xl border-4 text-right transition flex items-center justify-between cursor-pointer ${
                          currentAnimalIdx === idx
                            ? 'bg-[#FFF9F2] border-[#FF9F43] text-[#CC7D30] shadow-sm'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50/50 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{animal.emoji}</span>
                          <span className="font-black text-xs sm:text-sm">{animal.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle/Right: Feeding board */}
            <div className="bg-white p-5 sm:p-6 rounded-[28px] border-4 border-[#FF9F43] shadow-[0_8px_0_0_#CC7D30] min-h-[350px] md:col-span-2 flex flex-col justify-between space-y-4">
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-5">
                {/* Visual Feeding Container */}
                <div className="relative w-full max-w-md h-44 bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl border-4 border-dashed border-[#FF9F43] flex flex-col items-center justify-center p-4">
                  {/* Animal visual wrapper */}
                  <motion.div
                    animate={
                      animalIsCorrect === true
                        ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                        : animalIsCorrect === false
                        ? { x: [-10, 10, -10, 10, 0] }
                        : { y: [0, -5, 0] }
                    }
                    transition={{
                      repeat: animalIsCorrect === null ? Infinity : 0,
                      duration: animalIsCorrect === null ? 2 : 0.5
                    }}
                    className="text-7xl select-none"
                  >
                    {animalsList[currentAnimalIdx].emoji}
                  </motion.div>

                  <h3 className="text-sm font-black text-[#8C571A] mt-2">
                    {animalsList[currentAnimalIdx].name}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-bold max-w-xs mt-1">
                    {animalsList[currentAnimalIdx].desc}
                  </p>
                </div>

                {/* Feeding Plates / Classification Options */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {/* Herbivore Option */}
                  <button
                    disabled={animalAnswered && animalIsCorrect === true}
                    onClick={() => {
                      const isCorrect = animalsList[currentAnimalIdx].type === 'herbivore';
                      setAnimalAnswered(true);
                      setAnimalIsCorrect(isCorrect);
                      if (isCorrect) {
                        setAnimalFeedback(`إجابة صحيحة ومذهلة! الخروف والأرانب والبقر والغزلان هم أبطال آكلات الأعشاب 🌿! حصلت على 5 نجوم! ⭐`);
                        addStars(5);
                      } else {
                        setAnimalFeedback(`أوه! خطأ بسيط، أنا لا أتناول الأعشاب! فكّر مجدداً في أنيابي الحادة أو طبيعتي الغذائية! 🥩🦁`);
                      }
                    }}
                    className={`p-3 border-4 rounded-xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 cursor-pointer transition ${
                      animalAnswered && animalsList[currentAnimalIdx].type === 'herbivore'
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-white border-green-300 text-green-800 hover:bg-green-50'
                    }`}
                  >
                    <span className="text-3xl">🌿🥕</span>
                    <span>آكلات الأعشاب</span>
                    <span className="text-[9px] text-gray-500">(نباتات، جزر، حشائش)</span>
                  </button>

                  {/* Carnivore Option */}
                  <button
                    disabled={animalAnswered && animalIsCorrect === true}
                    onClick={() => {
                      const isCorrect = animalsList[currentAnimalIdx].type === 'carnivore';
                      setAnimalAnswered(true);
                      setAnimalIsCorrect(isCorrect);
                      if (isCorrect) {
                        setAnimalFeedback(`صحيح وبطل! الأسد والذئاب والنمور والفهود يتغذون على اللحوم 🥩 ولديهم أنياب حادة جداً! حصلت على 5 نجوم! ⭐`);
                        addStars(5);
                      } else {
                        setAnimalFeedback(`أوه! خطأ بسيط، أنا لا أتناول اللحم! فكّر مجدداً في شكلي وأسناني المسطحة التي تطحن العشب! 🌿🐄`);
                      }
                    }}
                    className={`p-3 border-4 rounded-xl font-black text-xs sm:text-sm flex flex-col items-center gap-1 cursor-pointer transition ${
                      animalAnswered && animalsList[currentAnimalIdx].type === 'carnivore'
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-white border-red-300 text-red-800 hover:bg-red-50'
                    }`}
                  >
                    <span className="text-3xl">🥩🥩</span>
                    <span>آكلات اللحوم</span>
                    <span className="text-[9px] text-gray-500">(لحوم طازجة، دجاج، صيد)</span>
                  </button>
                </div>

                {/* Feedback Section */}
                <div className={`p-3 rounded-xl border-2 text-xs font-black transition-all max-w-md w-full ${
                  animalIsCorrect === true
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : animalIsCorrect === false
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-orange-50 border-orange-200 text-orange-800'
                }`}>
                  <p>{animalFeedback}</p>
                </div>
              </div>

              {/* SamSam explanation line & Next Button */}
              <div className="flex justify-between items-center bg-orange-50 border border-orange-100 p-2 rounded-xl text-[11px] font-black text-orange-800 w-full flex-wrap gap-2">
                <span>المعلومة العلمية: {animalsList[currentAnimalIdx].fact}</span>
                <button
                  onClick={() => {
                    const nextIdx = (currentAnimalIdx + 1) % animalsList.length;
                    setCurrentAnimalIdx(nextIdx);
                    setAnimalAnswered(false);
                    setAnimalIsCorrect(null);
                    setAnimalFeedback(`مرحباً! أنا ${animalsList[nextIdx].name}! هل يمكنك معرفة غذائي؟`);
                  }}
                  className="px-3 py-1.5 bg-[#FF9F43] text-white border-2 border-[#CC7D30] rounded-lg font-black hover:bg-orange-500 transition text-[10px]"
                >
                  التالي 🚀
                </button>
              </div>
            </div>

            {/* Explanation box */}
            <div className="md:col-span-3 bg-white border-4 border-[#FF9F43] shadow-[0_6px_0_0_#CC7D30] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#CC7D30] font-black text-lg mb-1 flex items-center gap-1">
                  شرح البومة الحكيمة سمسم:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">
                  تنقسم الحيوانات في الطبيعة حسب طريقة غذائها:
                  <br />
                  - **آكلات الأعشاب (Herbivores)**: مثل الخراف والجمال والأبقار والأرانب، لها أسنان مسطحة وقواطع حادة لقطع وطحن الأعشاب وأوراق الشجر.
                  <br />
                  - **آكلات اللحوم (Carnivores)**: مثل الأسود والنمور والصقور والذئاب، لها مخالب حادة وأنياب قوية لتمزيق اللحوم والحصول على الطاقة.
                </p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 معلومات ذكية: حماية الحيوانات في بيئاتها الطبيعية يحافظ على التوازن البيئي لكوكبنا الرائع! 🦁🌱🌍
                </div>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'hygiene' ? (
          <motion.div
            key="hygiene"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            {/* Left Controls: Select Hygiene Routine Step */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#10B981] shadow-[0_6px_0_0_#078F62] flex flex-col justify-between md:col-span-1 animate-fade-in">
              <div>
                <h3 className="text-lg font-black text-[#078F62] mb-3">
                  روتين أبطال النظافة:
                </h3>
                <p className="text-[11px] text-gray-500 mb-4 font-bold">اختر نشاطاً لتتعلم روتين النظافة وحماية نفسك من الأمراض والجراثيم!</p>
                <div className="space-y-2">
                  {[
                    { id: 'wash_hands', name: 'غسل اليدين بالصابون 🧼', desc: 'نظف يديك من الجراثيم' },
                    { id: 'brush_teeth', name: 'تنظيف الأسنان 🪥', desc: 'حارب السوسة المزعجة' },
                    { id: 'shower', name: 'الاستحمام المنعش 🚿', desc: 'جسم نظيف ورائحة زكية' },
                    { id: 'prevention_quiz', name: 'أبطال وقاية المناعة 🛡️', desc: 'كيف نحمي أنفسنا وأصدقاءنا؟' },
                  ].map(step => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setActiveHygieneStep(step.id as any);
                        setHygieneFeedback(`أنت الآن في: ${step.name}! دعنا نتعلم كيف نحمي صحتنا الرائعة! ✨`);
                      }}
                      className={`w-full p-2.5 rounded-xl border-4 text-right transition flex flex-col justify-center cursor-pointer ${
                        activeHygieneStep === step.id
                          ? 'bg-[#EBFDF5] border-[#10B981] text-[#078F62] shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-emerald-50/50 shadow-sm'
                      }`}
                    >
                      <span className="font-black text-xs sm:text-sm">{step.name}</span>
                      <span className="text-[9px] text-gray-500 font-bold mt-0.5">{step.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right/Middle Section: Interactive Board */}
            <div className="bg-white p-5 sm:p-6 rounded-[28px] border-4 border-[#10B981] shadow-[0_8px_0_0_#078F62] min-h-[350px] md:col-span-3 flex flex-col justify-between">
              <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
                
                {/* 1. WASH HANDS GAME */}
                {activeHygieneStep === 'wash_hands' && (
                  <div className="space-y-4 w-full max-w-md">
                    <h3 className="text-sm font-black text-[#078F62]">امسح الجراثيم الشريرة بالصابون والماء! 🧼💧</h3>
                    
                    {/* Hand visual area */}
                    <div className="relative w-full h-40 bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {handsClean ? (
                        <div className="text-center space-y-1">
                          <span className="text-6xl animate-pulse">✨🙌✨</span>
                          <p className="text-emerald-800 text-xs font-black">أيدي نظيفة وبراقة تفوح بنظافة الياسمين!</p>
                        </div>
                      ) : (
                        <div className="relative flex justify-center items-center">
                          {/* Hand emojis */}
                          <span className="text-7xl select-none relative opacity-90">🤚🤚</span>
                          
                          {/* Germs floating around hands */}
                          {Array.from({ length: handsGerms }).map((_, i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                              className="absolute text-3xl select-none"
                              style={{
                                top: i === 0 ? '-10px' : i === 1 ? '20px' : '40px',
                                left: i === 0 ? '-30px' : i === 1 ? '40px' : '-10px',
                              }}
                            >
                              🦠
                            </motion.span>
                          ))}

                          {/* Soap lather overlay */}
                          {handsSoaped && !handsClean && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                              <span className="text-4xl animate-bounce">🫧🫧🫧</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          if (handsClean) return;
                          setHandsSoaped(true);
                          setHygieneFeedback("ممتاز! لقد وضعت رغوة الصابون الذكية على يديك 🧼! الصابون يدمر غلاف الجراثيم الخبيث!");
                        }}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 border-4 border-[#10B981] rounded-xl text-xs font-black shadow-[0_3px_0_0_#078F62] cursor-pointer"
                      >
                        🧼 ضع رغوة صابون عطرة
                      </button>

                      <button
                        disabled={!handsSoaped}
                        onClick={() => {
                          if (handsClean) return;
                          setHandsClean(true);
                          setHandsGerms(0);
                          setHygieneFeedback("رائع جداً! غسلت الصابون بالماء الجاري ونظفت يديك بالكامل! حصلت على 10 نجوم! ⭐");
                          addStars(10);
                        }}
                        className="px-4 py-2 bg-[#FFD93D] disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 disabled:border-gray-300 disabled:shadow-none border-4 border-[#7A6A24] rounded-xl text-xs font-black shadow-[0_3px_0_0_#D1B02B] cursor-pointer"
                      >
                        💧 شطف بالماء الجاري
                      </button>

                      <button
                        onClick={() => {
                          setHandsGerms(3);
                          setHandsSoaped(false);
                          setHandsClean(false);
                          setHygieneFeedback("دعنا نتدرب على غسيل اليدين بالصابون مجدداً لنحمي صحتنا!");
                        }}
                        className="px-3 py-2 bg-white hover:bg-gray-50 border-4 border-gray-400 rounded-xl text-xs font-black shadow-[0_3px_0_0_#9CA3AF] cursor-pointer"
                      >
                        🔄 إعادة ضبط
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. BRUSH TEETH GAME */}
                {activeHygieneStep === 'brush_teeth' && (
                  <div className="space-y-4 w-full max-w-md">
                    <h3 className="text-sm font-black text-[#078F62]">فرشِ أسنانك مرتين يومياً لمحاربة سوسة الأسنان الشريرة! 🪥🦷</h3>
                    
                    {/* Teeth visual container */}
                    <div className="relative w-full h-40 bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {teethCleanState === 'clean' ? (
                        <div className="text-center space-y-1">
                          <span className="text-6xl animate-pulse">✨🦷✨</span>
                          <p className="text-emerald-800 text-xs font-black">أسنان ناصعة كاللؤلؤ، قوية وجميلة تحميك من السوسة!</p>
                        </div>
                      ) : teethCleanState === 'brushing' ? (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-5xl animate-bounce">🪥🦷</span>
                          <span className="text-3xl mt-1 text-sky-400 font-bold animate-pulse">🫧 رغوة منعشة 🫧</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <span className="text-7xl select-none">😬</span>
                          {/* Yellow food dirt spots */}
                          <span className="absolute top-8 left-4 text-xs">🍿</span>
                          <span className="absolute bottom-8 right-4 text-xs">🍫</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={teethCleanState === 'clean' || teethCleanState === 'brushing'}
                        onClick={() => {
                          setTeethCleanState('brushing');
                          setHygieneFeedback("يا بطل! تقوم بفرش الأسنان بحركات دائرية هادئة لتنظيف جميع الجهات!");
                          setTimeout(() => {
                            setTeethCleanState('clean');
                            setHygieneFeedback("مذهل جداً! أسنانك الآن بيضاء كالثلج وقوية كالصخر! حصلت على 10 نجوم! ⭐");
                            addStars(10);
                          }, 3000);
                        }}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 border-4 border-[#10B981] disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 rounded-xl text-xs font-black shadow-[0_3px_0_0_#078F62] cursor-pointer"
                      >
                        🪥 ابدأ الفرشاة السحرية (3 ثواني)
                      </button>

                      <button
                        onClick={() => {
                          setTeethCleanState('dirty');
                          setHygieneFeedback("اضغط الزر لمساعدة أسنانك على البريق والجمال!");
                        }}
                        className="px-3 py-2 bg-white hover:bg-gray-50 border-4 border-gray-400 rounded-xl text-xs font-black shadow-[0_3px_0_0_#9CA3AF] cursor-pointer"
                      >
                        🔄 تنظيف مجدداً
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SHOWER GAME */}
                {activeHygieneStep === 'shower' && (
                  <div className="space-y-4 w-full max-w-md">
                    <h3 className="text-sm font-black text-[#078F62]">شاور الاستحمام يزيل التعب والروائح المزعجة ويعطيك النشاط! 🚿🫧</h3>
                    
                    {/* Shower visual container */}
                    <div className="relative w-full h-40 bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {showerCleanState === 'clean' ? (
                        <div className="text-center space-y-1">
                          <span className="text-6xl animate-pulse">✨🧼👦✨</span>
                          <p className="text-emerald-800 text-xs font-black">جسم معطر بالورد وصحة ونشاط كاملين!</p>
                        </div>
                      ) : showerCleanState === 'showering' ? (
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="text-5xl animate-bounce">🚿</span>
                          <span className="text-4xl">🫧🫧🫧</span>
                          <p className="text-sky-700 text-xs font-bold animate-pulse">غسيل الجسم بالشامبو والمياه...</p>
                        </div>
                      ) : (
                        <div className="relative flex flex-col items-center">
                          <span className="text-6xl">👦</span>
                          {/* Dirt clouds */}
                          <span className="absolute -top-1 left-2 text-xl select-none opacity-60">☁️</span>
                          <span className="absolute top-6 right-2 text-xl select-none opacity-60">☁️</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 justify-center">
                      <button
                        disabled={showerCleanState === 'clean' || showerCleanState === 'showering'}
                        onClick={() => {
                          setShowerCleanState('showering');
                          setHygieneFeedback("الاستحمام بالماء الفاتر والشامبو يزيل الأتربة والجراثيم الميتة عن جلدك الحنون!");
                          setTimeout(() => {
                            setShowerCleanState('clean');
                            setHygieneFeedback("أحسنت الاستحمام! جسمك الآن معقم ونشيط جداً ورائحته منعشة ولطيفة! حصلت على 10 نجوم! ⭐");
                            addStars(10);
                          }, 3000);
                        }}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 border-4 border-[#10B981] disabled:border-gray-300 disabled:text-gray-400 disabled:bg-gray-100 rounded-xl text-xs font-black shadow-[0_3px_0_0_#078F62] cursor-pointer"
                      >
                        🚿 افتح مياه الدش المنعش (3 ثواني)
                      </button>

                      <button
                        onClick={() => {
                          setShowerCleanState('dirty');
                          setHygieneFeedback("اضغط زر الدش للاستحمام وصابون المعقم الطازج!");
                        }}
                        className="px-3 py-2 bg-white hover:bg-gray-50 border-4 border-gray-400 rounded-xl text-xs font-black shadow-[0_3px_0_0_#9CA3AF] cursor-pointer"
                      >
                        🔄 استحم مجدداً
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. IMMUNITY HEROES QUIZ */}
                {activeHygieneStep === 'prevention_quiz' && (
                  <div className="space-y-4 w-full animate-fade-in">
                    <h3 className="text-sm font-black text-[#078F62]">تحدي أبطال المناعة: حدد السلوكيات الصحيحة للوقاية من الأمراض! 🛡️</h3>
                    
                    {/* Quiz items grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto">
                      {[
                        { id: 'mask', emoji: '😷', title: 'ارتداء الكمامة عند المرض والرشح', correct: true, desc: 'صحيح! ارتداء الكمامة يمنع تطاير اللعاب الحامل للجراثيم عند السعال أو العطس، لحماية أحبابك!' },
                        { id: 'fruits', emoji: '🍎', title: 'تناول الأغذية الصحية والفواكه', correct: true, desc: 'رائع جداً! الفيتامينات تغذي جيش المناعة الداخلي في جسمك ليقهر أي جرثومة شريرة!' },
                        { id: 'sleep', emoji: '😴', title: 'النوم مبكراً لإراحة الجسم', correct: true, desc: 'ممتاز! النوم يساعد الخلايا التالفة على التجدد ويعطي دماغك وجسمك القوة لليوم التالي!' },
                        { id: 'vaccine', emoji: '💉', title: 'أخذ اللقاحات والأمصال الضرورية', correct: true, desc: 'بطل شجاع! اللقاحات تدرب خلايا المناعة على مهاجمة الفيروسات بشكل أسرع وأقوى!' },
                        { id: 'sneeze_face', emoji: '🤧', title: 'العطس في وجوه الآخرين دون منديل', correct: false, desc: 'خطير وخاطئ! العطس هكذا ينشر ملايين الجراثيم السريعة في الهواء فيمرض من حولنا!' },
                        { id: 'dirty_hands', emoji: '🤢', title: 'الأكل بأيدي متسخة دون غسيل', correct: false, desc: 'خطر جداً! اليد المتسخة تنقل الجراثيم من الأبواب والألعاب إلى بطنك فتسبب وجعاً ومغصاً!' }
                      ].map(item => {
                        const isSelected = hygieneQuizSelections[item.id] !== undefined;
                        let cardClass = 'bg-white border-gray-200 hover:border-[#10B981]';
                        if (isSelected) {
                          cardClass = item.correct
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800';
                        }
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              if (isSelected) return;
                              setHygieneQuizSelections(prev => ({ ...prev, [item.id]: item.correct }));
                              if (item.correct) {
                                setHygieneFeedback(`أحسنت! ${item.desc} حصلت على 5 نجوم! ⭐`);
                                addStars(5);
                              } else {
                                setHygieneFeedback(`خطأ وتنبيه! ${item.desc}`);
                              }
                            }}
                            className={`p-3 border-4 rounded-xl text-right flex items-center gap-3 cursor-pointer transition text-xs font-black ${cardClass}`}
                          >
                            <span className="text-3xl select-none">{item.emoji}</span>
                            <div className="flex-1">
                              <p className="font-bold text-xs">{item.title}</p>
                              {isSelected && (
                                <p className="text-[10px] mt-1 font-medium leading-relaxed opacity-90">{item.correct ? '✔️ تصرف وقائي رائع!' : '❌ تصرف خاطئ ينشر العدوى!'}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hygiene feedback line */}
                <div className={`p-3 rounded-xl border-2 text-xs font-black transition-all max-w-md w-full ${
                  hygieneFeedback.includes('حصلت على')
                    ? 'bg-green-50 border-green-200 text-green-800 animate-pulse'
                    : hygieneFeedback.includes('خطأ')
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <p>{hygieneFeedback}</p>
                </div>

              </div>
            </div>

            {/* Explanation box */}
            <div className="md:col-span-4 bg-white border-4 border-[#10B981] shadow-[0_6px_0_0_#078F62] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#078F62] font-black text-lg mb-1 flex items-center gap-1">
                  نصيحة الطبيب سمسم للوقاية والنظافة:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">
                  الجراثيم والفيروسات مخلوقات دقيقة جداً لا تُرى بالعين المجردة، لكنها قد تجعلنا نشعر بالمرض والتعب!
                  <br />
                  - **النظافة الشخصية**: غسل اليدين جيداً بالصابون، والاستحمام، وتفريش الأسنان يطرد الجراثيم ويمنع تكاثرها على أجسامنا.
                  <br />
                  - **الوقاية من الأمراض**: تناول الفواكه الغنية بفيتامين C (مثل البرتقال والليمون 🍊🍋)، وتغطية الفم بمنديل عند العطس 🤧، وأخذ اللقاحات يحمي درع المناعة ويجعلنا أصحاء وأقوياء دائماً!
                </p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 معلومة شجاعة: درع مناعتك هو كالحارس الذكي! ساعده بنوم مبكر كافٍ وغذاء طبيعي متوازن ورياضة نشيطة لكي لا ينهزم أبداً! 🍎😴🧼🛡️
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="pollution"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Controls: Choose Pollution Type */}
            <div className="bg-white p-5 rounded-[24px] border-4 border-[#6C5CE7] shadow-[0_6px_0_0_#5044AB] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#5044AB] mb-3">
                  1. اختر مختبر حماية البيئة:
                </h3>
                <p className="text-xs text-gray-500 mb-4 font-bold">الأرض تحتاج لمهاراتك في التنظيف والفرز! اختر قطاعاً للبدء:</p>
                <div className="space-y-2">
                  {[
                    { id: 'air', name: 'تنقية هواء المدينة 🏭💨', desc: 'تنظيف الدخان وزراعة الأشجار' },
                    { id: 'water', name: 'تنظيف المحيط والأحياء البحرية 🐢🗑️', desc: 'جمع البلاستيك وإنقاذ السلحفاة' },
                    { id: 'soil', name: 'فرز المهملات وإعادة التدوير ♻️🏕️', desc: 'وضع القمامة في الصناديق المناسبة' },
                  ].map(sec => (
                    <button
                      key={sec.id}
                      onClick={() => {
                        setSelectedPollution(sec.id as any);
                        setPollutionExplanation(`أنت الآن في مختبر: ${sec.name}! الأرض تعتمد عليك لتنظيف هذا القطاع! ✨`);
                      }}
                      className={`w-full p-3 rounded-xl border-4 text-right transition flex items-center justify-between cursor-pointer ${
                        selectedPollution === sec.id
                          ? 'bg-[#F0ECFC] border-[#6C5CE7] text-[#5044AB] shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-violet-50/50 shadow-sm'
                      }`}
                      id={`pollution-sec-${sec.id}`}
                    >
                      <div className="text-right">
                        <p className="font-black text-sm">{sec.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold">{sec.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right/Middle Column: Interactive Clean up board */}
            <div className="bg-white p-6 rounded-[28px] border-4 border-[#6C5CE7] shadow-[0_8px_0_0_#5044AB] min-h-[350px] md:col-span-2 flex flex-col justify-between">
              <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden w-full">
                
                {/* AIR POLLUTION INTERACTIVE */}
                {selectedPollution === 'air' && (
                  <div className="w-full text-center space-y-4">
                    <div className="relative w-full h-40 bg-gradient-to-b from-[#FAF6FE] to-indigo-50 border-4 border-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                      {/* Sun or Grey Clouds */}
                      {airTreesCount >= 4 || airFilterInstalled ? (
                        <div className="absolute top-2 right-4 text-4xl animate-spin" style={{ animationDuration: '20s' }}>☀️</div>
                      ) : (
                        <div className="absolute top-2 right-4 text-4xl text-gray-400">☁️</div>
                      )}

                      {/* Birds or Smoke */}
                      {airFilterInstalled ? (
                        <div className="absolute top-4 left-6 text-xl animate-bounce">🐦🐦</div>
                      ) : null}

                      {/* Factory */}
                      <div className="absolute bottom-0 right-4 text-6xl select-none">🏭</div>

                      {/* Dynamic Smoke emission based on trees & filters */}
                      {!airFilterInstalled && (
                        <motion.div
                          animate={{
                            x: [0, -30, -60],
                            y: [0, -20, -40],
                            opacity: [0.7, 0.4, 0]
                          }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                          className={`absolute bottom-12 right-12 text-5xl select-none ${
                            airTreesCount >= 4 ? 'text-gray-300 opacity-30' : 'text-gray-600'
                          }`}
                        >
                          💨
                        </motion.div>
                      )}

                      {/* Planted Trees display */}
                      <div className="absolute bottom-0 left-4 flex gap-1">
                        {Array.from({ length: airTreesCount }).map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="text-4xl select-none"
                          >
                            🌲
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 font-bold">
                      الأشجار المزروعة: {airTreesCount} / 6 | فلتر المصنع: {airFilterInstalled ? '✅ مركب ونشط' : '❌ غير مركب'}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={handlePlantTree}
                        className="bg-white hover:bg-violet-50 border-4 border-[#2ECC71] px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-[0_3px_0_0_#25A35A]"
                      >
                        🌲 ازرع شجرة لتنقية الهواء (+5 ⭐)
                      </button>
                      <button
                        onClick={handleInstallFilter}
                        disabled={airFilterInstalled}
                        className="bg-[#FFD93D] disabled:bg-gray-100 disabled:text-gray-400 text-gray-800 border-4 border-[#7A6A24] disabled:border-gray-300 px-4 py-2 rounded-xl text-xs font-black cursor-pointer shadow-[0_3px_0_0_#D1B02B] disabled:shadow-none"
                      >
                        ⚙️ ركّب فلتر تنقية ذكي (+10 ⭐)
                      </button>
                      <button
                        onClick={handleResetAir}
                        className="bg-white hover:bg-red-50 border-4 border-gray-400 px-3 py-2 rounded-xl text-xs font-black cursor-pointer"
                      >
                        🔄 إعادة ضبط
                      </button>
                    </div>
                  </div>
                )}

                {/* WATER POLLUTION INTERACTIVE */}
                {selectedPollution === 'water' && (
                  <div className="w-full text-center space-y-4">
                    {/* Ocean Box */}
                    <div className={`w-full h-40 rounded-2xl border-4 border-gray-200 relative overflow-hidden transition-colors duration-500 flex items-center justify-center ${
                      waterTrashList.every(t => t.collected) ? 'bg-sky-200' : 'bg-slate-300'
                    }`}>
                      {/* Happy or Sad Turtle */}
                      <motion.div
                        animate={waterTrashList.every(t => t.collected) ? { y: [0, -10, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute text-5xl select-none"
                      >
                        🐢
                      </motion.div>

                      {/* Swimming Fish */}
                      <div className="absolute left-6 bottom-4 text-3xl animate-pulse">🐠</div>

                      {/* Trash items floating inside the water if not collected */}
                      <div className="absolute inset-0 p-4">
                        {waterTrashList.map(trash => {
                          if (trash.collected) return null;
                          return (
                            <motion.button
                              key={trash.id}
                              whileHover={{ scale: 1.15 }}
                              onClick={() => handleCollectWaterTrash(trash.id)}
                              className="absolute text-3xl cursor-pointer bg-white/60 p-1.5 rounded-full border border-red-300 shadow-sm animate-bounce"
                              style={{
                                top: trash.id === 'bottle' ? '20%' : trash.id === 'bag' ? '55%' : '40%',
                                left: trash.id === 'bottle' ? '15%' : trash.id === 'bag' ? '70%' : '45%',
                              }}
                              title="اضغط لجمع الملوثات"
                            >
                              {trash.emoji}
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="absolute bottom-1 right-2 text-[10px] bg-sky-900/60 text-white px-2 py-0.5 rounded select-none">
                        {waterTrashList.every(t => t.collected) ? 'المياه نظيفة تماماً! 🌊💎' : 'تحذير: النفايات تضر بالحيوانات البحرية! ⚠️'}
                      </div>
                    </div>

                    <div className="flex gap-4 justify-between items-center bg-gray-50 p-2.5 rounded-xl text-xs font-bold text-gray-600">
                      <span>النفايات المجمّعة:</span>
                      <div className="flex gap-2">
                        {waterTrashList.map(t => (
                          <span key={t.id} className={t.collected ? 'opacity-100 line-through text-green-600' : 'opacity-40'}>
                            {t.emoji} {t.collected ? '✔️' : '❌'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleResetWater}
                      className="bg-white hover:bg-violet-50 border-4 border-gray-400 py-1.5 px-4 rounded-xl text-xs font-black cursor-pointer inline-flex items-center gap-1.5"
                    >
                      🔄 أعد المحاولة وعلم طفلك النظافة
                    </button>
                  </div>
                )}

                {/* SOIL & RECYCLING INTERACTIVE */}
                {selectedPollution === 'soil' && (
                  <div className="w-full text-center space-y-4">
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      طابق النفايات وقم برميها في الحاوية المناسبة لها بإعادة التدوير الذكية:
                    </p>

                    {/* Grass area with unbinned trash */}
                    <div className="w-full h-24 bg-emerald-50 border-4 border-dashed border-emerald-200 rounded-2xl relative flex items-center justify-center gap-4">
                      {soilTrashList.filter(t => !t.binned).length === 0 ? (
                        <div className="text-center text-emerald-800 font-black text-sm p-4">
                          🎉 العشب نظيف تماماً ونبتت زهور جميلة! 🌸🌼🌻
                        </div>
                      ) : (
                        soilTrashList.filter(t => !t.binned).map(item => (
                          <div key={item.id} className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-1">
                            <span className="text-2xl">{item.emoji}</span>
                            <span className="text-[10px] font-black text-gray-700">{item.name}</span>
                            <div className="flex gap-1 mt-1">
                              <button
                                onClick={() => handleSortSoilTrash(item.id, 'plastic')}
                                className="px-1.5 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-200 text-[9px] rounded font-black cursor-pointer"
                              >
                                بلاستيك
                              </button>
                              <button
                                onClick={() => handleSortSoilTrash(item.id, 'paper')}
                                className="px-1.5 py-0.5 bg-green-100 text-green-800 hover:bg-green-200 text-[9px] rounded font-black cursor-pointer"
                              >
                                ورق
                              </button>
                              <button
                                onClick={() => handleSortSoilTrash(item.id, 'organic')}
                                className="px-1.5 py-0.5 bg-amber-100 text-amber-800 hover:bg-amber-200 text-[9px] rounded font-black cursor-pointer"
                              >
                                عضوي
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Three Colorful Bins */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 border-4 border-blue-400 p-2 rounded-2xl flex flex-col items-center">
                        <span className="text-3xl select-none">🔵</span>
                        <span className="text-[11px] font-black text-blue-800 mt-1">بلاستيك</span>
                        <span className="text-[9px] text-gray-500 font-bold">(قنينة، ألعاب)</span>
                      </div>
                      <div className="bg-green-50 border-4 border-green-400 p-2 rounded-2xl flex flex-col items-center">
                        <span className="text-3xl select-none">🟢</span>
                        <span className="text-[11px] font-black text-green-800 mt-1">ورق</span>
                        <span className="text-[9px] text-gray-500 font-bold">(أوراق، كرتون)</span>
                      </div>
                      <div className="bg-amber-50 border-4 border-amber-500 p-2 rounded-2xl flex flex-col items-center">
                        <span className="text-3xl select-none">🟤</span>
                        <span className="text-[11px] font-black text-[#8C6D23] mt-1">عضوي</span>
                        <span className="text-[9px] text-gray-500 font-bold">(بقايا، قشور)</span>
                      </div>
                    </div>

                    <button
                      onClick={handleResetSoil}
                      className="bg-white hover:bg-violet-50 border-4 border-gray-400 py-1.5 px-4 rounded-xl text-xs font-black cursor-pointer inline-flex items-center gap-1.5"
                    >
                      🔄 أعد بعثرة المهملات لفرزها مجدداً
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Explanation Box */}
            <div className="md:col-span-3 bg-white border-4 border-[#6C5CE7] shadow-[0_6px_0_0_#5044AB] p-5 rounded-[24px] flex items-start gap-3">
              <div className="text-3xl">🦉</div>
              <div>
                <h4 className="text-[#5044AB] font-black text-lg mb-1 flex items-center gap-1">
                  نصيحة حارس كوكب الأرض سمسم:
                </h4>
                <p className="text-gray-700 text-sm font-bold leading-relaxed">{pollutionExplanation}</p>
                <div className="text-[11px] text-gray-500 mt-2 font-medium">
                  💡 معلومات بيئية: كوكبنا الأرض هو بيتنا الكبير والوحيد في الكون! رمي النفايات في سلة المهملات، وتقليل استخدام البلاستيك، وزراعة الأشجار، يحافظ على هوائنا نقياً ومياهنا زرقاء وصافية لتعيش الحيوانات والنباتات بأمان ونعيش نحن بصحة وسعادة! 🌍💚🌲
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
