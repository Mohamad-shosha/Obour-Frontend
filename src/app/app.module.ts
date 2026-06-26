// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { AboutComponent } from './pages/about/about.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { StatCardComponent } from './shared/components/stat-card/stat-card.component';
import { ProgressBarComponent } from './shared/components/progress-bar/progress-bar.component';
import { ProgressCircleComponent } from './shared/components/progress-circle/progress-circle.component';
import { ChartCardComponent } from './shared/components/chart-card/chart-card.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { CategoriesComponent } from './pages/evaluation/categories/categories.component';
import { QuizSelectionComponent } from './pages/evaluation/quiz-selection/quiz-selection.component';
import { QuizTestComponent } from './pages/evaluation/quiz-test/quiz-test.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { EvaluationAboutComponent } from './pages/evaluation/evaluation-about/evaluation-about.component';
import { DomainCategoriesComponent } from './pages/evaluation/domain-categories/domain-categories.component';
import { AssessmentStartComponent } from './pages/evaluation/assessment-start/assessment-start.component';
import { AssessmentEngineComponent } from './pages/evaluation/assessment-engine/assessment-engine.component';
import { AssessmentResultsComponent } from './pages/evaluation/assessment-results/assessment-results.component';
import { BackgroundShapesComponent } from './shared/components/background-shapes/background-shapes.component';
import { DashboardLayoutComponent } from './shared/components/dashboard-layout/dashboard-layout.component';
import { DashboardSidebarComponent } from './shared/components/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardHeaderComponent } from './shared/components/dashboard-header/dashboard-header.component';
import { SupervisorDashboardComponent } from './pages/supervisor-dashboard/supervisor-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    EvaluationComponent,
    AboutComponent,
    FooterComponent,
    StatCardComponent,
    ProgressBarComponent,
    ProgressCircleComponent,
    ChartCardComponent,
    AuthComponent,
    CategoriesComponent,
    QuizSelectionComponent,
    QuizTestComponent,
    AdminDashboardComponent,
    EvaluationAboutComponent,
    DomainCategoriesComponent,
    AssessmentStartComponent,
    AssessmentEngineComponent,
    AssessmentResultsComponent,
    BackgroundShapesComponent,
    DashboardLayoutComponent,
    DashboardSidebarComponent,
    DashboardHeaderComponent,
    SupervisorDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
