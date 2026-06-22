import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundShapesComponent } from './background-shapes.component';

describe('BackgroundShapesComponent', () => {
  let component: BackgroundShapesComponent;
  let fixture: ComponentFixture<BackgroundShapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackgroundShapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
