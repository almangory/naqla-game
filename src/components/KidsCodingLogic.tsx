/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  Sparkles, 
  ArrowUp, 
  ArrowRight, 
  ArrowLeft, 
  Trash2, 
  Trophy, 
  Zap, 
  Bot, 
  CheckCircle2, 
  HelpCircle,
  Volume2
} from 'lucide-react';

interface KidsCodingLogicProps {
  addStars: (amount: number) => void;
}

type CommandType = 'FORWARD' | 'TURN_RIGHT' | 'TURN_LEFT' | 'COLLECT';

interface LevelConfig {
  id: number;
  title: string;
  gridSize: number;
  startPos: { x: number; y: number; dir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' };
  targetPos: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  hint: string;
  maxCommands: number;
}

const CODING_LEVELS: LevelConfig[] = [
  {
    id: 1,
    title: 'المسار المستقيم السهل ⬆️',
    gridSize: 5,
    startPos: { x: 1, y: 3, dir: 'UP' },
    targetPos: { x: 1, y: 0 },
    obstacles: [{ x: 2, y: 1 }, { x: 0, y: 2 }],
    hint: 'استخدم أمر "تقدم للأمام ⬆️" 3 مرات ليصل الروبوت لجوهرة الطاقة!',
    maxCommands: 4
  },
  {
    id: 2,
    title: 'المنعطف الذكي ➡️',
    gridSize: 5,
    startPos: { x: 0, y: 4, dir: 'UP' },
    targetPos: { x: 3, y: 2 },
    obstacles: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 3 }],
    hint: 'تقدم للأمام مرتين، ثم استدر يميناً وتقدم نحو الجوهرة!',
    maxCommands: 6
  },
  {
    id: 3,
    title: 'متاهة الأحجار البركانية 🪨',
    gridSize: 5,
    startPos: { x: 0, y: 4, dir: 'RIGHT' },
    targetPos: { x: 4, y: 0 },
    obstacles: [
      { x: 2, y: 4 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 1 }
    ],
    hint: 'التف حول الأحجار بحذر واستدر في الوقت المناسب!',
    maxCommands: 8
  },
  {
    id: 4,
    title: 'تحدي وادي النيازك ⚡',
    gridSize: 5,
    startPos: { x: 4, y: 4, dir: 'UP' },
    targetPos: { x: 0, y: 0 },
    obstacles: [
      { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 1 },
      { x: 1, y: 2 }
    ],
    hint: 'برمج أطول خوارزمية ذكية لعبور الوادي بأمان!',
    maxCommands: 10
  }
];

