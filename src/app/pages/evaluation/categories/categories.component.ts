import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentDomainService } from '../../../services/assessment-domain.service';
import { AuthService } from '../../../services/auth.service';
import { AssessmentDomain } from '../../../models/assessment-domain.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  domains: AssessmentDomain[] = [];
  loading = true;
  error: string | null = null;
  heroRotateX = 8;
  heroRotateY = -12;
  activeFaqIndex: number | null = null;
  user: any = null;

  faqs = [
    {
      question: 'أي الأقسام أبدأ به أولاً؟',
      answer: 'يُفضل البدء بالتقييم الأكاديمي والتقني أولاً، ثم الانتقال للتحليل النفسي والسلوكي. يمكنك إكمال أي منهما والعودة للآخر لاحقاً.'
    },
    {
      question: 'كم يبلغ عدد الأسئلة في كل قسم؟',
      answer: 'يحتوي القسم الأكاديمي على ما يقرب من 25-30 سؤالاً تخصصياً، بينما يحتوي القسم النفسي السلوكي على حوالي 40 سؤالاً تقيس أنماط الشخصية.'
    },
    {
      question: 'هل توجد مؤشرات وقت لحل الأسئلة؟',
      answer: 'نعم، يوجد عداد زمني توجيهي أعلى الاختبار لمساعدتك على تنظيم وقتك أثناء الحل، لكنه لن يغلق الاختبار تلقائياً فور انتهائه.'
    }
  ];

  constructor(
    private router: Router,
    private domainService: AssessmentDomainService,
    private authService: AuthService
  ) {}

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

  ngOnInit(): void {
    this.user = this.authService.getUserFromStorage();
    this.loadDomains();
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

loadDomains(): void {
  this.domainService.getAllDomains().subscribe({
    next: (data) => {
      this.domains = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('خطأ أثناء تحميل المجالات:', err);
      this.loading = false;

      const status = err?.status || err?.error?.status || 0;

      // نحذف التوكن في حالة انتهاء الجلسة
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }

      // تنبيه لطيف بدون شكل خطأ
      Swal.fire({
        icon: 'info', // أو 'warning' لو تحب اللون الأصفر
        title: 'تسجيل الدخول مطلوب',
        text: 'يُرجى تسجيل الدخول لمتابعة استخدام المنصة.',
        confirmButtonText: 'الذهاب إلى تسجيل الدخول',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/auth']);
        }
      });
    },
  });
}


  goToDomain(domainId: number): void {
    this.router.navigate(['/evaluation/domains', domainId]);
  }

  getIconClass(icon: string): string {
    return icon || 'bi bi-grid';
  }

  getButtonClass(slug: string): string {
    return slug === 'psychological' ? 'btn-success' : 'btn-primary';
  }

  getItemsForDomain(slug: string): string[] {
    if (slug === 'programming') return ['Java', 'Python', 'JavaScript', 'C#'];
    if (slug === 'architecture') return ['Design', 'AutoCAD', 'Revit', 'Urban'];
    if (slug === 'data-science') return ['Stats', 'ML', 'Python', 'Viz'];
    if (slug === 'cyber-security') return ['OWASP', 'Network', 'Crypto', 'Hacking'];
    return ['المفاهيم', 'التطبيقات', 'الممارسات'];
  }
}
