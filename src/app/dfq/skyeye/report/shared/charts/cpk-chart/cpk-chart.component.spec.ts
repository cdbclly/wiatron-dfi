import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpkChartComponent } from './cpk-chart.component';

describe('CpkChartComponent', () => {
  let component: CpkChartComponent;
  let fixture: ComponentFixture<CpkChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpkChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
