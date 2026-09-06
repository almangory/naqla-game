/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Edit2, CheckCircle, RefreshCw, Palette, Download, Stamp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface DrawingGameProps {
  addStars: (amount: number) => void;
}

const STAMPS = [
  { id: 'pyramid', emoji: '⛰️', label: 'هرم مروي' },
  { id: 'palm', emoji: '🌴', label: 'نخلة' },
  { id: 'camel', emoji: '🐪', label: 'جمل' },
  { id: 'flag', emoji: '🇸🇩', label: 'علم السودان' },
  { id: 'coffee', emoji: '☕', label: 'الجبنة' },
  { id: 'owl', emoji: '🦉', label: 'سمسم' },
  { id: 'star', emoji: '⭐', label: 'نجمة' },
];

export default function DrawingGame({ addStars }: DrawingGameProps) {
  const { playClick, playStarSound } = useSoundEffects();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [activeStamp, setActiveStamp] = useState<string | null>(null);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [drawnSomething, setDrawnSomething] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const drawingPrompts = [
    { text: 'ارسم أهرامات البجراوية السودانية العظيمة ⛰️', stars: 20 },
    { text: 'ارسم جمل الصحراء الصبور ذو السنامين 🐪', stars: 15 },
    { text: 'ارسم علم السودان الحبيب يرفرف (أحمر، أبيض، أسود، ومثلث أخضر) 🇸🇩', stars: 20 },
    { text: 'ارسم النيلين (الأزرق والأبيض) وهما يلتقيان في الخرطوم 🌊', stars: 15 },
    { text: 'ارسم "الجبنة" الطينية السودانية التقليدية لصنع القهوة ☕', stars: 15 }
  ];
  
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width || containerRef.current.clientWidth || 600, 300);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx && canvas.width > 0 && canvas.height > 0) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    canvas.width = width;
    canvas.height = 420;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (tempCtx && tempCanvas.width > 0 && tempCanvas.height > 0) {
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    }
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const pos = getCoordinates(e);

    // If stamp is active, stamp emoji onto canvas
    if (activeStamp) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const stampObj = STAMPS.find(s => s.id === activeStamp);
      if (stampObj) {
        ctx.font = '42px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(stampObj.emoji, pos.x, pos.y);
        setDrawnSomething(true);
        playClick();
      }
      return;
    }

    setIsDrawing(true);
    setLastPos(pos);
    setDrawnSomething(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeStamp) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
    
    setLastPos(pos);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawnSomething(false);
    setFeedback(null);
    playClick();
  };

  const downloadArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageUri = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `لوحة_أكاديمية_نقلة_${Date.now()}.png`;
    link.href = imageUri;
    link.click();
    playClick();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const finishDrawing = () => {
    if (!drawnSomething) {
      setFeedback('ارسم أي شيء جميل أولاً على لوحة التلوين! 🎨✨');
      return;
    }
    
    const reward = drawingPrompts[currentPromptIdx].stars;
    addStars(reward);
    playStarSound();
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 } });
    setFeedback(`يا للرووووعة! لقد رسمت لوحة مذهلة ومتقنة تستحق التقدير! كسبت ${reward} نجمة ذهبية! ⭐🎨`);
  };

  const nextChallenge = () => {
    setCurrentPromptIdx(prev => (prev + 1) % drawingPrompts.length);
    clearCanvas();
  };

  const colors = [
    { hex: '#FF6B6B', name: 'أحمر قاني' },
    { hex: '#4ECDC4', name: 'نيلوز' },
    { hex: '#1DD1A1', name: 'أخضر زاهي' },
    { hex: '#FFD93D', name: 'أصفر ذهبي' },
    { hex: '#FF8E3C', name: 'برتقالي' },
    { hex: '#6C5CE7', name: 'بنفسجي سحري' },
    { hex: '#F4A460', name: 'رملي سوداني' },
    { hex: '#2C3E50', name: 'أسود داكن' },
    { hex: '#54A0FF', name: 'أزرق النيل' },
    { hex: '#FF9FF3', name: 'وردي لطيف' }
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130]" id="drawing-game-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-orange-50 pb-4 gap-3">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#CC7130] flex items-center gap-2">
            🎨 مرسم الألوان والفرشاة السحرية 🇸🇩
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">
            أطلق العنان لخيالك، ارسم لوحات مستوحاة من البيئة والتراث السوداني الأصيل واكسب النجوم!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadArtwork}
            className="bg-[#2ECC71] text-white border-2 border-green-700 font-black px-3.5 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-green-600 transition cursor-pointer"
            title="حفظ اللوحة على جهازك"
          >
            <Download className="w-4 h-4" /> حفظ اللوحة
          </button>
          <button
            onClick={nextChallenge}
            className="bg-[#FFD93D] text-[#7A6A24] border-2 border-[#7A6A24] font-black px-3.5 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-sm hover:bg-yellow-400 transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> تحدٍ آخر
          </button>
        </div>
      </div>

      {/* Drawing Prompt Banner */}
      <div className="bg-[#FFF5EE] border-4 border-[#FF8E3C] rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="text-4xl select-none">💡</span>
        <div className="text-right">
          <p className="text-[#CC7130] font-black text-xs">تحدي الرسم الحالي للاعب الذكي:</p>
          <p className="text-[#4D4D4D] font-black text-sm sm:text-base mt-0.5">
            {drawingPrompts[currentPromptIdx].text}
          </p>
        </div>
      </div>

      {/* Sudanese Heritage Stamps Toolbar */}
      <div className="mb-4 p-3 bg-amber-50/80 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-amber-900 flex items-center gap-1">
            <span>✨ طوابع وأختام التراث السوداني:</span>
            <span className="text-[10px] text-gray-500 font-normal">(اختر ختماً واضغط على اللوحة لتثبيته!)</span>
          </span>
          {activeStamp && (
            <button
              onClick={() => setActiveStamp(null)}
              className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded-lg font-bold hover:bg-red-200"
            >
              إلغاء الختم والعودة للفرشاة 🖌️
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {STAMPS.map((stamp) => (
            <button
              key={stamp.id}
              onClick={() => {
                setActiveStamp(activeStamp === stamp.id ? null : stamp.id);
                setIsEraser(false);
                playClick();
              }}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                activeStamp === stamp.id
                  ? 'bg-amber-400 border-amber-600 scale-105 shadow-sm text-gray-900'
                  : 'bg-white border-amber-200 hover:bg-amber-100 text-gray-700'
              }`}
            >
              <span className="text-lg">{stamp.emoji}</span>
              <span>{stamp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef} 
        className="w-full border-4 border-[#FF8E3C] rounded-2xl overflow-hidden shadow-inner bg-white mb-6 relative touch-none cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handlePointerDown}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full block"
        />
      </div>

      {/* Controls: Colors and Tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-4 border-orange-50 pt-4">
        {/* Colors Palette */}
        <div className="flex items-center gap-2 flex-wrap">
          <Palette className="w-5 h-5 text-gray-500 mr-1" />
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                setIsEraser(false);
                setActiveStamp(null);
                playClick();
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer shadow-sm ${
                color === c.hex && !isEraser && !activeStamp
                  ? 'scale-125 border-gray-800 ring-2 ring-orange-400' 
                  : 'border-white hover:scale-110'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Brush Size & Tools */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsEraser(!isEraser);
              setActiveStamp(null);
              playClick();
            }}
            className={`px-3 py-2 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
              isEraser 
                ? 'bg-red-500 border-red-700 text-white' 
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>🧹 ممحاة</span>
          </button>

          <button
            onClick={clearCanvas}
            className="px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> تنظيف
          </button>

          <button
            onClick={finishDrawing}
            className="px-5 py-2.5 bg-[#FF6B6B] hover:bg-red-500 text-white border-2 border-red-700 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> اعتماد اللوحة وكسب النجوم! ⭐
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-50 border-2 border-green-300 rounded-xl text-center text-xs font-black text-green-800"
        >
          {feedback}
        </motion.div>
      )}
    </div>
  );
}