export default function KidsCodingLogic({ addStars }: KidsCodingLogicProps) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = CODING_LEVELS[currentLevelIdx];

  // Robot State
  const [robotPos, setRobotPos] = useState(currentLevel.startPos);
  const [commandsQueue, setCommandsQueue] = useState<CommandType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeExecutingStep, setActiveExecutingStep] = useState<number | null>(null);
  const [levelWon, setLevelWon] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Audio helper
  const playBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.15) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // Reset current level
  const resetLevel = () => {
    setRobotPos(currentLevel.startPos);
    setIsRunning(false);
    setActiveExecutingStep(null);
    setLevelWon(false);
    setErrorMsg(null);
  };

  useEffect(() => {
    resetLevel();
    setCommandsQueue([]);
  }, [currentLevelIdx]);

  // Add command to program
  const addCommand = (cmd: CommandType) => {
    if (isRunning || levelWon) return;
    if (commandsQueue.length >= currentLevel.maxCommands) {
      setErrorMsg(`الحد الأقصى للأوامر في هذا المستوى هو ${currentLevel.maxCommands} أوامر!`);
      return;
    }
    setErrorMsg(null);
    playBeep(520, 'triangle', 0.1);
    setCommandsQueue(prev => [...prev, cmd]);
  };

  // Remove single command
  const removeCommand = (index: number) => {
    if (isRunning || levelWon) return;
    playBeep(300, 'sine', 0.1);
    setCommandsQueue(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all commands
  const clearAllCommands = () => {
    if (isRunning || levelWon) return;
    playBeep(240, 'sawtooth', 0.15);
    setCommandsQueue([]);
    resetLevel();
  };

  // Turn logic
  const getNextDirection = (currentDir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT', turn: 'RIGHT' | 'LEFT'): 'UP' | 'RIGHT' | 'DOWN' | 'LEFT' => {
    const directions: ('UP' | 'RIGHT' | 'DOWN' | 'LEFT')[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
    const idx = directions.indexOf(currentDir);
    if (turn === 'RIGHT') {
      return directions[(idx + 1) % 4];
    } else {
      return directions[(idx - 1 + 4) % 4];
    }
  };

  // Direction rotation angle for CSS
  const getRotationDeg = (dir: 'UP' | 'RIGHT' | 'DOWN' | 'LEFT') => {
    switch (dir) {
      case 'UP': return 0;
      case 'RIGHT': return 90;
      case 'DOWN': return 180;
      case 'LEFT': return 270;
    }
  };

  // Run Program Sequence
  const runProgram = async () => {
    if (isRunning || commandsQueue.length === 0 || levelWon) return;
    setIsRunning(true);
    setErrorMsg(null);
    setRobotPos(currentLevel.startPos);

    let curX = currentLevel.startPos.x;
    let curY = currentLevel.startPos.y;
    let curDir = currentLevel.startPos.dir;

    for (let i = 0; i < commandsQueue.length; i++) {
      setActiveExecutingStep(i);
      const cmd = commandsQueue[i];

      if (cmd === 'FORWARD') {
        playBeep(600, 'sine', 0.2);
        let nextX = curX;
        let nextY = curY;

        if (curDir === 'UP') nextY -= 1;
        else if (curDir === 'RIGHT') nextX += 1;
        else if (curDir === 'DOWN') nextY += 1;
        else if (curDir === 'LEFT') nextX -= 1;

        // Check Wall Collision
        if (nextX < 0 || nextX >= currentLevel.gridSize || nextY < 0 || nextY >= currentLevel.gridSize) {
          playBeep(180, 'sawtooth', 0.3);
          setErrorMsg('أوبس! اصطدم الروبوت بالجدار الخارجي! 🚧');
          setIsRunning(false);
          setActiveExecutingStep(null);
          return;
        }

        // Check Obstacle Collision
        const hitRock = currentLevel.obstacles.some(o => o.x === nextX && o.y === nextY);
        if (hitRock) {
          playBeep(150, 'sawtooth', 0.35);
          setErrorMsg('انتبه! اصطدم الروبوت بصخرة بركانية! 🪨');
          setIsRunning(false);
          setActiveExecutingStep(null);
          return;
        }

        curX = nextX;
        curY = nextY;
        setRobotPos({ x: curX, y: curY, dir: curDir });

      } else if (cmd === 'TURN_RIGHT') {
        playBeep(450, 'triangle', 0.15);
        curDir = getNextDirection(curDir, 'RIGHT');
        setRobotPos({ x: curX, y: curY, dir: curDir });

      } else if (cmd === 'TURN_LEFT') {
        playBeep(450, 'triangle', 0.15);
        curDir = getNextDirection(curDir, 'LEFT');
        setRobotPos({ x: curX, y: curY, dir: curDir });
      }

      // Step delay
      await new Promise(r => setTimeout(r, 650));
    }

    // Check if reached target
    if (curX === currentLevel.targetPos.x && curY === currentLevel.targetPos.y) {
      setLevelWon(true);
      playBeep(880, 'sine', 0.4);
      addStars(25);
      try {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else {
      playBeep(220, 'sawtooth', 0.25);
      setErrorMsg('انتهت خطوات البرنامج ولكن الروبوت لم يصل بعد إلى جوهرة الطاقة! أضف خطوات جديدة 🎯');
    }

    setIsRunning(false);
    setActiveExecutingStep(null);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < CODING_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setCurrentLevelIdx(0);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. HEADER & LEVEL BANNER                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-purple-500 shadow-[0_8px_0_0_#7C3AED] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-3xl shadow-inner text-white shrink-0">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                أكاديمية البرمجة والمنطق للأطفال 🧠
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ +25 نجمة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
              مغامرة الروبوت الذكي (Kids Coding Maze)
            </h2>
          </div>
        </div>

        {/* Level Selectors */}
        <div className="flex items-center gap-1.5 bg-purple-50 p-1.5 rounded-2xl border-2 border-purple-200 overflow-x-auto max-w-full">
          {CODING_LEVELS.map((lvl, idx) => (
            <button
              key={lvl.id}
              onClick={() => setCurrentLevelIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                currentLevelIdx === idx
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-900 hover:bg-purple-100'
              }`}
            >
              المستوى {lvl.id}
            </button>
          ))}
        </div>
      </div>

      {/* Level Info Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-yellow-300" />
          <div>
            <h3 className="text-base sm:text-lg font-black">{currentLevel.title}</h3>
            <p className="text-xs font-bold text-purple-200 mt-0.5">💡 {currentLevel.hint}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-black">
            الأوامر: {commandsQueue.length} / {currentLevel.maxCommands}
          </span>
          <button
            onClick={resetLevel}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة التموضع</span>
          </button>
        </div>
      </div>

      {/* Error / Alert notification */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border-2 border-red-400 text-red-800 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center justify-between"
          >
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="text-red-600 font-black cursor-pointer">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. MAIN GRID & VISUAL CODING DOCK                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Main: The Procedural Coding Grid Arena */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6 rounded-[36px] border-4 border-purple-500 shadow-[0_10px_0_0_#6D28D9] flex flex-col items-center justify-center relative overflow-hidden">
          
          <div className="text-white text-xs font-black mb-4 flex items-center justify-between w-full px-2">
            <span className="text-purple-300">خريطة الاستكشاف الفضائي 🪐</span>
            <span className="text-amber-400">الهدف: التقاط خلية الطاقة ⚡</span>
          </div>

          {/* 5x5 Grid Cells (Strictly Left to Right) */}
          <div 
            className="grid gap-2 bg-slate-950 p-4 rounded-3xl border-3 border-purple-800 shadow-inner"
            dir="ltr"
            style={{
              gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: currentLevel.gridSize }).map((_, r) => (
              <React.Fragment key={r}>
                {Array.from({ length: currentLevel.gridSize }).map((_, c) => {
                  const isRobotHere = robotPos.x === c && robotPos.y === r;
                  const isTarget = currentLevel.targetPos.x === c && currentLevel.targetPos.y === r;
                  const isObstacle = currentLevel.obstacles.some(o => o.x === c && o.y === r);

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center relative transition-all border-2 ${
                        isTarget
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-amber-500 shadow-md animate-pulse'
                          : isObstacle
                          ? 'bg-stone-800 border-stone-600'
                          : 'bg-slate-900/80 border-slate-700/60 hover:border-purple-500/40'
                      }`}
                    >
                      {/* Obstacle Rock */}
                      {isObstacle && (
                        <span className="text-2xl sm:text-3xl select-none animate-wiggle">
                          🪨
                        </span>
                      )}

                      {/* Energy Crystal Target */}
                      {isTarget && !levelWon && (
                        <span className="text-2xl sm:text-3xl select-none animate-bounce">
                          ⚡💎
                        </span>
                      )}

                      {/* Robot Rover */}
                      {isRobotHere && (
                        <motion.div
                          layoutId="coding-rover"
                          className="text-3xl sm:text-4xl select-none relative z-10"
                          style={{
                            transform: `rotate(${getRotationDeg(robotPos.dir)}deg)`,
                            transition: 'transform 0.3s ease-out'
                          }}
                        >
                          🤖
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Victory Modal */}
          <AnimatePresence>
            {levelWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-20"
              >
                <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-purple-500 shadow-2xl max-w-sm w-full text-center">
                  <div className="text-6xl mb-2 animate-bounce">🎉🤖✨</div>
                  <h3 className="text-2xl font-black text-purple-900">مبرمج عبقري!</h3>
                  <p className="text-xs font-bold text-gray-600 mt-1">
                    نجحت الخوارزمية ووصل الروبوت بنجاح إلى جوهرة الطاقة!
                  </p>
                  <div className="bg-amber-100 text-amber-950 font-black text-xs py-1.5 px-4 rounded-xl inline-block mt-3 border border-amber-300">
                    ⭐ +25 نجمة ذهبية
                  </div>

                  <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                      onClick={handleNextLevel}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition"
                    >
                      المستوى التالي 🚀
                    </button>
                    <button
                      onClick={resetLevel}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-xs rounded-xl cursor-pointer"
                    >
                      إعادة المحاولة 🔄
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Right/Side: Block Commands & Execution Console */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Action Palette */}
          <div className="bg-white rounded-3xl p-5 border-4 border-purple-300 shadow-[0_6px_0_0_#C084FC]">
            <h4 className="text-sm font-black text-gray-800 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>مكعبات الأوامر البرمجية (انقر للإضافة):</span>
            </h4>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => addCommand('FORWARD')}
                disabled={isRunning}
                className="p-3 bg-blue-50 hover:bg-blue-100 active:scale-95 border-2 border-blue-400 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-blue-900 font-black text-xs"
              >
                <ArrowUp className="w-6 h-6 text-blue-600" />
                <span>تقدم ⬆️</span>
              </button>

              <button
                onClick={() => addCommand('TURN_RIGHT')}
                disabled={isRunning}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 active:scale-95 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-emerald-900 font-black text-xs"
              >
                <ArrowRight className="w-6 h-6 text-emerald-600" />
                <span>استدر يميناً ➡️</span>
              </button>

              <button
                onClick={() => addCommand('TURN_LEFT')}
                disabled={isRunning}
                className="p-3 bg-pink-50 hover:bg-pink-100 active:scale-95 border-2 border-pink-400 rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-pink-900 font-black text-xs"
              >
                <ArrowLeft className="w-6 h-6 text-pink-600" />
                <span>استدر يساراً ⬅️</span>
              </button>
            </div>
          </div>

          {/* Program Code Queue */}
          <div className="bg-white rounded-3xl p-5 border-4 border-amber-300 shadow-[0_6px_0_0_#F59E0B]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-amber-500" />
                <span>شريط البرنامج (تسلسل الأوامر):</span>
              </h4>
              <button
                onClick={clearAllCommands}
                disabled={isRunning || commandsQueue.length === 0}
                className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            </div>

            {/* Steps Container */}
            <div className="bg-gray-50 p-3 rounded-2xl border-2 border-dashed border-gray-300 min-h-[90px] flex flex-wrap gap-2 items-center">
              {commandsQueue.length === 0 ? (
                <div className="text-center w-full py-4 text-xs font-bold text-gray-400">
                  انقر على مكعبات الأوامر بالأعلى لبناء كود البرنامج! 🧱
                </div>
              ) : (
                commandsQueue.map((cmd, idx) => {
                  const isExecuting = activeExecutingStep === idx;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition ${
                        isExecuting
                          ? 'bg-amber-300 border-amber-500 text-amber-950 scale-110 ring-2 ring-amber-400'
                          : cmd === 'FORWARD'
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : cmd === 'TURN_RIGHT'
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                          : 'bg-pink-100 border-pink-300 text-pink-900'
                      }`}
                      onClick={() => removeCommand(idx)}
                    >
                      <span className="text-[10px] text-gray-500 font-bold">{idx + 1}.</span>
                      <span>
                        {cmd === 'FORWARD' && 'تقدم ⬆️'}
                        {cmd === 'TURN_RIGHT' && 'يمين ➡️'}
                        {cmd === 'TURN_LEFT' && 'يسار ⬅️'}
                      </span>
                      <span className="text-[10px] text-red-400 hover:text-red-600 font-black">×</span>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Run Program Button */}
            <div className="mt-4">
              <button
                onClick={runProgram}
                disabled={isRunning || commandsQueue.length === 0}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-black text-base rounded-2xl border-3 border-emerald-700 shadow-[0_6px_0_0_#047857] flex items-center justify-center gap-2 cursor-pointer active:translate-y-1 active:shadow-none transition"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isRunning ? 'جاري تنفيذ البرنامج...' : 'تشغيل البرنامج 🚀'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
