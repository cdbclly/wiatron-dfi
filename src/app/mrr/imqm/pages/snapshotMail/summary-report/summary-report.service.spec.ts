import { TestBed } from '@angular/core/testing';

import { SummaryReportService } from './summary-report.service';

describe('SummaryReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummaryReportService = TestBed.get(SummaryReportService);
    expect(service).toBeTruthy();
  });
});
