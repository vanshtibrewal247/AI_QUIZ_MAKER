'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { UserAnswer, Question } from '@/types/quiz';

interface ResultsSummaryProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  score: number;
  timeTaken: number;
  onRetry?: () => void;
}

export function ResultsSummary({
  userAnswers,
  questions,
  score,
  timeTaken,
  onRetry,
}: ResultsSummaryProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isCountingUp, setIsCountingUp] = useState(true);

  useEffect(() => {
    if (!isCountingUp) return;

    let animationFrame: number;
    let currentScore = 0;

    const animate = () => {
      if (currentScore < score) {
        currentScore += score / 50; // Animate over ~50 frames
        setDisplayedScore(Math.min(currentScore, score));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayedScore(score);
        setIsCountingUp(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  const correctCount = userAnswers.filter((answer) => answer.isCorrect).length;
  const incorrectCount = userAnswers.length - correctCount;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="w-full space-y-6">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg text-center"
      >
        <h2 className="text-lg font-semibold mb-4">Quiz Complete!</h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="text-6xl font-bold mb-2"
        >
          {displayedScore.toFixed(1)}%
        </motion.div>
        <p className="text-blue-100">
          {correctCount} out of {userAnswers.length} correct
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Correct */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center"
        >
          <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-green-700">{correctCount}</p>
          <p className="text-sm text-green-600">Correct</p>
        </motion.div>

        {/* Incorrect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center"
        >
          <XCircle className="text-red-600 mx-auto mb-2" size={24} />
          <p className="text-2xl font-bold text-red-700">{incorrectCount}</p>
          <p className="text-sm text-red-600">Incorrect</p>
        </motion.div>

        {/* Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"
        >
          <TrendingUp className="text-blue-600 mx-auto mb-2" size={24} />
          <p className="text-lg font-bold text-blue-700">{formatTime(timeTaken)}</p>
          <p className="text-sm text-blue-600">Time</p>
        </motion.div>
      </div>

      {/* Question Breakdown */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800">Question Breakdown</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {questions.map((question, index) => {
            const userAnswer = userAnswers.find((a) => a.questionId === question.id);
            const isCorrect = userAnswer?.isCorrect ?? false;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className={`p-3 rounded-lg border-l-4 ${
                  isCorrect
                    ? 'bg-green-50 border-green-500 border-l-4'
                    : 'bg-red-50 border-red-500 border-l-4'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      Question {index + 1}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {onRetry && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={onRetry}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Retry Quiz
        </motion.button>
      )}
    </div>
  );
}
