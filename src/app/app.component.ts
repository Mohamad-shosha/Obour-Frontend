import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hideHeaderFooter = false;

  constructor(private router: Router) {
    // متابعة تغيير المسار
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // نخفي Header/Footer للصفحة الخاصة بالـ Admin Dashboard فقط
        this.hideHeaderFooter =
          event.urlAfterRedirects.includes('admin/dashboard');
      }
    });
  }
}
