export type SectionType = 'academic' | 'psychological';

export interface Section {
  id: number;
  name: string;
  type: SectionType;
  parentId?: number;
}
