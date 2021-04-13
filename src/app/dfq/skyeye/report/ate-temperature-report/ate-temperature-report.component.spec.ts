import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AteTemperatureReportComponent } from './ate-temperature-report.component';

describe('AteTemperatureReportComponent', () => {
  let component: AteTemperatureReportComponent;
  let fixture: ComponentFixture<AteTemperatureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AteTemperatureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AteTemperatureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
