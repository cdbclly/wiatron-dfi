import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineYieldRateComparisonComponent } from './line-yield-rate-comparison.component';

describe('YrTrackingDetailsComponent', () => {
  let component: LineYieldRateComparisonComponent;
  let fixture: ComponentFixture<LineYieldRateComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineYieldRateComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineYieldRateComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
