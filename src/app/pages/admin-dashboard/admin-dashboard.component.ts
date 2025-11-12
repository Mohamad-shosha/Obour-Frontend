// src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

// واجهة لبيانات الإجابة الموسعة
interface EnrichedAnswer {
  questionId: number;
  questionText: string;
  choiceId: number;
  choiceText: string;
  score: number;
  sectionId: number;
  sectionName: string;
  sectionFinalScore: number;
  createdAt: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  // --- خصائص الـ sidebar والـ sections ---
  sidebarOpen: boolean = true;
  isMobile: boolean = false;
  viewSection: string = 'allUsers'; // 'allUsers' | 'teachers' | 'students'
  currentUser: any = null;
  teachers: any[] = [];
  students: any[] = [];
  users: any[] = [];
  studentScores: { [key: number]: number } = {};
  studentSectionScores: { [key: number]: any[] } = {};

  // --- خصائص عرض الإجابات ---
  selectedStudent: any = null;
  studentAnswers: EnrichedAnswer[] = [];
  sections: any[] = [];
  questionsMap: { [key: number]: any } = {};
  choicesMap: { [key: number]: any } = {};
  sectionFinalScores: { [key: string]: number } = {};

  constructor(
    private adminService: AdminDashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    const currentUser = this.authService.getUserFromStorage();
    if (!currentUser || currentUser.role !== 'TEACHER') {
      Swal.fire('غير مصرح', 'هذه الصفحة مخصصة للمعلمين فقط', 'error');
      this.router.navigate(['/auth']);
      return;
    }
    this.currentUser = currentUser;
    this.loadAllUsers();
    this.loadSectionsAndQuestions();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // --- دوال الـ sidebar ---
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setView(section: string): void {
    this.viewSection = section;
    if (window.innerWidth < 992) {
      this.sidebarOpen = false;
    }
  }

  loadAllUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.teachers = users.filter((u) => u.role === 'TEACHER');
        this.students = users.filter((u) => u.role === 'STUDENT');
        this.users = users;
        this.loadAllScores();
      },
      error: (err) => {
        console.error('فشل تحميل المستخدمين', err);
        Swal.fire('خطأ', 'فشل تحميل قائمة المستخدمين', 'error');
      },
    });
  }

  loadAllScores(): void {
    this.students.forEach((student) => {
      this.adminService.getStudentScore(student.id).subscribe((score) => {
        this.studentScores[student.id] = score;
      });

      this.adminService.getAllSections().subscribe((sections) => {
        const sectionScores = sections.map((section) => ({
          sectionId: section.id,
          sectionName: section.name,
          score: 0,
        }));

        sectionScores.forEach((ss) => {
          this.adminService
            .getStudentScoreBySection(student.id, ss.sectionId)
            .subscribe((score) => {
              ss.score = score;
            });
        });

        this.studentSectionScores[student.id] = sectionScores;
      });
    });
  }

  // --- دوال العرض ---
  getUserScore(userId: number): number | null {
    return this.studentScores[userId] || null;
  }

  getScoreClass(score: number | null): string {
    if (score === null) return 'bg-secondary';
    if (score >= 80) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-danger';
  }

  getRoleLabel(role: string): string {
    return role === 'TEACHER' ? 'معلم' : 'طالب';
  }

  getRoleClass(role: string): string {
    return role === 'TEACHER' ? 'bg-primary-role' : 'bg-success-role';
  }

  viewStudentSections(studentId: number): void {
    this.adminService.getRootSections().subscribe((rootSections) => {
      let html =
        '<div dir="rtl" class="text-right" style="max-height: 600px; overflow-y: auto; padding: 10px;">';

      if (rootSections.length === 0) {
        html += '<div class="text-center py-4">لا توجد أقسام متاحة</div></div>';
        Swal.fire({
          title: 'درجات الأقسام',
          html: html,
          confirmButtonText: 'إغلاق',
          customClass: { popup: 'swal2-wide' },
        });
        return;
      }

      const rootSectionsObs = rootSections.map((rootSection) =>
        this.adminService.getSubSections(rootSection.id).pipe(
          catchError(() => of([])),
          switchMap((subSections) => {
            if (subSections.length > 0) {
              const scoresObs = subSections.map((sub) =>
                this.adminService
                  .getStudentScoreBySection(studentId, sub.id)
                  .pipe(catchError(() => of(0)))
              );
              return forkJoin(scoresObs).pipe(
                map((scores) => ({ rootSection, subSections, scores }))
              );
            } else {
              return this.adminService
                .getStudentScoreBySection(studentId, rootSection.id)
                .pipe(
                  map((score) => ({
                    rootSection,
                    subSections: [],
                    scores: [score],
                  }))
                );
            }
          })
        )
      );

      forkJoin(rootSectionsObs).subscribe((results) => {
        results.forEach(({ rootSection, subSections, scores }) => {
          const isAcademic = rootSection.type === 'academic';
          const bgColor = isAcademic ? 'bg-primary' : 'bg-success';
          const textColor = 'text-white';
          const icon = isAcademic ? 'bi-mortarboard-fill' : 'bi-brain';

          html += `<div class="card mb-4 shadow-sm border-0">
          <div class="card-header ${bgColor} ${textColor}">
            <h5 class="mb-0">
              <i class="bi ${icon} me-2"></i>${rootSection.name}
            </h5>
          </div>
          <div class="card-body">`;

          let totalScore = 0;

          if (subSections.length > 0) {
            subSections.forEach((sub, idx) => {
              const score = scores[idx];
              totalScore += score;
              html += `<div class="d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="fw-medium">${sub.name}</span>
              <span class="badge ${this.getScoreClass(
                score
              )} px-3 py-2">${score}</span>
            </div>`;
            });
          } else {
            totalScore = scores[0];
            html += `<div class="d-flex justify-content-between align-items-center py-2">
            <span class="fw-medium">الدرجة العامة</span>
            <span class="badge ${this.getScoreClass(
              totalScore
            )} px-3 py-2">${totalScore}</span>
          </div>`;
          }

          html += `<div class="d-flex justify-content-between align-items-center mt-3 border-top border-2 ${bgColor}">
          <span class="fw-bold ${textColor}">المجموع الكلي</span>
          <span class="badge ${bgColor} ${textColor} px-3 py-2">${totalScore}</span>
        </div>`;

          html += '</div></div>';
        });

        html += '</div>';
        Swal.fire({
          title: 'درجات الأقسام',
          html: html,
          confirmButtonText: 'إغلاق',
          customClass: { popup: 'swal2-wide' },
          width: '600px',
        });
      });
    });
  }

  // --- دوال عرض الإجابات ---
  loadSectionsAndQuestions(): void {
    this.adminService.getAllSections().subscribe((sections) => {
      this.sections = sections;
      sections.forEach((section) => {
        this.adminService
          .getQuestionsBySection(section.id)
          .subscribe((questions) => {
            questions.forEach((q) => {
              this.questionsMap[q.id] = q;
              q.choices.forEach((choice: any) => {
                this.choicesMap[choice.id] = choice;
              });
            });
          });
      });
    });
  }

  viewStudentAnswers(studentId: number): void {
    const student = this.students.find((u) => u.id === studentId);
    if (student) {
      this.selectedStudent = student;
      this.studentAnswers = [];
      this.sectionFinalScores = {};

      this.adminService.getStudentAnswers(studentId).subscribe({
        next: (answers) => {
          if (answers.length === 0) {
            Swal.fire(
              'لا توجد إجابات',
              'لم يقم هذا الطالب بأي تقييمات بعد',
              'info'
            );
            return;
          }

          const enrichedAnswers = answers.map((answer) =>
            this.enrichAnswer(answer, studentId)
          );

          Promise.all(enrichedAnswers).then((resolvedAnswers) => {
            this.studentAnswers = resolvedAnswers.filter(
              (a) => a !== null
            ) as EnrichedAnswer[];
          });
        },
        error: (err) => {
          console.error('فشل تحميل الإجابات', err);
          Swal.fire('خطأ', 'فشل تحميل إجابات الطالب', 'error');
        },
      });
    }
  }

  private async enrichAnswer(
    answer: any,
    studentId: number
  ): Promise<EnrichedAnswer | null> {
    try {
      const question = await this.getQuestionById(
        answer.questionId
      ).toPromise();
      if (!question || !question.sectionId) return null;

      const section = await this.getSectionById(question.sectionId).toPromise();
      if (!section) return null;

      const sectionKey = `${studentId}-${question.sectionId}`;
      if (this.sectionFinalScores[sectionKey] === undefined) {
        const score = await this.getSectionScore(
          studentId,
          question.sectionId
        ).toPromise();
        this.sectionFinalScores[sectionKey] = score ?? 0;
      }

      const choice = question.choices.find(
        (c: any) => c.id === answer.choiceId
      );

      return {
        questionId: answer.questionId,
        questionText: question.text,
        choiceId: answer.choiceId,
        choiceText: choice?.text || 'غير معروف',
        score: choice?.score || 0,
        sectionId: question.sectionId,
        sectionName: section.name,
        sectionFinalScore: this.sectionFinalScores[sectionKey] ?? 0,
        createdAt: answer.createdAt,
      };
    } catch (error) {
      console.error('خطأ في تعزيز الإجابة:', error);
      return null;
    }
  }

  private getQuestionById(questionId: number): Observable<any> {
    return this.adminService.getQuestionById(questionId).pipe(
      catchError(() => {
        console.error('فشل جلب تفاصيل السؤال:', questionId);
        return of(null);
      })
    );
  }

  private getSectionById(sectionId: number): Observable<any> {
    return this.adminService.getSection(sectionId).pipe(
      catchError(() => {
        console.error('فشل جلب تفاصيل القسم:', sectionId);
        return of(null);
      })
    );
  }

  private getSectionScore(
    studentId: number,
    sectionId: number
  ): Observable<number> {
    return this.adminService
      .getStudentScoreBySection(studentId, sectionId)
      .pipe(
        catchError((err) => {
          console.warn(
            `لا توجد إجابات للطالب ${studentId} في القسم ${sectionId}, سيتم اعتبار الدرجة 0.`
          );
          return of(0);
        })
      );
  }

  closeStudentDetails(): void {
    this.selectedStudent = null;
    this.studentAnswers = [];
  }
}
