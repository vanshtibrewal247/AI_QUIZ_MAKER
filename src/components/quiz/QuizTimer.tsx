'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  onTimeUp?: () => void;
}

export function QuizTimer({
  remainingSeconds,
  totalSeconds,
  isActive,
  onTimeUp,
}: QuizTimerProps) {
  const percentage = (remainingSeconds / totalSeconds) * 100;
  
  // Determine color based on remaining time
  const getColor = (): string => {
    if (percentage > 50) return '#10b981'; // green
    if (percentage > 25) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getStrokeColor = (): string => {
    if (percentage > 50) return 'stroke-green-500';
    if (percentage > 25) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  React.useEffect(() => {
    if (remainingSeconds === 0 && onTimeUp) {
      onTimeUp();
    }
  }, [remainingSeconds, onTimeUp]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        {/* SVG Circular Timer */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getColor()}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            animate={{
              strokeDashoffset,
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {formatTime(remainingSeconds)}
          </div>
        </div>
      </div>

      {/* Status text */}
      <motion.div
        animate={{
          scale: remainingSeconds <= 10 && isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{ repeat: remainingSeconds <= 10 && isActive ? Infinity : 0, duration: 1 }}
        className="text-center"
      >
        <p className={`text-sm font-semibold flex items-center gap-2 ${
          percentage > 50 ? 'text-green-600' :
          percentage > 25 ? 'text-amber-600' :
          'text-red-600'
        }`}>
          <Clock size={16} />
          {percentage > 50 ? 'Good time remaining' :
           percentage > 25 ? 'Time running low' :
           'Critical - finish soon'}
        </p>
      </motion.div>

      {/* Aria-live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {formatTime(remainingSeconds)} remaining
      </div>
    </div>
  );
}
