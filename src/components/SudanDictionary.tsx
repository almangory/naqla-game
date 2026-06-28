/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Award, 
  Sparkles, 
  Languages, 
  Heart, 
  HelpCircle, 
  Trophy, 
  Compass, 
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

interface SudanDictionaryProps {
  addStars: (amount: number) => void;
  onBackToMain?: () => void; // Support back navigation inside app
}

interface DictionaryItem {
  id: string;
  arabic: string;
  english: string;
  phonetic: string;
  category: 'nature' | 'heritage' | 'food';
  emoji: string;
  descriptionAr: string;
  descriptionEn: string;
  fact: string;
}

export default function SudanDictionary({ addStars, onBackToMain }: SudanDictionaryProps) {
  const dictionaryItems: DictionaryItem[] = [
    {
      id: 'tebaldi',
      arabic: 'شجرة التبلدي',
      english: 'Baobab Tree',
      phonetic: '/ˈbeɪoʊbæb triː/',
      category: 'nature',
      emoji: '🌳',
      descriptionAr: 'شجرة ضخمة جداً ومشهورة في غرب السودان (كردفان)، تمتاز بجذعها العريض جداً الذي يخزن كميات هائلة من المياه العذبة طبيعياً لفصل الجفاف.',
      descriptionEn: 'A massive, iconic tree in western Sudan (Kordofan) with a giant hollow trunk that stores fresh water naturally for the dry season.',
      fact: 'هل تعلم أن شجرة التبلدي تسمى أيضاً "شجرة القارورة" وتعيش لآلاف السنين وتعتبر من أصدقاء الإنسان والحيوانات في الصحراء؟ 💧🐘'
    },
    {
      id: 'pyramids',
      arabic: 'أهرامات مروي',
      english: 'Nubian Pyramids',
      phonetic: '/ˈnuːbiən ˈpɪrəmɪdz/',
      category: 'heritage',
      emoji: '⛰️',
      descriptionAr: 'المدافن الملكية لملوك وملكات مملكة كوش العظيمة بالبجراوية، وهي أهرامات مدببة الشكل بنيت بأيدي أجدادنا الفراعنة السودانيين قبل آلاف السنين.',
      descriptionEn: 'The royal burial tombs of the kings and queens of the ancient Kushite Kingdom in Meroe, built with beautiful steep angles.',
      fact: 'هل تعلم أن السودان يضم أكثر من 220 هرماً أثرياً، وهو أكبر عدد للأهرامات في بلد واحد على وجه الأرض! 🇸🇩✨'
    },
    {
      id: 'mogran',
      arabic: 'مقرن النيلين',
      english: 'Nile Confluence',
      phonetic: '/naɪl ˈkɒnfluəns/',
      category: 'nature',
      emoji: '🌊',
      descriptionAr: 'النقطة الساحرة في مدينة الخرطوم حيث يلتقي النيل الأزرق القوي القادم من إثيوبيا، بالنيل الأبيض الهادئ القادم من وسط إفريقيا، ليشكلان معاً نهر النيل.',
      descriptionEn: 'The beautiful meeting point of the powerful Blue Nile and the peaceful White Nile in Khartoum, merging to form the great River Nile.',
      fact: 'هل تعلم أن مياه النيلين تجري متجاورة لمسافة قبل أن تختلط تماماً، مما يظهر بوضوح خطاً طبيعياً رائعاً يفصل بين اللون الطيني والأزرق الصافي! 💙🤍'
    },
    {
      id: 'kisra',
      arabic: 'الكسرة السودانية',
      english: 'Kisra Bread',
      phonetic: '/ˈkɪsrə brɛd/',
      category: 'food',
      emoji: '🫓',
      descriptionAr: 'رقاق شهي ومخمر يُصنع بمهارة فائقة على صاج حديدي ساخن يسمى "الدوكة" باستخدام عجين الذرة، ويؤكل مع أنواع الملاح الشهية.',
      descriptionEn: 'Thin, delicious fermented flatbread made from sorghum flour, baked expertly on a hot metal plate called "Dooka".',
      fact: 'تعتبر الكسرة الطبق الشعبي الأسرع والأكثر مهارة في الطهي، حيث تفردها الأمهات في ثوانٍ معدودة باستخدام قطعة سعف صغيرة! 🌾🔥'
    },
    {
      id: 'camel',
      arabic: 'الجمل البشاري',
      english: 'Bishari Camel',
      phonetic: '/ˈbɪʃəri ˈkæməl/',
      category: 'nature',
      emoji: '🐪',
      descriptionAr: 'حيوان قوي وصبور يعيش في شرق السودان، يتميز برشقته وسرعته العالية في السباقات وطيبته وصبره الطويل في الصحاري.',
      descriptionEn: 'A strong and graceful camel bred in eastern Sudan, famous for its speed, beauty, and incredible endurance in the desert.',
      fact: 'تعتبر سباقات الهجن (الجمال) في شرق السودان وبطول ساحل البحر الأحمر من أجمل الفعاليات التراثية التي تجذب المتفرجين من كل مكان! 🏁🐪'
    },
    {
      id: 'doum',
      arabic: 'نخلة الدوم',
      english: 'Doum Palm',
      phonetic: '/duːm pɑːm/',
      category: 'nature',
      emoji: '🌴',
      descriptionAr: 'نوع فريد من النخيل يتفرع جذعه إلى عدة فروع، ينمو بكثرة في غرب وشرق السودان، وثمرته صلبة وبنية ذات طعم حلو ومميز ومفيد جداً.',
      descriptionEn: 'A unique branching palm tree native to Sudan, producing hard, dark orange-brown sweet fruits with therapeutic health benefits.',
      fact: 'هل تعلم أن أجدادنا النوبيين القدماء كانوا يقدسون شجرة الدوم، وتصنع من سعفها وسلالها الملونة أجمل التحف اليدوية التقليدية؟ 🧺✨'
    },
    {
      id: 'zeer',
      arabic: 'الزير الفخاري',
      english: 'Clay Water Pot',
      phonetic: '/kleɪ ˈwɔːtər pɒt/',
      category: 'heritage',
      emoji: '🏺',
      descriptionAr: 'وعاء كبير ومستدير مصنوع من الطين النيلي الفخاري، يوضع في مكان مظلل لتبريد مياه النيل طبيعياً وتنقيتها عبر مسامات الطين الصديقة للبيئة.',
      descriptionEn: 'A large, porous clay vessel handmade of Nile clay, placed in shaded areas to naturally cool and filter drinking water.',
      fact: 'الزير يمثل رمزاً للكرم في السودان، حيث تضعه البيوت في الشوارع ممتلئاً بالماء البارد واللذيذ ليرتوي منه كل عابر سبيل مجاناً! 🏺💧'
    },
    {
      id: 'angareb',
      arabic: 'العنقريب الأصيل',
      english: 'Angareb Bed',
      phonetic: '/ˈæŋɡərɛb bɛd/',
      category: 'heritage',
      emoji: '🪵',
      descriptionAr: 'سرير خشبي تقليدي متين يُصنع من فروع الأشجار القوية، ويُنسج وسطه بمهارة فائقة باستخدام حبال السعف أو خيوط الجلد الطبيعي المريحة.',
      descriptionEn: 'A traditional Sudanese bed crafted from strong wood and woven with rope or natural leather, offering comfortable cool air flow.',
      fact: 'العنقريب صديق الصيف السوداني! بفضل فتحاته الصغيرة المنسوجة، يوفر تهوية باردة مذهلة أثناء النوم تحت النجوم في الساحة! ✨🌌'
    },
    {
      id: 'qumriya',
      arabic: 'طائر القمري',
      english: 'Turtle Dove',
      phonetic: '/ˈtɜːrtl dʌv/',
      category: 'nature',
      emoji: '🕊️',
      descriptionAr: 'طائر بري لطيف يملأ الصباح الباكر في قرى ومدن السودان بألحان وتغريدات هادئة تريح النفوس وتغنى بها الشعراء في السودان.',
      descriptionEn: 'A sweet wild dove that fills Sudanese mornings with soft, melodic cooing sounds, celebrated as a symbol of peace and home.',
      fact: 'طائر القمري يحب شرب مياه النيل العذبة، ويبني أعشاشه البسيطة فوق أغصان أشجار النيم والسيال الظليلة ليرعى صغاره بأمان! 🕊️🌳'
    },
    {
      id: 'asida',
      arabic: 'العصيدة السودانية',
      english: 'Asida Porridge',
      phonetic: '/əˈsiːdə ˈpɒrɪdʒ/',
      category: 'food',
      emoji: '🥣',
      descriptionAr: 'طبق تقليدي ساخن ومغذي جداً يصنع من دقيق الذرة أو الدخن، يقدم مع "ملاح الويكة" أو اللحم المجفف المفروم في الصباح والأعياد.',
      descriptionEn: 'A thick, traditional porridge made from sorghum or millet flour, served with savory dried okra stew or minced meat broth.',
      fact: 'العصيدة هي الطبق السحري الذي يجمع الصائمين في السودان في مائدة إفطار رمضان في الشارع كصورة للتضامن والترابط الاجتماعي البديع! 🥣🌙'
    },
    {
      id: 'jabana',
      arabic: 'الجبنة الفخارية',
      english: 'Clay Coffee Pot',
      phonetic: '/kleɪ ˈkɒfi pɒt/',
      category: 'heritage',
      emoji: '☕',
      descriptionAr: 'وعاء طيني فخاري سوداني كروي ذو عنق رفيع مزين، يُغلى فيه البن الطازج مع الزنجبيل الحار والهيل على الجمر ليفوح عبق الكرم.',
      descriptionEn: 'A beautifully adorned clay pot used to brew authentic Sudanese coffee with spicy ginger and aromatic cardamom on coal.',
      fact: 'عند تقديم قهوة الجبنة في البيوت السودانية، يُشعل اللبان (البخور) وتوزع الفشار والتمر لتكتمل الونسة والبهجة والترحيب بالضيوف! ☕🕯️'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'nature' | 'heritage' | 'food'>('all');
  const [selectedItem, setSelectedItem] = useState<DictionaryItem | null>(dictionaryItems[0]);

  // Quiz States (Interactive game)
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<string>('');

  // Native Speech Synthesis
  const playSpeech = (text: string, lang: 'ar-SA' | 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = lang === 'en-US' ? 0.9 : 0.85; // slightly slower for kids
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredItems = dictionaryItems.filter(item => {
    const matchesSearch = 
      item.arabic.includes(searchQuery) || 
      item.english.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.descriptionAr.includes(searchQuery);
    
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Start the Game
  const startQuiz = () => {
    setQuizMode(true);
    setQuizScore(0);
    setQuizAnswered(false);
    setSelectedAnswer(null);
    setQuizFeedback('');
    generateQuizQuestion(0);
  };

  const generateQuizQuestion = (index: number) => {
    const item = dictionaryItems[index];
    if (!item) return;

    // Get correct answer (either Arabic or English, let's ask for the English name)
    const correctAnswer = item.english;
    
    // Get wrong options
    const otherAnswers = dictionaryItems
      .filter(x => x.id !== item.id)
      .map(x => x.english);
    
    // Shuffle and pick 2 wrong options + correct
    const shuffledWrong = otherAnswers.sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correctAnswer, ...shuffledWrong].sort(() => Math.random() - 0.5);
    
    setShuffledOptions(options);
    setQuizAnswered(false);
    setSelectedAnswer(null);
    setQuizFeedback('');
  };

  const handleAnswerClick = (answer: string) => {
    if (quizAnswered) return;
    setSelectedAnswer(answer);
    setQuizAnswered(true);

    const currentItem = dictionaryItems[currentQuizIndex];
    if (answer === currentItem.english) {
      setQuizScore(prev => prev + 1);
      setQuizFeedback(`إجابة رائعة وصحيحة! بطل حقيقي! 🌟 ${currentItem.arabic} باللغة الإنجليزية هي فعلاً: "${currentItem.english}"! 🎉`);
      addStars(10);
      playSpeech("رائع جداً!", 'ar-SA');
    } else {
      setQuizFeedback(`أوه! الإجابة الصحيحة لـ "${currentItem.arabic}" هي "${currentItem.english}". لا تقلق يا بطل، ستتعلمها وتفوز في السؤال القادم! 💪⭐`);
      playSpeech("حاول ثانية يا بطل", 'ar-SA');
    }
  };

  const nextQuizQuestion = () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < dictionaryItems.length) {
      setCurrentQuizIndex(nextIndex);
      generateQuizQuestion(nextIndex);
    } else {
      // Quiz ended
      setQuizFeedback(`أحسنت يا بطل! لقد أنهيت التحدي وحصلت على ${quizScore} من أصل ${dictionaryItems.length} نقاط ذهبية! واصل التعلم والاستكشاف! 🏆🇸🇩`);
    }
  };

  const restartQuizGame = () => {
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizAnswered(false);
    setSelectedAnswer(null);
    setQuizFeedback('');
    generateQuizQuestion(0);
  };

  return (
    <div className="bg-[#FFFDF4] rounded-[32px] p-5 sm:p-8 border-4 border-[#1DD1A1] shadow-[0_8px_0_0_#10AC84]" id="sudan-dictionary-container">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b-4 border-emerald-50 pb-4 gap-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#1DD1A1] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-green-700 shadow-sm animate-pulse">
              التعلم اللغوي المصور للأطفال
            </span>
            {onBackToMain && (
              <button 
                onClick={onBackToMain}
                className="mr-3 bg-white hover:bg-gray-100 text-[#10AC84] border-2 border-[#1DD1A1] px-3 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> رجوع للرئيسية
              </button>
            )}
          </div>
          <h2 className="text-3xl font-black text-[#10AC84] mt-2 flex items-center gap-2">
            📖 قاموس نقلة المصور لبيئة السودان 🫓🌴
          </h2>
          <p className="text-gray-600 font-bold text-sm mt-1">
            تعلم الكلمات العربية والإنجليزية ونطقها السليم، واكتشف نباتات وحيوانات وأدوات بيئتنا السودانية الأصيلة!
          </p>
        </div>

        {/* Buttons to switch between Dictionary and Interactive Game */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setQuizMode(false)}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border-3 font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 transition ${
              !quizMode 
                ? 'bg-[#1DD1A1] border-[#10AC84] text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="w-4 h-4" /> القاموس المصور
          </button>
          <button
            onClick={startQuiz}
            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border-3 font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 transition ${
              quizMode 
                ? 'bg-[#FFD93D] border-[#7A6A24] text-gray-800 shadow-sm animate-bounce'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-200" /> لعبة تخمين الكلمات
          </button>
        </div>
      </div>

      {!quizMode ? (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-4.5 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن كلمة بالعربية أو الإنجليزية... (مثال: تبلدي، Camel)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 pl-4 py-2.5 rounded-2xl border-3 border-gray-200 focus:border-[#1DD1A1] font-bold text-sm outline-none transition bg-white"
                id="dictionary-search-input"
              />
            </div>

            {/* CATEGORY FILTERS */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => { setActiveCategory('all'); setSelectedItem(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 shrink-0 transition cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#1DD1A1] border-[#10AC84] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                كل الكلمات ✨
              </button>
              <button
                onClick={() => { setActiveCategory('nature'); setSelectedItem(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 shrink-0 transition cursor-pointer ${
                  activeCategory === 'nature'
                    ? 'bg-emerald-500 border-emerald-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                🌳 طبيعة وحيوانات
              </button>
              <button
                onClick={() => { setActiveCategory('heritage'); setSelectedItem(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 shrink-0 transition cursor-pointer ${
                  activeCategory === 'heritage'
                    ? 'bg-amber-500 border-amber-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                🏺 أدوات وتراث
              </button>
              <button
                onClick={() => { setActiveCategory('food'); setSelectedItem(null); }}
                className={`px-4 py-2 rounded-xl text-xs font-black border-2 shrink-0 transition cursor-pointer ${
                  activeCategory === 'food'
                    ? 'bg-rose-500 border-rose-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                🫓 مأكولات شعبية
              </button>
            </div>
          </div>

          {/* MAIN LAYOUT: Grid of items left, Detail preview right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left list of cards (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-4 rounded-[24px] border-4 border-emerald-100 max-h-[480px] overflow-y-auto shadow-inner space-y-2">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-400 font-bold text-sm">لم نجد أي كلمة تطابق بحثك يا بطل!</p>
                  <p className="text-gray-400 text-xs mt-1">جرّب البحث بكلمة أخرى.</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      playSpeech(item.arabic, 'ar-SA');
                    }}
                    className={`w-full p-3 rounded-xl border-3 transition-all text-right flex items-center justify-between cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-emerald-50/70 border-[#1DD1A1] text-emerald-800 shadow-sm font-black scale-[0.99]'
                        : 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50'
                    }`}
                    id={`dict-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">{item.emoji}</span>
                      <div className="text-right">
                        <span className="text-base font-black text-gray-800 block">{item.arabic}</span>
                        <span className="text-xs font-mono font-bold text-gray-400">{item.english}</span>
                      </div>
                    </div>
                    <span className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-2 py-1 rounded-lg text-[10px] font-black">
                      تفاصيل 🔍
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Right details section (7 Cols) */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div
                    key={selectedItem.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="bg-white p-6 rounded-[28px] border-4 border-[#1DD1A1] shadow-[0_6px_0_0_#10AC84] flex flex-col justify-between min-h-[440px]"
                    id="dict-details-panel"
                  >
                    <div>
                      {/* Big Emoji and Pronunciations */}
                      <div className="flex items-center justify-between border-b-2 border-emerald-50 pb-4 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl sm:text-6xl select-none p-3 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100 shadow-inner">
                            {selectedItem.emoji}
                          </span>
                          <div className="text-right">
                            <h3 className="text-2xl font-black text-gray-800">{selectedItem.arabic}</h3>
                            <h4 className="text-xl font-bold text-[#10AC84] flex items-center gap-1.5 mt-0.5 font-mono">
                              {selectedItem.english}
                              <span className="text-xs text-gray-400 font-sans font-medium">{selectedItem.phonetic}</span>
                            </h4>
                          </div>
                        </div>

                        {/* Pronounce Buttons */}
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => playSpeech(selectedItem.arabic, 'ar-SA')}
                            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-2 border-emerald-300 rounded-xl shadow-sm text-xs font-black flex items-center gap-1 cursor-pointer"
                            title="نطق الكلمة بالعربية"
                          >
                            <Volume2 className="w-4 h-4" /> عربي
                          </button>
                          <button
                            onClick={() => playSpeech(selectedItem.english, 'en-US')}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-300 rounded-xl shadow-sm text-xs font-black flex items-center gap-1 cursor-pointer"
                            title="Pronounce in English"
                          >
                            <Volume2 className="w-4 h-4" /> English
                          </button>
                        </div>
                      </div>

                      {/* Bilingual Description Cards */}
                      <div className="space-y-4 text-right">
                        <div className="bg-emerald-50/40 p-4 rounded-xl border-r-4 border-emerald-400">
                          <p className="text-[11px] text-emerald-700 font-black mb-1 flex items-center gap-1">
                            <Languages className="w-3.5 h-3.5" /> الشرح باللغة العربية:
                          </p>
                          <p className="text-gray-700 font-bold text-sm sm:text-base leading-relaxed">
                            {selectedItem.descriptionAr}
                          </p>
                        </div>

                        <div className="bg-blue-50/20 p-4 rounded-xl border-l-4 border-blue-400 text-left font-sans" dir="ltr">
                          <p className="text-[11px] text-blue-600 font-black mb-1 flex items-center gap-1">
                            English Explanation:
                          </p>
                          <p className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed">
                            {selectedItem.descriptionEn}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Fun Sudanese environmental fact */}
                    <div className="mt-6 bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 text-right">
                      <p className="text-[#CC9300] font-black text-xs sm:text-sm flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-200 animate-spin" /> معلومة تراثية ممتعة من بيئتنا:
                      </p>
                      <p className="text-gray-700 font-bold text-xs sm:text-sm leading-relaxed">
                        {selectedItem.fact}
                      </p>
                    </div>

                  </motion.div>
                ) : (
                  <div className="bg-white p-12 rounded-[28px] border-4 border-dashed border-gray-200 flex flex-col items-center justify-center text-center h-full min-h-[440px]">
                    <Compass className="w-16 h-16 text-gray-300 mb-3 animate-spin" style={{ animationDuration: '8s' }} />
                    <p className="text-gray-500 font-black text-lg">استكشف كلمات بيئتنا السودانية!</p>
                    <p className="text-gray-400 text-sm mt-1 max-w-sm">
                      اضغط على أي كلمة من القائمة اليمين لقراءة الشرح والاستماع إلى النطق الصوتي باللغتين العربية والإنجليزية.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </>
      ) : (
        /* INTERACTIVE GAME SCREEN: Guessing Challenge */
        <div className="bg-white p-6 rounded-[28px] border-4 border-[#FFD93D] shadow-[0_6px_0_0_#D1B02B] min-h-[440px] flex flex-col justify-between">
          {currentQuizIndex < dictionaryItems.length ? (
            <>
              {/* Quiz progress header */}
              <div className="flex justify-between items-center border-b-2 border-gray-100 pb-3 mb-4">
                <span className="text-sm font-black text-[#7A6A24]">
                  السؤال {currentQuizIndex + 1} من {dictionaryItems.length}
                </span>
                <div className="flex items-center gap-1 bg-amber-100 text-[#7A6A24] px-3 py-1 rounded-full text-xs font-black">
                  <Award className="w-4 h-4" /> النقاط: {quizScore} ⭐
                </div>
              </div>

              {/* Quiz Core Content */}
              <div className="text-center py-6">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-8xl select-none mb-6 animate-pulse"
                >
                  {dictionaryItems[currentQuizIndex].emoji}
                </motion.div>

                <h3 className="text-2xl font-black text-gray-800 mb-2">
                  ما هو الاسم الإنجليزي الصحيح لـ: "{dictionaryItems[currentQuizIndex].arabic}"؟
                </h3>
                <p className="text-xs text-gray-400 font-bold mb-6">
                  تلميح: {dictionaryItems[currentQuizIndex].descriptionAr.substring(0, 70)}...
                </p>

                {/* Multiple choice options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
                  {shuffledOptions.map((opt, i) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrect = opt === dictionaryItems[currentQuizIndex].english;
                    
                    let btnStyle = 'bg-white border-gray-200 text-gray-700 hover:border-amber-400';
                    if (quizAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-none';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-500 border-rose-600 text-white shadow-none';
                      } else {
                        btnStyle = 'bg-gray-100 border-gray-200 text-gray-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerClick(opt)}
                        disabled={quizAnswered}
                        className={`p-4 rounded-2xl border-3 text-sm font-black font-mono transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback with speaking */}
                <AnimatePresence>
                  {quizFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 max-w-xl mx-auto"
                    >
                      <p className="text-gray-800 font-black text-xs sm:text-sm leading-relaxed">{quizFeedback}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation to next or end */}
              <div className="flex justify-end mt-4 border-t-2 border-gray-100 pt-4">
                {quizAnswered && (
                  <button
                    onClick={nextQuizQuestion}
                    className="px-6 py-2.5 bg-emerald-500 text-white font-black text-xs rounded-xl shadow-[0_4px_0_0_#3DA199] border-2 border-emerald-600 hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                  >
                    {currentQuizIndex + 1 === dictionaryItems.length ? 'عرض النتيجة النهائية 🏆' : 'السؤال التالي ➡️'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed screen */
            <div className="text-center py-12 flex flex-col items-center justify-center my-auto">
              <Trophy className="w-20 h-20 text-yellow-400 drop-shadow mb-4 animate-bounce" />
              <h3 className="text-3xl font-black text-gray-800">مبارك النجاح الباهر يا ذكي! 🎉🇸🇩</h3>
              <p className="text-gray-600 font-bold text-sm sm:text-base mt-2 max-w-lg">
                لقد أنجزت كامل اختبار وتحدي كلمات بيئة السودان الجميلة، وحصلت على مجموع نجوم مبهر في أكاديمية نقلة!
              </p>
              <div className="bg-amber-100 text-[#7A6A24] px-6 py-3 rounded-full text-base font-black mt-6 border-2 border-[#FFD93D] shadow-sm">
                مجموع نقاطك: {quizScore} من أصل {dictionaryItems.length} نقطة 🌟
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={restartQuizGame}
                  className="px-6 py-3 bg-[#FFD93D] text-gray-800 font-black text-xs rounded-xl shadow-[0_4px_0_0_#D1B02B] border-2 border-[#7A6A24] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                >
                  العب التحدي مجدداً 🔁
                </button>
                <button
                  onClick={() => setQuizMode(false)}
                  className="px-6 py-3 bg-[#1DD1A1] text-white font-black text-xs rounded-xl shadow-[0_4px_0_0_#10AC84] border-2 border-emerald-600 hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
                >
                  الرجوع للقاموس المصور 📖
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
