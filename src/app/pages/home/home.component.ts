import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  startEvaluation(): void {
    this.router.navigate(['/evaluation']);
  }

  // بيانات الإحصائيات
  stats = [
    {
      title: 'الجامعات المشاركة',
      value: '45+',
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5',
      color: 'blue' as const,
      description: 'جامعة حكومية وخاصة',
    },
    {
      title: 'التخصصات المغطاة',
      value: '120+',
      iconPath: 'M4 6h16M4 12h16M4 18h16',
      color: 'green' as const,
      description: 'تخصص أكاديمي متنوع',
    },
    {
      title: 'الطلبة المستفيدين',
      value: '25,000+',
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5',
      color: 'orange' as const,
      description: 'طالب وطالبة',
    },
    {
      title: 'معدل التحسن',
      value: '87%',
      iconPath: 'M2 12h20M12 2v20',
      color: 'purple' as const,
      description: 'في الجاهزية للتدريب',
    },
  ];

  // المزايا
  features = [
    {
      title: 'تقييم أكاديمي شامل',
      description:
        'تحليل دقيق للمستوى الأكاديمي ومدى استيعاب المواد الدراسية ذات الصلة بالتخصص',
      iconPath: 'M4 6h16M4 12h16M4 18h16',
    },
    {
      title: 'التحليل النفسي والسلوكي',
      description:
        'قياس الجوانب النفسية والاجتماعية والمهارات الشخصية اللازمة لبيئة العمل',
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5',
    },
    {
      title: 'ذكاء اصطناعي متقدم',
      description:
        'استخدام تقنيات الذكاء الاصطناعي لتحليل البيانات وتقديم توصيات دقيقة',
      iconPath: 'M12 3v18M3 12h18',
    },
    {
      title: 'تقارير تفصيلية',
      description: 'تقارير شاملة توضح نقاط القوة وفرص التطوير لكل طالب',
      iconPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z',
    },
  ];

  // أهداف المنصة
  goals = [
    {
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5',
      title: 'قياس الجاهزية',
      description: 'تقييم دقيق وشامل لمدى استعداد الطلبة للتدريب الميداني',
    },
    {
      iconPath: 'M12 5l7 7-7 7M5 12h14',
      title: 'رفع الجودة',
      description: 'تحسين مستوى التأهيل الأكاديمي والمهني للطلبة',
    },
    {
      iconPath:
        'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
      title: 'التطوير المستمر',
      description: 'توفير توصيات ذكية لتطوير المهارات والقدرات',
    },
    {
      iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5',
      title: 'التوافق مع السوق',
      description: 'ضمان توافق مخرجات التعليم مع احتياجات سوق العمل',
    },
  ];

  // دعم رؤية 2030
  vision2030 = [
    'بناء جيل مؤهل من الكوادر الوطنية',
    'تحقيق التميز في التعليم والتدريب',
    'تعزيز التعاون بين المؤسسات التعليمية وسوق العمل',
    'رفع نسبة توظيف الخريجين في القطاع الخاص',
    'تطوير المهارات المطلوبة للوظائف المستقبلية',
    'دعم الاقتصاد الوطني بكفاءات مؤهلة',
  ];

  // خطوات عمل المنصة
  steps = [
    {
      number: '1',
      title: 'التسجيل والتقييم',
      description:
        'يقوم الطالب بالتسجيل في المنصة وإجراء التقييمات الثلاثة: الأكاديمي والنفسي والسلوكي',
    },
    {
      number: '2',
      title: 'التحليل الذكي',
      description:
        'يتم تحليل البيانات باستخدام الذكاء الاصطناعي لتحديد مستوى الجاهزية ونقاط القوة والضعف',
    },
    {
      number: '3',
      title: 'التوصيات والتطوير',
      description:
        'تقدم المنصة تقارير تفصيلية وتوصيات مخصصة لتطوير المهارات وتحسين الجاهزية',
    },
  ];
    // === هنا نضيف البيانات المفقودة ===
  dashboardItems = [
    { title: 'تقييم جديد', description: 'ابدأ تقييمك الآن', iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18M12 19V5' },
    { title: 'التقارير', description: 'عرض تقارير الأداء', iconPath: 'M4 6h16M4 12h16M4 18h16' },
    { title: 'التوصيات', description: 'استعرض توصياتك الذكية', iconPath: 'M12 3v18M3 12h18' },
  ];

  performanceData = [
    { month: 'يناير', value: 75 },
    { month: 'فبراير', value: 80 },
    { month: 'مارس', value: 65 },
  ];

  skills = [
    { label: 'مهارة تحليل البيانات', percentage: 80, color: 'blue' },
    { label: 'مهارة البرمجة', percentage: 70, color: 'green' },
  ];

  achievements = [
    { title: 'شهادة التفوق', description: 'أفضل طالب في الجامعة', iconPath: 'M12 5v10M8 9l4-4 4 4M3 12h18', color: 'primary' },
    { title: 'مشاركة في المشروع', description: 'مساهم فعال في المشاريع', iconPath: 'M4 6h16M4 12h16M4 18h16', color: 'success' },
  ];

  axesData = [
    { title: 'المحور الأكاديمي', percentage: 85, color: 'blue' },
    { title: 'المحور النفسي', percentage: 75, color: 'green' },
    { title: 'المحور السلوكي', percentage: 90, color: 'orange' },
  ];
  

  getValueColorClass(value: number): string {
    if (value >= 80) return 'bg-success';
    if (value >= 70) return 'bg-warning';
    return 'bg-danger';
  }
  
}
