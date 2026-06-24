import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent {
  navItems = [
    { icon: 'bi-grid-1x2', label: 'Dashboard', link: '/dashboard', active: true },
    { icon: 'bi-graph-up', label: 'Analytics', link: '/dashboard/analytics', active: false },
    { icon: 'bi-mortarboard', label: 'Academic Management', link: '/dashboard/academic', active: false },
    { icon: 'bi-person-check', label: 'Student Success', link: '/dashboard/success', active: false },
    { icon: 'bi-journal-text', label: 'Institutional Research', link: '/dashboard/research', active: false },
    { icon: 'bi-gear', label: 'Settings', link: '/dashboard/settings', active: false },
  ];
}
