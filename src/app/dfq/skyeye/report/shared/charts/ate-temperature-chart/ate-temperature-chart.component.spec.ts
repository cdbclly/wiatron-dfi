import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AteTemperatureChartComponent } from './ate-temperature-chart.component';

describe('AteTemperatureChartComponent', () => {
  let component: AteTemperatureChartComponent;
  let fixture: ComponentFixture<AteTemperatureChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AteTemperatureChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AteTemperatureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
