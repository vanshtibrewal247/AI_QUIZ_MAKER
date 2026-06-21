import { useEffect, useRef, useCallback } from "react";
import { useQuizStore } from "@/store/quizStore";

export interface UseTimerReturn {
  remainingSeconds: number;
  isActive: boolean;
  formattedTime: string;
  percentageRemaining: number;
  statusColor: "green" | "amber" | "red";
  pause: () => void;
  resume: () => void;
  reset: (seconds: number) => void;
}

export function useTimer(): UseTimerReturn {
  const { timerState } = useQuizStore();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getStatusColor = (remaining: number, initial: number): "green" | "amber" | "red" => {
    const percentage = (remaining / initial) * 100;
    if (percentage > 50) return "green";
    if (percentage > 25) return "amber";
    return "red";
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const initialTimeLimit = useRef<number>(timerState.remainingSeconds);

  useEffect(() => {
    initialTimeLimit.current = timerState.remainingSeconds;
  }, [timerState.remainingSeconds]);

  const pause = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    timerIntervalRef.current = setInterval(() => {
      // Timer update logic handled by store
    }, 1000);
  }, []);

  const reset = useCallback((seconds: number) => {
    initialTimeLimit.current = seconds;
    pause();
  }, [pause]);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const percentageRemaining = (timerState.remainingSeconds / (initialTimeLimit.current || 1)) * 100;
  const statusColor = getStatusColor(timerState.remainingSeconds, initialTimeLimit.current || 60);

  return {
    remainingSeconds: timerState.remainingSeconds,
    isActive: timerState.isActive,
    formattedTime: formatTime(timerState.remainingSeconds),
    percentageRemaining,
    statusColor,
    pause,
    resume,
    reset,
  };
}
