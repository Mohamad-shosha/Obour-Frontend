import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { Section } from '../../../models/section.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  sections: Section[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections(): void {
    this.evaluationService.getRootSections().subscribe({
      next: (data) => {
        this.sections = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('فشل تحميل الأقسام', err);
        this.loading = false;

        const status = err.status || err.error?.status || 0;

        if (status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          Swal.fire({
            icon: 'warning',
            title: 'فشل التحميل',
            text: 'يجب تسجيل الدخول لمتابعة استخدام المنصة.',
            confirmButtonText: 'الذهاب إلى تسجيل الدخول',
            customClass: {
              confirmButton: 'btn btn-warning',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth']);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'فشل التحميل',
            text: 'يجب تسجيل الدخول لمتابعة استخدام المنصة.',
            confirmButtonText: 'الذهاب إلى تسجيل الدخول',
            customClass: {
              confirmButton: 'btn btn-danger',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/auth']);
            }
          });
        }
      },
    });
  }

  goToSection(sectionId: number): void {
    this.router.navigate(['/evaluation/sections', sectionId]);
  }

  getIconClass(type: string): string {
    return type === 'academic'
      ? 'fas fa-book-open fa-xl'
      : 'fas fa-brain fa-xl';
  }

  getButtonClass(type: string): string {
    return type === 'academic' ? 'btn-primary' : 'btn-success';
  }

  getItemsForSection(type: string): string[] {
    if (type === 'academic') {
      return [
        'إدارة المشروعات',
        'الإنشاءات والرسومات التنفيذية',
        'التصميم المعماري والداخلي',
        'وأكثر من ذلك...',
      ];
    }
    return [
      'إدارة الوقت',
      'التركيز والانتباه',
      'الثقة بالنفس',
      'وأكثر من ذلك...',
    ];
  }
}
