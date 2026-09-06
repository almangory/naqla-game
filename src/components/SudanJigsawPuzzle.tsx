/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Trophy, 
  HelpCircle, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  Star, 
  Award, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface SudanJigsawPuzzleProps {
  addStars: (amount: number) => void;
}

export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

interface PuzzleImage {
  id: string;
  title: string;
  category: string;
  src: string;
  desc: string;
  color: string;
}

const PUZZLE_IMAGES: PuzzleImage[] = [
  {
    id: 'karam',
    title: 'كرم الضيافة وإفطار الشارع السوداني 🍲',
    category: 'قيم وعادات سودانية أصيلة',
    src: '/puzzles/puzzle-karam.jpg',
    desc: 'من أروع عادات أهل السودان؛ إفطار رمضان في الطرقات وإكرام عابر السبيل والمحتاجين بروح المحبة والتكافل.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'angareb',
    title: 'جلسة الجد على العنقريب وتلاوة الذكر 📖',
    category: 'تراث وحكمة الأجداد',
    src: '/puzzles/puzzle-angareb.png',
    desc: 'أصالة التراث السوداني؛ الجد يقرأ في المصحف الشريف جالساً على العنقريب التقليدي بجوار فنجان الجبنة وسوط العنج.',
    color: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'nature',
    title: 'أنا ولغتي العربية في الطبيعة الخلابة 🌸',
    category: 'لغة عربية وتعليم ممتع',
    src: '/puzzles/puzzle-ana-boy.jpg',
    desc: 'لوحة كرتونية ثلاثية الأبعاد تنبض بالحياة؛ طفل وأرنوب لطيف في المروج الخضراء يتعلم حروف لغتنا العربية الجميلة.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'history',
    title: 'معلم التاريخ وحضارات النيل وكرمة 🏛️',
    category: 'تاريخ وأمجاد كوش',
    src: '/puzzles/puzzle-history.jpg',
    desc: 'تاريخ وأسرار حضارة كرمة العريقة؛ الشيخ الجليل يشرح للأطفال على الخريطة مسار النيل وحضارات بلاد النوبة والفراعنة.',
    color: 'from-indigo-600 to-purple-700'
  }
];

const DIFFICULTY_CONFIG: Record<PuzzleDifficulty, { label: string; rows: number; cols: number; total: number; stars: number; badge: string }> = {
  easy: { label: 'سهل (2 × 2 = 4 قطع)', rows: 2, cols: 2, total: 4, stars: 15, badge: 'مستكشف بطل 🟢' },
  medium: { label: 'متوسط (3 × 3 = 9 قطع)', rows: 3, cols: 3, total: 9, stars: 25, badge: 'ذكي ومميز 🟡' },
  hard: { label: 'متحدي (4 × 4 = 16 قطعة)', rows: 4, cols: 4, total: 16, stars: 40, badge: 'عبقري البزل 🔴' }
};

