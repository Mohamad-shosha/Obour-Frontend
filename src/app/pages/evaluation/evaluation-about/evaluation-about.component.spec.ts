import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationAboutComponent } from './evaluation-about.component';

describe('EvaluationAboutComponent', () => {
  let component: EvaluationAboutComponent;
  let fixture: ComponentFixture<EvaluationAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationAboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
