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
  VolumeX, 
  Check, 
  Award, 
  Star, 
  Lightbulb, 
  HelpCircle, 
  ArrowRight,
  Eye,
  Ear,
  Hand,
  CheckCircle2,
  Trophy,
  Zap,
  Activity,
  Sun,
  Moon,
  Wind,
  Layers,
  Search
} from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface FiveSensesGameProps {
  addStars: (amount: number) => void;
}

type TabMode = 'atlas' | 'sorting' | 'experiments' | 'quiz';

export type SenseKey = 'sight' | 'hearing' | 'smell' | 'taste' | 'touch';

interface SenseData {
  key: SenseKey;
  name: string;
  organ: string;
  emoji: string;
  color: string;
  borderColor: string;
  shadowColor: string;
  bgGradient: string;
  stimulus: string;
  stimulusName: string;
  anatomyParts: string[];
  simpleExplanation: string;
  scientificDeepDive: string;
  funFact: string;
  dailyExample: string;
}

const SENSES_INFO: Record<SenseKey, SenseData> = {
  sight: {
    key: 'sight',
    name: 'حاسة البصر',
    organ: 'العين (The Eye)',
    emoji: '👁️',
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-[#3B82F6]',
    shadowColor: 'shadow-[0_8px_0_0_#1D4ED8]',
    bgGradient: 'from-blue-50 via-indigo-50/50 to-blue-100/60',
    stimulus: 'ضوء وألوان',
    stimulusName: 'الضوء المنعكس (Light Rays)',
    anatomyParts: ['القرنية (Cornea)', 'البؤبؤ (Pupil)', 'عدسة العين (Lens)', 'الشبكية (Retina)', 'العصب البصري (Optic Nerve)'],
    simpleExplanation: 'تسقط أشعة الضوء على الأشياء وتنعكس إلى داخل العين عبر البؤبؤ، فتستقبلها شبكية العين وترسل إشارات سريعة للدماغ لنرى الأشكال والألوان بدقة!',
    scientificDeepDive: 'تحتوي شبكية العين على ملايين الخلايا الحساسة للضوء (المخاريط لتمييز الألوان، والعصي للرؤية الليلية)، وتنتقل الإشارة بسرعة 400 كم/ساعة عبر العصب البصري إلى الفص القذالي في الدماغ!',
    funFact: 'تستطيع عين الإنسان الطبيعية التمييز بين أكثر من 10 ملايين لون مختلف في طرفة عين!',
    dailyExample: 'رؤية قوس قزح في السماء، قراءة كتاب، ومشاهدة النجوم المتلألئة ليلاً ✨.'
  },
  hearing: {
    key: 'hearing',
    name: 'حاسة السمع',
    organ: 'الأذن (The Ear)',
    emoji: '👂',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-[#8B5CF6]',
    shadowColor: 'shadow-[0_8px_0_0_#6D28D9]',
    bgGradient: 'from-purple-50 via-pink-50/50 to-purple-100/60',
    stimulus: 'موجات صوتية',
    stimulusName: 'الاهتزازات الصوتية (Sound Waves)',
    anatomyParts: ['صيوان الأذن (Pinna)', 'القناة السمعية (Ear Canal)', 'طبلة الأذن (Eardrum)', 'عظيمات السمع الثلاث', 'القوقعة والعصب السمعي'],
    simpleExplanation: 'تنتقل الأصوات في الهواء على شكل اهتزازات وموجات غير مرئية؛ يلتقطها صيوان الأذن فتهتز طبلة الأذن وتنقلها للدماغ ليميز الصوت ونوعه ومكانه!',
    scientificDeepDive: 'تعتبر عظيمات الأذن الوسطى (المطرقة، السندان، الركاب) أصغر عظام في جسم الإنسان بأكمله، حيث لا يتجاوز حجم عظمة الركاب حبة الأرز!',
    funFact: 'الأذن لا تنام أبداً! فحتى أثناء نومك العميق تستمر في التقاط الأصوات، لكن الدماغ يقوم بفلترة الأصوات غير الخطيرة حتى تستريح!',
    dailyExample: 'سماع صوت تغريد البلبل 🐦، صوت المطر والرعد ⚡، ودقات جرس المدرسة 🔔.'
  },
  smell: {
    key: 'smell',
    name: 'حاسة الشم',
    organ: 'الأنف (The Nose)',
    emoji: '👃',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-[#F59E0B]',
    shadowColor: 'shadow-[0_8px_0_0_#B45309]',
    bgGradient: 'from-amber-50 via-orange-50/50 to-yellow-100/60',
    stimulus: 'جزيئات الروائح',
    stimulusName: 'الجزيئات الغازية في الهواء (Odor Molecules)',
    anatomyParts: ['فتحتا الأنف (Nostrils)', 'التجويف الأنفي (Nasal Cavity)', 'المستقبلات الشمية (Olfactory Cells)', 'البصلة الشمية في الدماغ'],
    simpleExplanation: 'عندما نستنشق الهواء، تدخل جزيئات الرائحة الصغيرة جداً وتذوب في بطانة الأنف، حيث تتعرف عليها خلايا الاستشعار وترسل برقية فورية لمركز الشم والذاكرة بالدماغ!',
    scientificDeepDive: 'حاسة الشم هي الحاسة الوحيدة المرتبطة مباشرة بمركز المشاعر والذاكرة (الجهاز الحوفي/Limbic System)، لذلك فإن رائحة معينة قد تعيدك فوراً لذكرى قديمة!',
    funFact: 'أنف الإنسان يمتلك أكثر من 400 نوع من المستقبلات الشمية، ويستطيع تمييز أكثر من تريليون رائحة مختلفة!',
    dailyExample: 'استنشاق عطر الورد والياسمين 🌸، شم رائحة الخبز الساخن، وشم رائحة الدخان للتحذير من الخطر.'
  },
  taste: {
    key: 'taste',
    name: 'حاسة التذوق',
    organ: 'اللسان (The Tongue)',
    emoji: '👅',
    color: 'from-rose-500 to-red-600',
    borderColor: 'border-[#EF4444]',
    shadowColor: 'shadow-[0_8px_0_0_#B91C1C]',
    bgGradient: 'from-rose-50 via-red-50/50 to-pink-100/60',
    stimulus: 'المواد الذائبة',
    stimulusName: 'المركبات الكيميائية في الطعام (Chemical Flavors)',
    anatomyParts: ['الحليمات اللسانية (Papillae)', 'براعم التذوق (Taste Buds)', 'الخلايا الذوقية (Gustatory Cells)', 'الأعصاب الحسية'],
    simpleExplanation: 'يغطي اللسان آلاف النتوءات الدقيقة التي تحتوي على براعم التذوق؛ تتعرف هذه البراعم على نكهة الطعام عند ملامسته للسان لنستمتع بالطعام ونتعرف عليه!',
    scientificDeepDive: 'يميز اللسان 5 مذاقات أساسية علمية: الحلو (طاقة/سكريات)، المالح (أملاح ومعادن)، الحامض (أحماض وفيتامينات)، المر (تحذير من السموم)، والأومامي (بروتينات وأحماض أمينية)!',
    funFact: 'هل تعلم أن 80% مما نعتقد أنه طعم هو في الحقيقة رائحة من حاسة الشم؟ إذا أغلقت أنفك أثناء الأكل يقل إحساسك بالنكهة جداً!',
    dailyExample: 'تذوق حلاوة العسل والتمر 🍯، حموضة الليمون 🍋، وملوحة الطعام اللذيذ.'
  },
  touch: {
    key: 'touch',
    name: 'حاسة اللمس',
    organ: 'الجلد واليد (Skin & Hand)',
    emoji: '✋',
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-[#10B981]',
    shadowColor: 'shadow-[0_8px_0_0_#047857]',
    bgGradient: 'from-emerald-50 via-teal-50/50 to-green-100/60',
    stimulus: 'الضغط والحرارة والملمس',
    stimulusName: 'المؤثرات الميكانيكية والحرارية (Pressure & Temperature)',
    anatomyParts: ['بشرة الجلد الخارجية', 'مستقبلات اللمس والضغط', 'مستقبلات الحرارة والبرودة', 'نهايات عصبية للألم (لحماية الجسم)'],
    simpleExplanation: 'الجلد هو أكبر عضو في جسم الإنسان؛ تنتشر فيه ملايين المجسات الحسية التي تنبهنا فوراً إذا كان الشيء ساخناً، بارداً، ناعماً كالحرير، أو خشناً وقاسياً!',
    scientificDeepDive: 'أطراف الأصابع والشفاه تحتوي على أعلى كثافة من مستقبلات اللمس في الجسم بأكمله، مما يجعل يديك قادرة على الإحساس بأدق التفاصيل المجهرية!',
    funFact: 'تزن بشرة الإنسان البالغ حوالي 4 كيلوجرامات، وتحتوي كل سنتيمتر مربع من الجلد على أكثر من 1000 نهاية عصبية حسية!',
    dailyExample: 'ملامسة فرو الأرنب الناعم 🐇، الشعور ببرودة مكعب الثلج 🧊، ودفء أشعة الشمس ☀️.'
  }
};

interface SortingQuestion {
  id: string;
  item: string;
  emoji: string;
  question: string;
  correctSense: SenseKey;
  scientificFeedback: string;
}

const SORTING_ITEMS: SortingQuestion[] = [
  {
    id: 'rainbow',
    item: 'ألوان قوس قزح في السماء',
    emoji: '🌈',
    question: 'بأي حاسة نرى ألوان الطيف السبعة في السماء الماطرة؟',
    correctSense: 'sight',
    scientificFeedback: 'أحسنت! تستقبل شبكية العين أشعة الضوء المنعكسة وترسلها للدماغ لنرى الألوان الجميلة!'
  },
  {
    id: 'alarm',
    item: 'صوت جرس المنبه في الصباح',
    emoji: '⏰',
    question: 'بأي حاسة نسمع صوت رنين المنبه لنستيقظ بنشاط؟',
    correctSense: 'hearing',
    scientificFeedback: 'إجابة عبقرية! تلتقط الأذن الموجات والاهتزازات الصوتية عبر طبلة الأذن!'
  },
  {
    id: 'perfume',
    item: 'عطر الورد والزهور الفواحة',
    emoji: '🌹',
    question: 'بأي حاسة نستنشق رائحة الأزهار العطرة والزكية؟',
    correctSense: 'smell',
    scientificFeedback: 'صحيح تماماً! المستقبلات الشمية في أعلى الأنف تلتقط جزيئات الرائحة المتطايرة في الهواء!'
  },
  {
    id: 'lemon',
    item: 'شريحة الليمون الحامضة',
    emoji: '🍋',
    question: 'بأي حاسة نتذوق الطعم الحامض في الليمون والبرتقال؟',
    correctSense: 'taste',
    scientificFeedback: 'بطل حقيقي! براعم التذوق في اللسان تستشعر حموضة الليمون فترسل تنبيهاً لذيذاً للدماغ!'
  },
  {
    id: 'bunny_fur',
    item: 'فرو الأرنب الناعم كالحرير',
    emoji: '🐇',
    question: 'بأي حاسة نشعر بنعومة فرو الأرنب الصغير عند مداعبته؟',
    correctSense: 'touch',
    scientificFeedback: 'ممتاز! مستقبلات اللمس في خلايا الجلد وأطراف الأصابع تستشعر النعومة الفائقة!'
  },
  {
    id: 'thunder',
    item: 'صوت دوي الرعد في العاصفة',
    emoji: '⚡',
    question: 'بأي حاسة نسمع أصوات الرعد القوية في السماء؟',
    correctSense: 'hearing',
    scientificFeedback: 'رائع! الأذن تهتز مع الموجات الصوتية القوية الناجمة عن البرق والرعد!'
  },
  {
    id: 'ice',
    item: 'مكعب الثلج البارد جداً',
    emoji: '🧊',
    question: 'بأي حاسة نستشعر برودة مكعب الثلج عند الإمساك به؟',
    correctSense: 'touch',
    scientificFeedback: 'أحسنت! مستقبلات الحرارة والبرودة في الجلد تنبه الدماغ فوراً ببرودة الثلج!'
  },
  {
    id: 'honey',
    item: 'قطرة العسل الطبيعي الحلوة',
    emoji: '🍯',
    question: 'بأي حاسة نتذوق حلاوة العسل اللذيذ المفيد للجسم؟',
    correctSense: 'taste',
    scientificFeedback: 'إجابة صحيحة! براعم التذوق المسؤولة عن السكريات تتفاعل مع حلاوة العسل!'
  },
  {
    id: 'stars',
    item: 'النجوم المضيئة في الفضاء',
    emoji: '✨',
    question: 'بأي حاسة نكتشف النجوم اللامعة والكواكب في سماء الليل؟',
    correctSense: 'sight',
    scientificFeedback: 'رائع جداً! تجمع عدسة العين وبؤبؤها الضوء القادم من أعماق الفضاء لنراه بوضوح!'
  },
  {
    id: 'bread',
    item: 'رائحة الخبز الطازج الشهي',
    emoji: '🍞',
    question: 'بأي حاسة نعرف أن الخبز ينضج في الفرن قبل أن نراه؟',
    correctSense: 'smell',
    scientificFeedback: 'ذكاء خارق! جزيئات رائحة المخبوزات تطير في الهواء وتصل إلى الأنف مباشرة!'
  }
];

interface QuizQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  badge: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'ما هو أكبر عضو حسي في جسم الإنسان بأكمله؟',
    options: ['الجلد (حاسة اللمس)', 'العين (حاسة البصر)', 'اللسان (حاسة التذوق)'],
    correctIdx: 0,
    explanation: 'الجلد هو أكبر عضو في جسم الإنسان ويزن حوالي 4 كجم ويغطي الجسم كاملاً ليحميه ويشعر بالعالم!',
    badge: 'بطل التشريح 🧬'
  },
  {
    question: 'أي جزء في العين يستقبل الضوء ويرسل الإشارات مباشرة إلى الدماغ؟',
    options: ['الشبكية (Retina)', 'الرموش والحاجب', 'الجفن'],
    correctIdx: 0,
    explanation: 'شبكية العين مبطنة بملايين الخلايا الحساسة للضوء وتنقل الصور عبر العصب البصري إلى الدماغ.',
    badge: 'عالم البصريات 👁️'
  },
  {
    question: 'تنتقل الأصوات التي تسمعها الأذن عبر الهواء على شكل ماذا؟',
    options: ['اهتزازات وموجات صوتية', 'أشعة ضوئية ملونة', 'رياح قوية فقط'],
    correctIdx: 0,
    explanation: 'الأصوات هي اهتزازات في جزيئات الهواء تلتقطها طبلة الأذن وعظيمات السمع وتحولها لنبضات مفهومة.',
    badge: 'خبير الصوتيات 🎵'
  },
  {
    question: 'أين توجد براعم التذوق المسؤولة عن معرفة نكهات الطعام؟',
    options: ['على سطح اللسان', 'داخل الأسنان', 'في الحلق فقط'],
    correctIdx: 0,
    explanation: 'تنتشر آلاف براعم التذوق المجهرية على حليمات اللسان لتمييز الحلو، المالح، الحامض، والمر، والأومامي!',
    badge: 'متذوق العلوم 👅'
  },
  {
    question: 'لماذا يقل إحساسنا بطعم ونكهة الطعام عندما نكون مصابين بالزكام والأنف مغلق؟',
    options: ['لأن 80% من النكهة تأتي من حاسة الشم!', 'لأن اللسان ينام أثناء الزكام', 'لأن الطعام يفقد طعمه'],
    correctIdx: 0,
    explanation: 'حاسة الشم وتذوق الطعام شريكان متلازمان! معظم إدراكنا للنكهات المعقدة يعتمد على حاسة الشم.',
    badge: 'عبقري الفسيولوجيا 🧠'
  }
];

export default function FiveSensesGame({ addStars }: FiveSensesGameProps) {
  const { speak, isSpeaking, stop } = useSpeech();
  const [activeTab, setActiveTab] = useState<TabMode>('atlas');
  const [selectedSense, setSelectedSense] = useState<SenseKey>('sight');

  // Sorting Challenge State
  const [sortingIdx, setSortingIdx] = useState(0);
  const [sortingScore, setSortingScore] = useState(0);
  const [sortingCompleted, setSortingCompleted] = useState(false);
  const [selectedSortingAnswer, setSelectedSortingAnswer] = useState<SenseKey | null>(null);
  const [sortingFeedback, setSortingFeedback] = useState<string | null>(null);

  // Pupil Mini Experiment State (Sight)
  const [pupilLight, setPupilLight] = useState<'normal' | 'bright' | 'dark'>('normal');

  // Sound Wave Experiment State (Hearing)
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);

  // Tongue Taste Buds Map State
  const [selectedTasteType, setSelectedTasteType] = useState<'sweet' | 'salty' | 'sour' | 'bitter' | 'umami'>('sweet');

  // Touch Experiment State
  const [testedTexture, setTestedTexture] = useState<'feather' | 'ice' | 'tea' | 'rock'>('feather');

  // Quiz State
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Audio synthesis helper
  const playFrequencyTone = (freq: number, duration = 0.4) => {
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
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
      setActiveFrequency(freq);
      setTimeout(() => setActiveFrequency(null), duration * 1000);
    } catch (e) {}
  };

  const playChime = (notes: number[], type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.3);

        osc.start(ctx.currentTime + i * 0.09);
        osc.stop(ctx.currentTime + i * 0.09 + 0.3);
      });
    } catch (e) {}
  };

  const playSuccessSound = () => playChime([523, 659, 783, 1046], 'triangle');
  const playErrorSound = () => playChime([260, 220], 'sawtooth');

  const currentSense = SENSES_INFO[selectedSense];
  const currentSortingItem = SORTING_ITEMS[sortingIdx];
  const currentQuiz = QUIZ_QUESTIONS[quizIdx];

  // Read aloud helper
  const handleSpeakSense = () => {
    const textToRead = `${currentSense.name}. العضو المسؤول هو ${currentSense.organ}. المثير العلمي هو ${currentSense.stimulusName}. ${currentSense.simpleExplanation} معلومة علمية مدهشة: ${currentSense.funFact}`;
    speak(textToRead);
  };

  // Handle sorting question answer
  const handleAnswerSorting = (sense: SenseKey) => {
    if (selectedSortingAnswer !== null) return;
    setSelectedSortingAnswer(sense);

    if (sense === currentSortingItem.correctSense) {
      playSuccessSound();
      setSortingScore(prev => prev + 1);
      setSortingFeedback(currentSortingItem.scientificFeedback);
      speak(currentSortingItem.scientificFeedback);
    } else {
      playErrorSound();
      const feedback = `حاول مرة أخرى يا بطل! ${currentSortingItem.item} ندركها بواسطة ${SENSES_INFO[currentSortingItem.correctSense].name} (${SENSES_INFO[currentSortingItem.correctSense].organ}).`;
      setSortingFeedback(feedback);
      speak(feedback);
    }
  };

  const handleNextSorting = () => {
    if (sortingIdx < SORTING_ITEMS.length - 1) {
      setSortingIdx(prev => prev + 1);
      setSelectedSortingAnswer(null);
      setSortingFeedback(null);
    } else {
      setSortingCompleted(true);
      addStars(25);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  // Handle quiz question answer
  const handleQuizAnswer = (idx: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(idx);

    if (idx === currentQuiz.correctIdx) {
      playSuccessSound();
      setQuizScore(prev => prev + 1);
      speak(`أحسنت! ${currentQuiz.explanation}`);
    } else {
      playErrorSound();
      speak(`إجابة غير دقيقة! ${currentQuiz.explanation}`);
    }
  };

  const handleNextQuiz = () => {
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx(prev => prev + 1);
      setQuizSelected(null);
    } else {
      setQuizCompleted(true);
      addStars(30);
      try {
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HUD                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#10B981] shadow-[0_8px_0_0_#059669] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#6EE7B7] flex items-center justify-center text-3xl shadow-inner text-white shrink-0 select-none">
            🖐️🔬
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                مختبر العلوم والفيزيولوجيا الحيوية 🧬
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ علوم وتجارب
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
              مختبر الحواس الخمسة التفاعلي (Five Senses Science) 👁️👂👃👅✋
            </h2>
            <p className="text-xs font-bold text-gray-500 mt-0.5">
              استكشف أسرار حواسك الخمس وتعرف على أعضاء الاستشعار وكيف يترجمها الدماغ لعالم رائع!
            </p>
          </div>
        </div>

        {/* Global Navigation Tabs (Fully visible with flex-wrap) */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-emerald-50/80 p-2 rounded-2xl border-2 border-emerald-200">
          {[
            { id: 'atlas', label: '🔬 أطلس الحواس', emoji: '🔬' },
            { id: 'sorting', label: '🎯 تحدي المثيرات', emoji: '🎯' },
            { id: 'experiments', label: '🧪 محاكي التجارب', emoji: '🧪' },
            { id: 'quiz', label: '🏆 مسابقة العباقرة', emoji: '🏆' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  stop();
                  setActiveTab(tab.id as TabMode);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial text-center ${
                  isActive
                    ? 'bg-[#10B981] text-white shadow-md scale-105'
                    : 'text-gray-700 hover:bg-white bg-white/70 border border-emerald-100'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: INTERACTIVE SENSORY ATLAS & LAB                                   */}
      {/* ========================================================================= */}
      {activeTab === 'atlas' && (
        <div className="space-y-6">
          
          {/* 5 Senses Selection Horizontal Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.keys(SENSES_INFO) as SenseKey[]).map((key) => {
              const sense = SENSES_INFO[key];
              const isSelected = selectedSense === key;

              return (
                <button
                  key={key}
                  onClick={() => {
                    stop();
                    setSelectedSense(key);
                  }}
                  className={`p-3.5 rounded-2xl border-3 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden ${
                    isSelected
                      ? `${sense.borderColor} ${sense.shadowColor} bg-white scale-105 shadow-lg ring-2 ring-emerald-300`
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="text-4xl mb-1.5 select-none">{sense.emoji}</div>
                  <h4 className="text-sm font-black text-gray-800">{sense.name}</h4>
                  <span className="text-[10px] font-bold text-gray-500 mt-0.5 line-clamp-1">
                    {sense.organ.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Sense Scientific Showcase Card */}
          <div className={`rounded-[32px] p-6 sm:p-8 border-4 ${currentSense.borderColor} ${currentSense.shadowColor} bg-white space-y-6 relative overflow-hidden`}>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentSense.color} text-white flex items-center justify-center text-5xl shadow-md select-none shrink-0`}>
                  {currentSense.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-gray-900">{currentSense.name}</h3>
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                      {currentSense.organ}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1.5">
                    <span>⚡ المثير العلمي الحسي:</span>
                    <strong className="text-purple-700">{currentSense.stimulusName}</strong>
                  </p>
                </div>
              </div>

              {/* Voice Read Aloud Button */}
              <button
                onClick={handleSpeakSense}
                className="py-2 px-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer transition shadow-xs"
                title="استمع إلى الشرح العلمي بصوت المعلم"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-emerald-800 animate-pulse" /> : <Volume2 className="w-4 h-4 text-emerald-800" />}
                <span>{isSpeaking ? 'إيقاف الصوت' : 'استمع للشرح 🔊'}</span>
              </button>
            </div>

            {/* Core Science & Anatomy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Box 1: How it works scientifically */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 space-y-2">
                <h4 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span>كيف تعمل الحاسة علمياً؟</span>
                </h4>
                <p className="text-xs font-bold text-gray-700 leading-relaxed">
                  {currentSense.simpleExplanation}
                </p>
                <div className="pt-2 border-t border-emerald-200/60 text-[11px] font-bold text-emerald-800 leading-relaxed">
                  {currentSense.scientificDeepDive}
                </div>
              </div>

              {/* Box 2: Anatomy & Components */}
              <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 space-y-3">
                <h4 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span>أجزاء العضو الحسي الحيوية:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentSense.anatomyParts.map((part, idx) => (
                    <span 
                      key={idx}
                      className="bg-white/90 text-purple-900 border border-purple-200 text-xs font-black px-2.5 py-1 rounded-xl shadow-xs"
                    >
                      {part}
                    </span>
                  ))}
                </div>
                <div className="p-2.5 bg-white/70 rounded-xl border border-purple-100 text-[11px] font-bold text-gray-600">
                  📍 <strong>أمثلة من حياتنا:</strong> {currentSense.dailyExample}
                </div>
              </div>

              {/* Box 3: Fun Scientific Fact */}
              <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 space-y-2">
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>معلومة علمية مدهشة! 💡</span>
                </h4>
                <p className="text-xs font-bold text-amber-900 leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200">
                  "{currentSense.funFact}"
                </p>
                <div className="text-[11px] font-black text-emerald-800 flex items-center gap-1">
                  <span>سبحان الخالق المبدع ✨</span>
                </div>
              </div>

            </div>

            {/* Interactive Live Mini-Experiment Container for this sense */}
            <div className="p-5 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-gray-800 flex items-center gap-2">
                  <span>🧪 تجربة تفاعلية مصغرة لحاسة {currentSense.name}:</span>
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  جرب بنفسك الآن!
                </span>
              </div>

              {/* Mini Experiment Sight: Pupil Reflex */}
              {selectedSense === 'sight' && (
                <div className="bg-white p-5 rounded-2xl border-2 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-right space-y-2">
                    <h5 className="font-black text-sm text-blue-950">تجربة: استجابة بؤبؤ العين للضوء (Pupil Light Reflex)</h5>
                    <p className="text-xs font-bold text-gray-600 max-w-md leading-relaxed">
                      عند تسليط الضوء الساطع تضيق فتحة البؤبؤ لحماية الشبكية، وعند حلول الظلام تتسع لجمع أكبر كمية من الضوء!
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setPupilLight('bright')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition ${
                          pupilLight === 'bright' ? 'bg-amber-400 text-amber-950 shadow' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>ضوء ساطع ☀️</span>
                      </button>
                      <button
                        onClick={() => setPupilLight('normal')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition ${
                          pupilLight === 'normal' ? 'bg-blue-500 text-white shadow' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span>ضوء طبيعي 🌤️</span>
                      </button>
                      <button
                        onClick={() => setPupilLight('dark')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition ${
                          pupilLight === 'dark' ? 'bg-gray-800 text-white shadow' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>غرفة مظلمة 🌙</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Pupil Animation */}
                  <div className="w-36 h-36 rounded-full bg-white border-4 border-blue-400 shadow-inner flex items-center justify-center relative overflow-hidden shrink-0">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center relative">
                      <motion.div
                        animate={{
                          scale: pupilLight === 'bright' ? 0.35 : pupilLight === 'dark' ? 1.05 : 0.65
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="w-16 h-16 rounded-full bg-black shadow-md flex items-center justify-center relative"
                      >
                        <div className="w-3 h-3 rounded-full bg-white/80 absolute top-2 right-2" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mini Experiment Hearing: Frequency Sound Waves */}
              {selectedSense === 'hearing' && (
                <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-right space-y-2">
                    <h5 className="font-black text-sm text-purple-950">تجربة: تردد الموجات الصوتية واهتزاز الأذن (Sound Frequencies)</h5>
                    <p className="text-xs font-bold text-gray-600 max-w-md leading-relaxed">
                      انقر على الأزرار لتسمع اهتزازات الهواء المختلفة، من التردد المنخفض العميق إلى التردد العالي الحاد!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => playFrequencyTone(130)}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                      >
                        🥁 منخفض (130 Hz - طبل الرعد)
                      </button>
                      <button
                        onClick={() => playFrequencyTone(440)}
                        className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                      >
                        🎵 متوسط (440 Hz - نغمة الآلة)
                      </button>
                      <button
                        onClick={() => playFrequencyTone(1050)}
                        className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-xl text-xs font-black cursor-pointer shadow-xs"
                      >
                        🔔 حاد (1050 Hz - صفير الجرس)
                      </button>
                    </div>
                  </div>

                  {/* Animated Wave Indicator */}
                  <div className="w-36 h-28 bg-purple-950 rounded-2xl p-2 flex items-center justify-center gap-1 overflow-hidden shadow-inner shrink-0">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: activeFrequency ? [12, 45 + (i % 3) * 15, 12] : 14
                        }}
                        transition={{ repeat: Infinity, duration: 0.25 + i * 0.05 }}
                        className="w-2 rounded-full bg-gradient-to-t from-pink-400 to-purple-300"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Experiment Smell: Odor particles in air */}
              {selectedSense === 'smell' && (
                <div className="bg-white p-5 rounded-2xl border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-right space-y-2">
                    <h5 className="font-black text-sm text-amber-950">تجربة: انتشار جزيئات الرائحة في الهواء (Diffusion)</h5>
                    <p className="text-xs font-bold text-gray-600 max-w-md leading-relaxed">
                      الروائح هي جزيئات كيميائية مجهرية تطير وتنتشر في الهواء حتى تستقر على خلايا الأنف الحسية!
                    </p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-black">
                        🌸 عطر الورد: مهدئ ومبهج
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-900 rounded-xl text-xs font-black">
                        ⚠️ الدخان: إنذار مبكر بالخطر
                      </span>
                    </div>
                  </div>

                  <div className="w-36 h-28 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-center justify-center relative overflow-hidden shrink-0">
                    <span className="text-4xl">👃</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          x: [-40, 10],
                          y: [Math.sin(i) * 20, 0],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                        className="absolute w-2 h-2 rounded-full bg-amber-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Mini Experiment Taste: 5 Basic Tastes Map */}
              {selectedSense === 'taste' && (
                <div className="bg-white p-5 rounded-2xl border-2 border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-right space-y-2">
                    <h5 className="font-black text-sm text-rose-950">تجربة: خريطة المذاقات الخمسة على براعم التذوق</h5>
                    <p className="text-xs font-bold text-gray-600 max-w-md leading-relaxed">
                      اختر المذاق لتتعرف على نكهته الكيميائية والأطعمة التي تميزه:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'sweet', label: 'حلو 🍯', desc: 'العسل والسكر (مصدر طاقة سريع)' },
                        { id: 'salty', label: 'مالح 🧂', desc: 'الملح والجبن (معادن مهمة للجسم)' },
                        { id: 'sour', label: 'حامض 🍋', desc: 'الليمون (أحماض عضوية مفيدة)' },
                        { id: 'bitter', label: 'مر ☕', desc: 'القهوة المرة (تنبيه وقائي)' },
                        { id: 'umami', label: 'أومامي 🧀', desc: 'البروتينات والأطعمة الشهية' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTasteType(t.id as any)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                            selectedTasteType === t.id
                              ? 'bg-rose-500 text-white shadow'
                              : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-36 h-28 bg-rose-50 rounded-2xl border-2 border-rose-300 flex flex-col items-center justify-center p-2 text-center shrink-0">
                    <span className="text-3xl mb-1">👅</span>
                    <span className="text-[11px] font-black text-rose-900">
                      {selectedTasteType === 'sweet' && 'حلو: العسل والتمر'}
                      {selectedTasteType === 'salty' && 'مالح: ملح الطعام'}
                      {selectedTasteType === 'sour' && 'حامض: الليمون والخل'}
                      {selectedTasteType === 'bitter' && 'مر: الكاكاو الخام'}
                      {selectedTasteType === 'umami' && 'أومامي: الشوربة والجبن'}
                    </span>
                  </div>
                </div>
              )}

              {/* Mini Experiment Touch: Textures & Temperatures */}
              {selectedSense === 'touch' && (
                <div className="bg-white p-5 rounded-2xl border-2 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-right space-y-2">
                    <h5 className="font-black text-sm text-emerald-950">تجربة: مستقبلات الملمس والحرارة في الجلد</h5>
                    <p className="text-xs font-bold text-gray-600 max-w-md leading-relaxed">
                      اختر مادة لتشاهد كيف تصنفها مجسات أطراف الأصابع الفائقة:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'feather', label: 'ريشة ناعمة 🪶', type: 'مستقبلات اللمس الخفيف' },
                        { id: 'ice', label: 'مكعب ثلج 🧊', type: 'مستقبلات البرودة' },
                        { id: 'tea', label: 'شاي دافئ 🍵', type: 'مستقبلات الحرارة' },
                        { id: 'rock', label: 'حجر خشن 🪨', type: 'مستقبلات الضغط والخشونة' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTestedTexture(item.id as any)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-black cursor-pointer transition ${
                            testedTexture === item.id
                              ? 'bg-emerald-600 text-white shadow'
                              : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-36 h-28 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-col items-center justify-center p-2 text-center shrink-0">
                    <span className="text-3xl mb-1">✋</span>
                    <span className="text-[10px] font-black text-emerald-900">
                      {testedTexture === 'feather' && 'لمس ناعم جداً'}
                      {testedTexture === 'ice' && 'برودة منعشة!'}
                      {testedTexture === 'tea' && 'حرارة دافئة'}
                      {testedTexture === 'rock' && 'ضغط وملمس خشن'}
                    </span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: SENSORY SORTING & MATCHING CHALLENGE                              */}
      {/* ========================================================================= */}
      {activeTab === 'sorting' && (
        <div className="space-y-6">
          
          {!sortingCompleted ? (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-purple-400 shadow-[0_8px_0_0_#A855F7] space-y-6">
              
              {/* Challenge Header & Score */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-purple-100 text-purple-900 text-xs font-black px-3 py-1 rounded-full border border-purple-200">
                    تحدي فرز المثيرات والمواقف الحياتية 🎯
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-800 mt-1">
                    السؤال {sortingIdx + 1} من {SORTING_ITEMS.length}
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-2xl border border-purple-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-purple-900">{sortingScore} إجابات صحيحة</span>
                </div>
              </div>

              {/* Current Sorting Target Card */}
              <div className="p-8 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50 rounded-3xl border-3 border-purple-200 text-center space-y-4">
                <motion.div 
                  key={currentSortingItem.id}
                  initial={{ scale: 0.8, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-7xl mb-2 select-none inline-block drop-shadow-md"
                >
                  {currentSortingItem.emoji}
                </motion.div>
                
                <h4 className="text-xl sm:text-2xl font-black text-gray-900">
                  {currentSortingItem.item}
                </h4>
                
                <p className="text-sm sm:text-base font-bold text-purple-900 max-w-lg mx-auto">
                  {currentSortingItem.question}
                </p>
              </div>

              {/* 5 Senses Selection Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(Object.keys(SENSES_INFO) as SenseKey[]).map((key) => {
                  const sense = SENSES_INFO[key];
                  const isSelected = selectedSortingAnswer === key;
                  const isCorrect = isSelected && key === currentSortingItem.correctSense;
                  const isWrong = isSelected && key !== currentSortingItem.correctSense;

                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.04, y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleAnswerSorting(key)}
                      disabled={selectedSortingAnswer !== null}
                      className={`p-4 rounded-2xl border-3 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-lg scale-105'
                          : isWrong
                          ? 'border-red-500 bg-red-100 text-red-950 animate-wiggle'
                          : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-purple-300'
                      }`}
                    >
                      <span className="text-4xl select-none">{sense.emoji}</span>
                      <span className="text-xs font-black">{sense.name}</span>
                      <span className="text-[10px] font-bold text-gray-500">{sense.organ.split(' ')[0]}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback and Next Button */}
              {selectedSortingAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-purple-50 border-2 border-purple-300 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-black text-purple-950 leading-relaxed">
                      {sortingFeedback}
                    </p>
                  </div>

                  <button
                    onClick={handleNextSorting}
                    className="py-3 px-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition flex items-center gap-2 shrink-0"
                  >
                    <span>{sortingIdx < SORTING_ITEMS.length - 1 ? 'المثير التالي 🚀' : 'إنهاء التحدي 🏆'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

            </div>
          ) : (
            /* Sorting Completion Celebration Card */
            <div className="bg-white rounded-[36px] p-8 border-4 border-amber-400 shadow-2xl text-center space-y-4">
              <div className="text-7xl animate-bounce">🏆🎉✨</div>
              <h3 className="text-2xl sm:text-3xl font-black text-purple-900">
                ألف مبروك يا بطل الحواس الخمسة!
              </h3>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                لقد صنفت جميع المثيرات والمواقف الحياتية بدقة علمية مذهلة! كسبت 25 نجمة ذهبية تضاف لرصيدك.
              </p>
              <div className="inline-block bg-amber-100 text-amber-950 font-black px-4 py-2 rounded-xl text-base border border-amber-300">
                النتيجة النهائية: {sortingScore} / {SORTING_ITEMS.length} ⭐
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSortingIdx(0);
                    setSortingScore(0);
                    setSortingCompleted(false);
                    setSelectedSortingAnswer(null);
                    setSortingFeedback(null);
                  }}
                  className="py-3 px-8 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm rounded-2xl shadow-md cursor-pointer transition"
                >
                  إعادة التحدي 🔄
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: SCIENCE EXPERIMENTS SIMULATOR                                     */}
      {/* ========================================================================= */}
      {activeTab === 'experiments' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Exp 1: The Mystery Touch Box */}
          <div className="bg-white rounded-[32px] p-6 border-4 border-emerald-400 shadow-[0_8px_0_0_#10B981] space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-black mb-3">
                📦
              </div>
              <h4 className="text-base font-black text-gray-900">صندوق اللمس السري (The Mystery Touch Box)</h4>
              <p className="text-xs font-bold text-gray-600 mt-1 leading-relaxed">
                تخيل أنك مغمض العينين وتدخل يدك في الصندوق. حاسة اللمس وحدها تستطيع إخبارك بخصائص المادة بدون أن تراها!
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-[11px] font-black text-emerald-900 block">جرّب فحص المواد في الظلام:</span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
                <span className="bg-white p-2 rounded-xl shadow-xs">خشن شائك 🦔</span>
                <span className="bg-white p-2 rounded-xl shadow-xs">ناعم حريري 🧣</span>
                <span className="bg-white p-2 rounded-xl shadow-xs">صلب قاسي 🧱</span>
                <span className="bg-white p-2 rounded-xl shadow-xs">مطاطي مرن 🎈</span>
              </div>
            </div>

            <button
              onClick={() => speak('حاسة اللمس تحتوي على نهايات عصبية متنوعة تميز الصلابة، النعومة، الخشونة، والمرونة بدون الحاجة للنظر!')}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition"
            >
              استمع للملاحظة العلمية 🔊
            </button>
          </div>

          {/* Exp 2: Nose Pinched Tasting Lab */}
          <div className="bg-white rounded-[32px] p-6 border-4 border-rose-400 shadow-[0_8px_0_0_#F43F5E] space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center text-2xl font-black mb-3">
                👃🍎
              </div>
              <h4 className="text-base font-black text-gray-900">ترابط الشم والتذوق (Nose-Pinched Experiment)</h4>
              <p className="text-xs font-bold text-gray-600 mt-1 leading-relaxed">
                هل تعلم أنك إذا أغلقت أنفك وتذوقت قطعة تفاحة ثم قطعة بطاطس نيئة ستجد صعوبة بالغة في التمييز بينهما؟
              </p>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs font-bold text-rose-950 leading-relaxed">
              💡 <strong>السر العلمي:</strong> براعم اللسان تميز فقط المذاق البسيط (حلو أو مالح)، بينما الرائحة الصاعدة من الحلق إلى الأنف هي التي تمنحنا نكهة التفاح المميزة!
            </div>

            <button
              onClick={() => speak('الشم والتذوق يعملان كفريق واحد! ثمانون بالمئة من متعة نكهة الطعام تأتي من حاسة الشم!')}
              className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition"
            >
              استمع للملاحظة العلمية 🔊
            </button>
          </div>

          {/* Exp 3: Neural Highway to the Brain */}
          <div className="bg-white rounded-[32px] p-6 border-4 border-indigo-400 shadow-[0_8px_0_0_#6366F1] space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center text-2xl font-black mb-3">
                🧠⚡
              </div>
              <h4 className="text-base font-black text-gray-900">طريق الإشارات العصبية إلى الدماغ (Neural Highway)</h4>
              <p className="text-xs font-bold text-gray-600 mt-1 leading-relaxed">
                الحواس الخمس لا تفكر بنفسها! هي مجرد كاميرات وميكروفونات ومجسات، والدماغ هو المعالج الخارق الذي يفسر كل شيء!
              </p>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 space-y-2 text-xs font-black text-indigo-950">
              <div className="flex items-center gap-1.5">
                <span>1️⃣ العضو الحسي يلتقط المثير</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>2️⃣ نبضة عصبية بسرعة 400 كم/س</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>3️⃣ الدماغ يفهم ويعطي أمراً فورياً!</span>
              </div>
            </div>

            <button
              onClick={() => speak('الدماغ هو القائد الأعلى! يتلقى ملايين الإشارات من حواسك الخمس كل ثانية ويفسرها في أجزاء من الألف من الثانية!')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer transition"
            >
              استمع للملاحظة العلمية 🔊
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: FIVE SENSES CHAMPION QUIZ                                         */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          
          {!quizCompleted ? (
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-cyan-400 shadow-[0_8px_0_0_#06B6D4] space-y-6">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="bg-cyan-100 text-cyan-950 text-xs font-black px-3 py-1 rounded-full border border-cyan-200">
                    مسابقة عباقرة الحواس الخمسة 🏆
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-gray-800 mt-1">
                    السؤال {quizIdx + 1} من {QUIZ_QUESTIONS.length}
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-cyan-50 px-4 py-2 rounded-2xl border border-cyan-200">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-black text-cyan-950">{quizScore} نقاط</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 text-right">
                <h4 className="text-lg sm:text-xl font-black text-gray-900 leading-relaxed">
                  {currentQuiz.question}
                </h4>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = quizSelected === idx;
                  const isCorrect = isSelected && idx === currentQuiz.correctIdx;
                  const isWrong = isSelected && idx !== currentQuiz.correctIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={quizSelected !== null}
                      className={`p-4 rounded-2xl border-3 text-right font-black text-sm transition-all cursor-pointer flex items-center justify-between ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-100 text-emerald-950 shadow-md'
                          : isWrong
                          ? 'border-red-500 bg-red-100 text-red-950'
                          : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-cyan-300'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next button */}
              {quizSelected !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <p className="text-xs font-bold text-cyan-950 leading-relaxed text-right">
                    💡 <strong>التفسير العلمي:</strong> {currentQuiz.explanation}
                  </p>
                  <button
                    onClick={handleNextQuiz}
                    className="py-2.5 px-6 bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition shrink-0"
                  >
                    {quizIdx < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي 👈' : 'عرض النتيجة 🏆'}
                  </button>
                </motion.div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-[36px] p-8 border-4 border-amber-400 shadow-2xl text-center space-y-4">
              <div className="text-7xl animate-bounce">🎖️🧠🌟</div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                شهادة بطل الحواس الخمسة والعلوم!
              </h3>
              <p className="text-sm font-bold text-gray-600 max-w-md mx-auto">
                أنت الآن عالم صغير يفهم أعضاء الاستشعار وكيف تعمل حواسك الخمس بدقة متناهية!
              </p>
              <div className="inline-block bg-amber-100 text-amber-950 font-black px-5 py-2.5 rounded-2xl text-lg border-2 border-amber-300">
                النتيجة: {quizScore} / {QUIZ_QUESTIONS.length} (ربحت 30 نجمة ⭐)
              </div>
              <div className="pt-3">
                <button
                  onClick={() => {
                    setQuizIdx(0);
                    setQuizScore(0);
                    setQuizSelected(null);
                    setQuizCompleted(false);
                  }}
                  className="py-3 px-8 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm rounded-2xl shadow-md cursor-pointer transition"
                >
                  إعادة المسابقة 🔄
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
