// src/app/shared/components/footer/footer.component.ts
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('fadeInOut', [
      state('true', style({ opacity: 1, transform: 'scale(1)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition('false <=> true', animate('300ms ease-in-out')),
    ]),
  ],
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  showScrollTop: boolean = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Show scroll to top button when user scrolls down
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showScrollTop = scrollPosition > 300;
  }

  ngOnInit(): void {
    // Initialize scroll position check
    this.onWindowScroll();
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
