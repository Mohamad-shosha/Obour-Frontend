export interface AnswerItem {
  questionId: number;
  choiceId: number;
}

export interface SubmitAnswersRequest {
  studentId: number;
  answers: AnswerItem[];
}
