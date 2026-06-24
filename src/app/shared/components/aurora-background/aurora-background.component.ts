import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-aurora-background',
  templateUrl: './aurora-background.component.html',
  styleUrls: ['./aurora-background.component.scss']
})
export class AuroraBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('auroraMesh', { static: true }) auroraMesh!: ElementRef;
  @ViewChild('auroraOrb', { static: true }) auroraOrb!: ElementRef;
  @ViewChild('particles', { static: true }) particles!: ElementRef;

  private animations: gsap.core.Tween[] = [];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initAuroraAnimations();
  }

  ngOnDestroy(): void {
    this.animations.forEach(anim => anim.kill());
  }

  private initAuroraAnimations(): void {
    // Layer 1: Aurora Mesh (Slow morphing background)
    const meshAnim = gsap.to(this.auroraMesh.nativeElement, {
      backgroundPosition: '200% center',
      ease: 'none',
      duration: 30,
      repeat: -1,
      yoyo: true
    });
    this.animations.push(meshAnim);

    // Layer 3: 3D Orb (Floating and pulsing)
    const orbAnimY = gsap.to(this.auroraOrb.nativeElement, {
      y: -30,
      ease: 'sine.inOut',
      duration: 4,
      repeat: -1,
      yoyo: true
    });
    const orbAnimScale = gsap.to(this.auroraOrb.nativeElement, {
      scale: 1.05,
      ease: 'sine.inOut',
      duration: 5,
      repeat: -1,
      yoyo: true
    });
    this.animations.push(orbAnimY, orbAnimScale);
  }
}
