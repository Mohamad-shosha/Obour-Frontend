// src/app/shared/components/progress-circle/progress-circle.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
})
export class ProgressCircleComponent {
  @Input() percentage: number = 0;
  @Input() size: number = 120;
  @Input() strokeWidth: number = 8;
  @Input() color: string = 'auto'; // 'auto' أو لون HEX/RGB مخصص

  // حسابات الدائرة
  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get offset(): number {
    return this.circumference - (this.percentage / 100) * this.circumference;
  }

  // تحديد اللون تلقائيًا
  getDisplayColor(): string {
    if (this.color !== 'auto') {
      return this.color;
    }
    if (this.percentage >= 80) return '#10b981';
    if (this.percentage >= 60) return '#3b82f6';
    if (this.percentage >= 40) return '#f59e0b';
    return '#ef4444';
  }
}
