/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameCategory = 
  | 'home' 
  | 'science' 
  | 'math' 
  | 'arabic' 
  | 'english' 
  | 'companion' 
  | 'shop' 
  | 'rewards' 
  | 'drawing' 
  | 'sudan_explore' 
  | 'sudan_quiz' 
  | 'sudan_memory' 
  | 'sudan_dictionary'
  | 'pyramid_stacker'
  | 'sudan_rhythm'
  | 'alphabet_train'
  | 'kids_coding'
  | 'games_100_hub';

export interface UserStats {
  stars: number;
  level: number;
  streak: number;
  badges: string[];
  unlockedToys: string[];
  activeToy: string | null;
  lastPlayedDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  starsRequired: number;
  color: string;
}

export interface ToyItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  category: string;
  description: string;
}

export interface ChatMessage {
  sender: 'user' | 'companion';
  text: string;
  timestamp: string;
  emoji?: string;
  suggestedQuestion?: string;
}
