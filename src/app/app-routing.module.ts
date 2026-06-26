// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// استيراد جميع مكونات الصفحات
import { HomeComponent } from './pages/home/home.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthComponent } from './pages/auth/auth.component';
import { CategoriesComponent } from './pages/evaluation/categories/categories.component';
import { QuizSelectionComponent } from './pages/evaluation/quiz-selection/quiz-selection.component';
import { QuizTestComponent } from './pages/evaluation/quiz-test/quiz-test.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EvaluationAboutComponent } from './pages/evaluation/evaluation-about/evaluation-about.component';
import { DashboardLayoutComponent } from './shared/components/dashboard-layout/dashboard-layout.component';
import { SupervisorDashboardComponent } from './pages/supervisor-dashboard/supervisor-dashboard.component';

// New Evaluation Expansion Components
import { DomainCategoriesComponent } from './pages/evaluation/domain-categories/domain-categories.component';
import { AssessmentStartComponent } from './pages/evaluation/assessment-start/assessment-start.component';
import { AssessmentEngineComponent } from './pages/evaluation/assessment-engine/assessment-engine.component';
import { AssessmentResultsComponent } from './pages/evaluation/assessment-results/assessment-results.component';
import { AssessmentGuard } from './shared/guards/assessment.guard';

// تعريف المسارات
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent, data: { mode: 'login', hideFooter: true } },
  { path: 'evaluation', component: CategoriesComponent },
  { path: 'evaluation/domains/:domainId', component: DomainCategoriesComponent },
  { path: 'evaluation/start/:templateId', component: AssessmentStartComponent },
  { path: 'evaluation/engine/:sessionId', component: AssessmentEngineComponent, data: { hideFooter: true, hideHeader: true }, canDeactivate: [AssessmentGuard] },
  { path: 'evaluation/results/:sessionId', component: AssessmentResultsComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, data: { hideHeader: true, hideFooter: true } },
  { path: 'evaluation/about', component: EvaluationAboutComponent },
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: SupervisorDashboardComponent },
      // Add other dashboard views here later (Analytics, Settings, etc.)
    ]
  },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
