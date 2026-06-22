import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly STORAGE_KEY = 'obour-theme';
  private readonly htmlEl = document.documentElement;

  private _isDark$ = new BehaviorSubject<boolean>(false);
  readonly isDark$ = this._isDark$.asObservable();

  get isDark(): boolean {
    return this._isDark$.value;
  }

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    let prefersDark = false;

    if (saved) {
      prefersDark = saved === 'dark';
    } else {
      // Respect OS preference on first visit
      prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  toggleTheme(): void {
    this.applyTheme(this.isDark ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const isDark = theme === 'dark';
    this._isDark$.next(isDark);

    if (isDark) {
      this.renderer.setAttribute(this.htmlEl, 'data-theme', 'dark');
    } else {
      this.renderer.removeAttribute(this.htmlEl, 'data-theme');
    }

    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
