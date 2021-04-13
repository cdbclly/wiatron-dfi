import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImqmLineChartComponent } from './imqm-line-chart.component';

describe('ImqmLineChartComponent', () => {
  let component: ImqmLineChartComponent;
  let fixture: ComponentFixture<ImqmLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImqmLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImqmLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
