import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { Section } from '../../../models/section.model';

@Component({
  selector: 'app-quiz-selection',
  templateUrl: './quiz-selection.component.html',
  styleUrls: ['./quiz-selection.component.scss'],
})
export class QuizSelectionComponent implements OnInit {
  parentId!: number;
  parentSection!: Section;
  subSections: Section[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.parentId = Number(this.route.snapshot.paramMap.get('sectionId'));
    this.loadParentSection();
    this.loadSubSections();
  }

  loadParentSection(): void {
    this.evaluationService.getSection(this.parentId).subscribe({
      next: (section) => {
        this.parentSection = section;
      },
      error: (err) => {
        console.error('فشل تحميل القسم الرئيسي', err);
      },
    });
  }

  loadSubSections(): void {
    this.evaluationService.getSubSections(this.parentId).subscribe({
      next: (data) => {
        this.subSections = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('فشل تحميل الاختبارات', err);
        this.error = 'فشل تحميل الاختبارات. حاول لاحقًا.';
        this.loading = false;
      },
    });
  }

  startQuiz(sectionId: number): void {
    this.router.navigate(['/evaluation/test', sectionId]);
  }

  goBack(): void {
    this.router.navigate(['/evaluation']);
  }

  getIconClass(type: string): string {
    return type === 'academic' ? 'fas fa-book-open' : 'fas fa-brain';
  }

  getButtonClass(type: string): string {
    return type === 'academic' ? 'btn-primary' : 'btn-success';
  }
}
