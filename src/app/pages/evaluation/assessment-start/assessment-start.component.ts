import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AssessmentSessionService } from '../../../services/assessment-session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assessment-start',
  template: `
    <div class="assessment-start-page min-vh-100 py-5" dir="rtl">
      <div class="container max-w-3xl mx-auto">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden" style="background: var(--obour-surface);">
          <div class="card-banner bg-primary p-5 text-center text-white position-relative" style="background: linear-gradient(135deg, var(--obour-primary), var(--obour-primary-light))">
             <div class="icon-circle bg-white text-primary mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style="width: 70px; height: 70px; font-size: 2rem;">
               <i class="fa-solid fa-flag-checkered"></i>
             </div>
             <h1 class="fs-3 fw-bold mb-2">تعليمات ما قبل التقييم</h1>
             <p class="mb-0 text-white-50">الرجاء قراءة التعليمات بعناية قبل البدء</p>
          </div>
          
          <div class="card-body p-5">
            <h4 class="fs-5 fw-bold mb-4 border-bottom pb-3"><i class="fa-solid fa-clipboard-list text-primary me-2"></i> إرشادات هامة:</h4>
            
            <ul class="list-unstyled mb-5">
              <li class="d-flex align-items-start gap-3 mb-4">
                <i class="fa-solid fa-stopwatch text-warning mt-1 fs-5"></i>
                <div>
                  <h5 class="fw-bold fs-6 mb-1">الوقت المحدد</h5>
                  <p class="text-muted small mb-0">سيكون لديك وقت محدد للإجابة على جميع الأسئلة. سيتم حفظ إجاباتك وإغلاق الاختبار تلقائياً عند انتهاء الوقت.</p>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3 mb-4">
                <i class="fa-solid fa-arrow-right-arrow-left text-info mt-1 fs-5"></i>
                <div>
                  <h5 class="fw-bold fs-6 mb-1">التنقل بين الأسئلة</h5>
                  <p class="text-muted small mb-0">يمكنك التنقل بحرية بين الأسئلة ومراجعتها قبل التسليم النهائي.</p>
                </div>
              </li>
              <li class="d-flex align-items-start gap-3 mb-4">
                <i class="fa-solid fa-wifi text-success mt-1 fs-5"></i>
                <div>
                  <h5 class="fw-bold fs-6 mb-1">الاستقرار</h5>
                  <p class="text-muted small mb-0">تأكد من استقرار اتصالك بالإنترنت. يتم حفظ إجاباتك تلقائياً بعد كل اختيار.</p>
                </div>
              </li>
            </ul>

            <div class="d-flex gap-3 justify-content-end">
              <button class="btn btn-light px-4 py-2.5 rounded-pill fw-bold border" (click)="goBack()">رجوع</button>
              <button class="btn btn-primary px-5 py-2.5 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2" (click)="startSession()" [disabled]="loading">
                <span *ngIf="!loading">بدء التقييم الآن</span>
                <span *ngIf="loading"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري التهيئة...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AssessmentStartComponent implements OnInit {
  templateId!: number;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sessionService: AssessmentSessionService
  ) {}

  ngOnInit() {
    this.templateId = Number(this.route.snapshot.paramMap.get('templateId'));
  }

  goBack() {
    this.router.navigate(['/evaluation']);
  }

  startSession() {
    const user = this.authService.getUserFromStorage();
    if (!user) {
      Swal.fire('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول لبدء التقييم', 'info');
      this.router.navigate(['/auth']);
      return;
    }

    this.loading = true;
    this.sessionService.startSession({
      userId: user.id,
      categoryId: this.templateId, // The route parameter is named templateId but it's actually the categoryId
      resumeIfExists: true
    }).subscribe({
      next: (session) => {
        if (session.status === 'SUBMITTED') {
          Swal.fire({
            title: 'اكتمل التقييم',
            text: 'لقد أتممت هذا التقييم مسبقاً. سيتم نقلك لصفحة النتائج.',
            icon: 'info',
            timer: 3000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/evaluation/results', session.id]);
          });
        } else {
          this.router.navigate(['/evaluation/engine', session.id]);
        }
      },
      error: (err) => {
          console.error(err);
          this.loading = false;
          const msg = err.error?.message || 'تعذر بدء الجلسة. حاول مرة أخرى';
          Swal.fire('حدث خطأ', msg, 'error');
      }
    });
  }
}
