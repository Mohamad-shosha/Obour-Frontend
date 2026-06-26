// src/app/pages/evaluation/evaluation-about/evaluation-about.component.ts
import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-about',
  templateUrl: './evaluation-about.component.html',
  styleUrls: ['./evaluation-about.component.scss'],
})
export class EvaluationAboutComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  heroRotateX = 8;
  heroRotateY = -12;
  activeFaqIndex: number | null = null;

  faqs = [
    {
      question: 'كم يستغرق التقييم؟',
      answer: 'يستغرق التقييم كاملاً حوالي 35-45 دقيقة. يمكنك أداء كل قسم على حدة وبشكل منفصل حسب وقتك المتاح.'
    },
    {
      question: 'هل يمكنني إعادة الاختبار؟',
      answer: 'تم تصميم التقييم ليقيس جاهزيتك الحالية، لذا يُسمح بأدائه مرة واحدة لكل فصل دراسي لإعطاء فرصة للتطور والقياس الدوري.'
    },
    {
      question: 'هل تؤثر النتيجة على درجاتي الجامعية؟',
      answer: 'لا، التقييم مستقل تماماً ولا يؤثر على معدلك التراكمي الأكاديمي، بل هو أداة تطويرية وإرشادية لتيسير قبولك بالتدريب وسوق العمل.'
    },
    {
      question: 'ما فائدة مؤشر الجاهزية؟',
      answer: 'مؤشر الجاهزية يعطي جهات التدريب والتوظيف انطباعاً موثقاً عن مهاراتك الفنية وتوافقك النفسي والمهني، مما يزيد من فرص قبولك المباشر.'
    }
  ];

  constructor(private router: Router) {}

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

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
    setTimeout(() => {
      this.initScrollAnimations();
    }, 0);
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

  // بيانات قسم "لماذا التقييم؟"
  whyEvaluate = [
    {
      icon: 'fa-brain',
      title: 'تحليل نفسي دقيق',
      description:
        'نقيس مهاراتك السلوكية، قدرتك على تحمل الضغط، ومهارات التواصل — وهي عوامل حاسمة في نجاحك الميداني.',
      bgClass: 'bg-primary',
    },
    {
      icon: 'fa-graduation-cap',
      title: 'تقييم أكاديمي شامل',
      description:
        'نقيس مدى تطبيقك للمعارف الأكاديمية في سياقات واقعية، ونحدد الفجوات التي تحتاج لسدها.',
      bgClass: 'bg-success',
    },
    {
      icon: 'fa-lightbulb',
      title: 'توصيات ذكية',
      description:
        'ستحصل على خطة تطوير مخصصة، ومقترحات لتخصصات تدريبية تناسب مهاراتك وقدراتك.',
      bgClass: 'bg-info',
    },
  ];
}
