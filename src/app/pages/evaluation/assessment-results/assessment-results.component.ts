import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentResultService } from '../../../services/assessment-result.service';
import { AssessmentResult } from '../../../models/assessment-result.model';

@Component({
  selector: 'app-assessment-results',
  template: `
    <div class="assessment-results-page min-vh-100 py-5" dir="rtl" *ngIf="result" style="background: var(--obour-surface);">
      <div class="container max-w-5xl mx-auto">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <!-- Header Banner -->
          <div class="card-banner p-5 text-center text-white" style="background: linear-gradient(135deg, var(--obour-primary), var(--obour-primary-light))">
             <div class="icon-circle bg-white text-dark mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle shadow-sm" style="width: 90px; height: 90px; font-size: 3rem;">
               <i class="fa-solid" [ngClass]="result.passed ? 'fa-medal text-warning' : 'fa-triangle-exclamation text-danger'"></i>
             </div>
             <h1 class="fs-2 fw-bold mb-2">{{ result.passed ? 'تهانينا، لقد اجتزت التقييم!' : 'حظاً أوفر المرة القادمة' }}</h1>
             <p class="mb-0 fs-5 text-white-50">تقييم {{ result.templateName }}</p>
          </div>
          
          <div class="card-body p-5 bg-white">
            <h4 class="fw-bold mb-4 border-bottom pb-3"><i class="fa-solid fa-chart-pie text-primary me-2"></i> ملخص الأداء</h4>
            
            <div class="row g-4 mb-5 align-items-center">
               <!-- Score Gauge (Visual simulation using conic-gradient) -->
               <div class="col-md-4 text-center">
                  <div class="position-relative d-inline-block">
                    <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                         [style.background]="getConicGradient(result.scorePercent)"
                         style="width: 180px; height: 180px; padding: 15px;">
                      <div class="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center w-100 h-100">
                        <span class="fs-1 fw-bold" [ngClass]="result.passed ? 'text-success' : 'text-danger'">{{ result.scorePercent }}%</span>
                        <span class="text-muted small">النتيجة النهائية</span>
                      </div>
                    </div>
                  </div>
               </div>

               <!-- Stats Grid -->
               <div class="col-md-8">
                 <div class="row g-3">
                   <div class="col-sm-6">
                      <div class="p-4 border rounded-3 bg-light text-center h-100 shadow-sm transition-hover">
                         <i class="fa-solid fa-bullseye text-primary fs-3 mb-2"></i>
                         <span class="d-block text-muted small fw-bold mb-1">الأسئلة الصحيحة</span>
                         <span class="fs-4 fw-bold text-dark">{{ result.correct }} <span class="fs-6 text-muted">من {{ result.totalQuestions }}</span></span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-4 border rounded-3 bg-light text-center h-100 shadow-sm transition-hover">
                         <i class="fa-solid fa-ranking-star text-warning fs-3 mb-2"></i>
                         <span class="d-block text-muted small fw-bold mb-1">المستوى المحقق</span>
                         <span class="fs-4 fw-bold text-dark">{{ formatLevel(result.levelAchieved) }}</span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-4 border rounded-3 bg-light text-center h-100 shadow-sm transition-hover">
                         <i class="fa-solid fa-stopwatch text-info fs-3 mb-2"></i>
                         <span class="d-block text-muted small fw-bold mb-1">الوقت المستغرق</span>
                         <span class="fs-4 fw-bold text-dark">{{ formatTime(result.timeTakenSecs) }}</span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-4 border rounded-3 bg-light text-center h-100 shadow-sm transition-hover">
                         <i class="fa-solid fa-coins text-success fs-3 mb-2"></i>
                         <span class="d-block text-muted small fw-bold mb-1">النقاط المكتسبة</span>
                         <span class="fs-4 fw-bold text-dark">{{ result.earnedPoints }} <span class="fs-6 text-muted">XP</span></span>
                      </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Detailed Question Review -->
            <ng-container *ngIf="result.questionReviews && result.questionReviews.length > 0">
              <h4 class="fw-bold mb-4 border-bottom pb-3 mt-5"><i class="fa-solid fa-list-check text-primary me-2"></i> مراجعة الإجابات</h4>
              <div class="list-group list-group-flush mb-4">
                <div class="list-group-item py-4 px-0 border-bottom" *ngFor="let review of result.questionReviews; let i = index">
                  <div class="d-flex gap-3 align-items-start">
                    <div class="flex-shrink-0 mt-1">
                      <i class="fa-solid fs-4" [ngClass]="review.isCorrect ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="fw-bold mb-2 fs-5">
                        <span class="text-muted me-1">{{ i + 1 }}.</span> 
                        {{ review.questionTextAr || review.questionText }}
                      </h6>
                      
                      <div class="d-flex flex-column gap-2 mt-3">
                        <div class="p-3 rounded-3" [ngClass]="review.isCorrect ? 'bg-success bg-opacity-10 border border-success' : 'bg-danger bg-opacity-10 border border-danger'">
                          <span class="fw-bold small text-muted d-block mb-1">إجابتك:</span>
                          <span [ngClass]="review.isCorrect ? 'text-success fw-bold' : 'text-danger fw-bold'">
                            <i class="fa-solid" [ngClass]="review.isCorrect ? 'fa-check me-2' : 'fa-xmark me-2'"></i>
                            {{ review.userChoiceTextAr || review.userChoiceText || 'لم يتم الإجابة' }}
                          </span>
                        </div>
                        
                        <div class="p-3 rounded-3 bg-light border" *ngIf="!review.isCorrect && (review.correctChoiceId || review.explanation)">
                          <span class="fw-bold small text-muted d-block mb-1">الإجابة الصحيحة:</span>
                          <span class="text-success fw-bold">
                            <i class="fa-solid fa-check-double me-2"></i>
                            (مخفية مؤقتاً حسب إعدادات التقييم)
                          </span>
                          <p class="mt-2 mb-0 small text-muted border-top pt-2" *ngIf="review.explanation">
                            <strong>توضيح:</strong> {{ review.explanation }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ng-container>

            <div class="text-center mt-5">
              <button class="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm" (click)="goHome()">
                <i class="fa-solid fa-house me-2"></i> العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transition-hover {
      transition: all 0.3s ease;
    }
    .transition-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
    }
  `]
})
export class AssessmentResultsComponent implements OnInit {
  result: AssessmentResult | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resultService: AssessmentResultService
  ) {}

  ngOnInit() {
    const sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    if (sessionId) {
      this.resultService.getResultBySession(sessionId).subscribe({
        next: (res) => this.result = res,
        error: (err) => console.error(err)
      });
    }
  }

  getConicGradient(percent: number): string {
    const color = percent >= 60 ? '#10b981' : '#ef4444'; // success green vs danger red
    return `conic-gradient(${color} ${percent}%, #e2e8f0 0)`;
  }

  formatTime(secs: number): string {
    if (!secs) return '0 ثانية';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s} ثانية`;
    return `${m} دقيقة و ${s} ثانية`;
  }

  formatLevel(level: string): string {
    const map: any = {
      'BEGINNER': 'مبتدئ',
      'INTERMEDIATE': 'متوسط',
      'ADVANCED': 'متقدم',
      'EXPERT': 'خبير'
    };
    return map[level] || level || 'غير محدد';
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
