// src/app/shared/components/header/header.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentPage: string = 'home';
  isMenuOpen = false;
  user: any = null;

  menuItems = [
    { id: 'home', label: 'الرئيسية', icon: 'fa-solid fa-house' },
    {
      id: 'evaluation',
      label: 'تقييم الجاهزية',
      icon: 'fa-solid fa-graduation-cap',
    },
    {
      id: 'dashboard',
      label: 'لوحة المعلومات',
      icon: 'fa-solid fa-chart-line',
    },
    {
      id: 'reports',
      label: 'التقارير والتحليلات',
      icon: 'fa-solid fa-file-lines',
    },
    { id: 'about', label: 'عن المنصة', icon: 'fa-solid fa-circle-info' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.updateUserState();
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.currentPage = this.router.url.split('/')[1] || 'home';
        this.updateUserState();
      });
  }

  private updateUserState(): void {
    this.user = this.authService.getUserFromStorage();

    // --- عرض الـ Token في وحدة التحكم ---
    const token = this.authService.getToken();
    if (token) {
      console.log('✅ JWT Token:', token);
      console.log('👤 المستخدم الحالي:', this.user);
    } else {
      console.log('ℹ️ لا يوجد مستخدم مسجل حاليًا');
    }
    // ----------------------------------
  }

  onNavigate(pageId: string, mode?: 'login' | 'register'): void {
    if (pageId === 'auth') {
      // حفظ الحالة في sessionStorage مؤقتًا
      if (mode) {
        sessionStorage.setItem('authMode', mode);
      }
      this.router.navigate(['/auth']);
    } else {
      this.router.navigate([pageId]);
    }
    this.isMenuOpen = false;
  }

  onLogout(): void {
    Swal.fire({
      title: 'تم تسجيل الخروج',
      text: 'تم تسجيل خروجك من المنصة بنجاح.',
      icon: 'success',
      confirmButtonText: 'موافق',
      confirmButtonColor: '#3b82f6',
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      console.log('🚪 تم تسجيل الخروج');
      this.authService.logout();
      this.user = null;
      this.router.navigate(['/home']);
    });
  }
}
