// src/app/pages/reports/reports.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  // حالة الفلتر
  selectedFilter: string = 'all';

  // بيانات الجامعات
  universities = [
    { name: 'جامعة الملك سعود', students: 1250, avg: 87, trend: '+5%' },
    { name: 'جامعة الملك عبدالعزيز', students: 1180, avg: 85, trend: '+3%' },
    { name: 'جامعة الإمام محمد بن سعود', students: 980, avg: 83, trend: '+7%' },
    { name: 'جامعة الملك فهد للبترول', students: 850, avg: 89, trend: '+4%' },
    { name: 'جامعة الأميرة نورة', students: 1420, avg: 86, trend: '+6%' },
  ];

  // بيانات التخصصات
  specializations = [
    { name: 'هندسة البرمجيات', count: 450, readiness: 88, color: 'bg-primary' },
    { name: 'إدارة الأعمال', count: 380, readiness: 82, color: 'bg-success' },
    { name: 'الطب البشري', count: 320, readiness: 90, color: 'bg-danger' },
    { name: 'الهندسة المدنية', count: 290, readiness: 84, color: 'bg-warning' },
    { name: 'علوم الحاسب', count: 410, readiness: 87, color: 'bg-purple' },
    { name: 'التسويق الرقمي', count: 270, readiness: 81, color: 'bg-pink' },
  ];

  // بيانات التقارير
  reports = [
    {
      title: 'تقرير الأداء الشهري - يونيو 2024',
      date: '2024/06/30',
      type: 'شهري',
      status: 'جاهز',
      size: '2.4 MB',
    },
    {
      title: 'تحليل الجاهزية حسب التخصصات',
      date: '2024/06/25',
      type: 'تحليلي',
      status: 'جاهز',
      size: '1.8 MB',
    },
    {
      title: 'مقارنة الأداء بين الجامعات',
      date: '2024/06/20',
      type: 'مقارن',
      status: 'جاهز',
      size: '3.1 MB',
    },
    {
      title: 'تقرير التقدم الربع سنوي',
      date: '2024/06/15',
      type: 'ربع سنوي',
      status: 'جاهز',
      size: '4.2 MB',
    },
  ];

  // دالة لمعالجة تغيير الفلتر (بسيطة جدًا الآن)
  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter = target.value;
    // في تطبيق حقيقي، هنا ستنفذ منطق فلترة البيانات
  }
}
