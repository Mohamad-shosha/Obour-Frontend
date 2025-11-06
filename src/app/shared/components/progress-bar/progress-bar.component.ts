// src/app/shared/components/progress-bar/progress-bar.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  @Input() label: string = '';
  @Input() percentage: number = 0;
  @Input() color: string = ''; // لون مخصص (اختياري)

  // دالة لتحديد لون الشريط تلقائيًا بناءً على النسبة
  getBarColor(): string {
    if (this.color) {
      return this.color;
    }
    if (this.percentage >= 80) return 'bg-success'; // أخضر
    if (this.percentage >= 60) return 'bg-primary'; // أزرق
    if (this.percentage >= 40) return 'bg-warning'; // أصفر/برتقالي
    return 'bg-danger'; // أحمر
  }
}
