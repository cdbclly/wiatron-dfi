import { TestBed } from '@angular/core/testing';

import { MrrDocReportService } from './mrr-doc-report.service';

describe('MrrDocReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MrrDocReportService = TestBed.get(MrrDocReportService);
    expect(service).toBeTruthy();
  });
});
