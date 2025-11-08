import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section } from '../models/section.model';
import { Question } from '../models/question.model';
import { SubmitAnswersRequest } from '../models/student-answer.model';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // أقسام
  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections`);
  }

  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.baseUrl}/sections/${id}`);
  }

  getRootSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections/root`);
  }

  getSubSections(parentId: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections/parent/${parentId}`);
  }

  // أسئلة
  getQuestionsBySection(sectionId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/section/${sectionId}`);
  }

  // إرسال إجابات
  submitAnswers(request: SubmitAnswersRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/student-answers/submit`, request);
  }

  getCurrentUser(): Observable<{ id: number; name: string; email: string; role: string }> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ id: number; name: string; email: string; role: string }>(
      `${this.baseUrl}/auth/me`,
      { headers }
    );
  }
}
