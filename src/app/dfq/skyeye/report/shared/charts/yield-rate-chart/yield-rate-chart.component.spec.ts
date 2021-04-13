import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldRateChartComponent } from './yield-rate-chart.component';

describe('YieldRateChartComponent', () => {
  let component: YieldRateChartComponent;
  let fixture: ComponentFixture<YieldRateChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldRateChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldRateChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
