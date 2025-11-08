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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // تأكد إن التوكن موجود بعد تسجيل الدخول
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  getSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections`, { headers: this.getAuthHeaders() });
  }

  getSection(id: number): Observable<Section> {
    return this.http.get<Section>(`${this.baseUrl}/sections/${id}`, { headers: this.getAuthHeaders() });
  }

  getRootSections(): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections/root`, { headers: this.getAuthHeaders() });
  }

  getSubSections(parentId: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.baseUrl}/sections/parent/${parentId}`, { headers: this.getAuthHeaders() });
  }

  getQuestionsBySection(sectionId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.baseUrl}/questions/section/${sectionId}`, { headers: this.getAuthHeaders() });
  }

  submitAnswers(request: SubmitAnswersRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/student-answers/submit`, request, { headers: this.getAuthHeaders() });
  }

getCurrentUser(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/auth/me`, { headers: this.getAuthHeaders() });
}
}
