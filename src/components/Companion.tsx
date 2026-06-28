/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Volume2, HelpCircle, RefreshCw, Loader2, Smile } from 'lucide-react';
import { ChatMessage, UserStats } from '../types';

interface CompanionProps {
  stats: UserStats;
  addStars: (amount: number) => void;
}

export default function Companion({ stats, addStars }: CompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'companion',
      text: 'مرحباً بك يا بطل! أنا صديقك البومة الذكية سمسم، المرشد التعليمي في أكاديمية نقلة للأطفال! 🦉🇸🇩 حبابك عشرة بلا كشرة! أنا هنا لمساعدتك على استكشاف أسرار العلوم والفيزياء والتراث السوداني الأصيل! اسألني أي سؤال يخطر ببالك، أو اضغط على الزر بالأسفل لأعطيك أحجية ذكاء مثيرة!',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      emoji: '🦉'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions for kids (quick clicks)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'لماذا تسقط التفاحة على الأرض؟ 🍏',
    'كيف يتكون المطر؟ 🌧️',
    'ما هي النجوم؟ ⭐',
    'أريد أحجية ذكاء يا سمسم! 🧠'
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak text in Arabic using browser synthesis
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Remove emojis and special chars for smoother pronunciation
      const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9; // Kids friendly speed
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert('نظام القراءة الصوتية غير مدعوم في هذا المتصفح');
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-EG')
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      const companionMsg: ChatMessage = {
        sender: 'companion',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        emoji: data.emoji || '🦉',
        suggestedQuestion: data.suggestedQuestion
      };

      setMessages(prev => [...prev, companionMsg]);
      
      // Award stars if they solved/requested a puzzle
      if (textToSend.includes('أحجية') || textToSend.includes('حزورة')) {
        addStars(5); // Encourage asking for riddles!
      } else {
        addStars(2); // Regular chatting rewards
      }

      // Update suggested questions if the AI gave one
      if (data.suggestedQuestion) {
        setSuggestedQuestions(prev => {
          const updated = [data.suggestedQuestion, ...prev.filter(q => q !== data.suggestedQuestion)];
          return updated.slice(0, 4);
        });
      }

      // Automatically speak if desired, or let them click
      speak(data.reply);

    } catch (error) {
      console.error('Error talking to Simsim:', error);
      const errorMsg: ChatMessage = {
        sender: 'companion',
        text: 'أوه! يبدو أن شبكة الإنترنت متعبة قليلاً يا بطل 🦉. لكن لا تقلق، واصل استكشاف الألعاب وسأكون جاهزاً للكلام قريباً!',
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        emoji: '🦉'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[650px] bg-white rounded-[32px] overflow-hidden border-4 border-[#6C5CE7] shadow-[0_8px_0_0_#5044AB]" id="companion-container">
      {/* Companion Header */}
      <div className="bg-[#F0ECFC] p-4 flex items-center justify-between border-b-4 border-[#DED5F9]">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: isSpeaking ? [0, -5, 5, -5, 0] : [0, 2, -2, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: isSpeaking ? 0.5 : 3,
              ease: "easeInOut"
            }}
            className="text-5xl bg-white p-2 rounded-full shadow border-2 border-gray-200"
          >
            🦉
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-[#5044AB] flex items-center gap-2">
              سمسم - مرشد أكاديمية نقلة 🇸🇩 <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            </h2>
            <p className="text-[#6C5CE7] font-bold text-xs mt-0.5">رفيقك الذكي في التفكير النقدي واستكشاف تراث السودان الحبيب!</p>
          </div>
        </div>

        {/* Companion Active Toy accessory if any */}
        {stats.activeToy && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#FF8E3C] text-gray-700 text-sm font-black shadow-sm">
            <span>الملحق الحالي:</span>
            <span className="text-xl animate-bounce">{stats.activeToy}</span>
          </div>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F8FD] [background-size:16px_16px]">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] items-end ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'companion' && (
                <div className="text-3xl bg-white p-1 rounded-full shadow border-2 border-gray-200 shrink-0">
                  {msg.emoji || '🦉'}
                </div>
              )}
              
              <div className={`p-4 rounded-[24px] shadow-sm text-right border-4 ${
                msg.sender === 'user' 
                  ? 'bg-[#FFD93D] border-[#7A6A24] text-gray-800 rounded-br-none shadow-[0_4px_0_0_#D1B02B]' 
                  : 'bg-white border-[#F0ECFC] text-gray-700 rounded-bl-none shadow-[0_4px_0_0_#F0ECFC]'
              }`}>
                <p className="text-base font-black leading-relaxed whitespace-pre-line">{msg.text}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'companion' && (
                    <button
                      onClick={() => speak(msg.text)}
                      className="p-1 hover:bg-[#F0ECFC] rounded-full text-[#6C5CE7] transition cursor-pointer"
                      title="اقرأ لي بصوت عالٍ"
                      id={`speak-btn-${index}`}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%] items-center">
              <div className="text-3xl animate-bounce">🦉</div>
              <div className="bg-white border-4 border-[#F0ECFC] p-4 rounded-[24px] rounded-bl-none shadow-[0_4px_0_0_#F0ECFC] flex items-center gap-2 text-gray-600 font-bold">
                <Loader2 className="w-5 h-5 animate-spin text-[#6C5CE7]" />
                <span>سمسم يفكّر بذكاء ويجهّز لك رداً رائعاً...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Bubbles for Kids */}
      <div className="bg-[#F0ECFC]/30 p-4 border-t-4 border-[#F0ECFC]">
        <p className="text-xs text-[#5044AB] mb-2 font-black flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> اختر سؤالاً سريعاً لتسأله لسمسم:
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={i}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="bg-white hover:bg-[#F0ECFC] border-4 border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-xl shadow-[0_3px_0_0_#D1D1D1] hover:border-gray-300 transition font-black text-right cursor-pointer"
              id={`suggested-question-${i}`}
            >
              {q}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSendMessage('أعطني أحجية علمية أو سؤال ذكاء يا سمسم! 🧠')}
            disabled={isLoading}
            className="bg-[#A55EEA] hover:bg-[#8843C7] border-4 border-[#8843C7] text-white text-xs px-3 py-1.5 rounded-xl shadow-[0_3px_0_0_#8843C7] transition font-black cursor-pointer flex items-center gap-1"
            id="ask-riddle-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" /> أعطني أحجية ذكاء!
          </motion.button>
        </div>
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputText);
        }}
        className="p-3 bg-white border-t-4 border-[#F0ECFC] flex gap-2"
        id="companion-form"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب سؤالك لسمسم هنا (مثال: لماذا تطير الطائرة؟)..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border-4 border-[#F0ECFC] rounded-2xl text-right text-gray-800 focus:outline-none focus:border-[#6C5CE7] text-base placeholder-gray-400 bg-white"
          id="companion-input"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="bg-[#FFD93D] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 text-gray-800 border-4 border-[#7A6A24] px-5 py-3 rounded-2xl font-black shadow-[0_4px_0_0_#D1B02B] hover:translate-y-[1px] hover:shadow-[0_3px_0_0_#D1B02B] active:translate-y-[3px] active:shadow-none transition-all duration-100 shrink-0 cursor-pointer flex items-center justify-center"
          id="companion-send-btn"
        >
          <Send className="w-5 h-5 transform rotate-180" />
        </motion.button>
      </form>
    </div>
  );
}
