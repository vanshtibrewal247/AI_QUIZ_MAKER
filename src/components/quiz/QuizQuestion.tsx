'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface QuizQuestionProps {
  question: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  } | null;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onSelectAnswer: (index: number) => void;
  onSubmitAnswer: (index: number) => void;
  onShowExplanation?: () => void;
  showExplanation?: boolean;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
  onSubmitAnswer,
  onShowExplanation,
  showExplanation = false,
}: QuizQuestionProps) {
  if (!question) {
    return <div className="text-center text-gray-500">Loading question...</div>;
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      onSubmitAnswer(selectedAnswer);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Question Text */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
      >
        <h2 className="text-xl font-semibold text-gray-800">{question.text}</h2>
      </motion.div>

      {/* Options */}
      <div className="space-y-3">
        <AnimatePresence>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = isAnswered && (isSelected || isCorrect);
            const isIncorrectSelected = isAnswered && isSelected && !isCorrect;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isAnswered && onSelectAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  isSelected && !isAnswered
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${
                  showResult
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : isIncorrectSelected
                        ? 'border-red-500 bg-red-50'
                        : ''
                    : ''
                } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                      isSelected && !showResult
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : isCorrect && isAnswered
                          ? 'border-green-500 bg-green-500 text-white'
                          : isIncorrectSelected
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    {showResult && isCorrect && <Check size={18} />}
                    {showResult && isIncorrectSelected && <X size={18} />}
                    {!showResult && String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <>
            {question.explanation && (
              <button
                onClick={onShowExplanation}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  showExplanation
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* Explanation Panel Placeholder */}
      {isAnswered && showExplanation && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-sm text-gray-700">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
