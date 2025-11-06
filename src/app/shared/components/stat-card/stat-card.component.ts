// src/app/shared/components/stat-card/stat-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() iconPath: string = '';
  @Input() color: 'blue' | 'green' | 'orange' | 'purple' = 'blue';
  @Input() description: string = '';

  // الآن تُرجع اسم فئة CSS مخصصة
  getGradientClass(): string {
    return `gradient-${this.color}`;
  }
}
