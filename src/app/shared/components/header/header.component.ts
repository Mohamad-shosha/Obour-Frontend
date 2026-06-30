import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentPage: string = 'home';
  isMenuOpen = false;
  isScrolled = false;
  user: any = null;
  menuItems: { id: string; label: string; icon: string }[] = [];

  isDark$ = this.themeService.isDark$;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

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

    // تكوين القائمة ديناميكيًا حسب الدور
    this.buildMenu();
  }

  private buildMenu(): void {
    const baseItems = [
      { id: 'home', label: 'الرئيسية', icon: 'fa-solid fa-house' },
      { id: 'about', label: 'عن المنصة', icon: 'fa-solid fa-circle-info' },
      {
        id: 'about-evaluation',
        label: 'تقييم الجاهزية',
        icon: 'fa-solid fa-graduation-cap',
      },
    ];

    if (this.user && this.user.role === 'TEACHER') {
      // قائمة المعلم
      this.menuItems = [
        ...baseItems,
        {
          id: 'admin-dashboard',
          label: 'لوحة التحكم الإدارية',
          icon: 'fa-solid fa-gear',
        },
      ];
    } else {
      // قائمة الطالب (أو الزائر)
      this.menuItems = [
        ...baseItems,
        {
          id: 'evaluation-results',
          label: 'لوحة المعلومات',
          icon: 'fa-solid fa-chart-line',
        },
        {
          id: 'start-evaluation',
          label: 'ابدأ التقييم الآن',
          icon: 'fa-solid fa-play',
        },
      ];
    }
  }

  onNavigate(pageId: string, mode?: 'login' | 'register'): void {
    if (pageId === 'auth') {
      if (mode) {
        sessionStorage.setItem('authMode', mode);
      }
      this.router.navigate(['/auth']);
    } else if (pageId === 'start-evaluation') {
      this.router.navigate(['/evaluation']);
    } else if (pageId === 'about-evaluation') {
      this.router.navigate(['/evaluation/about']);
    } else if (pageId === 'admin-dashboard') {
      this.router.navigate(['/admin/dashboard']);
    } else if (pageId === 'evaluation-results') {
      this.router.navigate(['/evaluation/results']);
    } else {
      this.router.navigate([`/${pageId}`]);
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
