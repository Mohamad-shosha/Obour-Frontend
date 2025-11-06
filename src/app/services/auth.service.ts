// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(
    this.getUserFromStorage()
  );
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      name,
      email,
      password,
      role,
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            this.currentUserSubject.next(response.user);
          }
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- هذا السطر تم تغييره من private إلى public ---
  public getUserFromStorage(): any {
    const userJson = localStorage.getItem('user');
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
      return null;
    }

    try {
      return JSON.parse(userJson);
    } catch {
      console.warn(
        '⚠️ بيانات المستخدم في التخزين المحلي غير صالحة. سيتم حذفها.'
      );
      localStorage.removeItem('user');
      return null;
    }
  }

  // --------------------------------------------------
}
