export type SectionType = 'academic' | 'psychological';

export interface Section {
  id: number;
  name: string;
  type: SectionType;
  parentId?: number;
  questionsCount?: number;
  duration?: number;
  difficulty?: string;
  difficultyClass?: string;
  description?: string;
}
