/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, Star, Info, Award, HelpCircle } from 'lucide-react';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useSpeech } from '../hooks/useSpeech';

interface PyramidStackerGameProps {
  addStars: (amount: number) => void;
}

interface PlacedBlock {
  x: number; // offset from center
  width: number;
  level: number;
  isPerfect: boolean;
}

const KUSHITE_FACTS = [
  "بنى أجدادنا ملوك كوش العظماء أهرامات مروي الرائعة لتكون مقابر ملكية شامخة! ⛰️👑",
  "هل تعلم أن أهرامات السودان تتميز بزاوية حادة مدببة تجعلها فريدة وتختلف عن أهرامات الجيزة؟ 📐✨",
  "اشتهرت الملكات الكوشيات العظيمات وكنّ يُلقبن بـ 'الكنداكة' بشجاعتهن وحكمتهن النادرة! 👸🏾🇸🇩",
  "كان عمال وبناة كوش ينقلون الحجر الرملي الأصفر من جبال الصحراء وينحتونه بمهارة فائقة! ⛏️🧱",
  "قمم أهرامات مروي كانت تزين أحياناً بحلي ذهبية وأشعة براقة تعكس ضوء شمس النيل الساطعة! ☀️⭐"
];

export default function PyramidStackerGame({ addStars }: PyramidStackerGameProps) {
  const { playStonePlace, playStarSound, playClick } = useSoundEffects();
  const { speak } = useSpeech();

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover' | 'completed'>('ready');
  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [currentFact, setCurrentFact] = useState<string | null>(null);

  // Crane Swing Animation state
  const [swingPos, setSwingPos] = useState(0); // -150 to +150 px from center
  const [swingDirection, setSwingDirection] = useState<1 | -1>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const MAX_LEVELS = 6;
  const BASE_WIDTH = 260; // Base stone block width
  const BLOCK_HEIGHT = 44; // px

  // Calculate current swinging block width (tapers slightly each tier)
  const currentBlockWidth = Math.max(BASE_WIDTH - (currentLevel - 1) * 36, 70);

  // Swing physics loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let speed = 2.5 + currentLevel * 0.4; // Slightly faster as pyramid gets higher
    let pos = swingPos;
    let dir = swingDirection;

    const loop = () => {
      pos += speed * dir;
      if (pos > 140) {
        pos = 140;
        dir = -1;
      } else if (pos < -140) {
        pos = -140;
        dir = 1;
      }
      setSwingPos(pos);
      setSwingDirection(dir);
      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, currentLevel]);

  const startGame = () => {
    setPlacedBlocks([]);
    setCurrentLevel(1);
    setScore(0);
    setPerfectCount(0);
    setCurrentFact(null);
    setSwingPos(0);
    setGameState('playing');
    playClick();
  };

  const handleDropStone = () => {
    if (gameState !== 'playing') return;

    // Previous block position (level 1 aligns with base 0)
    const prevBlock = placedBlocks[placedBlocks.length - 1];
    const prevX = prevBlock ? prevBlock.x : 0;
    const diff = Math.abs(swingPos - prevX);

    // Tolerance check
    const maxAllowedDiff = (currentBlockWidth / 2) + 20;

    if (diff > maxAllowedDiff && currentLevel > 1) {
      // Missed / fell off the pyramid!
      playStonePlace(false);
      setGameState('gameover');
      return;
    }

    const isPerfect = diff < 18;
    playStonePlace(isPerfect);

    const newBlock: PlacedBlock = {
      x: swingPos,
      width: currentBlockWidth,
      level: currentLevel,
      isPerfect
    };

    const nextBlocks = [...placedBlocks, newBlock];
    setPlacedBlocks(nextBlocks);

    const points = isPerfect ? 20 : 10;
    setScore(prev => prev + points);
    if (isPerfect) {
      setPerfectCount(prev => prev + 1);
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    }

    // Kushite History Fact popup
    const factIdx = (currentLevel - 1) % KUSHITE_FACTS.length;
    setCurrentFact(KUSHITE_FACTS[factIdx]);

    if (currentLevel >= MAX_LEVELS) {
      // Pyramid Completed! Placed Capstone!
      setGameState('completed');
      const totalReward = 40 + (isPerfect ? 20 : 0);
      addStars(totalReward);
      playStarSound();
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      speak("مبروك يا بطل! لقد شيدت هرماً كوشياً باسقاً كأهرامات مروي العظيمة!");
    } else {
      setCurrentLevel(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FFD93D] shadow-[0_8px_0_0_#D1B02B] max-w-4xl mx-auto" id="pyramid-stacker-game">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center pb-4 mb-6 border-b-4 border-amber-100 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2">
            <span>⛰️🏗️</span>
            <span>بناة أهرامات كوش العظماء</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-900 mt-1">
            شيد أهرامات البجراوية السودانية حجرًا فوق حجر بتوقيت دقيق واكتشف أسرار ملوك كوش! 🇸🇩
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 px-4 py-2 rounded-2xl border-2 border-amber-300 flex items-center gap-2 font-black text-amber-900 text-sm">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>النقاط: {score}</span>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border-2 border-orange-300 flex items-center gap-2 font-black text-orange-800 text-sm">
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span>طابق: {Math.min(currentLevel, MAX_LEVELS)} / {MAX_LEVELS}</span>
          </div>
        </div>
      </div>

      {/* Main Playing Canvas Area */}
      <div 
        ref={containerRef}
        onClick={handleDropStone}
        className="relative bg-gradient-to-b from-[#87CEEB] via-[#FFF3D1] to-[#E6C280] rounded-[28px] h-[450px] border-4 border-amber-400 shadow-inner overflow-hidden cursor-pointer select-none flex flex-col justify-between p-4"
        id="pyramid-construction-site"
      >
        {/* Sky with Sun and Pyramids in Distance */}
        <div className="absolute top-4 right-6 flex items-center gap-2">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }} 
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-16 h-16 bg-yellow-300 rounded-full border-4 border-yellow-100 shadow-lg flex items-center justify-center text-2xl"
          >
            ☀️
          </motion.div>
        </div>

        {/* Distant desert dunes & pyramids */}
        <div className="absolute bottom-16 inset-x-0 flex justify-around opacity-30 pointer-events-none">
          <span className="text-7xl">⛰️</span>
          <span className="text-6xl">🌴</span>
          <span className="text-8xl">⛰️</span>
        </div>

        {/* Swinging Crane / Stone at the top */}
        {gameState === 'playing' && (
          <div className="relative w-full h-24 z-20 flex justify-center">
            {/* Wooden Crane Rope */}
            <div 
              className="absolute top-0 flex flex-col items-center transition-transform duration-75"
              style={{ transform: `translateX(${swingPos}px)` }}
            >
              <div className="w-1 bg-[#8B5A2B] h-14 shadow-sm" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl border-2 border-amber-900 shadow-xl flex items-center justify-center text-white font-black text-xs cursor-pointer relative"
                style={{
                  width: `${currentBlockWidth}px`,
                  height: `${BLOCK_HEIGHT}px`,
                  background: currentLevel === MAX_LEVELS 
                    ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                    : 'linear-gradient(135deg, #E29547 0%, #B86B28 100%)',
                }}
              >
                {currentLevel === MAX_LEVELS ? '👑 القمة الذهبية' : '🧱 حجر رملي كوشي'}
                <span className="absolute -bottom-6 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full font-bold">
                  انقر لإسقاط الحجر! 👇
                </span>
              </motion.div>
            </div>
          </div>
        )}

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <span className="text-7xl mb-3 animate-bounce">⛰️👑</span>
            <h3 className="text-3xl font-black mb-2">مستعد لبناء أهرامات كوش؟</h3>
            <p className="text-sm font-bold max-w-md mb-6 leading-relaxed">
              راقب حركة الحجر المتأرجح في الأعلى، وانقر في اللحظة المناسبة لإسقاطه فوق القاعدة بدقة! كلما كان البناء متقناً كسبت نجوماً وأوسمة أكثر! ⭐
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-8 py-4 bg-[#2ECC71] hover:bg-green-600 border-4 border-green-800 text-white font-black text-lg rounded-2xl shadow-[0_6px_0_0_#1E824C] hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#1E824C] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer"
            >
              ابدأ البناء الآن! 🚀
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <span className="text-6xl mb-3 animate-pulse">🧱💔</span>
            <h3 className="text-2xl font-black mb-2">أوه! سقط الحجر خارج الهرم!</h3>
            <p className="text-sm font-bold mb-4">
              لا بأس يا بطل، حتى بناة الأهرامات القدماء احتاجوا للتدريب والتركيز! حاول مرة أخرى!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 bg-[#FF6B6B] hover:bg-red-500 border-4 border-red-800 text-white font-black text-sm rounded-2xl shadow-[0_4px_0_0_#990000] cursor-pointer"
            >
              🔄 إعادة المحاولة من جديد
            </button>
          </div>
        )}

        {/* Completed Overlay */}
        {gameState === 'completed' && (
          <div className="absolute inset-0 bg-amber-900/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <span className="text-7xl mb-3 animate-bounce">🏆⛰️✨</span>
            <h3 className="text-3xl font-black text-yellow-300 mb-2">يا لك من مهندس كوشي عبقري!</h3>
            <p className="text-base font-bold max-w-md mb-2">
              اكتمل بناء الهرم الشامخ وتوجت بالتاج الذهبي! كسبت {score} نقطة ونال إعجاب البومة سمسم! 🦉🇸🇩
            </p>
            <p className="text-xs text-amber-200 mb-6 font-bold">
              مرات الإسقاط المثالي الدقيق: {perfectCount} مرات! 🌟
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-8 py-3.5 bg-[#FFD93D] text-gray-900 hover:bg-yellow-400 border-4 border-yellow-600 font-black text-base rounded-2xl shadow-[0_6px_0_0_#B58A15] cursor-pointer"
            >
              🏗️ بناء هرم جديد في مروي
            </button>
          </div>
        )}

        {/* Stack of Placed Blocks rising from bottom */}
        <div className="relative w-full z-10 flex flex-col items-center justify-end flex-grow pb-2 pointer-events-none">
          {/* Blocks in reverse order (top to bottom of stack) */}
          {[...placedBlocks].reverse().map((block) => (
            <motion.div
              key={block.level}
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="rounded-lg border-2 border-amber-950 shadow-md flex items-center justify-center text-white font-black text-xs relative"
              style={{
                width: `${block.width}px`,
                height: `${BLOCK_HEIGHT}px`,
                transform: `translateX(${block.x}px)`,
                background: block.level === MAX_LEVELS 
                  ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' 
                  : 'linear-gradient(135deg, #D97D29 0%, #A35414 100%)',
              }}
            >
              {block.level === MAX_LEVELS && <span className="text-xl">👑</span>}
              {block.isPerfect && (
                <span className="absolute -top-4 bg-yellow-400 text-gray-900 text-[10px] font-black px-1.5 py-0.2 rounded-full shadow">
                  مثالي! ✨
                </span>
              )}
            </motion.div>
          ))}

          {/* Solid Desert Foundation Base */}
          <div className="w-[320px] h-8 bg-gradient-to-r from-[#8B5A2B] via-[#A0522D] to-[#8B5A2B] border-4 border-amber-950 rounded-xl shadow-lg flex items-center justify-center text-amber-100 text-xs font-black">
            قاعدة أرض مروي العريقة 🇸🇩
          </div>
        </div>
      </div>

      {/* Kushite History Fact Card below */}
      {currentFact && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3"
        >
          <span className="text-2xl shrink-0">🦉💡</span>
          <div className="flex-grow">
            <h4 className="text-xs font-black text-amber-900 mb-0.5">معلومة تاريخية كوشية من سمسم:</h4>
            <p className="text-xs font-bold text-gray-700 leading-relaxed">{currentFact}</p>
          </div>
          <button
            onClick={() => speak(currentFact)}
            className="bg-white hover:bg-amber-100 p-2 rounded-xl border border-amber-300 text-amber-800 shrink-0 cursor-pointer"
            title="استمع للمعلومة"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
