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

// تعريف المسارات
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // الصفحة الافتراضية
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'auth', component: AuthComponent, data: { mode: 'login' } },
  { path: 'evaluation', component: CategoriesComponent },
  { path: 'evaluation/results', component: EvaluationComponent },
  { path: 'evaluation/sections/:sectionId', component: QuizSelectionComponent },
  { path: 'evaluation/test/:sectionId', component: QuizTestComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  {
    path: 'evaluation/about',
    component: EvaluationAboutComponent,
  },
  { path: '**', redirectTo: '/home' }, // صفحة خطأ 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
