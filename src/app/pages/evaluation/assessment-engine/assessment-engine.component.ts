import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentSessionService } from '../../../services/assessment-session.service';
import { AssessmentSession } from '../../../models/assessment-session.model';
import { QuestionBank, QuestionBankChoice } from '../../../models/question-bank.model';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assessment-engine',
  templateUrl: './assessment-engine.component.html',
  styleUrls: ['./assessment-engine.component.scss']
})
export class AssessmentEngineComponent implements OnInit, OnDestroy {
  session!: AssessmentSession;
  currentQuestionIndex = 0;
  answers: { [questionId: number]: number } = {};
  timeRemaining = 0;
  timerInterval: any;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: AssessmentSessionService
  ) {}

  ngOnInit() {
    const sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    if (sessionId) {
      this.loadSession(sessionId);
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.session && this.session.status === 'IN_PROGRESS') {
      $event.returnValue = true;
    }
  }

  canDeactivate(): boolean {
    if (this.session && this.session.status === 'IN_PROGRESS' && !this.submitting) {
      return window.confirm('هل أنت متأكد من رغبتك في المغادرة؟ الإجابات الحالية محفوظة، لكن الوقت سيستمر في النفاذ.');
    }
    return true;
  }

  loadSession(sessionId: number) {
    // In a real app we'd fetch the session details from the backend, including questions
    // Since we don't have a direct GET /sessions/{id} implemented in the backend yet,
    // we'll simulate it or assume the startSession returned it and we stored it in a service state.
    // For now, let's just show an error if we can't load it via startSession.
    Swal.fire('غير متوفر', 'واجهة جلب الجلسة النشطة غير منفذة في الباك اند حاليا', 'info');
    this.router.navigate(['/evaluation']);
  }

  // Engine logic would go here: next, prev, selectAnswer, submit, timer, etc.
}
