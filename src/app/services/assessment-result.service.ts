import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentResult } from '../models/assessment-result.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentResultService {
  private apiUrl = 'http://localhost:8080/api/results';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  getResultBySession(sessionId: number): Observable<AssessmentResult> {
    return this.http.get<AssessmentResult>(`${this.apiUrl}/${sessionId}`, { headers: this.getAuthHeaders() });
  }

  getResultsByUser(userId: number): Observable<AssessmentResult[]> {
    return this.http.get<AssessmentResult[]>(`${this.apiUrl}/user/${userId}`, { headers: this.getAuthHeaders() });
  }
}
