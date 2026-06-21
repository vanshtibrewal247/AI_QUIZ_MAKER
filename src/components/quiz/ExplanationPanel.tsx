'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
  explanation?: string;
  isStreaming?: boolean;
  aiGenerated?: boolean;
  onClose?: () => void;
}

export function ExplanationPanel({
  explanation,
  isStreaming = false,
  aiGenerated = false,
  onClose,
}: ExplanationPanelProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!explanation) return;

    if (isStreaming) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < explanation.length) {
          setDisplayedText(explanation.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);

      return () => clearInterval(timer);
    } else {
      setDisplayedText(explanation);
    }
  }, [explanation, isStreaming]);

  if (!explanation) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          {aiGenerated && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={18} className="text-indigo-600" />
            </motion.div>
          )}
          <h3 className="text-sm font-semibold text-indigo-900">
            {aiGenerated ? 'AI Explanation' : 'Explanation'}
          </h3>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {isStreaming && displayedText.length < (explanation?.length || 0) && (
            <motion.span
              animate={{ opacity: [1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-4 bg-indigo-600 ml-1"
            />
          )}
        </p>

        {/* Loading indicator */}
        {isStreaming && (
          <div className="mt-3 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1.5 h-1.5 bg-indigo-600 rounded-full"
              />
            ))}
          </div>
        )}

        {/* Close button */}
        {onClose && !isStreaming && (
          <button
            onClick={onClose}
            className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Dismiss
          </button>
        )}
      </div>
    </motion.div>
  );
}
