/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, MapPin, Sparkles, Volume2, Award, Info, Heart } from 'lucide-react';

interface SudanExploreProps {
  addStars: (amount: number) => void;
}

export default function SudanExplore({ addStars }: SudanExploreProps) {
  const [selectedCategory, setSelectedCategory] = useState<'landmarks' | 'tools'>('landmarks');
  const [selectedItemId, setSelectedItemId] = useState('pyramids');
  const [answeredQuizList, setAnsweredQuizList] = useState<string[]>([]);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Sudan Historical & Geographical Landmarks
  const landmarks = [
    {
      id: 'pyramids',
      name: 'أهرامات مروي (البجراوية) ⛰️',
      location: 'ولاية نهر النيل',
      emoji: '⛰️',
      summary: 'مدافن ملكية قديمة لملوك وملكات مملكة كوش العظيمة. هل تعلم أن السودان يحتوي على أكثر من 220 هرماً، وهو عدد يفوق أهرامات مصر؟ 🇸🇩✨',
      details: 'بنيت هذه الأهرامات بنسب مدببة رائعة قبل آلاف السنين لتخليد ملوك مملكة مروي القديمة، وتعتبر من أهم مواقع التراث العالمي لليونسكو في السودان وأفريقيا.',
      quiz: {
        question: 'أي مملكة سودانية قديمة بنيت أهرامات البجراوية لتكون مدافن لملوكها؟',
        options: ['مملكة كوش المروية', 'مملكة ليديا', 'مملكة الأنباط'],
        correct: 'مملكة كوش المروية',
        reward: 15
      }
    },
    {
      id: 'niles',
      name: 'ملتقى النيلين (مقرن النيلين) 🌊',
      location: 'الخرطوم',
      emoji: '🌊',
      summary: 'هنا يلتقي النيل الأزرق القادم من هضبة الحبشة بالنيل الأبيض القادم من بحيرة فيكتوريا، ليتعانقا ويشكلا نهر النيل أطول أنهار العالم! 💙🤍',
      details: 'النيل الأزرق يتميز بقوة تدفقه ولونه الطيني الداكن، بينما النيل الأبيض يجري بهدوء بمياه صافية هادئة. مشهد المقرن في الخرطوم فريد ويسحر الأبصار.',
      quiz: {
        question: 'أين يلتقي النيل الأزرق بالنيل الأبيض ليشكلان نهر النيل العظيم؟',
        options: ['في مدينة بورتسودان', 'في مدينة الخرطوم (المقرن)', 'في مدينة دنقلا'],
        correct: 'في مدينة الخرطوم (المقرن)',
        reward: 15
      }
    },
    {
      id: 'jebel_marra',
      name: 'جبل مرة الأخضر ⛰️🌲',
      location: 'دارفور (غرب السودان)',
      emoji: '🌲',
      summary: 'منطقة بركانية خضراء خلابة تتميز بطقسها المعتدل البارد طوال العام، وبها شلالات مياه عذبة وبساتين فواكه غنية مثل التفاح والبرتقال 🍏🍊!',
      details: 'يرتفع جبل مرة حوالي 3000 متر فوق سطح البحر، وتغطي منحدراته غابات من الصنوبر والعرعر ومزارع مدرجة غنية تنتج أشهى ثمار الفاكهة في السودان.',
      quiz: {
        question: 'في أي إقليم من أقاليم السودان يقع جبل مرة ذو الطبيعة البركانية الخضراء والشلالات؟',
        options: ['إقليم دارفور العريق', 'الإقليم الشرقي', 'إقليم النيل الأزرق'],
        correct: 'إقليم دارفور العريق',
        reward: 15
      }
    },
    {
      id: 'dinder',
      name: 'محمية الدندر الطبيعية 🐆🌳',
      location: 'ولاية سنار (شرق السودان)',
      emoji: '🐆',
      summary: 'أكبر وأعرق محمية طبيعية للحياة البرية في شرق إفريقيا، تحتوي على غابات شاسعة وبحيرات عذبة ومئات الأنواع من الحيوانات النادرة كالغزلان والفهود! 🦌🦁',
      details: 'تأسست محمية الدندر عام 1935، وتمر بها هجرات الطيور والحيوانات البرية من مختلف أنحاء العالم، وتعتبر كنزاً بيئياً مذهلاً يوضح تنوع وجمال البيئة السودانية الساحرة.',
      quiz: {
        question: 'ما هي أهمية محمية الدندر في السودان؟',
        options: ['مصنع للسيارات الحديثة', 'أكبر محمية طبيعية للحياة البرية والغابات', 'مركز لعلوم الفضاء والنجوم'],
        correct: 'أكبر محمية طبيعية للحياة البرية والغابات',
        reward: 15
      }
    },
    {
      id: 'portsudan',
      name: 'بحر بورتسودان المرجاني 🐠🌊',
      location: 'ولاية البحر الأحمر',
      emoji: '🐠',
      summary: 'أجمل شواطئ البحر الأحمر النقية، المشهورة بأعجب الشعب المرجانية الملونة في العالم، وهي مقصد للغواصين وموطن للدلافين والأسماك النادرة! 🐬🐙',
      details: 'تتميز مياه البحر الأحمر السودانية بنقائها الشديد ومحافظتها على طبيعتها العذراء البعيدة عن التلوث، وبها جزيرة سنقنيب ومنارة سواكن الشهيرة.',
      quiz: {
        question: 'ما الذي يشتهر به بحر بورتسودان الساحر عالمياً؟',
        options: ['الشعاب المرجانية الملونة والنقية وحياة البحر العذراء', 'كثرة الثلوج والجليد المتراكم', 'صناعة القوارب الورقية'],
        correct: 'الشعاب المرجانية الملونة والنقية وحياة البحر العذراء',
        reward: 15
      }
    },
    {
      id: 'suakin',
      name: 'سواكن التاريخية (بوابة الشرق) 🏰🌊',
      location: 'ولاية البحر الأحمر',
      emoji: '🏰',
      summary: 'مدينة تاريخية أثرية بنيت منازلها وقصورها قديماً من الحجارة المرجانية الفريدة، وكانت من أكبر موانئ إفريقيا على البحر الأحمر! 🗺️✨',
      details: 'سواكن تحكي تاريخاً مجيداً من التجارة والتواصل مع العالم الخارجي، وتتميز بفنها المعماري المرجاني البديع وأبوابها المزخرفة التي تجذب المستكشفين.',
      quiz: {
        question: 'من أي مادة طبيعية مميزة بنيت مباني جزيرة سواكن التاريخية في شرق السودان؟',
        options: ['الحجارة المرجانية البحرية', 'الطوب الأحمر الحديث', 'أوراق البردي والأعشاب'],
        correct: 'الحجارة المرجانية البحرية',
        reward: 15
      }
    },
    {
      id: 'kerma',
      name: 'حضارة كرمة العريقة (الدفوفة) 🏺🧱',
      location: 'الولاية الشمالية',
      emoji: '🧱',
      summary: 'من أقدم وأعظم الحضارات الإنسانية في إفريقيا والعالم، وتشتهر بـ "الدفوفة" وهي صروح طينية ضخمة جداً بناها أجدادنا منذ آلاف السنين! 🏛️🇸🇩',
      details: 'الدفوفة الشرقية والغربية هما أكبر الصروح المصنوعة من الطين اللبن في وادي النيل، وتجسدان عبقرية العمارة السودانية النوبية القديمة التي ازدهرت قبل أكثر من 4000 عام.',
      quiz: {
        question: 'ما هي "الدفوفة" الشهيرة التي تميز حضارة كرمة في شمال السودان؟',
        options: ['صروح دينية وإدارية ضخمة مبنية من الطين اللبن والآجر', 'أنفاق تحت الماء للغوص', 'جبال ثلجية تسقط شتاءً'],
        correct: 'صروح دينية وإدارية ضخمة مبنية من الطين اللبن والآجر',
        reward: 15
      }
    }
  ];

  // Sudan Traditional tools (الادوات التراثية السودانية المستعملة)
  const tools = [
    {
      id: 'jabana',
      name: 'الجبنة السودانية التقليدية ☕🏺',
      usage: 'صنع وتقديم القهوة التقليدية المبهجة بالزنجبيل والمستكة',
      emoji: '🏺',
      summary: 'وعاء طيني أسود فخاري ذو عنق طويل وقاعدة دائرية، يستخدم لتحضير القهوة السودانية اللذيذة على الجمر وتقديمها بعبق الكرم السوداني الأصيل.',
      details: 'تعتبر الجبنة رمزاً لجمع شمل الأسرة والترحيب بالضيوف في جلسات القهوة المسائية والصباحية (الونسة)، وتزين بالشرق والخرز الملون والخرتاية المنسوجة بالجلد وسعف النخيل.',
      quiz: {
        question: 'من أي مادة تصنع وعاء "الجبنة" السودانية التقليدية التي يغلي فيها البن؟',
        options: ['من الفخار (الطين المحروق)', 'من البلاستيك', 'من الفولاذ والحديد'],
        correct: 'من الفخار (الطين المحروق)',
        reward: 15
      }
    },
    {
      id: 'angareb',
      name: 'العنقريب الأصيل 🪵🕸️',
      usage: 'سرير تقليدي مريح للنوم والجلوس في الساحات والمناسبات',
      emoji: '🪵',
      summary: 'سرير خشبي سوداني تقليدي، تصنع قوائمه وإطاره من الأخشاب القوية مثل الحراز أو السيال، وينسج وسطه بحبال قوية من السعف أو خيوط الجلد المتينة.',
      details: 'العنقريب هو رفيق كل بيت سوداني، يوضع في فناء الدار والديوان، ويمتاز بتهويته الممتازة في ليالي الصيف الحارة وصموده لسنوات طويلة وهو مظهر من مظاهر التراث والهيبة.',
      quiz: {
        question: 'بماذا ينسج وسط سرير "العنقريب" التقليدي السوداني؟',
        options: ['بحبال السعف أو خيوط الجلد المتينة', 'بشرائح المعدن', 'بخيوط الصوف والقطن الناعم'],
        correct: 'بحبال السعف أو خيوط الجلد المتينة',
        reward: 15
      }
    },
    {
      id: 'zeer',
      name: 'الزير الفخاري المبرد 🏺💧',
      usage: 'حفظ وتبريد مياه الشرب وتصفيتها طبيعياً',
      emoji: '🏺',
      summary: 'إناء فخاري كبير الحجم، يوضع على حامل خشبي أو حديدي، يُسهم في تبريد ماء النيل الشرب طبيعياً وتصفيته عبر مسامات الطين العجيبة.',
      details: 'الزير هو ثلاجة السودان الطبيعية العريقة، يوضع دوماً تحت ظلال الأشجار أو في مداخل المنازل (المشربيات)، والماء بداخله يصبح بارداً ولذيذاً وصحياً جداً.',
      quiz: {
        question: 'كيف يقوم "الزير" التقليدي بتبريد مياه الشرب طبيعياً دون كهرباء؟',
        options: ['بتبخر قطرات الماء عبر مسامات جدار الطين الفخاري', 'بوضع ثلج مخفي داخله', 'بإضافة تيار هواء ميكانيكي'],
        correct: 'بتبخر قطرات الماء عبر مسامات جدار الطين الفخاري',
        reward: 15
      }
    },
    {
      id: 'mishlaeeb',
      name: 'المشلعيب المعلق 🕸️🥛',
      usage: 'حفظ الحليب والأطعمة بعيداً عن الأرض والقطط والحشرات',
      emoji: '🕸️',
      summary: 'شبكة من خيوط الليف أو السعف المنسوجة بذكاء، يعلق بها وعاء الحليب أو اللبن الرايب في سقف المطبخ أو الغرفة لتوفير التهوية الباردة الطبيعية وحمايتها.',
      details: 'قبل اختراع الثلاجات، كان المشلعيب هو الطريقة الذكية لحفظ مشتقات الحليب واللحوم الجافة (الشرموط) معلقة في الهواء الطلق بعيداً عن متناول الحيوانات الأليفة والزواحف.',
      quiz: {
        question: 'ما هي الوظيفة الأساسية لأداة "المشلعيب" التراثية في المنزل السوداني القديم؟',
        options: ['حفظ وتبريد الحليب والأطعمة بتعليقها في السقف والتهوية', 'فرز الحبوب من القشور', 'إشعال نار الموقد'],
        correct: 'حفظ وتبريد الحليب والأطعمة بتعليقها في السقف والتهوية',
        reward: 15
      }
    },
    {
      id: 'habbaba',
      name: 'الهبابة (الهواية) 🪭🌾',
      usage: 'توليد الهواء البارد وتلطيف الجو باليد عند انقطاع الكهرباء والحر',
      emoji: '🪭',
      summary: 'مروحة يدوية مستطيلة أو دائرية صغيرة منسوجة يدوياً بألوان زاهية من سعف النخيل وأوراق الدوم، تستعمل لتلطيف الهواء بذكاء وسهولة.',
      details: 'الهبابة قطعة فنية وتراثية خفيفة الوزن، تزين بنقوش ملونة متداخلة مأخوذة من التراث النوبي، وتعتبر تحفة يدوية يحملها الأهل للراحة والترطيب والزينة.',
      quiz: {
        question: 'من أي مادة طبيعية تنسج "الهبابة" أو المروحة اليدوية السودانية؟',
        options: ['من سعف النخيل وأوراق الدوم', 'من البلاستيك المقوى', 'من ريش الطيور المستورد'],
        correct: 'من سعف النخيل وأوراق الدوم',
        reward: 15
      }
    },
    {
      id: 'mifraka',
      name: 'المفراكة الخشبية 🪵🍲',
      usage: 'فرك وخلط الملاح والأطعمة السودانية الشهيرة مثل ملاح الويكة',
      emoji: '🪵',
      summary: 'أداة خشبية أسطوانية تنتهي بقطعة عرضية على شكل صليب، تُفرك بها الأطعمة يدوياً لتجانسها وصنع أشهى أنواع الملاح السوداني! 🍲✨',
      details: 'المفراكة هي سيدة المطبخ السوداني التقليدي، تصنع يدوياً من فروع أشجار السنط أو الليمون القوية، وتُستخدم بحركة دائرية سريعة باليدين لفرك البامية الجافة واللحوم المفرومة حتى تتماسك.',
      quiz: {
        question: 'ما هو الطعام السوداني الشهير الذي يُستخدم مع أداة "المفراكة" لخلطه وفركه؟',
        options: ['ملاح الويكة والبامية', 'عصير الليمون بالنعناع', 'الأرز باللبن والمكسرات'],
        correct: 'ملاح الويكة والبامية',
        reward: 15
      }
    },
    {
      id: 'murhaka',
      name: 'المرحاكة والمحقان 🌾🗿',
      usage: 'طحن الحبوب والذرة قديماً لصنع الكسرة والعصيدة السودانية',
      emoji: '🗿',
      summary: 'حجر مسطح كبير توضع عليه الحبوب، ويُفرك بحجر أصغر يدوياً حتى تتحول الحبوب إلى دقيق ناعم قبل ظهور المطاحن الحديثة! 🌾💪',
      details: 'المرحاكة تمثل رمز الكفاح والصبر للمرأة السودانية قديماً، حيث كانت تطحن الحبوب يومياً لإطعام الأسرة أشهى لقمة عصيدة وكسرة دافئة بنكهة الكرم والجهد الأصيل.',
      quiz: {
        question: 'ما الذي يتم طحنه وصناعته باستخدام "المرحاكة" الحجرية التراثية؟',
        options: ['طحن الحبوب والذرة لصنع الدقيق', 'تكسير الأخشاب للبناء', 'عصر ثمار البرتقال'],
        correct: 'طحن الحبوب والذرة لصنع الدقيق',
        reward: 15
      }
    }
  ];

  const currentItem = selectedCategory === 'landmarks' 
    ? landmarks.find(item => item.id === selectedItemId)
    : tools.find(item => item.id === selectedItemId);

  const pronounceText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (!currentItem) return;
    if (answeredQuizList.includes(currentItem.id)) return;

    if (option === currentItem.quiz.correct) {
      addStars(currentItem.quiz.reward);
      setAnsweredQuizList(prev => [...prev, currentItem.id]);
      setQuizFeedback(`إجابة صحيحة مذهلة ومتقنة! كسبت ${currentItem.quiz.reward} نجمة ذهبية في أكاديمية نقلة! ⭐🎉`);
      pronounceText("يا سلام عليك يا بطل! إجابة صحيحة ممتازة!");
    } else {
      setQuizFeedback('حاول مجدداً يا بطل، اقرأ التفاصيل بالأعلى وستعرف الحل بالتأكيد! ✨🔍');
      pronounceText("أوه! حاول مرة أخرى يا ذكي!");
    }
  };

  return (
    <div className="bg-[#FFF9F2] rounded-[32px] p-6 sm:p-8 border-4 border-[#E28743] shadow-[0_8px_0_0_#963E00]" id="sudan-explore-container">
      {/* Decorative Traditional Flag and Greetings Tag */}
      <div className="flex flex-wrap justify-between items-center mb-6 border-b-4 border-orange-100 pb-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#1DD1A1] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-green-700 shadow-sm animate-pulse">
              أكاديمية نقلة للأطفال
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#963E00] mt-1.5 flex items-center gap-2">
            استكشاف السودان وأدواته التراثية 🇸🇩🌴
          </h2>
          <p className="text-gray-600 font-bold text-sm mt-1">
            تعرّف على أهرامات ومعالم السودان الساحرة، والأدوات العريقة المستوحاة من طيبة وكرم الأهل في أكاديمية نقلة!
          </p>
        </div>

        {/* Traditional Greeting Bubble */}
        <div className="bg-amber-100/60 border-2 border-amber-300 rounded-2xl px-4 py-2 mt-3 md:mt-0 max-w-xs text-right">
          <p className="text-[#963E00] font-black text-xs flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> حبابكم عشرة بلا كشرة!
          </p>
          <p className="text-gray-500 text-[10px] font-bold mt-0.5">سمسم يرحب بكم بلمسة سودانية دافئة وطيبة أصيلة من أكاديمية نقلة.</p>
        </div>
      </div>

      {/* Selector: Landmarks vs Traditional Tools */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => {
            setSelectedCategory('landmarks');
            setSelectedItemId('pyramids');
            setQuizFeedback(null);
          }}
          className={`px-6 py-3 rounded-2xl text-base font-black transition-all border-4 cursor-pointer flex items-center gap-2 ${
            selectedCategory === 'landmarks'
              ? 'bg-[#E28743] border-[#963E00] text-white shadow-[0_4px_0_0_#963E00] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300'
          }`}
          id="cat-landmarks-btn"
        >
          <MapPin className="w-5 h-5 text-red-500 fill-red-200" /> معالم وتاريخ السودان ⛰️
        </button>
        <button
          onClick={() => {
            setSelectedCategory('tools');
            setSelectedItemId('jabana');
            setQuizFeedback(null);
          }}
          className={`px-6 py-3 rounded-2xl text-base font-black transition-all border-4 cursor-pointer flex items-center gap-2 ${
            selectedCategory === 'tools'
              ? 'bg-[#E28743] border-[#963E00] text-white shadow-[0_4px_0_0_#963E00] translate-y-[2px]'
              : 'bg-white border-gray-200 text-gray-700 shadow-[0_4px_0_0_#D1D1D1] hover:border-gray-300'
          }`}
          id="cat-tools-btn"
        >
          <BookOpen className="w-5 h-5 text-amber-500" /> الأدوات السودانية التراثية 🏺
        </button>
      </div>

      {/* Grid: Shelf items left, detail presentation right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left list (List of items in selected category) */}
        <div className="space-y-3 bg-white p-4 rounded-[24px] border-4 border-[#F3D7C1] max-h-[450px] overflow-y-auto shadow-inner">
          <p className="text-[11px] text-[#963E00] font-black mb-1">اختر بنداً للاستكشاف والتعلم:</p>
          {(selectedCategory === 'landmarks' ? landmarks : tools).map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedItemId(item.id);
                setQuizFeedback(null);
                pronounceText(`أنت تستكشف الآن: ${item.name}`);
              }}
              className={`w-full p-3.5 rounded-xl border-3 text-right transition flex items-center justify-between cursor-pointer ${
                selectedItemId === item.id
                  ? 'bg-amber-50 border-[#E28743] text-[#963E00] shadow-sm font-black'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50/30'
              }`}
              id={`explore-item-${item.id}`}
            >
              <div className="text-right">
                <span className="text-sm font-black">{item.name}</span>
                <p className="text-[10px] text-gray-400 font-bold">
                  {'location' in item ? `الموقع: ${item.location}` : `الاستخدام: ${item.usage}`}
                </p>
              </div>
              <span className="text-2xl select-none">{item.emoji}</span>
            </button>
          ))}
        </div>

        {/* Right Details Display Area */}
        <div className="lg:col-span-2 flex flex-col justify-between" id="details-panel">
          {currentItem && (
            <div className="bg-white p-6 rounded-[28px] border-4 border-[#E28743] shadow-[0_6px_0_0_#C56A25] flex flex-col justify-between min-h-[400px]">
              
              {/* Item Overview */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-orange-50 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl select-none">{currentItem.emoji}</span>
                    <div className="text-right">
                      <h3 className="text-xl font-black text-[#963E00]">{currentItem.name}</h3>
                      <p className="text-xs text-gray-400 font-bold">
                        {'location' in currentItem ? `📍 ${currentItem.location}` : `🛠️ غرض الاستخدام: ${currentItem.usage}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => pronounceText(currentItem.summary + ' ' + currentItem.details)}
                    className="p-2.5 bg-orange-50 hover:bg-orange-100 text-[#963E00] border-2 border-[#E28743] rounded-xl shadow-sm transition cursor-pointer"
                    title="استمع إلى الشرح بصوت سمسم"
                    id="speak-summary-btn"
                  >
                    <Volume2 className="w-5 h-5 animate-pulse" />
                  </button>
                </div>

                <div className="space-y-4 text-right">
                  <div className="bg-orange-50/50 border-r-4 border-[#E28743] p-3.5 rounded-xl">
                    <p className="text-[#963E00] font-black text-xs flex items-center gap-1 mb-1">
                      <Info className="w-3.5 h-3.5" /> نبذة سريعة ومعلومة مفيدة:
                    </p>
                    <p className="text-gray-700 font-bold text-sm leading-relaxed">
                      {currentItem.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-black text-xs text-gray-500 mb-1">تفاصيل تاريخية وثقافية:</h4>
                    <p className="text-gray-600 font-medium text-xs leading-relaxed">
                      {currentItem.details}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Quiz for Stars */}
              <div className="mt-6 border-t-4 border-dashed border-orange-100 pt-4">
                <div className="bg-[#FFFDF9] border-2 border-amber-300 rounded-2xl p-4">
                  <h4 className="font-black text-sm text-[#963E00] flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4 text-amber-500 fill-amber-200" /> اختبر معلوماتك واكسب 15 نجمة! ⭐
                  </h4>
                  <p className="text-xs text-gray-700 font-black mb-3">
                    {currentItem.quiz.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentItem.quiz.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(opt)}
                        disabled={answeredQuizList.includes(currentItem.id)}
                        className={`p-2.5 rounded-xl border-2 text-xs font-black transition text-center cursor-pointer ${
                          answeredQuizList.includes(currentItem.id)
                            ? opt === currentItem.quiz.correct
                              ? 'bg-[#1DD1A1] border-green-600 text-white shadow-none'
                              : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-[#E28743]'
                        }`}
                        id={`quiz-option-${currentItem.id}-${i}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Feedback overlay */}
                  <AnimatePresence>
                    {quizFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 text-xs font-black text-[#963E00] bg-orange-50 p-2 rounded-lg border border-orange-200 text-center"
                      >
                        {quizFeedback}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {answeredQuizList.includes(currentItem.id) && !quizFeedback && (
                    <p className="text-[10px] text-green-600 font-black text-center mt-2">
                      🎉 أحسنت! لقد حللت هذا السؤال بنجاح وححصلت على النجوم!
                    </p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
