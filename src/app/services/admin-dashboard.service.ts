import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // --- إدارة المستخدمين ---
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/students`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users/teachers`, {
      headers: this.getAuthHeaders(),
    });
  }

  // --- تحليل الإجابات ---
  getStudentAnswers(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/student-answers/student/${studentId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // --- حساب الدرجات ---
  getStudentScore(studentId: number): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/student-answers/score/${studentId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getSection(sectionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sections/${sectionId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getStudentScoreBySection(
    studentId: number,
    sectionId: number
  ): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/student-answers/score/${studentId}/section/${sectionId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // --- دعم عرض البيانات ---
  getAllSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sections/root`, {
      headers: this.getAuthHeaders(),
    });
  }

  getQuestionsBySection(sectionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/questions/section/${sectionId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  getQuestionById(questionId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/questions/${questionId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
