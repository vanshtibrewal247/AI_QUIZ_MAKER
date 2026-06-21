export enum Difficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
  ADAPTIVE = "ADAPTIVE",
}

export enum QuizMode {
  TIMED = "TIMED",
  PRACTICE = "PRACTICE",
  TOPIC = "TOPIC",
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: string;
  timeLimit?: number;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  mode: QuizMode;
  createdAt: string;
  questions: Question[];
  authorId?: string;
}

export interface UserAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt?: string;
  userAnswers: UserAnswer[];
}
