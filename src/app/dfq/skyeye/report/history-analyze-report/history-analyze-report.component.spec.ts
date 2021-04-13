import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAnalyzeReportComponent } from './history-analyze-report.component';

describe('HistoryAnalyzeReportComponent', () => {
  let component: HistoryAnalyzeReportComponent;
  let fixture: ComponentFixture<HistoryAnalyzeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryAnalyzeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryAnalyzeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
