// src/app/pages/about/about.component.ts
import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  heroRotateX = 8;
  heroRotateY = -12;

  constructor(private router: Router) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const rotateY = ((mouseX / windowWidth) - 0.5) * 16;
    const rotateX = ((mouseY / windowHeight) - 0.5) * -16;
    
    this.heroRotateX = this.heroRotateX + (rotateX - this.heroRotateX) * 0.1;
    this.heroRotateY = this.heroRotateY + (rotateY - this.heroRotateY) * 0.1;

    // Spotlight Effect for grids
    const gridItems = document.querySelectorAll('.spotlight-card') as NodeListOf<HTMLElement>;
    gridItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  }

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

  // أهداف المنصة
  goals = [
    {
      icon: 'fa-solid fa-chart-line',
      title: 'قياس الجاهزية',
      description: 'تقييم دقيق وشامل لمدى استعداد الطلبة للتدريب الميداني',
    },
    {
      icon: 'fa-solid fa-arrow-trend-up',
      title: 'رفع الجودة',
      description: 'تحسين مستوى التأهيل الأكاديمي والمهني للطلبة',
    },
    {
      icon: 'fa-solid fa-robot',
      title: 'التطوير المستمر',
      description: 'توفير توصيات ذكية لتطوير المهارات والقدرات',
    },
    {
      icon: 'fa-solid fa-handshake',
      title: 'التوافق مع السوق',
      description: 'ضمان توافق مخرجات التعليم مع احتياجات سوق العمل',
    },
  ];

  // رؤية 2030
  vision2030 = [
    'بناء جيل مؤهل من الكوادر الوطنية',
    'تحقيق التميز في التعليم والتدريب',
    'تعزيز التعاون بين المؤسسات التعليمية وسوق العمل',
    'رفع نسبة توظيف الخريجين في القطاع الخاص',
    'تطوير المهارات المطلوبة للوظائف المستقبلية',
    'دعم الاقتصاد الوطني بكفاءات مؤهلة',
  ];

  // المزايا الرئيسية
  features = [
    'تقييم أكاديمي شامل يغطي جميع جوانب التخصص',
    'تحليل نفسي متعمق للقدرات والمهارات الشخصية',
    'تقييم سلوكي يقيس المهارات الاجتماعية والقيادية',
    'استخدام تقنيات الذكاء الاصطناعي في التحليل',
    'تقارير تفصيلية وتوصيات مخصصة لكل طالب',
    'مقارنات معيارية مع الأقران والمعايير الوطنية',
  ];

  // خطوات العمل
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

  impactStats = [
    { value: '45+', label: 'جامعة شريكة' },
    { value: '120+', label: 'تخصص مدعوم' },
    { value: '25K+', label: 'طالب استفاد' },
    { value: '87%', label: 'نسبة تحسن في الجاهزية' },
  ];
}
