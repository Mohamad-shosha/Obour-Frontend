// src/app/pages/home/home.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.scroll-animate:not(.visible)'
    );
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    animatedElements.forEach((el) => this.observer.observe(el));
  }

  startEvaluation(): void {
    this.router.navigate(['/evaluation']);
  }

  // --- البيانات ---
  stats = [
    {
      title: 'الجامعات المشاركة',
      value: '45+',
      icon: 'fa-building-columns',
      description: 'جامعة حكومية وخاصة',
    },
    {
      title: 'التخصصات المغطاة',
      value: '120+',
      icon: 'fa-book-open',
      description: 'تخصص أكاديمي متنوع',
    },
    {
      title: 'الطلبة المستفيدين',
      value: '25,000+',
      icon: 'fa-users',
      description: 'طالب وطالبة',
    },
    {
      title: 'معدل التحسن',
      value: '87%',
      icon: 'fa-chart-line',
      description: 'في الجاهزية للتدريب',
    },
  ];

  features = [
    {
      icon: 'fa-graduation-cap',
      title: 'تقييم أكاديمي شامل',
      description: 'تحليل دقيق للمستوى الأكاديمي',
    },
    {
      icon: 'fa-brain',
      title: 'التحليل النفسي والسلوكي',
      description: 'قياس الجوانب النفسية والاجتماعية',
    },
    {
      icon: 'fa-robot',
      title: 'ذكاء اصطناعي متقدم',
      description: 'تحليل البيانات بتقنيات الذكاء الاصطناعي',
    },
    {
      icon: 'fa-file-lines',
      title: 'تقارير تفصيلية',
      description: 'توصيات مخصصة لكل طالب',
    },
  ];

  goals = [
    {
      icon: 'fa-chart-line',
      title: 'قياس الجاهزية',
      description: 'تقييم دقيق لاستعداد الطلبة',
    },
    {
      icon: 'fa-arrow-trend-up',
      title: 'رفع الجودة',
      description: 'تحسين التأهيل الأكاديمي والمهني',
    },
    {
      icon: 'fa-robot',
      title: 'التطوير المستمر',
      description: 'توصيات ذكية لتطوير المهارات',
    },
    {
      icon: 'fa-handshake',
      title: 'التوافق مع السوق',
      description: 'مخرجات تعليم تلبي احتياجات سوق العمل',
    },
  ];

  detailedFeatures = [
    'تقييم أكاديمي شامل يغطي جميع جوانب التخصص',
    'تحليل نفسي متعمق للقدرات والمهارات الشخصية',
    'تقييم سلوكي يقيس المهارات الاجتماعية والقيادية',
    'استخدام تقنيات الذكاء الاصطناعي في التحليل',
    'تقارير تفصيلية وتوصيات مخصصة لكل طالب',
    'مقارنات معيارية مع الأقران والمعايير الوطنية',
  ];

  vision2030 = [
    'بناء جيل مؤهل من الكوادر الوطنية',
    'تحقيق التميز في التعليم والتدريب',
    'تعزيز التعاون بين المؤسسات التعليمية وسوق العمل',
    'رفع نسبة توظيف الخريجين في القطاع الخاص',
    'تطوير المهارات المطلوبة للوظائف المستقبلية',
    'دعم الاقتصاد الوطني بكفاءات مؤهلة',
  ];

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
}
