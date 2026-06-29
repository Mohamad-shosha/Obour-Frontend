import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentSessionService } from '../../../services/assessment-session.service';
import { AssessmentSession, SaveAnswerRequest } from '../../../models/assessment-session.model';
import { QuestionBank, QuestionBankChoice } from '../../../models/question-bank.model';
import { TextDirectionUtil } from '../../../shared/utils/text-direction.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assessment-engine',
  templateUrl: './assessment-engine.component.html',
  styleUrls: ['./assessment-engine.component.scss']
})
export class AssessmentEngineComponent implements OnInit, OnDestroy {
  session!: AssessmentSession;
  currentQuestionIndex = 0;
  answers: { [questionId: number]: number } = {};
  flaggedQuestions: Set<number> = new Set();
  timeRemaining = 0;
  timerInterval: any;
  loading = true;
  submitting = false;
  showQuestionMap = false;
  savingAnswer = false;

  // --- RTL/LTR direction helpers ---
  getQuestionDirection(): 'rtl' | 'ltr' {
    if (!this.currentQuestion) return 'rtl';
    const text = this.currentQuestion.questionTextAr || this.currentQuestion.questionText;
    return TextDirectionUtil.getTextDirection(text);
  }

  getQuestionAlign(): 'right' | 'left' {
    return this.getQuestionDirection() === 'rtl' ? 'right' : 'left';
  }

  getChoiceLabel(index: number): string {
    const letters = TextDirectionUtil.getChoiceLetters(this.getQuestionDirection());
    return letters[index] || String(index + 1);
  }

  getChoiceDirection(choiceText: string): 'rtl' | 'ltr' {
    return TextDirectionUtil.getTextDirection(choiceText);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: AssessmentSessionService
  ) {}

