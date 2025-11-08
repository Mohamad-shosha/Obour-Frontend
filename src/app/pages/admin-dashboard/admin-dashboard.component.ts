import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  selectedStudent: any = null;
  studentAnswers: any[] = [];
  sections: any[] = [];
  questionsMap: { [key: number]: any } = {};
  choicesMap: { [key: number]: any } = {};

  constructor(
    private adminService: AdminDashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // التحقق من أن المستخدم معلم
    const currentUser = this.authService.getUserFromStorage();
    if (!currentUser || currentUser.role !== 'TEACHER') {
      Swal.fire('غير مصرح', 'هذه الصفحة مخصصة للمعلمين فقط', 'error');
      this.router.navigate(['/evaluation']);
      return;
    }

    this.fetchUsers();
    this.loadSectionsAndQuestions();
  }

  fetchUsers(): void {
    this.adminService.getStudents().subscribe({
      next: (students) => {
        const studentsWithScores = students.map((student) => ({
          ...student,
          score: null,
        }));

        studentsWithScores.forEach((student) => {
          this.adminService.getStudentScore(student.id).subscribe((score) => {
            student.score = score;
          });
        });

        this.users = studentsWithScores;
      },
      error: (err) => {
        console.error('فشل تحميل الطلاب', err);
        Swal.fire('خطأ', 'فشل تحميل قائمة الطلاب', 'error');
      },
    });
  }

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
    const student = this.users.find((u) => u.id === studentId);
    this.selectedStudent = student;

    this.adminService.getStudentAnswers(studentId).subscribe({
      next: (answers) => {
        this.studentAnswers = answers;
      },
      error: (err) => {
        console.error('فشل تحميل الإجابات', err);
        Swal.fire('خطأ', 'فشل تحميل إجابات الطالب', 'error');
      },
    });
  }

  closeStudentDetails(): void {
    this.selectedStudent = null;
    this.studentAnswers = [];
  }

  // دوال العرض
  getRoleLabel(role: string): string {
    return role === 'TEACHER' ? 'معلم' : 'طالب';
  }

  getRoleClass(role: string): string {
    return role === 'TEACHER' ? 'badge bg-primary' : 'badge bg-success';
  }

  getScoreClass(score: number): string {
    if (score === null) return 'badge bg-secondary';
    if (score >= 80) return 'badge bg-success';
    if (score >= 70) return 'badge bg-warning';
    return 'badge bg-danger';
  }

  getQuestionSectionId(questionId: number): number {
    const question = this.questionsMap[questionId];
    return question ? question.sectionId : 0;
  }

  getSectionName(sectionId: number): string {
    const section = this.sections.find((s) => s.id === sectionId);
    return section ? section.name : 'قسم غير معروف';
  }

  getQuestionText(questionId: number): string {
    const question = this.questionsMap[questionId];
    return question ? question.text : 'نص السؤال غير متوفر';
  }

  getChoiceText(choiceId: number): string {
    const choice = this.choicesMap[choiceId];
    return choice ? choice.text : 'خيار غير معروف';
  }

  getChoiceScore(choiceId: number): number {
    const choice = this.choicesMap[choiceId];
    return choice ? choice.score : 0;
  }
}
