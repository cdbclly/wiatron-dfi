import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetryRateChartComponent } from './retry-rate-chart.component';

describe('RetryRateChartComponent', () => {
  let component: RetryRateChartComponent;
  let fixture: ComponentFixture<RetryRateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetryRateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetryRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
