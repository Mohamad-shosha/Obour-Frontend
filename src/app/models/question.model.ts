import { Choice } from './choice.model';

export interface Question {
  id: number;
  sectionId: number;
  text: string;
  answerType: string;
  correctChoiceId?: number;
  choices: Choice[];
}