export default function SudanJigsawPuzzle({ addStars }: SudanJigsawPuzzleProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>('easy');
  const [showGhost, setShowGhost] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  
  // Placed pieces: slotIndex -> pieceIndex
  const [placedPieces, setPlacedPieces] = useState<Record<number, number>>({});
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [loosePieces, setLoosePieces] = useState<number[]>([]);
  const [wrongSlotFlash, setWrongSlotFlash] = useState<number | null>(null);

  // Scattered piece visual rotations (-8deg to +8deg)
  const [pieceRotations, setPieceRotations] = useState<Record<number, number>>({});

  // Touch & Pointer Drag-and-Drop state
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [dragSize, setDragSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const boardRef = useRef<HTMLDivElement>(null);
  const dragStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const draggedPieceRef = useRef<number | null>(null);

  // Stats
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentImage = PUZZLE_IMAGES[selectedImageIdx];
  const config = DIFFICULTY_CONFIG[difficulty];
  const totalPieces = config.total;
  const rows = config.rows;
  const cols = config.cols;

  // --- Sound Synthesizer via Web Audio API ---
  const playChime = (freqs: number[], type: OscillatorType = 'sine', duration: number = 0.25) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + duration);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + duration);
      });
    } catch (e) {}
  };

  const playPickSound = () => playChime([440, 554], 'sine', 0.15);
  const playSnapSound = () => playChime([523.25, 659.25, 783.99], 'triangle', 0.35);
  const playErrorSound = () => playChime([220, 196], 'sawtooth', 0.25);
  const playWinSound = () => playChime([523, 659, 783, 1046, 1318], 'sine', 0.6);

  // Detect which slot on the board is currently under the touch/pointer coordinates
  const getSlotUnderPoint = (clientX: number, clientY: number): number | null => {
    if (!boardRef.current) return null;
    const slotEls = boardRef.current.querySelectorAll<HTMLElement>('[data-slot-idx]');
    for (let i = 0; i < slotEls.length; i++) {
      const el = slotEls[i];
      const rect = el.getBoundingClientRect();
      // Expanded 12px boundary for generous, forgiving finger detection on mobile screens
      if (
        clientX >= rect.left - 12 &&
        clientX <= rect.right + 12 &&
        clientY >= rect.top - 12 &&
        clientY <= rect.bottom + 12
      ) {
        return Number(el.getAttribute('data-slot-idx'));
      }
    }
    return null;
  };

  // Initialize or reset puzzle
  const initPuzzle = () => {
    const pieces = Array.from({ length: totalPieces }, (_, i) => i);
    // Shuffle pieces randomly
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);

    // Generate playful organic rotations (-8deg to +8deg)
    const rotations: Record<number, number> = {};
    shuffled.forEach((p) => {
      rotations[p] = Math.round(Math.random() * 16 - 8);
    });

    setPieceRotations(rotations);
    setLoosePieces(shuffled);
    setPlacedPieces({});
    setSelectedPiece(null);
    setDraggingPiece(null);
    setHoveredSlot(null);
    setPointerPos(null);
    setWrongSlotFlash(null);
    setMoves(0);
    setSeconds(0);
    setIsCompleted(false);
    setIsTimerRunning(true);
  };

  // Shuffle loose pieces on demand
  const handleShufflePieces = () => {
    if (loosePieces.length <= 1) return;
    playPickSound();
    const shuffled = [...loosePieces].sort(() => Math.random() - 0.5);
    const rotations: Record<number, number> = {};
    shuffled.forEach((p) => {
      rotations[p] = Math.round(Math.random() * 16 - 8);
    });
    setPieceRotations(rotations);
    setLoosePieces(shuffled);
  };

  useEffect(() => {
    initPuzzle();
  }, [selectedImageIdx, difficulty]);

  // Global Pointer Listeners for True Finger Touch Drag & Drop
  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (draggedPieceRef.current === null) return;

      const dx = Math.abs(e.clientX - dragStartPosRef.current.x);
      const dy = Math.abs(e.clientY - dragStartPosRef.current.y);

      // Trigger drag after 6px movement
      if (!isDraggingRef.current && (dx > 6 || dy > 6)) {
        isDraggingRef.current = true;
        setDraggingPiece(draggedPieceRef.current);
        playPickSound();
      }

      if (isDraggingRef.current) {
        setPointerPos({ x: e.clientX, y: e.clientY });
        const targetSlot = getSlotUnderPoint(e.clientX, e.clientY);
        setHoveredSlot(targetSlot);
      }
    };

    const handleGlobalPointerUp = (e: PointerEvent) => {
      if (draggedPieceRef.current === null) return;
      const currentPiece = draggedPieceRef.current;

      if (isDraggingRef.current) {
        const targetSlot = getSlotUnderPoint(e.clientX, e.clientY);
        if (targetSlot !== null && placedPieces[targetSlot] === undefined) {
          setMoves(prev => prev + 1);
          if (targetSlot === currentPiece) {
            // Correct slot snap!
            playSnapSound();
            setPlacedPieces(prev => ({ ...prev, [targetSlot]: currentPiece }));
            setLoosePieces(prev => prev.filter(p => p !== currentPiece));
            setSelectedPiece(null);
          } else {
            // Wrong slot attempt
            playErrorSound();
            setWrongSlotFlash(targetSlot);
            setTimeout(() => setWrongSlotFlash(null), 600);
          }
        }
      } else {
        // Simple tap without dragging
        handleSelectTrayPiece(currentPiece);
      }

      draggedPieceRef.current = null;
      isDraggingRef.current = false;
      setDraggingPiece(null);
      setHoveredSlot(null);
      setPointerPos(null);
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [placedPieces, loosePieces]);

  // Pointer Down on a loose piece
  const handlePiecePointerDown = (e: React.PointerEvent, pieceIdx: number) => {
    if (isCompleted) return;

    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    draggedPieceRef.current = pieceIdx;

    // Calibrate drag size to match board slot dimensions
    if (boardRef.current) {
      const slotEl = boardRef.current.querySelector<HTMLElement>('[data-slot-idx]');
      if (slotEl) {
        const rect = slotEl.getBoundingClientRect();
        setDragSize({ width: rect.width, height: rect.height });
      }
    }

    setPointerPos({ x: e.clientX, y: e.clientY });
  };

  // Timer effect
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  // Check completion
  useEffect(() => {
    const placedCount = Object.keys(placedPieces).length;
    if (placedCount === totalPieces && totalPieces > 0 && !isCompleted) {
      // Check if all placed pieces match their slot
      const allCorrect = Object.entries(placedPieces).every(([slot, piece]) => Number(slot) === piece);
      if (allCorrect) {
        setIsCompleted(true);
        setIsTimerRunning(false);
        playWinSound();
        addStars(config.stars);

        try {
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  }, [placedPieces, totalPieces, isCompleted]);

  // Handle clicking a piece in the tray
  const handleSelectTrayPiece = (pieceIdx: number) => {
    if (isCompleted) return;
    playPickSound();
    setSelectedPiece(prev => (prev === pieceIdx ? null : pieceIdx));
  };

  // Handle clicking a slot on the board
  const handleSlotClick = (slotIdx: number) => {
    if (isCompleted) return;

    // If slot is already occupied, allow tapping to return it to tray
    if (placedPieces[slotIdx] !== undefined) {
      const returningPiece = placedPieces[slotIdx];
      const updated = { ...placedPieces };
      delete updated[slotIdx];
      setPlacedPieces(updated);
      setLoosePieces(prev => [...prev, returningPiece]);
      playPickSound();
      return;
    }

    // If a piece is currently selected from the tray
    if (selectedPiece !== null) {
      setMoves(prev => prev + 1);

      // Check if it fits in this slot
      if (selectedPiece === slotIdx) {
        // Perfect fit!
        playSnapSound();
        setPlacedPieces(prev => ({ ...prev, [slotIdx]: selectedPiece }));
        setLoosePieces(prev => prev.filter(p => p !== selectedPiece));
        setSelectedPiece(null);
      } else {
        // Wrong slot attempt
        playErrorSound();
        setWrongSlotFlash(slotIdx);
        setTimeout(() => setWrongSlotFlash(null), 600);
      }
    }
  };

  // Use a hint to place one random unplaced piece
  const handleUseHint = () => {
    if (isCompleted || hintsRemaining <= 0 || loosePieces.length === 0) return;

    // Pick first unplaced piece
    const targetPiece = loosePieces[0];
    const targetSlot = targetPiece;

    playSnapSound();
    setPlacedPieces(prev => ({ ...prev, [targetSlot]: targetPiece }));
    setLoosePieces(prev => prev.filter(p => p !== targetPiece));
    setSelectedPiece(null);
    setHintsRemaining(prev => prev - 1);
    setMoves(prev => prev + 1);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Piece Background Calculation helper
  const getPieceStyle = (pieceIdx: number) => {
    const r = Math.floor(pieceIdx / cols);
    const c = pieceIdx % cols;
    const xPercent = cols > 1 ? (c / (cols - 1)) * 100 : 0;
    const yPercent = rows > 1 ? (r / (rows - 1)) * 100 : 0;

    return {
      backgroundImage: `url(${currentImage.src})`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundRepeat: 'no-repeat'
    };
  };

  const placedCount = Object.keys(placedPieces).length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in" dir="rtl">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & HUD                                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#6C5CE7] shadow-[0_8px_0_0_#5845D8] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center text-3xl shadow-inner text-white shrink-0">
            🧩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200">
                أكاديمية الذكاء والتركيز البصري 🧠
              </span>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ +{config.stars} نجمة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-800 mt-1">
              ألعاب البزل وتركيب روائع التراث السوداني 🇸🇩🧩
            </h2>
          </div>
        </div>

        {/* Quick HUD Metrics */}
        <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
            <Clock className="w-4 h-4 text-purple-600" />
            <span>{formatTime(seconds)}</span>
          </div>
          <div className="h-4 w-px bg-purple-300" />
          <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>الحركات: {moves}</span>
          </div>
          <div className="h-4 w-px bg-purple-300" />
          <div className="flex items-center gap-1 text-xs font-black text-emerald-700">
            <span>{placedCount}/{totalPieces} مكتمل</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. IMAGE SELECTOR TABS & DIFFICULTY TOGGLE                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left: 4 Image Painting Thumbnails */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 border-3 border-purple-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-gray-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>اختر اللوحة التي تريد تركيبها:</span>
            </h3>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              {currentImage.category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PUZZLE_IMAGES.map((img, idx) => {
              const isSelected = selectedImageIdx === idx;
              return (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`group relative rounded-2xl overflow-hidden border-3 transition-all cursor-pointer text-right p-1 ${
                    isSelected
                      ? 'border-[#6C5CE7] bg-purple-50 shadow-md ring-2 ring-purple-300 scale-[1.02]'
                      : 'border-gray-200 hover:border-purple-300 bg-gray-50'
                  }`}
                >
                  <div className="w-full h-16 sm:h-20 rounded-xl overflow-hidden relative">
                    <img 
                      src={img.src} 
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-[#6C5CE7] text-white p-1 rounded-full shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="p-1">
                    <h4 className="text-[11px] font-black text-gray-800 truncate">{img.title}</h4>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Difficulty & Control Buttons */}
        <div className="bg-white rounded-3xl p-4 border-3 border-purple-200 shadow-sm flex flex-col justify-between gap-3">
          <div>
            <h3 className="text-xs font-black text-gray-700 mb-2">مستوى التحدي:</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as PuzzleDifficulty[]).map((lvl) => {
                const isSelected = difficulty === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-1 rounded-xl text-xs font-black text-center transition cursor-pointer border-2 ${
                      isSelected
                        ? 'bg-[#6C5CE7] text-white border-[#5845D8] shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lvl === 'easy' ? 'سهل (4)' : lvl === 'medium' ? 'متوسط (9)' : 'صعب (16)'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowGhost(!showGhost)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer border-2 ${
                showGhost
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
              title="تفعيل أو إخفاء الشفافية المساعدة"
            >
              {showGhost ? <Eye className="w-3.5 h-3.5 text-purple-700" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showGhost ? 'إخفاء المعاينة' : 'إظهار المعاينة'}</span>
            </button>

            <button
              onClick={() => setShowPreviewModal(true)}
              className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-black border-2 border-gray-200 cursor-pointer flex items-center gap-1"
              title="عرض الصورة الأصلية كاملة"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>الأصلية</span>
            </button>

            <button
              onClick={handleUseHint}
              disabled={hintsRemaining <= 0 || loosePieces.length === 0}
              className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-black border-2 border-amber-300 cursor-pointer disabled:opacity-40 flex items-center gap-1"
              title={`استخدم تلميحاً لوضع قطعة (${hintsRemaining} متبقي)`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{hintsRemaining}</span>
            </button>

            <button
              onClick={initPuzzle}
              className="py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-black border-2 border-gray-200 cursor-pointer"
              title="إعادة خلط البزل"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN PUZZLE ARENA (BOARD & SCATTERED PIECES TRAY)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: THE PUZZLE BOARD (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-5 sm:p-6 border-4 border-purple-300 shadow-[0_8px_0_0_#C084FC]">
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-2">
              <span>إطار تجميع اللوحة:</span>
              <span className="text-xs text-purple-700 font-bold">
                {selectedPiece !== null 
                  ? '👉 انقر على الخانة لتثبيت القطعة المحددة' 
                  : '🖐️ اسحب القطعة بإصبعك وأفلتها في مكانها'}
              </span>
            </h3>
            <span className="text-xs font-black text-gray-500">
              {placedCount} / {totalPieces} قطعة
            </span>
          </div>

          {/* Jigsaw Board Grid */}
          <div 
            ref={boardRef}
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border-4 border-purple-400 bg-gray-100 shadow-inner select-none touch-none"
            dir="ltr"
          >
            {/* Ghost Underlying Image (Semi-transparent helper) */}
            {showGhost && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-25 pointer-events-none transition-opacity duration-300"
                style={{ backgroundImage: `url(${currentImage.src})` }}
              />
            )}

            {/* Grid Slots - 100% Number-free tactile slots */}
            <div 
              className="grid w-full h-full"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: totalPieces }).map((_, slotIdx) => {
                const placedPieceIdx = placedPieces[slotIdx];
                const isPlaced = placedPieceIdx !== undefined;
                const isFlashingWrong = wrongSlotFlash === slotIdx;
                const isHovered = hoveredSlot === slotIdx && !isPlaced;

                return (
                  <div
                    key={slotIdx}
                    data-slot-idx={slotIdx}
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`relative border transition-all select-none flex items-center justify-center ${
                      isPlaced
                        ? 'border-white/40 cursor-pointer hover:brightness-105'
                        : isHovered
                        ? 'border-2 border-purple-600 bg-purple-200/70 ring-4 ring-purple-400/60 scale-[1.02] z-10'
                        : isFlashingWrong
                        ? 'bg-red-500/40 border-2 border-red-500 animate-wiggle z-10'
                        : selectedPiece !== null
                        ? 'border-dashed border-purple-400/80 hover:bg-purple-300/30 cursor-pointer'
                        : 'border-dashed border-purple-200/80 bg-white/20'
                    }`}
                  >
                    {/* Placed Piece Graphic */}
                    {isPlaced && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full h-full relative shadow-sm"
                        style={getPieceStyle(placedPieceIdx)}
                      >
                        {/* Subtle completed check badge */}
                        <div className="absolute bottom-1 right-1 bg-black/40 text-white rounded-full p-0.5 opacity-0 hover:opacity-100 transition text-[9px]">
                          ✓
                        </div>
                      </motion.div>
                    )}

                    {/* Empty Slot - Clean & Number-Free */}
                    {!isPlaced && (
                      <div className="w-full h-full flex items-center justify-center pointer-events-none">
                        {isHovered ? (
                          <span className="text-xl sm:text-2xl animate-bounce">✨</span>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-300/40" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completed Glow Effect */}
            {isCompleted && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-cover bg-center z-10 border-4 border-amber-400 shadow-2xl"
                style={{ backgroundImage: `url(${currentImage.src})` }}
              />
            )}
          </div>

          {/* Picture Story Context */}
          <div className="mt-4 p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-right">
            <h4 className="text-xs font-black text-purple-900 mb-1">{currentImage.title}</h4>
            <p className="text-[11px] font-bold text-gray-700 leading-relaxed">{currentImage.desc}</p>
          </div>

        </div>

        {/* RIGHT / BOTTOM: TRAY OF SCATTERED PIECES (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-[32px] p-5 border-4 border-amber-300 shadow-[0_8px_0_0_#F59E0B] space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
              <span>سجادة القطع المبعثرة:</span>
              <span className="text-xs font-bold text-amber-700">({loosePieces.length} متبقية)</span>
            </h3>
            
            <button
              onClick={handleShufflePieces}
              disabled={loosePieces.length <= 1}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition disabled:opacity-30 shadow-xs"
              title="إعادة بعثرة وخلط زوايا القطع"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>خلط وبعثرة 🔀</span>
            </button>
          </div>

          {/* Tray Grid of Scattered Pieces - Organic Rotations without numbers */}
          {loosePieces.length > 0 ? (
            <div 
              className="p-4 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/70 rounded-3xl border-3 border-dashed border-amber-300 max-h-[420px] overflow-y-auto shadow-inner touch-none"
              dir="ltr"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                {loosePieces.map((pieceIdx) => {
                  const isSelected = selectedPiece === pieceIdx;
                  const isBeingDragged = draggingPiece === pieceIdx;
                  const rot = pieceRotations[pieceIdx] || 0;

                  return (
                    <div
                      key={pieceIdx}
                      onPointerDown={(e) => handlePiecePointerDown(e, pieceIdx)}
                      style={{
                        transform: isBeingDragged 
                          ? 'scale(0.85)' 
                          : `rotate(${rot}deg)`,
                        opacity: isBeingDragged ? 0.35 : 1,
                        touchAction: 'none'
                      }}
                      className={`aspect-[16/9] rounded-2xl overflow-hidden border-3 cursor-grab active:cursor-grabbing shadow-md relative transition-all duration-150 select-none ${
                        isSelected
                          ? 'border-[#6C5CE7] ring-4 ring-[#A29BFE] scale-105 shadow-xl'
                          : 'border-white hover:border-amber-400 hover:scale-105 hover:rotate-0'
                      }`}
                    >
                      <div 
                        className="w-full h-full pointer-events-none"
                        style={getPieceStyle(pieceIdx)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-800">
              <div className="text-4xl mb-2">🎉🏆✨</div>
              <h4 className="font-black text-base">تم تركيب جميع القطع بنجاح!</h4>
              <p className="text-xs font-bold text-emerald-700 mt-1">
                يا لك من بطل عبقري! اللوحة اكتملت بجمال فائق.
              </p>
            </div>
          )}

          {/* Helpful Touch & Drag Instructions */}
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 text-[11px] font-bold text-amber-900 text-center leading-relaxed">
            🖐️ <strong>طريقة اللعب:</strong> اسحب أي قطعة مبعثرة بإصبعك وضعها في مكانها الصحيح على اللوحة، أو انقر على القطعة ثم انقر على مكانها!
          </div>

        </div>

      </div>

      {/* Floating Drag Avatar Following Finger */}
      {draggingPiece !== null && pointerPos !== null && (
        <div
          className="fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 select-none touch-none"
          style={{
            left: `${pointerPos.x}px`,
            top: `${pointerPos.y}px`,
            width: dragSize.width > 0 ? `${dragSize.width}px` : '130px',
            height: dragSize.height > 0 ? `${dragSize.height}px` : '74px',
          }}
        >
          <div 
            className="w-full h-full rounded-2xl border-4 border-amber-400 shadow-[0_22px_45px_rgba(0,0,0,0.5)] ring-4 ring-amber-300/80 scale-105"
            style={getPieceStyle(draggingPiece)}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FULL PREVIEW MODAL                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPreviewModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] p-6 max-w-2xl w-full border-4 border-purple-500 shadow-2xl text-right cursor-default"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-gray-800">{currentImage.title}</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-black cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border-3 border-purple-200 mb-4 shadow-md">
                <img src={currentImage.src} alt={currentImage.title} className="w-full h-full object-cover" />
              </div>

              <p className="text-xs font-bold text-gray-600 leading-relaxed mb-4">{currentImage.desc}</p>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5845D8] text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition"
              >
                العودة للتركيب واستكمال التحدي 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. VICTORY CELEBRATION MODAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              className="bg-white rounded-[36px] p-6 sm:p-8 max-w-lg w-full border-4 border-amber-400 shadow-2xl text-center space-y-4"
            >
              <div className="text-6xl animate-bounce">🏆🧩🎉</div>
              
              <h3 className="text-2xl font-black text-purple-900">
                مبروك يا بطل! اكتملت اللوحة الرائعة!
              </h3>

              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border-3 border-amber-400 shadow-lg relative">
                <img src={currentImage.src} alt={currentImage.title} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-xs font-bold">
                  {currentImage.title}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl font-black text-xs">
                  ⏱️ الوقت: {formatTime(seconds)}
                </div>
                <div className="bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl font-black text-xs border border-amber-300">
                  ⭐ +{config.stars} نجمة ذهبية
                </div>
                <div className="bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl font-black text-xs">
                  🎯 الحركات: {moves}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedImageIdx(prev => (prev + 1) % PUZZLE_IMAGES.length);
                  }}
                  className="flex-1 py-3 bg-[#6C5CE7] hover:bg-[#5845D8] text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <span>اللوحة التالية 🎨</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={initPuzzle}
                  className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black text-sm rounded-2xl cursor-pointer transition"
                >
                  إعادة اللعب 🔄
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
