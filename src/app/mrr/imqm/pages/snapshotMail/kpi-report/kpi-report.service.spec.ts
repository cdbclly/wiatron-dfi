import { TestBed } from '@angular/core/testing';

import { KpiReportService } from './kpi-report.service';

describe('KpiReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KpiReportService = TestBed.get(KpiReportService);
    expect(service).toBeTruthy();
  });
});
