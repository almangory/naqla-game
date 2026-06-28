/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Trophy, Brain, Heart } from 'lucide-react';

interface SudanMemoryProps {
  addStars: (amount: number) => void;
}

interface Card {
  id: number;
  uniqueId: string;
  emoji: string;
  name: string;
  description: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function SudanMemory({ addStars }: SudanMemoryProps) {
  // 8 Unique heritage items (each will be duplicated to make 16 cards)
  const heritageItems = [
    { emoji: '⛰️', name: 'أهرامات مروي', description: 'أقدم وأجمل أهرامات مملكة كوش العظيمة 🇸🇩' },
    { emoji: '🌊', name: 'مقرن النيلين', description: 'ملتقى النيل الأزرق والنيل الأبيض بالخرطوم 💙' },
    { emoji: '🏺', name: 'الجبنة الفخارية', description: 'وعاء طيني تقليدي مبهج لصنع القهوة بالزنجبيل ☕' },
    { emoji: '🪵', name: 'العنقريب التراثي', description: 'سرير خشبي تقليدي منسوج بالحباب وبراعة الأجداد ✨' },
    { emoji: '🌴', name: 'نخيل الشمال', description: 'أشجار النخيل الشامخة المنتجة لأجود التمور السودانية 🌴' },
    { emoji: '🇸🇩', name: 'علم السودان الحبيب', description: 'رمز العزة والكرامة يرفرف شامخاً بالأمل 💚' },
    { emoji: '🐢', name: 'سلحفاة سواكن', description: 'رمز حماية الحياة البحرية في شواطئ البحر الأحمر 🌊' },
    { emoji: '🪭', name: 'الهبابة السعفية', description: 'مروحة يدوية ملونة منسوجة ببراعة من سعف النخيل 🌾' }
  ];

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize and shuffle deck
  const initGame = () => {
    const duplicated: Card[] = [];
    
    heritageItems.forEach((item, index) => {
      // First copy
      duplicated.push({
        id: index,
        uniqueId: `${index}-a`,
        emoji: item.emoji,
        name: item.name,
        description: item.description,
        isFlipped: false,
        isMatched: false
      });
      // Second copy
      duplicated.push({
        id: index,
        uniqueId: `${index}-b`,
        emoji: item.emoji,
        name: item.name,
        description: item.description,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle
    const shuffled = duplicated.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCardIds([]);
    setMoves(0);
    setMatchesCount(0);
    setIsWon(false);
    setFeedback('اضغط على بطاقتين للبحث عن المطابقات وكسب النجوم! 🧠✨');
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (uniqueId: string) => {
    // If already won, or clicked on already matched/flipped card, or already 2 cards are flipped
    const clickedCard = cards.find(c => c.uniqueId === uniqueId);
    if (!clickedCard || clickedCard.isMatched || clickedCard.isFlipped || flippedCardIds.length >= 2 || isWon) {
      return;
    }

    // Flip the clicked card
    const updatedCards = cards.map(c => 
      c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCardIds, uniqueId];
    setFlippedCardIds(newFlipped);

    // If we have flipped 2 cards, check match
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const card1 = cards.find(c => c.uniqueId === newFlipped[0]);
      const card2 = cards.find(c => c.uniqueId === uniqueId); // current clicked card

      if (card1 && card2 && card1.id === card2.id) {
        // MATCH!
        setTimeout(() => {
          const matchedCards = updatedCards.map(c => 
            c.id === card1.id ? { ...c, isMatched: true } : c
          );
          setCards(matchedCards);
          setFlippedCardIds([]);
          setMatchesCount(prev => prev + 1);
          setFeedback(`رائع! تطابق ممتاز لـ "${card1.name}"! ${card1.description} ✨`);
          
          // Check win condition
          if (matchesCount + 1 === heritageItems.length) {
            setIsWon(true);
            const starsAward = Math.max(50 - moves, 25); // Bonus stars based on efficiency
            addStars(starsAward);
            setFeedback(`🎉 مبروووك يا ذكي! لقد انتصرت وحللت لعبة الذاكرة كاملة بـ ${moves + 1} محاولة! حصلت على ${starsAward} نجمة ذهبية! ⭐🇸🇩`);
          }
        }, 600);
      } else {
        // NO MATCH, flip back
        setTimeout(() => {
          const resetCards = updatedCards.map(c => 
            c.uniqueId === newFlipped[0] || c.uniqueId === uniqueId ? { ...c, isFlipped: false } : c
          );
          setCards(resetCards);
          setFlippedCardIds([]);
          setFeedback('لم تتطابق البطاقتان، جرب بطاقات أخرى وتذكر مكانها جيداً! 🧠🔍');
        }, 1200);
      }
    }
  };

  return (
    <div className="bg-[#FFFDF6] rounded-[32px] p-6 sm:p-8 border-4 border-[#FF6B6B] shadow-[0_8px_0_0_#CC5555]" id="sudan-memory-container">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-rose-50 pb-4">
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">🇸🇩</span>
            <span className="bg-[#FF6B6B] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full border border-red-700 shadow-sm animate-pulse">
              لعبة تنشيط الذاكرة
            </span>
          </div>
          <h2 className="text-3xl font-black text-[#CC5555] mt-1.5 flex items-center gap-2">
            🧠 الذاكرة التراثية السودانية الأصيلة 🧩
          </h2>
          <p className="text-gray-600 font-bold text-sm mt-1">
            طابق الرموز التراثية والثقافية السودانية لتقوية ذكائك وذاكرتك واكتساب النجوم الذهبية الإضافية!
          </p>
        </div>

        <button
          onClick={initGame}
          className="mt-3 md:mt-0 bg-[#FFD93D] text-[#7A6A24] border-4 border-[#7A6A24] font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
          id="restart-memory-btn"
        >
          <RefreshCw className="w-4 h-4" /> العب مجدداً واخلط البطاقات
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border-3 border-[#FF6B6B] p-3 rounded-2xl text-center shadow-sm">
          <p className="text-gray-500 font-bold text-[10px]">عدد المحاولات</p>
          <p className="text-[#CC5555] text-lg font-black">{moves}</p>
        </div>
        <div className="bg-white border-3 border-[#FFD93D] p-3 rounded-2xl text-center shadow-sm">
          <p className="text-gray-500 font-bold text-[10px]">البطاقات المتطابقة</p>
          <p className="text-[#7A6A24] text-lg font-black">{matchesCount} / {heritageItems.length}</p>
        </div>
        <div className="bg-white border-3 border-emerald-400 p-3 rounded-2xl text-center shadow-sm">
          <p className="text-gray-500 font-bold text-[10px]">الحالة</p>
          <p className="text-emerald-600 text-xs font-black mt-1">
            {isWon ? '🎉 ربحت اللعبة!' : '🧠 قيد اللعب والتركيز'}
          </p>
        </div>
        <div className="bg-white border-3 border-[#6C5CE7] p-3 rounded-2xl text-center shadow-sm flex items-center justify-center gap-1">
          <Brain className="w-4 h-4 text-[#6C5CE7]" />
          <span className="text-[10px] font-black text-[#5044AB]">تنشيط العقل</span>
        </div>
      </div>

      {/* Main Grid: Cards Deck */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 justify-items-center max-w-5xl mx-auto my-6">
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;
          return (
            <motion.div
              key={card.uniqueId}
              whileHover={{ scale: isRevealed ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.uniqueId)}
              className={`w-16 h-20 sm:w-24 sm:h-28 rounded-2xl border-4 cursor-pointer relative flex items-center justify-center text-center transition-all ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-400 shadow-inner'
                  : card.isFlipped
                    ? 'bg-white border-[#FF6B6B] shadow-md'
                    : 'bg-gradient-to-br from-[#FF9F43] to-[#FF6B6B] border-white shadow-[0_4px_0_0_#CC5555]'
              }`}
              id={`memory-card-${card.uniqueId}`}
            >
              {isRevealed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="text-2xl sm:text-4xl select-none mb-1">{card.emoji}</span>
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-700 leading-none truncate max-w-[60px] sm:max-w-[80px]">
                    {card.name}
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-white text-xl sm:text-2xl font-black select-none">🇸🇩</span>
                  <span className="text-[8px] text-orange-100 font-bold leading-none mt-1">سمسم</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Advice / Feedback panel with Semsem the Owl */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#FFF5EE] border-4 border-[#FF8E3C] p-4 rounded-[24px] mt-6 flex items-start gap-3.5 shadow-sm"
            id="memory-feedback-box"
          >
            <span className="text-4xl">🦉</span>
            <div className="text-right">
              <h4 className="text-[#CC7130] font-black text-base mb-1 flex items-center gap-1">
                البومة سمسم المرشد التراثي:
              </h4>
              <p className="text-gray-700 font-bold text-xs sm:text-sm leading-relaxed">
                {feedback}
              </p>
              <div className="text-[10px] text-gray-400 mt-1.5 font-medium">
                💡 معلومة تراثية: من معالم كرم وأصالة السودان كثرة الأباريق والزير في الطرقات لسقاية عابري السبيل مجاناً وبكل محبة وطيبة! 🏺💧
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Win Overlay Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-2xl p-6 text-center shadow-lg mt-6 border-4 border-white animate-bounce">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-yellow-300 drop-shadow" />
          <h3 className="text-xl font-black">عبقري التراث السوداني الأصيل! 🎉</h3>
          <p className="text-xs font-bold mt-1.5 max-w-md mx-auto leading-relaxed">
            لقد تمكنت من مطابقة جميع صور ومعالم التراث السوداني بنجاح مبهر ومثابرة ذكية! فخورون بك جداً في أكاديمية نقلة للأطفال! 🎓⭐
          </p>
        </div>
      )}

    </div>
  );
}
