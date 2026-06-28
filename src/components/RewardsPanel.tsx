/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, Flame, Star, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import { Badge, UserStats } from '../types';

interface RewardsPanelProps {
  stats: UserStats;
}

export default function RewardsPanel({ stats }: RewardsPanelProps) {
  const badgesList: Badge[] = [
    {
      id: 'badge_nature',
      name: 'مستكشف الطبيعة 🍏',
      description: 'للقيام بأولى التجارب الفيزيائية واستكشاف الجاذبية!',
      icon: '🧪',
      starsRequired: 20,
      color: 'bg-emerald-500'
    },
    {
      id: 'badge_math',
      name: 'بروفيسور الحساب 🧮',
      description: 'لحل أسئلة العد الحسابي وقطار الأرقام بذكاء وسرعة!',
      icon: '📐',
      starsRequired: 50,
      color: 'bg-amber-500'
    },
    {
      id: 'badge_arabic',
      name: 'فارس الضاد العربي 📝',
      description: 'لتجاوز تحديات الحروف والكلمات العربية وتركيبها السحري!',
      icon: '✏️',
      starsRequired: 80,
      color: 'bg-rose-500'
    },
    {
      id: 'badge_english',
      name: 'رائد اللغات العالمي 🇬🇧',
      description: 'لمطابقة الحروف الإنجليزية وتهجئة الكلمات بالشكل الصحيح!',
      icon: '🌍',
      starsRequired: 110,
      color: 'bg-violet-500'
    },
    {
      id: 'badge_super',
      name: 'حكيم المعرفة الخارق 🎓',
      description: 'التاج الأسمى لمن أحرز رصيداً كبيراً جداً وتحدث مع البومة سمسم!',
      icon: '👑',
      starsRequired: 150,
      color: 'bg-indigo-600'
    }
  ];

  const currentLevelProgress = (stats.stars % 50) * 2; // Level advances every 50 stars
  const starsNeededForNextLevel = 50 - (stats.stars % 50);

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#4ECDC4] shadow-[0_8px_0_0_#3DA199]" id="rewards-panel-container">
      {/* Top Banner */}
      <div className="text-center mb-8 bg-[#FFD93D] p-6 rounded-[24px] shadow-[0_6px_0_0_#D1B02B] border-4 border-[#7A6A24]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-6xl inline-block mb-2"
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-black text-[#4D4D4D]">قاعة الأوسمة والميداليات الكبرى!</h2>
        <p className="text-[#7A6A24] font-bold text-sm mt-1">هنا تحتفظ بإنجازاتك الرائعة لتريها لعائلتك وأصدقائك!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Streak Counter Card */}
        <div className="bg-[#FFF5EE] border-4 border-[#FF8E3C] rounded-2xl p-5 flex items-center justify-between shadow-[0_4px_0_0_#CC7130]">
          <div className="text-right">
            <p className="text-gray-500 text-xs font-black">حماس متواصل (النشاط الحالي):</p>
            <p className="text-2xl font-black text-[#CC7130] mt-1">{stats.streak} أيام متتالية!</p>
            <p className="text-[11px] text-gray-500 font-bold mt-1">العب كل يوم لتحافظ على شعلتك متقدة!</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-5xl"
          >
            🔥
          </motion.div>
        </div>

        {/* Level Card */}
        <div className="bg-[#FAF6FE] border-4 border-[#E2CEF9] rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_0_0_#C5A2F3] md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs bg-[#E2CEF9] border-2 border-[#A55EEA] text-[#8843C7] font-black px-3 py-1 rounded-xl">
              المستوى الحالي: {stats.level} 🌟
            </span>
            <span className="text-xs text-[#8843C7] font-black">
              تحتاج {starsNeededForNextLevel} نجمة للمستوى القادم
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white h-7 rounded-full overflow-hidden border-4 border-[#E2CEF9] relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentLevelProgress}%` }}
              className="bg-gradient-to-r from-[#A55EEA] to-[#6C5CE7] h-full rounded-full"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-gray-700">
              {currentLevelProgress / 2} / 50 نجوم
            </span>
          </div>
        </div>
      </div>

      {/* Badges Collection */}
      <div>
        <h3 className="text-xl font-black text-gray-800 text-right mb-4 flex items-center gap-2 justify-end">
          مجموعتك من الميداليات الاستكشافية <Sparkles className="w-5 h-5 text-amber-500" />
        </h3>
        
        <div className="space-y-4">
          {badgesList.map((badge) => {
            const isUnlocked = stats.stars >= badge.starsRequired;

            return (
              <motion.div
                key={badge.id}
                className={`p-4 rounded-2xl border-4 flex flex-col sm:flex-row items-center sm:justify-between gap-4 transition ${
                  isUnlocked
                    ? 'bg-[#FFFDF5] border-[#FFEAA7] shadow-[0_4px_0_0_#FFEAA7]'
                    : 'bg-gray-50 border-gray-200 shadow-none opacity-60'
                }`}
                id={`badge-card-${badge.id}`}
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
                  {/* Badge Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow border-4 border-white shrink-0 ${
                    isUnlocked ? badge.color + ' text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-800 flex items-center justify-center sm:justify-start gap-1.5">
                      {badge.name}
                      {isUnlocked && <CheckCircle className="w-4 h-4 text-green-500 fill-green-100 shrink-0" />}
                    </h4>
                    <p className="text-xs text-gray-500 font-bold mt-1">{badge.description}</p>
                    <p className="text-[10px] font-black text-gray-400 mt-0.5">
                      مطلوب لفتحها: {badge.starsRequired} نجوم ⭐
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {isUnlocked ? (
                    <span className="bg-green-100 text-green-800 border-2 border-green-200 font-black text-xs px-3 py-1 rounded-full flex items-center gap-1">
                      👑 تم فتحها بنجاح!
                    </span>
                  ) : (
                    <span className="bg-gray-200 text-gray-600 font-black text-xs px-3 py-1 rounded-full">
                      🔒 مغلقة ({stats.stars} / {badge.starsRequired} نجمة)
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
