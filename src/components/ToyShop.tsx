/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { ToyItem, UserStats } from '../types';

interface ToyShopProps {
  stats: UserStats;
  unlockToy: (toyId: string, cost: number) => void;
  equipToy: (toyId: string | null) => void;
}

export default function ToyShop({ stats, unlockToy, equipToy }: ToyShopProps) {
  const shopItems: ToyItem[] = [
    {
      id: 'hat_grad',
      name: 'قبعة التخرج الجامعية 🎓',
      emoji: '🎓',
      cost: 50,
      category: 'ملابس',
      description: 'لتصبح البومة سمسم مجهزة بأرقى شهادات العلم والابتكار!'
    },
    {
      id: 'glasses_spy',
      name: 'النظارة الذكية اللطيفة 🕶️',
      emoji: '🕶️',
      cost: 30,
      category: 'نظارات',
      description: 'نظارات المعرفة والذكاء الخارق لقراءة الكتب والخرائط!'
    },
    {
      id: 'crown_gold',
      name: 'تاج ملوك المعرفة 👑',
      emoji: '👑',
      cost: 100,
      category: 'ملابس',
      description: 'تاج ذهبي يليق بالملوك الصغار الذين أتموا حل كافة التحديات!'
    },
    {
      id: 'cape_hero',
      name: 'وشاح البطل الخارق 🦸',
      emoji: '🦸',
      cost: 70,
      category: 'وشاح',
      description: 'رداء أحمر طائر يمنح سمسم القدرة على التحليق بسرعة الضوء!'
    },
    {
      id: 'palette_artist',
      name: 'لوحة الألوان السحرية 🎨',
      emoji: '🎨',
      cost: 40,
      category: 'ألعاب',
      description: 'علبة ألوان مذهلة لطلاء الألعاب وتصميم اللوحات البديعة!'
    },
    {
      id: 'medal_gold',
      name: 'ميدالية العلوم الذهبية 🏅',
      emoji: '🏅',
      cost: 60,
      category: 'أوسمة',
      description: 'وسام شرف يعلق لسمسم تكريماً لجهوده الكبيرة في الاستكشاف!'
    }
  ];

  const handlePurchase = (item: ToyItem) => {
    if (stats.unlockedToys.includes(item.id)) {
      // If already owned, toggles equipping
      if (stats.activeToy === item.emoji) {
        equipToy(null); // Unequip
      } else {
        equipToy(item.emoji); // Equip
      }
    } else {
      // Try to purchase
      if (stats.stars >= item.cost) {
        unlockToy(item.id, item.cost);
        equipToy(item.emoji); // Automatically equip on buy
      } else {
        alert(`أوه يا بطل! أنت بحاجة إلى ${item.cost - stats.stars} نجمة إضافية لشراء هذا العنصر الرائع. استمر باللعب لجمع المزيد! ⭐`);
      }
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#FF8E3C] shadow-[0_8px_0_0_#CC7130]" id="toy-shop-container">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b-4 border-[#FFF5EE] pb-4">
        <div className="text-right">
          <h2 className="text-3xl font-black text-[#CC7130] flex items-center gap-2">
            🧸 متجر الجوائز والألعاب السحري 🎨
          </h2>
          <p className="text-gray-500 font-bold text-sm mt-1">استبدل نجومك المتراكمة بأجمل الملحقات لتزيين صديقك سمسم!</p>
        </div>
        <div className="flex items-center gap-2 bg-[#FFF5EE] px-4 py-2 rounded-2xl border-4 border-[#FF8E3C] mt-4 sm:mt-0">
          <span className="text-sm font-black text-[#CC7130]">رصيد نجومك:</span>
          <span className="bg-[#FFD93D] text-[#7A6A24] border-2 border-[#7A6A24] font-black px-3 py-1 rounded-full text-lg flex items-center gap-1 shadow-sm">
            {stats.stars} <Star className="w-5 h-5 fill-[#7A6A24] text-[#7A6A24]" />
          </span>
        </div>
      </div>

      {/* Grid of Store Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shopItems.map((item) => {
          const isOwned = stats.unlockedToys.includes(item.id);
          const isActive = stats.activeToy === item.emoji;

          return (
            <motion.div
              whileHover={{ y: -4 }}
              key={item.id}
              className={`bg-white rounded-2xl border-4 p-5 flex flex-col justify-between transition ${
                isActive
                  ? 'border-[#4ECDC4] shadow-[0_6px_0_0_#3DA199]'
                  : isOwned
                    ? 'border-[#FF8E3C] shadow-[0_6px_0_0_#CC7130]'
                    : 'border-gray-200 shadow-[0_6px_0_0_#E2E8F0]'
              }`}
              id={`shop-item-${item.id}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-black px-2.5 py-1 bg-[#FFF5EE] border-2 border-[#FF8E3C] text-[#CC7130] rounded-xl">
                    {item.category}
                  </span>
                  {!isOwned && (
                    <span className="flex items-center gap-1 text-sm font-black text-[#CC7130]">
                      {item.cost} <Star className="w-4 h-4 fill-[#FFD93D] text-[#7A6A24]" />
                    </span>
                  )}
                </div>

                <div className="text-center my-4">
                  <motion.div
                    animate={isActive ? { y: [0, -6, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-6xl select-none filter drop-shadow-md inline-block"
                  >
                    {item.emoji}
                  </motion.div>
                </div>

                <h3 className="text-base font-black text-gray-800 text-right mb-1">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 font-bold text-right leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div>
                <button
                  onClick={() => handlePurchase(item)}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-[#4ECDC4] text-white border-4 border-[#3DA199] shadow-[0_4px_0_0_#3DA199] active:translate-y-[2px] active:shadow-none'
                      : isOwned
                        ? 'bg-[#6C5CE7] text-white border-4 border-[#5044AB] shadow-[0_4px_0_0_#5044AB] active:translate-y-[2px] active:shadow-none'
                        : stats.stars >= item.cost
                          ? 'bg-[#FFD93D] text-gray-800 border-4 border-[#7A6A24] shadow-[0_4px_0_0_#D1B02B] active:translate-y-[2px] active:shadow-none'
                          : 'bg-gray-100 text-gray-400 border-4 border-gray-200 cursor-not-allowed'
                  }`}
                  id={`purchase-btn-${item.id}`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4" /> مجهّز حالياً (تزيين)
                    </>
                  ) : isOwned ? (
                    'اضغط لتزيين سمسم بها'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> فتح الملحق بمقابل {item.cost} نجمة
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="mt-8 bg-[#FFFDF5] rounded-2xl p-4 border-4 border-[#FFD93D] flex items-center gap-3">
        <div className="text-3xl">🦉</div>
        <div className="text-right">
          <p className="text-amber-950 font-black text-sm">نصيحة المعلم سمسم للادخار:</p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            "جمع النجوم فكرة ذكية! تماماً كادخار المال لشراء لعبة تحبها. استمر بالحل الصحيح للتحديات لتزينني بكل الملحقات الرائعة!"
          </p>
        </div>
      </div>
    </div>
  );
}
