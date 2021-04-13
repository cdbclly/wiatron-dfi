import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieYieldRateComparisonComponent } from './pie-yield-rate-comparison.component';

describe('YrTrackingDetailsComponent', () => {
  let component: PieYieldRateComparisonComponent;
  let fixture: ComponentFixture<PieYieldRateComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieYieldRateComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieYieldRateComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
