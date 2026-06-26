export interface QuestionBankChoice {
  id: number;
  choiceText: string;
  choiceTextAr: string;
  isCorrect?: boolean;
  explanation?: string;
  orderIndex: number;
}

export interface QuestionBank {
  id: number;
  domainId: number;
  domainName: string;
  categoryId: number;
  categoryName: string;
  topicId: number;
  topicName: string;
  questionText: string;
  questionTextAr: string;
  questionType: string;
  difficulty: string;
  explanation: string;
  codeSnippet: string;
  codeLanguage: string;
  points: number;
  timeLimitSecs: number;
  choices: QuestionBankChoice[];
  tags: string[];
}
