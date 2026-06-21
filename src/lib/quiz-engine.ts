import { Question, UserAnswer, Difficulty } from "@/types/quiz";

export function calculateScore(userAnswers: UserAnswer[], questions: Question[]): number {
  const correctCount = userAnswers.filter((answer) => answer.isCorrect).length;
  return questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
}

export function calculateTimeTaken(userAnswers: UserAnswer[]): number {
  return userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);
}

export function shuffleQuestions(questions: Question[]): Question[] {
  const list = [...questions];

  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }

  return list;
}

export function getCurrentQuestion(questions: Question[], index: number): Question | null {
  if (index < 0 || index >= questions.length) {
    return null;
  }
  return questions[index];
}

export function getQuizTimeLimit(difficulty: Difficulty): number {
  switch (difficulty) {
    case Difficulty.HARD:
      return 30;
    case Difficulty.MEDIUM:
      return 45;
    case Difficulty.ADAPTIVE:
      return 40;
    default:
      return 60;
  }
}
