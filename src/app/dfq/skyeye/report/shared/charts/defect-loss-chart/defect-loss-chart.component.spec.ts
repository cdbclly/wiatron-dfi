import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectLossChartComponent } from './defect-loss-chart.component';

describe('DefectLossChartComponent', () => {
  let component: DefectLossChartComponent;
  let fixture: ComponentFixture<DefectLossChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefectLossChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectLossChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
