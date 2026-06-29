import { QuestionBank } from './question-bank.model';

export interface SaveAnswerRequest {
  questionId: number;
  choiceId?: number;
  textAnswer?: string;
  isFlagged?: boolean;
  timeSpentSecs?: number;
}

export interface AssessmentSession {
  id: number;
  userId: number;
  templateId: number;
  templateName: string;
  templateNameAr: string;
  questionCount: number;
  timeLimitMins: number;
  passingScore: number;
  showExplanation: boolean;
  status: string;
  startedAt: string;
  expiresAt: string;
  timeSpentSecs: number;
  currentQuestionIndex: number;
  answeredCount: number;
  questions: QuestionBank[];
  savedAnswers?: SaveAnswerRequest[];
}

export interface StartSessionRequest {
  userId: number;
  templateId?: number;
  categoryId?: number;
  resumeIfExists?: boolean;
}
