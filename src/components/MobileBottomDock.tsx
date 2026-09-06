import React from 'react';
import { motion } from 'motion/react';
import { Home, Gamepad2, Landmark, Trophy, Palette } from 'lucide-react';

export type MobileNavSection = 'home' | 'games' | 'sudan' | 'rewards' | 'settings';

interface MobileBottomDockProps {
  activeNav: MobileNavSection;
  onSelectNav: (section: MobileNavSection) => void;
  stars: number;
  level: number;
  playClickSound?: () => void;
}

export const MobileBottomDock: React.FC<MobileBottomDockProps> = ({
  activeNav,
  onSelectNav,
  stars,
  level,
  playClickSound
}) => {
  const dockItems: {
    id: MobileNavSection;
    label: string;
    icon: React.ReactNode;
    activeColor: string;
    shadowColor: string;
  }[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: <Home className="w-5 h-5" />,
      activeColor: 'bg-[#FF6B6B] text-white',
      shadowColor: 'shadow-[0_4px_12px_rgba(255,107,107,0.4)]'
    },
    {
      id: 'games',
      label: 'الألعاب',
      icon: <Gamepad2 className="w-5 h-5" />,
      activeColor: 'bg-[#4ECDC4] text-white',
      shadowColor: 'shadow-[0_4px_12px_rgba(78,205,196,0.4)]'
    },
    {
      id: 'sudan',
      label: 'كوش 🇸🇩',
      icon: <Landmark className="w-5 h-5" />,
      activeColor: 'bg-[#FF8E3C] text-white',
      shadowColor: 'shadow-[0_4px_12px_rgba(255,142,60,0.4)]'
    },
    {
      id: 'rewards',
      label: 'أوسمتي',
      icon: <Trophy className="w-5 h-5" />,
      activeColor: 'bg-[#FFD93D] text-gray-900',
      shadowColor: 'shadow-[0_4px_12px_rgba(255,217,61,0.4)]'
    },
    {
      id: 'settings',
      label: 'غرفتي',
      icon: <Palette className="w-5 h-5" />,
      activeColor: 'bg-[#6C5CE7] text-white',
      shadowColor: 'shadow-[0_4px_12px_rgba(108,92,231,0.4)]'
    }
  ];

  return (
    <nav 
      className="fixed bottom-2.5 inset-x-3 sm:inset-x-6 z-40 max-w-md mx-auto" 
      dir="rtl"
      aria-label="شريط التنقل السفلي للجوال"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border-2 border-amber-200/80 p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.14)] flex items-center justify-between safe-bottom-dock">
        {dockItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (playClickSound) playClickSound();
                onSelectNav(item.id);
              }}
              className="relative flex-1 py-1.5 px-2 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all cursor-pointer select-none active:scale-90"
              id={`mobile-dock-${item.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileDockActivePill"
                  className={`absolute inset-0 rounded-2xl ${item.activeColor} ${item.shadowColor}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                />
              )}

              <span className={`relative z-10 transition-transform duration-200 ${isActive ? 'scale-110' : 'text-gray-500 hover:text-gray-800'}`}>
                {item.icon}
              </span>

              <span
                className={`relative z-10 text-[11px] font-black transition-colors ${
                  isActive ? (item.id === 'rewards' ? 'text-gray-900' : 'text-white') : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>

              {item.id === 'rewards' && (
                <span className="absolute -top-1 -right-1 bg-amber-400 border border-white text-[9px] font-black text-amber-950 px-1.5 py-0.2 rounded-full shadow-xs">
                  {level}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomDock;
