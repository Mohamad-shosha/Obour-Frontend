// src/app/pages/evaluation/evaluation.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent {
  // بيانات التقييم الثلاثي
  evaluationData = {
    academic: {
      title: 'التقييم الأكاديمي',
      iconPath:
        'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M10 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3h-7z',
      color: 'blue',
      overall: 85,
      metrics: [
        { label: 'المعدل التراكمي', value: 88 },
        { label: 'استيعاب المواد التخصصية', value: 90 },
        { label: 'المهارات البحثية', value: 78 },
        { label: 'المشاريع التطبيقية', value: 85 },
      ],
      strengths: ['تميز في المواد النظرية', 'قدرة عالية على التحليل'],
      improvements: ['تطوير المهارات البحثية', 'زيادة الممارسة العملية'],
    },
    psychological: {
      title: 'التحليل النفسي',
      iconPath:
        'M22 14.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4.5 M12 12h.01 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
      color: 'purple',
      overall: 78,
      metrics: [
        { label: 'إدارة الضغوط', value: 75 },
        { label: 'الثقة بالنفس', value: 82 },
        { label: 'التحفيز الذاتي', value: 80 },
        { label: 'المرونة النفسية', value: 76 },
      ],
      strengths: ['ثقة عالية بالنفس', 'تحفيز ذاتي ممتاز'],
      improvements: ['تعزيز مهارات إدارة الضغوط', 'تطوير المرونة النفسية'],
    },
    behavioral: {
      title: 'التقييم السلوكي',
      iconPath:
        'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
      color: 'green',
      overall: 82,
      metrics: [
        { label: 'العمل الجماعي', value: 88 },
        { label: 'التواصل الفعال', value: 85 },
        { label: 'القيادة', value: 75 },
        { label: 'حل المشكلات', value: 80 },
      ],
      strengths: ['مهارات تواصل ممتازة', 'قدرة عالية على العمل الجماعي'],
      improvements: ['تطوير المهارات القيادية', 'تعزيز مهارات اتخاذ القرار'],
    },
  };

  get overallReadiness(): number {
    const academic = this.evaluationData.academic.overall;
    const psychological = this.evaluationData.psychological.overall;
    const behavioral = this.evaluationData.behavioral.overall;
    return Math.round((academic + psychological + behavioral) / 3);
  }

  get readinessMessage(): string {
    const score = this.overallReadiness;
    if (score >= 80) return 'جاهز بشكل ممتاز';
    if (score >= 70) return 'جاهز بشكل جيد';
    return 'يحتاج إلى تطوير';
  }

  get readinessColor(): string {
    const score = this.overallReadiness;
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  }

  getSections() {
    return Object.values(this.evaluationData);
  }

  getSectionBgClass(color: string): string {
    return `section-bg-${color}`;
  }

  getLevelText(overall: number): string {
    if (overall >= 80) return 'ممتاز';
    if (overall >= 70) return 'جيد جداً';
    if (overall >= 60) return 'جيد';
    return 'مقبول';
  }
}
