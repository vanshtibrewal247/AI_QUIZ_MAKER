'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Difficulty } from '@/types/quiz';

interface AdaptiveDifficultyBadgeProps {
  difficulty: Difficulty;
  isChanging?: boolean;
}

export function AdaptiveDifficultyBadge({
  difficulty,
  isChanging = false,
}: AdaptiveDifficultyBadgeProps) {
  const getDifficultyColor = (diff: Difficulty): { bg: string; text: string; border: string } => {
    switch (diff) {
      case Difficulty.EASY:
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
      case Difficulty.MEDIUM:
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
      case Difficulty.HARD:
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      case Difficulty.ADAPTIVE:
        return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const colors = getDifficultyColor(difficulty);

  return (
    <motion.div
      animate={
        isChanging
          ? {
              scale: [1, 1.15, 1],
              boxShadow: [
                '0 0 0 0px rgba(139, 92, 246, 0.5)',
                '0 0 0 8px rgba(139, 92, 246, 0)',
              ],
            }
          : {}
      }
      transition={{
        duration: 1.5,
        repeat: isChanging ? 2 : 0,
        ease: 'easeOut',
      }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 font-semibold text-sm ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <motion.div
        animate={
          isChanging
            ? {
                rotate: 360,
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: isChanging ? 1 : 0,
        }}
      >
        <Zap size={16} />
      </motion.div>
      <span>{difficulty}</span>
    </motion.div>
  );
}
