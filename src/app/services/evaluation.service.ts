import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Section } from '../models/section.model';
import { Question } from '../models/question.model';
import { SubmitAnswersRequest } from '../models/student-answer.model'; // ✅ الاستيراد الصحيح

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

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
    return this.http.get<Section[]>(
      `${this.baseUrl}/sections/parent/${parentId}`
    );
  }

  getQuestionsBySection(sectionId: number): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.baseUrl}/questions/section/${sectionId}`
    );
  }

  // ✅ الدالة المحدّثة
  submitAnswers(request: SubmitAnswersRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/student-answers/submit`, request);
  }
}
