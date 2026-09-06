/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SenseItem {
  name: string;
  emoji: string;
  question: string;
  correctId: string;
  options: { id: string; emoji: string; label: string }[];
  explanation: string;
}

export interface AnimalDietItem {
  name: string;
  emoji: string;
  type: 'carnivore' | 'herbivore';
  foodEmoji: string;
  foodName: string;
  desc: string;
  fact: string;
}

export const FIVE_SENSES_DATA: Record<string, SenseItem> = {
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
    question: 'أنا الجلد واليد الحنونة! أشعر بالحرارة والبرودة والأشياء الخشنة والناعمة. ماذا تلمس بي؟',
    correctId: 'rabbit',
    options: [
      { id: 'rainbow', emoji: '🌈', label: 'قوس قزح البعيد' },
      { id: 'rabbit', emoji: '🐇', label: 'فرو الأرنب الناعم جداً' },
      { id: 'bell', emoji: '🔔', label: 'الأصوات المحيطة' }
    ],
    explanation: 'ممتاز! ملايين النهايات العصبية في جلدك تشعرك بنعومة فرو الأرنب الصغير ودفء الشمس! 🐇✋'
  }
};

export const ANIMALS_DIET_DATA: AnimalDietItem[] = [
  { name: 'الأسد الشجاع 🦁', emoji: '🦁', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'الأسد من آكلات اللحوم! لديه مخالب وأنياب حادة وهو ملك الغابة الأقوى.', fact: 'آكلات اللحوم لها أسنان حادة وأنياب قوية لتقطيع الغذاء وسد الجوع!' },
  { name: 'الخروف الأليف 🐑', emoji: '🐑', type: 'herbivore', foodEmoji: '🌿', foodName: 'العشب الأخضر', desc: 'الخروف من آكلات الأعشاب! يأكل العشب اللذيذ ويصنع لنا الصوف الدافئ.', fact: 'آكلات الأعشاب لها أسنان مسطحة تساعدها على طحن وهرس أوراق النباتات!' },
  { name: 'النمر السريع 🐯', emoji: '🐯', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'النمر صياد ذكي وماهر يتغذى على اللحوم فقط ليجري بسرعة فائقة!', fact: 'النمور والفهود تحتاج للبروتين من اللحوم للحفاظ على عضلاتها القوية والسريعة!' },
  { name: 'الأرنب الصغير 🐇', emoji: '🐇', type: 'herbivore', foodEmoji: '🥕', foodName: 'الجزر والعشب', desc: 'الأرنب يحب الجزر والأعشاب الخضراء اللذيذة ليقفز عالياً!', fact: 'الأرانب تمتلك قواطع أمامية حادة تنمو باستمرار لقضم الألياف النباتية الصلبة!' },
  { name: 'الفيل الضخم 🐘', emoji: '🐘', type: 'herbivore', foodEmoji: '🍌', foodName: 'الموز والأغصان', desc: 'الفيل العملاق يتغذى على أوراق الأشجار، والأغصان، والفواكه اللذيذة باستخدام خرطومه!', fact: 'الفيل يحتاج لتناول كميات كبيرة جداً من النباتات يومياً ليغذي جسمه العملاق!' },
  { name: 'الذئب الذكي 🐺', emoji: '🐺', type: 'carnivore', foodEmoji: '🥩', foodName: 'اللحم الطازج', desc: 'الذئب حيوان بري قوي، يعيش في مجموعات وهو من آكلات اللحوم بامتياز.', fact: 'الذئاب تساعد في حفظ توازن الطبيعة والبيئة البرية وتمنع تكاثر الأعشاب المفرط!' }
];
