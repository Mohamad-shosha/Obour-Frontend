import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentResultService } from '../../../services/assessment-result.service';
import { AssessmentResult } from '../../../models/assessment-result.model';
import { TextDirectionUtil } from '../../../shared/utils/text-direction.util';

@Component({
  selector: 'app-assessment-results',
  template: `
    <div class="assessment-results-page min-vh-100 py-5 position-relative" dir="rtl" *ngIf="result" style="background: var(--obour-bg); overflow-x: hidden;">
      
      <!-- Background Effects -->
      <div class="position-absolute top-0 start-0 w-100 h-100" style="pointer-events: none; z-index: 0; overflow: hidden;">
        <div class="position-absolute rounded-circle" style="width: 600px; height: 600px; background: rgba(59, 130, 246, 0.05); filter: blur(100px); top: -10%; right: -10%;"></div>
        <div class="position-absolute rounded-circle" style="width: 500px; height: 500px; background: rgba(139, 92, 246, 0.05); filter: blur(100px); bottom: 10%; left: -5%;"></div>
      </div>

      <div class="container position-relative z-index-10 max-w-4xl mx-auto">
        <div class="card border-0 premium-shadow rounded-4 overflow-hidden mb-5 glass-card">
          <!-- Header Banner -->
          <div class="card-banner p-4 text-center position-relative overflow-hidden" [ngClass]="result.passed ? 'bg-gradient-success' : 'bg-gradient-danger'">
             <!-- Pattern Overlay -->
             <div class="position-absolute w-100 h-100 top-0 start-0" style="background-image: radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.3;"></div>
             
             <div class="icon-circle bg-white mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle shadow-lg position-relative z-index-1" style="width: 80px; height: 80px; font-size: 2.5rem;" [ngClass]="result.passed ? 'text-success' : 'text-danger'">
                <i class="fa-solid" [ngClass]="result.passed ? 'fa-trophy' : 'fa-triangle-exclamation'"></i>
             </div>
             <h1 class="fs-3 fw-bold mb-1.5 text-white position-relative z-index-1 drop-shadow">{{ result.passed ? 'تهانينا، لقد اجتزت التقييم بتميز!' : 'حظاً أوفر، يمكنك المحاولة مرة أخرى' }}</h1>
             <p class="mb-0 fs-6 text-white-50 position-relative z-index-1 fw-bold">تقييم {{ result.templateName }}</p>
          </div>
          
          <div class="card-body p-4" style="background: var(--obour-surface);">
            <h4 class="fs-5 fw-bold mb-3.5 border-bottom pb-2.5 text-main"><i class="fa-solid fa-chart-pie text-primary me-2"></i> لوحة الأداء التحليلية</h4>
            
            <div class="row g-4 mb-5 align-items-center">
               <!-- Score Gauge -->
               <div class="col-md-4 text-center">
                  <div class="position-relative d-inline-block hover-scale">
                    <div class="rounded-circle d-flex align-items-center justify-content-center shadow-lg"
                         [style.background]="getConicGradient(result.scorePercent)"
                         style="width: 170px; height: 170px; padding: 14px; transition: all 0.5s ease;">
                      <div class="rounded-circle d-flex flex-column align-items-center justify-content-center w-100 h-100 shadow-inner" style="background: var(--obour-surface);">
                        <span class="fs-2 fw-bolder" [ngClass]="result.passed ? 'text-success' : 'text-danger'">{{ result.scorePercent }}%</span>
                        <span class="text-muted small fw-semibold mt-1">النتيجة النهائية</span>
                      </div>
                    </div>
                  </div>
               </div>

               <!-- Stats Grid -->
               <div class="col-md-8">
                 <div class="row g-3">
                   <div class="col-sm-6">
                      <div class="p-3 rounded-3 text-center h-100 premium-shadow hover-lift border" style="background: var(--obour-surface-2); border-color: var(--obour-border) !important;">
                         <div class="icon-box mx-auto bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mb-2" style="width: 40px; height: 40px;">
                           <i class="fa-solid fa-bullseye fs-5"></i>
                         </div>
                         <span class="d-block text-muted small fw-bold mb-1">الأسئلة الصحيحة</span>
                         <span class="fs-4 fw-bold text-main">{{ result.correct }} <span class="fs-6 text-muted">من {{ result.totalQuestions }}</span></span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-3 rounded-3 text-center h-100 premium-shadow hover-lift border" style="background: var(--obour-surface-2); border-color: var(--obour-border) !important;">
                         <div class="icon-box mx-auto bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center mb-2" style="width: 40px; height: 40px;">
                           <i class="fa-solid fa-ranking-star fs-5"></i>
                         </div>
                         <span class="d-block text-muted small fw-bold mb-1">المستوى المحقق</span>
                         <span class="fs-5 fw-bold text-main">{{ formatLevel(result.levelAchieved) }}</span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-3 rounded-3 text-center h-100 premium-shadow hover-lift border" style="background: var(--obour-surface-2); border-color: var(--obour-border) !important;">
                         <div class="icon-box mx-auto bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mb-2" style="width: 40px; height: 40px;">
                           <i class="fa-solid fa-stopwatch fs-5"></i>
                         </div>
                         <span class="d-block text-muted small fw-bold mb-1">الوقت المستغرق</span>
                         <span class="fs-5 fw-bold text-main">{{ formatTime(result.timeTakenSecs) }}</span>
                      </div>
                   </div>
                   <div class="col-sm-6">
                      <div class="p-3 rounded-3 text-center h-100 premium-shadow hover-lift border" style="background: var(--obour-surface-2); border-color: var(--obour-border) !important;">
                         <div class="icon-box mx-auto bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mb-2" style="width: 40px; height: 40px;">
                           <i class="fa-solid fa-coins fs-5"></i>
                         </div>
                         <span class="d-block text-muted small fw-bold mb-1">النقاط المكتسبة (XP)</span>
                         <span class="fs-4 fw-bold text-success">{{ result.earnedPoints }}</span>
                      </div>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Detailed Question Review -->
            <ng-container *ngIf="result.questionReviews && result.questionReviews.length > 0">
              <h4 class="fs-5 fw-bold mb-3.5 border-bottom pb-2.5 mt-5 text-main"><i class="fa-solid fa-microscope text-primary me-2"></i> المراجعة الدقيقة للإجابات</h4>
              <div class="d-flex flex-column gap-3.5 mb-4">
                <div class="review-card p-3.5 rounded-3 border premium-shadow position-relative overflow-hidden" 
                     style="background: var(--obour-surface); border-color: var(--obour-border) !important;"
                     [ngClass]="review.isCorrect ? 'border-success' : 'border-danger'"
                     *ngFor="let review of result.questionReviews; let i = index">
                      
                   <!-- Indicator Strip -->
                   <div class="position-absolute top-0 start-0 h-100 w-1" [ngClass]="review.isCorrect ? 'bg-success' : 'bg-danger'" style="width: 6px;"></div>
                   
                   <div class="d-flex gap-3 align-items-start ms-2">
                     <div class="flex-shrink-0 mt-1">
                       <div class="icon-box rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" 
                            [ngClass]="review.isCorrect ? 'bg-success' : 'bg-danger'" 
                            style="width: 36px; height: 36px;">
                         <i class="fa-solid fs-6" [ngClass]="review.isCorrect ? 'fa-check' : 'fa-xmark'"></i>
                       </div>
                     </div>
                     
                     <div class="flex-grow-1">
                       <h5 class="fw-bold mb-3 lh-base text-main" 
                           [attr.dir]="review.questionTextAr ? 'rtl' : 'ltr'" 
                           [style.text-align]="review.questionTextAr ? 'right' : 'left'">
                         <span class="text-muted me-2 fs-6">السؤال {{ i + 1 }}:</span> 
                         {{ review.questionTextAr || review.questionText }}
                       </h5>
                       
                       <div class="d-flex flex-column gap-3 mt-3">
                         <!-- User's Choice -->
                         <div class="p-2.5 rounded-3" 
                              [ngClass]="review.isCorrect ? 'bg-success bg-opacity-10 border border-success border-opacity-25' : 'bg-danger bg-opacity-10 border border-danger border-opacity-25'"
                              [attr.dir]="getChoiceDirection(review.userChoiceTextAr || review.userChoiceText)">
                           <span class="fw-bold small text-muted d-block mb-1.5" [attr.dir]="'rtl'" [style.text-align]="'right'">إجابتك:</span>
                           <span class="fs-6" 
                                 [ngClass]="review.isCorrect ? 'text-success fw-bold' : 'text-danger fw-bold text-decoration-line-through'"
                                 [style.text-align]="getChoiceDirection(review.userChoiceTextAr || review.userChoiceText) === 'rtl' ? 'right' : 'left'">
                             <i class="fa-solid" [ngClass]="review.isCorrect ? 'fa-check-circle me-2' : 'fa-times-circle me-2'"></i>
                             {{ review.userChoiceTextAr || review.userChoiceText || 'لم يتم الإجابة' }}
                           </span>
                         </div>
                         
                         <!-- Explanation & Correct Answer (Only shown if wrong) -->
                         <div class="p-3.5 rounded-3" *ngIf="!review.isCorrect" 
                              style="background: rgba(59, 130, 246, 0.05); border: 1px dashed rgba(59, 130, 246, 0.3);"
                              [attr.dir]="getExplanationDirection(review.explanation)">
                           <h6 class="fw-bold text-primary mb-2 d-flex align-items-center" [attr.dir]="'rtl'">
                             <i class="fa-solid fa-lightbulb text-warning fs-5 me-2"></i> 
                             لماذا أخطأت؟ (الإجابة الصحيحة والتوضيح)
                           </h6>
                           <p class="mb-0 text-main fs-6 lh-lg fw-semibold"
                              [style.text-align]="getExplanationDirection(review.explanation) === 'rtl' ? 'right' : 'left'">
                             {{ review.explanation || 'الإجابة التي اخترتها غير صحيحة بناءً على المفاهيم الأساسية للمجال. يرجى مراجعة المادة العلمية المتعلقة بهذا السؤال لضمان عدم تكرار الخطأ مستقبلاً.' }}
                           </p>
                         </div>
                       </div>
                       
                     </div>
                   </div>
                 </div>
               </div>
            </ng-container>

            <div class="text-center mt-5">
              <button class="btn btn-premium d-inline-flex align-items-center gap-2" (click)="goDashboard()">
                <i class="fa-solid fa-chart-line"></i> العودة للوحة التحكم
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-gradient-success {
      background: linear-gradient(135deg, #059669, #10b981);
    }
    .bg-gradient-danger {
      background: linear-gradient(135deg, #e11d48, #f43f5e);
    }
    .drop-shadow {
      text-shadow: 0 4px 10px rgba(0,0,0,0.2);
    }
    .premium-shadow {
      box-shadow: var(--shadow-lg) !important;
    }
    .glass-card {
      background: var(--obour-surface);
      backdrop-filter: blur(10px);
      border: 1px solid var(--obour-border) !important;
    }
    .hover-lift {
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl) !important;
    }
    .hover-scale {
      transition: transform 0.3s ease;
    }
    .hover-scale:hover {
      transform: scale(1.05);
    }
    .text-main {
      color: var(--obour-text-main) !important;
    }
    .review-card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .review-card:hover {
      transform: translateX(-5px);
      box-shadow: var(--shadow-md) !important;
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
    const color = percent >= 60 ? '#10b981' : '#ef4444'; 
    return `conic-gradient(${color} ${percent}%, var(--obour-surface-2) 0)`;
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

  goDashboard() {
    this.router.navigate(['/evaluation/results']);
  }

  getReviewText(review: any): string {
    return review.questionTextAr || review.questionText;
  }

  getReviewDirection(review: any): 'ltr' | 'rtl' {
    return TextDirectionUtil.getTextDirection(this.getReviewText(review));
  }

  getReviewAlign(review: any): 'left' | 'right' {
    return this.getReviewDirection(review) === 'rtl' ? 'right' : 'left';
  }

  getChoiceDirection(text: string | undefined | null): 'ltr' | 'rtl' {
    if (!text) return 'rtl';
    return TextDirectionUtil.getTextDirection(text);
  }

  getExplanationDirection(text: string | undefined | null): 'ltr' | 'rtl' {
    if (!text) return 'rtl';
    return TextDirectionUtil.getTextDirection(text);
  }
}
