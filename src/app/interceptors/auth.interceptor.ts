import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // ⚠️ لا حاجة لـ AuthService هنا لأننا نستخدم localStorage مباشرةً

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('URL:', req.url);
    console.log('Is auth URL?', req.url.includes('/auth'));

    if (req.url.includes('/auth')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    console.log('Token found:', !!token); // سيطبع true/false

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      console.log('Authorization header added');
      return next.handle(authReq);
    }

    console.log('No token, sending without auth');
    return next.handle(req);
  }
}
