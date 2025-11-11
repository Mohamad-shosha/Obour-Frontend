// src/app/pages/evaluation/evaluation-about/evaluation-about.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluation-about',
  templateUrl: './evaluation-about.component.html',
  styleUrls: ['./evaluation-about.component.scss'],
})
export class EvaluationAboutComponent {
  constructor(private router: Router) {}

  startEvaluation(): void {
    this.router.navigate(['/evaluation']);
  }
}
