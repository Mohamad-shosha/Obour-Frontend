import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentDomainService } from '../../../services/assessment-domain.service';
import { AssessmentDomain } from '../../../models/assessment-domain.model';

@Component({
  selector: 'app-domain-categories',
  template: `
    <div class="domain-categories-page min-vh-100 py-5" dir="rtl" *ngIf="domain">
      <div class="container">
        <!-- Header -->
        <div class="d-flex align-items-center mb-5 gap-3">
          <button class="btn btn-light rounded-circle shadow-sm" style="width: 45px; height: 45px;" (click)="goBack()">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <div>
            <h1 class="fs-3 fw-bold mb-1">{{ domain.nameAr || domain.name }}</h1>
            <p class="text-muted mb-0">{{ domain.descriptionAr || domain.description }}</p>
          </div>
        </div>

        <!-- Categories & Topics -->
        <div class="row g-4">
          <div class="col-12 col-md-6 col-lg-4" *ngFor="let category of domain.categories">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden" style="background: var(--obour-surface);">
              <div class="card-body p-4 d-flex flex-column">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <div class="icon-circle bg-primary-soft text-primary d-flex align-items-center justify-content-center rounded" style="width: 48px; height: 48px; font-size: 1.25rem;">
                    <i [class]="category.icon || 'fa-solid fa-folder'"></i>
                  </div>
                  <h3 class="fs-5 fw-bold mb-0">{{ category.nameAr || category.name }}</h3>
                </div>
                
                <p class="text-muted small mb-4 flex-grow-1">{{ category.description }}</p>

                <h4 class="fs-6 fw-bold mb-3" *ngIf="category.topics && category.topics.length">المواضيع الفرعية</h4>
                <div class="d-flex flex-wrap gap-2 mb-4" *ngIf="category.topics && category.topics.length">
                  <span class="badge bg-light text-dark border px-3 py-2 rounded-pill fw-normal" *ngFor="let topic of category.topics">
                    {{ topic.nameAr || topic.name }}
                  </span>
                </div>

                <button class="btn btn-primary w-100 rounded-pill py-2.5 mt-auto fw-bold" (click)="startAssessment(category.id)">
                  بدء تقييم {{ category.nameAr || category.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="domain.categories?.length === 0" class="text-center py-5">
           <i class="fa-solid fa-inbox text-muted fs-1 mb-3"></i>
           <p class="text-muted fs-5">لا توجد تصنيفات تحت هذا المجال حالياً.</p>
        </div>
      </div>
    </div>
  `
})
export class DomainCategoriesComponent implements OnInit {
  domain: AssessmentDomain | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domainService: AssessmentDomainService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('domainId');
      if (id) {
        this.loadDomain(Number(id));
      }
    });
  }

  loadDomain(id: number) {
    this.domainService.getDomainById(id).subscribe({
      next: (data) => this.domain = data,
      error: (err) => console.error('Error loading domain', err)
    });
  }

  goBack() {
    this.router.navigate(['/evaluation']);
  }

  startAssessment(categoryId: number) {
    // Navigate to start component with template mapping. For now assume categoryId = templateId for simplicity
    // In a real app we'd fetch templates and select one. Let's just pass templateId = categoryId.
    this.router.navigate(['/evaluation/start', categoryId]);
  }
}
