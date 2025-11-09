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
        Swal.fire({
          icon: 'error',
          title: 'غير مسموح',
          text: 'برجاء تسجيل الدخول أولاً',
          confirmButtonText: 'حسناً',
        }).then(() => {
          this.router.navigate(['/auth']);
        });
      },
    });
  }

  goToSection(sectionId: number): void {
    this.router.navigate(['/evaluation/sections', sectionId]);
  }

  getIconClass(type: string): string {
    return type === 'academic' ? 'fas fa-book-open' : 'fas fa-brain';
  }

  getButtonClass(type: string): string {
    return type === 'academic' ? 'btn-primary' : 'btn-success';
  }

  // القوائم الثابتة (كما في التصميم)
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