  ngOnInit() {
    const sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    if (sessionId) {
      this.loadSession(sessionId);
    } else {
      this.router.navigate(['/evaluation']);
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
    this.loading = true;
    this.sessionService.getSession(sessionId).subscribe({
      next: (session) => {
        this.session = session;
        this.currentQuestionIndex = session.currentQuestionIndex || 0;
        this.loading = false;
        this.startTimer();
      },
      error: (err) => {
        console.error('Error loading session:', err);
        this.loading = false;
        Swal.fire('خطأ', 'تعذر تحميل جلسة التقييم', 'error');
        this.router.navigate(['/evaluation']);
      }
    });
  }

  // ── Timer ──────────────────────────────────────────────────────────────
  startTimer() {
    const timeLimitSecs = this.session.timeLimitMins * 60;
    const remainingSecs = timeLimitSecs - (this.session.timeSpentSecs || 0);
    const expiresAt = Date.now() + (remainingSecs * 1000);

    this.updateTimeRemaining(expiresAt);

    this.timerInterval = setInterval(() => {
      this.updateTimeRemaining(expiresAt);
      if (this.timeRemaining <= 0) {
        clearInterval(this.timerInterval);
        this.autoSubmit();
      }
    }, 1000);
  }

  updateTimeRemaining(expiresAt: number) {
    this.timeRemaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
  }

  get timerMinutes(): number {
    return Math.floor(this.timeRemaining / 60);
  }

  get timerSeconds(): number {
    return this.timeRemaining % 60;
  }

  get timerUrgent(): boolean {
    return this.timeRemaining < 120; // less than 2 minutes
  }

  get timerFormatted(): string {
    const m = String(this.timerMinutes).padStart(2, '0');
    const s = String(this.timerSeconds).padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Questions ──────────────────────────────────────────────────────────
  get currentQuestion(): QuestionBank | null {
    if (!this.session?.questions || this.session.questions.length === 0) return null;
    return this.session.questions[this.currentQuestionIndex] || null;
  }

  get totalQuestions(): number {
    return this.session?.questions?.length || 0;
  }

  get answeredCount(): number {
    return Object.keys(this.answers).length;
  }

  get progressPercent(): number {
    if (this.totalQuestions === 0) return 0;
    return Math.round((this.answeredCount / this.totalQuestions) * 100);
  }

  isAnswered(questionIndex: number): boolean {
    const q = this.session?.questions?.[questionIndex];
    return q ? this.answers[q.id] !== undefined : false;
  }

  isFlagged(questionIndex: number): boolean {
    const q = this.session?.questions?.[questionIndex];
    return q ? this.flaggedQuestions.has(q.id) : false;
  }

  isSelectedChoice(choiceId: number): boolean {
    if (!this.currentQuestion) return false;
    return this.answers[this.currentQuestion.id] === choiceId;
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  goToQuestion(index: number) {
    if (index >= 0 && index < this.totalQuestions) {
      this.currentQuestionIndex = index;
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  // ── Answer Selection ───────────────────────────────────────────────────
  selectChoice(choice: QuestionBankChoice) {
    if (!this.currentQuestion || this.submitting) return;

    const questionId = this.currentQuestion.id;
    this.answers[questionId] = choice.id;
    this.saveCurrentAnswer(questionId, choice.id);
  }

  saveCurrentAnswer(questionId: number, choiceId: number) {
    this.savingAnswer = true;
    const elapsed = this.session.timeLimitMins * 60 - this.timeRemaining;

    const request: SaveAnswerRequest = {
      questionId: questionId,
      choiceId: choiceId,
      timeSpentSecs: elapsed
    };

    this.sessionService.saveAnswer(this.session.id, request).subscribe({
      next: () => {
        this.savingAnswer = false;
      },
      error: (err) => {
        console.error('Error saving answer:', err);
        this.savingAnswer = false;
      }
    });
  }

  // ── Flagging ───────────────────────────────────────────────────────────
  toggleFlag() {
    if (!this.currentQuestion) return;
    const qId = this.currentQuestion.id;
    if (this.flaggedQuestions.has(qId)) {
      this.flaggedQuestions.delete(qId);
    } else {
      this.flaggedQuestions.add(qId);
    }
  }

  // ── Question Map ───────────────────────────────────────────────────────
  toggleQuestionMap() {
    this.showQuestionMap = !this.showQuestionMap;
  }

  getQuestionStatus(index: number): string {
    if (index === this.currentQuestionIndex) return 'current';
    if (this.isFlagged(index) && this.isAnswered(index)) return 'flagged-answered';
    if (this.isFlagged(index)) return 'flagged';
    if (this.isAnswered(index)) return 'answered';
    return 'unanswered';
  }

  // ── Submission ─────────────────────────────────────────────────────────
  confirmSubmit() {
    const unanswered = this.totalQuestions - this.answeredCount;
    const msg = unanswered > 0
      ? `لديك ${unanswered} سؤال بدون إجابة. هل تريد تسليم التقييم؟`
      : 'هل أنت متأكد من تسليم التقييم؟';

    Swal.fire({
      title: 'تأكيد التسليم',
      text: msg,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، سلّم التقييم',
      cancelButtonText: 'عودة للأسئلة',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
    }).then((result) => {
      if (result.isConfirmed) {
        this.submitAssessment();
      }
    });
  }

  autoSubmit() {
    Swal.fire({
      title: 'انتهى الوقت!',
      text: 'سيتم تسليم التقييم تلقائياً الآن',
      icon: 'warning',
      timer: 3000,
      showConfirmButton: false,
    });
    this.submitAssessment();
  }

  submitAssessment() {
    this.submitting = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.sessionService.submitAssessment(this.session.id).subscribe({
      next: (result) => {
        this.session.status = 'SUBMITTED';
        this.router.navigate(['/evaluation/results', this.session.id]);
      },
      error: (err) => {
        console.error('Error submitting assessment:', err);
        this.submitting = false;
        Swal.fire('خطأ', 'تعذر تسليم التقييم. حاول مرة أخرى', 'error');
      }
    });
  }
}
