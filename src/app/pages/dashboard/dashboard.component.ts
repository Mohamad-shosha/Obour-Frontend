// src/app/pages/dashboard/dashboard.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // بيانات بطاقات الإحصائيات
  stats = [
    {
      title: 'معدل الأداء العام',
      value: '85%',
      iconPath: 'M2 12h20M12 2v20', // TrendingUp
      color: 'blue' as const,
      description: 'تحسن بنسبة 12% عن الشهر الماضي',
    },
    {
      title: 'التقييمات المكتملة',
      value: '24',
      iconPath: 'M12 5l7 7-7 7M5 12h14', // Award
      color: 'green' as const,
      description: 'من أصل 30 تقييم',
    },
    {
      title: 'معدل التفاعل',
      value: '92%',
      iconPath: 'M22 14.5V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V14.5', // Activity
      color: 'orange' as const,
      description: 'نشاط ممتاز',
    },
    {
      title: 'الترتيب',
      value: '15',
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5', // Target
      color: 'purple' as const,
      description: 'من أصل 450 طالب',
    },
  ];

  // بيانات تطور الأداء الشهري
  performanceData = [
    { month: 'يناير', value: 75 },
    { month: 'فبراير', value: 78 },
    { month: 'مارس', value: 82 },
    { month: 'أبريل', value: 85 },
    { month: 'مايو', value: 88 },
    { month: 'يونيو', value: 87 },
  ];

  // حساب القيمة القصوى لعرض النسب المئوية بشكل صحيح
  get maxValue(): number {
    return Math.max(...this.performanceData.map((d) => d.value));
  }

  // --- دالة جديدة لتحديد لون الشريط ---
  getValueColorClass(value: number): string {
    if (value >= 85) return 'bg-success'; // أخضر
    if (value >= 75) return 'bg-primary'; // أزرق
    if (value >= 65) return 'bg-warning'; // برتقالي
    return 'bg-danger'; // أحمر
  }
  // ----------------------------------

  // بيانات التوزيع حسب المحاور
  axesData = [
    { title: 'أكاديمي', percentage: 85, color: '#3b82f6' },
    { title: 'نفسي', percentage: 78, color: '#8b5cf6' },
    { title: 'سلوكي', percentage: 82, color: '#10b981' },
  ];

  // بيانات المهارات الأساسية
  skills = [
    { label: 'التواصل الفعال', percentage: 88, color: 'bg-primary' },
    { label: 'العمل الجماعي', percentage: 85, color: 'bg-success' },
    { label: 'حل المشكلات', percentage: 80, color: 'bg-purple' },
    { label: 'التفكير النقدي', percentage: 82, color: 'bg-warning' },
    { label: 'إدارة الوقت', percentage: 78, color: 'bg-pink' },
    { label: 'القيادة', percentage: 75, color: 'bg-indigo' },
  ];

  // بيانات آخر الإنجازات
  achievements = [
    {
      title: 'إتمام التقييم الأكاديمي',
      description: 'بتقدير ممتاز - 85%',
      iconPath: 'M12 5l7 7-7 7M5 12h14', // Award
      color: 'primary',
    },
    {
      title: 'تحقيق هدف شهري',
      description: 'تحسن 12% في الأداء',
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5', // Target
      color: 'success',
    },
    {
      title: 'تقييم سلوكي متميز',
      description: 'مهارات تواصل عالية',
      iconPath:
        'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m9-11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 11v-2a4 4 0 0 0-3-3.87m-4-8.13a4 4 0 0 1 0 7.75', // Users
      color: 'purple',
    },
  ];
}
