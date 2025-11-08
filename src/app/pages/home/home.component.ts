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

  // بيانات المزايا (كما هي)
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
}
