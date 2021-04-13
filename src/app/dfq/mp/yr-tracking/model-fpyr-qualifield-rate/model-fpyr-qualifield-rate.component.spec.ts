import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFpyrQualifieldRateComponent } from './model-fpyr-qualifield-rate.component';

describe('YrTrackingDashboardComponent', () => {
  let component: ModelFpyrQualifieldRateComponent;
  let fixture: ComponentFixture<ModelFpyrQualifieldRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelFpyrQualifieldRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFpyrQualifieldRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
