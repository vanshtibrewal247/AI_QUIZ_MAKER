'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
}: QuizProgressProps) {
  const percentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
        />
      </div>

      {/* Question Counter */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-gray-700">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Dots indicator */}
      <div className="flex gap-1 mt-3">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8 }}
            animate={{
              scale: index < currentQuestion ? 1.1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className={`h-2 flex-1 rounded-full transition-colors ${
              index < currentQuestion
                ? 'bg-green-500'
                : index === currentQuestion - 1
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
