import { TestBed } from '@angular/core/testing';

import { WorkhourReportService } from './workhour-report.service';

describe('WorkhourReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkhourReportService = TestBed.get(WorkhourReportService);
    expect(service).toBeTruthy();
  });
});
 