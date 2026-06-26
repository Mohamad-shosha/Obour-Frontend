export interface DomainScore {
  domainId: number;
  domainName: string;
  domainNameAr: string;
  domainIcon: string;
  domainColor: string;
  categoryId?: number;
  categoryName?: string;
  topicId?: number;
  topicName?: string;
  questions: number;
  correct: number;
  scorePct: number;
  strengthLevel: string;
}

export interface QuestionReview {
  questionId: number;
  questionText: string;
  selectedChoiceText: string;
  correctChoiceText: string;
  isCorrect: boolean;
  explanation: string;
  difficulty: string;
  pointsEarned: number;
  maxPoints: number;
}

export interface AssessmentResult {
  id: number;
  sessionId: number;
  userId: number;
  templateId: number;
  templateName: string;
  domainName: string;
  domainNameAr: string;
  domainColor: string;
  totalQuestions: number;
  answered: number;
  correct: number;
  scorePercent: number;
  totalPoints: number;
  earnedPoints: number;
  passed: boolean;
  timeTakenSecs: number;
  levelAchieved: string;
  completedAt: string;
  domainScores: DomainScore[];
  questionReviews: QuestionReview[];
}
