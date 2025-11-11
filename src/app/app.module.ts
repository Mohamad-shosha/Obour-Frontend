// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    EvaluationComponent,
    DashboardComponent,
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
export class AppModule {}
