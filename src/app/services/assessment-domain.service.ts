import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssessmentDomain, AssessmentCategory, AssessmentTopic } from '../models/assessment-domain.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentDomainService {
  private apiUrl = 'http://localhost:8080/api/domains';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  getAllDomains(): Observable<AssessmentDomain[]> {
    return this.http.get<AssessmentDomain[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getDomainById(id: number): Observable<AssessmentDomain> {
    return this.http.get<AssessmentDomain>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getDomainBySlug(slug: string): Observable<AssessmentDomain> {
    return this.http.get<AssessmentDomain>(`${this.apiUrl}/slug/${slug}`, { headers: this.getAuthHeaders() });
  }

  getCategoriesByDomain(domainId: number): Observable<AssessmentCategory[]> {
    return this.http.get<AssessmentCategory[]>(`${this.apiUrl}/${domainId}/categories`, { headers: this.getAuthHeaders() });
  }

  getCategoryById(categoryId: number): Observable<AssessmentCategory> {
    return this.http.get<AssessmentCategory>(`${this.apiUrl}/categories/${categoryId}`, { headers: this.getAuthHeaders() });
  }

  getTopicsByCategory(categoryId: number): Observable<AssessmentTopic[]> {
    return this.http.get<AssessmentTopic[]>(`${this.apiUrl}/categories/${categoryId}/topics`, { headers: this.getAuthHeaders() });
  }
}
