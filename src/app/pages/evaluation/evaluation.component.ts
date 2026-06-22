// src/app/pages/evaluation/evaluation.component.ts
import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements AfterViewInit, OnDestroy {
  // بيانات التقييم (بدون السلوكي)
  evaluationData = {
    academic: {
      title: 'التقييم الأكاديمي',
      iconClass: 'bi bi-mortarboard-fill',
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
      iconClass: 'fas fa-brain',
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
  };

  // بيانات بطاقات الإحصائيات (من Dashboard)
  stats = [
    {
      title: 'معدل الأداء العام',
      value: '85%',
      iconClass: 'bi bi-graph-up-arrow',
      color: 'blue' as const,
      description: 'تحسن بنسبة 12% عن الشهر الماضي',
    },
    {
      title: 'التقييمات المكتملة',
      value: '24',
      iconClass: 'bi bi-check-circle-fill',
      color: 'green' as const,
      description: 'من أصل 30 تقييم',
    },
    {
      title: 'معدل التفاعل',
      value: '92%',
      iconClass: 'bi bi-activity',
      color: 'orange' as const,
      description: 'نشاط ممتاز',
    },
    {
      title: 'الترتيب',
      value: '15',
      iconClass: 'bi bi-trophy-fill',
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

  // بيانات التوزيع حسب المحاور (بدون السلوكي)
  axesData = [
    { title: 'أكاديمي', percentage: 85, color: '#6366f1' },
    { title: 'نفسي', percentage: 78, color: '#8b5cf6' },
  ];

  // بيانات المهارات الأساسية
  skills = [
    { label: 'التواصل الفعال', percentage: 88, color: 'bg-primary' },
    { label: 'العمل الجماعي', percentage: 85, color: 'bg-success' },
    { label: 'حل المشكلات', percentage: 80, color: 'bg-purple' },
    { label: 'التفكير النقدي', percentage: 82, color: 'bg-warning' },
    { label: 'إدارة الوقت', percentage: 78, color: 'bg-info' },
    { label: 'القيادة', percentage: 75, color: 'bg-secondary' },
  ];

  // بيانات آخر الإنجازات
  achievements = [
    {
      title: 'إتمام التقييم الأكاديمي',
      description: 'بتقدير ممتاز - 85%',
      iconClass: 'bi bi-mortarboard-fill',
      color: 'primary',
    },
    {
      title: 'تحقيق هدف شهري',
      description: 'تحسن 12% في الأداء',
      iconClass: 'bi bi-trophy-fill',
      color: 'success',
    },
    {
      title: 'تقييم نفسي متميز',
      description: 'ثقة عالية بالنفس',
      iconClass: 'fas fa-brain',
      color: 'purple',
    },
  ];

  @ViewChild('headerSection', { static: false }) headerSection!: ElementRef;
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
  @ViewChild('overallCard', { static: false }) overallCard!: ElementRef;
  @ViewChildren('sectionCard') sectionCards!: QueryList<ElementRef>;
  @ViewChild('recommendationsSection', { static: false })
  recommendationsSection!: ElementRef;
  @ViewChild('dashboardSection', { static: false })
  dashboardSection!: ElementRef;

  private animations: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  get overallReadiness(): number {
    const academic = this.evaluationData.academic.overall;
    const psychological = this.evaluationData.psychological.overall;
    // حساب المتوسط بدون السلوكي
    return Math.round((academic + psychological) / 2);
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

  getIconClass(section: any): string {
    return section.iconClass;
  }

  getLevelText(overall: number): string {
    if (overall >= 80) return 'ممتاز';
    if (overall >= 70) return 'جيد جداً';
    if (overall >= 60) return 'جيد';
    return 'مقبول';
  }

  getValueColorClass(value: number): string {
    if (value >= 85) return 'bg-success';
    if (value >= 75) return 'bg-primary';
    if (value >= 65) return 'bg-warning';
    return 'bg-danger';
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initAnimations(), 100);
  }

  ngOnDestroy(): void {
    // Clean up animations
    this.animations.forEach((anim) => anim.kill());
    ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
  }

  initAnimations(): void {
    // Animate header
    if (this.headerSection?.nativeElement) {
      const header = this.headerSection.nativeElement;
      const title = header.querySelector('.page-title');
      const subtitle = header.querySelector('.page-subtitle');

      const headerAnim = gsap.timeline();
      headerAnim
        .from(title, {
          opacity: 0,
          y: -30,
          duration: 0.8,
          ease: 'power3.out',
        })
        .from(
          subtitle,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        );
      this.animations.push(headerAnim);
    }

    // Animate stats cards
    if (this.statsSection?.nativeElement) {
      const statsCards =
        this.statsSection.nativeElement.querySelectorAll('.stat-card-wrapper');
      if (statsCards.length > 0) {
        const statsAnim = gsap.fromTo(
          Array.from(statsCards),
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            stagger: {
              amount: 0.4,
              from: 'start',
            },
            scrollTrigger: {
              trigger: this.statsSection.nativeElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
        this.animations.push(statsAnim);
      }
    }

    // Animate overall card
    if (this.overallCard?.nativeElement) {
      const overallAnim = gsap.from(this.overallCard.nativeElement, {
        opacity: 0,
        y: 50,
        scale: 0.95,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: this.overallCard.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      this.animations.push(overallAnim);
    }

    // Animate section cards with stagger
    if (this.sectionCards && this.sectionCards.length > 0) {
      const cards = this.sectionCards
        .toArray()
        .map((card) => card.nativeElement);

      const cardsAnim = gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: {
            amount: 0.6,
            from: 'start',
          },
          scrollTrigger: {
            trigger: cards[0]?.parentElement,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
      this.animations.push(cardsAnim);
    }

    // Animate dashboard section
    if (this.dashboardSection?.nativeElement) {
      const dashboardAnim = gsap.from(this.dashboardSection.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.dashboardSection.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      this.animations.push(dashboardAnim);
    }

    // Animate recommendations section
    if (this.recommendationsSection?.nativeElement) {
      const recAnim = gsap.from(this.recommendationsSection.nativeElement, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.recommendationsSection.nativeElement,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
      this.animations.push(recAnim);
    }
  }
}
