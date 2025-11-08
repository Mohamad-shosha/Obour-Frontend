import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { Question } from '../../../models/question.model';
import { SubmitAnswersRequest, AnswerItem } from '../../../models/student-answer.model';
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
        this.showError('فشل جلب بيانات الطالب.');
      },
    });
  }

  // ✅ تحميل القسم الحالي وتحديد اتجاه الأسئلة حسب القسم الأب
  loadSectionAndDirection(): void {
    this.evaluationService.getSection(this.sectionId).subscribe({
      next: (section) => {
        this.sectionName = section.name;
        this.parentId = section.parentId!;

        // جلب القسم الأب لتحديد نوعه
        this.evaluationService.getSection(this.parentId).subscribe({
          next: (parentSection) => {
            const type = parentSection.name.toLowerCase(); // أو parentSection.type إذا موجود
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
    const answers: AnswerItem[] = this.questions.map((q) => ({
      questionId: q.id,
      choiceId: this.selectedChoices[q.id]!,
    }));

    const request: SubmitAnswersRequest = { studentId: this.studentId, answers };

    this.evaluationService.submitAnswers(request).subscribe({
      next: () => {
        this.showSuccess('تم إرسال الإجابات بنجاح!');
        this.router.navigate(['/evaluation']);
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
    Swal.fire({ icon: 'warning', title: 'تنبيه', text: message, confirmButtonText: 'حسنًا', customClass: { confirmButton: 'btn btn-warning' } });
  }

  private showError(message: string): void {
    Swal.fire({ icon: 'error', title: 'خطأ', text: message, confirmButtonText: 'إغلاق', customClass: { confirmButton: 'btn btn-danger' } });
  }

  private showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: 'نجاح', text: message, confirmButtonText: 'موافق', customClass: { confirmButton: 'btn btn-success' } });
  }
}
