/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Edit2, CheckCircle, RefreshCw, Palette } from 'lucide-react';

interface DrawingGameProps {
  addStars: (amount: number) => void;
}

export default function DrawingGame({ addStars }: DrawingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B');
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [drawnSomething, setDrawnSomething] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Creative Drawing Prompts (Sudanese Traditional / Cultural inspiration!)
  const drawingPrompts = [
    { text: 'ارسم أهرامات البجراوية السودانية العظيمة ⛰️', stars: 20 },
    { text: 'ارسم جمل الصحراء الصبور ذو السنامين 🐪', stars: 15 },
    { text: 'ارسم علم السودان الحبيب يرفرف (أحمر، أبيض، أسود، ومثلث أخضر) 🇸🇩', stars: 20 },
    { text: 'ارسم النيلين (الأزرق والأبيض) وهما يلتقيان في الخرطوم 🌊', stars: 15 },
    { text: 'ارسم "الجبنة" الطينية السودانية التقليدية لصنع القهوة ☕', stars: 15 }
  ];
  
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);

  // Resize canvas according to parent size and preserve drawing
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width || containerRef.current.clientWidth || 600, 300);

    // Temporary save content
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx && canvas.width > 0 && canvas.height > 0) {
      tempCtx.drawImage(canvas, 0, 0);
    }

    // Set new size from parent
    canvas.width = width;
    canvas.height = 420; // fixed height for better layout

    // Fill with white first, then draw the temp content to keep white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Re-draw saved content if there was any
    if (tempCtx && tempCanvas.width > 0 && tempCanvas.height > 0) {
      ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
    }
    
    // Set styles again
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    resizeCanvas();
    // A small timeout ensures layout is finished and we get the correct size
    const timer = setTimeout(resizeCanvas, 100);
    window.addEventListener('resize', resizeCanvas);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Initialize canvas defaults on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Fill background with light yellow-white to ensure clean base
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getCoordinates(e);
    setIsDrawing(true);
    setLastPos(pos);
    setDrawnSomething(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
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
  };

  const finishDrawing = () => {
    if (!drawnSomething) {
      setFeedback('ارسم أي شيء جميل أولاً على لوحة التلوين! 🎨✨');
      return;
    }
    
    const reward = drawingPrompts[currentPromptIdx].stars;
    addStars(reward);
    setFeedback(`يا للرووووعة! لقد رسمت لوحة مذهلة ومتقنة تستحق التقدير! كسبت ${reward} نجمة ذهبية! ⭐🎨`);
  };

  const nextChallenge = () => {
    setCurrentPromptIdx(prev => (prev + 1) % drawingPrompts.length);
    clearCanvas();
  };

  // Fun colors for children (including Sudanese touch: desert sand #F4A460, flag colors)
  const colors = [
    { hex: '#FF6B6B', name: 'أحمر قاني' },
    { hex: '#4ECDC4', name: 'نيلوز' },
    { hex: '#1DD1A1', name: 'أخضر زاهي' },
    { hex: '#FFD93D', name: 'أصفر ذهبي' },
    { hex: '#FF8E3C', name: 'برتقالي' },
    { hex: '#6C5CE7', name: 'بنفسجي سحري' },
    { hex: '#F4A460', name: 'رملي سوداني' }, // Warm Sudanese desert sand tone
    { hex: '#2C3E50', name: 'أسود داكن' },
    { hex: '#54A0FF', name: 'أزرق النيل' }, // Nile Blue
    { hex: '#FF9FF3', name: 'وردي لطيف' }
  ];

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130]" id="drawing-game-container">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-4 border-orange-50 pb-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#CC7130] flex items-center gap-2">
            🎨 مرسم الألوان والفرشاة السحرية 🇸🇩
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">
            أطلق العنان لخيالك، ارسم لوحات مستوحاة من البيئة والتراث السوداني الأصيل واكسب النجوم!
          </p>
        </div>
        <button
          onClick={nextChallenge}
          className="mt-3 md:mt-0 bg-[#FFD93D] text-[#7A6A24] border-4 border-[#7A6A24] font-black px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[2px] hover:shadow-none transition cursor-pointer"
          id="change-challenge-btn"
        >
          <RefreshCw className="w-4 h-4" /> تحدٍ آخر للرسم
        </button>
      </div>

      {/* Drawing Prompt Alert Banner */}
      <div className="bg-[#FFF5EE] border-4 border-[#FF8E3C] rounded-2xl p-4 mb-6 flex items-center gap-3">
        <span className="text-4xl select-none">💡</span>
        <div className="text-right">
          <p className="text-[#CC7130] font-black text-sm">تحدي الرسم الحالي للاعب الذكي:</p>
          <p className="text-[#4D4D4D] font-black text-base mt-1">
            {drawingPrompts[currentPromptIdx].text}
          </p>
        </div>
      </div>

      {/* Main Grid: Tools left, Canvas right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Paint Box & Controls Sidebar */}
        <div className="bg-orange-50/50 p-4 rounded-[24px] border-4 border-[#FFC499] flex flex-col gap-4">
          
          {/* Colors Selection */}
          <div>
            <h3 className="font-black text-sm text-[#CC7130] mb-2 flex items-center gap-1">
              <Palette className="w-4 h-4" /> اختر الألوان:
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setColor(c.hex);
                    setIsEraser(false);
                  }}
                  className={`w-9 h-9 rounded-xl border-3 transition-transform cursor-pointer relative ${
                    color === c.hex && !isEraser
                      ? 'border-[#CC7130] scale-110 shadow-md'
                      : 'border-white hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  id={`color-btn-${c.hex.replace('#', '')}`}
                />
              ))}
            </div>
          </div>

          {/* Eraser and Pen selection */}
          <div className="flex gap-2">
            <button
              onClick={() => setIsEraser(false)}
              className={`flex-1 py-2 rounded-xl border-3 font-black text-xs cursor-pointer flex items-center justify-center gap-1 transition ${
                !isEraser
                  ? 'bg-[#FF8E3C] border-[#CC7130] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              id="tool-pen-btn"
            >
              <Edit2 className="w-4 h-4" /> قلم التلوين
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`flex-1 py-2 rounded-xl border-3 font-black text-xs cursor-pointer flex items-center justify-center gap-1 transition ${
                isEraser
                  ? 'bg-[#FF8E3C] border-[#CC7130] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              id="tool-eraser-btn"
            >
              🧽 الممحاة
            </button>
          </div>

          {/* Brush Size Slider */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-black text-gray-600">
              <span>حجم الفرشاة:</span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-gray-300 font-mono">{brushSize}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-full accent-[#FF8E3C] cursor-pointer"
              id="brush-size-slider"
            />
            {/* Visual preview of brush size */}
            <div className="flex justify-center items-center mt-2 bg-white h-8 rounded-lg border border-gray-200">
              <div 
                className="rounded-full"
                style={{
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  backgroundColor: isEraser ? '#D1D1D1' : color
                }}
              />
            </div>
          </div>

          {/* Clear & Action Buttons */}
          <div className="space-y-2 mt-auto">
            <button
              onClick={clearCanvas}
              className="w-full py-2.5 bg-white hover:bg-red-50 text-red-500 border-4 border-red-200 rounded-xl font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5"
              id="clear-canvas-btn"
            >
              <Trash2 className="w-4 h-4" /> مسح كامل اللوحة
            </button>

            <button
              onClick={finishDrawing}
              className="w-full py-3 bg-[#4ECDC4] hover:bg-[#3DA199] text-white border-4 border-[#3DA199] rounded-xl font-black text-sm cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_0_0_#3DA199] active:translate-y-[2px] active:shadow-none transition-all"
              id="finish-drawing-btn"
            >
              <CheckCircle className="w-5 h-5" /> إنهاء وعرض اللوحة على سمسم ⭐
            </button>
          </div>

        </div>

        {/* Canvas Screen */}
        <div className="lg:col-span-3 flex flex-col justify-between" ref={containerRef}>
          <div className="border-4 border-dashed border-[#FFC499] rounded-[24px] overflow-hidden bg-white shadow-inner relative cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="block w-full h-[420px]"
            />
            
            {/* Background guide prompt helper */}
            {!drawnSomething && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                <span className="text-6xl animate-pulse">✨🎨</span>
                <p className="text-gray-400 font-black text-base mt-3">ارسم حلمك هنا! استخدم الفرشاة واللمسات السحرية.</p>
                <p className="text-gray-400 text-xs mt-1 font-bold">يدعم الرسم باللمس والماوس معاً.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Feedback & Award Panel */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="mt-6 bg-[#FFF9E6] border-4 border-[#FFD93D] p-5 rounded-[24px] flex items-start gap-4 shadow-[0_6px_0_0_#D1B02B]"
            id="drawing-feedback-box"
          >
            <div className="text-4xl">🦉</div>
            <div>
              <h4 className="text-[#CC9300] font-black text-lg mb-1">تعليق البومة الحكيمة سمسم:</h4>
              <p className="text-gray-700 font-bold text-sm leading-relaxed">{feedback}</p>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                تذكر أن كل رسمة هي لوحة فريدة ومبهجة تلون عالمنا بالأمل والإبداع! استمر بالرسم لتكسب أوسمة الإبداع والفن الرائع.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
