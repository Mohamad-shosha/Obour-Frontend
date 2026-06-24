// src/app/pages/home/home.component.ts
import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  heroRotateX = 10;
  heroRotateY = -15;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.initScrollAnimations();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    // Hero Mockup 3D Tilt calculation
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation (-10 to 10 degrees) based on cursor position
    const rotateY = ((mouseX / windowWidth) - 0.5) * 20;
    const rotateX = ((mouseY / windowHeight) - 0.5) * -20;
    
    // Apply easing by interpolating with current values for smooth feel
    this.heroRotateX = this.heroRotateX + (rotateX - this.heroRotateX) * 0.1;
    this.heroRotateY = this.heroRotateY + (rotateY - this.heroRotateY) * 0.1;

    // Bento Grid Spotlight Effect
    const bentoItems = document.querySelectorAll('.bento-item') as NodeListOf<HTMLElement>;
    bentoItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
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

  startAbout(): void {
    this.router.navigate(['/about']);
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

  partners = [
    { name: 'جامعة الملك سعود', logo: 'fa-building-columns' },
    { name: 'جامعة الملك عبدالعزيز', logo: 'fa-graduation-cap' },
    { name: 'جامعة الإمام محمد بن سعود', logo: 'fa-book' },
    { name: 'جامعة أم القرى', logo: 'fa-mosque' },
    { name: 'جامعة الملك فهد', logo: 'fa-microscope' },
    { name: 'وزارة التعليم', logo: 'fa-school' },
    { name: 'جامعة طيبة', logo: 'fa-book-open-reader' }
  ];

  testimonials = [
    {
      content: 'المنصة أحدثت نقلة نوعية في قدرتنا على التنبؤ بمستوى جاهزية طلابنا قبل التخرج. دقة التحليلات ساعدتنا في تطوير المناهج.',
      author: 'د. أحمد عبدالله',
      role: 'عميد كلية الهندسة',
      avatar: 'fa-user-tie'
    },
    {
      content: 'تجربتي مع المنصة كانت ممتازة. اكتشفت نقاط قوتي وتعرفت على المهارات التي أحتاج تطويرها لدخول سوق العمل بثقة.',
      author: 'سارة خالد',
      role: 'طالبة خريجة - علوم حاسب',
      avatar: 'fa-user-graduate'
    },
    {
      content: 'التقارير المفصلة التي توفرها المنصة تختصر الكثير من الوقت والجهد على المرشدين الأكاديميين لتوجيه الطلبة بالشكل الصحيح.',
      author: 'أ. محمد العتيبي',
      role: 'مرشد أكاديمي',
      avatar: 'fa-user-clock'
    }
  ];
}
