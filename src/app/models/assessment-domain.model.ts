export interface AssessmentDomain {
  id: number;
  name: string;
  nameAr: string;
  slug: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  descriptionAr: string;
  orderIndex: number;
  isActive: boolean;
  questionCount: number;
  categories?: AssessmentCategory[];
}

export interface AssessmentCategory {
  id: number;
  domainId: number;
  name: string;
  nameAr: string;
  slug: string;
  icon: string;
  description: string;
  orderIndex: number;
  questionCount: number;
  topics?: AssessmentTopic[];
}

export interface AssessmentTopic {
  id: number;
  categoryId: number;
  name: string;
  nameAr: string;
  slug: string;
  icon: string;
  description: string;
  orderIndex: number;
  questionCount: number;
}
