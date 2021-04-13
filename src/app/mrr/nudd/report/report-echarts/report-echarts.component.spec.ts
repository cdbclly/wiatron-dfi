import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEchartsComponent } from './report-echarts.component';

describe('ReportEchartsComponent', () => {
  let component: ReportEchartsComponent;
  let fixture: ComponentFixture<ReportEchartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportEchartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportEchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
