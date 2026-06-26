import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentResultService } from '../../../services/assessment-result.service';
import { AssessmentResult } from '../../../models/assessment-result.model';

@Component({
  selector: 'app-assessment-results',
  template: `
    <div class="assessment-results-page min-vh-100 py-5" dir="rtl" *ngIf="result">
      <div class="container max-w-4xl mx-auto">
        <div class="card border-0 shadow-lg rounded-4 overflow-hidden mb-5">
          <div class="card-banner p-5 text-center text-white" [style.background]="result.domainColor || 'var(--obour-primary)'">
             <div class="icon-circle bg-white text-dark mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; font-size: 2.5rem;">
               <i class="fa-solid" [ngClass]="result.passed ? 'fa-trophy text-warning' : 'fa-triangle-exclamation text-danger'"></i>
             </div>
             <h1 class="fs-2 fw-bold mb-2">{{ result.passed ? 'تهانينا، لقد اجتزت التقييم!' : 'حظاً أوفر المرة القادمة' }}</h1>
             <p class="mb-0 fs-5">درجتك: {{ result.scorePercent }}%</p>
          </div>
          
          <div class="card-body p-5 bg-white">
            <h4 class="fw-bold mb-4">ملخص الأداء</h4>
            <div class="row g-4 mb-5">
               <div class="col-md-4">
                  <div class="p-3 border rounded text-center">
                     <span class="d-block text-muted small mb-1">الأسئلة الصحيحة</span>
                     <span class="fs-4 fw-bold text-success">{{ result.correct }} / {{ result.totalQuestions }}</span>
                  </div>
               </div>
               <div class="col-md-4">
                  <div class="p-3 border rounded text-center">
                     <span class="d-block text-muted small mb-1">المستوى المحقق</span>
                     <span class="fs-4 fw-bold text-primary">{{ result.levelAchieved }}</span>
                  </div>
               </div>
               <div class="col-md-4">
                  <div class="p-3 border rounded text-center">
                     <span class="d-block text-muted small mb-1">النقاط المكتسبة</span>
                     <span class="fs-4 fw-bold text-info">{{ result.earnedPoints }}</span>
                  </div>
               </div>
            </div>

            <div class="text-center mt-5">
              <button class="btn btn-outline-primary px-4 py-2 rounded-pill fw-bold mx-2" (click)="goHome()">العودة للرئيسية</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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

  goHome() {
    this.router.navigate(['/home']);
  }
}
