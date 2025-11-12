// src/app/pages/evaluation/evaluation-about/evaluation-about.component.ts
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-about',
  templateUrl: './evaluation-about.component.html',
  styleUrls: ['./evaluation-about.component.scss'],
})
export class EvaluationAboutComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;

  constructor(private router: Router) {}

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
