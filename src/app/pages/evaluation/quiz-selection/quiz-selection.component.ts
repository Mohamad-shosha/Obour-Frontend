// src/app/pages/evaluation/quiz-selection/quiz-selection.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { Section } from '../../../models/section.model';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss'],
})
export class QuizSelectionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  parentId!: number;
  parentSection!: Section;
  subSections: Section[] = [];
  loading = true;
  error: string | null = null;

  @ViewChild('backButton', { static: false }) backButton!: ElementRef;
  @ViewChild('headerSection', { static: false }) headerSection!: ElementRef;
  @ViewChild('loadingElement', { static: false }) loadingElement!: ElementRef;
  @ViewChild('errorElement', { static: false }) errorElement!: ElementRef;
  @ViewChild('emptyState', { static: false }) emptyState!: ElementRef;
  @ViewChildren('quizCard') quizCards!: QueryList<ElementRef>;

  private animations: (gsap.core.Tween | gsap.core.Timeline)[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.parentId = Number(this.route.snapshot.paramMap.get('sectionId'));
    this.loadParentSection();
    this.loadSubSections();
  }

  ngAfterViewInit(): void {
    // Wait for data to load before animating
    if (!this.loading && !this.error) {
      setTimeout(() => this.initAnimations(), 100);
    }
  }

  ngOnDestroy(): void {
    // Clean up animations
    this.animations.forEach((anim) => anim.kill());
    ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
  }

  loadParentSection(): void {
    this.evaluationService.getSection(this.parentId).subscribe({
      next: (section) => {
        this.parentSection = section;
        setTimeout(() => this.animateHeader(), 100);
      },
      error: (err) => {
        console.error('فشل تحميل القسم الرئيسي، جاري تحميل البيانات التجريبية...', err);
        this.parentSection = this.getMockParentSection(this.parentId);
        setTimeout(() => this.animateHeader(), 100);
      },
    });
  }

  loadSubSections(): void {
    this.evaluationService.getSubSections(this.parentId).subscribe({
      next: (data) => {
        this.subSections = data.map(sec => this.enrichSectionMetadata(sec));
        this.loading = false;
        setTimeout(() => this.initAnimations(), 300);
      },
      error: (err) => {
        console.error('فشل تحميل الاختبارات، جاري تحميل البيانات التجريبية...', err);
        const mockData = this.getMockSubSections(this.parentId);
        this.subSections = mockData.map(sec => this.enrichSectionMetadata(sec));
        this.loading = false;
        setTimeout(() => this.initAnimations(), 300);
      },
    });
  }

  getMockParentSection(id: number): Section {
    return {
      id: id,
      name: id === 1 ? 'التقييم الأكاديمي والتقني' : 'التحليل النفسي والسلوكي',
      type: id === 1 ? 'academic' : 'psychological'
    };
  }

  getMockSubSections(parentId: number): Section[] {
    if (parentId === 1) {
      return [
        { id: 101, name: 'هندسة البرمجيات والتطوير', type: 'academic', parentId: 1 },
        { id: 102, name: 'إدارة الشبكات ونظم التشغيل', type: 'academic', parentId: 1 },
        { id: 103, name: 'الأمن السيبراني وحماية المعلومات', type: 'academic', parentId: 1 },
        { id: 104, name: 'تحليل البيانات والذكاء الاصطناعي', type: 'academic', parentId: 1 },
      ];
    } else {
      return [
        { id: 201, name: 'مهارات التواصل والعمل الجماعي', type: 'psychological', parentId: 2 },
        { id: 202, name: 'إدارة الضغوط والتكيف المهني', type: 'psychological', parentId: 2 },
        { id: 203, name: 'حل المشكلات واتخاذ القرارات', type: 'psychological', parentId: 2 },
        { id: 204, name: 'الاحترافية والتطوير الذاتي', type: 'psychological', parentId: 2 },
      ];
    }
  }

  enrichSectionMetadata(section: Section): any {
    const enriched = { ...section } as any;
    
    if (section.id === 101 || section.name.includes('برمجيات') || section.name.includes('برمجة')) {
      enriched.questionsCount = 12;
      enriched.duration = 20;
      enriched.difficulty = 'متقدم';
      enriched.difficultyClass = 'danger';
      enriched.description = 'قياس مهارات وهندسة البرمجيات، المفاهيم الأساسية، والبرمجة كائنية التوجه.';
    } else if (section.id === 102 || section.name.includes('شبكات') || section.name.includes('شبكة')) {
      enriched.questionsCount = 10;
      enriched.duration = 15;
      enriched.difficulty = 'متوسط';
      enriched.difficultyClass = 'warning';
      enriched.description = 'قياس فهم بروتوكولات الشبكات، هندسة النظم وتأمين إدارة تدفق البيانات.';
    } else if (section.id === 103 || section.name.includes('أمن') || section.name.includes('سيبراني')) {
      enriched.questionsCount = 15;
      enriched.duration = 25;
      enriched.difficulty = 'متقدم';
      enriched.difficultyClass = 'danger';
      enriched.description = 'قياس مهارات التشفير، حماية الثغرات، والتحقيق الجنائي الرقمي.';
    } else if (section.id === 104 || section.name.includes('بيانات') || section.name.includes('تحليل')) {
      enriched.questionsCount = 10;
      enriched.duration = 15;
      enriched.difficulty = 'متوسط';
      enriched.difficultyClass = 'warning';
      enriched.description = 'قياس المعرفة الأساسية في لغات التحليل، تمثيل البيانات، والتعلم الآلي.';
    } else {
      enriched.questionsCount = 10;
      enriched.duration = 10;
      enriched.difficulty = 'مبتدئ';
      enriched.difficultyClass = 'success';
      if (section.name.includes('تواصل')) {
        enriched.description = 'قياس مهارات الاستماع الفعال والتعبير، ومؤشرات التفاعل في بيئة العمل.';
      } else if (section.name.includes('ضغوط')) {
        enriched.description = 'تقييم القدرة على إدارة المهام المتعددة والحفاظ على جودة الأداء تحت الضغوط.';
      } else if (section.name.includes('قرار')) {
        enriched.description = 'تقييم منهجية التفكير والتحليل المنطقي للبدائل واختيار الحل الأمثل.';
      } else {
        enriched.description = 'تقييم مهارات الالتزام المهني والتنظيم والتعلم الذاتي المستمر.';
      }
    }
    return enriched;
  }

  initAnimations(): void {
    // Animate back button
    if (this.backButton?.nativeElement) {
      const backAnim = gsap.from(this.backButton.nativeElement, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power3.out',
      });
      this.animations.push(backAnim);
    }

    // Animate quiz cards with stagger
    if (this.quizCards && this.quizCards.length > 0) {
      const cards = this.quizCards.toArray().map((card) => card.nativeElement);

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

    // Animate empty state if exists
    if (this.emptyState?.nativeElement && this.subSections.length === 0) {
      const emptyAnim = gsap.from(this.emptyState.nativeElement, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.emptyState.nativeElement,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
      this.animations.push(emptyAnim);
    }
  }

  animateHeader(): void {
    if (this.headerSection?.nativeElement) {
      const header = this.headerSection.nativeElement;
      const iconBox = header.querySelector('.icon-box');
      const title = header.querySelector('.section-title');
      const subtitle = header.querySelector('.section-subtitle');
      const underline = header.querySelector('.title-underline');

      // Create timeline for header animation
      const tl = gsap.timeline();

      tl.from(iconBox, {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: 'back.out(1.7)',
      })
        .from(
          title,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          subtitle,
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.4'
        )
        .from(
          underline,
          {
            scaleX: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.3'
        );

      this.animations.push(tl);
    }
  }

  animateError(): void {
    if (this.errorElement?.nativeElement) {
      const errorAnim = gsap.from(this.errorElement.nativeElement, {
        opacity: 0,
        scale: 0.8,
        y: -20,
        duration: 0.5,
        ease: 'back.out(1.7)',
      });
      this.animations.push(errorAnim);
    }
  }

  onCardHover(event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement).closest('.quiz-card');
    if (card) {
      gsap.to(card, {
        scale: 1.02,
        y: -12,
        duration: 0.3,
        ease: 'power2.out',
      });

      const icon = card.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          rotation: 5,
          scale: 1.1,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      }
    }
  }

  onCardLeave(event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement).closest('.quiz-card');
    if (card) {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      const icon = card.querySelector('.card-icon');
      if (icon) {
        gsap.to(icon, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }

  startQuiz(sectionId: number): void {
    // Animate card click before navigation
    const clickedCard = document.querySelector(`[data-index]`) as HTMLElement;

    if (clickedCard) {
      gsap.to(clickedCard, {
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          this.router.navigate(['/evaluation/test', sectionId]);
        },
      });
    } else {
      this.router.navigate(['/evaluation/test', sectionId]);
    }
  }

  goBack(): void {
    // Animate exit before navigation
    gsap.to('.quiz-section', {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        this.router.navigate(['/evaluation']);
      },
    });
  }

  getIconClass(type: string): string {
    return type === 'academic' ? 'bi bi-mortarboard-fill' : 'fas fa-brain';
  }

  getCardIconClass(type: string): string {
    return type === 'academic' ? 'bi bi-book-fill' : 'fas fa-brain';
  }

  getButtonClass(type: string): string {
    return type === 'academic' ? 'btn-primary' : 'btn-success';
  }
}
