import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentSession, StartSessionRequest, SaveAnswerRequest } from '../models/assessment-session.model';
import { AssessmentResult } from '../models/assessment-result.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentSessionService {
  private apiUrl = 'http://localhost:8080/api/sessions';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  startSession(request: StartSessionRequest): Observable<AssessmentSession> {
    return this.http.post<AssessmentSession>(`${this.apiUrl}/start`, request, { headers: this.getAuthHeaders() });
  }

  saveAnswer(sessionId: number, request: SaveAnswerRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${sessionId}/answer`, request, { headers: this.getAuthHeaders() });
  }

  submitAssessment(sessionId: number): Observable<AssessmentResult> {
    return this.http.put<AssessmentResult>(`${this.apiUrl}/${sessionId}/submit`, {}, { headers: this.getAuthHeaders() });
  }
}
