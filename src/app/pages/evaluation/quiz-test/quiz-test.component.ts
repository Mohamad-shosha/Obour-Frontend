import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { Question } from '../../../models/question.model';
import {
  SubmitAnswersRequest,
  AnswerItem,
} from '../../../models/student-answer.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz-test',
  templateUrl: './quiz-test.component.html',
  styleUrls: ['./quiz-test.component.scss'],
})
export class QuizTestComponent implements OnInit {
  sectionId!: number;
  parentId!: number;
  sectionName!: string;
  questions: Question[] = [];
  currentQuestionIndex = 0;
  selectedChoices: { [questionId: number]: number } = {};
  loading = true;
  error: string | null = null;
  studentId!: number;

  // اتجاه النص ومحاذاته
  textDirection: 'ltr' | 'rtl' = 'rtl';
  textAlign: 'left' | 'right' = 'right';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.sectionId = Number(this.route.snapshot.paramMap.get('sectionId'));
    this.loadStudentId();
    this.loadSectionAndDirection();
    this.loadQuestions();
  }

  loadStudentId(): void {
    this.evaluationService.getCurrentUser().subscribe({
      next: (user) => (this.studentId = user.id),
      error: (err) => {
        console.error('فشل جلب بيانات الطالب', err);
        this.showError('فشل جلب بيانات الطالب.  ');
      },
    });
  }

  loadSectionAndDirection(): void {
    this.evaluationService.getSection(this.sectionId).subscribe({
      next: (section) => {
        this.sectionName = section.name;
        this.parentId = section.parentId!;

        this.evaluationService.getSection(this.parentId).subscribe({
          next: (parentSection) => {
            const type = parentSection.name.toLowerCase();
            if (type.includes('academic')) {
              this.textDirection = 'ltr';
              this.textAlign = 'left';
            } else {
              this.textDirection = 'rtl';
              this.textAlign = 'right';
            }
          },
          error: (err) => console.error('فشل جلب بيانات القسم الأب', err),
        });
      },
      error: (err) => {
        console.error('فشل تحميل اسم الاختبار', err);
        this.showError('فشل تحميل بيانات الاختبار');
      },
    });
  }

  loadQuestions(): void {
    this.evaluationService.getQuestionsBySection(this.sectionId).subscribe({
      next: (data) => {
        this.questions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('فشل تحميل الأسئلة', err);
        this.showError('فشل تحميل الأسئلة. حاول لاحقًا.');
        this.loading = false;
      },
    });
  }

  getCurrentQuestion(): Question {
    return this.questions[this.currentQuestionIndex];
  }

  getProgress(): number {
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  selectChoice(choiceId: number): void {
    this.selectedChoices[this.getCurrentQuestion().id] = choiceId;
  }

  isChoiceSelected(choiceId: number): boolean {
    return this.selectedChoices[this.getCurrentQuestion().id] === choiceId;
  }

  goToPrevious(): void {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  goToNext(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!this.selectedChoices[currentQuestion.id]) {
      this.showWarning('الرجاء اختيار إجابة قبل المتابعة');
      return;
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.submitAnswers();
    }
  }

  submitAnswers(): void {
    const hasUnanswered = this.questions.some(
      (q) => this.selectedChoices[q.id] == null
    );
    if (hasUnanswered) {
      this.showWarning('يرجى الإجابة على جميع الأسئلة قبل الإرسال.');
      return;
    }

    const answers: AnswerItem[] = this.questions.map((q) => ({
      questionId: q.id,
      choiceId: this.selectedChoices[q.id]!,
    }));

    const request: SubmitAnswersRequest = {
      studentId: this.studentId,
      answers,
    };

    // أولاً: إرسال الإجابات
    this.evaluationService.submitAnswers(request).subscribe({
      next: () => {
        // ثانيًا: حساب الدرجة القصوى حسب نوع القسم
        const totalQuestions = this.questions.length;
        const maxScore = this.isAcademic ? totalQuestions : totalQuestions * 5;

        // ثالثًا: جلب الدرجة الفعلية من السيرفر (مثلما تفعل في لوحة التحكم)
        this.evaluationService
          .getStudentScoreBySection(this.studentId, this.sectionId)
          .subscribe({
            next: (actualScore: number) => {
              const isPassed = actualScore >= maxScore / 2;

              if (isPassed) {
                Swal.fire({
                  icon: 'success',
                  title: 'تم اجتياز الاختبار بنجاح!',
                  html: `<strong>${this.sectionName}</strong><br><br>درجتك: ${actualScore} من ${maxScore}`,
                  showCancelButton: true,
                  confirmButtonText: 'اختبارات أخرى',
                  cancelButtonText: 'الرئيسية',
                  reverseButtons: true,
                  customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-outline-secondary',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate([
                      '/evaluation/sections',
                      this.parentId,
                    ]);
                  } else {
                    this.router.navigate(['/evaluation']);
                  }
                });
              } else {
                Swal.fire({
                  icon: 'info',
                  title: 'ننصحك بالمراجعة والتطوير',
                  html: `في اختبار <strong>${this.sectionName}</strong>، درجتك: ${actualScore} من ${maxScore}.<br><br>نوصيك بمراجعة المحتوى وتحسين الأداء.`,
                  showCancelButton: true,
                  confirmButtonText: 'اختبارات أخرى',
                  cancelButtonText: 'الرئيسية',
                  reverseButtons: true,
                  customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-outline-secondary',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate([
                      '/evaluation/sections',
                      this.parentId,
                    ]);
                  } else {
                    this.router.navigate(['/evaluation']);
                  }
                });
              }
            },
            error: (err) => {
              console.error('فشل جلب درجة القسم بعد الإرسال', err);
              this.showError('فشل جلب الدرجة بعد الإرسال');
              this.router.navigate(['/evaluation']);
            },
          });
      },
      error: (err) => {
        console.error('فشل إرسال الإجابات', err);
        this.showError('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/evaluation/sections', this.parentId]);
  }

  get isAcademic(): boolean {
    return this.textDirection === 'ltr';
  }

  private showWarning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'تنبيه',
      text: message,
      confirmButtonText: 'حسنًا',
      customClass: { confirmButton: 'btn btn-warning' },
    });
  }

  private showError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: message,
      confirmButtonText: 'إغلاق',
      customClass: { confirmButton: 'btn btn-danger' },
    });
  }
}
