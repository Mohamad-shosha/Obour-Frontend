import { Component } from '@angular/core';

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.scss']
})
export class SupervisorDashboardComponent {
  // Mock data for the dashboard
  kpis = {
    avgPerformance: 84.2,
    performanceTrend: '+2.4%',
    atRiskCount: 14,
    atRiskChange: -3,
    completionCurrent: 62,
    completionTotal: 98
  };

  atRiskStudents = [
    { name: 'Elena Rodriguez', email: 'e.rodriguez@univ.edu', cohort: 'Data Science B (Evening)', riskScore: 8.4, riskLevel: 'High', lastActivity: '4 days ago', avatar: 'assets/images/elena.jpg' },
    { name: 'Marcus Thorne', email: 'm.thorne@univ.edu', cohort: 'Cybersecurity II (Full-time)', riskScore: 5.2, riskLevel: 'Medium', lastActivity: 'Today, 10:42 AM', avatar: 'assets/images/marcus.jpg' },
    { name: 'Lina Park', email: 'l.park@univ.edu', cohort: 'Creative Tech (Hybrid)', riskScore: 7.9, riskLevel: 'High', lastActivity: '7 days ago', avatar: 'assets/images/lina.jpg' }
  ];
}
